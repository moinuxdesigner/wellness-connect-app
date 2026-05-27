import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { EmptyProgressReviewState } from './components/ProgressReviewComponents';
import { getTrainerProgressReviewLanding } from './trainerWorkspaceApi';

export default function ProgressReviewLandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasClient, setHasClient] = useState(true);

  useEffect(() => {
    let active = true;

    getTrainerProgressReviewLanding()
      .then((response) => {
        if (!active) return;
        if (response.clientId) {
          navigate(`/trainer/clients/${response.clientId}/progress-review`, { replace: true });
          return;
        }
        setHasClient(false);
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Unable to open the progress review workspace.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <section className="mx-5 mt-5 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:mx-7 lg:mx-0 lg:mt-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[#111941]">Progress Review + Follow-up Workspace</h1>
        <p className="mt-3 text-sm text-slate-500">Opening your first connected client workspace...</p>
        <div className="mt-6 h-3 w-full animate-pulse rounded-full bg-slate-100" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-5 mt-5 rounded-[28px] border border-rose-100 bg-rose-50 p-8 text-rose-700 shadow-sm sm:mx-7 lg:mx-0 lg:mt-0">
        <h1 className="text-2xl font-semibold tracking-tight">Progress Review + Follow-up Workspace</h1>
        <p className="mt-3 text-sm">{error}</p>
      </section>
    );
  }

  if (!hasClient) {
    return <EmptyProgressReviewState />;
  }

  return null;
}
