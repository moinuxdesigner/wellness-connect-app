param(
    [string]$WorkspaceRoot = (Get-Location).Path,
    [string]$ProjectRoot = (Get-Location).Path,
    [string]$SqlPath = 'C:\Users\MOIN SHAIK\Downloads\wellness_connect office 530 PM.sql',
    [string]$ActiveDatabase = 'wellness_connect',
    [string]$OfficeDatabase = 'office_backup_compare',
    [string]$Timestamp = '20260529_205610'
)

$ErrorActionPreference = 'Stop'

function Get-EnvMap {
    param([string]$Path)

    $map = @{}
    foreach ($line in Get-Content $Path) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith('#')) {
            continue
        }

        $parts = $line -split '=', 2
        if ($parts.Count -ne 2) {
            continue
        }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        $map[$key] = $value
    }

    return $map
}

function Invoke-DockerQuery {
    param(
        [string]$Query,
        [string]$Database = ''
    )

    $args = @('compose', 'exec', '-T', 'db', 'mariadb', '-uroot', "-p$script:DbRootPassword", '-Nse', $Query)
    if ($Database) {
        $args += $Database
    }

    $result = & docker @args
    if ($LASTEXITCODE -ne 0) {
        throw "MariaDB query failed: $Query"
    }

    return $result
}

function Export-SchemaDump {
    param(
        [string]$Database,
        [string]$OutputPath
    )

    $args = @(
        'compose', 'exec', '-T', 'db', 'mariadb-dump',
        '-uroot', "-p$script:DbRootPassword",
        '--no-data', '--routines', '--triggers', '--events',
        $Database
    )

    $dump = & docker @args
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace(($dump -join ''))) {
        throw "Schema export failed for database '$Database'."
    }

    [System.IO.File]::WriteAllText($OutputPath, ($dump -join [Environment]::NewLine), [System.Text.Encoding]::ASCII)
}

function Normalize-SqlDump {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )

    $content = Get-Content $InputPath -Raw
    $patterns = @(
        '(?m)^--.*\r?\n?',
        '(?m)^/\*![0-9]{5} SET .*?;\r?\n?',
        '(?m)^SET SQL_MODE = .*?;\r?\n?',
        '(?m)^START TRANSACTION;\r?\n?',
        '(?m)^COMMIT;\r?\n?',
        '(?m)^SET time_zone = .*?;\r?\n?',
        '(?m)^LOCK TABLES .*?;\r?\n?',
        '(?m)^UNLOCK TABLES;\r?\n?',
        '(?m)^/\*M!999999\\- enable the sandbox mode \*/\s*\r?\n?'
    )

    foreach ($pattern in $patterns) {
        $content = [regex]::Replace($content, $pattern, '')
    }

    $content = [regex]::Replace($content, ' AUTO_INCREMENT=\d+', '')
    $content = [regex]::Replace($content, '\r?\n{3,}', "`r`n`r`n")
    [System.IO.File]::WriteAllText($OutputPath, $content.Trim() + [Environment]::NewLine, [System.Text.Encoding]::ASCII)
}

function Get-TableList {
    param([string]$Database)

    return @(Invoke-DockerQuery -Query "SELECT table_name FROM information_schema.tables WHERE table_schema='$Database' ORDER BY table_name;")
}

function Get-RowCount {
    param(
        [string]$Database,
        [string]$Table
    )

    $escapedTable = $Table.Replace('`', '``')
    $query = 'SELECT COUNT(*) FROM `{0}`;' -f $escapedTable
    $result = @(Invoke-DockerQuery -Query $query -Database $Database)
    return [int64]$result[0]
}

function Get-ColumnMetadata {
    param([string]$Database)

    $query = @"
SELECT table_name,
       column_name,
       column_type,
       is_nullable,
       IFNULL(column_default, '<NULL>'),
       extra,
       column_key
FROM information_schema.columns
WHERE table_schema='$Database'
ORDER BY table_name, ordinal_position;
"@

    $lines = @(Invoke-DockerQuery -Query $query)
    $map = @{}
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $parts = $line -split "`t"
        $key = '{0}.{1}' -f $parts[0], $parts[1]
        $map[$key] = [ordered]@{
            table_name     = $parts[0]
            column_name    = $parts[1]
            column_type    = $parts[2]
            is_nullable    = $parts[3]
            column_default = $parts[4]
            extra          = $parts[5]
            column_key     = $parts[6]
        }
    }

    return $map
}

function Get-IndexMetadata {
    param([string]$Database)

    $query = @"
SELECT table_name,
       index_name,
       non_unique,
       seq_in_index,
       column_name,
       IFNULL(sub_part, ''),
       index_type
FROM information_schema.statistics
WHERE table_schema='$Database'
ORDER BY table_name, index_name, seq_in_index;
"@

    $lines = @(Invoke-DockerQuery -Query $query)
    $map = @{}
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $parts = $line -split "`t"
        $key = '{0}.{1}.{2}' -f $parts[0], $parts[1], $parts[3]
        $map[$key] = [ordered]@{
            table_name  = $parts[0]
            index_name  = $parts[1]
            non_unique  = $parts[2]
            seq_in_index = $parts[3]
            column_name = $parts[4]
            sub_part    = $parts[5]
            index_type  = $parts[6]
        }
    }

    return $map
}

function Get-ForeignKeyMetadata {
    param([string]$Database)

    $query = @"
SELECT kcu.table_name,
       kcu.constraint_name,
       kcu.column_name,
       kcu.referenced_table_name,
       kcu.referenced_column_name,
       rc.update_rule,
       rc.delete_rule
FROM information_schema.key_column_usage kcu
JOIN information_schema.referential_constraints rc
  ON rc.constraint_schema = kcu.constraint_schema
 AND rc.constraint_name = kcu.constraint_name
WHERE kcu.table_schema='$Database'
  AND kcu.referenced_table_name IS NOT NULL
ORDER BY kcu.table_name, kcu.constraint_name, kcu.ordinal_position;
"@

    $lines = @(Invoke-DockerQuery -Query $query)
    $map = @{}
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $parts = $line -split "`t"
        $key = '{0}.{1}.{2}' -f $parts[0], $parts[1], $parts[2]
        $map[$key] = [ordered]@{
            table_name             = $parts[0]
            constraint_name        = $parts[1]
            column_name            = $parts[2]
            referenced_table_name  = $parts[3]
            referenced_column_name = $parts[4]
            update_rule            = $parts[5]
            delete_rule            = $parts[6]
        }
    }

    return $map
}

function Get-MigrationNames {
    param([string]$Database)

    $query = "SELECT migration FROM migrations ORDER BY migration;"
    return @(Invoke-DockerQuery -Query $query -Database $Database)
}

function Get-PrimaryKeyColumns {
    param(
        [string]$Database,
        [string]$Table
    )

    $query = @"
SELECT kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
 AND tc.table_schema = kcu.table_schema
 AND tc.table_name = kcu.table_name
WHERE tc.table_schema = '$Database'
  AND tc.table_name = '$Table'
  AND tc.constraint_type = 'PRIMARY KEY'
ORDER BY kcu.ordinal_position;
"@

    return @(Invoke-DockerQuery -Query $query)
}

function Get-ImportantTableSummary {
    param(
        [string]$Database,
        [string]$Table
    )

    $columns = @(Invoke-DockerQuery -Query "SELECT column_name FROM information_schema.columns WHERE table_schema='$Database' AND table_name='$Table' ORDER BY ordinal_position;")
    if (-not $columns) {
        return $null
    }

    $pkColumns = @(Get-PrimaryKeyColumns -Database $Database -Table $Table)
    $hasUpdatedAt = $columns -contains 'updated_at'
    $hasCreatedAt = $columns -contains 'created_at'
    $selectParts = @("COUNT(*) AS row_count")

    if ($pkColumns.Count -eq 1) {
        $pk = $pkColumns[0]
        $selectParts += ('MIN(`{0}`) AS min_pk' -f $pk)
        $selectParts += ('MAX(`{0}`) AS max_pk' -f $pk)
    }

    if ($hasUpdatedAt) {
        $selectParts += "MAX(updated_at) AS max_updated_at"
    }

    if ($hasCreatedAt) {
        $selectParts += "MAX(created_at) AS max_created_at"
    }

    $query = "SELECT {0} FROM ``{1}``;" -f ($selectParts -join ', '), $Table.Replace('`', '``')
    $line = @((Invoke-DockerQuery -Query $query -Database $Database))[0]
    $parts = $line -split "`t"
    $result = [ordered]@{ row_count = $parts[0] }
    $index = 1

    if ($pkColumns.Count -eq 1) {
        $result.min_pk = $parts[$index]
        $result.max_pk = $parts[$index + 1]
        $index += 2
    }

    if ($hasUpdatedAt) {
        $result.max_updated_at = $parts[$index]
        $index += 1
    }

    if ($hasCreatedAt) {
        $result.max_created_at = $parts[$index]
    }

    return $result
}

function New-MarkdownList {
    param([System.Collections.IEnumerable]$Items)

    $list = @($Items)
    if ($list.Count -eq 0) {
        return '- None'
    }

    return ($list | ForEach-Object { "- $_" }) -join [Environment]::NewLine
}

$envMap = Get-EnvMap -Path (Join-Path $ProjectRoot 'backend\.env')
$script:DbRootPassword = $envMap['DB_ROOT_PASSWORD']
if (-not $script:DbRootPassword) {
    throw 'DB_ROOT_PASSWORD was not found in backend\.env.'
}

$reportsDir = Join-Path $WorkspaceRoot 'database_backups'
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null

$homeSchemaPath = Join-Path $reportsDir "home_schema_before_compare_$Timestamp.sql"
$officeSchemaPath = Join-Path $reportsDir "office_schema_from_backup_compare_$Timestamp.sql"
$homeSchemaNormalizedPath = Join-Path $reportsDir "home_schema_before_compare_${Timestamp}_normalized.sql"
$officeSchemaNormalizedPath = Join-Path $reportsDir "office_schema_from_backup_compare_${Timestamp}_normalized.sql"
$migrationReportPath = Join-Path $reportsDir 'migration_comparison_report.md'
$schemaReportPath = Join-Path $reportsDir 'schema_diff_report.md'
$schemaPatchPath = Join-Path $reportsDir 'schema_diff.patch'
$rowCountReportPath = Join-Path $reportsDir 'table_row_count_comparison.md'
$recommendationPath = Join-Path $reportsDir 'database_compare_final_recommendation.md'
$riskReportPath = Join-Path $reportsDir 'sql_risk_report.md'
$importantTablesReportPath = Join-Path $reportsDir 'important_table_summary.md'
$schemaSyncPath = Join-Path $reportsDir 'proposed_schema_sync.sql'
$dataSyncPath = Join-Path $reportsDir 'proposed_data_sync.sql'
$migrateStatusPath = Join-Path $reportsDir 'artisan_migrate_status.txt'

Export-SchemaDump -Database $ActiveDatabase -OutputPath $homeSchemaPath
Export-SchemaDump -Database $OfficeDatabase -OutputPath $officeSchemaPath
Normalize-SqlDump -InputPath $homeSchemaPath -OutputPath $homeSchemaNormalizedPath
Normalize-SqlDump -InputPath $officeSchemaPath -OutputPath $officeSchemaNormalizedPath

$riskPatterns = [ordered]@{
    'CREATE DATABASE'         = '^\s*CREATE\s+DATABASE\b'
    'USE database_name'       = '^\s*USE\s+'
    'DROP TABLE'              = '\bDROP\s+TABLE\b'
    'CREATE TABLE'            = '\bCREATE\s+TABLE\b'
    'INSERT INTO'             = '\bINSERT\s+INTO\b'
    'ALTER TABLE'             = '\bALTER\s+TABLE\b'
    'DELETE FROM'             = '\bDELETE\s+FROM\b'
    'TRUNCATE'                = '\bTRUNCATE\b'
    'ALTER TABLE DROP COLUMN' = '\bALTER\s+TABLE\b[\s\S]{0,200}\bDROP\s+COLUMN\b'
}

$riskLines = @('# SQL Risk Report', '', ('Source file: `{0}`' -f $SqlPath), '')
$destructiveHits = @()
foreach ($label in $riskPatterns.Keys) {
    $count = @(Select-String -Path $SqlPath -Pattern $riskPatterns[$label] -CaseSensitive:$false).Count
    $riskLines += ('- {0}: {1}' -f $label, $count)
    if ($label -in @('DROP TABLE', 'DELETE FROM', 'TRUNCATE', 'ALTER TABLE DROP COLUMN') -and $count -gt 0) {
        $destructiveHits += ('{0} ({1})' -f $label, $count)
    }
}

$riskLines += ''
if ($destructiveHits.Count -gt 0) {
    $riskLines += 'Warning: destructive statements were detected in the office SQL dump.'
    $riskLines += ($destructiveHits | ForEach-Object { "- $_" })
} else {
    $riskLines += 'Warning: no destructive DROP/TRUNCATE/DELETE/DROP COLUMN statements were detected in the office SQL dump.'
}
[System.IO.File]::WriteAllText($riskReportPath, ($riskLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$migrateStatus = & docker compose exec -T app php artisan migrate:status
if ($LASTEXITCODE -ne 0) {
    throw 'php artisan migrate:status failed.'
}
[System.IO.File]::WriteAllText($migrateStatusPath, ($migrateStatus -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$homeMigrations = @(Get-MigrationNames -Database $ActiveDatabase)
$officeMigrations = @(Get-MigrationNames -Database $OfficeDatabase)
$homeOnlyMigrations = @($homeMigrations | Where-Object { $_ -and $_ -notin $officeMigrations })
$officeOnlyMigrations = @($officeMigrations | Where-Object { $_ -and $_ -notin $homeMigrations })

$migrationDirection = 'Schemas look equivalent by migration inventory.'
if ($homeOnlyMigrations.Count -gt 0 -and $officeOnlyMigrations.Count -eq 0) {
    $migrationDirection = 'Home appears newer by migration inventory.'
} elseif ($officeOnlyMigrations.Count -gt 0 -and $homeOnlyMigrations.Count -eq 0) {
    $migrationDirection = 'Office backup appears newer by migration inventory.'
} elseif ($officeOnlyMigrations.Count -gt 0 -and $homeOnlyMigrations.Count -gt 0) {
    $migrationDirection = 'Home and office diverged by migration inventory.'
}

$migrationLines = @(
    '# Migration Comparison Report',
    '',
    ('Active database: `{0}`' -f $ActiveDatabase),
    ('Office comparison database: `{0}`' -f $OfficeDatabase),
    '',
    '## Laravel migrate:status',
    '```text',
    ($migrateStatus -join [Environment]::NewLine),
    '```',
    '',
    '## Present in home but missing in office',
    (New-MarkdownList -Items $homeOnlyMigrations),
    '',
    '## Present in office but missing in home',
    (New-MarkdownList -Items $officeOnlyMigrations),
    '',
    "## Summary`r`n$migrationDirection"
)
[System.IO.File]::WriteAllText($migrationReportPath, ($migrationLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$homeTables = @(Get-TableList -Database $ActiveDatabase)
$officeTables = @(Get-TableList -Database $OfficeDatabase)
$homeOnlyTables = @($homeTables | Where-Object { $_ -and $_ -notin $officeTables })
$officeOnlyTables = @($officeTables | Where-Object { $_ -and $_ -notin $homeTables })
$commonTables = @($homeTables | Where-Object { $_ -and $_ -in $officeTables })

$homeColumns = Get-ColumnMetadata -Database $ActiveDatabase
$officeColumns = Get-ColumnMetadata -Database $OfficeDatabase
$allColumnKeys = @($homeColumns.Keys + $officeColumns.Keys | Sort-Object -Unique)
$columnDiffs = New-Object System.Collections.Generic.List[string]
$dangerousSchemaDiffs = New-Object System.Collections.Generic.List[string]

foreach ($key in $allColumnKeys) {
    $inHome = $homeColumns.ContainsKey($key)
    $inOffice = $officeColumns.ContainsKey($key)

    if ($inHome -and -not $inOffice) {
        $columnDiffs.Add("$key exists only in home.")
        $dangerousSchemaDiffs.Add("Office is missing column $key.")
        continue
    }

    if ($inOffice -and -not $inHome) {
        $columnDiffs.Add("$key exists only in office.")
        continue
    }

    $homeSig = '{0}|{1}|{2}|{3}|{4}' -f $homeColumns[$key].column_type, $homeColumns[$key].is_nullable, $homeColumns[$key].column_default, $homeColumns[$key].extra, $homeColumns[$key].column_key
    $officeSig = '{0}|{1}|{2}|{3}|{4}' -f $officeColumns[$key].column_type, $officeColumns[$key].is_nullable, $officeColumns[$key].column_default, $officeColumns[$key].extra, $officeColumns[$key].column_key

    if ($homeSig -ne $officeSig) {
        $columnDiffs.Add("$key differs. Home=[$homeSig] Office=[$officeSig]")
    }
}

$homeIndexes = Get-IndexMetadata -Database $ActiveDatabase
$officeIndexes = Get-IndexMetadata -Database $OfficeDatabase
$allIndexKeys = @($homeIndexes.Keys + $officeIndexes.Keys | Sort-Object -Unique)
$indexDiffs = New-Object System.Collections.Generic.List[string]

foreach ($key in $allIndexKeys) {
    $inHome = $homeIndexes.ContainsKey($key)
    $inOffice = $officeIndexes.ContainsKey($key)

    if ($inHome -and -not $inOffice) {
        $indexDiffs.Add("$key exists only in home.")
        continue
    }

    if ($inOffice -and -not $inHome) {
        $indexDiffs.Add("$key exists only in office.")
        continue
    }

    $homeSig = '{0}|{1}|{2}|{3}' -f $homeIndexes[$key].non_unique, $homeIndexes[$key].column_name, $homeIndexes[$key].sub_part, $homeIndexes[$key].index_type
    $officeSig = '{0}|{1}|{2}|{3}' -f $officeIndexes[$key].non_unique, $officeIndexes[$key].column_name, $officeIndexes[$key].sub_part, $officeIndexes[$key].index_type

    if ($homeSig -ne $officeSig) {
        $indexDiffs.Add("$key differs. Home=[$homeSig] Office=[$officeSig]")
    }
}

$homeFks = Get-ForeignKeyMetadata -Database $ActiveDatabase
$officeFks = Get-ForeignKeyMetadata -Database $OfficeDatabase
$allFkKeys = @($homeFks.Keys + $officeFks.Keys | Sort-Object -Unique)
$fkDiffs = New-Object System.Collections.Generic.List[string]

foreach ($key in $allFkKeys) {
    $inHome = $homeFks.ContainsKey($key)
    $inOffice = $officeFks.ContainsKey($key)

    if ($inHome -and -not $inOffice) {
        $fkDiffs.Add("$key exists only in home.")
        continue
    }

    if ($inOffice -and -not $inHome) {
        $fkDiffs.Add("$key exists only in office.")
        continue
    }

    $homeSig = '{0}|{1}|{2}|{3}|{4}' -f $homeFks[$key].referenced_table_name, $homeFks[$key].referenced_column_name, $homeFks[$key].update_rule, $homeFks[$key].delete_rule, $homeFks[$key].constraint_name
    $officeSig = '{0}|{1}|{2}|{3}|{4}' -f $officeFks[$key].referenced_table_name, $officeFks[$key].referenced_column_name, $officeFks[$key].update_rule, $officeFks[$key].delete_rule, $officeFks[$key].constraint_name

    if ($homeSig -ne $officeSig) {
        $fkDiffs.Add("$key differs. Home=[$homeSig] Office=[$officeSig]")
    }
}

$diffOutput = & git diff --no-index -- $homeSchemaNormalizedPath $officeSchemaNormalizedPath
$diffExitCode = $LASTEXITCODE
if ($diffExitCode -gt 1) {
    throw 'Schema diff generation failed.'
}
[System.IO.File]::WriteAllText($schemaPatchPath, ($diffOutput -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

foreach ($table in $homeOnlyTables) {
    $dangerousSchemaDiffs.Add("Office is missing table $table.")
}

$schemaLines = @(
    '# Schema Diff Report',
    '',
    ('Home schema file: `{0}`' -f $homeSchemaPath),
    ('Office schema file: `{0}`' -f $officeSchemaPath),
    '',
    '## Tables only in home',
    (New-MarkdownList -Items $homeOnlyTables),
    '',
    '## Tables only in office backup',
    (New-MarkdownList -Items $officeOnlyTables),
    '',
    '## Column differences',
    (New-MarkdownList -Items $columnDiffs),
    '',
    '## Index differences',
    (New-MarkdownList -Items $indexDiffs),
    '',
    '## Foreign key differences',
    (New-MarkdownList -Items $fkDiffs),
    '',
    '## Dangerous differences',
    (New-MarkdownList -Items $dangerousSchemaDiffs),
    '',
    ('Patch file: `{0}`' -f $schemaPatchPath)
)
[System.IO.File]::WriteAllText($schemaReportPath, ($schemaLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$rowCountEntries = New-Object System.Collections.Generic.List[object]
foreach ($table in ($homeTables + $officeTables | Sort-Object -Unique)) {
    if (-not $table) { continue }
    $homeCount = if ($table -in $homeTables) { Get-RowCount -Database $ActiveDatabase -Table $table } else { 0 }
    $officeCount = if ($table -in $officeTables) { Get-RowCount -Database $OfficeDatabase -Table $table } else { 0 }
    $rowCountEntries.Add([pscustomobject]@{
        table_name   = $table
        home_rows    = $homeCount
        office_rows  = $officeCount
        difference   = ($officeCount - $homeCount)
    })
}

$rowLines = @(
    '# Table Row Count Comparison',
    '',
    '| Table | Home Row Count | Office Row Count | Difference (Office - Home) |',
    '| --- | ---: | ---: | ---: |'
)
foreach ($entry in $rowCountEntries | Sort-Object table_name) {
    $rowLines += "| $($entry.table_name) | $($entry.home_rows) | $($entry.office_rows) | $($entry.difference) |"
}
[System.IO.File]::WriteAllText($rowCountReportPath, ($rowLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$preferredImportantTables = @(
    'users',
    'clients',
    'trainers',
    'appointments',
    'sessions',
    'memberships',
    'membership_plans',
    'payments',
    'notifications',
    'roles',
    'permissions',
    'settings',
    'client_profiles',
    'practitioners',
    'membership_payments',
    'membership_subscriptions',
    'trainer_applications',
    'wellness_packages',
    'workflow_configs'
)

$availableImportantTables = @($preferredImportantTables | Where-Object { $_ -in $homeTables -or $_ -in $officeTables } | Select-Object -Unique)
$importantLines = @(
    '# Important Table Summary',
    '',
    '| Table | Database | Row Count | Min PK | Max PK | Max updated_at | Max created_at |',
    '| --- | --- | ---: | --- | --- | --- | --- |'
)

foreach ($table in $availableImportantTables) {
    foreach ($databaseLabel in @(
        [pscustomobject]@{ Name = 'home'; Database = $ActiveDatabase },
        [pscustomobject]@{ Name = 'office'; Database = $OfficeDatabase }
    )) {
        $tableExists = ($databaseLabel.Name -eq 'home' -and $table -in $homeTables) -or ($databaseLabel.Name -eq 'office' -and $table -in $officeTables)
        if (-not $tableExists) {
            continue
        }

        $summary = Get-ImportantTableSummary -Database $databaseLabel.Database -Table $table
        $importantLines += "| $table | $($databaseLabel.Name) | $($summary.row_count) | $($summary.min_pk) | $($summary.max_pk) | $($summary.max_updated_at) | $($summary.max_created_at) |"
    }
}
[System.IO.File]::WriteAllText($importantTablesReportPath, ($importantLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

$schemaNeedsUpdate = ($diffExitCode -eq 1)
$dataDifferences = @($rowCountEntries | Where-Object { $_.difference -ne 0 })
$dataNeedsUpdate = ($dataDifferences.Count -gt 0)
$dangerousDifferenceFound = ($dangerousSchemaDiffs.Count -gt 0 -or $destructiveHits.Count -gt 0)

$recommendation = 'A. No import/update needed'
if ($homeOnlyMigrations.Count -gt 0 -and -not $schemaNeedsUpdate -and -not $dataNeedsUpdate) {
    $recommendation = 'B. Only Laravel migrations need to be run'
} elseif ($dangerousDifferenceFound -and ($schemaNeedsUpdate -or $dataNeedsUpdate)) {
    $recommendation = 'E. Unsafe to auto-merge because schemas/data conflict'
} elseif ($schemaNeedsUpdate -and -not $dangerousDifferenceFound -and -not $dataNeedsUpdate) {
    $recommendation = 'B. Only Laravel migrations need to be run'
} elseif ($dataNeedsUpdate -and -not $schemaNeedsUpdate) {
    $recommendation = 'D. Selected data tables can be synced, but needs manual review'
} elseif ($schemaNeedsUpdate -or $dataNeedsUpdate) {
    $recommendation = 'D. Selected data tables can be synced, but needs manual review'
}

$recommendationLines = @(
    '# Database Compare Final Recommendation',
    '',
    "Recommendation: $recommendation",
    '',
    '## Why',
    "- Migration comparison: $migrationDirection",
    "- Schema differences present: $schemaNeedsUpdate",
    "- Row count differences present: $dataNeedsUpdate",
    "- Destructive SQL detected in office dump: $([bool]($destructiveHits.Count -gt 0))",
    "- Dangerous schema differences present: $([bool]($dangerousSchemaDiffs.Count -gt 0))",
    '',
    '## Notes',
    '- Active home database was not modified beyond backup/export operations.',
    '- Office SQL was imported only into the isolated comparison database.',
    '- Review the schema patch and row-count report before any manual sync decision.'
)
[System.IO.File]::WriteAllText($recommendationPath, ($recommendationLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)

if ($schemaNeedsUpdate) {
    $schemaSyncLines = @(
        '-- Proposed schema sync script for manual review only.',
        '-- Non-destructive changes are preferred.',
        '-- Destructive statements are intentionally commented out.',
        'START TRANSACTION;',
        '',
        '-- Review the generated schema diff patch before applying anything.',
        "-- Patch reference: $schemaPatchPath",
        ''
    )

    foreach ($table in $officeOnlyTables) {
        $schemaSyncLines += "-- Table exists only in office backup. Review whether to create it in home: $table"
    }

    foreach ($item in $columnDiffs) {
        $schemaSyncLines += "-- Column diff: $item"
    }

    foreach ($item in $dangerousSchemaDiffs) {
        $schemaSyncLines += "-- Potentially destructive difference: $item"
    }

    $schemaSyncLines += ''
    $schemaSyncLines += '-- COMMIT after replacing comments with reviewed SQL statements.'
    $schemaSyncLines += 'COMMIT;'

    [System.IO.File]::WriteAllText($schemaSyncPath, ($schemaSyncLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)
}

if ($dataNeedsUpdate) {
    $dataSyncLines = @(
        '-- Proposed data sync script for manual review only.',
        '-- Inserts and upserts should be reviewed table by table.',
        '-- No DELETE, TRUNCATE, or DROP statements are included.',
        'START TRANSACTION;',
        ''
    )

    foreach ($item in $dataDifferences | Sort-Object table_name) {
        $dataSyncLines += "-- Table $($item.table_name): home_rows=$($item.home_rows), office_rows=$($item.office_rows), delta=$($item.difference)"
        $dataSyncLines += "-- Example review pattern:"
        $dataSyncLines += "-- INSERT INTO $($item.table_name) (...) VALUES (...)"
        $dataSyncLines += "-- ON DUPLICATE KEY UPDATE ...;"
        $dataSyncLines += ''
    }

    $dataSyncLines += '-- COMMIT only after replacing comments with reviewed SQL statements.'
    $dataSyncLines += 'COMMIT;'

    [System.IO.File]::WriteAllText($dataSyncPath, ($dataSyncLines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.Encoding]::ASCII)
}
