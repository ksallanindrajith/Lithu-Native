
import React from 'react';
import { ServiceTier, Addon } from './types';
import { Shield, Zap, Home, Landmark, ShoppingBag, Map } from 'lucide-react';

export const TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Arrival',
    price: 49,
    description: 'Perfect for tourists and business travelers. A Bolt driver will be waiting for you.',
    features: [
      'Bolt Driver Waiting at Arrivals',
      'English-Speaking Support',
      'Pre-activated SIM Card (Ežys/Pildyk)',
      'LTG & Transport Discounts',
      '1.5L Bottled Water',
      'Priority Support Chat'
    ]
  },
  {
    id: 'mcwelcome',
    name: 'Welcome Plus',
    price: 89,
    description: 'Full guidance for those staying longer. Arrive well-fed and ready to explore.',
    badge: 'Popular',
    features: [
      'All Essential Features',
      'McDonald\'s McMenu (Big Mac/Chicken)',
      'Digital Bank & Card Guides',
      '20-minute Maxima Grocery Stop',
      '€10 Wolt/Bolt Food Voucher',
      'Exclusive Food Discounts'
    ]
  },
  {
    id: 'softlanding',
    name: 'Native Integration',
    price: 139,
    description: 'Land Smart. Live Local. from day one. Full support until you leave.',
    features: [
      'All Welcome Plus Features',
      'Bank Setup (Physical Support)',
      'Nationwide Area Coverage',
      'Hotel & Restaurant Discounts',
      'Accommodation Sourcing Assistance',
      '30-Day Transit Pass included',
      'TRP/Migration Document Guide'
    ]
  }
];

export const ADDONS: Addon[] = [
  {
    id: 'kaunas-bridge',
    name: 'The Kaunas Bridge',
    price: 70,
    description: 'Intercity transfer (VNO to Kaunas) covering fuel & highway logistics.',
    icon: 'Map'
  },
  {
    id: 'financial-navigator',
    name: 'Financial Navigator',
    price: 35,
    description: 'Step-by-step help with Revolut, Banks, and Euro cash transfers.',
    icon: 'Landmark'
  },
  {
    id: 'isic-support',
    name: 'ISIC & Library Support',
    price: 25,
    description: 'Personalized guidance for your student ID and university library.',
    icon: 'Shield'
  },
  {
    id: 'ikea-run',
    name: 'IKEA/Furniture Run',
    price: 40,
    description: 'Dedicated trip for bedding, kitchenware, and room essentials.',
    icon: 'ShoppingBag'
  },
  {
    id: 'short-stay',
    name: 'One Night Stay',
    price: 30,
    description: 'Emergency one-night booking at a partner hostel or co-living space.',
    icon: 'Home'
  },
  {
    id: 'medium-stay',
    name: 'One Month Co-living',
    price: 450,
    description: 'Guaranteed one-month stay at Atlas or Shed Co-living (Subject to availability).',
    icon: 'Home'
  },
  {
    id: 'long-term',
    name: 'Long-term Housing',
    price: 150,
    description: 'Full assistance in finding and signing a long-term rental contract.',
    icon: 'Home'
  }
];
