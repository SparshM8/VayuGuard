export interface DefenseStep {
  title: string;
  detail: string;
}

export interface MaintenanceItem {
  title: string;
  detail: string;
}

export const SMOG_DEFENSE_STEPS: DefenseStep[] = [
  {
    title: 'Strict N95/KN95 Masking:',
    detail:
      'Cloth and surgical masks allow 80%+ of PM2.5 particles through. Ensure tight nasal seal with certified N95 whenever outdoors.',
  },
  {
    title: 'No Outdoor Morning Cardio:',
    detail:
      'Do not jog, run, or cycle between 6:00 AM - 9:00 AM. Ground-level temperature inversion traps toxic particulate soot near chest height.',
  },
  {
    title: 'Seal Ingress Cracks & Doors:',
    detail:
      'Place rolled towels or silicone weatherstripping under external doors and window sills to stop outdoor smog infiltration.',
  },
  {
    title: 'Zero Combustion Rule:',
    detail:
      'Completely ban indoor burning of agarbatti/incense, scented paraffin candles, mosquito coils, or unventilated fireplace fuel.',
  },
];

export const SMOG_MAINTENANCE_ITEMS: MaintenanceItem[] = [
  {
    title: 'Snake Plant (Bedroom)',
    detail: 'Releases oxygen at night and neutralizes formaldehyde. Keep 1-2 pots per bedroom.',
  },
  {
    title: 'Spider Plant (Living Area)',
    detail: '100% pet-safe, filters carbon monoxide and VOCs. Water once weekly.',
  },
  {
    title: 'HEPA H13 Filter Inspection',
    detail: 'Vacuum pre-filter mesh monthly; replace true HEPA cartridge every 6 months during winter smog.',
  },
  {
    title: 'Damp Mop Protocol',
    detail: 'Mop floors daily with damp microfiber to eliminate settled PM2.5 without aerosolizing dust.',
  },
];
