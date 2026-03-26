import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold text-white">Complia</span>
            </div>
            <p className="text-sm leading-relaxed">
              Conformite EU AI Act simplifiee. Diagnostic, accompagnement et veille reglementaire pour les entreprises utilisant l&apos;intelligence artificielle.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Liens</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pre-audit" className="text-sm hover:text-white transition-colors">
                  Pre-audit gratuit
                </Link>
              </li>
              <li>
                <Link href="/offres" className="text-sm hover:text-white transition-colors">
                  Nos offres
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-sm hover:text-white transition-colors">
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-sm hover:text-white transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <p className="text-sm">contact@complia.eu</p>
            <p className="text-sm mt-2">Paris, France</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Ce pre-diagnostic est indicatif et ne constitue pas un avis juridique.
            Il vise a identifier les principaux axes de risque. Seul un diagnostic complet
            permettra d&apos;etablir votre situation de conformite exacte.
          </p>
          <p className="text-xs text-gray-600 text-center mt-2">
            &copy; {new Date().getFullYear()} Complia. Tous droits reserves. Reglement (UE) 2024/1689.
          </p>
        </div>
      </div>
    </footer>
  );
}
