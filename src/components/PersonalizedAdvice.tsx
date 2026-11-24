'use client';

import { Lightbulb, Heart, Shield, CheckCircle, ArrowRight } from 'lucide-react';

interface PersonalizedAdviceProps {
  advice: string;
  aqiCategory: string;
  aqiValue: number;
}

export function PersonalizedAdvice({ advice, aqiCategory, aqiValue }: PersonalizedAdviceProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Good': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Unhealthy for Sensitive Groups': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Unhealthy': return 'bg-red-100 text-red-800 border-red-200';
      case 'Very Unhealthy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Hazardous': return 'bg-red-900 text-red-100 border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityActions = (category: string) => {
    switch (category) {
      case 'Good':
        return [
          'Maintain current healthy habits',
          'Continue outdoor activities as normal',
          'Keep indoor spaces well-ventilated',
        ];
      case 'Moderate':
        return [
          'Sensitive individuals: limit prolonged outdoor exertion',
          'Keep windows closed during peak traffic hours',
          'Consider air purifier for bedrooms',
        ];
      case 'Unhealthy for Sensitive Groups':
        return [
          'Children, elderly, and those with respiratory conditions: avoid outdoor exertion',
          'Use N95/KN95 mask if going outside',
          'Run air purifier continuously',
        ];
      case 'Unhealthy':
        return [
          'Everyone: reduce outdoor activities',
          'Sensitive groups: stay indoors',
          'Seal windows, use air purifier',
        ];
      case 'Very Unhealthy':
        return [
          'Avoid all outdoor activities',
          'Stay indoors with air purification',
          'Wear mask if venturing out',
        ];
      case 'Hazardous':
        return [
          'Health emergency: stay indoors',
          'Use HEPA air purifier in all rooms',
          'Avoid all outdoor exposure',
        ];
      default:
        return [];
    }
  };

  const priorityActions = getPriorityActions(aqiCategory);

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 border ${getCategoryColor(aqiCategory)}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold text-gray-900">Personalized Guidance</h3>
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
            {priorityActions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
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
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Small daily changes compound into significant health protection over time</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Air quality varies by hour - plan outdoor activities for cleaner periods</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Indoor air can be 2-5x more polluted than outdoor air without ventilation</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Children and elderly are most vulnerable - prioritize their protection</span>
          </li>
        </ul>
      </div>
    </div>
  );
}