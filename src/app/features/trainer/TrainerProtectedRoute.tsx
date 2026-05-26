import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { ArrowLeft, Ban, CircleAlert, Clock3, LogOut } from 'lucide-react';
import { getAuthState } from '../auth/auth';
import { logoutRequest } from '../auth/apiAuth';
import AuthActionLoader from '../auth/AuthActionLoader';
import { fetchTrainerAccessState, type TrainerAccessState } from './trainerAccess';
import type { TrainerApplicationRecord } from './trainerOnboarding';

export default function TrainerProtectedRoute() {
  const auth = getAuthState();
  const location = useLocation();
  const [access, setAccess] = useState<TrainerAccessState | null>(null);

  useEffect(() => {
    let active = true;

    const syncAccess = () => {
      void fetchTrainerAccessState().then((nextAccess) => {
        if (active) setAccess(nextAccess);
      });
    };

    syncAccess();
    window.addEventListener('focus', syncAccess);
    window.addEventListener('storage', syncAccess);

    return () => {
      active = false;
      window.removeEventListener('focus', syncAccess);
      window.removeEventListener('storage', syncAccess);
    };
  }, [auth.user?.email, auth.user?.status]);

  if (auth.user?.role !== 'trainer') {
    return <Navigate to="/login" replace />;
  }

  if (!access) {
    return <TrainerStatusLoading />;
  }

  switch (access.status) {
    case 'approved':
      return <Outlet />;
    case 'onboarding_pending':
      return <Navigate to="/trainer/onboarding" replace />;
    case 'pending_review':
      return location.pathname === '/trainer/submitted-profile' && access.application
        ? <SubmittedTrainerProfile application={access.application} />
        : <TrainerStatusPage status="pending_review" application={access.application} />;
    case 'needs_resubmission':
      return <TrainerStatusPage status="needs_resubmission" remarks={access.adminRemarks} />;
    case 'rejected':
      return <TrainerStatusPage status="rejected" remarks={access.adminRemarks} />;
    case 'suspended':
      return <TrainerStatusPage status="suspended" />;
  }
}

function TrainerStatusLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm font-medium text-slate-500">Checking trainer access...</p>
    </div>
  );
}

function TrainerStatusPage({ status, remarks, application }: { status: 'pending_review' | 'needs_resubmission' | 'rejected' | 'suspended'; remarks?: string; application?: TrainerApplicationRecord | null }) {
  const content = {
    pending_review: {
      icon: Clock3,
      tone: 'bg-indigo-50 text-indigo-600',
      title: 'Your trainer profile is under review',
      message: 'Thank you for completing onboarding. Our admin team is reviewing your profile, qualifications, and documents. You will get access to the trainer workspace after approval.',
      primaryLabel: 'View submitted profile',
      primaryTo: '/trainer/submitted-profile',
    },
    needs_resubmission: {
      icon: CircleAlert,
      tone: 'bg-amber-50 text-amber-700',
      title: 'Your trainer profile needs attention',
      message: 'Your application was not approved in its current form. Review the admin feedback, update your information, and resubmit your profile for approval.',
      primaryLabel: 'Update and resubmit profile',
      primaryTo: '/trainer/onboarding',
    },
    rejected: {
      icon: CircleAlert,
      tone: 'bg-rose-50 text-rose-700',
      title: 'Your trainer application was not approved',
      message: 'This application has been closed. Contact support if you need clarification about the decision.',
      primaryLabel: 'Contact support',
      primaryTo: '/contact',
    },
    suspended: {
      icon: Ban,
      tone: 'bg-rose-50 text-rose-700',
      title: 'Trainer workspace access is blocked',
      message: 'Your trainer account has been suspended. Please contact support for assistance before attempting to access the workspace.',
      primaryLabel: 'Contact support',
      primaryTo: '/contact',
    },
  }[status];
  const Icon = content.icon;

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-10"
      style={{
        backgroundColor: '#f5f8fd',
        backgroundImage: [
          'radial-gradient(circle at 7% 18%, rgba(161, 202, 255, 0.5) 0%, transparent 26%)',
          'radial-gradient(circle at 9% 90%, rgba(184, 244, 237, 0.52) 0%, transparent 25%)',
          'radial-gradient(circle at 93% 17%, rgba(207, 199, 255, 0.5) 0%, transparent 27%)',
          'radial-gradient(circle at 92% 84%, rgba(253, 214, 232, 0.5) 0%, transparent 26%)',
          'radial-gradient(circle at 49% 14%, rgba(255, 244, 199, 0.27) 0%, transparent 19%)',
        ].join(', '),
      }}
    >
      <section className="w-full max-w-xl text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${content.tone}`}>
          <Icon size={30} />
        </div>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight text-slate-950">{content.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">{content.message}</p>
        {status === 'pending_review' && application ? (
          <p className="mt-4 text-sm font-medium text-slate-500">
            Application {application.applicationId} submitted on {displayDate(application.submittedAt)}
          </p>
        ) : null}
        {(status === 'needs_resubmission' || status === 'rejected') && remarks ? (
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Admin feedback</p>
            <p className="mt-2 text-sm leading-6 text-amber-950">{remarks}</p>
          </div>
        ) : null}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={content.primaryTo} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            {content.primaryLabel}
          </Link>
          {(status === 'pending_review' || status === 'needs_resubmission') ? (
            <Link to="/contact" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Contact support
            </Link>
          ) : null}
          <TrainerLogoutButton />
        </div>
      </section>
    </main>
  );
}

function TrainerLogoutButton() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <>
      {isLoggingOut ? <AuthActionLoader action="logout" /> : null}
      <button
        type="button"
        disabled={isLoggingOut}
        onClick={async () => {
          if (isLoggingOut) return;
          setIsLoggingOut(true);
          try {
            await logoutRequest();
            navigate('/login');
          } finally {
            setIsLoggingOut(false);
          }
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={16} />
        Logout
      </button>
    </>
  );
}

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function SubmittedTrainerProfile({ application }: { application: TrainerApplicationRecord }) {
  const values = application.values;
  const sections: Array<{ title: string; items: Array<[string, string]> }> = [
    {
      title: 'Personal details',
      items: [
        ['Full name', values.profile.fullName || application.applicantName],
        ['Gender', values.profile.gender],
        ['Date of birth', values.profile.dateOfBirth ? displayDate(values.profile.dateOfBirth) : 'Not provided'],
        ['Email', values.profile.email || application.applicantEmail],
        ['Mobile', values.profile.mobile || application.applicantMobile],
        ['Location', `${values.profile.city || application.city}, ${values.profile.state || application.state}`],
      ],
    },
    {
      title: 'Qualifications and expertise',
      items: [
        ['Certification institute', values.certification.institute || 'Not provided'],
        ['Certification type', values.certification.type || 'Not provided'],
        ['Certificate', values.certification.certificate?.name || 'Not uploaded'],
        ['Expertise', values.expertise.length ? values.expertise.join(', ') : application.expertise.join(', ') || 'Not provided'],
        ['Experience', values.experience.yearsExperience ? `${values.experience.yearsExperience} years` : 'Not provided'],
        ['Clients trained', values.experience.clientsTrained || 'Not provided'],
        ['Why clients should choose you', values.clientPitch || 'Not provided'],
      ],
    },
    {
      title: 'Coaching and rates',
      items: [
        ['Training philosophy', values.training.philosophy || 'Not provided'],
        ['Introduction video', values.training.introductionVideo?.name || 'Skipped for now'],
        ['Training modes', values.availability.modes.join(', ') || 'Not provided'],
        ['Available days', values.availability.days.join(', ') || 'Not provided'],
        ['Per session rate', values.availability.perSessionRateInr ? `INR ${values.availability.perSessionRateInr}` : 'Not provided'],
        ['Monthly rate', values.availability.monthlyRateInr ? `INR ${values.availability.monthlyRateInr}` : 'Not provided'],
      ],
    },
    {
      title: 'Portfolio and verification',
      items: [
        ['Transformation photos', values.showcase.transformationPhotos.map((item) => item.name).join(', ') || 'Skipped for now'],
        ['Showcase videos', values.showcase.videos.map((item) => item.name).join(', ') || 'Skipped for now'],
        ['PAN card', values.identity.pan?.name || 'Not uploaded'],
        ['Aadhaar', values.identity.aadhaar?.name || 'Not uploaded'],
        ['Passport', values.identity.passport?.name || 'Not uploaded'],
        ['Driving licence', values.identity.drivingLicense?.name || 'Not uploaded'],
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/trainer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            <ArrowLeft size={16} />
            Back to review status
          </Link>
          <TrainerLogoutButton />
        </div>
        <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Submitted profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{application.applicantName}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Application {application.applicationId} submitted on {displayDate(application.submittedAt)}
          </p>
          <span className="mt-5 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            Under review
          </span>
        </header>
        <div className="mt-6 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {section.items.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-1.5 text-sm text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
