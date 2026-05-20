import { getRoleScenario } from '../demo/demoScenarios';
import { RoleFlowPanel } from '../roleDashboards/RoleFlowPanel';

export default function CounsellorSessionsPage() {
  const scenario = getRoleScenario('counsellor');
  if (!scenario) return null;
  return <RoleFlowPanel scenario={scenario} roleRoute="/counsellor" />;
}
