import {
  Role,
  RiskLevel,
  type OfferRecommendation,
  type OfferDetail,
  type PriceComparator,
  SENSITIVE_SECTORS,
} from "../types";

// ─── OFFER CATALOG ────────────────────────────────────────────────────────────

const OFFERS: Record<string, OfferDetail> = {
  veille: {
    id: "offer-veille",
    slug: "veille",
    name: "Veille reglementaire",
    description:
      "Restez informe des evolutions de l'AI Act et des obligations applicables a votre organisation.",
    priceDisplay: "190 EUR/mois",
    priceAmount: 19000,
    priceType: "MONTHLY",
    features: [
      "Alertes reglementaires personnalisees",
      "Newsletter mensuelle AI Act",
      "Acces base documentaire",
      "Webinaires trimestriels",
    ],
    isFeatured: false,
  },
  "diagnostic-flash": {
    id: "offer-diagnostic-flash",
    slug: "diagnostic-flash",
    name: "Diagnostic Flash",
    description:
      "Diagnostic de 2h pour cartographier vos obligations et obtenir une feuille de route claire.",
    priceDisplay: "990 EUR HT",
    priceAmount: 99000,
    priceType: "ONE_TIME",
    features: [
      "Audit express 2 heures",
      "Cartographie des obligations",
      "Feuille de route priorisee",
      "Rapport synthetique PDF",
      "Call restitution 30 min",
    ],
    isFeatured: false,
  },
  "diagnostic-flash-medtech": {
    id: "offer-diagnostic-flash-medtech",
    slug: "diagnostic-flash-medtech",
    name: "Diagnostic Flash + MedTech",
    description:
      "Diagnostic flash avec prise en compte des exigences croisees AI Act et MDR (2017/745).",
    priceDisplay: "1 390 EUR HT",
    priceAmount: 139000,
    priceType: "ONE_TIME",
    features: [
      "Audit express 3 heures",
      "Conformite croisee AI Act + MDR",
      "Feuille de route priorisee",
      "Rapport synthetique PDF",
      "Call restitution 30 min",
    ],
    isFeatured: false,
  },
  "diagnostic-flash-fintech": {
    id: "offer-diagnostic-flash-fintech",
    slug: "diagnostic-flash-fintech",
    name: "Diagnostic Flash + FinTech",
    description:
      "Diagnostic flash avec prise en compte des exigences croisees AI Act et DORA (2022/2554).",
    priceDisplay: "1 290 EUR HT",
    priceAmount: 129000,
    priceType: "ONE_TIME",
    features: [
      "Audit express 3 heures",
      "Conformite croisee AI Act + DORA",
      "Feuille de route priorisee",
      "Rapport synthetique PDF",
      "Call restitution 30 min",
    ],
    isFeatured: false,
  },
  "diagnostic-strategique": {
    id: "offer-diagnostic-strategique",
    slug: "diagnostic-strategique",
    name: "Diagnostic Strategique",
    description:
      "Diagnostic approfondi avec plan d'action detaille et accompagnement prioritaire.",
    priceDisplay: "2 490 EUR HT",
    priceAmount: 249000,
    priceType: "ONE_TIME",
    features: [
      "Audit complet 1 journee",
      "Inventaire detaille systemes IA",
      "Classification risque par systeme",
      "Plan de remediation priorise",
      "Rapport 30+ pages",
      "2 calls de suivi",
    ],
    isFeatured: false,
  },
  "diagnostic-premium": {
    id: "offer-diagnostic-premium",
    slug: "diagnostic-premium",
    name: "Diagnostic Premium",
    description:
      "Diagnostic exhaustif multi-roles avec accompagnement personnalise sur 2 semaines.",
    priceDisplay: "6 490 EUR HT",
    priceAmount: 649000,
    priceType: "ONE_TIME",
    features: [
      "Audit exhaustif 3 jours",
      "Entretiens equipes cles",
      "Cartographie complete chaine valeur IA",
      "Evaluation par dimension de conformite",
      "Rapport 60+ pages",
      "Plan de conformite 12 mois",
      "4 calls de suivi",
    ],
    isFeatured: false,
  },
  "conformite-deployeur": {
    id: "offer-conformite-deployeur",
    slug: "conformite-deployeur",
    name: "Pack Conformite Deployeur",
    description:
      "Accompagnement complet pour la mise en conformite des deployeurs de systemes IA.",
    priceDisplay: "3 990 EUR HT",
    priceAmount: 399000,
    priceType: "ONE_TIME",
    features: [
      "Diagnostic deployeur complet",
      "FRIA (Evaluation droits fondamentaux)",
      "Mise en place surveillance humaine",
      "Registre des activites",
      "Formation equipes Art. 4",
      "Templates documentaires",
    ],
    isFeatured: false,
  },
  "conformite-deployeur-plus": {
    id: "offer-conformite-deployeur-plus",
    slug: "conformite-deployeur-plus",
    name: "Pack Conformite Deployeur+",
    description:
      "Accompagnement avance pour les deployeurs a forte exposition reglementaire.",
    priceDisplay: "6 990 EUR HT",
    priceAmount: 699000,
    priceType: "ONE_TIME",
    features: [
      "Tout le Pack Conformite Deployeur",
      "Audit multi-systemes",
      "Conformite croisee sectorielle",
      "Accompagnement 3 mois",
      "Revue juridique approfondie",
      "Support prioritaire",
    ],
    isFeatured: false,
  },
  "roadmap-fournisseur": {
    id: "offer-roadmap-fournisseur",
    slug: "roadmap-fournisseur",
    name: "Roadmap Fournisseur",
    description:
      "Feuille de route strategique couvrant gestion des risques, documentation technique, QMS et post-marche.",
    priceDisplay: "6 990 EUR HT",
    priceAmount: 699000,
    priceType: "ONE_TIME",
    features: [
      "Diagnostic fournisseur complet",
      "Roadmap conformite 12 mois",
      "Gap analysis Art. 8-17",
      "Plan QMS",
      "Strategy documentation technique",
      "4 calls de suivi",
    ],
    isFeatured: false,
  },
  "conformite-fournisseur": {
    id: "offer-conformite-fournisseur",
    slug: "conformite-fournisseur",
    name: "Conformite Fournisseur",
    description:
      "Accompagnement complet pour atteindre la conformite integrale des fournisseurs de systemes IA.",
    priceDisplay: "35 000 EUR+ HT",
    priceAmount: 3500000,
    priceType: "CUSTOM",
    features: [
      "Audit complet Art. 8-17",
      "Systeme de gestion des risques (Art. 9)",
      "Documentation technique Annexe IV",
      "QMS Art. 17 complet",
      "Evaluation de conformite Art. 43",
      "Marquage CE",
      "Surveillance post-marche Art. 72",
      "Accompagnement 6-12 mois",
    ],
    isFeatured: false,
  },
  "certification-ready": {
    id: "offer-certification-ready",
    slug: "certification-ready",
    name: "Certification Ready",
    description:
      "Preparation complete a la certification avec organisme notifie.",
    priceDisplay: "45 000 - 70 000 EUR HT",
    priceAmount: 4500000,
    priceType: "CUSTOM",
    features: [
      "Tout le Pack Conformite Fournisseur",
      "Preparation certification organisme notifie",
      "Pre-audit certification",
      "Accompagnement dossier Annexe VI/VII",
      "Support jusqu'a obtention certification",
    ],
    isFeatured: false,
  },
  importateur: {
    id: "offer-importateur",
    slug: "importateur",
    name: "Pack Importateur",
    description:
      "Accompagnement specifique pour les importateurs de systemes IA dans l'UE.",
    priceDisplay: "4 990 EUR HT",
    priceAmount: 499000,
    priceType: "ONE_TIME",
    features: [
      "Diagnostic importateur complet",
      "Verification conformite fournisseurs tiers",
      "Processus marquage CE importation",
      "Documentation Art. 23",
      "Templates de verification",
      "2 calls de suivi",
    ],
    isFeatured: false,
  },
  distributeur: {
    id: "offer-distributeur",
    slug: "distributeur",
    name: "Pack Distributeur",
    description:
      "Accompagnement pour la mise en conformite des distributeurs de solutions IA.",
    priceDisplay: "2 490 EUR HT",
    priceAmount: 249000,
    priceType: "ONE_TIME",
    features: [
      "Diagnostic distributeur",
      "Processus de verification avant distribution",
      "Documentation Art. 24",
      "Templates conformite distribution",
      "1 call de suivi",
    ],
    isFeatured: false,
  },
  "compliance-officer": {
    id: "offer-compliance-officer",
    slug: "compliance-officer",
    name: "Compliance Officer as a Service",
    description:
      "Un responsable conformite IA dedie, accessible en continu pour votre organisation.",
    priceDisplay: "890 EUR/mois",
    priceAmount: 89000,
    priceType: "MONTHLY",
    features: [
      "Responsable conformite dedie",
      "Veille reglementaire permanente",
      "Revue trimestrielle conformite",
      "Support illimite par email",
      "Accompagnement incidents",
      "Formation continue equipes",
    ],
    isFeatured: false,
  },
};

// ─── PRICE COMPARATOR ─────────────────────────────────────────────────────────

const PRICE_COMPARATOR: PriceComparator = {
  avocats: "5 000 - 15 000 EUR",
  bigFour: "20 000 - 50 000 EUR",
  complia: "A partir de 990 EUR",
};

const DEDUCTIBILITE_MESSAGE =
  "Le cout du diagnostic est deductible de tout pack conformite signe sous 30 jours.";

// ─── RECOMMENDATION MATRIX ───────────────────────────────────────────────────

interface MatrixEntry {
  primary: string;
  secondary: string;
  argumentaire: string;
}

// Pre-audit matrix: score /10
const PRE_AUDIT_MATRIX: Record<Role, Record<string, MatrixEntry>> = {
  [Role.DEPLOYEUR]: {
    "0-3": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Votre exposition semble limitee. Restez informe des evolutions reglementaires pour anticiper.",
    },
    "4-5": {
      primary: "diagnostic-flash",
      secondary: "conformite-deployeur",
      argumentaire:
        "Des lacunes ont ete identifiees. Un diagnostic de 2h vous donnera une feuille de route claire.",
    },
    "6-7": {
      primary: "diagnostic-strategique",
      secondary: "conformite-deployeur-plus",
      argumentaire:
        "Manquements significatifs detectes. Un diagnostic approfondi avec plan d'action est recommande avant les echeances.",
    },
    "8-10": {
      primary: "conformite-deployeur-plus",
      secondary: "compliance-officer",
      argumentaire:
        "Risque critique : des actions correctives immediates sont necessaires. Nous vous accompagnons de A a Z.",
    },
  },
  [Role.FOURNISSEUR]: {
    "0-3": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Bon niveau de preparation. Maintenez votre conformite avec notre veille.",
    },
    "4-5": {
      primary: "diagnostic-flash",
      secondary: "roadmap-fournisseur",
      argumentaire:
        "En tant que fournisseur, vos obligations sont parmi les plus lourdes. Un diagnostic vous evitera les angles morts.",
    },
    "6-7": {
      primary: "roadmap-fournisseur",
      secondary: "conformite-fournisseur",
      argumentaire:
        "Votre feuille de route conformite doit couvrir gestion des risques, documentation technique, QMS et post-marche.",
    },
    "8-10": {
      primary: "conformite-fournisseur",
      secondary: "certification-ready",
      argumentaire:
        "Situation critique pour un fournisseur. Un accompagnement complet est necessaire pour atteindre la conformite.",
    },
  },
  [Role.IMPORTATEUR]: {
    "0-3": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Maintenez votre vigilance sur la conformite des systemes que vous importez.",
    },
    "4-5": {
      primary: "diagnostic-flash",
      secondary: "importateur",
      argumentaire:
        "Des obligations specifiques s'appliquent a votre role. Un diagnostic clarifiera vos responsabilites.",
    },
    "6-10": {
      primary: "importateur",
      secondary: "compliance-officer",
      argumentaire:
        "En tant qu'importateur, vous etes garant de la conformite des systemes IA entrant dans l'UE.",
    },
  },
  [Role.DISTRIBUTEUR]: {
    "0-3": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Votre exposition est moderee. La veille reglementaire reste recommandee.",
    },
    "4-5": {
      primary: "diagnostic-flash",
      secondary: "distributeur",
      argumentaire:
        "Quelques points de conformite a verifier sur les solutions que vous commercialisez.",
    },
    "6-10": {
      primary: "distributeur",
      secondary: "compliance-officer",
      argumentaire:
        "Des manquements ont ete detectes dans votre chaine de distribution IA. Une mise en conformite est recommandee.",
    },
  },
  [Role.INDETERMINE]: {
    "0-3": {
      primary: "diagnostic-flash",
      secondary: "veille",
      argumentaire:
        "Votre role exact n'est pas clair. Un diagnostic permettra d'identifier vos obligations precises.",
    },
    "4-10": {
      primary: "diagnostic-strategique",
      secondary: "diagnostic-flash",
      argumentaire:
        "Sans role clairement identifie et avec un risque detecte, un accompagnement approfondi est votre meilleure protection.",
    },
  },
};

// Diagnostic matrix: score /100
const DIAGNOSTIC_MATRIX: Record<Role, Record<string, MatrixEntry>> = {
  [Role.DEPLOYEUR]: {
    "0-19": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Exposition limitee. Veille recommandee.",
    },
    "20-44": {
      primary: "diagnostic-flash",
      secondary: "conformite-deployeur",
      argumentaire:
        "Axes d'amelioration identifies. Diagnostic flash recommande.",
    },
    "45-69": {
      primary: "conformite-deployeur",
      secondary: "conformite-deployeur-plus",
      argumentaire:
        "Manquements significatifs. Diagnostic strategique indispensable.",
    },
    "70-100": {
      primary: "conformite-deployeur-plus",
      secondary: "compliance-officer",
      argumentaire:
        "Risque tres eleve. Action immediate necessaire.",
    },
  },
  [Role.FOURNISSEUR]: {
    "0-19": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Exposition limitee. Veille reglementaire recommandee.",
    },
    "20-44": {
      primary: "diagnostic-flash",
      secondary: "roadmap-fournisseur",
      argumentaire:
        "Diagnostic flash recommande pour cartographier vos obligations fournisseur.",
    },
    "45-69": {
      primary: "roadmap-fournisseur",
      secondary: "conformite-fournisseur",
      argumentaire:
        "Roadmap fournisseur indispensable : Art. 8-17 a couvrir integralement.",
    },
    "70-100": {
      primary: "conformite-fournisseur",
      secondary: "certification-ready",
      argumentaire:
        "Conformite fournisseur urgente. Accompagnement complet recommande.",
    },
  },
  [Role.IMPORTATEUR]: {
    "0-19": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Veille recommandee pour anticiper vos obligations importateur.",
    },
    "20-44": {
      primary: "diagnostic-flash",
      secondary: "importateur",
      argumentaire:
        "Diagnostic flash pour clarifier vos responsabilites Art. 23.",
    },
    "45-100": {
      primary: "importateur",
      secondary: "compliance-officer",
      argumentaire:
        "Pack importateur recommande : verification, documentation, marquage CE.",
    },
  },
  [Role.DISTRIBUTEUR]: {
    "0-19": {
      primary: "veille",
      secondary: "diagnostic-flash",
      argumentaire:
        "Veille recommandee pour votre activite de distribution.",
    },
    "20-44": {
      primary: "diagnostic-flash",
      secondary: "distributeur",
      argumentaire:
        "Diagnostic pour verifier votre chaine de conformite distribution.",
    },
    "45-100": {
      primary: "distributeur",
      secondary: "compliance-officer",
      argumentaire:
        "Pack distributeur recommande pour securiser votre activite.",
    },
  },
  [Role.INDETERMINE]: {
    "0-19": {
      primary: "diagnostic-flash",
      secondary: "veille",
      argumentaire:
        "Role indetermine. Un diagnostic clarifiera votre position.",
    },
    "20-100": {
      primary: "diagnostic-strategique",
      secondary: "diagnostic-flash",
      argumentaire:
        "Role non identifie avec risques detectes. Diagnostic strategique indispensable.",
    },
  },
};

// ─── SECTOR ARGUMENTS ─────────────────────────────────────────────────────────

const SECTOR_ARGUMENTS: Record<string, string> = {
  finance:
    "Vos systemes de scoring sont haut risque ET soumis a DORA. La double conformite est un enjeu strategique.",
  fintech:
    "Vos systemes de scoring sont haut risque ET soumis a DORA. La double conformite est un enjeu strategique.",
  assurance:
    "Vos systemes de scoring sont haut risque ET soumis a DORA. La double conformite est un enjeu strategique.",
  sante:
    "Les dispositifs medicaux integrant de l'IA cumulent les exigences AI Act et MDR (2017/745). Un accompagnement specialise est indispensable.",
  medtech:
    "Les dispositifs medicaux integrant de l'IA cumulent les exigences AI Act et MDR (2017/745). Un accompagnement specialise est indispensable.",
  health:
    "Les dispositifs medicaux integrant de l'IA cumulent les exigences AI Act et MDR (2017/745). Un accompagnement specialise est indispensable.",
  rh:
    "Les systemes de recrutement et d'evaluation automatises sont au coeur du reglement. Vos obligations entrent en application en aout 2026.",
  education:
    "La notation et l'orientation assistees par IA sont classees haut risque. L'echeance d'aout 2026 s'applique.",
  administration:
    "Les administrations publiques sont soumises a des obligations renforcees, notamment en matiere de FRIA et de registre public.",
};

// ─── SCORE RANGE MATCHING ─────────────────────────────────────────────────────

function findMatrixEntry(
  matrix: Record<string, MatrixEntry>,
  score: number
): MatrixEntry | null {
  for (const [range, entry] of Object.entries(matrix)) {
    const [min, max] = range.split("-").map(Number);
    if (score >= min && score <= max) return entry;
  }
  return null;
}

// ─── SECTOR-ADJUSTED OFFER ────────────────────────────────────────────────────

function adjustOfferForSector(
  offerSlug: string,
  sector: string | null
): string {
  if (!sector) return offerSlug;
  const s = sector.toLowerCase();

  if (offerSlug === "diagnostic-flash") {
    if (s.includes("sante") || s.includes("medtech") || s.includes("health"))
      return "diagnostic-flash-medtech";
    if (
      s.includes("finance") ||
      s.includes("fintech") ||
      s.includes("assurance")
    )
      return "diagnostic-flash-fintech";
  }

  return offerSlug;
}

// ─── MAIN RECOMMENDATION FUNCTION ────────────────────────────────────────────

export function getRecommendedOffer(
  role: Role,
  score: number,
  sector: string | null,
  companySize: string | null,
  type: "PRE_AUDIT" | "DIAGNOSTIC" = "PRE_AUDIT"
): OfferRecommendation {
  const matrix =
    type === "PRE_AUDIT" ? PRE_AUDIT_MATRIX : DIAGNOSTIC_MATRIX;
  const roleMatrix = matrix[role] ?? matrix[Role.INDETERMINE];
  const entry = findMatrixEntry(roleMatrix, score);

  if (!entry) {
    // Fallback: highest range
    const keys = Object.keys(roleMatrix);
    const lastKey = keys[keys.length - 1];
    const fallback = roleMatrix[lastKey];
    return buildRecommendation(fallback, sector, role);
  }

  return buildRecommendation(entry, sector, role);
}

function buildRecommendation(
  entry: MatrixEntry,
  sector: string | null,
  role: Role
): OfferRecommendation {
  const adjustedPrimarySlug = adjustOfferForSector(entry.primary, sector);
  const primaryOffer = {
    ...(OFFERS[adjustedPrimarySlug] ?? OFFERS[entry.primary]),
    isFeatured: true,
  };
  const secondaryOffer = OFFERS[entry.secondary]
    ? { ...OFFERS[entry.secondary], isFeatured: false }
    : null;

  // Sector-specific argument
  let sectorArgument: string | null = null;
  if (sector) {
    const s = sector.toLowerCase();
    for (const [key, arg] of Object.entries(SECTOR_ARGUMENTS)) {
      if (s.includes(key)) {
        sectorArgument = arg;
        break;
      }
    }
  }

  // Urgency message based on remaining time to August 2026
  const now = new Date();
  const deadline = new Date("2026-08-02");
  const daysRemaining = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  let urgencyMessage: string | null = null;
  if (daysRemaining <= 180) {
    urgencyMessage = `URGENCE : il reste ${daysRemaining} jours avant l'entree en application des obligations systemes haut risque (2 aout 2026).`;
  } else if (daysRemaining <= 365) {
    urgencyMessage = `Attention : l'echeance du 2 aout 2026 approche. ${daysRemaining} jours pour vous mettre en conformite.`;
  }

  return {
    primaryOffer,
    secondaryOffer,
    argumentaire: entry.argumentaire,
    sectorArgument,
    urgencyMessage,
    comparateur: PRICE_COMPARATOR,
    deductibilite: DEDUCTIBILITE_MESSAGE,
  };
}

/**
 * Get full offer details by slug.
 */
export function getOfferBySlug(slug: string): OfferDetail | null {
  return OFFERS[slug] ? { ...OFFERS[slug], isFeatured: false } : null;
}

/**
 * List all active offers.
 */
export function listAllOffers(): OfferDetail[] {
  return Object.values(OFFERS).map((o) => ({ ...o, isFeatured: false }));
}
