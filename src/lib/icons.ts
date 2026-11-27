import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Battery,
  Bike,
  Briefcase,
  Building,
  Bus,
  Car,
  CheckCircle,
  CircleHelp,
  Compass,
  Droplet,
  Dumbbell,
  Filter,
  Flame,
  Footprints,
  GraduationCap,
  Heart,
  Home,
  House,
  Info,
  Leaf,
  MapPin,
  Moon,
  Package,
  PawPrint,
  Recycle,
  RefreshCw,
  RotateCcw,
  Settings,
  Shield,
  Sprout,
  Star,
  Sun,
  Target,
  Train,
  TriangleAlert,
  Trophy,
  User,
  UserRound,
  Users,
  Wind,
  XCircle,
  Zap,
} from 'lucide-react';

/** Props shared across Lucide icon components used in the application. */
export type LucideIconComponent = React.ComponentType<{ className?: string; size?: number }>;

const ICON_COMPONENTS: Record<string, LucideIconComponent> = {
  car: Car,
  bike: Bike,
  walk: Footprints,
  leaf: Leaf,
  home: Home,
  wind: Wind,
  filter: Filter,
  plant: Sprout,
  sun: Sun,
  moon: Moon,
  heart: Heart,
  shield: Shield,
  'alert-triangle': TriangleAlert,
  info: Info,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'rotate-ccw': RotateCcw,
  'refresh-cw': RefreshCw,
  settings: Settings,
  user: User,
  users: Users,
  baby: Baby,
  elderly: UserRound,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  house: House,
  apartment: Building,
  pet: PawPrint,
  star: Star,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  droplet: Droplet,
  flame: Flame,
  compass: Compass,
  'map-pin': MapPin,
  package: Package,
  bus: Bus,
  train: Train,
  recycle: Recycle,
  battery: Battery,
};

/**
 * Resolves an icon identifier returned by the AI engine or domain config
 * to its corresponding Lucide React component, falling back safely to CircleHelp.
 */
export const iconMap: Record<string, LucideIconComponent> = ICON_COMPONENTS;

export function getIcon(name: string): LucideIconComponent {
  return ICON_COMPONENTS[name] || CircleHelp;
}

/** Category-to-icon mapping used across routine, hack, and alternative views. */
export const categoryIcons: Record<string, LucideIconComponent> = {
  commute: Car,
  activity: Footprints,
  lifestyle: Heart,
  indoor: Home,
  plants: Sprout,
  ventilation: Wind,
  purification: Filter,
  habits: Leaf,
  maintenance: Home,
  transport: Car,
  energy: Zap,
  waste: Recycle,
  consumption: Package,
};

/** Human-readable section headings for recommendation categories. */
export const categoryLabels: Record<string, string> = {
  plants: 'Air-Purifying Plants',
  ventilation: 'Ventilation Strategies',
  purification: 'Air Purification',
  habits: 'Daily Habits',
  maintenance: 'Home Maintenance',
  transport: 'Transportation',
  energy: 'Energy',
  waste: 'Waste Reduction',
  consumption: 'Consumption',
  indoor: 'Indoor Environment',
};

export const impactColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

export const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export const costColors: Record<string, string> = {
  free: 'bg-green-100 text-green-800',
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const maintenanceColors: Record<string, string> = {
  none: 'bg-green-100 text-green-800',
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};
