'use client';

import { HourlyDataPoint } from '@/types';
import { AQI_CATEGORY_THEMES } from '@/lib/constants';
import { findSafeVentilationWindows } from '@/lib/aqiMath';
import { CheckCircle2, Clock, ShieldAlert, Sun } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyDataPoint[];
}

/** 24-hour smog inversion forecast identifying cleanest midday ventilation windows vs. peak hazards. */
export function HourlyForecast({ hourly }: HourlyForecastProps) {
  if (!hourly || hourly.length === 0) return null;

  const { bestWindow, bestAqi, worstWindow, worstAqi } = findSafeVentilationWindows(hourly);
  const maxForecastAqi = Math.max(...hourly.map((h) => h.aqi), 300);

  return (
    <section
      aria-labelledby="hourly-forecast-heading"
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 id="hourly-forecast-heading" className="text-xl font-bold text-gray-900">
              24-Hour Smog &amp; AQI Forecast
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time hourly air pollution progression for planning commutes, outdoor errands, and home
            ventilation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cleanest: {bestWindow} (AQI ~{bestAqi})
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Peak Smog: {worstWindow} (AQI ~{worstAqi})
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <Sun className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-900">Winter Inversion Dynamics:</span> Cold night air traps
          vehicular exhaust and biomass smoke near street level. Smog concentration peaks from late evening
          until 8:30 AM. Solar warming in early afternoon elevates and dilutes pollutants.
        </p>
      </div>

      <div className="relative">
        <div
          className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-gray-200 focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Hourly air quality forecast scrollable list"
        >
          {hourly.map((item, idx) => {
            const theme = AQI_CATEGORY_THEMES[item.category] || AQI_CATEGORY_THEMES.Moderate;
            const barHeightPct = Math.max(15, Math.min(100, (item.aqi / maxForecastAqi) * 100));
            const isNow = idx === 0;

            return (
              <div
                key={`${item.time}-${idx}`}
                className={`flex-shrink-0 w-24 p-3 rounded-xl border flex flex-col items-center justify-between transition-all ${
                  isNow ? 'ring-2 ring-blue-500 bg-blue-50/40 border-blue-300' : theme.hourlyCardBg
                }`}
              >
                <div className="text-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    {isNow ? 'Now' : item.hour}
                  </span>
                  <span className={`text-xl font-extrabold ${theme.hourlyText} block mt-0.5`}>
                    {item.aqi}
                  </span>
                </div>

                <div className="w-2.5 h-16 bg-gray-200/60 rounded-full my-2.5 flex items-end p-0.5">
                  <div
                    className={`w-full rounded-full transition-all duration-500 ${theme.hourlyBar}`}
                    style={{ height: `${barHeightPct}%` }}
                    title={`AQI ${item.aqi} (${item.category})`}
                  />
                </div>

                <div className="text-center w-full">
                  <span className="text-[10px] text-gray-500 block">PM2.5</span>
                  <span className="text-xs font-medium text-gray-800 block truncate">
                    {item.pm25} <span className="text-[9px]">μg/m³</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
