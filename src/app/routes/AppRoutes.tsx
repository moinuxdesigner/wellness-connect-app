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
  ActivityLogsPage,
  EscalationsPage,
  MembershipPlanManagementPage,
  PermissionMatrixPage,
  PerformanceDashboardPage,
  PlatformHealthPage,
  ProfessionalApprovalsPage,
  ProgramManagementPage,
  RevenueReportsPage,
  RoleManagementPage,
  TrainerApplicationsPage,
  UsageMetricsPage,
  UserManagementPage,
  WorkflowConfigurationPage,
} from '../features/admin/pages/AdminModulePages';
import { ClientLayout } from '../features/client/ClientLayout';
import ClientDashboardPage from '../features/client/pages/ClientDashboardPage';
import ClientProfilePage from '../features/client/pages/ClientProfilePage';
import ClientAppointmentsPage from '../features/client/pages/ClientAppointmentsPage';
import ClientProgramsPage from '../features/client/pages/ClientProgramsPage';
import ClientTasksPage from '../features/client/pages/ClientTasksPage';
import ClientMembershipPage from '../features/client/pages/ClientMembershipPage';
import ClientReceiptPage from '../features/client/pages/ClientReceiptPage';
import ClientIntakeFlowPage from '../features/client/intake/ClientIntakeFlowPage';
import { RoleDashboardLayout } from '../features/roleDashboards/RoleDashboardLayout';
import { RoleDashboardPage, RolePlaceholderPage } from '../features/roleDashboards/RoleDashboardPage';
import TrainerOnboardingPage from '../features/trainer/TrainerOnboardingPage';
import CounsellorSessionsPage from '../features/counsellor/CounsellorSessionsPage';
import CounsellorClientsPage from '../features/counsellor/CounsellorClientsPage';
import TrainerPlansPage from '../features/trainer/TrainerPlansPage';
import TrainerCheckinsPage from '../features/trainer/TrainerCheckinsPage';
import TrainerProtectedRoute from '../features/trainer/TrainerProtectedRoute';
import HelpdeskTicketsPage from '../features/helpdesk/HelpdeskTicketsPage';
import HelpdeskKnowledgeBasePage from '../features/helpdesk/HelpdeskKnowledgeBasePage';
import ContentProgramsPage from '../features/content/ContentProgramsPage';
import ContentAssetsPage from '../features/content/ContentAssetsPage';
import FinanceBillingPage from '../features/finance/FinanceBillingPage';

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
          <Route path="users" element={<PermissionBoundary anyOf={['admin.users.manage']}><UserManagementPage /></PermissionBoundary>} />
          <Route path="roles" element={<PermissionBoundary anyOf={['admin.roles.manage']}><RoleManagementPage /></PermissionBoundary>} />
          <Route path="permissions" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><PermissionMatrixPage /></PermissionBoundary>} />
          <Route path="approvals" element={<PermissionBoundary anyOf={['admin.approvals.manage']}><ProfessionalApprovalsPage /></PermissionBoundary>} />
          <Route path="trainer-applications" element={<PermissionBoundary anyOf={['admin.trainer_applications.manage']}><TrainerApplicationsPage /></PermissionBoundary>} />
          <Route path="workflows" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><WorkflowConfigurationPage /></PermissionBoundary>} />
          <Route path="revenue" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><RevenueReportsPage /></PermissionBoundary>} />
          <Route path="usage" element={<PermissionBoundary anyOf={['admin.usage.view']}><UsageMetricsPage /></PermissionBoundary>} />
          <Route path="performance" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><PerformanceDashboardPage /></PermissionBoundary>} />
          <Route path="health" element={<PermissionBoundary anyOf={['admin.permissions.manage']}><PlatformHealthPage /></PermissionBoundary>} />
          <Route path="escalations" element={<PermissionBoundary anyOf={['admin.escalations.view']}><EscalationsPage /></PermissionBoundary>} />
          <Route path="programs" element={<PermissionBoundary anyOf={['admin.programs.view']}><ProgramManagementPage /></PermissionBoundary>} />
          <Route path="memberships" element={<PermissionBoundary anyOf={['admin.memberships.manage']}><MembershipPlanManagementPage /></PermissionBoundary>} />
          <Route path="logs" element={<PermissionBoundary anyOf={['admin.activity_logs.view']}><ActivityLogsPage /></PermissionBoundary>} />
        </Route>

        <Route element={<RequireRole allow={['client']} />}>
          <Route element={<RequirePermission anyOf={['client.dashboard.view']} />}>
            <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboardPage />} />
            <Route path="intake" element={<PermissionBoundary anyOf={['client.intake.manage']}><ClientIntakeFlowPage /></PermissionBoundary>} />
            <Route path="appointments" element={<PermissionBoundary anyOf={['client.appointments.view']}><ClientAppointmentsPage /></PermissionBoundary>} />
            <Route path="programs" element={<ClientProgramsPage />} />
            <Route path="tasks" element={<ClientTasksPage />} />
            <Route path="profile" element={<PermissionBoundary anyOf={['client.profile.update']}><ClientProfilePage /></PermissionBoundary>} />
            <Route path="membership" element={<PermissionBoundary anyOf={['client.memberships.manage']}><ClientMembershipPage /></PermissionBoundary>} />
            <Route path="receipts/:receiptId" element={<PermissionBoundary anyOf={['client.memberships.manage']}><ClientReceiptPage /></PermissionBoundary>} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRole allow={['counsellor']} />}>
          <Route path="/counsellor" element={<RoleDashboardLayout role="counsellor" />}>
            <Route index element={<RoleDashboardPage role="counsellor" />} />
            <Route path="sessions" element={<CounsellorSessionsPage />} />
            <Route path="clients" element={<CounsellorClientsPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['trainer']} />}>
          <Route element={<RequirePermission anyOf={['trainer.dashboard.view']} />}>
            <Route element={<TrainerProtectedRoute />}>
            <Route path="/trainer/submitted-profile" element={<Navigate to="/trainer" replace />} />
            <Route path="/trainer" element={<RoleDashboardLayout role="trainer" />}>
              <Route index element={<RoleDashboardPage role="trainer" />} />
              <Route path="plans" element={<TrainerPlansPage />} />
              <Route path="check-ins" element={<TrainerCheckinsPage />} />
            </Route>
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRole allow={['coach']} />}>
          <Route path="/coach" element={<RoleDashboardLayout role="coach" />}>
            <Route index element={<RoleDashboardPage role="coach" />} />
            <Route path="goals" element={<RolePlaceholderPage role="coach" title="Goals" />} />
            <Route path="messages" element={<RolePlaceholderPage role="coach" title="Messages" />} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['helpdesk']} />}>
          <Route path="/helpdesk" element={<RoleDashboardLayout role="helpdesk" />}>
            <Route index element={<RoleDashboardPage role="helpdesk" />} />
            <Route path="tickets" element={<HelpdeskTicketsPage />} />
            <Route path="knowledge-base" element={<HelpdeskKnowledgeBasePage />} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['finance']} />}>
          <Route path="/finance" element={<RoleDashboardLayout role="finance" />}>
            <Route index element={<RoleDashboardPage role="finance" />} />
            <Route path="revenue" element={<RolePlaceholderPage role="finance" title="Revenue" />} />
            <Route path="invoices" element={<PermissionBoundary anyOf={['finance.invoices.view']}><FinanceBillingPage /></PermissionBoundary>} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['legal']} />}>
          <Route path="/legal" element={<RoleDashboardLayout role="legal" />}>
            <Route index element={<RoleDashboardPage role="legal" />} />
            <Route path="reviews" element={<RolePlaceholderPage role="legal" title="Reviews" />} />
            <Route path="policies" element={<RolePlaceholderPage role="legal" title="Policies" />} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['content']} />}>
          <Route path="/content" element={<RoleDashboardLayout role="content" />}>
            <Route index element={<RoleDashboardPage role="content" />} />
            <Route path="programs" element={<ContentProgramsPage />} />
            <Route path="assets" element={<ContentAssetsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
