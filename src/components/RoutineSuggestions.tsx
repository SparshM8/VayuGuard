'use client';

import { RoutineSuggestion } from '@/types';
import { categoryIcons, difficultyColors, iconMap, impactColors } from '@/lib/icons';
import { Clock, Heart, Leaf } from 'lucide-react';

interface RoutineSuggestionsProps {
  routines: RoutineSuggestion[];
}

const CATEGORY_ORDER: RoutineSuggestion['category'][] = ['commute', 'activity', 'lifestyle', 'indoor'];

/** Groups and displays personalized low-emission daily routine recommendations. */
export function RoutineSuggestions({ routines }: RoutineSuggestionsProps) {
  const sortedRoutines = [...routines].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Low-Emission Daily Routines</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {routines.length} suggestions
        </span>
      </div>

      <div className="space-y-4">
        {CATEGORY_ORDER.map((category) => {
          const categoryRoutines = sortedRoutines.filter((r) => r.category === category);
          if (categoryRoutines.length === 0) return null;

          const CategoryIcon = categoryIcons[category] || Heart;

          return (
            <div key={category} className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <CategoryIcon className="w-5 h-5 text-blue-600" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="space-y-3">
                {categoryRoutines.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoutineCard({ routine }: { routine: RoutineSuggestion }) {
  const Icon = iconMap[routine.icon] || Heart;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{routine.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{routine.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[routine.impact]}`}>
                {routine.impact.charAt(0).toUpperCase() + routine.impact.slice(1)} Impact
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[routine.difficulty]}`}
              >
                {routine.difficulty.charAt(0).toUpperCase() + routine.difficulty.slice(1)}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0 text-blue-500" />
              <span>{routine.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Leaf className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{routine.emissionReduction}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{routine.healthBenefit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
