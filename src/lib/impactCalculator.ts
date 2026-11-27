export interface ImpactCalculatorInput {
  commuteDistanceKm: number;
  transitSwitched: boolean;
  plantCount: number;
  purifierHours: number;
  useInduction: boolean;
  compostWaste: boolean;
}

export interface ImpactMetrics {
  totalCo2SavedKg: number;
  totalDailyPm25Avoided: number;
  totalFinancialSavedUsd: number;
  totalFinancialSavedInr: number;
  treeEquivalent: number;
}

const WORKING_DAYS_PER_YEAR = 240;
const NET_TRANSIT_CO2_SAVING_KG_PER_KM = 0.157; // Solo petrol car (~192g/km) vs electric metro (~35g/km)
const INDUCTION_CO2_SAVED_KG_YR = 220;
const COMPOST_CO2_SAVED_KG_YR = 180;
const FUEL_SAVING_USD_PER_KM = 0.12;
const CO2_KG_PER_MATURE_TREE_YR = 22;
const USD_TO_INR_RATE = 83;

/**
 * Calculates annualized CO₂ mitigation, daily avoided PM2.5 inhalation,
 * financial savings, and tree-absorption equivalents from household habits.
 */
export function calculateImpactMetrics(input: ImpactCalculatorInput): ImpactMetrics {
  const safeDistanceKm = Math.max(0, input.commuteDistanceKm);
  const safePlantCount = Math.max(0, input.plantCount);
  const safePurifierHours = Math.max(0, Math.min(24, input.purifierHours));

  const annualCarKm = safeDistanceKm * 2 * WORKING_DAYS_PER_YEAR;
  const transportCo2Saved = input.transitSwitched
    ? Math.round(annualCarKm * NET_TRANSIT_CO2_SAVING_KG_PER_KM)
    : 0;

  const inductionCo2Saved = input.useInduction ? INDUCTION_CO2_SAVED_KG_YR : 0;
  const compostCo2Saved = input.compostWaste ? COMPOST_CO2_SAVED_KG_YR : 0;
  const totalCo2SavedKg = transportCo2Saved + inductionCo2Saved + compostCo2Saved;

  const commutePm25Avoided = input.transitSwitched
    ? Math.min(65, Math.round(safeDistanceKm * 2.2))
    : 0;
  const purifierPm25Avoided = Math.round(safePurifierHours * 6.5);
  const plantPm25Avoided = Math.min(30, Math.round(safePlantCount * 2.5));
  const totalDailyPm25Avoided = commutePm25Avoided + purifierPm25Avoided + plantPm25Avoided;

  const annualFuelSaved = input.transitSwitched
    ? Math.round(annualCarKm * FUEL_SAVING_USD_PER_KM)
    : 0;
  const annualHealthEnergySaved =
    (input.useInduction ? 45 : 0) + (safePurifierHours > 0 ? 90 : 0);
  const totalFinancialSavedUsd = annualFuelSaved + annualHealthEnergySaved;

  const treeEquivalent =
    totalCo2SavedKg === 0 ? 0 : Math.max(1, Math.round(totalCo2SavedKg / CO2_KG_PER_MATURE_TREE_YR));

  return {
    totalCo2SavedKg,
    totalDailyPm25Avoided,
    totalFinancialSavedUsd,
    totalFinancialSavedInr: totalFinancialSavedUsd * USD_TO_INR_RATE,
    treeEquivalent,
  };
}
