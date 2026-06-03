import { useEffect, useState } from 'react';
import { ProgressChart } from '../../components/ProgressChart';
import { getMyCbtProgress } from '../../services/cbtApi';
import type { CbtProgress } from '../../types/cbt.types';

export default function MyProgress() {
  const [progress, setProgress] = useState<CbtProgress | null>(null);

  useEffect(() => {
    void getMyCbtProgress().then(setProgress);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My CBT Progress</h1>
        <p className="mt-1 text-sm text-slate-500">Track exercise completion and emotional intensity changes.</p>
      </div>
      <ProgressChart progress={progress} />
    </div>
  );
}
