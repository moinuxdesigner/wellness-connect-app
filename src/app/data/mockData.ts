export const sessions = [
  {
    type: 'Counselling',
    title: 'Stress management session',
    expert: 'Dr. Ananya Sharma',
    date: 'Today',
    time: '10:30 AM',
  },
  {
    type: 'Training',
    title: 'Upper body strength',
    expert: 'Coach Rahul Mehta',
    date: 'Today',
    time: '6:00 PM',
  },
  {
    type: 'Counselling',
    title: 'Thought reframing',
    expert: 'Dr. Neha Verma',
    date: 'Tomorrow',
    time: '11:00 AM',
  },
  {
    type: 'Training',
    title: 'Mobility and core',
    expert: 'Coach Arjun Mehta',
    date: 'Tomorrow',
    time: '7:00 AM',
  },
] as const;

export const experts = [
  { name: 'Dr. Ananya Sharma', detail: 'Clinical psychologist · Anxiety and stress', status: 'Active' },
  { name: 'Coach Rahul Mehta', detail: 'Personal trainer · Strength and weight loss', status: 'Active' },
  { name: 'Dr. Neha Verma', detail: 'Counsellor · Relationships and sleep', status: 'Active' },
];

export const clients = [
  { name: 'Sarah Johnson', detail: 'Mind + Body program', status: 'Active' },
  { name: 'Rahul Sharma', detail: 'Anxiety support', status: 'Active' },
  { name: 'Pooja Iyer', detail: 'Weight loss program', status: 'Active' },
  { name: 'Kabir Singh', detail: 'General fitness', status: 'Paused' },
];

export const helpTickets = [
  { id: '#TK-2148', title: 'Login issue - App', priority: 'High' },
  { id: '#TK-2147', title: 'Payment not going through', priority: 'Medium' },
  { id: '#TK-2146', title: 'Unable to book session', priority: 'Medium' },
];

export const programExercises = [
  { name: 'Breathing practice', detail: '5 minutes · cognitive reset', status: 'Assigned' },
  { name: 'Upper body workout', detail: '4 sets · strength training', status: 'Assigned' },
  { name: 'Reflection journal', detail: 'Daily note · mood awareness', status: 'Assigned' },
  { name: 'Mobility flow', detail: '12 minutes · recovery', status: 'Assigned' },
];

export const clientGoals = [
  'Session completion',
  'Assigned exercises',
  'Personal goals',
  'Mood trend',
  'Workout consistency',
];

export const appointments = [
  { label: 'Counselling appointments', value: '42', tone: 'primary' },
  { label: 'Training appointments', value: '38', tone: 'success' },
];

export const roleStats = {
  counsellor: [
    { label: 'Sessions today', value: '6', tone: 'primary' },
    { label: 'Follow-ups', value: '2', tone: 'warning' },
    { label: 'New clients', value: '3', tone: 'success' },
    { label: 'Secure messages', value: '12', tone: 'primary' },
  ],
  trainer: [
    { label: 'Sessions today', value: '6', tone: 'success' },
    { label: 'Programs', value: '18', tone: 'primary' },
    { label: 'Measurements due', value: '4', tone: 'warning' },
    { label: 'Messages', value: '9', tone: 'primary' },
  ],
  helpDesk: [
    { label: 'Open tickets', value: '32', tone: 'danger' },
    { label: 'Appointments', value: '18', tone: 'primary' },
    { label: 'Follow-ups', value: '5', tone: 'warning' },
    { label: 'Resolved', value: '68', tone: 'success' },
  ],
  admin: [
    { label: 'Appointments', value: '124', tone: 'primary' },
    { label: 'Clients', value: '248', tone: 'success' },
    { label: 'Counsellors', value: '12', tone: 'primary' },
    { label: 'Trainers', value: '10', tone: 'success' },
    { label: 'Help desk users', value: '6', tone: 'warning' },
    { label: 'Reports', value: '14', tone: 'primary' },
  ],
  progress: [
    { label: 'Session completion', value: '8/10', tone: 'primary' },
    { label: 'Mood trend', value: 'Good', tone: 'success' },
    { label: 'Workouts', value: '4/5', tone: 'success' },
    { label: 'Goals active', value: '5', tone: 'warning' },
  ],
} as const;
