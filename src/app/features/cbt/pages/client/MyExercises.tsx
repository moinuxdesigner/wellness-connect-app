import { useEffect, useState } from 'react';
import { ExerciseCard } from '../../components/ExerciseCard';
import { getMyCbtExercises } from '../../services/cbtApi';
import type { CbtExerciseInstance } from '../../types/cbt.types';

export default function MyExercises() {
  const [exercises, setExercises] = useState<CbtExerciseInstance[]>([]);

  useEffect(() => {
    void getMyCbtExercises().then(setExercises);
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My CBT Exercises</h1>
        <p className="mt-1 text-sm text-slate-500">Complete assigned therapeutic practices and review feedback.</p>
      </div>
      <div className="grid gap-4">
        {exercises.map((exercise) => <ExerciseCard key={exercise.id} instance={exercise} to={`/client/cbt/exercises/${exercise.id}`} />)}
      </div>
    </div>
  );
}
