import { type RiskLevel } from './session';

export type ComplianceLevel = 'CONFORME' | 'PARTIEL' | 'MANQUANT';

export interface DimensionScore {
  dimension: string;
  points: number;
  maxPoints: number;
  label: string;
}

export interface Threshold {
  min: number;
  max: number;
  level: RiskLevel;
  color: string;
  label: string;
  description: string;
}

export interface Score {
  raw: number;
  adjusted: number;
  final: number;
  riskLevel: RiskLevel;
  color: string;
  description: string;
  multiplicateurs: {
    role: number;
    secteur: number;
    taille: number;
  };
  flags: string[];
  dimensions: DimensionScore[];
}

export const THRESHOLDS: Threshold[] = [
  {
    min: 0,
    max: 3,
    level: 'FAIBLE',
    color: '#16a34a',
    label: 'Faible',
    description: 'Exposition limitee. Quelques points de vigilance. Une veille reglementaire est recommandee.',
  },
  {
    min: 4,
    max: 5,
    level: 'MODERE',
    color: '#f59e0b',
    label: 'Modere',
    description: 'Lacunes identifiees. Un diagnostic flash vous permettrait de les cartographier precisement.',
  },
  {
    min: 6,
    max: 7,
    level: 'ELEVE',
    color: '#f97316',
    label: 'Eleve',
    description: 'Manquements significatifs detectes. Un diagnostic approfondi est fortement recommande avant les echeances.',
  },
  {
    min: 8,
    max: 10,
    level: 'CRITIQUE',
    color: '#dc2626',
    label: 'Critique',
    description: 'Exposition tres elevee. Des actions correctives immediates sont necessaires pour eviter les sanctions.',
  },
];
