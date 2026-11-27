'use client';

import { IndoorAirQualityHack } from '@/types';
import {
  categoryIcons,
  categoryLabels,
  costColors,
  iconMap,
  maintenanceColors,
} from '@/lib/icons';
import { Heart } from 'lucide-react';

interface IndoorAirQualityProps {
  hacks: IndoorAirQualityHack[];
}

const CATEGORY_ORDER: IndoorAirQualityHack['category'][] = [
  'plants',
  'ventilation',
  'purification',
  'habits',
  'maintenance',
];

/** Renders evidence-based indoor air quality improvements including phytoremediation and DIY filtration. */
export function IndoorAirQuality({ hacks }: IndoorAirQualityProps) {
  const sortedHacks = [...hacks].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Indoor Air Quality Hacks</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {hacks.length} solutions
        </span>
      </div>

      <div className="space-y-4">
        {CATEGORY_ORDER.map((category) => {
          const categoryHacks = sortedHacks.filter((h) => h.category === category);
          if (categoryHacks.length === 0) return null;

          const CategoryIcon = categoryIcons[category] || Heart;

          return (
            <div key={category} className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <CategoryIcon className="w-5 h-5 text-green-600" />
                {categoryLabels[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryHacks.map((hack) => (
                  <HackCard key={hack.id} hack={hack} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HackCard({ hack }: { hack: IndoorAirQualityHack }) {
  const Icon = iconMap[hack.icon] || Heart;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{hack.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{hack.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Effectiveness: {hack.effectiveness}%
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${costColors[hack.cost]}`}>
              Cost: {hack.cost.charAt(0).toUpperCase() + hack.cost.slice(1)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${maintenanceColors[hack.maintenance]}`}
            >
              Maintenance: {hack.maintenance.charAt(0).toUpperCase() + hack.maintenance.slice(1)}
            </span>
          </div>

          {hack.suitableFor.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {hack.suitableFor.map((suitable, idx) => (
                <span key={`${suitable}-${idx}`} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {suitable}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
