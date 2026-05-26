<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\ActivityLogService;
use App\Services\SessionNoShowService;
use App\Services\WorkflowCaseService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('activity-logs:backfill', function () {
    $created = app(ActivityLogService::class)->backfill();
    $this->info("Backfill completed. {$created} activity events created.");
})->purpose('Populate unified activity logs from existing audits and domain events.');

Schedule::call(fn () => app(SessionNoShowService::class)->process())
    ->everyMinute()
    ->name('workflow:process-session-no-shows');

Schedule::call(fn () => app(WorkflowCaseService::class)->processSlaBreaches())
    ->everyFiveMinutes()
    ->name('workflow:process-sla-breaches');
