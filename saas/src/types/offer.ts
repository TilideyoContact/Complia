import { type Role, type RiskLevel } from './session';

export interface Offer {
  id: string;
  name: string;
  slug: string;
  price: string;
  priceValue: number | null;
  isRecurrent: boolean;
  description: string;
  features: string[];
  targetRoles: Role[];
  ctaLabel: string;
  ctaLink: string;
}

export interface OfferRecommendation {
  primary: Offer;
  secondary: Offer;
  argumentaire: string;
  sectorNote?: string;
}

export interface RecommendationRule {
  role: Role;
  scoreMin: number;
  scoreMax: number;
  sector?: string;
  primaryOfferId: string;
  secondaryOfferId: string;
  argumentaire: string;
}
