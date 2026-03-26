// ─── ENUMS (mirroring Prisma) ──────────────────────────────────────────────────

export enum Role {
  FOURNISSEUR = "FOURNISSEUR",
  DEPLOYEUR = "DEPLOYEUR",
  IMPORTATEUR = "IMPORTATEUR",
  DISTRIBUTEUR = "DISTRIBUTEUR",
  INDETERMINE = "INDETERMINE",
}

export enum RiskLevel {
  FAIBLE = "FAIBLE",
  MODERE = "MODERE",
  ELEVE = "ELEVE",
  CRITIQUE = "CRITIQUE",
}

export enum ComplianceLevel {
  CONFORME = "CONFORME",
  CONDITIONNEL = "CONDITIONNEL",
  NON_CONFORME = "NON_CONFORME",
}

export enum SessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
  EXPIRED = "EXPIRED",
}

export enum SessionType {
  PRE_AUDIT = "PRE_AUDIT",
  DIAGNOSTIC = "DIAGNOSTIC",
}

// ─── SCORING ──────────────────────────────────────────────────────────────────

export interface ScoringDimension {
  code: string;
  label: string;
  reference: string;
  weight: number;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;
}

export interface KillSwitchViolation {
  articleRef: string;
  questionCode: string;
  description: string;
  penalty: string;
}

export interface Alert {
  id: string;
  severity: "CRITIQUE" | "ATTENTION" | "POINT_VIGILANCE" | "URGENCE" | "LACUNE";
  title: string;
  message: string;
  reference: string;
  condition: string;
}

export interface PreAuditScoreResult {
  scoreBrut: number;
  scoreAjuste: number;
  scoreFinal: number;
  maxPossible: 10;
  riskLevel: RiskLevel;
  multiplicateurRole: number;
  multiplicateurSecteur: number;
  multiplicateurTaille: number;
  hasKillSwitch: boolean;
  killSwitchDetails: KillSwitchViolation[];
  alerts: Alert[];
  detectedRoles: Role[];
}

export interface DiagnosticScoreResult {
  scoreBrut: number;
  scoreAjuste: number;
  scoreFinal: number;
  maxPossible: 100;
  riskLevel: RiskLevel;
  complianceLevel: ComplianceLevel;
  multiplicateurRole: number;
  multiplicateurSecteur: number;
  multiplicateurTaille: number;
  hasKillSwitch: boolean;
  killSwitchDetails: KillSwitchViolation[];
  dimensions: ScoringDimension[];
  alerts: Alert[];
  detectedRoles: Role[];
}

// ─── ANSWERS ──────────────────────────────────────────────────────────────────

export interface AnswerValue {
  selected: string | string[];
  text?: string;
}

export interface AnswerInput {
  questionId: string;
  questionCode: string;
  section: number;
  value: AnswerValue;
}

export interface AnswerWithScore {
  questionId: string;
  questionCode: string;
  section: number;
  value: AnswerValue;
  rawPoints: number;
  dimension: string | null;
  isCritical: boolean;
  alertMessage: string | null;
}

// ─── SESSION ──────────────────────────────────────────────────────────────────

export interface SessionCreateRequest {
  type?: SessionType;
  metadata?: Record<string, unknown>;
}

export interface SessionResponse {
  id: string;
  type: SessionType;
  status: SessionStatus;
  currentStep: number;
  totalSteps: number;
  detectedRoles: Role[];
  sector: string | null;
  companySize: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface SessionCompleteRequest {
  sessionId: string;
}

export interface SessionScoreResponse {
  session: SessionResponse;
  score: PreAuditScoreResult | DiagnosticScoreResult;
  recommendation: OfferRecommendation | null;
}

// ─── LEADS ────────────────────────────────────────────────────────────────────

export interface LeadCaptureRequest {
  email: string;
  firstName: string;
  phone?: string;
  company?: string;
  sessionId: string;
  gdprConsent: boolean;
  marketingConsent?: boolean;
}

export interface LeadResponse {
  id: string;
  email: string;
  firstName: string;
  company: string | null;
  leadStatus: string;
  createdAt: string;
}

// ─── OFFERS ───────────────────────────────────────────────────────────────────

export interface OfferRecommendation {
  primaryOffer: OfferDetail;
  secondaryOffer: OfferDetail | null;
  argumentaire: string;
  sectorArgument: string | null;
  urgencyMessage: string | null;
  comparateur: PriceComparator;
  deductibilite: string;
}

export interface OfferDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceDisplay: string;
  priceAmount: number;
  priceType: string;
  features: string[];
  isFeatured: boolean;
}

export interface PriceComparator {
  avocats: string;
  bigFour: string;
  complia: string;
}

// ─── GDPR ─────────────────────────────────────────────────────────────────────

export interface GdprDeleteRequest {
  email: string;
  confirmDeletion: boolean;
}

export interface GdprDeleteResponse {
  success: boolean;
  deletedEntities: {
    user: boolean;
    sessions: number;
    answers: number;
    scores: number;
    recommendations: number;
    appointments: number;
  };
  deletedAt: string;
}

// ─── API RESPONSES ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// ─── EMAIL ────────────────────────────────────────────────────────────────────

export interface EmailConfirmationData {
  email: string;
  name: string;
}

export interface EmailRapportData {
  email: string;
  name: string;
  scoreFinal: number;
  maxScore: number;
  riskLevel: RiskLevel;
  alerts: Alert[];
  recommendedOffer: OfferDetail;
  ctaUrl: string;
}

export interface NurturingSchedule {
  email: string;
  name: string;
  role: Role;
  scoreFinal: number;
  riskLevel: RiskLevel;
  recommendedOffer: OfferDetail;
}

// ─── SECTOR / SIZE CONSTANTS ──────────────────────────────────────────────────

export const SENSITIVE_SECTORS = [
  "finance",
  "sante",
  "rh",
  "education",
  "administration",
] as const;

export const INDUSTRIAL_SECTORS = [
  "industrie",
  "transport",
  "energie",
] as const;

export type SensitiveSector = (typeof SENSITIVE_SECTORS)[number];
export type IndustrialSector = (typeof INDUSTRIAL_SECTORS)[number];

export const COMPANY_SIZES = {
  TPE: "tpe",
  PME: "pme",
  ETI: "eti",
  GE: "ge",
} as const;

export type CompanySize = (typeof COMPANY_SIZES)[keyof typeof COMPANY_SIZES];
