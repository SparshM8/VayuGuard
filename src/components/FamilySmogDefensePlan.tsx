'use client';

import { AQIData, UserContext } from '@/types';
import { SMOG_DEFENSE_STEPS, SMOG_MAINTENANCE_ITEMS } from '@/data/smogDefensePlan';
import { AlertTriangle, CheckCircle2, Leaf, Printer, ShieldCheck, Wind, X } from 'lucide-react';

interface FamilySmogDefensePlanProps {
  aqiData: AQIData;
  userContext: UserContext;
  isOpen: boolean;
  onClose: () => void;
}

/** Printable single-page household winter smog action checklist modal. */
export function FamilySmogDefensePlan({
  aqiData,
  userContext,
  isOpen,
  onClose,
}: FamilySmogDefensePlanProps) {
  if (!isOpen) return null;

  const sensitiveMembers =
    [
      userContext.preferences.hasChildren && 'Children',
      userContext.preferences.hasElderly && 'Elderly',
      userContext.preferences.hasRespiratoryIssues && 'Asthma/Lung',
      userContext.preferences.hasPets && 'Pets',
    ]
      .filter(Boolean)
      .join(', ') || 'General adult';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="defense-plan-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between gap-4 print:bg-white print:text-black">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 print:border-black print:text-black">
                Official Smog Defense Protocol
              </span>
              <span className="text-xs text-slate-400 print:text-gray-600">
                Generated Protocol: Active
              </span>
            </div>
            <h2 id="defense-plan-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Family Winter Smog &amp; Clean Air Defense Plan
            </h2>
            <p className="text-sm text-slate-300 mt-1 print:text-gray-600">
              Personalized action checklist for {userContext.profile.toUpperCase()} in {aqiData.city},{' '}
              {aqiData.country} (AQI: {aqiData.aqi} &bull; {aqiData.category})
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
              aria-label="Close defense plan dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-medium">Target Location</p>
              <p className="font-bold text-gray-900">{aqiData.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Smog Level</p>
              <p className="font-bold text-gray-900">
                {aqiData.aqi} ({aqiData.category})
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Household Type</p>
              <p className="font-bold text-gray-900 capitalize">{userContext.preferences.homeType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Sensitive Members</p>
              <p className="font-bold text-gray-900">{sensitiveMembers}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              1. Critical Smog Inversion Defense Protocol
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {SMOG_DEFENSE_STEPS.map((step) => (
                <li
                  key={step.title}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">{step.title}</span> {step.detail}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-600" />
              2. Daily Smog Timing Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  Safest Outdoor &amp; Ventilation Window
                </span>
                <p className="font-bold text-emerald-950 text-base">1:00 PM &ndash; 3:30 PM</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Solar heating lifts atmospheric boundary layer. Best time for essential outdoor errands and
                  rapid 15-minute cross-ventilation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                  Extreme Danger Smog Peak Hours
                </span>
                <p className="font-bold text-rose-950 text-base">7:30 PM &ndash; 8:30 AM</p>
                <p className="text-xs text-rose-700 mt-1">
                  Heavy vehicular exhaust + nocturnal temperature inversion traps toxic particulate matter. Keep
                  all windows tightly sealed.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              3. Home Clean Air Maintenance Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
              {SMOG_MAINTENANCE_ITEMS.map((item) => (
                <div key={item.title} className="p-3 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-0.5">{item.title}</span>
                  {item.detail}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 block">
                When to Seek Immediate Medical Assistance:
              </span>
              Persistent breathlessness, wheezing that does not respond to prescribed inhalers, chest tightness,
              or blueness of lips/fingertips are signs of acute respiratory distress. Keep local emergency
              pulmonary contacts on speed dial.
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Stick this 1-page plan on your family refrigerator or community notice board.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
            >
              <Printer className="w-4 h-4" />
              Print Clean Air Plan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
