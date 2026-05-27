export type TrainerProfile = {
  name: string;
  title: string;
  avatarUrl: string;
  online: boolean;
};

export type ClientGoal = {
  id: string;
  label: string;
};

export type BodyMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: 'positive' | 'healthy';
};

export type RecentActivity = {
  label: string;
  value: string;
  tone?: 'positive';
};

export type ClientProfile = {
  name: string;
  avatarUrl: string;
  status: string;
  age: number;
  gender: string;
  goals: ClientGoal[];
  program: string;
  bodyMetrics: BodyMetric[];
  mobilityNotes: string[];
  recentActivity: RecentActivity[];
};

export type ExerciseStatus = 'Pending' | 'In Progress' | 'Complete';

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  thumbnailUrl: string;
  status: ExerciseStatus;
};

export type EnergyOption = {
  id: 'low' | 'okay' | 'good' | 'great';
  label: string;
  face: string;
  color: 'rose' | 'amber' | 'blue' | 'green';
};

export type SessionMetric = {
  id: string;
  label: string;
  value: string;
  icon: 'calories' | 'heartRate' | 'load' | 'rpe';
};

export type WorkoutPlan = {
  warmup: string;
  sessionGoal: string;
  sessionFocus: string[];
  exercises: WorkoutExercise[];
};

export type LiveSessionData = {
  trainer: TrainerProfile;
  client: ClientProfile;
  initialSeconds: number;
  messageCount: number;
  workoutPlan: WorkoutPlan;
  quickNotes: string;
  observations: string[];
  energyOptions: EnergyOption[];
  selectedEnergyId: EnergyOption['id'];
  keyMetrics: SessionMetric[];
};

export const liveSessionMockData: LiveSessionData = {
  trainer: {
    name: 'Coach Arjun',
    title: 'Personal Trainer',
    avatarUrl: '/images/ui_faces/uifaces-popular-avatar.jpg',
    online: true,
  },
  client: {
    name: 'Neha Verma',
    avatarUrl: '/images/ui_faces/uifaces-human-avatar (1).jpg',
    status: 'Active',
    age: 28,
    gender: 'Female',
    goals: [
      { id: 'strength', label: 'Build Strength' },
      { id: 'tone', label: 'Tone Body' },
      { id: 'mobility', label: 'Improve Mobility' },
    ],
    program: 'Strength & Hypertrophy (12 Weeks)',
    bodyMetrics: [
      { id: 'weight', label: 'Weight', value: '62.4 kg', change: '-1.2 kg \u2193', tone: 'positive' },
      { id: 'fat', label: 'Body Fat', value: '26.1%', change: '-1.8% \u2193', tone: 'positive' },
      { id: 'muscle', label: 'Muscle Mass', value: '45.2 kg', change: '+1.3 kg \u2191', tone: 'positive' },
      { id: 'bmi', label: 'BMI', value: '22.1', change: 'Healthy', tone: 'healthy' },
    ],
    mobilityNotes: ['Hip tightness improved.', 'Focus on thoracic mobility.'],
    recentActivity: [
      { label: 'Completed', value: '5/6 sessions' },
      { label: 'Last session', value: '2 days ago' },
      { label: 'Adherence', value: '83%', tone: 'positive' },
    ],
  },
  initialSeconds: 28 * 60 + 34,
  messageCount: 3,
  workoutPlan: {
    warmup: '5 min Dynamic Warm-up',
    exercises: [
      { id: 'squat', name: 'Barbell Squat', sets: 4, reps: '8', weight: '50 kg', thumbnailUrl: '/images/trainer/live-session/barbell-squat.jpg', status: 'Complete' },
      { id: 'rdl', name: 'Romanian Deadlift', sets: 4, reps: '10', weight: '45 kg', thumbnailUrl: '/images/trainer/live-session/romanian-deadlift.jpg', status: 'Complete' },
      { id: 'bench', name: 'Dumbbell Bench Press', sets: 3, reps: '10', weight: '22.5 kg', thumbnailUrl: '/images/trainer/live-session/dumbbell-bench-press.jpg', status: 'Complete' },
      { id: 'pulldown', name: 'Lat Pulldown', sets: 3, reps: '12', weight: '40 kg', thumbnailUrl: '/images/trainer/live-session/lat-pulldown.jpg', status: 'In Progress' },
      { id: 'row', name: 'Seated Cable Row', sets: 3, reps: '12', weight: '35 kg', thumbnailUrl: '/images/trainer/live-session/seated-cable-row.jpg', status: 'Pending' },
      { id: 'plank', name: 'Plank Hold', sets: 3, reps: '45 sec', weight: '-', thumbnailUrl: '/images/trainer/live-session/plank-hold.jpg', status: 'Pending' },
    ],
    sessionGoal: 'Increase strength and build lean muscle while maintaining proper form.',
    sessionFocus: ['Lower body strength', 'Progressive overload', 'Form'],
  },
  quickNotes: 'Client feeling good today.\nSleep was 7 hrs.\nEnergy is high.',
  observations: ['Great depth on squats', 'Improved control on RDL', 'Keep core tight on rows'],
  energyOptions: [
    { id: 'low', label: 'Low', face: '\u2639', color: 'rose' },
    { id: 'okay', label: 'Okay', face: '\u263a', color: 'amber' },
    { id: 'good', label: 'Good', face: '\u263a', color: 'blue' },
    { id: 'great', label: 'Great', face: '\u263a', color: 'green' },
  ],
  selectedEnergyId: 'great',
  keyMetrics: [
    { id: 'calories', label: 'Calories Burned', value: '418 kcal', icon: 'calories' },
    { id: 'heart', label: 'Avg. Heart Rate', value: '142 bpm', icon: 'heartRate' },
    { id: 'load', label: 'Training Load', value: 'Medium', icon: 'load' },
    { id: 'rpe', label: 'RPE (Session)', value: '7/10', icon: 'rpe' },
  ],
};
