'use client';

import { UserProfile } from '@/types';
import { PROFILE_OPTIONS } from '@/lib/constants';
import { CheckCircle2, Sliders } from 'lucide-react';

interface PersonaSwitcherProps {
  activeProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
}

/** Interactive top bar allowing instant live switching between user vulnerability & lifestyle personas. */
export function PersonaSwitcher({ activeProfile, onSelectProfile }: PersonaSwitcherProps) {
  return (
    <section
      aria-label="User Persona Selector"
      className="bg-slate-900 text-white py-3 border-b border-slate-800 shadow-inner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Select Persona:
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Click to see how AI recommendations dynamically adapt)
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {PROFILE_OPTIONS.map((meta) => {
              const IconComponent = meta.icon;
              const isSelected = activeProfile === meta.value;

              return (
                <button
                  key={meta.value}
                  type="button"
                  onClick={() => onSelectProfile(meta.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{meta.label}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-blue-200" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
