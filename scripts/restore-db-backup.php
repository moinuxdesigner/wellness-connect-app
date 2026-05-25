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

function splitSqlStatements(string $sql): array
{
    $statements = [];
    $buffer = '';
    $length = strlen($sql);
    $inSingle = false;
    $inDouble = false;
    $escape = false;

    for ($index = 0; $index < $length; $index++) {
        $char = $sql[$index];
        $buffer .= $char;

        if ($escape) {
            $escape = false;
            continue;
        }

        if ($char === '\\') {
            $escape = true;
            continue;
        }

        if ($char === "'" && !$inDouble) {
            $inSingle = !$inSingle;
            continue;
        }

        if ($char === '"' && !$inSingle) {
            $inDouble = !$inDouble;
            continue;
        }

        if ($char === ';' && !$inSingle && !$inDouble) {
            $statement = trim($buffer);

            if ($statement !== '') {
                $statements[] = $statement;
            }

            $buffer = '';
        }
    }

    $tail = trim($buffer);

    if ($tail !== '') {
        $statements[] = $tail;
    }

    return $statements;
}

if ($argc < 2) {
    fwrite(STDERR, "Usage: php scripts/restore-db-backup.php <path-to-sql.enc> [path-to-key]" . PHP_EOL);
    exit(1);
}

$repoRoot = dirname(__DIR__);
$backupPath = $argv[1];
$keyPath = $argv[2] ?? preg_replace('/\.sql\.enc$/', '.key', $backupPath);

if (!is_file($backupPath)) {
    throw new RuntimeException("Backup file not found: {$backupPath}");
}

if (!is_string($keyPath) || !is_file($keyPath)) {
    throw new RuntimeException("Key file not found: {$keyPath}");
}

$payload = json_decode((string) file_get_contents($backupPath), true, 512, JSON_THROW_ON_ERROR);
$key = base64_decode(trim((string) file_get_contents($keyPath)), true);
$iv = base64_decode((string) ($payload['iv'] ?? ''), true);
$ciphertext = base64_decode((string) ($payload['ciphertext'] ?? ''), true);

if ($key === false || $iv === false || $ciphertext === false) {
    throw new RuntimeException('Unable to decode encrypted backup payload.');
}

$sql = openssl_decrypt($ciphertext, (string) ($payload['algorithm'] ?? 'aes-256-cbc'), $key, OPENSSL_RAW_DATA, $iv);

if ($sql === false) {
    throw new RuntimeException('Unable to decrypt backup payload.');
}

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
]);

$statements = splitSqlStatements($sql);

$pdo->beginTransaction();

try {
    foreach ($statements as $statement) {
        $trimmed = trim($statement);

        if ($trimmed === '' || str_starts_with($trimmed, '--')) {
            continue;
        }

        $pdo->exec($statement);
    }

    $pdo->commit();
} catch (Throwable $throwable) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $throwable;
}

echo "Merged backup into local database: {$backupPath}" . PHP_EOL;

