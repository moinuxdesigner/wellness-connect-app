import { mockUsers } from '../../../data/mockUsers';
import { mockAppointments } from '../../../data/mockAppointments';
import { mockPrograms } from '../../../data/mockPrograms';
import { mockAdminMetrics, mockUsageMetrics } from '../../../data/mockAnalytics';
import { mockRoles, mockTickets } from '../../../data/mockTickets';

export function getUsers() {
  return mockUsers;
}

export function getAppointments() {
  return mockAppointments;
}

export function getPrograms() {
  return mockPrograms;
}

export function getAnalytics() {
  return mockAdminMetrics;
}

export function getUsageMetrics() {
  return mockUsageMetrics;
}

export function getTickets() {
  return mockTickets;
}

export function getRolesOverview() {
  return mockRoles;
}
