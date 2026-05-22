import { Navigate, Route, Routes } from 'react-router';
import AuthLayout from '../layout/AuthLayout';
import PublicLayout from '../layout/PublicLayout';
import LoginPage from '../features/auth/LoginPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import { RequireAuth, RequireRole } from '../features/auth/guards';
import LandingPage from '../features/public/LandingPage';
import GetStartedWizardPage from '../features/public/GetStartedWizardPage';
import SimplePublicPage from '../features/public/SimplePublicPage';
import LegalPage from '../features/public/LegalPage';
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
import ClientIntakeFlowPage from '../features/client/intake/ClientIntakeFlowPage';
import { RoleDashboardLayout } from '../features/roleDashboards/RoleDashboardLayout';
import { RoleDashboardPage, RolePlaceholderPage } from '../features/roleDashboards/RoleDashboardPage';
import TrainerOnboardingPage from '../features/trainer/TrainerOnboardingPage';
import CounsellorSessionsPage from '../features/counsellor/CounsellorSessionsPage';
import CounsellorClientsPage from '../features/counsellor/CounsellorClientsPage';
import TrainerPlansPage from '../features/trainer/TrainerPlansPage';
import TrainerCheckinsPage from '../features/trainer/TrainerCheckinsPage';
import HelpdeskTicketsPage from '../features/helpdesk/HelpdeskTicketsPage';
import HelpdeskKnowledgeBasePage from '../features/helpdesk/HelpdeskKnowledgeBasePage';
import ContentProgramsPage from '../features/content/ContentProgramsPage';
import ContentAssetsPage from '../features/content/ContentAssetsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><SimplePublicPage title="Pricing" description="Membership plans and billing rules will be connected to backend APIs in the next phase." /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><SimplePublicPage title="About" description="WellnessConnect unifies counselling, training, coaching, and operations in one platform." /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><SimplePublicPage title="Contact" description="Support and sales channels placeholder for future integrations." /></PublicLayout>} />
      <Route path="/terms-of-service" element={<PublicLayout><LegalPage type="terms" /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><LegalPage type="privacy" /></PublicLayout>} />

      <Route path="/get-started" element={<GetStartedWizardPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/get-started" replace />} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allow={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="roles" element={<RoleManagementPage />} />
            <Route path="permissions" element={<PermissionMatrixPage />} />
            <Route path="approvals" element={<ProfessionalApprovalsPage />} />
            <Route path="trainer-applications" element={<TrainerApplicationsPage />} />
            <Route path="workflows" element={<WorkflowConfigurationPage />} />
            <Route path="revenue" element={<RevenueReportsPage />} />
            <Route path="usage" element={<UsageMetricsPage />} />
            <Route path="performance" element={<PerformanceDashboardPage />} />
            <Route path="health" element={<PlatformHealthPage />} />
            <Route path="escalations" element={<EscalationsPage />} />
            <Route path="programs" element={<ProgramManagementPage />} />
            <Route path="memberships" element={<MembershipPlanManagementPage />} />
            <Route path="logs" element={<ActivityLogsPage />} />
          </Route>
        </Route>

        <Route element={<RequireRole allow={['client']} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboardPage />} />
            <Route path="intake" element={<ClientIntakeFlowPage />} />
            <Route path="appointments" element={<ClientAppointmentsPage />} />
            <Route path="programs" element={<ClientProgramsPage />} />
            <Route path="tasks" element={<ClientTasksPage />} />
            <Route path="profile" element={<ClientProfilePage />} />
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
          <Route path="/trainer" element={<RoleDashboardLayout role="trainer" />}>
            <Route index element={<RoleDashboardPage role="trainer" />} />
            <Route path="onboarding" element={<TrainerOnboardingPage />} />
            <Route path="plans" element={<TrainerPlansPage />} />
            <Route path="check-ins" element={<TrainerCheckinsPage />} />
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
            <Route path="invoices" element={<RolePlaceholderPage role="finance" title="Invoices" />} />
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
