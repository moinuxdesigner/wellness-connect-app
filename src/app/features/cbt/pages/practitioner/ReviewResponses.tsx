import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ReviewPanel } from '../../components/ReviewPanel';
import { getPlanCbtResponses, reviewCbtResponse } from '../../services/cbtApi';
import type { CbtExerciseResponse } from '../../types/cbt.types';

export default function ReviewResponses() {
  const planId = Number(useParams().planId ?? 1);
  const [responses, setResponses] = useState<CbtExerciseResponse[]>([]);

  useEffect(() => {
    void getPlanCbtResponses(planId).then(setResponses);
  }, [planId]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Review CBT Responses</h1>
        <p className="mt-1 text-sm text-slate-500">Add feedback for clients and keep clinical notes private.</p>
      </div>
      {responses.map((response) => <ReviewPanel key={response.id} response={response} onSubmit={(payload) => reviewCbtResponse(response.id, payload).then(() => undefined)} />)}
    </div>
  );
}
