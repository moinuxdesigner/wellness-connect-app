import { useState } from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import { Checkbox } from './components/Checkbox';
import { Toggle } from './components/Toggle';
import { BottomNav } from './components/BottomNav';
import { Tabs } from './components/Tabs';
import { StatCard } from './components/StatCard';
import { Avatar } from './components/Avatar';
import { ProgressBar } from './components/ProgressBar';
import { Alert } from './components/Alert';
import { ListItem } from './components/ListItem';
import { SearchInput } from './components/SearchInput';

export default function App() {
  const [activeNav, setActiveNav] = useState('design-system');
  const [searchValue, setSearchValue] = useState('');

  const navItems = [
    {
      id: 'design-system',
      label: 'Design',
      icon: '🎨',
      onClick: () => setActiveNav('design-system'),
    },
    {
      id: 'components',
      label: 'Components',
      icon: '🧩',
      onClick: () => setActiveNav('components'),
    },
    {
      id: 'examples',
      label: 'Examples',
      icon: '📱',
      onClick: () => setActiveNav('examples'),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Wellness Connect</h1>
              <p className="text-sm text-neutral-600">Design System</p>
            </div>
            <Badge variant="primary">v1.0</Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {activeNav === 'design-system' && <DesignSystemView />}
        {activeNav === 'components' && <ComponentsView searchValue={searchValue} setSearchValue={setSearchValue} />}
        {activeNav === 'examples' && <ExamplesView />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav items={navItems} activeId={activeNav} />
    </div>
  );
}

function DesignSystemView() {
  return (
    <>
      {/* Brand Section */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Brand</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Wellness Connect</h3>
              <p className="text-sm text-neutral-600">Mind. Body. Better Together.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Calm</Badge>
              <Badge variant="info">Trustworthy</Badge>
              <Badge variant="success">Motivating</Badge>
              <Badge variant="secondary">Professional</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Color System */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Color System</h2>

        <div className="space-y-4">
          {/* Primary Colors */}
          <Card variant="elevated" padding="md">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Primary</h3>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch color="bg-primary" label="Primary" hex="#5B4CFF" />
              <ColorSwatch color="bg-primary-dark" label="Dark" hex="#4A3DE8" />
              <ColorSwatch color="bg-primary-light" label="Light" hex="#E8E6FF" />
            </div>
          </Card>

          {/* Secondary Colors */}
          <Card variant="elevated" padding="md">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Secondary</h3>
            <div className="grid grid-cols-3 gap-3">
              <ColorSwatch color="bg-secondary" label="Secondary" hex="#00D9D5" />
              <ColorSwatch color="bg-secondary-dark" label="Dark" hex="#00C4C0" />
              <ColorSwatch color="bg-secondary-light" label="Light" hex="#E0F9F8" />
            </div>
          </Card>

          {/* Accent Colors */}
          <Card variant="elevated" padding="md">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Accents</h3>
            <div className="grid grid-cols-2 gap-3">
              <ColorSwatch color="bg-purple" label="Purple" hex="#8B5CF6" />
              <ColorSwatch color="bg-teal" label="Teal" hex="#14B8A6" />
            </div>
          </Card>

          {/* Semantic Colors */}
          <Card variant="elevated" padding="md">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Semantic</h3>
            <div className="grid grid-cols-2 gap-3">
              <ColorSwatch color="bg-success" label="Success" hex="#10B981" />
              <ColorSwatch color="bg-warning" label="Warning" hex="#F59E0B" />
              <ColorSwatch color="bg-error" label="Error" hex="#EF4444" />
              <ColorSwatch color="bg-info" label="Info" hex="#3B82F6" />
            </div>
          </Card>

          {/* Neutrals */}
          <Card variant="elevated" padding="md">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Neutrals</h3>
            <div className="grid grid-cols-5 gap-2">
              <ColorSwatch color="bg-neutral-900" label="900" hex="#111827" textLight />
              <ColorSwatch color="bg-neutral-700" label="700" hex="#374151" textLight />
              <ColorSwatch color="bg-neutral-500" label="500" hex="#6B7280" />
              <ColorSwatch color="bg-neutral-300" label="300" hex="#D1D5DB" />
              <ColorSwatch color="bg-neutral-100" label="100" hex="#F3F4F6" />
            </div>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Typography</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-neutral-500 mb-1">Font Family</p>
              <p className="font-semibold">Inter</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500">Heading 1 - 32px Bold</p>
                <h1 className="font-bold">The quick brown fox</h1>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Heading 2 - 24px Semibold</p>
                <h2 className="font-semibold">The quick brown fox</h2>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Heading 3 - 20px Semibold</p>
                <h3 className="font-semibold">The quick brown fox</h3>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Body - 16px Regular</p>
                <p>The quick brown fox jumps over the lazy dog</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Small - 14px Regular</p>
                <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Spacing */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Spacing System</h2>
        <Card variant="elevated" padding="md">
          <div className="space-y-3">
            {[4, 8, 12, 16, 24, 32, 40, 48, 64].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="text-sm text-neutral-600 w-16">{size}px</span>
                <div className="h-6 bg-primary" style={{ width: `${size}px` }} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Border Radius */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Border Radius</h2>
        <Card variant="elevated" padding="md">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary mx-auto rounded mb-2" />
              <p className="text-sm text-neutral-600">SM - 4px</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary mx-auto rounded-md mb-2" />
              <p className="text-sm text-neutral-600">MD - 6px</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary mx-auto rounded-lg mb-2" />
              <p className="text-sm text-neutral-600">LG - 8px</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary mx-auto rounded-xl mb-2" />
              <p className="text-sm text-neutral-600">XL - 12px</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Shadows</h2>
        <div className="grid grid-cols-1 gap-4">
          <Card variant="default" padding="md" className="shadow-sm">
            <p className="text-sm font-medium text-neutral-700">Small Shadow</p>
          </Card>
          <Card variant="default" padding="md" className="shadow-card">
            <p className="text-sm font-medium text-neutral-700">Card Shadow</p>
          </Card>
          <Card variant="default" padding="md" className="shadow-modal">
            <p className="text-sm font-medium text-neutral-700">Modal Shadow</p>
          </Card>
          <Card variant="default" padding="md" className="shadow-floating">
            <p className="text-sm font-medium text-neutral-700">Floating Shadow</p>
          </Card>
        </div>
      </section>
    </>
  );
}

function ComponentsView({ searchValue, setSearchValue }: { searchValue: string; setSearchValue: (v: string) => void }) {
  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search components..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => setSearchValue('')}
        />
      </div>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Buttons</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" fullWidth>Full Width</Button>
          </div>
        </Card>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Inputs</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <Input label="Email" placeholder="Enter your email" fullWidth />
            <Input label="Password" type="password" placeholder="Enter password" fullWidth />
            <Input label="With Error" error="This field is required" fullWidth />
            <Input label="With Helper" helperText="We'll never share your email" fullWidth />
          </div>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Badges</h2>
        <Card variant="elevated" padding="lg">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </Card>
      </section>

      {/* Checkboxes & Toggles */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Selection Controls</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Checkbox label="Checkbox option 1" />
              <Checkbox label="Checkbox option 2" defaultChecked />
              <Checkbox label="Disabled checkbox" disabled />
            </div>
            <div className="space-y-2">
              <Toggle label="Enable notifications" />
              <Toggle label="Dark mode" defaultChecked />
              <Toggle label="Disabled toggle" disabled />
            </div>
          </div>
        </Card>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Alerts</h2>
        <div className="space-y-3">
          <Alert variant="success" title="Success!">
            Your changes have been saved successfully.
          </Alert>
          <Alert variant="warning" title="Warning">
            Please review your information before submitting.
          </Alert>
          <Alert variant="error" title="Error">
            Something went wrong. Please try again.
          </Alert>
          <Alert variant="info" title="Info">
            New features are available in this update.
          </Alert>
        </div>
      </section>

      {/* Progress Bars */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Progress Bars</h2>
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <ProgressBar value={25} color="primary" showLabel />
            <ProgressBar value={50} color="success" showLabel />
            <ProgressBar value={75} color="warning" showLabel />
            <ProgressBar value={100} color="error" showLabel />
          </div>
        </Card>
      </section>

      {/* Avatars */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Avatars</h2>
        <Card variant="elevated" padding="lg">
          <div className="flex flex-wrap items-end gap-4">
            <Avatar name="John Doe" size="sm" />
            <Avatar name="Jane Smith" size="md" showBadge />
            <Avatar name="Bob Wilson" size="lg" />
            <Avatar name="Sarah Johnson" size="xl" showBadge badgeColor="warning" />
          </div>
        </Card>
      </section>

      {/* Tabs */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Tabs</h2>
        <Card variant="elevated" padding="lg">
          <Tabs
            items={[
              { id: 'tab1', label: 'Overview', content: <p>Overview content here</p> },
              { id: 'tab2', label: 'Details', content: <p>Details content here</p> },
              { id: 'tab3', label: 'Settings', content: <p>Settings content here</p> },
            ]}
          />
        </Card>
      </section>
    </>
  );
}

function ExamplesView() {
  return (
    <>
      {/* Stat Cards */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Stat Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Sessions"
            value="24"
            icon="📅"
            color="primary"
            trend={{ value: '12%', direction: 'up' }}
          />
          <StatCard
            title="Active Goals"
            value="8"
            icon="🎯"
            color="success"
            trend={{ value: '5%', direction: 'up' }}
          />
          <StatCard
            title="Streak Days"
            value="15"
            icon="🔥"
            color="warning"
          />
          <StatCard
            title="Wellness Score"
            value="87"
            icon="💪"
            color="secondary"
          />
        </div>
      </section>

      {/* List Items */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">List Items</h2>
        <Card variant="elevated" padding="none">
          <ListItem
            title="Dr. Sarah Johnson"
            subtitle="Counselling Session - Today at 2:00 PM"
            leftContent={<Avatar name="Sarah Johnson" size="md" showBadge />}
            rightContent={<Badge variant="success">Confirmed</Badge>}
            onClick={() => alert('Clicked!')}
          />
          <div className="border-t border-border" />
          <ListItem
            title="John Smith - Personal Trainer"
            subtitle="Gym Session - Tomorrow at 10:00 AM"
            leftContent={<Avatar name="John Smith" size="md" />}
            rightContent={<Badge variant="warning">Pending</Badge>}
            onClick={() => alert('Clicked!')}
          />
          <div className="border-t border-border" />
          <ListItem
            title="Meditation Practice"
            subtitle="Daily Goal - 15 minutes"
            leftContent={<div className="w-10 h-10 rounded-full bg-purple-light flex items-center justify-center text-xl">🧘</div>}
            rightContent={<ProgressBar value={75} color="purple" className="w-20" />}
          />
        </Card>
      </section>

      {/* Session Card Example */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Session Card</h2>
        <Card variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <Avatar name="Dr. Emily Chen" size="lg" showBadge />
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">Upcoming Session</h3>
              <p className="text-sm text-neutral-600 mt-1">Dr. Emily Chen - Counselling</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="info" size="sm">📅 Today</Badge>
                <Badge variant="neutral" size="sm">⏰ 2:00 PM</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm">Join Session</Button>
                <Button variant="outline" size="sm">Reschedule</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Progress Tracking */}
      <section>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Progress Tracking</h2>
        <Card variant="elevated" padding="lg">
          <h3 className="font-semibold text-neutral-900 mb-4">Weekly Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-700">Meditation</span>
                <span className="text-neutral-500">5/7 days</span>
              </div>
              <ProgressBar value={71} color="purple" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-700">Exercise</span>
                <span className="text-neutral-500">4/5 sessions</span>
              </div>
              <ProgressBar value={80} color="success" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-700">Sleep Goal</span>
                <span className="text-neutral-500">6/7 nights</span>
              </div>
              <ProgressBar value={86} color="secondary" />
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

function ColorSwatch({ color, label, hex, textLight = false }: { color: string; label: string; hex: string; textLight?: boolean }) {
  return (
    <div>
      <div className={`${color} h-16 rounded-md mb-2 flex items-center justify-center`}>
        <span className={`text-xs font-medium ${textLight ? 'text-white' : 'text-neutral-900'}`}>{label}</span>
      </div>
      <p className="text-xs text-neutral-600 text-center">{hex}</p>
    </div>
  );
}
