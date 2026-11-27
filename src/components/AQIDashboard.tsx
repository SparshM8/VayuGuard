'use client';

import { AQIData, Pollutant } from '@/types';
import { AQI_CATEGORY_THEMES, WHO_DAILY_LIMITS } from '@/lib/constants';
import { getAQICategory } from '@/lib/aqiMath';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  MapPin,
  RotateCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HourlyForecast } from './HourlyForecast';

interface AQIDashboardProps {
  data: AQIData;
  onRefresh: () => void;
  onOpenDefensePlan?: () => void;
}

function formatTelemetryTimestamps(isoTimestamp: string): { relative: string; exact: string } {
  try {
    const date = new Date(isoTimestamp);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      exact: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  } catch {
    return { relative: 'just now', exact: '' };
  }
}

function PollutantCard({ pollutant }: { pollutant: Pollutant }) {
  const category = getAQICategory(pollutant.aqi);
  const cardStyle =
    AQI_CATEGORY_THEMES[category]?.pollutantCardStyle ||
    AQI_CATEGORY_THEMES.Moderate.pollutantCardStyle;
  const who = WHO_DAILY_LIMITS[pollutant.code?.toLowerCase() || ''];
  const whoRatio = who ? Number((pollutant.value / who.limit).toFixed(1)) : null;
  const isExceeded = whoRatio !== null && whoRatio > 1.0;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all hover:shadow-md flex flex-col justify-between ${cardStyle}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider">{pollutant.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 font-bold">
            Sub-AQI: {pollutant.aqi}
          </span>
        </div>

        <p className="text-2xl font-black mt-2 tracking-tight">
          {pollutant.value} <span className="text-xs font-normal opacity-70">{pollutant.unit}</span>
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {who && (
          <div className="text-[10px] font-semibold">
            {isExceeded ? (
              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                {whoRatio}x WHO limit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Within WHO limit
              </span>
            )}
          </div>
        )}

        <p className="text-[10px] opacity-75 line-clamp-2 leading-tight">{pollutant.description}</p>
      </div>
    </div>
  );
}

/** Primary live telemetry dashboard displaying overall US-EPA AQI, hourly timeline, and WHO pollutant benchmarks. */
export function AQIDashboard({ data, onRefresh, onOpenDefensePlan }: AQIDashboardProps) {
  const theme = AQI_CATEGORY_THEMES[data.category] || AQI_CATEGORY_THEMES.Moderate;
  const CategoryIcon = theme.icon || Info;
  const { relative, exact } = formatTelemetryTimestamps(data.timestamp);

  return (
    <div className="space-y-6">
      <div
        className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.heroGradient} text-white shadow-2xl ${theme.heroGlow} relative overflow-hidden transition-all`}
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE SENSOR FEED</span>
              </span>

              {data.dominantPollutant && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/10">
                  Dominant: <strong className="text-white">{data.dominantPollutant}</strong>
                </span>
              )}

              {data.isSmogSevere && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                  Severe Smog Alert
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <CategoryIcon className="w-9 h-9 text-white" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                  {data.city}
                </h2>
                <p className="text-white/80 text-sm flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-white/70" />
                  <span>{data.location}</span>
                  <span className="text-white/40">&bull;</span>
                  <span className="font-mono text-xs">
                    {data.coordinates.latitude.toFixed(2)}°N, {data.coordinates.longitude.toFixed(2)}°E
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto bg-black/30 p-5 rounded-3xl border border-white/15 backdrop-blur-xl shadow-xl">
            <div className="text-center sm:text-left">
              <span className="text-white/70 text-[11px] font-extrabold uppercase tracking-widest block">
                US-EPA AQI
              </span>
              <span className="text-5xl sm:text-6xl font-black tracking-tighter text-white block mt-0.5">
                {data.aqi}
              </span>
            </div>
            <div className="border-l border-white/20 pl-5 space-y-1.5 max-w-[160px]">
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 inline-block text-white">
                {data.category}
              </span>
              <p className="text-xs text-white/80 leading-snug">{theme.shortSummary}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-white/60 font-medium block text-[11px]">Data Source</span>
            <span className="font-semibold text-white truncate block mt-0.5" title={data.source}>
              {data.source}
            </span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-white/60 font-medium block text-[11px]">Telemetry Timestamp</span>
            <span className="font-semibold text-white block mt-0.5">
              {relative} {exact && `(${exact})`}
            </span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-white/60 font-medium block text-[11px]">Ground Reference</span>
            <span className="font-semibold text-white block mt-0.5">
              CPCB India &amp; CAMS European Sensors
            </span>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-2 backdrop-blur-md border border-white/10">
            <button
              type="button"
              onClick={onRefresh}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition"
              aria-label="Refresh real-time air quality data"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh Feed</span>
            </button>
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
              title="Official Data Source API Documentation"
              aria-label="Official source documentation"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {data.hourlyForecast && data.hourlyForecast.length > 0 && (
        <HourlyForecast hourly={data.hourlyForecast} />
      )}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Individual Pollutant Concentrations vs. WHO Safe Limits
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Every pollutant concentration benchmarked against World Health Organization (WHO 2021) safe
              24-hour exposure thresholds.
            </p>
          </div>
          {onOpenDefensePlan && (
            <button
              type="button"
              onClick={onOpenDefensePlan}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition self-start sm:self-auto border border-emerald-200"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1-Page Smog Plan</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {data.pollutants.map((pollutant) => (
            <PollutantCard key={pollutant.name} pollutant={pollutant} />
          ))}
        </div>
      </div>
    </div>
  );
}
