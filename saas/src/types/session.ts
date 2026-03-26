export type Role = 'FOURNISSEUR' | 'DEPLOYEUR' | 'IMPORTATEUR' | 'DISTRIBUTEUR' | 'INDETERMINE';

export type RiskLevel = 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE';

export interface Answer {
  questionId: string;
  value: string | string[];
  timestamp: number;
}

export interface Session {
  id: string;
  answers: Record<string, Answer>;
  detectedRole: Role | null;
  currentQuestionIndex: number;
  startedAt: number;
  completedAt: number | null;
  emailGateCompleted: boolean;
  leadInfo: LeadInfo | null;
}

export interface LeadInfo {
  firstName: string;
  email: string;
  phone?: string;
  consentMarketing: boolean;
}
