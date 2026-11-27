'use client';

import { AQICategory } from '@/types';
import { AQI_CATEGORY_THEMES } from '@/lib/constants';
import { ArrowRight, CheckCircle, Heart, Lightbulb, Shield } from 'lucide-react';

interface PersonalizedAdviceProps {
  advice: string;
  aqiCategory: AQICategory;
  aqiValue: number;
}

const KEY_REMINDERS = [
  'Small daily changes compound into significant health protection over time',
  'Air quality varies by hour — plan outdoor activities for cleaner midday periods',
  'Indoor air can be 2-5x more polluted than outdoor air without controlled ventilation',
  'Children and elderly are most vulnerable — prioritize their respiratory protection',
];

/** Displays GenAI-interpreted clinical guidance and immediate priority actions for the active AQI tier. */
export function PersonalizedAdvice({ advice, aqiCategory, aqiValue }: PersonalizedAdviceProps) {
  const theme = AQI_CATEGORY_THEMES[aqiCategory] || AQI_CATEGORY_THEMES.Moderate;
  const priorityActions = theme.priorityActions;

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 border ${theme.adviceBoxStyle}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h2 className="text-xl font-bold text-gray-900">Personalized Guidance</h2>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/50">
                AQI: {aqiValue} ({aqiCategory})
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{advice}</p>
          </div>
        </div>
      </div>

      {priorityActions.length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-6 bg-white">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            Priority Actions for Current AQI
          </h3>
          <ul className="space-y-3">
            {priorityActions.map((action) => (
              <li key={action} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-100">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
          <Heart className="w-5 h-5 text-red-500" />
          Remember
        </h3>
        <ul className="space-y-2 text-gray-700">
          {KEY_REMINDERS.map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
