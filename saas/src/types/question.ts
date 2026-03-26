export type QuestionType = 'single' | 'multi' | 'yesno' | 'select';

export interface Option {
  id: string;
  label: string;
  value: string;
  scoreImpact?: number;
  flags?: string[];
  tooltip?: string;
}

export interface Condition {
  questionId: string;
  operator: 'equals' | 'includes' | 'notEquals' | 'notIncludes';
  value: string | string[];
}

export interface ScoringRule {
  optionValue: string;
  points: number;
  flags?: string[];
}

export interface Question {
  id: string;
  section: number;
  order: number;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options: Option[];
  conditions?: Condition[];
  scoringRules: ScoringRule[];
  required: boolean;
  helpText?: string;
  alertBanner?: string;
  /** Variants keyed by role for branching questions like Q6 */
  variants?: Record<string, {
    title: string;
    options: Option[];
    scoringRules: ScoringRule[];
  }>;
}
