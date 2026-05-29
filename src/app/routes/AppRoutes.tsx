import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import AuthLayout from '../layout/AuthLayout';
import PublicLayout from '../layout/PublicLayout';
import LoginPage from '../features/auth/LoginPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import { PermissionBoundary, RequireAuth, RequirePermission, RequireRole } from '../features/auth/guards';
import LandingPage from '../features/public/LandingPage';
import GetStartedWizardPage from '../features/public/GetStartedWizardPage';
import SimplePublicPage from '../features/public/SimplePublicPage';
import PricingPage from '../features/public/PricingPage';
import LegalPage from '../features/public/LegalPage';
import CareersPage from '../features/public/CareersPage';
import ProfessionalOnboardingPage from '../features/public/ProfessionalOnboardingPage';
import ContactSupportPage from '../features/public/ContactSupportPage';
import { AdminLayout } from '../features/admin/AdminLayout';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import {
  MembershipPlanManagementPage,
  PermissionMatrixPage,
  PlatformHealthPage,
  ProfessionalApprovalsPage,
  RevenueReportsPage,
  RoleManagementPage,
  TrainerApplicationsPage,
  UsageMetricsPage,
  UserManagementPage,
} from '../features/admin/pages/AdminModulePages';
import ProgramManagementPage from '../features/admin/pages/ProgramManagementPage';
import PerformanceDashboardPage from '../features/admin/pages/PerformanceDashboardPage';
import WorkflowConfigurationPage from '../features/admin/pages/WorkflowConfigurationPage';
import AdminEscalationsPage from '../features/admin/pages/AdminEscalationsPage';
import ActivityLogPage from '../features/activity/ActivityLogPage';
import { ClientLayout } from '../features/client/ClientLayout';
import ClientDashboardPage from '../features/client/pages/ClientDashboardPage';
import ClientAppointmentsPage from '../features/client/pages/ClientAppointmentsPage';
import ClientProgramsPage from '../features/client/pages/ClientProgramsPage';
import ClientTasksPage from '../features/client/pages/ClientTasksPage';
import ClientMembershipPage from '../features/client/pages/ClientMembershipPage';
import ClientReceiptPage from '../features/client/pages/ClientReceiptPage';
import ClientIntakeFlowPage from '../features/client/intake/ClientIntakeFlowPage';
import NotificationsPage from '../features/notifications/NotificationsPage';
import { RoleDashboardLayout } from '../features/roleDashboards/RoleDashboardLayout';
import { RoleDashboardPage, RolePlaceholderPage } from '../features/roleDashboards/RoleDashboardPage';
import TrainerOnboardingPage from '../features/trainer/TrainerOnboardingPage';
import CounsellorSessionsPage from '../features/counsellor/CounsellorSessionsPage';
import CounsellorClientsPage from '../features/counsellor/CounsellorClientsPage';
import TrainerProtectedRoute from '../features/trainer/TrainerProtectedRoute';
import TrainerCommandCenterLayout from '../features/trainer/TrainerCommandCenterLayout';
import TrainerDashboardDetailPage from '../features/trainer/TrainerDashboardDetailPage';
import TrainerNewSessionComingSoonPage from '../features/trainer/TrainerNewSessionComingSoonPage';
import HelpdeskTicketsPage from '../features/helpdesk/HelpdeskTicketsPage';
import HelpdeskKnowledgeBasePage from '../features/helpdesk/HelpdeskKnowledgeBasePage';
import ContentProgramsPage from '../features/content/ContentProgramsPage';
import ContentAssetsPage from '../features/content/ContentAssetsPage';
import FinanceBillingPage from '../features/finance/FinanceBillingPage';
import ProfilePage from '../features/profile/ProfilePage';

const TrainerDashboardPage = lazy(() => import('../features/trainer/TrainerDashboardPage'));
const LiveSessionPage = lazy(() => import('../features/trainer/LiveSessionPage'));
const TrainerPlansPage = lazy(() => import('../features/trainer/TrainerPlansPage'));
const TrainerCheckinsPage = lazy(() => import('../features/trainer/TrainerCheckinsPage'));
const ProgressReviewLandingPage = lazy(() => import('../features/trainer/ProgressReviewLandingPage'));
const ProgressReviewPage = lazy(() => import('../features/trainer/ProgressReviewPage'));
const TrainerMessagesLandingPage = lazy(() => import('../features/trainer/TrainerMessagesLandingPage'));
const TrainerMessagesPage = lazy(() => import('../features/trainer/TrainerMessagesPage'));

function TrainerPageLoader({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading trainer workspace...</div>}>{children}</Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><SimplePublicPage title="About" description="WellnessConnect unifies counselling, training, coaching, and operations in one platform." /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactSupportPage /></PublicLayout>} />
      <Route path="/terms-of-service" element={<PublicLayout><LegalPage type="terms" /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><LegalPage type="privacy" /></PublicLayout>} />

      <Route path="/get-started" element={<GetStartedWizardPage />} />
      <Route path="/professional-onboarding" element={<PublicLayout><ProfessionalOnboardingPage /></PublicLayout>} />
      <Route path="/trainer/onboarding" element={<TrainerOnboardingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/get-started" replace />} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PermissionBoundary anyOf={['admin.dashboard.view']}><AdminDashboardPage /></PermissionBoundary>} />
          <Route path="notifications" element={<NotificationsPage role="admin" />} />
          <Route path="profile" element={<ProfilePage role="admin" />} />
          <Route path="users" element={<PermissionBoundary anyOf={['admin.users.manage']}><UserManagementPage /></PermissionBoundary>} />
          <Route path="roles" element={<PermissionBoundary anyOf={['admin.roles.manage']}><RoleManagementPage /></PermissionBoundary>} />
          <Route path="permissions" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><PermissionMatrixPage /></PermissionBoundary>} />
          <Route path="approvals" element={<PermissionBoundary anyOf={['admin.approvals.manage']}><ProfessionalApprovalsPage /></PermissionBoundary>} />
          <Route path="trainer-applications" element={<PermissionBoundary anyOf={['admin.trainer_applications.manage']}><TrainerApplicationsPage /></PermissionBoundary>} />
          <Route path="workflows" element={<PermissionBoundary anyOf={['admin.workflows.manage']}><WorkflowConfigurationPage /></PermissionBoundary>} />
          <Route path="revenue" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><RevenueReportsPage /></PermissionBoundary>} />
          <Route path="usage" element={<PermissionBoundary anyOf={['admin.usage.view']}><UsageMetricsPage /></PermissionBoundary>} />
          <Route path="performance" element={<PermissionBoundary anyOf={['admin.performance.view']}><PerformanceDashboardPage /></PermissionBoundary>} />
          <Route path="health" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><PlatformHealthPage /></PermissionBoundary>} />
          <Route path="escalations" element={<PermissionBoundary anyOf={['admin.workflows.manage']}><AdminEscalationsPage /></PermissionBoundary>} />
          <Route path="programs" element={<PermissionBoundary anyOf={['admin.programs.view']}><ProgramManagementPage /></PermissionBoundary>} />
          <Route path="memberships" element={<PermissionBoundary anyOf={['admin.memberships.manage']}><MembershipPlanManagementPage /></PermissionBoundary>} />
          <Route path="logs" element={<PermissionBoundary anyOf={['admin.activity_logs.view']}><ActivityLogPage title="Activity Logs" subtitle="Audit and activity stream across every workspace." emptyMessage="No activity has been recorded yet." showAdminFilters /></PermissionBoundary>} />
        </Route>

        <Route element={<RequireRole allow={['client']} />}>
          <Route element={<RequirePermission anyOf={['client.dashboard.view']} />}>
            <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboardPage />} />
            <Route path="notifications" element={<NotificationsPage role="client" />} />
            <Route path="intake" element={<PermissionBoundary anyOf={['client.intake.manage']}><ClientIntakeFlowPage /></PermissionBoundary>} />
            <Route path="appointments" element={<PermissionBoundary anyOf={['client.appointments.view']}><ClientAppointmentsPage /></PermissionBoundary>} />
            <Route path="programs" element={<ClientProgramsPage />} />
            <Route path="tasks" element={<ClientTasksPage />} />
            <Route path="profile" element={<ProfilePage role="client" />} />
            <Route path="membership" element={<PermissionBoundary anyOf={['client.memberships.manage']}><ClientMembershipPage /></PermissionBoundary>} />
            <Route path="receipts/:receiptId" element={<PermissionBoundary anyOf={['client.memberships.manage']}><ClientReceiptPage /></PermissionBoundary>} />
            <Route path="activity" element={<PermissionBoundary anyOf={['client.activity_logs.view']}><ActivityLogPage title="Activity" subtitle="Track your account, intake, appointments, and membership events." emptyMessage="Your activity history is empty right now." /></PermissionBoundary>} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRole allow={['counsellor']} />}>
          <Route path="/counsellor" element={<RoleDashboardLayout role="counsellor" />}>
            <Route index element={<RoleDashboardPage role="counsellor" />} />
            <Route path="notifications" element={<NotificationsPage role="counsellor" />} />
            <Route path="profile" element={<ProfilePage role="counsellor" />} />
            <Route path="sessions" element={<CounsellorSessionsPage />} />
            <Route path="clients" element={<CounsellorClientsPage />} />
            <Route path="activity" element={<PermissionBoundary anyOf={['counsellor.activity_logs.view']}><ActivityLogPage title="Counsellor Activity" subtitle="Follow your session-related and account events." emptyMessage="Your counsellor activity feed will populate as client and care operations are recorded." /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['trainer']} />}>
          <Route element={<RequirePermission anyOf={['trainer.dashboard.view']} />}>
            <Route element={<TrainerProtectedRoute />}>
            <Route path="/trainer/submitted-profile" element={<Navigate to="/trainer" replace />} />
            <Route path="/trainer" element={<TrainerCommandCenterLayout />}>
              <Route index element={<TrainerPageLoader><TrainerDashboardPage /></TrainerPageLoader>} />
              <Route path="sessions/new" element={<TrainerNewSessionComingSoonPage />} />
              <Route path="sessions/live" element={<TrainerPageLoader><LiveSessionPage /></TrainerPageLoader>} />
              <Route path="schedule/:itemId" element={<TrainerDashboardDetailPage kind="schedule" />} />
              <Route path="alerts/:alertId" element={<TrainerDashboardDetailPage kind="alert" />} />
              <Route path="notifications" element={<NotificationsPage role="trainer" />} />
              <Route path="profile" element={<ProfilePage role="trainer" />} />
              <Route path="plans" element={<TrainerPageLoader><TrainerPlansPage /></TrainerPageLoader>} />
              <Route path="progress-review" element={<TrainerPageLoader><ProgressReviewLandingPage /></TrainerPageLoader>} />
              <Route path="clients/:clientId/progress-review" element={<TrainerPageLoader><ProgressReviewPage /></TrainerPageLoader>} />
              <Route path="messages" element={<TrainerPageLoader><TrainerMessagesLandingPage /></TrainerPageLoader>} />
              <Route path="clients/:clientId/messages" element={<TrainerPageLoader><TrainerMessagesPage /></TrainerPageLoader>} />
              <Route path="check-ins" element={<TrainerPageLoader><TrainerCheckinsPage /></TrainerPageLoader>} />
              <Route path="activity" element={<PermissionBoundary anyOf={['trainer.activity_logs.view']}><ActivityLogPage title="Trainer Activity" subtitle="Review your onboarding, appointment, and account activity." emptyMessage="Your trainer activity feed will populate as onboarding and care workflows progress." /></PermissionBoundary>} />
            </Route>
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRole allow={['coach']} />}>
          <Route path="/coach" element={<RoleDashboardLayout role="coach" />}>
            <Route index element={<RoleDashboardPage role="coach" />} />
            <Route path="notifications" element={<NotificationsPage role="coach" />} />
            <Route path="profile" element={<ProfilePage role="coach" />} />
            <Route path="goals" element={<RolePlaceholderPage role="coach" title="Goals" />} />
            <Route path="messages" element={<RolePlaceholderPage role="coach" title="Messages" />} />
            <Route path="activity" element={<PermissionBoundary anyOf={['coach.activity_logs.view']}><ActivityLogPage title="Coach Activity" subtitle="Keep an eye on the limited coach-visible audit stream." emptyMessage="Coach activity is intentionally sparse for now and will grow as coach workflows are added." /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['helpdesk']} />}>
          <Route path="/helpdesk" element={<RoleDashboardLayout role="helpdesk" />}>
            <Route index element={<RoleDashboardPage role="helpdesk" />} />
            <Route path="notifications" element={<NotificationsPage role="helpdesk" />} />
            <Route path="profile" element={<ProfilePage role="helpdesk" />} />
            <Route path="tickets" element={<PermissionBoundary anyOf={['helpdesk.tickets.manage']}><HelpdeskTicketsPage /></PermissionBoundary>} />
            <Route path="knowledge-base" element={<HelpdeskKnowledgeBasePage />} />
            <Route path="activity" element={<PermissionBoundary anyOf={['helpdesk.activity_logs.view']}><ActivityLogPage title="Helpdesk Activity" subtitle="Support requests, workflow cases, and account events visible to helpdesk." emptyMessage="Helpdesk activity will appear once support requests and workflow cases are created." /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['finance']} />}>
          <Route path="/finance" element={<RoleDashboardLayout role="finance" />}>
            <Route index element={<RoleDashboardPage role="finance" />} />
            <Route path="notifications" element={<NotificationsPage role="finance" />} />
            <Route path="profile" element={<ProfilePage role="finance" />} />
            <Route path="revenue" element={<RolePlaceholderPage role="finance" title="Revenue" />} />
            <Route path="invoices" element={<PermissionBoundary anyOf={['finance.invoices.view']}><FinanceBillingPage /></PermissionBoundary>} />
            <Route path="activity" element={<PermissionBoundary anyOf={['finance.activity_logs.view']}><ActivityLogPage title="Finance Activity" subtitle="Billing, refunds, and plan-lifecycle events relevant to finance." emptyMessage="Finance activity will appear after billing and plan operations occur." /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['legal']} />}>
          <Route path="/legal" element={<RoleDashboardLayout role="legal" />}>
            <Route index element={<RoleDashboardPage role="legal" />} />
            <Route path="notifications" element={<NotificationsPage role="legal" />} />
            <Route path="profile" element={<ProfilePage role="legal" />} />
            <Route path="reviews" element={<RolePlaceholderPage role="legal" title="Reviews" />} />
            <Route path="policies" element={<RolePlaceholderPage role="legal" title="Policies" />} />
            <Route path="activity" element={<PermissionBoundary anyOf={['legal.activity_logs.view']}><ActivityLogPage title="Legal Activity" subtitle="Role and policy-adjacent events visible to legal." emptyMessage="Legal activity is intentionally sparse until more legal workflows are implemented." /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['content']} />}>
          <Route path="/content" element={<RoleDashboardLayout role="content" />}>
            <Route index element={<RoleDashboardPage role="content" />} />
            <Route path="notifications" element={<NotificationsPage role="content" />} />
            <Route path="profile" element={<ProfilePage role="content" />} />
            <Route path="programs" element={<ContentProgramsPage />} />
            <Route path="assets" element={<ContentAssetsPage />} />
            <Route path="activity" element={<PermissionBoundary anyOf={['content.activity_logs.view']}><ActivityLogPage title="Content Activity" subtitle="Track content-visible operational and permission events." emptyMessage="Content activity will remain light until more content workflows are writing events." /></PermissionBoundary>} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
