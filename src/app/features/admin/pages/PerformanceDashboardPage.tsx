import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { PageTitle } from '../AdminLayout';
import { Panel, ToneBadge } from '../../shared/components/Ui';
import {
  getAdminPerformance,
  type AdminPerformanceDashboard,
  type PerformanceExceptionRow,
  type PerformanceSummaryCard,
  type PerformanceTrendSeries,
  type PerformanceWindow,
  type UtilizationMetric,
} from '../../shared/services/adminApi';

const WINDOW_OPTIONS: Array<{ value: PerformanceWindow; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

function formatMetric(value: number | null, unit: PerformanceSummaryCard['unit']) {
  if (value === null) return 'No data';
  if (unit === 'percent') return `${value.toFixed(1)}%`;
  if (unit === 'minutes') return `${value.toFixed(1)}m`;
  if (unit === 'hours') return `${value.toFixed(1)}h`;
  return `${value}`;
}

function exceptionTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'breached' || status === 'rejected') return 'danger';
  if (status === 'resolved' || status === 'approved') return 'success';
  if (status === 'open' || status === 'acknowledged' || status === 'under_review' || status === 'submitted') return 'warning';
  return 'neutral';
}

function priorityTone(priority: PerformanceExceptionRow['priority']): 'success' | 'warning' | 'danger' | 'neutral' {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  if (priority === 'low') return 'success';
  return 'neutral';
}

function formatDue(value: string | null) {
  return value ? new Date(value).toLocaleString() : 'No due date';
}

function buildOutcomeOption(labels: string[], series: PerformanceTrendSeries[]): echarts.EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    grid: { left: 20, right: 18, top: 18, bottom: 36, containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
    },
    series: series.map((item) => ({
      name: item.label,
      type: 'line',
      smooth: true,
      data: item.data,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: item.key === 'completed' ? '#059669' : item.key === 'cancelled' ? '#f59e0b' : '#dc2626',
      },
      itemStyle: {
        color: item.key === 'completed' ? '#059669' : item.key === 'cancelled' ? '#f59e0b' : '#dc2626',
      },
    })),
  };
}

function buildWorkflowOption(labels: string[], openedSeries: number[], resolvedSeries: number[], title: string): echarts.EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    title: {
      text: title,
      left: 'center',
      top: 0,
      textStyle: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
    },
    grid: { left: 20, right: 18, top: 40, bottom: 36, containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
    },
    series: [
      {
        name: 'Opened',
        type: 'bar',
        data: openedSeries,
        itemStyle: { color: '#2563eb', borderRadius: 6 },
      },
      {
        name: 'Resolved',
        type: 'line',
        smooth: true,
        data: resolvedSeries,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#14b8a6' },
        itemStyle: { color: '#14b8a6' },
      },
    ],
  };
}

export default function PerformanceDashboardPage() {
  const [windowValue, setWindowValue] = useState<PerformanceWindow>('30d');
  const [dashboard, setDashboard] = useState<AdminPerformanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getAdminPerformance(windowValue)
      .then((data) => {
        if (!active) return;
        setDashboard(data);
      })
      .catch((nextError) => {
        if (!active) return;
        setDashboard(null);
        setError(nextError instanceof Error ? nextError.message : 'Unable to load performance dashboard.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [windowValue]);

  return (
    <div className="space-y-6">
      <PageTitle title="Performance Dashboard" subtitle="Live operational KPIs across appointments, support, workflows, and trainer reviews." />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Reporting window</p>
          <p className="mt-1 text-sm text-slate-500">The dashboard only shows real metrics supported by current application data.</p>
        </div>
        <select
          value={windowValue}
          onChange={(event) => setWindowValue(event.target.value as PerformanceWindow)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700"
        >
          {WINDOW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            ))
          : dashboard?.summaryCards.map((card) => (
              <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMetric(card.value, card.unit)}</p>
                  </div>
                  <ToneBadge tone={card.tone}>{card.unit}</ToneBadge>
                </div>
                <p className="mt-3 text-xs text-slate-500">{card.deltaLabel}</p>
              </article>
            ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Appointment outcomes over time">
          {loading ? (
            <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
          ) : dashboard ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat label="Completion rate" value={formatMetric(dashboard.appointmentTrends.completionRate, 'percent')} />
                <MiniStat label="No-show rate" value={formatMetric(dashboard.appointmentTrends.noShowRate, 'percent')} />
              </div>
              <Chart
                height={320}
                option={buildOutcomeOption(dashboard.appointmentTrends.labels, dashboard.appointmentTrends.series)}
              />
            </div>
          ) : (
            <EmptyPanel message="No appointment performance data is available for this window." />
          )}
        </Panel>

        <Panel title="Workflow responsiveness">
          {loading ? (
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : dashboard ? (
            <div className="space-y-6">
              <Chart
                height={240}
                option={buildWorkflowOption(
                  dashboard.workflowPerformance.labels,
                  dashboard.workflowPerformance.escalation.openedSeries,
                  dashboard.workflowPerformance.escalation.resolvedSeries,
                  'Critical risk escalations',
                )}
              />
              <Chart
                height={240}
                option={buildWorkflowOption(
                  dashboard.workflowPerformance.labels,
                  dashboard.workflowPerformance.support.openedSeries,
                  dashboard.workflowPerformance.support.resolvedSeries,
                  'Support workflow cases',
                )}
              />
            </div>
          ) : (
            <EmptyPanel message="No workflow responsiveness data is available for this window." />
          )}
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel title="Team utilization">
          {dashboard ? (
            <div className="space-y-4">
              <UtilizationRow metric={dashboard.utilization.counsellor} />
              <UtilizationRow metric={dashboard.utilization.trainer} />
            </div>
          ) : <EmptyPanel message="No practitioner slot capacity recorded in this window." />}
        </Panel>

        <Panel title="Escalation health">
          {dashboard ? (
            <DetailGrid
              items={[
                ['Open now', dashboard.workflowPerformance.escalation.openNow],
                ['Breached now', dashboard.workflowPerformance.escalation.breachedNow],
                ['Opened in window', dashboard.workflowPerformance.escalation.opened],
                ['Resolved in window', dashboard.workflowPerformance.escalation.resolved],
                ['Breach rate', formatMetric(dashboard.workflowPerformance.escalation.breachRate, 'percent')],
                ['Median resolution', formatMetric(dashboard.workflowPerformance.escalation.medianResolutionMinutes, 'minutes')],
              ]}
            />
          ) : <EmptyPanel message="No escalation data is available for this window." />}
        </Panel>

        <Panel title="Support responsiveness">
          {dashboard ? (
            <DetailGrid
              items={[
                ['Open now', dashboard.workflowPerformance.support.openNow],
                ['Breached now', dashboard.workflowPerformance.support.breachedNow],
                ['Opened in window', dashboard.workflowPerformance.support.opened],
                ['Acknowledged', dashboard.workflowPerformance.support.acknowledged],
                ['Resolved', dashboard.workflowPerformance.support.resolved],
                ['Median first response', formatMetric(dashboard.workflowPerformance.support.medianFirstResponseMinutes, 'minutes')],
              ]}
            />
          ) : <EmptyPanel message="No support workflow data is available for this window." />}
        </Panel>
      </section>

      <Panel title="Trainer applications">
        {dashboard ? (
          <DetailGrid
            items={[
              ['Submitted', dashboard.trainerApplicationPerformance.submitted],
              ['Under review', dashboard.trainerApplicationPerformance.underReview],
              ['Resolved', dashboard.trainerApplicationPerformance.resolved],
              ['Median turnaround', formatMetric(dashboard.trainerApplicationPerformance.medianTurnaroundHours, 'hours')],
            ]}
            columns={4}
          />
        ) : <EmptyPanel message="No trainer application data is available for this window." />}
      </Panel>

      <section className="grid gap-6 xl:grid-cols-3">
        <ExceptionPanel title="Escalation exceptions" rows={dashboard?.exceptions.escalations ?? []} />
        <ExceptionPanel title="Support exceptions" rows={dashboard?.exceptions.supportCases ?? []} />
        <ExceptionPanel title="Pending trainer reviews" rows={dashboard?.exceptions.trainerApplications ?? []} />
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function UtilizationRow({ metric }: { metric: UtilizationMetric }) {
  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{metric.label}</p>
          <p className="mt-1 text-sm text-slate-500">
            {metric.denominator > 0 ? `${metric.numerator} booked of ${metric.denominator} open/booked slots` : 'No slot capacity recorded'}
          </p>
        </div>
        <ToneBadge tone={metric.percentage === null ? 'neutral' : metric.percentage >= 75 ? 'success' : metric.percentage >= 50 ? 'warning' : 'danger'}>
          {metric.percentage === null ? 'No data' : `${metric.percentage.toFixed(1)}%`}
        </ToneBadge>
      </div>
    </div>
  );
}

function DetailGrid({
  items,
  columns = 3,
}: {
  items: Array<[string, number | string]>;
  columns?: number;
}) {
  return (
    <div className={`grid gap-3 ${columns === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function ExceptionPanel({ title, rows }: { title: string; rows: PerformanceExceptionRow[] }) {
  return (
    <Panel title={title}>
      <div className="space-y-3">
        {rows.length ? rows.map((row) => (
          <article key={`${title}-${row.id}`} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{row.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{row.secondaryLabel || 'No extra details'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {row.priority ? <ToneBadge tone={priorityTone(row.priority)}>{row.priority}</ToneBadge> : null}
                <ToneBadge tone={exceptionTone(row.status)}>{row.status}</ToneBadge>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-500">
              <p>Owner role: {row.ownerRole}</p>
              <p>Due: {formatDue(row.dueAt)}</p>
              <p>Age: {row.ageHours !== null ? `${row.ageHours}h` : 'Unknown'}</p>
            </div>
          </article>
        )) : (
          <EmptyPanel message="No exceptions in this category right now." />
        )}
      </div>
    </Panel>
  );
}

function Chart({ option, height }: { option: echarts.EChartsOption; height: number }) {
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
