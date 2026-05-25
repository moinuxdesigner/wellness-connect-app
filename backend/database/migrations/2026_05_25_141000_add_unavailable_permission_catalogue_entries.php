<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $permissions = [
            ['key' => 'admin.workflows.manage', 'module' => 'Workflow Configuration', 'label' => 'Configure workflows', 'action' => 'manage', 'sort_order' => 111],
            ['key' => 'admin.performance.view', 'module' => 'Performance Dashboard', 'label' => 'View performance', 'action' => 'view', 'sort_order' => 112],
            ['key' => 'admin.health.view', 'module' => 'Platform Health', 'label' => 'View health', 'action' => 'view', 'sort_order' => 113],
            ['key' => 'admin.memberships.manage', 'module' => 'Membership Plans', 'label' => 'Manage memberships', 'action' => 'manage', 'sort_order' => 114],
            ['key' => 'client.tasks.view', 'module' => 'Client Tasks', 'label' => 'View tasks', 'action' => 'view', 'sort_order' => 241],
            ['key' => 'counsellor.sessions.view', 'module' => 'Counsellor Sessions', 'label' => 'View sessions', 'action' => 'view', 'sort_order' => 410],
            ['key' => 'counsellor.clients.view', 'module' => 'Counsellor Clients', 'label' => 'View clients', 'action' => 'view', 'sort_order' => 420],
            ['key' => 'coach.goals.manage', 'module' => 'Coach Goals', 'label' => 'Manage goals', 'action' => 'manage', 'sort_order' => 510],
            ['key' => 'coach.messages.view', 'module' => 'Coach Messages', 'label' => 'View messages', 'action' => 'view', 'sort_order' => 520],
            ['key' => 'helpdesk.tickets.manage', 'module' => 'Help Desk Tickets', 'label' => 'Manage tickets', 'action' => 'manage', 'sort_order' => 610],
            ['key' => 'helpdesk.knowledge_base.view', 'module' => 'Knowledge Base', 'label' => 'View articles', 'action' => 'view', 'sort_order' => 620],
            ['key' => 'finance.revenue.view', 'module' => 'Finance Revenue', 'label' => 'View revenue', 'action' => 'view', 'sort_order' => 710],
            ['key' => 'finance.invoices.view', 'module' => 'Finance Invoices', 'label' => 'View invoices', 'action' => 'view', 'sort_order' => 720],
            ['key' => 'legal.reviews.view', 'module' => 'Legal Reviews', 'label' => 'View reviews', 'action' => 'view', 'sort_order' => 810],
            ['key' => 'legal.policies.view', 'module' => 'Legal Policies', 'label' => 'View policies', 'action' => 'view', 'sort_order' => 820],
            ['key' => 'content.programs.manage', 'module' => 'Content Programs', 'label' => 'Manage programs', 'action' => 'manage', 'sort_order' => 910],
            ['key' => 'content.assets.manage', 'module' => 'Content Assets', 'label' => 'Manage assets', 'action' => 'manage', 'sort_order' => 920],
        ];

        DB::table('permissions')->insert(array_map(fn (array $permission) => $permission + [
            'is_configurable' => false,
            'is_available' => false,
            'created_at' => $now,
            'updated_at' => $now,
        ], $permissions));
    }

    public function down(): void
    {
        DB::table('permissions')->whereIn('key', [
            'admin.workflows.manage',
            'admin.performance.view',
            'admin.health.view',
            'admin.memberships.manage',
            'client.tasks.view',
            'counsellor.sessions.view',
            'counsellor.clients.view',
            'coach.goals.manage',
            'coach.messages.view',
            'helpdesk.tickets.manage',
            'helpdesk.knowledge_base.view',
            'finance.revenue.view',
            'finance.invoices.view',
            'legal.reviews.view',
            'legal.policies.view',
            'content.programs.manage',
            'content.assets.manage',
        ])->delete();
    }
};
