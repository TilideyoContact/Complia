'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestionnaireStore } from '@/store/questionnaire-store';
import { useQuestionnaireNavigation } from '@/hooks/useQuestionnaireNavigation';
import { useScoring } from '@/hooks/useScoring';
import { SingleChoice } from './SingleChoice';
import { MultiChoice } from './MultiChoice';
import { ProgressBar } from './ProgressBar';
import { RiskBadge } from './RiskBadge';

export function QuestionnaireEngine() {
  const router = useRouter();
  const {
    answers,
    currentQuestionIndex,
    detectedRole,
    setAnswer,
    setCurrentQuestionIndex,
    completeQuestionnaire,
  } = useQuestionnaireStore();

  const {
    currentQuestion,
    totalQuestions,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    goNext,
    goPrev,
    progress,
    remainingQuestions,
  } = useQuestionnaireNavigation(
    currentQuestionIndex,
    answers,
    detectedRole,
    setCurrentQuestionIndex
  );

  const score = useScoring(answers, detectedRole);

  const handleAnswer = useCallback(
    (value: string | string[]) => {
      if (!currentQuestion) return;
      setAnswer(currentQuestion.id, value);
    },
    [currentQuestion, setAnswer]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      completeQuestionnaire();
      router.push('/pre-audit/resultats');
    } else {
      goNext();
    }
  }, [isLastQuestion, completeQuestionnaire, router, goNext]);

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Determine which section we are in for labeling
  const sectionLabels: Record<number, string> = {
    1: 'Qualification',
    2: 'Detection de non-conformites',
    3: 'Calibrage du risque',
  };

  const currentSection = currentQuestion?.section || 1;
  const sectionLabel = sectionLabels[currentSection] || '';

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Risk Badge */}
      <RiskBadge score={Object.keys(answers).length > 2 ? score : null} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <ProgressBar
          progress={progress}
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          remaining={remainingQuestions}
        />

        {/* Section label */}
        <div className="mt-6 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {sectionLabel}
          </span>
        </div>

        {/* Alert banner */}
        {currentQuestion.alertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                {currentQuestion.alertBanner}
              </p>
            </div>
          </motion.div>
        )}

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
              {currentQuestion.title}
            </h2>

            {currentQuestion.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentQuestion.subtitle}
              </p>
            )}

            {/* Answer input based on type */}
            {(currentQuestion.type === 'single' || currentQuestion.type === 'select') && (
              <SingleChoice
                options={currentQuestion.options}
                value={typeof currentAnswer === 'string' ? currentAnswer : null}
                onChange={(val) => handleAnswer(val)}
              />
            )}

            {currentQuestion.type === 'multi' && (
              <MultiChoice
                options={currentQuestion.options}
                value={Array.isArray(currentAnswer) ? currentAnswer : []}
                onChange={(val) => handleAnswer(val)}
              />
            )}

            {currentQuestion.type === 'yesno' && (
              <SingleChoice
                options={currentQuestion.options}
                value={typeof currentAnswer === 'string' ? currentAnswer : null}
                onChange={(val) => handleAnswer(val)}
              />
            )}

            {/* Help text */}
            {currentQuestion.helpText && (
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 italic">
                {currentQuestion.helpText}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className={`
              px-6 py-3 rounded-xl text-sm font-medium transition-all
              ${canGoPrev
                ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }
            `}
          >
            Retour
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`
              px-8 py-3 rounded-xl text-sm font-semibold transition-all
              ${canGoNext
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/25'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isLastQuestion ? 'Obtenir mon diagnostic' : 'Continuer'}
          </button>
        </div>
      </div>
    </div>
  );
}
