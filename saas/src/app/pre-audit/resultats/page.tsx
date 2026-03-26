'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuestionnaireStore } from '@/store/questionnaire-store';
import { useScoring } from '@/hooks/useScoring';
import { selectAlerts } from '@/data/alerts';
import { getRecommendation } from '@/data/offers';
import { ScoreGauge } from '@/components/results/ScoreGauge';
import { EmailGate } from '@/components/results/EmailGate';
import { AlertsList } from '@/components/results/AlertsList';
import { OfferCard } from '@/components/results/OfferCard';

const ROLE_LABELS: Record<string, string> = {
  FOURNISSEUR: 'Fournisseur',
  DEPLOYEUR: 'Deployeur',
  IMPORTATEUR: 'Importateur',
  DISTRIBUTEUR: 'Distributeur',
  INDETERMINE: 'A determiner',
};

const ROLE_REFS: Record<string, string> = {
  FOURNISSEUR: 'Art. 3(3)',
  DEPLOYEUR: 'Art. 3(4)',
  IMPORTATEUR: 'Art. 3(6)',
  DISTRIBUTEUR: 'Art. 3(7)',
  INDETERMINE: 'Art. 3',
};

export default function ResultatsPage() {
  const router = useRouter();
  const { answers, detectedRole, emailGateCompleted, score: storedScore } = useQuestionnaireStore();
  const [showDetails, setShowDetails] = useState(emailGateCompleted);

  const score = useScoring(answers, detectedRole);
  const finalScore = storedScore || score;

  // Check if questionnaire was completed
  const hasAnswers = Object.keys(answers).length >= 10;

  const triggeredAlerts = useMemo(() => {
    const answerValues: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(answers)) {
      answerValues[key] = value;
    }
    return selectAlerts(answerValues, finalScore.flags, finalScore.final);
  }, [answers, finalScore]);

  const recommendation = useMemo(() => {
    return getRecommendation(detectedRole || 'INDETERMINE', finalScore.final);
  }, [detectedRole, finalScore.final]);

  if (!hasAnswers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Aucun diagnostic en cours
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Completez d&apos;abord le questionnaire pour obtenir vos resultats.
          </p>
          <button
            onClick={() => router.push('/pre-audit')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Commencer le diagnostic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Score - always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Votre score de risque AI Act
          </h1>
          <ScoreGauge
            score={finalScore.final}
            maxScore={10}
            color={finalScore.color}
            label={finalScore.riskLevel}
          />
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {finalScore.description}
          </p>
        </motion.div>

        {/* Email gate or details */}
        {!showDetails ? (
          <EmailGate onComplete={() => setShowDetails(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Role detected */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Role detecte
              </h3>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-lg text-sm">
                  {ROLE_LABELS[detectedRole || 'INDETERMINE']}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {ROLE_REFS[detectedRole || 'INDETERMINE']}
                </span>
              </div>
            </div>

            {/* Alerts */}
            {triggeredAlerts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <AlertsList alerts={triggeredAlerts} />
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Timeline reglementaire
              </h3>
              <div className="space-y-4">
                {[
                  { date: 'Fev. 2025', label: 'Pratiques interdites (Art. 5) + Formation IA (Art. 4)', status: 'active', color: 'red' },
                  { date: 'Aout 2025', label: 'Obligations de transparence (Art. 50)', status: 'upcoming', color: 'orange' },
                  { date: 'Aout 2026', label: 'Systemes haut risque (Annexe III)', status: 'future', color: 'yellow' },
                  { date: 'Aout 2027', label: 'Application integrale du reglement', status: 'future', color: 'gray' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      item.color === 'red' ? 'bg-red-500' :
                      item.color === 'orange' ? 'bg-orange-500' :
                      item.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.date}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer recommendation */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Notre recommandation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OfferCard
                  offer={recommendation.primary}
                  argumentaire={recommendation.argumentaire}
                  isRecommended
                />
                <OfferCard
                  offer={recommendation.secondary}
                  argumentaire="Alternative pour decouvrir nos services."
                />
              </div>
            </div>

            {/* Price comparator */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                Comparaison des couts de mise en conformite
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Avocats specialises', price: '5 000 - 15 000 EUR', opacity: 'opacity-60' },
                  { label: 'Cabinets Big Four', price: '20 000 - 50 000 EUR', opacity: 'opacity-60' },
                  { label: 'Complia', price: 'A partir de 990 EUR', opacity: '' },
                ].map((item) => (
                  <div key={item.label} className={`flex justify-between items-center py-2 ${item.opacity}`}>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className={`text-sm font-bold ${item.opacity ? 'text-gray-500' : 'text-blue-600 dark:text-blue-400'}`}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center px-4 py-6 leading-relaxed">
              Ce pre-diagnostic est indicatif et ne constitue pas un avis juridique.
              Il vise a identifier les principaux axes de risque. Seul un diagnostic
              complet permettra d&apos;etablir votre situation de conformite exacte.
              Base reglementaire : Reglement (UE) 2024/1689.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
