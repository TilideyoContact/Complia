'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { offers } from '@/data/offers';
import { type Role } from '@/types/session';
import Link from 'next/link';

const ROLE_FILTERS: { label: string; value: Role | 'ALL' }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Deployeur', value: 'DEPLOYEUR' },
  { label: 'Fournisseur', value: 'FOURNISSEUR' },
  { label: 'Importateur', value: 'IMPORTATEUR' },
  { label: 'Distributeur', value: 'DISTRIBUTEUR' },
];

export default function OffresPage() {
  const [activeFilter, setActiveFilter] = useState<Role | 'ALL'>('ALL');

  const filteredOffers = activeFilter === 'ALL'
    ? offers
    : offers.filter(o => o.targetRoles.includes(activeFilter));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Nos offres de conformite
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Du diagnostic rapide a l&apos;accompagnement complet, choisissez l&apos;offre adaptee a votre role et a votre niveau de risque.
          </p>
        </div>

        {/* Role filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {ROLE_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`
                px-5 py-2 rounded-xl text-sm font-medium transition-all
                ${activeFilter === value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col"
            >
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  {offer.targetRoles.map(role => (
                    <span
                      key={role}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {offer.name}
                </h3>

                <div className="mt-2">
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {offer.price}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {offer.description}
                </p>

                <ul className="mt-4 space-y-2">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={offer.ctaLink}
                  className="block w-full text-center py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
                >
                  {offer.ctaLabel}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price comparator */}
        <div className="mt-16 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-6">
            Comparez les couts
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Avocats specialises', price: '5 000 - 15 000 EUR', muted: true },
              { label: 'Cabinets Big Four', price: '20 000 - 50 000 EUR', muted: true },
              { label: 'Complia', price: 'A partir de 990 EUR', muted: false },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className={`text-sm ${item.muted ? 'text-gray-400' : 'font-bold text-gray-900 dark:text-white'}`}>
                  {item.label}
                </span>
                <span className={`text-sm font-bold ${item.muted ? 'text-gray-400 line-through' : 'text-blue-600 dark:text-blue-400'}`}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
            Le cout du diagnostic est deductible de tout pack conformite signe sous 30 jours.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/pre-audit"
            className="inline-block px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25"
          >
            Faire le diagnostic gratuit d&apos;abord
          </Link>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Recevez une recommandation personnalisee en 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
