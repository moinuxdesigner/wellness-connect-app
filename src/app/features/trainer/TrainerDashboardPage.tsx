import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { getActivityLogs } from '../shared/services/activityApi';
import { getAuthState } from '../auth/auth';
import { getTrainerDashboard, type TrainerDashboard } from './trainerWorkspaceApi';
import { buildTrainerDashboardViewModel, coachGreetingName, type TrainerDashboardViewModel } from './trainerDashboardViewModel';
import {
  ClientAlertsCard,
  CompactAlertsCard,
  CompactFocusCard,
  CompactPriorityActionsCard,
  CompactScheduleCard,
  RecentActivityCard,
  StatCard,
  TodayScheduleCard,
  UpcomingRenewalsCard,
  WeeklyPerformanceCard,
} from './components/TrainerCommandCenterCards';

export default function TrainerDashboardPage() {
  const trainerName = getAuthState().user?.name ?? 'Coach Arjun';
  const greetingName = coachGreetingName(trainerName);
  const [viewModel, setViewModel] = useState<TrainerDashboardViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      getTrainerDashboard(),
      getActivityLogs({ pageSize: 4 }).catch(() => ({ entries: [], pagination: { page: 1, pageSize: 4, total: 0, totalPages: 1 }, availableCategories: [] })),
    ])
      .then(([dashboard, activity]) => {
        if (!mounted) return;
        setViewModel(buildTrainerDashboardViewModel(dashboard as TrainerDashboard, activity.entries));
        setError('');
      })
      .catch((reason) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : 'Unable to load the trainer dashboard right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 lg:space-y-4">
      <header className="pb-1 lg:hidden">
        <h1 className="whitespace-nowrap text-[1.45rem] font-semibold tracking-tight text-[#101842] sm:text-[1.7rem]">
          Good morning, {greetingName} <span aria-hidden="true">{'\u{1F44B}'}</span>
        </h1>
        <p className="mt-1 text-[15px] text-slate-500">Here&apos;s your overview for today.</p>
      </header>
      <header className="hidden pb-1 lg:block">
        <h1 className="text-[1.75rem] font-semibold tracking-tight text-[#101842]">
          Good morning, {greetingName} <span aria-hidden="true">{'\u{1F44B}'}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s your overview for today.</p>
      </header>

      {error ? <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? <TrainerDashboardSkeleton /> : viewModel ? (
        <>
          <div className="space-y-5 lg:hidden">
            <CompactFocusCard focus={viewModel.compact.focus} />
            <div className="space-y-5 md:grid md:grid-cols-2 md:items-start md:gap-5 md:space-y-0">
              <CompactScheduleCard rows={viewModel.schedule.slice(0, 4)} />
              <div className="space-y-5">
                <CompactPriorityActionsCard actions={viewModel.compact.priorityActions} />
                <CompactAlertsCard alerts={viewModel.alerts} />
              </div>
            </div>
            <CompactSecondaryPanels viewModel={viewModel} />
            <div className="hidden space-y-4 md:grid md:grid-cols-2 md:items-start md:gap-4 md:space-y-0">
              <RecentActivityCard activities={viewModel.activities} />
              <UpcomingRenewalsCard renewals={viewModel.renewals} />
              <div className="md:col-span-2">
                <WeeklyPerformanceCard stats={viewModel.performance} chart={viewModel.chart} />
              </div>
            </div>
          </div>
          <div className="hidden space-y-4 lg:block">
            <section className="grid grid-cols-4 gap-4">
              {viewModel.stats.map((stat) => <StatCard key={stat.title} stat={stat} />)}
            </section>
            <section className="grid grid-cols-[minmax(0,1.62fr)_minmax(380px,1fr)] gap-4">
              <div className="space-y-4">
                <TodayScheduleCard rows={viewModel.schedule} />
                <WeeklyPerformanceCard stats={viewModel.performance} chart={viewModel.chart} />
              </div>
              <aside className="space-y-3">
                <ClientAlertsCard alerts={viewModel.alerts} />
                <RecentActivityCard activities={viewModel.activities} />
                <UpcomingRenewalsCard renewals={viewModel.renewals} />
              </aside>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CompactSecondaryPanels({ viewModel }: { viewModel: TrainerDashboardViewModel }) {
  return (
    <Accordion type="multiple" className="rounded-2xl border border-slate-100 bg-white px-4 shadow-[0_2px_14px_rgba(30,41,59,0.04)] md:hidden">
      <AccordionItem value="activity" className="border-slate-100">
        <AccordionTrigger className="py-4 text-sm font-semibold text-[#101842] hover:no-underline">Recent Activity</AccordionTrigger>
        <AccordionContent><RecentActivityCard activities={viewModel.activities} /></AccordionContent>
      </AccordionItem>
      <AccordionItem value="renewals" className="border-slate-100">
        <AccordionTrigger className="py-4 text-sm font-semibold text-[#101842] hover:no-underline">Upcoming Renewals</AccordionTrigger>
        <AccordionContent><UpcomingRenewalsCard renewals={viewModel.renewals} /></AccordionContent>
      </AccordionItem>
      <AccordionItem value="performance" className="border-slate-100">
        <AccordionTrigger className="py-4 text-sm font-semibold text-[#101842] hover:no-underline">This Week&apos;s Performance</AccordionTrigger>
        <AccordionContent><WeeklyPerformanceCard stats={viewModel.performance} chart={viewModel.chart} /></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function TrainerDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4 lg:hidden">
        <div className="h-[172px] animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-[330px] animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[120px] animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      </div>
      <div className="hidden grid-cols-4 gap-4 lg:grid">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[122px] animate-pulse rounded-2xl bg-slate-100" />)}
      </div>
      <div className="hidden grid-cols-[minmax(0,1.62fr)_minmax(380px,1fr)] gap-4 lg:grid">
        <div className="h-[610px] animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-[610px] animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
