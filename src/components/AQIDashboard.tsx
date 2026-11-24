'use client';

import { AQIData, AQICategory } from '@/types';
import { LucideIconComponent } from '@/lib/icons';
import { 
  CheckCircle2, 
  Info, 
  TriangleAlert as AlertTriangle, 
  RotateCw, 
  ExternalLink, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  Activity 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HourlyForecast } from './HourlyForecast';

interface AQIDashboardProps {
  data: AQIData;
  onRefresh: () => void;
  onOpenDefensePlan?: () => void;
}

const categoryIcons: Record<AQICategory, LucideIconComponent> = {
  'Good': CheckCircle2,
  'Moderate': Info,
  'Unhealthy for Sensitive Groups': AlertTriangle,
  'Unhealthy': AlertTriangle,
  'Very Unhealthy': ShieldAlert,
  'Hazardous': ShieldAlert,
};

const categoryBadgeStyles: Record<AQICategory, { bg: string; text: string; gradient: string }> = {
  'Good': {
    bg: 'bg-emerald-500',
    text: 'text-emerald-700',
    gradient: 'from-emerald-600 via-teal-700 to-emerald-800',
  },
  'Moderate': {
    bg: 'bg-amber-500',
    text: 'text-amber-700',
    gradient: 'from-amber-600 via-yellow-700 to-amber-800',
  },
  'Unhealthy for Sensitive Groups': {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    gradient: 'from-orange-600 via-amber-700 to-orange-800',
  },
  'Unhealthy': {
    bg: 'bg-rose-500',
    text: 'text-rose-700',
    gradient: 'from-rose-600 via-red-700 to-rose-800',
  },
  'Very Unhealthy': {
    bg: 'bg-purple-600',
    text: 'text-purple-700',
    gradient: 'from-purple-700 via-indigo-800 to-purple-900',
  },
  'Hazardous': {
    bg: 'bg-red-950',
    text: 'text-red-900',
    gradient: 'from-red-950 via-rose-950 to-neutral-950',
  },
};

export function AQIDashboard({ data, onRefresh, onOpenDefensePlan }: AQIDashboardProps) {
  const CategoryIcon = categoryIcons[data.category] || Info;
  const theme = categoryBadgeStyles[data.category] || categoryBadgeStyles.Moderate;

  const getPollutantCardStyle = (aqi: number) => {
    if (aqi <= 50) return 'border-emerald-200 bg-emerald-50/50 text-emerald-900';
    if (aqi <= 100) return 'border-amber-200 bg-amber-50/50 text-amber-900';
    if (aqi <= 150) return 'border-orange-200 bg-orange-50/50 text-orange-900';
    if (aqi <= 200) return 'border-rose-200 bg-rose-50/50 text-rose-900';
    if (aqi <= 300) return 'border-purple-200 bg-purple-50/50 text-purple-900';
    return 'border-red-900 bg-red-950/10 text-red-950';
  };

  const formattedRelativeTime = (() => {
    try {
      return formatDistanceToNow(new Date(data.timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  })();

  const formattedExactTime = (() => {
    try {
      return new Date(data.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  })();

  return (
    <div className="space-y-6">
      {/* Hero AQI Card with Live Metadata */}
      <div 
        className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.gradient} text-white shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE SENSOR FEED</span>
              {data.dominantPollutant && (
                <>
                  <span className="text-white/50">•</span>
                  <span>Dominant: {data.dominantPollutant}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                <CategoryIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {data.city}
                </h1>
                <p className="text-white/80 text-sm flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {data.location} ({data.coordinates.latitude.toFixed(2)}°, {data.coordinates.longitude.toFixed(2)}°)
                </p>
              </div>
            </div>
          </div>

          {/* AQI Big Value Display */}
          <div className="flex items-center gap-6 self-start md:self-auto bg-black/20 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">US-EPA AQI</p>
              <p className="text-5xl sm:text-6xl font-black tracking-tight">{data.aqi}</p>
            </div>
            <div className="border-l border-white/20 pl-4 space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 inline-block">
                {data.category}
              </span>
              <p className="text-[11px] text-white/70 max-w-[140px]">
                {data.aqi <= 50 ? 'Air is healthy & clean' : data.aqi <= 100 ? 'Moderate air quality' : data.aqi <= 150 ? 'Sensitive groups at risk' : data.aqi <= 200 ? 'General public impacted' : 'High emergency smog'}
              </p>
            </div>
          </div>
        </div>

        {/* Source & Timestamp Transparency Bar */}
        <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-white/60 font-medium block">Data Source</span>
            <span className="font-semibold text-white truncate block mt-0.5" title={data.source}>
              {data.source}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-white/60 font-medium block">Last Updated</span>
            <span className="font-semibold text-white block mt-0.5">
              {formattedRelativeTime} {formattedExactTime && `(${formattedExactTime})`}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-white/60 font-medium block">Coordinates</span>
            <span className="font-semibold text-white block mt-0.5 font-mono">
              {data.coordinates.latitude.toFixed(3)}N, {data.coordinates.longitude.toFixed(3)}E
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2 backdrop-blur-sm">
            <button
              onClick={onRefresh}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition"
              aria-label="Refresh real-time air quality data"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
              title="Inspect official data source documentation"
              aria-label="Official source documentation"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Hourly 24-Hour Forecast Timeline */}
      {data.hourlyForecast && data.hourlyForecast.length > 0 && (
        <HourlyForecast hourly={data.hourlyForecast} />
      )}

      {/* Pollutant Breakdown Cards */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Individual Pollutant Concentrations & Sub-Indices
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time atmospheric readings calibrated with CPCB & EPA sub-index thresholds.
            </p>
          </div>
          {onOpenDefensePlan && (
            <button
              onClick={onOpenDefensePlan}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition self-start sm:self-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Family Smog Plan</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.pollutants.map((pollutant) => (
            <div
              key={pollutant.name}
              className={`rounded-2xl p-4 border transition hover:shadow-sm ${getPollutantCardStyle(pollutant.aqi)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">{pollutant.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 font-semibold">
                  Sub-AQI: {pollutant.aqi}
                </span>
              </div>
              <p className="text-2xl font-black mt-2 tracking-tight">
                {pollutant.value}{' '}
                <span className="text-xs font-normal opacity-70">{pollutant.unit}</span>
              </p>
              <p className="text-[10px] mt-2 opacity-80 line-clamp-2 leading-tight">
                {pollutant.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
