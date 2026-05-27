import { useEffect, useState } from 'react';
import {
  getTrainerProgressMessages,
  getTrainerProgressReview,
  sendTrainerProgressMessage,
  type MessageAttachment,
  type ProgressReviewPayload,
  type ProgressThreadMessage,
} from './trainerWorkspaceApi';
import {
  progressReviewMockData,
  type BodyMetricTrend,
  type MessageThreadItem,
  type ProgressKpi,
  type ProgressReviewMockData,
} from './mockProgressReviewData';

export type ProgressReviewWorkspaceData = {
  trainer: ProgressReviewMockData['trainer'];
  dateRange: ProgressReviewMockData['dateRange'];
  client: ProgressReviewPayload['client'];
  overview: ProgressReviewPayload['overview'];
  kpis: ProgressKpi[];
  progressTrend: Array<{ label: string; score: number; trend: number }>;
  bodyMetrics: BodyMetricTrend[];
  completedWorkouts: Array<{ label: string; count: number }>;
  muscleFocus: ProgressReviewMockData['muscleFocus'];
  recommendations: ProgressReviewMockData['recommendations'];
  messages: MessageThreadItem[];
  quickActions: ProgressReviewMockData['quickActions'];
  activePlan: ProgressReviewPayload['activePlan'];
  notificationUnreadCount: number;
};

function formatSignedNumber(value: number, suffix = ''): string {
  const absolute = Math.abs(value);
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}${absolute.toFixed(absolute % 1 === 0 ? 0 : 1)}${suffix}`;
}

function formatWeightChange(value: number | null): { value: string; supportingText: string; tone: ProgressKpi['tone'] } {
  if (value === null) {
    return { value: '--', supportingText: 'Awaiting check-ins', tone: 'neutral' };
  }

  return {
    value: `${formatSignedNumber(value)} kg`,
    supportingText: `${formatSignedNumber(value)} kg vs last 30 days`,
    tone: value <= 0 ? 'success' : 'neutral',
  };
}

function formatTimeLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Now';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatAttachmentSize(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  if (sizeBytes >= 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${sizeBytes} B`;
}

function mapRealMessage(message: ProgressThreadMessage): MessageThreadItem {
  return {
    id: `real-${message.id}`,
    senderName: message.sender.name,
    senderRole: message.sender.role === 'trainer' ? 'trainer' : 'client',
    timestampLabel: formatTimeLabel(message.createdAt),
    body: message.body,
    attachment: message.attachment ? {
      name: message.attachment.name,
      type: message.attachment.type,
      sizeLabel: formatAttachmentSize(message.attachment.sizeBytes),
    } : undefined,
  };
}

function mapSeedMessage(message: MessageThreadItem, clientName: string, trainerName: string): MessageThreadItem {
  return {
    ...message,
    senderName: message.senderRole === 'trainer' ? trainerName : clientName,
  };
}

function buildBodyMetrics(payload: ProgressReviewPayload): BodyMetricTrend[] {
  const weightMetric = progressReviewMockData.bodyMetrics.find((metric) => metric.id === 'weight');
  const realWeight = payload.bodyMetrics.weight;
  const startValue = realWeight.start === null ? weightMetric?.startValue ?? '--' : realWeight.start.toFixed(1);
  const currentValue = realWeight.current === null ? weightMetric?.currentValue ?? '--' : realWeight.current.toFixed(1);
  const change = realWeight.change === null ? weightMetric?.change ?? '--' : `${formatSignedNumber(realWeight.change)} kg`;

  return progressReviewMockData.bodyMetrics.map((metric) => metric.id === 'weight'
    ? { ...metric, startValue, currentValue, change, tone: realWeight.change !== null && realWeight.change <= 0 ? 'success' : 'neutral' }
    : metric);
}

function buildKpis(payload: ProgressReviewPayload): ProgressKpi[] {
  const weight = formatWeightChange(payload.overview.weightChangeKg);
  const adherenceValue = payload.overview.workoutAdherencePercent === null ? '--' : `${Math.round(payload.overview.workoutAdherencePercent)}%`;

  return [
    {
      id: 'weight-change',
      title: 'Weight Change',
      icon: 'scale',
      value: weight.value,
      supportingText: weight.supportingText,
      tone: weight.tone,
      usesInfoDot: true,
    },
    {
      id: 'strength-gain',
      title: 'Strength Gain',
      icon: 'dumbbell',
      value: '+18%',
      supportingText: '+18% vs last 30 days',
      tone: 'success',
      usesInfoDot: true,
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: 'calendar',
      value: `${payload.overview.attendanceCompleted} / ${payload.overview.attendanceTotal}`,
      supportingText: payload.overview.attendanceTotal > 0
        ? `${Math.round((payload.overview.attendanceCompleted / payload.overview.attendanceTotal) * 100)}% session attendance`
        : 'No completed session history',
      tone: payload.overview.attendanceCompleted > 0 ? 'success' : 'neutral',
      usesInfoDot: true,
    },
    {
      id: 'workout-adherence',
      title: 'Workout Adherence',
      icon: 'target',
      value: adherenceValue,
      supportingText: `${formatSignedNumber(payload.overview.workoutAdherenceTrendPercent)}% vs last 30 days`,
      tone: payload.overview.workoutAdherencePercent !== null && payload.overview.workoutAdherencePercent >= 75 ? 'success' : 'neutral',
      usesInfoDot: true,
    },
  ];
}

function buildProgressTrend(payload: ProgressReviewPayload): Array<{ label: string; score: number; trend: number }> {
  const fallbackScores = [15, 38, 50, 62, 78, 90];
  const resolvedScores = payload.progressTrend.map((point, index) => point.performanceScore ?? fallbackScores[index] ?? 0);

  return payload.progressTrend.map((point, index) => {
    const score = resolvedScores[index] ?? 0;
    const firstScore = resolvedScores[0] ?? score;
    const lastScore = resolvedScores[resolvedScores.length - 1] ?? score;
    const denominator = Math.max(resolvedScores.length - 1, 1);
    const trend = firstScore + ((lastScore - firstScore) * index) / denominator;

    return {
      label: point.label,
      score,
      trend: Math.round(trend),
    };
  });
}

function buildCompletedWorkouts(payload: ProgressReviewPayload): Array<{ label: string; count: number }> {
  const total = payload.completedWorkouts.reduce((sum, point) => sum + point.count, 0);
  if (total > 0) return payload.completedWorkouts.map((point) => ({ label: point.label, count: point.count }));

  return [
    { label: 'May 12-18', count: 16 },
    { label: 'May 19-25', count: 18 },
    { label: 'May 26-Jun 1', count: 20 },
    { label: 'Jun 2-Jun 12', count: 22 },
  ];
}

function mergeMessages(realMessages: ProgressThreadMessage[], clientName: string, trainerName: string): MessageThreadItem[] {
  if (realMessages.length > 0) {
    return realMessages.map(mapRealMessage);
  }

  return progressReviewMockData.messages.map((message) => mapSeedMessage(message, clientName, trainerName));
}

function resolveClientProfile(client: ProgressReviewPayload['client']): ProgressReviewPayload['client'] {
  const fallback = progressReviewMockData.clientFallback;
  const normalizedName = client.name.trim();
  const shouldUseFallbackName = !normalizedName || /^client user$/i.test(normalizedName);

  return {
    ...client,
    name: shouldUseFallbackName ? fallback.name : client.name,
    status: client.status?.trim() ? client.status : fallback.status,
    age: client.age ?? fallback.age,
    gender: client.gender?.trim() ? client.gender : fallback.gender,
  };
}

function buildWorkspacePayload(payload: ProgressReviewPayload, messages: ProgressThreadMessage[]): ProgressReviewWorkspaceData {
  const client = resolveClientProfile(payload.client);

  return {
    trainer: progressReviewMockData.trainer,
    dateRange: progressReviewMockData.dateRange,
    client,
    overview: payload.overview,
    kpis: buildKpis(payload),
    progressTrend: buildProgressTrend(payload),
    bodyMetrics: buildBodyMetrics(payload),
    completedWorkouts: buildCompletedWorkouts(payload),
    muscleFocus: progressReviewMockData.muscleFocus,
    recommendations: progressReviewMockData.recommendations,
    messages: mergeMessages(messages, client.name, progressReviewMockData.trainer.name),
    quickActions: progressReviewMockData.quickActions,
    activePlan: payload.activePlan,
    notificationUnreadCount: payload.notificationUnreadCount,
  };
}

export function useProgressReviewData(clientId: number | null) {
  const [payload, setPayload] = useState<ProgressReviewWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!clientId) {
      setPayload(null);
      setLoading(false);
      setError('');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    Promise.all([
      getTrainerProgressReview(clientId),
      getTrainerProgressMessages(clientId),
    ])
      .then(([progressPayload, messagePayload]) => {
        if (!active) return;
        setPayload(buildWorkspacePayload(progressPayload, messagePayload.messages));
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Unable to load progress review data.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clientId]);

  async function sendMessage(input: { body?: string; attachment?: MessageAttachment | null }) {
    if (!clientId) throw new Error('Client context is missing.');

    const message = await sendTrainerProgressMessage(clientId, input);
    setPayload((current) => current ? { ...current, messages: [...current.messages, mapRealMessage(message)] } : current);
  }

  return { payload, loading, error, sendMessage };
}
