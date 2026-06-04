import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  PlayCircle,
  Save,
  Send,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';
import {
  assignCounsellorCbtHomeworkRequest,
  completeCounsellorSessionRequest,
  createCounsellorCbtPlanRequest,
  createCounsellorAssessmentRequest,
  escalateCounsellorSessionRequest,
  followUpCounsellorSessionRequest,
  getCounsellorSessionsRequest,
  getCounsellorSessionWorkspaceRequest,
  saveCounsellorSessionNotesRequest,
  startCounsellorSessionRequest,
  type CounsellorAssessmentType,
  type CounsellorSessionQueueItem,
  type CounsellorSessionWorkspace,
} from '../shared/services/api';

type SoapDraft = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

const noteTemplates: Record<string, SoapDraft> = {
  Anxiety: {
    subjective: 'Client reports increased anxiety and identifiable worry triggers.',
    objective: 'Affect anxious. Speech coherent. No acute disorientation observed.',
    assessment: 'Anxiety symptoms remain active and appear linked to current stressors.',
    plan: 'Continue CBT formulation. Assign thought record and practice relaxation exercise before next session.',
  },
  Depression: {
    subjective: 'Client reports low mood, reduced motivation, and reduced pleasure in usual activities.',
    objective: 'Mood appears low. Engagement maintained throughout session.',
    assessment: 'Depressive symptoms require continued monitoring and behavioral activation work.',
    plan: 'Assign mood diary and one behavioral activation task. Review sleep and routine next session.',
  },
  Panic: {
    subjective: 'Client reports panic symptoms and fear of recurrence.',
    objective: 'Client able to describe physical symptoms and triggers with support.',
    assessment: 'Panic cycle psychoeducation and exposure planning remain indicated.',
    plan: 'Practice grounding and breathing. Begin graded exposure planning if clinically appropriate.',
  },
  Stress: {
    subjective: 'Client reports stress related to current responsibilities and workload.',
    objective: 'Client appears tired but engaged. Thought process linear.',
    assessment: 'Stress load is elevated and impacting coping capacity.',
    plan: 'Review stressors, identify controllable actions, and assign brief daily decompression practice.',
  },
  'Follow-up': {
    subjective: 'Client reports updates since the previous session.',
    objective: 'Presentation reviewed against previous baseline.',
    assessment: 'Progress and barriers reviewed. Treatment plan remains active.',
    plan: 'Continue current plan and schedule follow-up based on symptom trajectory.',
  },
};

const assessmentLabels: Array<{ type: CounsellorAssessmentType; label: string }> = [
  { type: 'phq_9', label: 'PHQ-9' },
  { type: 'gad_7', label: 'GAD-7' },
  { type: 'dass_21', label: 'DASS-21' },
  { type: 'pss', label: 'PSS' },
  { type: 'bdi_ii', label: 'BDI-II' },
];

const tabs = ['Overview', 'Notes', 'Assessments', 'CBT Care', 'Progress', 'Documents'];

export default function CounsellorSessionsPage() {
  const [sessions, setSessions] = useState<CounsellorSessionQueueItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [workspace, setWorkspace] = useState<CounsellorSessionWorkspace | null>(null);
  const [draft, setDraft] = useState<SoapDraft>({ subjective: '', objective: '', assessment: '', plan: '' });
  const [activeTab, setActiveTab] = useState('Overview');
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savingAction, setSavingAction] = useState('');
  const [homeworkTemplateId, setHomeworkTemplateId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [creatingCbtPlan, setCreatingCbtPlan] = useState(false);

  const closeNotification = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoadingQueue(true);
    getCounsellorSessionsRequest()
      .then((items) => {
        if (!isMounted) return;
        setSessions(items);
      })
      .catch((requestError: unknown) => {
        if (isMounted) setError(requestError instanceof Error ? requestError.message : 'Unable to load sessions.');
      })
      .finally(() => {
        if (isMounted) setLoadingQueue(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setWorkspace(null);
      return;
    }

    let isMounted = true;
    setLoadingWorkspace(true);
    setError('');
    getCounsellorSessionWorkspaceRequest(selectedId)
      .then((data) => {
        if (!isMounted) return;
        setWorkspace(data);
        setDraft({
          subjective: data.notes.subjective ?? '',
          objective: data.notes.objective ?? '',
          assessment: data.notes.assessment ?? '',
          plan: data.notes.plan ?? '',
        });
        setHomeworkTemplateId(data.cbt.homeworkTemplates[0]?.id ?? null);
      })
      .catch((requestError: unknown) => {
        if (isMounted) setError(requestError instanceof Error ? requestError.message : 'Unable to load session workspace.');
      })
      .finally(() => {
        if (isMounted) setLoadingWorkspace(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  const selectedSession = useMemo(() => sessions.find((item) => item.id === selectedId) ?? null, [selectedId, sessions]);
  const notification = error ? { tone: 'danger' as const, message: error } : message ? { tone: 'success' as const, message } : null;

  function replaceWorkspace(data: CounsellorSessionWorkspace, successMessage: string) {
    setWorkspace(data);
    setDraft({
      subjective: data.notes.subjective ?? '',
      objective: data.notes.objective ?? '',
      assessment: data.notes.assessment ?? '',
      plan: data.notes.plan ?? '',
    });
    setSessions((items) => items.map((item) => (item.id === data.session.id ? data.session : item)));
    setMessage(successMessage);
    setError('');
  }

  async function runWorkspaceAction(label: string, action: () => Promise<CounsellorSessionWorkspace>, successMessage: string) {
    if (!workspace) return;
    setSavingAction(label);
    setMessage('');
    setError('');
    try {
      replaceWorkspace(await action(), successMessage);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update session.');
    } finally {
      setSavingAction('');
    }
  }

  async function handleQueueAction(session: CounsellorSessionQueueItem) {
    setSelectedId(session.id);
    setFocusMode(true);
    if (session.workflowState !== 'upcoming') return;

    setSavingAction('start');
    setMessage('');
    setError('');
    try {
      replaceWorkspace(await startCounsellorSessionRequest(session.id), 'Session started.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to start session.');
    } finally {
      setSavingAction('');
    }
  }

  async function handleAssessment(type: CounsellorAssessmentType) {
    if (!workspace) return;
    setSavingAction(type);
    setMessage('');
    setError('');
    try {
      const result = await createCounsellorAssessmentRequest(workspace.session.id, { assessment_type: type, score: 0 });
      replaceWorkspace(result.workspace, 'Assessment recorded.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to record assessment.');
    } finally {
      setSavingAction('');
    }
  }

  async function handleSendHomework() {
    if (!workspace?.cbt.activePlan || !homeworkTemplateId) {
      setError('Create an active CBT plan before sending homework.');
      return;
    }

    setSavingAction('homework');
    setMessage('');
    setError('');
    try {
      await assignCounsellorCbtHomeworkRequest(workspace.cbt.activePlan.id, homeworkTemplateId);
      setMessage('CBT homework sent.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send homework.');
    } finally {
      setSavingAction('');
    }
  }

  async function handleCreateCbtPlan(payload: { title: string; primaryGoal: string; description: string }) {
    if (!workspace) return;
    setCreatingCbtPlan(true);
    setMessage('');
    setError('');
    try {
      await createCounsellorCbtPlanRequest(workspace.client.id, {
        title: payload.title,
        primary_goal: payload.primaryGoal,
        description: payload.description,
        status: 'active',
        start_date: new Date().toISOString().slice(0, 10),
        review_frequency: 'weekly',
        risk_level: 'low',
        goals: [{
          goal_title: payload.primaryGoal,
          goal_description: payload.description,
          baseline_score: 80,
          target_score: 40,
        }],
      });
      const refreshedWorkspace = await getCounsellorSessionWorkspaceRequest(workspace.session.id);
      replaceWorkspace(refreshedWorkspace, 'CBT plan created.');
      setHomeworkTemplateId(refreshedWorkspace.cbt.homeworkTemplates[0]?.id ?? null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create CBT plan.');
    } finally {
      setCreatingCbtPlan(false);
    }
  }

  return (
    <div className="space-y-5">
      <Snackbar tone={notification?.tone ?? 'success'} message={notification?.message ?? ''} onClose={closeNotification} />

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">Counsellor command center</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Sessions</h1>
        <p className="mt-1 text-sm text-slate-600">Today&apos;s queue, clinical context, notes, assessments, and next actions.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-950">Today&apos;s Sessions</h2>
          <span className="text-xs font-semibold text-slate-500">{sessions.length} scheduled</span>
        </div>
        {loadingQueue ? (
          <QueueSkeleton />
        ) : sessions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Session Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className={`border-t border-slate-100 ${selectedId === session.id ? 'bg-violet-50/70' : 'bg-white'}`}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{session.time ?? '-'}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => void handleQueueAction(session)} className="font-semibold text-slate-900 hover:text-violet-700">
                        {session.clientName}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{session.sessionType}</td>
                    <td className="px-4 py-3"><StatusBadge status={session.workflowState} /></td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => void handleQueueAction(session)} className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700">
                        {session.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-4 py-6 text-sm text-slate-500">No sessions scheduled for today.</p>
        )}
      </section>

      {focusMode && selectedSession ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFocusMode(false)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <ArrowLeft size={16} /> Back
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{selectedSession.time ?? '-'} - {selectedSession.sessionType}</p>
                  <h2 className="text-xl font-semibold text-slate-950">{selectedSession.clientName}</h2>
                </div>
              </div>
              <StatusBadge status={workspace?.notes.workflowState ?? selectedSession.workflowState} />
            </div>
          </div>

          <div className="mx-auto max-w-[1500px] space-y-4 px-5 py-5 pb-28">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${activeTab === tab ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {loadingWorkspace ? (
              <WorkspaceSkeleton />
            ) : workspace ? (
              <div className="grid min-h-[calc(100dvh-220px)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
                <ClientSnapshot workspace={workspace} activeTab={activeTab} />
                <NotesPanel draft={draft} setDraft={setDraft} />
                <ClinicalTools
                  workspace={workspace}
                  homeworkTemplateId={homeworkTemplateId}
                  setHomeworkTemplateId={setHomeworkTemplateId}
                onAssessment={handleAssessment}
                savingAction={savingAction}
                creatingCbtPlan={creatingCbtPlan}
                onCreateCbtPlan={handleCreateCbtPlan}
              />
              </div>
            ) : null}
          </div>

          {workspace ? (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-end gap-2">
                <ActionButton icon={<Save size={16} />} disabled={savingAction !== ''} onClick={() => runWorkspaceAction('save', () => saveCounsellorSessionNotesRequest(workspace.session.id, draft), 'Notes saved.')}>Save Notes</ActionButton>
                <ActionButton icon={<CheckCircle2 size={16} />} disabled={savingAction !== ''} onClick={() => runWorkspaceAction('complete', () => completeCounsellorSessionRequest(workspace.session.id), 'Session completed.')}>Complete Session</ActionButton>
                <ActionButton icon={<CalendarPlus size={16} />} disabled={savingAction !== ''} onClick={() => runWorkspaceAction('follow-up', () => followUpCounsellorSessionRequest(workspace.session.id), 'Follow-up marked.')}>Schedule Follow-up</ActionButton>
                <ActionButton icon={<ShieldAlert size={16} />} disabled={savingAction !== ''} onClick={() => runWorkspaceAction('escalate', () => escalateCounsellorSessionRequest(workspace.session.id), 'Case escalated.')}>Escalate Case</ActionButton>
                <ActionButton icon={<Send size={16} />} disabled={savingAction !== ''} onClick={handleSendHomework}>Send Homework</ActionButton>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ClientSnapshot({ workspace, activeTab }: { workspace: CounsellorSessionWorkspace; activeTab: string }) {
  const riskFlags = workspace.client.riskFlags.length ? workspace.client.riskFlags : [{ id: 0, label: 'No active risk', level: 'low' }];
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-950"><UserRound size={17} /> Client Snapshot</p>
      <div className="mt-4 space-y-4 text-sm">
        <div>
          <p className="text-lg font-semibold text-slate-950">{workspace.client.name}</p>
          <p className="text-slate-500">Age: {workspace.client.age ?? 'Not recorded'}</p>
          <p className="text-slate-500">Gender: {workspace.client.gender ?? 'Not recorded'}</p>
          <p className="text-slate-500">Occupation: {workspace.client.occupation ?? 'Not recorded'}</p>
        </div>
        <div>
          <SectionLabel icon={<AlertTriangle size={15} />}>Risk Flags</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-2">{riskFlags.map((risk) => <RiskPill key={risk.id} level={risk.level}>{risk.label}</RiskPill>)}</div>
        </div>
        <InfoList title="Previous Diagnoses" empty="No prior diagnoses recorded." items={workspace.client.previousDiagnoses} />
        <div>
          <SectionLabel icon={<FileText size={15} />}>Previous Session Summary</SectionLabel>
          <p className="mt-2 rounded-xl bg-slate-50 p-3 text-slate-600">{workspace.client.previousSessionSummary ?? 'No previous session summary available.'}</p>
        </div>
        <InfoList title="Current Treatment Plan" empty="No active treatment plan recorded." items={workspace.client.treatmentPlan} />
        <p className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">Viewing: {activeTab}</p>
      </div>
    </aside>
  );
}

function QueueSkeleton() {
  return (
    <div className="p-4">
      <div className="grid gap-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="grid animate-pulse gap-4 rounded-xl border border-slate-100 bg-white p-4 md:grid-cols-[120px_1fr_1fr_140px_140px]">
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="h-7 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-32 justify-self-end rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="grid min-h-[calc(100dvh-220px)] animate-pulse gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="mt-6 h-7 w-44" />
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-48" />
        </div>
        <SkeletonBlock className="mt-8 h-24 w-full rounded-xl" />
        <SkeletonBlock className="mt-4 h-24 w-full rounded-xl" />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-10 w-32 rounded-lg" />
        </div>
        <div className="mt-5 space-y-5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item}>
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-2 h-28 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SkeletonBlock className="h-5 w-32" />
        <div className="mt-6 grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-11 rounded-lg" />)}
        </div>
        <SkeletonBlock className="mt-6 h-24 w-full rounded-xl" />
        <SkeletonBlock className="mt-4 h-28 w-full rounded-xl" />
      </section>
    </div>
  );
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-slate-200/80 ${className}`} />;
}

function NotesPanel({ draft, setDraft }: { draft: SoapDraft; setDraft: (draft: SoapDraft) => void }) {
  function update(field: keyof SoapDraft, value: string) {
    setDraft({ ...draft, [field]: value });
  }

  return (
    <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-950">Live Session Notes</p>
        <button type="button" onClick={() => setDraft(noteTemplates.Anxiety)} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700">
          <PlayCircle size={15} /> Start Session
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        <SoapField label="Subjective" value={draft.subjective} onChange={(value) => update('subjective', value)} />
        <SoapField label="Objective" value={draft.objective} onChange={(value) => update('objective', value)} />
        <SoapField label="Assessment" value={draft.assessment} onChange={(value) => update('assessment', value)} />
        <SoapField label="Plan" value={draft.plan} onChange={(value) => update('plan', value)} />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Note Templates</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(noteTemplates).map(([label, template]) => (
            <button key={label} type="button" onClick={() => setDraft(template)} className="rounded-full border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50">
              {label} Session
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function ClinicalTools({
  workspace,
  homeworkTemplateId,
  setHomeworkTemplateId,
  onAssessment,
  savingAction,
  creatingCbtPlan,
  onCreateCbtPlan,
}: {
  workspace: CounsellorSessionWorkspace;
  homeworkTemplateId: number | null;
  setHomeworkTemplateId: (id: number | null) => void;
  onAssessment: (type: CounsellorAssessmentType) => void;
  savingAction: string;
  creatingCbtPlan: boolean;
  onCreateCbtPlan: (payload: { title: string; primaryGoal: string; description: string }) => Promise<void>;
}) {
  const [planTitle, setPlanTitle] = useState(`${workspace.client.name} CBT Plan`);
  const [primaryGoal, setPrimaryGoal] = useState('Build coping skills and reduce current distress.');
  const [description, setDescription] = useState('Session-created CBT plan for structured homework and follow-up.');

  useEffect(() => {
    if (!workspace.cbt.activePlan) {
      setPlanTitle(`${workspace.client.name} CBT Plan`);
      setPrimaryGoal('Build coping skills and reduce current distress.');
      setDescription('Session-created CBT plan for structured homework and follow-up.');
    }
  }, [workspace.client.name, workspace.cbt.activePlan]);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-950"><ClipboardCheck size={17} /> Clinical Tools</p>
      <div className="mt-4 space-y-5">
        <div>
          <SectionLabel icon={<ClipboardCheck size={15} />}>Assessments</SectionLabel>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {assessmentLabels.map((item) => (
              <button key={item.type} type="button" disabled={savingAction !== ''} onClick={() => onAssessment(item.type)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {workspace.assessments.slice(0, 3).map((assessment) => (
              <p key={assessment.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {assessment.assessmentType.toUpperCase().replace('_', '-')} - {assessment.severity ?? 'Recorded'} ({assessment.score})
              </p>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel icon={<Brain size={15} />}>CBT Homework</SectionLabel>
          {workspace.cbt.activePlan ? (
            <>
              <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">{workspace.cbt.activePlan.title}</p>
              <select value={homeworkTemplateId ?? ''} onChange={(event) => setHomeworkTemplateId(event.target.value ? Number(event.target.value) : null)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                {workspace.cbt.homeworkTemplates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
              </select>
            </>
          ) : (
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-900">Create CBT plan first before sending homework.</p>
              <div className="mt-3 space-y-2">
                <CompactInput label="Plan title" value={planTitle} onChange={setPlanTitle} />
                <CompactInput label="Primary goal" value={primaryGoal} onChange={setPrimaryGoal} />
                <label className="block text-xs font-semibold uppercase tracking-wide text-amber-900">
                  Description
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 min-h-20 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-violet-500" />
                </label>
                <button
                  type="button"
                  disabled={creatingCbtPlan || !planTitle.trim() || !primaryGoal.trim()}
                  onClick={() => void onCreateCbtPlan({ title: planTitle.trim(), primaryGoal: primaryGoal.trim(), description: description.trim() })}
                  className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingCbtPlan ? 'Creating plan...' : 'Create CBT Plan'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <SectionLabel icon={<FileText size={15} />}>Resources</SectionLabel>
          <div className="mt-2 grid gap-2 text-sm text-slate-600">
            <p className="rounded-lg bg-slate-50 px-3 py-2">Worksheets</p>
            <p className="rounded-lg bg-slate-50 px-3 py-2">Videos</p>
            <p className="rounded-lg bg-slate-50 px-3 py-2">PDF resources</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SoapField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
    </label>
  );
}

function CompactInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-amber-900">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-violet-500" />
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'completed' ? 'emerald' : status === 'escalated' ? 'rose' : status === 'in_progress' ? 'blue' : status === 'notes_pending' || status === 'follow_up_required' ? 'amber' : 'slate';
  const styles = {
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  } as const;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{labelFromValue(status)}</span>;
}

function RiskPill({ level, children }: { level: string; children: ReactNode }) {
  const className = level === 'critical' || level === 'high' ? 'bg-rose-50 text-rose-700' : level === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{icon}{children}</p>;
}

function InfoList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <SectionLabel icon={<FileText size={15} />}>{title}</SectionLabel>
      <ul className="mt-2 space-y-1 text-slate-600">
        {items.length ? items.map((item) => <li key={item}>- {item}</li>) : <li>{empty}</li>}
      </ul>
    </div>
  );
}

function Snackbar({ tone, message, onClose }: { tone: 'success' | 'danger'; message: string; onClose: () => void }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = tone === 'success';

  return (
    <div className="fixed right-5 top-5 z-[80] w-[min(calc(100vw-2rem),420px)]">
      <div
        role={isSuccess ? 'status' : 'alert'}
        className={`flex items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-sm shadow-2xl shadow-slate-900/10 ${
          isSuccess ? 'border-emerald-200 text-emerald-800' : 'border-rose-200 text-rose-800'
        }`}
      >
        <span className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        </span>
        <p className="min-w-0 flex-1 py-1 font-semibold leading-5">{message}</p>
        <button
          type="button"
          aria-label="Close notification"
          onClick={onClose}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function ActionButton({ icon, children, disabled, onClick }: { icon: ReactNode; children: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
      {icon}{children}
    </button>
  );
}

function labelFromValue(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
