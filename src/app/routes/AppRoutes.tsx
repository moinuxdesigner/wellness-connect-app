import { Navigate, Route, Routes } from 'react-router';
import AuthLayout from '../layout/AuthLayout';
import PublicLayout from '../layout/PublicLayout';
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';
import { RequireAuth, RequireRole } from '../features/auth/guards';
import LandingPage from '../features/public/LandingPage';
import SimplePublicPage from '../features/public/SimplePublicPage';
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
  UsageMetricsPage,
  UserManagementPage,
  WorkflowConfigurationPage,
} from '../features/admin/pages/AdminModulePages';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><SimplePublicPage title="Pricing" description="Membership plans and billing rules will be connected to backend APIs in the next phase." /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><SimplePublicPage title="About" description="WellnessConnect unifies counselling, training, coaching, and operations in one platform." /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><SimplePublicPage title="Contact" description="Support and sales channels placeholder for future integrations." /></PublicLayout>} />

      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allow={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="roles" element={<RoleManagementPage />} />
            <Route path="permissions" element={<PermissionMatrixPage />} />
            <Route path="approvals" element={<ProfessionalApprovalsPage />} />
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
