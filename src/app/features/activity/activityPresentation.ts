import type { LucideIcon } from 'lucide-react';
import {
  BadgeIndianRupee,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileCog,
  FilePenLine,
  HeartPulse,
  KeyRound,
  LockKeyhole,
  OctagonAlert,
  ReceiptIndianRupee,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  ShieldEllipsis,
  Stethoscope,
  UserCircle2,
  UserCog,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import type { ActivityLogEntry, Role } from '../../types';

export type ActivitySeverity = 'low' | 'medium' | 'high';

export type ActivityPresentation = {
  actionKey: string;
  actionLabel: string;
  actionIcon: LucideIcon;
  actionTone: string;
  iconTone: string;
  summary: string;
  severity: ActivitySeverity;
  performerName: string;
  performerRole: string;
  affectedName: string;
  affectedMeta: string;
  affectedIsPerson: boolean;
  ipAddress: string;
};

function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function roleLabel(role?: string | null) {
  if (!role) return 'Team member';
  if (role === 'admin') return 'Super Admin';
  if (role === 'helpdesk') return 'Help Desk';
  return titleCase(role);
}

function readString(details: Record<string, unknown>, key: string) {
  const value = details[key];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function readNumber(details: Record<string, unknown>, key: string) {
  const value = details[key];
  return typeof value === 'number' ? value : typeof value === 'string' && value !== '' ? Number(value) : NaN;
}

function formatCurrencyFromMinor(amountMinor: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

function formatRole(role?: string | null) {
  return role ? titleCase(role) : 'Member';
}

function appointmentLabel(serviceType: string) {
  if (!serviceType) return 'appointment';
  if (serviceType === 'combined') return 'combined wellness appointment';
  if (serviceType === 'package') return 'package appointment';
  if (serviceType === 'psychology') return 'counselling appointment';
  if (serviceType === 'training') return 'training appointment';
  return `${titleCase(serviceType)} appointment`;
}

function actionVisual(actionKey: string): Pick<ActivityPresentation, 'actionLabel' | 'actionIcon' | 'actionTone' | 'iconTone'> {
  const config: Record<string, Pick<ActivityPresentation, 'actionLabel' | 'actionIcon' | 'actionTone' | 'iconTone'>> = {
    registered: { actionLabel: 'User Created', actionIcon: UserPlus, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    profile_updated: { actionLabel: 'Profile Updated', actionIcon: FilePenLine, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    role_changed: { actionLabel: 'Role Changed', actionIcon: UserCog, actionTone: 'bg-violet-50 text-violet-700', iconTone: 'bg-violet-100 text-violet-600' },
    program_created: { actionLabel: 'Program Created', actionIcon: ClipboardList, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    program_updated: { actionLabel: 'Program Updated', actionIcon: FilePenLine, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    program_published: { actionLabel: 'Program Published', actionIcon: HeartPulse, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    program_archived: { actionLabel: 'Program Archived', actionIcon: ClipboardList, actionTone: 'bg-slate-100 text-slate-700', iconTone: 'bg-slate-200 text-slate-600' },
    refund_processed: { actionLabel: 'Payment Refunded', actionIcon: ReceiptIndianRupee, actionTone: 'bg-rose-50 text-rose-700', iconTone: 'bg-rose-100 text-rose-600' },
    payment_captured: { actionLabel: 'Payment Captured', actionIcon: BadgeIndianRupee, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    checkout_initiated: { actionLabel: 'Checkout Started', actionIcon: BadgeIndianRupee, actionTone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-600' },
    user_deleted: { actionLabel: 'Account Removed', actionIcon: UserMinus, actionTone: 'bg-rose-50 text-rose-700', iconTone: 'bg-rose-100 text-rose-600' },
    permissions_updated: { actionLabel: 'Permission Updated', actionIcon: LockKeyhole, actionTone: 'bg-violet-50 text-violet-700', iconTone: 'bg-violet-100 text-violet-600' },
    booked: { actionLabel: 'Appointment Booked', actionIcon: CalendarClock, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    rescheduled: { actionLabel: 'Appointment Rescheduled', actionIcon: RefreshCcw, actionTone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-600' },
    cancelled: { actionLabel: 'Appointment Cancelled', actionIcon: CalendarClock, actionTone: 'bg-orange-50 text-orange-700', iconTone: 'bg-orange-100 text-orange-600' },
    completed: { actionLabel: 'Appointment Completed', actionIcon: CheckCircle2, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    no_show: { actionLabel: 'No-Show Recorded', actionIcon: OctagonAlert, actionTone: 'bg-orange-50 text-orange-700', iconTone: 'bg-orange-100 text-orange-600' },
    password_reset_forced: { actionLabel: 'Password Reset', actionIcon: KeyRound, actionTone: 'bg-rose-50 text-rose-700', iconTone: 'bg-rose-100 text-rose-600' },
    password_changed: { actionLabel: 'Password Changed', actionIcon: KeyRound, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    password_reset: { actionLabel: 'Password Reset', actionIcon: KeyRound, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    login: { actionLabel: 'Signed In', actionIcon: ShieldCheck, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    logout: { actionLabel: 'Signed Out', actionIcon: ShieldEllipsis, actionTone: 'bg-slate-100 text-slate-700', iconTone: 'bg-slate-200 text-slate-600' },
    request_created: { actionLabel: 'Support Request', actionIcon: Stethoscope, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    case_opened: { actionLabel: 'Case Opened', actionIcon: ShieldAlert, actionTone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-600' },
    case_breached: { actionLabel: 'SLA Breached', actionIcon: ShieldAlert, actionTone: 'bg-rose-50 text-rose-700', iconTone: 'bg-rose-100 text-rose-600' },
    config_updated: { actionLabel: 'System Setting', actionIcon: FileCog, actionTone: 'bg-violet-50 text-violet-700', iconTone: 'bg-violet-100 text-violet-600' },
    plan_created: { actionLabel: 'Plan Created', actionIcon: ClipboardList, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    plan_updated: { actionLabel: 'Plan Updated', actionIcon: FilePenLine, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    plan_published: { actionLabel: 'Plan Published', actionIcon: ClipboardList, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
    plan_archived: { actionLabel: 'Plan Archived', actionIcon: ClipboardList, actionTone: 'bg-slate-100 text-slate-700', iconTone: 'bg-slate-200 text-slate-600' },
    application_submitted: { actionLabel: 'Application Submitted', actionIcon: UserCircle2, actionTone: 'bg-sky-50 text-sky-700', iconTone: 'bg-sky-100 text-sky-600' },
    application_resubmitted: { actionLabel: 'Application Resubmitted', actionIcon: RefreshCcw, actionTone: 'bg-amber-50 text-amber-700', iconTone: 'bg-amber-100 text-amber-600' },
    trainer_account_provisioned: { actionLabel: 'Trainer Account Ready', actionIcon: Users, actionTone: 'bg-emerald-50 text-emerald-700', iconTone: 'bg-emerald-100 text-emerald-600' },
  };

  return config[actionKey] ?? {
    actionLabel: titleCase(actionKey),
    actionIcon: ClipboardList,
    actionTone: 'bg-slate-100 text-slate-700',
    iconTone: 'bg-slate-200 text-slate-600',
  };
}

export function severityForEntry(entry: ActivityLogEntry): ActivitySeverity {
  const details = entry.details ?? {};
  const priority = readString(details, 'priority').toLowerCase();

  if (entry.action === 'refund_processed' || entry.action === 'user_deleted' || entry.action === 'password_reset_forced' || entry.action === 'case_breached') {
    return 'high';
  }

  if (priority === 'critical' || priority === 'high') {
    return 'high';
  }

  if (
    entry.action === 'role_changed'
    || entry.action === 'permissions_updated'
    || entry.action === 'cancelled'
    || entry.action === 'rescheduled'
    || entry.action === 'no_show'
    || entry.action === 'case_opened'
    || entry.action.startsWith('application_')
  ) {
    return 'medium';
  }

  return 'low';
}

function readableSummary(entry: ActivityLogEntry) {
  const details = entry.details ?? {};
  const actorName = entry.actor?.name ?? 'A team member';
  const subjectLabel = entry.subject.label ?? 'this record';
  const targetName = entry.target?.name ?? entry.subject.label ?? 'this user';
  const previousRole = readString(details, 'previousRole');
  const newRole = readString(details, 'newRole');
  const reason = readString(details, 'reason');
  const serviceType = readString(details, 'serviceType');
  const workflowKey = readString(details, 'workflowKey');
  const amountMinor = readNumber(details, 'amountMinor');

  switch (entry.action) {
    case 'registered':
      return `Created a new ${formatRole(readString(details, 'role') || entry.actor?.role || entry.target?.role)} account.`;
    case 'profile_updated':
      return `Updated profile information for ${targetName}.`;
    case 'role_changed':
      if (previousRole && newRole) {
        return `Changed user role from ${formatRole(previousRole)} to ${formatRole(newRole)}.`;
      }
      return `Updated access role for ${targetName}.`;
    case 'permissions_updated':
      return `Updated permissions for the ${formatRole((entry.target?.role ?? readString(details, 'targetRole') ?? entry.target?.name ?? '') as string)} role.`;
    case 'program_created':
      return `Created a new program draft: ${subjectLabel}.`;
    case 'program_updated':
      return `Updated program details for ${subjectLabel}.`;
    case 'program_published':
      return `Published a new program: ${subjectLabel}.`;
    case 'program_archived':
      return `Archived the program ${subjectLabel}.`;
    case 'plan_created':
      return `Created a new membership plan: ${subjectLabel}.`;
    case 'plan_updated':
      return `Updated the membership plan ${subjectLabel}.`;
    case 'plan_published':
      return `Published a membership plan: ${subjectLabel}.`;
    case 'plan_archived':
      return `Archived the membership plan ${subjectLabel}.`;
    case 'refund_processed':
      if (!Number.isNaN(amountMinor)) {
        return `Refunded payment of ${formatCurrencyFromMinor(amountMinor)} to the client.`;
      }
      return 'Processed a payment refund for the client.';
    case 'checkout_initiated':
      return 'Started the membership checkout process.';
    case 'payment_captured':
      return 'Captured a membership payment successfully.';
    case 'user_deleted':
      return `Removed ${targetName}'s account from the platform.`;
    case 'booked':
      return `Booked a new ${appointmentLabel(serviceType)}.`;
    case 'rescheduled':
      return 'Rescheduled an appointment for the client.';
    case 'cancelled':
      return reason ? `Cancelled an appointment: ${reason}.` : 'Cancelled an appointment for the client.';
    case 'completed':
      return 'Marked an appointment as completed.';
    case 'no_show':
      return 'Marked an appointment as a no-show.';
    case 'password_reset_forced':
      return `Reset ${targetName}'s password and signed them out of active sessions.`;
    case 'password_changed':
      return 'Changed account password.';
    case 'password_reset':
      return 'Reset account password using the recovery flow.';
    case 'login':
      return 'Signed in to the platform.';
    case 'logout':
      return 'Signed out of the platform.';
    case 'request_created':
      return 'Received a new support request.';
    case 'case_opened':
      if (entry.summary.toLowerCase().includes('critical-risk')) {
        return 'Opened a critical case that needs follow-up.';
      }
      return 'Opened a new workflow case for follow-up.';
    case 'case_breached':
      return 'A workflow case missed its response target.';
    case 'config_updated':
      return workflowKey ? `Updated workflow settings for ${titleCase(workflowKey)}.` : 'Updated workflow settings.';
    case 'application_submitted':
      return 'Submitted a new trainer application.';
    case 'application_resubmitted':
      return 'Resubmitted a trainer application for review.';
    case 'trainer_account_provisioned':
      return 'Prepared a trainer account after application review.';
    default:
      return entry.summary || `${actorName} completed an activity.`;
  }
}

function affectedTarget(entry: ActivityLogEntry) {
  if (entry.target?.name) {
    return {
      affectedName: entry.target.name,
      affectedMeta: entry.target.role ? roleLabel(String(entry.target.role)) : 'Person',
      affectedIsPerson: true,
    };
  }

  if (entry.subject.label) {
    return {
      affectedName: entry.subject.label,
      affectedMeta: subjectKindLabel(entry.subject.type, entry.target?.role),
      affectedIsPerson: entry.subject.type?.endsWith('\\User') ?? false,
    };
  }

  if (entry.target?.role) {
    return {
      affectedName: `${formatRole(String(entry.target.role))} role`,
      affectedMeta: 'Role',
      affectedIsPerson: false,
    };
  }

  return {
    affectedName: 'Platform record',
    affectedMeta: 'System',
    affectedIsPerson: false,
  };
}

function subjectKindLabel(subjectType: string | null, targetRole?: string | null) {
  if (targetRole) return `${formatRole(targetRole)} role`;
  if (!subjectType) return 'Record';
  const normalized = subjectType.split('\\').pop() ?? subjectType;
  if (normalized === 'User') return 'Person';
  if (normalized === 'WellnessPackage') return 'Program';
  if (normalized === 'MembershipRefund') return 'Refund';
  if (normalized === 'MembershipSubscription') return 'Membership';
  if (normalized === 'TrainerApplication') return 'Application';
  if (normalized === 'WorkflowCase') return 'Workflow';
  if (normalized === 'SupportRequest') return 'Support';
  if (normalized === 'Appointment') return 'Appointment';
  return titleCase(normalized);
}

export function buildActivityPresentation(entry: ActivityLogEntry): ActivityPresentation {
  const details = entry.details ?? {};
  const visual = actionVisual(entry.action);
  const affected = affectedTarget(entry);
  const ipAddress = readString(details, 'ipAddress') || readString(details, 'ip_address') || 'Not recorded';

  return {
    actionKey: entry.action,
    actionLabel: visual.actionLabel,
    actionIcon: visual.actionIcon,
    actionTone: visual.actionTone,
    iconTone: visual.iconTone,
    summary: readableSummary(entry),
    severity: severityForEntry(entry),
    performerName: entry.actor?.name ?? 'System',
    performerRole: roleLabel((entry.actor?.role as Role | string | null) ?? null),
    affectedName: affected.affectedName,
    affectedMeta: affected.affectedMeta,
    affectedIsPerson: affected.affectedIsPerson,
    ipAddress,
  };
}
