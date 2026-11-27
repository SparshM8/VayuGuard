'use client';

import { useMemo, useState } from 'react';
import { calculateImpactMetrics } from '@/lib/impactCalculator';
import { LucideIconComponent } from '@/lib/icons';
import {
  Bus,
  Calculator,
  Car,
  Leaf,
  ShieldCheck,
  Sparkles,
  TreePine,
  TrendingDown,
  Zap,
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  subtitle: string;
  accentClass: string;
  icon: LucideIconComponent;
}

function ImpactMetricCard({
  label,
  value,
  unit,
  subtitle,
  accentClass,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm">
      <div className={`flex items-center justify-between ${accentClass} mb-2`}>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-300">{label}</span>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-3xl font-extrabold text-white">
        {value}{' '}
        {unit && <span className="text-sm font-normal text-slate-300">{unit}</span>}
      </p>
      <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

/** Interactive What-If environmental and health impact simulator. */
export function ImpactCalculator() {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(15);
  const [transitSwitched, setTransitSwitched] = useState(true);
  const [plantCount, setPlantCount] = useState(4);
  const [purifierHours, setPurifierHours] = useState(10);
  const [useInduction, setUseInduction] = useState(true);
  const [compostWaste, setCompostWaste] = useState(true);

  const metrics = useMemo(
    () =>
      calculateImpactMetrics({
        commuteDistanceKm,
        transitSwitched,
        plantCount,
        purifierHours,
        useInduction,
        compostWaste,
      }),
    [commuteDistanceKm, transitSwitched, plantCount, purifierHours, useInduction, compostWaste]
  );

  return (
    <section
      aria-labelledby="calculator-heading"
      className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 id="calculator-heading" className="text-2xl font-bold tracking-tight">
                Personal &amp; Household Impact Simulator
              </h3>
              <p className="text-slate-400 text-sm">
                Quantify the direct emission reductions, toxic PM2.5 avoidance, and cost savings of your lifestyle
                choices.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive What-If Model
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ImpactMetricCard
            label="Annual CO₂ Prevented"
            value={metrics.totalCo2SavedKg.toLocaleString()}
            unit="kg/yr"
            subtitle="Direct greenhouse gas mitigation"
            accentClass="text-emerald-400"
            icon={Leaf}
          />
          <ImpactMetricCard
            label="PM2.5 Inhalation Avoided"
            value={`~${metrics.totalDailyPm25Avoided}`}
            unit="μg/day"
            subtitle="Kept out of lungs and bloodstream"
            accentClass="text-cyan-400"
            icon={ShieldCheck}
          />
          <ImpactMetricCard
            label="Est. Annual Savings"
            value={`$${metrics.totalFinancialSavedUsd.toLocaleString()}`}
            unit={`(₹${metrics.totalFinancialSavedInr.toLocaleString()})`}
            subtitle="Fuel, healthcare, & energy efficiency"
            accentClass="text-amber-400"
            icon={TrendingDown}
          />
          <ImpactMetricCard
            label="Equivalent Forest Impact"
            value={String(metrics.treeEquivalent)}
            unit="Mature Trees"
            subtitle="Annual carbon absorption equivalent"
            accentClass="text-lime-400"
            icon={TreePine}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="commute-range" className="text-sm font-semibold flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                One-Way Commute Distance:{' '}
                <span className="text-blue-300 font-bold">{commuteDistanceKm} km</span>
              </label>
              <span className="text-xs text-slate-400">({commuteDistanceKm * 2} km daily)</span>
            </div>
            <input
              id="commute-range"
              type="range"
              min="2"
              max="50"
              step="1"
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-sm font-medium block">
                    Switch from Solo Car to Metro / Public Transit
                  </span>
                  <span className="text-xs text-slate-400">Eliminates ~75% tailpipe carbon footprint</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={transitSwitched}
                onChange={(e) => setTransitSwitched(e.target.checked)}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="plant-range" className="text-sm font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                NASA Clean-Air Plants in Home:{' '}
                <span className="text-emerald-300 font-bold">{plantCount} plants</span>
              </label>
            </div>
            <input
              id="plant-range"
              type="range"
              min="0"
              max="15"
              step="1"
              value={plantCount}
              onChange={(e) => setPlantCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <label htmlFor="purifier-range" className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Air Purifier Run Time:{' '}
                <span className="text-cyan-300 font-bold">{purifierHours} hrs/day</span>
              </label>
            </div>
            <input
              id="purifier-range"
              type="range"
              min="0"
              max="24"
              step="1"
              value={purifierHours}
              onChange={(e) => setPurifierHours(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium block">Induction Cooktop (Zero Indoor NO₂)</span>
                  <span className="text-xs text-slate-400">Replaces unventilated fossil gas cylinder</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useInduction}
                onChange={(e) => setUseInduction(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-medium block">Zero-Burn Organic Composting</span>
                  <span className="text-xs text-slate-400">Zero open garden burning + methane avoidance</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={compostWaste}
                onChange={(e) => setCompostWaste(e.target.checked)}
                className="w-5 h-5 rounded accent-green-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
