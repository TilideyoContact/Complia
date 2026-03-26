import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full uppercase tracking-wider mb-6">
            Reglement (UE) 2024/1689
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Evaluez votre conformite a l&apos;
            <span className="text-blue-600 dark:text-blue-400">EU AI Act</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Votre entreprise utilise l&apos;intelligence artificielle ? Decouvrez en 5 minutes
            votre niveau d&apos;exposition et les actions a engager avant les echeances reglementaires.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pre-audit"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30"
            >
              Commencer le diagnostic
            </Link>
            <Link
              href="/offres"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-2xl hover:border-gray-400 dark:hover:border-gray-500 transition-all"
            >
              Voir nos offres
            </Link>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Temps restant avant les echeances
          </h2>
          <CountdownTimer />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-400">
                35M EUR
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Amende maximale pour les pratiques interdites
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-600 dark:text-orange-400">
                7%
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                du chiffre d&apos;affaires mondial annuel
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                ~5 min
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                pour evaluer votre exposition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Comment ca marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Repondez a 15 questions',
                desc: 'Un questionnaire rapide pour identifier votre role, vos systemes IA et votre niveau de preparation.',
              },
              {
                step: '2',
                title: 'Obtenez votre score',
                desc: 'Un score de risque sur 10 avec des alertes personnalisees selon votre profil et votre secteur.',
              },
              {
                step: '3',
                title: 'Agissez avant les echeances',
                desc: 'Des recommandations concretes et une offre d\'accompagnement adaptee a votre situation.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '🔒', label: 'Donnees securisees' },
              { icon: '⚖️', label: 'Base juridique solide' },
              { icon: '⚡', label: 'Resultat instantane' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Ils nous font confiance
          </p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
            127 entreprises diagnostiquees
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
            PME, ETI et grands groupes de tous secteurs
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 dark:bg-blue-700 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pret a evaluer votre conformite ?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            5 minutes suffisent pour connaitre votre exposition a l&apos;EU AI Act.
          </p>
          <Link
            href="/pre-audit"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
          >
            Commencer le diagnostic gratuit
          </Link>
        </div>
      </section>
    </div>
  );
}
