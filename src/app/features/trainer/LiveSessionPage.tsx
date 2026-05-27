import { useEffect, useState } from 'react';
import {
  Client360Card,
  CoachObservationsCard,
  EnergyCheckInCard,
  KeyMetricsCard,
  LiveSessionTopbar,
  QuickNotesCard,
  SessionControls,
  WorkoutPlanCard,
  type SessionControlState,
} from './components/LiveSessionComponents';
import {
  liveSessionMockData,
  type EnergyOption,
  type ExerciseStatus,
  type WorkoutExercise,
} from './mockLiveSessionData';

const statusCycle: Record<ExerciseStatus, ExerciseStatus> = {
  Pending: 'In Progress',
  'In Progress': 'Complete',
  Complete: 'Pending',
};

function formatTimer(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export default function LiveSessionPage() {
  const [seconds, setSeconds] = useState(liveSessionMockData.initialSeconds);
  const [sessionStatus, setSessionStatus] = useState<SessionControlState>('ready');
  const [exercises, setExercises] = useState<WorkoutExercise[]>(liveSessionMockData.workoutPlan.exercises);
  const [notes, setNotes] = useState(liveSessionMockData.quickNotes);
  const [energyId, setEnergyId] = useState<EnergyOption['id']>(liveSessionMockData.selectedEnergyId);
  const ended = sessionStatus === 'ended';

  useEffect(() => {
    if (sessionStatus !== 'running') return undefined;
    const interval = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [sessionStatus]);

  function cycleExerciseStatus(exerciseId: string) {
    if (ended) return;
    setExercises((items) => items.map((exercise) => (
      exercise.id === exerciseId ? { ...exercise, status: statusCycle[exercise.status] } : exercise
    )));
  }

  const controls = (
    <SessionControls
      status={sessionStatus}
      onStart={() => setSessionStatus('running')}
      onPause={() => setSessionStatus('paused')}
      onEnd={() => setSessionStatus('ended')}
    />
  );

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_right,#f3f1ff_0%,#ffffff_38%,#fafbff_100%)] lg:min-h-screen">
      <LiveSessionTopbar timer={formatTimer(seconds)} messageCount={liveSessionMockData.messageCount} ended={ended} />
      <div className="space-y-4 px-5 pb-28 sm:px-7 md:pb-28 lg:grid lg:grid-cols-[minmax(285px,0.78fr)_minmax(520px,1.48fr)_minmax(300px,0.9fr)] lg:items-start lg:gap-4 lg:space-y-0 lg:px-6 lg:py-4 lg:pb-4">
        <Client360Card client={liveSessionMockData.client} />
        <WorkoutPlanCard
          plan={liveSessionMockData.workoutPlan}
          exercises={exercises}
          disabled={ended}
          onStatusCycle={cycleExerciseStatus}
          controls={controls}
        />
        <aside className="grid gap-4 md:grid-cols-2 lg:flex lg:flex-col">
          <div className="order-1 md:col-span-2 lg:order-1">
            <QuickNotesCard notes={notes} disabled={ended} onChange={setNotes} />
          </div>
          <div className="order-2 lg:order-3">
            <EnergyCheckInCard options={liveSessionMockData.energyOptions} selectedId={energyId} disabled={ended} onSelect={setEnergyId} />
          </div>
          <div className="order-3 lg:order-4">
            <KeyMetricsCard metrics={liveSessionMockData.keyMetrics} />
          </div>
          <div className="order-4 md:col-span-2 lg:order-2">
            <CoachObservationsCard observations={liveSessionMockData.observations} />
          </div>
        </aside>
      </div>
      <div className="fixed inset-x-3 bottom-[calc(78px+env(safe-area-inset-bottom))] z-20 sm:inset-x-7 lg:hidden">
        <SessionControls
          compact
          status={sessionStatus}
          onStart={() => setSessionStatus('running')}
          onPause={() => setSessionStatus('paused')}
          onEnd={() => setSessionStatus('ended')}
        />
      </div>
    </div>
  );
}
