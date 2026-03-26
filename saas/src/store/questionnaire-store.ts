import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Role } from '@/types/session';
import { type Score } from '@/types/score';
import { calculateScore } from '@/hooks/useScoring';

interface LeadInfo {
  firstName: string;
  email: string;
  phone?: string;
  consentMarketing: boolean;
}

interface QuestionnaireState {
  // Answers
  answers: Record<string, string | string[]>;
  // Navigation
  currentQuestionIndex: number;
  // Role
  detectedRole: Role | null;
  // Score
  score: Score | null;
  // Session
  startedAt: number | null;
  completedAt: number | null;
  // Email gate
  emailGateCompleted: boolean;
  leadInfo: LeadInfo | null;

  // Actions
  setAnswer: (questionId: string, value: string | string[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  detectRole: () => void;
  computeScore: () => void;
  completeEmailGate: (info: LeadInfo) => void;
  completeQuestionnaire: () => void;
  reset: () => void;
}

const ROLE_MAP: Record<string, Role> = {
  FOURNISSEUR: 'FOURNISSEUR',
  DEPLOYEUR: 'DEPLOYEUR',
  IMPORTATEUR: 'IMPORTATEUR',
  DISTRIBUTEUR: 'DISTRIBUTEUR',
  INDETERMINE: 'INDETERMINE',
};

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set, get) => ({
      answers: {},
      currentQuestionIndex: 0,
      detectedRole: null,
      score: null,
      startedAt: null,
      completedAt: null,
      emailGateCompleted: false,
      leadInfo: null,

      setAnswer: (questionId: string, value: string | string[]) => {
        set((state) => {
          const newAnswers = { ...state.answers, [questionId]: value };
          const startedAt = state.startedAt || Date.now();
          return { answers: newAnswers, startedAt };
        });

        // Auto-detect role when Q1 is answered
        if (questionId === 'Q1') {
          const { answers } = get();
          const q1Value = answers['Q1'];
          if (typeof q1Value === 'string' && ROLE_MAP[q1Value]) {
            set({ detectedRole: ROLE_MAP[q1Value] });
          }
        }
      },

      setCurrentQuestionIndex: (index: number) => {
        set({ currentQuestionIndex: index });
      },

      detectRole: () => {
        const { answers } = get();
        const q1 = answers['Q1'];
        if (typeof q1 === 'string' && ROLE_MAP[q1]) {
          set({ detectedRole: ROLE_MAP[q1] });
        }
      },

      computeScore: () => {
        const { answers, detectedRole } = get();
        const score = calculateScore(answers, detectedRole);
        set({ score });
      },

      completeEmailGate: (info: LeadInfo) => {
        set({ emailGateCompleted: true, leadInfo: info });
      },

      completeQuestionnaire: () => {
        const state = get();
        const score = calculateScore(state.answers, state.detectedRole);
        set({ completedAt: Date.now(), score });
      },

      reset: () => {
        set({
          answers: {},
          currentQuestionIndex: 0,
          detectedRole: null,
          score: null,
          startedAt: null,
          completedAt: null,
          emailGateCompleted: false,
          leadInfo: null,
        });
      },
    }),
    {
      name: 'complia-questionnaire',
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        detectedRole: state.detectedRole,
        score: state.score,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        emailGateCompleted: state.emailGateCompleted,
        leadInfo: state.leadInfo,
      }),
    }
  )
);
