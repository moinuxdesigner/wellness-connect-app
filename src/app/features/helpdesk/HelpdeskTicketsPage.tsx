import { getRoleScenario } from '../demo/demoScenarios';
import { RoleFlowPanel } from '../roleDashboards/RoleFlowPanel';

export default function HelpdeskTicketsPage() {
  const scenario = getRoleScenario('helpdesk');
  if (!scenario) return null;
  return <RoleFlowPanel scenario={scenario} roleRoute="/helpdesk" />;
}
