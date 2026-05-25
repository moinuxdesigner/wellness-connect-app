import { mockUsers } from '../../data/mockUsers';
import type { Role, UserSummary } from '../../types';
import type { AuthUser } from './auth';

const DEMO_AUTH_USERS_KEY = 'wc_demo_auth_users_v1';

type DemoAuthRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserSummary['status'];
  joinedAt: string;
  password: string;
};

const defaultDemoAuthUsers: DemoAuthRecord[] = [
  {
    id: 'U-admin-1',
    name: 'Admin User',
    email: 'admin@wellnessconnect.local',
    role: 'admin',
    status: 'active',
    joinedAt: '2026-01-01',
    password: 'Admin@12345',
  },
  ...mockUsers.map((user) => ({
    ...user,
    password: 'password123',
  })),
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsers(users: DemoAuthRecord[]) {
  const byEmail = new Map<string, DemoAuthRecord>();

  for (const user of [...defaultDemoAuthUsers, ...users]) {
    byEmail.set(normalizeEmail(user.email), user);
  }

  return Array.from(byEmail.values());
}

function readStoredDemoUsers() {
  try {
    const raw = localStorage.getItem(DEMO_AUTH_USERS_KEY);
    if (!raw) return [...defaultDemoAuthUsers];

    const parsed = JSON.parse(raw) as DemoAuthRecord[];
    if (!Array.isArray(parsed)) return [...defaultDemoAuthUsers];
    return normalizeUsers(parsed);
  } catch {
    return [...defaultDemoAuthUsers];
  }
}

function writeStoredDemoUsers(users: DemoAuthRecord[]) {
  localStorage.setItem(DEMO_AUTH_USERS_KEY, JSON.stringify(normalizeUsers(users)));
}

function toAuthUser(user: DemoAuthRecord): AuthUser {
  return {
    id: Number.isNaN(Number(user.id)) ? Date.now() : Number(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export function findDemoAuthUser(email: string, password: string): AuthUser | null {
  const users = readStoredDemoUsers();
  const match = users.find((user) => normalizeEmail(user.email) === normalizeEmail(email) && user.password === password);
  return match ? toAuthUser(match) : null;
}

export function upsertDemoAuthUser(user: {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  status?: UserSummary['status'];
  joinedAt?: string;
}, password = 'password123') {
  const users = readStoredDemoUsers();
  const nextRecord: DemoAuthRecord = {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status ?? 'active',
    joinedAt: user.joinedAt ?? new Date().toISOString().slice(0, 10),
    password,
  };

  const nextUsers = users.some((item) => normalizeEmail(item.email) === normalizeEmail(user.email))
    ? users.map((item) => normalizeEmail(item.email) === normalizeEmail(user.email) ? { ...item, ...nextRecord, password: nextRecord.password } : item)
    : [nextRecord, ...users];

  writeStoredDemoUsers(nextUsers);
}

export function resetDemoUserPassword(user: Pick<UserSummary, 'id' | 'name' | 'email' | 'role' | 'status' | 'joinedAt'>, password = 'password123') {
  upsertDemoAuthUser(user, password);
  return password;
}
