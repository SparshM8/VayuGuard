'use client';

import { useState } from 'react';
import { 
  Calculator, 
  Leaf, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  TreePine, 
  Zap, 
  Car, 
  Bus 
} from 'lucide-react';

export function ImpactCalculator() {
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(15);
  const [transitSwitched, setTransitSwitched] = useState<boolean>(true);
  const [plantCount, setPlantCount] = useState<number>(4);
  const [purifierHours, setPurifierHours] = useState<number>(10);
  const [useInduction, setUseInduction] = useState<boolean>(true);
  const [compostWaste, setCompostWaste] = useState<boolean>(true);

  // Dynamic calculations based on EPA and environmental health models
  // 1. Transport CO2: Solo petrol car ~192g CO2/km vs Electric Metro ~35g CO2/km (Net saving ~157g/km)
  // Working days: 240 days/year * (commuteDistanceKm * 2 roundtrip)
  const annualCarKm = commuteDistanceKm * 2 * 240;
  const transportCo2Saved = transitSwitched ? Math.round(annualCarKm * 0.157) : 0;

  // 2. Induction cooking: eliminates ~220 kg CO2/year vs fossil gas
  const inductionCo2Saved = useInduction ? 220 : 0;

  // 3. Composting organic waste: saves ~180 kg CO2e from landfill methane
  const compostCo2Saved = compostWaste ? 180 : 0;

  // Total annual CO2 reduction
  const totalCo2SavedKg = transportCo2Saved + inductionCo2Saved + compostCo2Saved;

  // 4. Daily PM2.5 Inhalation Avoided (Micrograms/day)
  // Average breathing rate ~15 m3/day.
  // In polluted metro transit vs street car/traffic: saves ~45 μg/m3 during commute hours (~35 μg)
  // HEPA purifier running: cleans ~120 μg/m3 indoor air for X hours -> saves ~7 μg per hour operated
  // Plants: adds ~1.5 μg filtration per plant
  const commutePm25Avoided = transitSwitched ? Math.min(65, Math.round(commuteDistanceKm * 2.2)) : 0;
  const purifierPm25Avoided = Math.round(purifierHours * 6.5);
  const plantPm25Avoided = Math.min(30, Math.round(plantCount * 2.5));
  const totalDailyPm25Avoided = commutePm25Avoided + purifierPm25Avoided + plantPm25Avoided;

  // 5. Financial Savings ($ / ₹)
  // Fuel/maintenance savings: ~$0.15 / km (or ₹12 / km)
  // Health bill avoidance: ~$120 / yr
  // Cooking efficiency: ~$40 / yr
  const annualFuelSaved = transitSwitched ? Math.round(annualCarKm * 0.12) : 0;
  const annualHealthEnergySaved = (useInduction ? 45 : 0) + (purifierHours > 0 ? 90 : 0);
  const totalFinancialSaved = annualFuelSaved + annualHealthEnergySaved;

  // 6. Equivalent mature urban trees needed to absorb this CO2 (~22 kg CO2 per mature tree/year)
  const treeEquivalent = Math.max(1, Math.round(totalCo2SavedKg / 22));

  return (
    <section 
      aria-labelledby="calculator-heading"
      className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
    >
      {/* Decorative background glow */}
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
                Personal & Household Impact Simulator
              </h3>
              <p className="text-slate-400 text-sm">
                Quantify the direct emission reductions, toxic PM2.5 avoidance, and cost savings of your lifestyle choices.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive What-If Model
          </span>
        </div>

        {/* 4 Impact Metric Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-300">Annual CO₂ Prevented</span>
              <Leaf className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {totalCo2SavedKg.toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-300">kg/yr</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Direct greenhouse gas mitigation</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-300">PM2.5 Inhalation Avoided</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              ~{totalDailyPm25Avoided}{' '}
              <span className="text-sm font-normal text-slate-300">μg/day</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Kept out of lungs and bloodstream</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-300">Est. Annual Savings</span>
              <TrendingDown className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              ${totalFinancialSaved.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-300">(₹{(totalFinancialSaved * 83).toLocaleString()})</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Fuel, healthcare, & energy efficiency</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-lime-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-300">Equivalent Forest Impact</span>
              <TreePine className="w-4 h-4" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {treeEquivalent}{' '}
              <span className="text-sm font-normal text-slate-300">Mature Trees</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Annual carbon absorption equivalent</p>
          </div>
        </div>

        {/* Interactive Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Commute Sliders */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="commute-range" className="text-sm font-semibold flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                One-Way Commute Distance: <span className="text-blue-300 font-bold">{commuteDistanceKm} km</span>
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
                  <span className="text-sm font-medium block">Switch from Solo Car to Metro / Public Transit</span>
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

          {/* Indoor Environment Sliders */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="plant-range" className="text-sm font-semibold flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                NASA Clean-Air Plants in Home: <span className="text-emerald-300 font-bold">{plantCount} plants</span>
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
                Air Purifier Run Time: <span className="text-cyan-300 font-bold">{purifierHours} hrs/day</span>
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

          {/* Sustainable Lifestyle Toggles */}
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
