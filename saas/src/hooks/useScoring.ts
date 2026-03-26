'use client';

import { useMemo } from 'react';
import { type Role } from '@/types/session';
import { type Score, THRESHOLDS } from '@/types/score';
import { preAuditQuestions } from '@/data/pre-audit-questions';

const ROLE_MULTIPLIERS: Record<string, number> = {
  FOURNISSEUR: 1.20,
  IMPORTATEUR: 1.10,
  DEPLOYEUR: 1.05,
  DISTRIBUTEUR: 1.00,
  INDETERMINE: 1.15,
};

const SENSITIVE_SECTORS = ['finance', 'sante', 'rh', 'education', 'administration'];
const MEDIUM_SECTORS = ['industrie', 'transport', 'energie'];

function getSectorMultiplier(sector: string): number {
  if (SENSITIVE_SECTORS.includes(sector)) return 1.20;
  if (MEDIUM_SECTORS.includes(sector)) return 1.10;
  return 1.00;
}

function getSizeMultiplier(size: string): number {
  if (size === 'ge') return 1.10;
  if (size === 'eti') return 1.05;
  return 1.00;
}

export function calculateScore(
  answers: Record<string, string | string[]>,
  role: Role | null
): Score {
  let rawScore = 0;
  const flags: string[] = [];

  for (const question of preAuditQuestions) {
    const answer = answers[question.id];
    if (!answer) continue;

    // For branching questions with variants
    if (question.variants && role) {
      const variant = question.variants[role];
      if (variant) {
        const answerValue = typeof answer === 'string' ? answer : answer[0];
        const rule = variant.scoringRules.find(r => r.optionValue === answerValue);
        if (rule) {
          rawScore += rule.points;
          if (rule.flags) flags.push(...rule.flags);
        }
        continue;
      }
    }

    // For multi-choice questions
    if (Array.isArray(answer)) {
      for (const val of answer) {
        const rule = question.scoringRules.find(r => r.optionValue === val);
        if (rule) {
          rawScore += rule.points;
          if (rule.flags) flags.push(...rule.flags);
        }
      }
      continue;
    }

    // For single-choice questions
    const rule = question.scoringRules.find(r => r.optionValue === answer);
    if (rule) {
      rawScore += rule.points;
      if (rule.flags) flags.push(...rule.flags);
    }
  }

  const detectedRole = role || 'INDETERMINE';
  const sector = (answers['Q2'] as string) || 'autre';
  const size = (answers['Q3'] as string) || 'pme';

  const roleMultiplier = ROLE_MULTIPLIERS[detectedRole] || 1.0;
  const sectorMultiplier = getSectorMultiplier(sector);
  const sizeMultiplier = getSizeMultiplier(size);

  const adjustedScore = rawScore * roleMultiplier * sectorMultiplier * sizeMultiplier;
  const finalScore = Math.min(10, Math.round(adjustedScore * 10) / 10);
  const clampedScore = Math.max(0, finalScore);

  const threshold = THRESHOLDS.find(t => clampedScore >= t.min && clampedScore <= t.max)
    || THRESHOLDS[THRESHOLDS.length - 1];

  return {
    raw: rawScore,
    adjusted: adjustedScore,
    final: clampedScore,
    riskLevel: threshold.level,
    color: threshold.color,
    description: threshold.description,
    multiplicateurs: {
      role: roleMultiplier,
      secteur: sectorMultiplier,
      taille: sizeMultiplier,
    },
    flags,
    dimensions: [],
  };
}

export function useScoring(
  answers: Record<string, string | string[]>,
  role: Role | null
): Score {
  return useMemo(() => calculateScore(answers, role), [answers, role]);
}
