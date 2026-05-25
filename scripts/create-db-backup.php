<?php

declare(strict_types=1);

function loadEnvFile(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException("Env file not found: {$path}");
    }

    $values = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lines === false) {
        throw new RuntimeException("Unable to read env file: {$path}");
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);

        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }

        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim($value);

        if ($value !== '' && (
            (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))
        )) {
            $value = substr($value, 1, -1);
        }

        $values[$key] = $value;
    }

    return $values;
}

function normalizeHost(string $host): string
{
    $trimmed = trim($host);

    if ($trimmed === '' || $trimmed === 'db') {
        return '127.0.0.1';
    }

    return $trimmed;
}

function normalizePort(string $host, string $port): string
{
    if ($host === 'db' && ($port === '' || $port === '3306')) {
        return '3307';
    }

    return $port !== '' ? $port : '3306';
}

function quoteValue(PDO $pdo, mixed $value): string
{
    if ($value === null) {
        return 'NULL';
    }

    if (is_bool($value)) {
        return $value ? '1' : '0';
    }

    if (is_int($value) || is_float($value)) {
        return (string) $value;
    }

    $quoted = $pdo->quote((string) $value);

    if ($quoted === false) {
        throw new RuntimeException('Failed to quote SQL value.');
    }

    return $quoted;
}

function buildMergeSafeSql(PDO $pdo, string $database): string
{
    $sql = [];
    $sql[] = "-- WellnessConnect merge-safe backup";
    $sql[] = "-- Generated at " . gmdate('c');
    $sql[] = "-- Source database: {$database}";
    $sql[] = "SET NAMES utf8mb4;";
    $sql[] = "SET FOREIGN_KEY_CHECKS=0;";
    $sql[] = "";

    $tables = $pdo->query('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"')->fetchAll(PDO::FETCH_NUM);

    if (!is_array($tables)) {
        throw new RuntimeException('Unable to fetch table list.');
    }

    foreach ($tables as $tableRow) {
        $tableName = (string) ($tableRow[0] ?? '');

        if ($tableName === '') {
            continue;
        }

        $createStatement = $pdo->query("SHOW CREATE TABLE `{$tableName}`")->fetch(PDO::FETCH_ASSOC);

        if (!is_array($createStatement) || !isset($createStatement['Create Table'])) {
            throw new RuntimeException("Unable to fetch schema for table {$tableName}");
        }

        $createSql = preg_replace('/^CREATE TABLE/i', 'CREATE TABLE IF NOT EXISTS', (string) $createStatement['Create Table'], 1);
        $sql[] = "-- Table: {$tableName}";
        $sql[] = $createSql . ';';

        $rows = $pdo->query("SELECT * FROM `{$tableName}`", PDO::FETCH_ASSOC);

        if ($rows === false) {
            throw new RuntimeException("Unable to query rows for table {$tableName}");
        }

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $columns = array_map(
                static fn (string $column): string => "`{$column}`",
                array_keys($row)
            );

            $values = array_map(
                static fn (mixed $value): string => quoteValue($pdo, $value),
                array_values($row)
            );

            $sql[] = sprintf(
                'INSERT IGNORE INTO `%s` (%s) VALUES (%s);',
                $tableName,
                implode(', ', $columns),
                implode(', ', $values)
            );
        }

        $sql[] = '';
    }

    $sql[] = 'SET FOREIGN_KEY_CHECKS=1;';
    $sql[] = '';

    return implode(PHP_EOL, $sql);
}

$repoRoot = dirname(__DIR__);
$env = loadEnvFile($repoRoot . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . '.env');

$dbName = $env['DB_DATABASE'] ?? 'wellness_connect';
$originalHost = $env['DB_HOST'] ?? '127.0.0.1';
$host = normalizeHost($originalHost);
$port = normalizePort($originalHost, $env['DB_PORT'] ?? '3306');
$user = $env['DB_USERNAME'] ?? '';
$password = $env['DB_PASSWORD'] ?? '';

$dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $dbName);
$pdo = new PDO($dsn, $user, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$plainSql = buildMergeSafeSql($pdo, $dbName);
$timestamp = date('Y-m-d_H-i');
$backupDir = $repoRoot . DIRECTORY_SEPARATOR . 'database_backups';
$baseName = sprintf('%s_%s_merge', $dbName, $timestamp);
$plainPath = $backupDir . DIRECTORY_SEPARATOR . $baseName . '.sql';
$encPath = $backupDir . DIRECTORY_SEPARATOR . $baseName . '.sql.enc';
$keyPath = $backupDir . DIRECTORY_SEPARATOR . $baseName . '.key';

file_put_contents($plainPath, $plainSql);

$key = random_bytes(32);
$iv = random_bytes(16);
$ciphertext = openssl_encrypt($plainSql, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);

if ($ciphertext === false) {
    throw new RuntimeException('Unable to encrypt backup payload.');
}

$payload = json_encode([
    'algorithm' => 'aes-256-cbc',
    'iv' => base64_encode($iv),
    'ciphertext' => base64_encode($ciphertext),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

if ($payload === false) {
    throw new RuntimeException('Unable to encode encrypted backup payload.');
}

file_put_contents($encPath, $payload);
file_put_contents($keyPath, base64_encode($key));

echo "Created plaintext backup: {$plainPath}" . PHP_EOL;
echo "Created encrypted backup: {$encPath}" . PHP_EOL;
echo "Created local key file: {$keyPath}" . PHP_EOL;

