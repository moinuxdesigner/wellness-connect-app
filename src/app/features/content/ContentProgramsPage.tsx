import { getRoleScenario } from '../demo/demoScenarios';
import { RoleFlowPanel } from '../roleDashboards/RoleFlowPanel';

export default function ContentProgramsPage() {
  const scenario = getRoleScenario('content');
  if (!scenario) return null;
  return <RoleFlowPanel scenario={scenario} roleRoute="/content" />;
}
