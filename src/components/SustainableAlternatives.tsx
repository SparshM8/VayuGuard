'use client';

import { SustainableAlternative } from '@/types';
import { iconMap, categoryIcons, categoryLabels, difficultyColors } from '@/lib/icons';
import { Heart, ArrowRight } from 'lucide-react';

interface SustainableAlternativesProps {
  alternatives: SustainableAlternative[];
}

export function SustainableAlternatives({ alternatives }: SustainableAlternativesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sustainable Alternatives & Impact</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {alternatives.length} alternatives
        </span>
      </div>

      <div className="space-y-4">
        {alternatives.map((alternative) => (
          <AlternativeCard key={alternative.id} alternative={alternative} />
        ))}
      </div>
    </div>
  );
}

function AlternativeCard({ alternative }: { alternative: SustainableAlternative }) {
  const Icon = iconMap[alternative.icon] || Heart;
  const CategoryIcon = categoryIcons[alternative.category] || Heart;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CategoryIcon className="w-4 h-4" />
                <span>{categoryLabels[alternative.category]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[alternative.difficulty]}`}>
                  {alternative.difficulty}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{alternative.alternative}</p>
                <p className="text-gray-500 text-sm line-through">{alternative.currentPractice}</p>
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-300 flex-shrink-0 mt-1" />
          </div>
          
          <p className="mt-3 text-gray-600 text-sm">{alternative.explanation}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="font-medium text-green-800">CO₂ Reduction</p>
              <p className="text-green-700">{alternative.co2Reduction}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="font-medium text-red-800">Health Impact</p>
              <p className="text-red-700">{alternative.healthImpact}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-800">Cost Impact</p>
              <p className="text-blue-700">{alternative.costImpact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}