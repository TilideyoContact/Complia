'use client';

import { useCallback, useMemo } from 'react';
import { preAuditQuestions } from '@/data/pre-audit-questions';
import { type Role } from '@/types/session';
import { type Question } from '@/types/question';

export function useQuestionnaireNavigation(
  currentIndex: number,
  answers: Record<string, string | string[]>,
  role: Role | null,
  setCurrentIndex: (index: number) => void
) {
  // Get the resolved question (with variant applied if needed)
  const getResolvedQuestion = useCallback(
    (question: Question): Question => {
      if (question.variants && role) {
        const variant = question.variants[role];
        if (variant) {
          return {
            ...question,
            title: variant.title,
            options: variant.options,
            scoringRules: variant.scoringRules,
          };
        }
      }
      return question;
    },
    [role]
  );

  const questions = useMemo(() => {
    return preAuditQuestions.map(q => getResolvedQuestion(q));
  }, [getResolvedQuestion]);

  const totalQuestions = questions.length;

  const currentQuestion = questions[currentIndex] || null;

  const canGoNext = useMemo(() => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    return true;
  }, [currentQuestion, answers]);

  const canGoPrev = currentIndex > 0;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    if (isLastQuestion) return;
    setCurrentIndex(currentIndex + 1);
  }, [canGoNext, isLastQuestion, currentIndex, setCurrentIndex]);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setCurrentIndex(currentIndex - 1);
  }, [canGoPrev, currentIndex, setCurrentIndex]);

  const progress = totalQuestions > 0
    ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
    : 0;

  const remainingQuestions = totalQuestions - currentIndex - 1;

  return {
    questions,
    currentQuestion,
    totalQuestions,
    currentIndex,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    goNext,
    goPrev,
    progress,
    remainingQuestions,
  };
}
