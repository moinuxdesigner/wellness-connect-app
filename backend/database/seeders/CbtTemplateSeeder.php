<?php

namespace Database\Seeders;

use App\Models\CbtExerciseCategory;
use App\Models\CbtExerciseTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CbtTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Mood Tracking', 'description' => 'Brief check-ins for mood, anxiety, sleep, and energy.', 'sort_order' => 10],
            ['name' => 'Cognitive Restructuring', 'description' => 'Exercises for identifying thoughts, evidence, and balanced alternatives.', 'sort_order' => 20],
            ['name' => 'Behavioral Activation', 'description' => 'Activity planning and mood-before/after reflection.', 'sort_order' => 30],
            ['name' => 'Problem Solving', 'description' => 'Structured steps for clarifying problems and choosing next actions.', 'sort_order' => 40],
        ];

        $categoryIds = [];
        foreach ($categories as $category) {
            $model = CbtExerciseCategory::query()->updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category + ['slug' => Str::slug($category['name']), 'is_active' => true]
            );
            $categoryIds[$model->slug] = $model->id;
        }

        foreach ($this->templates($categoryIds) as $template) {
            CbtExerciseTemplate::query()->updateOrCreate(
                ['slug' => $template['slug']],
                $template + ['is_active' => true]
            );
        }
    }

    private function templates(array $categoryIds): array
    {
        return [
            [
                'category_id' => $categoryIds['mood-tracking'],
                'title' => 'Mood Check-in',
                'slug' => 'mood-check-in',
                'description' => 'A short daily check-in for mood, anxiety, sleep, and energy.',
                'clinical_purpose' => 'Track daily emotional state and identify early changes in wellbeing.',
                'instructions' => 'Answer each item based on how you feel today.',
                'difficulty_level' => 'intro',
                'estimated_minutes' => 4,
                'target_conditions_json' => ['anxiety', 'depression', 'stress'],
                'template_schema_json' => [
                    'fields' => [
                        ['key' => 'mood_score', 'label' => 'Mood score', 'type' => 'slider', 'min' => 0, 'max' => 10, 'required' => true],
                        ['key' => 'anxiety_score', 'label' => 'Anxiety score', 'type' => 'slider', 'min' => 0, 'max' => 10, 'required' => true],
                        ['key' => 'energy_score', 'label' => 'Energy score', 'type' => 'slider', 'min' => 0, 'max' => 10],
                        ['key' => 'sleep_quality', 'label' => 'Sleep quality', 'type' => 'slider', 'min' => 0, 'max' => 10],
                        ['key' => 'main_emotion', 'label' => 'Main emotion', 'type' => 'select', 'options' => ['Good', 'Okay', 'Anxious', 'Low', 'Angry', 'Tired']],
                        ['key' => 'note', 'label' => 'Anything important today?', 'type' => 'textarea'],
                    ],
                ],
            ],
            [
                'category_id' => $categoryIds['cognitive-restructuring'],
                'title' => 'Thought Record',
                'slug' => 'thought-record',
                'description' => 'Identify a situation, automatic thought, evidence, and balanced alternative.',
                'clinical_purpose' => 'Support cognitive restructuring through a guided thought record.',
                'instructions' => 'Move step by step. You do not need perfect answers; a few honest notes are enough.',
                'difficulty_level' => 'standard',
                'estimated_minutes' => 15,
                'target_conditions_json' => ['anxiety', 'depression', 'stress', 'panic'],
                'template_schema_json' => [
                    'fields' => [
                        ['key' => 'situation', 'label' => 'What happened?', 'type' => 'textarea', 'required' => true],
                        ['key' => 'emotions', 'label' => 'What emotions did you feel?', 'type' => 'multi_select', 'options' => ['Anxiety', 'Sadness', 'Anger', 'Guilt', 'Shame', 'Fear']],
                        ['key' => 'emotion_before', 'label' => 'Emotion intensity before', 'type' => 'slider', 'min' => 0, 'max' => 100, 'required' => true],
                        ['key' => 'automatic_thought', 'label' => 'What went through your mind?', 'type' => 'textarea', 'required' => true],
                        ['key' => 'cognitive_distortion', 'label' => 'Possible thinking pattern', 'type' => 'select', 'options' => ['All-or-nothing thinking', 'Catastrophizing', 'Mind reading', 'Fortune telling', 'Overgeneralization', 'Emotional reasoning', 'Personalization', 'Should statements', 'Discounting positives', 'Labeling']],
                        ['key' => 'evidence_for', 'label' => 'Evidence for this thought', 'type' => 'textarea'],
                        ['key' => 'evidence_against', 'label' => 'Evidence against this thought', 'type' => 'textarea'],
                        ['key' => 'balanced_thought', 'label' => 'A more balanced thought', 'type' => 'textarea'],
                        ['key' => 'emotion_after', 'label' => 'Emotion intensity now', 'type' => 'slider', 'min' => 0, 'max' => 100],
                        ['key' => 'learning', 'label' => 'What did you learn?', 'type' => 'textarea'],
                    ],
                ],
            ],
            [
                'category_id' => $categoryIds['behavioral-activation'],
                'title' => 'Behavioral Activation',
                'slug' => 'behavioral-activation',
                'description' => 'Plan and review one meaningful or pleasant activity.',
                'clinical_purpose' => 'Help clients connect behavior, activity, and mood change.',
                'instructions' => 'Choose a small realistic activity, then record how you felt before and after.',
                'difficulty_level' => 'intro',
                'estimated_minutes' => 10,
                'target_conditions_json' => ['depression', 'low_motivation', 'stress'],
                'template_schema_json' => [
                    'fields' => [
                        ['key' => 'planned_activity', 'label' => 'Planned activity', 'type' => 'text', 'required' => true],
                        ['key' => 'activity_type', 'label' => 'Activity type', 'type' => 'radio', 'options' => ['Pleasant', 'Mastery', 'Social', 'Health', 'Values-based']],
                        ['key' => 'planned_date', 'label' => 'Date', 'type' => 'date'],
                        ['key' => 'planned_time', 'label' => 'Time', 'type' => 'time'],
                        ['key' => 'mood_before', 'label' => 'Mood before', 'type' => 'slider', 'min' => 0, 'max' => 10],
                        ['key' => 'mood_after', 'label' => 'Mood after', 'type' => 'slider', 'min' => 0, 'max' => 10],
                        ['key' => 'difficulty', 'label' => 'How difficult was it?', 'type' => 'slider', 'min' => 0, 'max' => 10],
                        ['key' => 'what_helped', 'label' => 'What helped you complete it?', 'type' => 'textarea'],
                    ],
                ],
            ],
            [
                'category_id' => $categoryIds['cognitive-restructuring'],
                'title' => 'Cognitive Distortion Practice',
                'slug' => 'cognitive-distortion-practice',
                'description' => 'Practice identifying thinking patterns and replacing them with balanced alternatives.',
                'clinical_purpose' => 'Build familiarity with common cognitive distortions.',
                'instructions' => 'Pick one recent automatic thought and explore the pattern behind it.',
                'difficulty_level' => 'intro',
                'estimated_minutes' => 8,
                'target_conditions_json' => ['anxiety', 'stress', 'low_confidence'],
                'template_schema_json' => [
                    'fields' => [
                        ['key' => 'automatic_thought', 'label' => 'Automatic thought', 'type' => 'textarea', 'required' => true],
                        ['key' => 'selected_distortion', 'label' => 'Thinking pattern', 'type' => 'select', 'options' => ['All-or-nothing thinking', 'Catastrophizing', 'Mind reading', 'Fortune telling', 'Overgeneralization', 'Emotional reasoning', 'Personalization', 'Should statements', 'Discounting positives', 'Labeling']],
                        ['key' => 'why_this_pattern', 'label' => 'Why might this pattern fit?', 'type' => 'textarea'],
                        ['key' => 'balanced_replacement', 'label' => 'Balanced replacement thought', 'type' => 'textarea'],
                        ['key' => 'confidence_rating', 'label' => 'How believable is the balanced thought?', 'type' => 'slider', 'min' => 0, 'max' => 100],
                        ['key' => 'used_today', 'label' => 'I practiced this today', 'type' => 'checkbox'],
                    ],
                ],
            ],
            [
                'category_id' => $categoryIds['problem-solving'],
                'title' => 'Problem Solving Worksheet',
                'slug' => 'problem-solving-worksheet',
                'description' => 'Clarify a problem, compare possible solutions, and choose a first step.',
                'clinical_purpose' => 'Reduce overwhelm by converting vague stress into action planning.',
                'instructions' => 'Focus on one problem you can influence this week.',
                'difficulty_level' => 'standard',
                'estimated_minutes' => 12,
                'target_conditions_json' => ['stress', 'anxiety', 'overwhelm'],
                'template_schema_json' => [
                    'fields' => [
                        ['key' => 'problem', 'label' => 'Define the problem clearly', 'type' => 'textarea', 'required' => true],
                        ['key' => 'possible_solutions', 'label' => 'Possible solutions', 'type' => 'textarea'],
                        ['key' => 'best_solution', 'label' => 'Best solution for now', 'type' => 'textarea'],
                        ['key' => 'first_step', 'label' => 'First step', 'type' => 'text'],
                        ['key' => 'obstacle', 'label' => 'Likely obstacle', 'type' => 'textarea'],
                        ['key' => 'plan_b', 'label' => 'Plan B', 'type' => 'textarea'],
                    ],
                ],
            ],
        ];
    }
}
