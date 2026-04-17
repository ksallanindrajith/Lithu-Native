
export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  badge?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  icon?: string;
}

export interface BookingState {
  tierId: string;
  addons: string[];
  landingCity: 'Vilnius' | 'Kaunas';
  studyCity: 'Vilnius' | 'Kaunas';
  isStudent: boolean;
}
