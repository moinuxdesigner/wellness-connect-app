import { getRoleScenario } from '../demo/demoScenarios';
import { RoleFlowPanel } from '../roleDashboards/RoleFlowPanel';

export default function TrainerPlansPage() {
  const scenario = getRoleScenario('trainer');
  if (!scenario) return null;
  return <RoleFlowPanel scenario={scenario} roleRoute="/trainer" />;
}
