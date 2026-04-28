import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Heart,
  Home,
  LogIn,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import type React from 'react';
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from 'react-router';
import {
  clientGoals,
  clients,
  experts,
  helpTickets,
  programExercises,
  roleStats,
  sessions,
} from './data/mockData';
import '../styles/wellnessconnect.css';

const navItems = [
  { label: 'Home', path: '/app', icon: Home },
  { label: 'Appointments', path: '/appointments', icon: Calendar },
  { label: 'Programs', path: '/programs', icon: Dumbbell },
  { label: 'Progress', path: '/progress', icon: BarChart3 },
  { label: 'Messages', path: '/messages', icon: MessageCircle },
  { label: 'Profile', path: '/profile', icon: User },
];

const roleLinks = [
  { label: 'Client', path: '/app' },
  { label: 'Counsellor', path: '/counsellor' },
  { label: 'Trainer', path: '/trainer' },
  { label: 'Help Desk', path: '/help-desk' },
  { label: 'Admin', path: '/admin' },
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route element={<Shell />}>
          <Route path="/app" element={<ClientDashboard />} />
          <Route path="/counsellor" element={<CounsellorDashboard />} />
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/help-desk" element={<HelpDeskDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/appointments" element={<AppointmentBooking />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function BrandMark() {
  return (
    <Link to="/" className="brand-mark" aria-label="WellnessConnect home">
      <span className="brand-icon"><Heart size={24} /></span>
      <span>
        <strong>Wellness<span>Connect</span></strong>
        <small>Mind. Body. Better Together.</small>
      </span>
    </Link>
  );
}

function LandingScreen() {
  const services = [
    ['Counselling', 'Connect with supportive professionals.', MessageCircle],
    ['Personal Training', 'Build strength with guided plans.', Dumbbell],
    ['Appointments', 'Book counselling and gym sessions.', Calendar],
    ['Progress Tracking', 'See mood, habits, and fitness improve.', BarChart3],
    ['Wellness Tools', 'Exercises, journals, and check-ins.', Sparkles],
  ];

  return (
    <main className="public-page">
      <nav className="public-nav">
        <BrandMark />
        <Link className="ghost-link" to="/login"><LogIn size={18} /> Log In</Link>
      </nav>
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Premium support for mind and body</p>
          <h1>Welcome to WellnessConnect</h1>
          <h2>Mind. Body. Better Together.</h2>
          <p>Your safe space for a stronger mind and healthier body.</p>
          <p className="soft-copy">
            Start gently with expert counselling, personal training, simple booking, and progress tools that help you feel supported from day one.
          </p>
          <div className="button-row">
            <Button to="/signup">Create Account</Button>
            <Button to="/login" variant="outline">Log In</Button>
          </div>
        </div>
        <div className="hero-visual" aria-label="WellnessConnect mind and body illustration">
          <div className="hero-orbit mind">Mind<br /><span>Support</span></div>
          <div className="hero-person">
            <Heart size={64} />
            <span />
          </div>
          <div className="hero-orbit body">Body<br /><span>Train</span></div>
        </div>
      </section>
      <section className="conversion-panel">
        <Card className="trust-card">
          <ShieldCheck />
          <div>
            <h3>You do not have to do it alone.</h3>
            <p>Private care, verified experts, and simple next steps for your wellbeing journey.</p>
          </div>
        </Card>
        <div className="check-list">
          <span><CheckCircle2 /> Personalized counselling support</span>
          <span><CheckCircle2 /> Expert training programs</span>
          <span><CheckCircle2 /> Secure progress tracking</span>
        </div>
      </section>
      <section className="service-grid">
        {services.map(([title, copy, Icon]) => (
          <Card key={title} className="service-card">
            <Icon />
            <h3>{title}</h3>
            <p>{copy}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}

function LoginScreen() {
  return (
    <AuthFrame title="Welcome back" subtitle="Log in to continue your WellnessConnect journey.">
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" placeholder="Enter your password" />
      <Button to="/app" full>Log In</Button>
      <div className="auth-links">
        <a href="#forgot">Forgot password?</a>
        <Link to="/signup">Create account</Link>
      </div>
    </AuthFrame>
  );
}

function SignupScreen() {
  return (
    <AuthFrame title="Create Account" subtitle="Tell us how WellnessConnect can support you.">
      <Input label="Name" placeholder="Your name" />
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Phone" type="tel" placeholder="+91 98765 43210" />
      <Input label="Password" type="password" placeholder="Create a password" />
      <label className="field">
        <span>Select interest</span>
        <select>
          <option>Counselling</option>
          <option>Personal Training</option>
          <option>Both</option>
        </select>
      </label>
      <Button to="/app" full>Create Account</Button>
    </AuthFrame>
  );
}

function AuthFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <Card className="auth-card">
        <BrandMark />
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="form-stack">{children}</div>
      </Card>
    </main>
  );
}

function Shell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <header className="topbar">
          <BrandMark />
          <div className="topbar-actions">
            <Link to="/appointments" className="icon-button"><Plus size={18} /></Link>
            <button className="icon-button"><Bell size={18} /></button>
            <span className="avatar">SJ</span>
          </div>
        </header>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <BrandMark />
      <nav>
        {navItems.map((item) => <NavEntry key={item.path} {...item} />)}
      </nav>
      <div className="role-switcher">
        <p>Role dashboards</p>
        {roleLinks.map((role) => (
          <NavLink key={role.path} to={role.path}>{role.label}</NavLink>
        ))}
      </div>
    </aside>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.slice(0, 5).map((item) => <NavEntry key={item.path} {...item} compact />)}
    </nav>
  );
}

function NavEntry({ label, path, icon: Icon, compact }: { label: string; path: string; icon: typeof Home; compact?: boolean }) {
  return (
    <NavLink to={path} className={({ isActive }) => `nav-entry ${isActive ? 'active' : ''} ${compact ? 'compact' : ''}`}>
      <Icon size={compact ? 20 : 18} />
      <span>{label}</span>
    </NavLink>
  );
}

function ClientDashboard() {
  return (
    <Page title="Good morning, Sarah" subtitle="You are taking a steady step toward a healthier mind and body.">
      <section className="dashboard-grid">
        <Card className="greeting-card">
          <div>
            <Badge tone="success">In balance</Badge>
            <h2>Today’s mood check-in</h2>
            <p>Your mood helps personalize care recommendations.</p>
          </div>
          <MoodSelector />
        </Card>
        <SessionCard session={sessions[0]} />
        <SessionCard session={sessions[1]} />
      </section>
      <section className="quick-actions">
        {[
          ['Book Counselling', '/appointments', MessageCircle],
          ['Book Training', '/appointments', Dumbbell],
          ['View Exercises', '/programs', ClipboardList],
          ['Track Progress', '/progress', BarChart3],
        ].map(([label, path, Icon]) => (
          <Link className="quick-action" to={path as string} key={label as string}><Icon />{label}</Link>
        ))}
      </section>
      <section className="two-column">
        <ProgressCard title="Mind Progress" value={72} label="Mood stability" tone="primary" />
        <ProgressCard title="Body Progress" value={84} label="Workout consistency" tone="success" />
      </section>
    </Page>
  );
}

function CounsellorDashboard() {
  return (
    <Page title="Counsellor Dashboard" subtitle="Today’s sessions, notes, reminders, and client progress.">
      <StatsGrid stats={roleStats.counsellor} />
      <section className="two-column">
        <Card title="Today’s sessions">{sessions.filter((s) => s.type === 'Counselling').map((s) => <SessionCard key={s.title} session={s} compact />)}</Card>
        <Card title="Client list">{clients.slice(0, 4).map((client) => <UserListItem key={client.name} user={client} />)}</Card>
      </section>
      <section className="feature-grid">
        {['Session notes', 'Mood/progress tracking', 'Follow-up reminders', 'Secure messages'].map((item) => <FeatureTile key={item} title={item} />)}
      </section>
    </Page>
  );
}

function TrainerDashboard() {
  return (
    <Page title="Gym Trainer Dashboard" subtitle="Plan workouts, track measurements, and keep clients motivated.">
      <StatsGrid stats={roleStats.trainer} />
      <section className="two-column">
        <Card title="Today’s training sessions">{sessions.filter((s) => s.type === 'Training').map((s) => <SessionCard key={s.title} session={s} compact />)}</Card>
        <Card title="Workout program planning">{programExercises.map((item) => <UserListItem key={item.name} user={item} />)}</Card>
      </section>
      <section className="feature-grid">
        {['Client list', 'Progress tracking', 'Measurements', 'Client communication'].map((item) => <FeatureTile key={item} title={item} />)}
      </section>
    </Page>
  );
}

function HelpDeskDashboard() {
  return (
    <Page title="Help Desk Dashboard" subtitle="Manage appointments, support tickets, follow-ups, and client updates.">
      <StatsGrid stats={roleStats.helpDesk} />
      <section className="two-column">
        <Card title="Support tickets">{helpTickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)}</Card>
        <Card title="Assistant workflows">
          {['Create user profile', 'Update client information', 'Reschedule appointment', 'Follow-up tasks'].map((item) => <FeatureTile key={item} title={item} />)}
        </Card>
      </section>
    </Page>
  );
}

function AdminDashboard() {
  return (
    <Page title="Admin Dashboard" subtitle="A calm operational view of people, appointments, reports, and activity.">
      <StatsGrid stats={roleStats.admin} />
      <section className="feature-grid">
        {['Overall appointments', 'Clients', 'Counsellors', 'Trainers', 'Help desk users', 'Reports', 'Recent activity'].map((item) => <FeatureTile key={item} title={item} />)}
      </section>
    </Page>
  );
}

function AppointmentBooking() {
  return (
    <Page title="Book Appointment" subtitle="Choose a service, expert, date, and time.">
      <section className="booking-flow">
        <Card title="1. Select service">
          {['Counselling', 'Personal Training'].map((service) => <label className="choice-card" key={service}><input type="radio" name="service" defaultChecked={service === 'Counselling'} />{service}</label>)}
        </Card>
        <Card title="2. Select expert">
          {experts.map((expert) => <UserListItem key={expert.name} user={expert} />)}
        </Card>
        <Card title="3. Select date and time">
          <div className="date-grid">{['Mon 20', 'Tue 21', 'Wed 22', 'Thu 23'].map((day) => <button key={day}>{day}</button>)}</div>
          <div className="time-grid">{['09:00', '10:30', '14:00', '18:00'].map((time) => <button key={time}>{time}</button>)}</div>
        </Card>
        <Card title="4. Confirm booking">
          <p className="muted">Counselling with Dr. Ananya Sharma on Wed 22 at 10:30 AM.</p>
          <Button full>Confirm Booking</Button>
        </Card>
      </section>
    </Page>
  );
}

function ProgressPage() {
  return (
    <Page title="Progress" subtitle="Track your mind and body journey in one place.">
      <StatsGrid stats={roleStats.progress} />
      <section className="two-column">
        <ProgressCard title="Mood trend" value={76} label="Good this week" tone="primary" />
        <ProgressCard title="Workout consistency" value={84} label="4 of 5 sessions" tone="success" />
      </section>
      <section className="feature-grid">
        {clientGoals.map((goal) => <FeatureTile key={goal} title={goal} />)}
      </section>
    </Page>
  );
}

function ProgramsPage() {
  return (
    <Page title="Programs" subtitle="Assigned exercises and wellness tools.">
      <section className="feature-grid">
        {programExercises.map((exercise) => <Card key={exercise.name}><Dumbbell /><h3>{exercise.name}</h3><p>{exercise.detail}</p><Badge tone="success">{exercise.status}</Badge></Card>)}
      </section>
    </Page>
  );
}

function MessagesPage() {
  return (
    <Page title="Messages" subtitle="Secure mock conversation UI.">
      <Card className="chat-card">
        <div className="message inbound">Hi Sarah, here are a few breathing exercises for this week.</div>
        <div className="message outbound">Thank you. I felt better after the last session.</div>
        <Input label="Reply" placeholder="Type a message..." />
      </Card>
    </Page>
  );
}

function ProfilePage() {
  return (
    <Page title="Profile" subtitle="UI-only profile summary.">
      <Card className="profile-card"><span className="avatar large">SJ</span><h2>Sarah Johnson</h2><p>Interested in counselling and personal training.</p></Card>
    </Page>
  );
}

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="role-pills">{roleLinks.map((role) => <NavLink key={role.path} to={role.path}>{role.label}</NavLink>)}</div>
      </div>
      {children}
    </main>
  );
}

function Button({ children, to, variant = 'primary', full }: { children: React.ReactNode; to?: string; variant?: 'primary' | 'outline'; full?: boolean }) {
  const className = `btn ${variant} ${full ? 'full' : ''}`;
  return to ? <Link to={to} className={className}>{children}</Link> : <button className={className}>{children}</button>;
}

function Card({ children, title, className = '' }: { children: React.ReactNode; title?: string; className?: string }) {
  return <article className={`card ${className}`}>{title && <h2>{title}</h2>}{children}</article>;
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="field"><span>{label}</span><input {...props} /></label>;
}

function Badge({ children, tone = 'primary' }: { children: React.ReactNode; tone?: 'primary' | 'success' | 'warning' | 'danger' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function StatsGrid({ stats }: { stats: { label: string; value: string; tone?: 'primary' | 'success' | 'warning' | 'danger' }[] }) {
  return <section className="stats-grid">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>;
}

function StatCard({ label, value, tone = 'primary' }: { label: string; value: string; tone?: 'primary' | 'success' | 'warning' | 'danger' }) {
  return <Card className="stat-card"><Badge tone={tone}>{label}</Badge><strong>{value}</strong></Card>;
}

function SessionCard({ session, compact }: { session: typeof sessions[number]; compact?: boolean }) {
  return (
    <Card className={`session-card ${compact ? 'compact' : ''}`}>
      <div className="session-icon">{session.type === 'Counselling' ? <MessageCircle /> : <Dumbbell />}</div>
      <div>
        <Badge tone={session.type === 'Counselling' ? 'primary' : 'success'}>{session.type}</Badge>
        <h3>{session.title}</h3>
        <p>{session.expert}</p>
        <span>{session.date} · {session.time}</span>
      </div>
      {!compact && <Button variant="outline">View Details</Button>}
    </Card>
  );
}

function MoodSelector() {
  return <div className="mood-row">{['Very low', 'Low', 'Okay', 'Good', 'Great'].map((mood, index) => <button key={mood} aria-label={mood}>{['🙁', '😕', '😐', '🙂', '😀'][index]}</button>)}</div>;
}

function ProgressCard({ title, value, label, tone }: { title: string; value: number; label: string; tone: 'primary' | 'success' }) {
  return (
    <Card className="progress-card">
      <h2>{title}</h2>
      <div className={`progress-ring ${tone}`} style={{ '--value': `${value}%` } as React.CSSProperties}><span>{value}%</span></div>
      <p>{label}</p>
      <div className="sparkline"><span /><span /><span /><span /><span /></div>
    </Card>
  );
}

function UserListItem({ user }: { user: { name: string; detail: string; status?: string } }) {
  return <div className="user-row"><span className="avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{user.name}</strong><p>{user.detail}</p></div>{user.status && <Badge tone={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</Badge>}</div>;
}

function TicketRow({ ticket }: { ticket: typeof helpTickets[number] }) {
  return <div className="ticket-row"><div><strong>{ticket.id}</strong><p>{ticket.title}</p></div><Badge tone={ticket.priority === 'High' ? 'danger' : 'warning'}>{ticket.priority}</Badge></div>;
}

function FeatureTile({ title }: { title: string }) {
  return <Card className="feature-tile"><CheckCircle2 /><h3>{title}</h3><p>Mock UI module ready for future backend integration.</p></Card>;
}
