import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { PageTitle } from '../AdminLayout';
import { Panel, ToneBadge } from '../../shared/components/Ui';
import { adminResetUserPassword, getAdminActivities, getAdminEscalations, getAdminOverview, getAdminPrograms, getAdminUsers } from '../../shared/services/adminApi';
import type { AppointmentSummary, ProgramSummary, Role, TicketSummary, UserSummary } from '../../../types';
import {
  nextActionLabel,
  statusLabel,
  type TrainerApplicationRecord,
  type TrainerApplicationStatus,
} from '../../trainer/trainerOnboarding';
import { fetchAdminTrainerApplicationsFromApi, updateTrainerApplicationReviewInApi } from '../../trainer/trainerApplicationsApi';

type RoleDistributionItem = {
  role: Role;
  users: number;
  status: 'healthy' | 'attention' | 'needs-review';
};

function toneByUserStatus(status: UserSummary['status']) {
  return status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'danger';
}

function toneByRoleStatus(status: RoleDistributionItem['status']) {
  return status === 'healthy' ? 'success' : 'warning';
}

function trainerApplicationTone(status: TrainerApplicationStatus) {
  if (status === 'approved') return 'success';
  if (status === 'needs_resubmission' || status === 'submitted') return 'warning';
  if (status === 'rejected') return 'danger';
  return 'neutral';
}

export function UserManagementPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [loadError, setLoadError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError('');
    getAdminUsers()
      .then((data) => {
        if (!mounted) return;
        setUsers(data);
      })
      .catch((error) => {
        if (!mounted) return;
        setUsers([]);
        setLoadError(error instanceof Error ? error.message : 'Unable to fetch database users.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [reloadCount]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === 'active').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const admins = users.filter((u) => u.role === 'admin').length;
    return { total: users.length, active, pending, admins };
  }, [users]);

  async function handlePasswordReset(user: UserSummary) {
    setResettingUserId(user.id);
    setNotice('');

    try {
      const message = await adminResetUserPassword(user);
      setNotice(message);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to reset password.');
    } finally {
      setResettingUserId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="User Management" subtitle="Manage member and staff lifecycle." />
      {notice ? <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{notice}</p> : null}
      {loadError ? (
        <section role="alert" className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Database user data unavailable</p>
            <p className="mt-1 text-sm text-rose-700">No user records are displayed because the database request failed. {loadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            className="shrink-0 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </section>
      ) : null}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-7 w-10 animate-pulse rounded bg-slate-200" />
            </article>
          ))
        ) : (
          <>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Users</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{loadError ? '--' : stats.total}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{loadError ? '--' : stats.active}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-amber-700">{loadError ? '--' : stats.pending}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Admins</p>
              <p className="mt-2 text-2xl font-semibold text-sky-700">{loadError ? '--' : stats.admins}</p>
            </article>
          </>
        )}
      </section>
      <Panel title="All Users">
        <div className="space-y-3 md:hidden">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <article key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-44 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-3 h-3 w-20 animate-pulse rounded bg-slate-200" />
                </article>
              ))
            : loadError
              ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">Unable to display users until database data can be loaded.</p>
              : users.length === 0
                ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No users found in the database.</p>
            : users.map((u) => (
                <article key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-slate-900">{u.name}</p>
                      <p className="mt-1 truncate text-sm text-slate-600">{u.email}</p>
                    </div>
                    <div className="shrink-0">
                      <ToneBadge tone={toneByUserStatus(u.status)}>{u.status}</ToneBadge>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">{u.role}</p>
                  <button
                    type="button"
                    onClick={() => handlePasswordReset(u)}
                    disabled={resettingUserId === u.id}
                    className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resettingUserId === u.id ? 'Resetting...' : 'Reset Password'}
                  </button>
                </article>
              ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Status</th><th className="py-2 text-right">Actions</th></tr></thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="py-3"><div className="h-4 w-28 animate-pulse rounded bg-slate-200" /></td>
                      <td className="py-3"><div className="h-4 w-44 animate-pulse rounded bg-slate-200" /></td>
                      <td className="py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                      <td className="py-3"><div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" /></td>
                      <td className="py-3"><div className="ml-auto h-9 w-28 animate-pulse rounded-xl bg-slate-200" /></td>
                    </tr>
                  ))
                : loadError
                  ? (
                    <tr className="border-t border-slate-200">
                      <td colSpan={5} className="py-10 text-center text-sm text-slate-500">Unable to display users until database data can be loaded.</td>
                    </tr>
                  )
                  : users.length === 0
                    ? (
                      <tr className="border-t border-slate-200">
                        <td colSpan={5} className="py-10 text-center text-sm text-slate-500">No users found in the database.</td>
                      </tr>
                    )
                : users.map((u) => (
                    <tr key={u.id} className="border-t border-slate-200">
                      <td className="py-2 font-medium text-slate-900">{u.name}</td>
                      <td className="py-2 text-slate-600">{u.email}</td>
                      <td className="py-2 capitalize">{u.role}</td>
                      <td className="py-2"><ToneBadge tone={toneByUserStatus(u.status)}>{u.status}</ToneBadge></td>
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          onClick={() => handlePasswordReset(u)}
                          disabled={resettingUserId === u.id}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {resettingUserId === u.id ? 'Resetting...' : 'Reset Password'}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function RoleManagementPage() {
  const [roles, setRoles] = useState<RoleDistributionItem[]>([]);

  useEffect(() => {
    getAdminOverview().then((data) => setRoles((data.role_distribution ?? []) as RoleDistributionItem[]));
  }, []);

  return <SimpleList title="Role Management" subtitle="Manage role distribution and staffing." items={roles.map((r) => `${r.role}: ${r.users} users (${r.status})`)} />;
}

export function PermissionMatrixPage() {
  return <SimpleList title="Permission Matrix" subtitle="RBAC placeholder for module-level permissions." items={['User read/write by role', 'Finance report visibility controls', 'Escalation visibility restrictions', 'Audit log access policy']} />;
}

export function ProfessionalApprovalsPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch(() => setLoadError('Unable to load professional approvals from the database.'));
  }, []);

  const pending = useMemo(() => users.filter((u) => u.status === 'pending'), [users]);

  return <SimpleList title="Professional Approvals" subtitle="Review and approve counsellor, trainer, and coach applications." items={loadError ? [loadError] : pending.map((u) => `${u.name} (${u.role}) - submitted ${u.joinedAt}`)} />;
}

export function TrainerApplicationsPage() {
  const [applications, setApplications] = useState<TrainerApplicationRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [decisionNotice, setDecisionNotice] = useState('');
  const [isSavingDecision, setIsSavingDecision] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function syncApplications() {
      const nextApplications = (await fetchAdminTrainerApplicationsFromApi()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      if (cancelled) return;
      setApplications(nextApplications);
      setSelectedId((current) => current ?? nextApplications[0]?.applicationId ?? null);
    }

    void syncApplications();
    const handleSync = () => {
      void syncApplications();
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const selectedApplication = useMemo(
    () => applications.find((item) => item.applicationId === selectedId) ?? applications[0] ?? null,
    [applications, selectedId],
  );

  useEffect(() => {
    setRemarks(selectedApplication?.adminRemarks ?? '');
    setFeedbackError('');
    setDecisionNotice('');
  }, [selectedApplication]);

  const stats = useMemo(() => ({
    total: applications.length,
    submitted: applications.filter((item) => item.status === 'submitted').length,
    resubmission: applications.filter((item) => item.status === 'needs_resubmission').length,
    approved: applications.filter((item) => item.status === 'approved').length,
  }), [applications]);

  async function applyAdminDecision(status: TrainerApplicationStatus) {
    if (!selectedApplication) return;

    const trimmedRemarks = remarks.trim();
    if ((status === 'needs_resubmission' || status === 'rejected') && !trimmedRemarks) {
      setFeedbackError(status === 'needs_resubmission' ? 'Add remarks so the trainer knows what to fix.' : 'Add a rejection reason before closing the application.');
      return;
    }

    setIsSavingDecision(true);
    try {
      const result = await updateTrainerApplicationReviewInApi({
        applicationId: selectedApplication.applicationId,
        status,
        adminRemarks: trimmedRemarks,
      });
      const nextApplication = result.application;

      setApplications((current) =>
        current
          .map((item) => (item.applicationId === nextApplication.applicationId ? nextApplication : item))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      );
      setSelectedId(nextApplication.applicationId);
      setRemarks(nextApplication.adminRemarks);
      setFeedbackError('');
      if (status === 'approved' && result.account?.created && result.account.temporaryPassword) {
        setDecisionNotice(`Trainer account created for ${result.account.email}. Temporary password: ${result.account.temporaryPassword}. Share it securely and ask the trainer to change it after signing in.`);
      } else if (status === 'approved' && result.account) {
        setDecisionNotice(`Trainer account activated for ${result.account.email}. The trainer can now access the workspace with their existing password.`);
      } else {
        setDecisionNotice('Application status updated.');
      }
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Unable to update the trainer application.');
    } finally {
      setIsSavingDecision(false);
    }
  }

  const reviewSections = selectedApplication
    ? [
        {
          title: 'Applicant',
          rows: [
            ['Name', selectedApplication.applicantName],
            ['Email', selectedApplication.applicantEmail],
            ['Mobile', selectedApplication.applicantMobile],
            ['Location', `${selectedApplication.city}, ${selectedApplication.state}`],
            ['Application ID', selectedApplication.applicationId],
          ],
        },
        {
          title: 'Credentials',
          rows: [
            ['Certification institute', selectedApplication.values.certification.institute || 'Not provided'],
            ['Certification type', selectedApplication.values.certification.type || 'Not provided'],
            ['Expertise', selectedApplication.expertise.length ? selectedApplication.expertise.join(', ') : 'Not provided'],
            ['Years experience', selectedApplication.values.experience.yearsExperience || 'Not provided'],
            ['Clients trained', selectedApplication.values.experience.clientsTrained || 'Not provided'],
          ],
        },
        {
          title: 'Documents and media',
          rows: [
            ['Profile photo', selectedApplication.values.photo.file?.name || 'Missing'],
            ['Certificate file', selectedApplication.values.certification.certificate?.name || 'Missing'],
            ['PAN', selectedApplication.values.identity.pan?.name || 'Missing'],
            ['Primary ID', selectedApplication.values.identity.aadhaar?.name || selectedApplication.values.identity.passport?.name || selectedApplication.values.identity.drivingLicense?.name || 'Missing'],
            ['Transformation photos', selectedApplication.values.showcase.transformationPhotos.length ? selectedApplication.values.showcase.transformationPhotos.map((item) => item.name).join(', ') : 'Missing'],
            ['Videos', selectedApplication.values.showcase.videos.length ? selectedApplication.values.showcase.videos.map((item) => item.name).join(', ') : 'Missing'],
            ['Intro video', selectedApplication.values.training.introductionVideo?.name || 'Missing'],
          ],
        },
        {
          title: 'Delivery and payout',
          rows: [
            ['Training modes', selectedApplication.values.availability.modes.length ? selectedApplication.values.availability.modes.join(', ') : 'Not provided'],
            ['Available days', selectedApplication.values.availability.days.length ? selectedApplication.values.availability.days.join(', ') : 'Not provided'],
            ['Pricing plans', selectedApplication.values.availability.pricingPlans || 'Not provided'],
            ['Bank name', selectedApplication.values.payout.bankName || 'Not provided'],
            ['Account number', selectedApplication.values.payout.accountNumber ? `•••• ${selectedApplication.values.payout.accountNumber.slice(-4)}` : 'Not provided'],
            ['IFSC', selectedApplication.values.payout.ifsc || 'Not provided'],
          ],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageTitle title="Trainer Applications" subtitle="Review trainer onboarding submissions, documents, demo videos, interviews, and approval decisions." />
      {decisionNotice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{decisionNotice}</p> : null}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Applications</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">New Submissions</p>
          <p className="mt-2 text-2xl font-semibold text-sky-700">{stats.submitted}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Need Resubmission</p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">{stats.resubmission}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Approved</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{stats.approved}</p>
        </article>
      </section>

      <Panel title="Application Queue">
        {!applications.length ? (
          <p className="text-sm text-slate-500">No trainer onboarding submissions have been sent yet.</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Trainer</th>
                <th className="py-2">Status</th>
                <th className="py-2">Submitted</th>
                <th className="py-2">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.applicationId}
                  className={`border-t border-slate-200 transition ${selectedApplication?.applicationId === application.applicationId ? 'bg-slate-50' : 'hover:bg-slate-50/70'}`}
                >
                  <td className="py-2">
                    <button type="button" onClick={() => setSelectedId(application.applicationId)} className="text-left">
                      <span className="block font-medium text-slate-900">{application.applicantName}</span>
                      <span className="text-xs text-slate-500">{application.applicantEmail}</span>
                    </button>
                  </td>
                  <td className="py-2"><ToneBadge tone={trainerApplicationTone(application.status)}>{statusLabel(application.status)}</ToneBadge></td>
                  <td className="py-2 text-slate-700">{new Date(application.submittedAt).toLocaleDateString()}</td>
                  <td className="py-2 text-slate-600">{nextActionLabel(application.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Panel>

      <Panel title="Application Review">
        {!selectedApplication ? (
          <p className="text-sm text-slate-500">Choose a trainer application from the queue to review it.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">{selectedApplication.applicantName}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedApplication.applicantEmail} • {selectedApplication.applicantMobile}</p>
                <p className="mt-1 text-sm text-slate-500">Submitted {new Date(selectedApplication.submittedAt).toLocaleString()}</p>
              </div>
              <ToneBadge tone={trainerApplicationTone(selectedApplication.status)}>{statusLabel(selectedApplication.status)}</ToneBadge>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-5">
                {reviewSections.map((section) => (
                  <section key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{section.title}</h4>
                    <dl className="mt-3 grid gap-3">
                      {section.rows.map(([label, value]) => (
                        <div key={label} className="border-b border-slate-200 pb-3 last:border-b-0">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                          <dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>

              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Admin remarks</h4>
                  <textarea
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    placeholder="Add review notes, missing items, approval notes, or rejection reasons."
                    className="mt-3 min-h-36 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-slate-400"
                  />
                  {feedbackError ? <p className="mt-2 text-sm text-rose-600">{feedbackError}</p> : null}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Decision Actions</h4>
                  <div className="mt-3 grid gap-3">
                    <button type="button" onClick={() => void applyAdminDecision('under_review')} disabled={isSavingDecision} className="rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                      Mark Under Review
                    </button>
                    <button type="button" onClick={() => void applyAdminDecision('needs_resubmission')} disabled={isSavingDecision} className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60">
                      Send Back for Resubmission
                    </button>
                    <button type="button" onClick={() => void applyAdminDecision('approved')} disabled={isSavingDecision} className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-900 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">
                      Approve Application
                    </button>
                    <button type="button" onClick={() => void applyAdminDecision('rejected')} disabled={isSavingDecision} className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-rose-900 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60">
                      Reject Application
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review history</h4>
                  <div className="mt-3 space-y-3">
                    {selectedApplication.reviewHistory.length ? (
                      [...selectedApplication.reviewHistory].slice().reverse().map((item) => (
                        <div key={item.id} className="border-l-2 border-slate-200 pl-4">
                          <p className="text-sm font-semibold text-slate-900">{statusLabel(item.action)}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                          <p className="mt-1 text-xs text-slate-400">{item.actor} • {new Date(item.at).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No review actions recorded yet.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

export function WorkflowConfigurationPage() {
  return <SimpleList title="Workflow Configuration" subtitle="Operational flows for booking, escalation, and follow-ups." items={['Intake assignment workflow', 'Session no-show handling', 'Critical risk escalation path', 'Cross-team follow-up SLA policy']} />;
}

export function RevenueReportsPage() {
  const monthlyRecurringRevenue = [82, 88, 94, 102, 108, 116, 122, 128, 131, 138, 146, 154];
  const monthlyOrders = [420, 460, 490, 515, 548, 576, 602, 618, 641, 668, 702, 734];
  const refundRate = [4.1, 3.9, 3.6, 3.4, 3.3, 3.1, 2.9, 2.7, 2.8, 2.6, 2.5, 2.4];

  const trendOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 22, right: 20, top: 24, bottom: 24, containLabel: true },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#64748b', formatter: '${value}k' },
      },
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#64748b' },
      },
    ],
    series: [
      {
        name: 'MRR',
        type: 'line',
        smooth: true,
        data: monthlyRecurringRevenue,
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#2563eb' },
        lineStyle: { width: 3, color: '#2563eb' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37,99,235,0.24)' },
            { offset: 1, color: 'rgba(37,99,235,0.02)' },
          ]),
        },
      },
      {
        name: 'Orders',
        type: 'line',
        smooth: true,
        data: monthlyOrders,
        yAxisIndex: 1,
        symbol: 'none',
        itemStyle: { color: '#0ea5e9' },
        lineStyle: { width: 2, color: '#0ea5e9', type: 'dashed' },
      },
      {
        name: 'Refund %',
        type: 'line',
        smooth: true,
        data: refundRate,
        yAxisIndex: 1,
        symbol: 'none',
        itemStyle: { color: '#f97316' },
        lineStyle: { width: 2, color: '#f97316' },
      },
    ],
  };

  const planSplitOption: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    series: [
      {
        type: 'pie',
        radius: ['58%', '78%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        label: { show: false },
        data: [
          { value: 42, name: 'Premium Care', itemStyle: { color: '#2563eb' } },
          { value: 28, name: 'Mind + Body', itemStyle: { color: '#0ea5e9' } },
          { value: 18, name: 'Corporate', itemStyle: { color: '#14b8a6' } },
          { value: 12, name: 'Family', itemStyle: { color: '#94a3b8' } },
        ],
      },
    ],
    graphic: [
      { type: 'text', left: 'center', top: '37%', style: { text: '154k', fill: '#0f172a', font: '700 24px sans-serif' } },
      { type: 'text', left: 'center', top: '51%', style: { text: 'Monthly ARR', fill: '#64748b', font: '500 12px sans-serif' } },
    ],
  };

  const agingOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 22, right: 20, top: 16, bottom: 24, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', formatter: '${value}k' },
    },
    yAxis: {
      type: 'category',
      data: ['0-30 days', '31-60 days', '61-90 days', '90+ days'],
      axisLine: { show: false },
      axisLabel: { color: '#475569' },
    },
    series: [
      {
        type: 'bar',
        data: [44, 26, 14, 8],
        barWidth: 16,
        itemStyle: {
          borderRadius: 8,
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#93c5fd' },
          ]),
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Revenue Reports" subtitle="Finance overview powered by mock analytics data." />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Monthly Revenue</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$154K</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">+12.8% vs previous month</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">734</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">+9.2% conversion uplift</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Avg. Ticket Size</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$209</p>
          <p className="mt-2 text-xs font-medium text-sky-700">Stable across top plans</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Outstanding Invoices</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$92K</p>
          <p className="mt-2 text-xs font-medium text-amber-700">Needs collection follow-up</p>
        </article>
      </section>

      <Panel title="Monthly recurring revenue trend">
        <EChart option={trendOption} height={360} />
      </Panel>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Plan-wise revenue split">
          <EChart option={planSplitOption} height={300} />
        </Panel>
        <Panel title="Outstanding invoices aging">
          <EChart option={agingOption} height={300} />
        </Panel>
      </section>
    </div>
  );
}

export function UsageMetricsPage() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    getAdminOverview().then((data) => setItems((data.usage_metrics ?? []).map((u) => `${u.label}: ${u.value} (${u.delta})`)));
  }, []);

  return <SimpleList title="Usage Metrics" subtitle="Engagement and operational KPIs." items={items} />;
}

export function PerformanceDashboardPage() {
  return <SimpleList title="Performance Dashboard" subtitle="Platform and team performance summaries." items={['Counsellor utilization 78%', 'Trainer utilization 72%', 'Coach follow-up completion 88%', 'Help desk first response 24m']} />;
}

export function PlatformHealthPage() {
  return <SimpleList title="Platform Health" subtitle="System and process health checkpoints." items={['Auth services: healthy', 'Booking service: healthy', 'Messaging queue: monitored', 'Escalation pipeline: healthy']} />;
}

export function EscalationsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);

  useEffect(() => {
    getAdminEscalations().then(setTickets);
  }, []);

  return <SimpleList title="Escalations" subtitle="High-priority cases requiring admin action." items={tickets.filter((t) => t.priority !== 'low').map((t) => `${t.id}: ${t.title} (${t.status})`)} />;
}

export function ProgramManagementPage() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);

  useEffect(() => {
    getAdminPrograms().then(setPrograms);
  }, []);

  return <SimpleList title="Program Management" subtitle="Manage wellness programs and lifecycle status." items={programs.map((p) => `${p.title} - ${p.category} - ${p.status}`)} />;
}

export function MembershipPlanManagementPage() {
  return <SimpleList title="Membership Plan Management" subtitle="Manage plan catalog and subscription policy placeholders." items={['Basic Care Plan', 'Mind + Body Plus Plan', 'Family Wellness Plan', 'Corporate Program Plan']} />;
}

export function ActivityLogsPage() {
  const [activities, setActivities] = useState<AppointmentSummary[]>([]);

  useEffect(() => {
    getAdminActivities().then(setActivities);
  }, []);

  return <SimpleList title="Activity Logs" subtitle="Audit and activity stream." items={activities.map((a) => `${a.id}: ${a.serviceType} ${a.status} for ${a.clientName}`)} />;
}

function SimpleList({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <div className="space-y-6">
      <PageTitle title={title} subtitle={subtitle} />
      <Panel title="Overview">
        <ul className="space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 px-3 py-2">{item}</li>
          ))}
          {!items.length ? <li className="rounded-xl border border-slate-200 px-3 py-2 text-slate-500">No records found.</li> : null}
        </ul>
      </Panel>
    </div>
  );
}

function EChart({ option, height }: { option: echarts.EChartsOption; height: number }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const instance = echarts.init(chartRef.current);
    instance.setOption(option);
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      instance.dispose();
    };
  }, [option]);

  return <div ref={(node) => { chartRef.current = node; }} style={{ height, width: '100%' }} />;
}
