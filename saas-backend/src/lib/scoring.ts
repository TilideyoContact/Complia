import {
  Role,
  RiskLevel,
  ComplianceLevel,
  type AnswerWithScore,
  type PreAuditScoreResult,
  type DiagnosticScoreResult,
  type KillSwitchViolation,
  type Alert,
  type ScoringDimension,
  SENSITIVE_SECTORS,
  INDUSTRIAL_SECTORS,
} from "../types";

// ─── MULTIPLIER TABLES ───────────────────────────────────────────────────────

const ROLE_MULTIPLIERS: Record<Role, number> = {
  [Role.FOURNISSEUR]: 1.2,
  [Role.IMPORTATEUR]: 1.1,
  [Role.DEPLOYEUR]: 1.05,
  [Role.DISTRIBUTEUR]: 1.0,
  [Role.INDETERMINE]: 1.15,
};

function getSectorMultiplier(sector: string | null): number {
  if (!sector) return 1.0;
  const s = sector.toLowerCase();
  if ((SENSITIVE_SECTORS as readonly string[]).some((ss) => s.includes(ss)))
    return 1.2;
  if ((INDUSTRIAL_SECTORS as readonly string[]).some((is_) => s.includes(is_)))
    return 1.1;
  return 1.0;
}

function getSizeMultiplier(companySize: string | null): number {
  if (!companySize) return 1.0;
  const s = companySize.toLowerCase();
  if (s === "ge" || s.includes("5000") || s.includes("grand")) return 1.1;
  if (s === "eti" || s.includes("250")) return 1.05;
  return 1.0;
}

function getSectoralEscalation(sector: string | null): number {
  if (!sector) return 1.0;
  const s = sector.toLowerCase();
  if (s.includes("sante") || s.includes("medtech") || s.includes("health"))
    return 1.2;
  if (
    s.includes("finance") ||
    s.includes("fintech") ||
    s.includes("assurance")
  )
    return 1.15;
  return 1.0;
}

// ─── PRE-AUDIT SCORING POINTS ─────────────────────────────────────────────────

interface PreAuditPointsMap {
  [questionCode: string]: {
    [answerKey: string]: number;
  };
}

const PRE_AUDIT_POINTS: PreAuditPointsMap = {
  Q4: {
    non: -1.0,
    nsp: 0.5,
    oui_exclusivement: 0,
    oui_en_partie: 0,
  },
  Q5: {
    aucun: 0,
    "1-2": 0.3,
    "3-5": 0.5,
    "6-10": 0.8,
    "plus-de-10": 1.0,
    nsp: 0.7,
  },
  Q6F: {
    oui: 0,
    en_cours: 0.5,
    non: 1.5,
    nsp: 1.0,
  },
  Q6D: {
    oui: 0,
    partiellement: 0.5,
    non: 1.2,
    nsp: 1.0,
  },
  Q6I: {
    oui: 0,
    parfois: 0.5,
    non: 1.5,
    nsp: 1.2,
  },
  Q6R: {
    oui: 0,
    partiellement: 0.5,
    non: 1.0,
    nsp: 0.8,
  },
  Q6X: {
    oui: 0,
    en_partie: 0.5,
    non: 1.2,
    nsp: 1.5,
  },
  Q7: {
    // Each forbidden practice checked: +2.0
    pratique_interdite: 2.0,
    aucune: 0,
  },
  Q8: {
    // Each high-risk domain checked: +1.0
    domaine_haut_risque: 1.0,
    aucun: 0,
  },
  Q9: {
    oui: 0,
    pas_toujours: 0.5,
    non: 1.0,
    na: 0,
  },
  Q10: {
    oui: 0,
    certains_cas: 0.5,
    non: 1.2,
    nsp: 0.8,
  },
  Q11: {
    oui: 0,
    prevue: 0.3,
    non: 0.8,
    pas_identifie: 1.0,
  },
  Q12: {
    oui: 0.3,
    probablement: 0.3,
    non: 0,
    nsp: 0.3,
  },
  Q13: {
    intensive: 0.5,
    occasionnel: 0.3,
    non: 0,
    en_projet: 0.2,
  },
  Q14: {
    audit_complet: -0.5,
    commence: 0,
    rien_initie: 0.8,
    inconnue: 1.0,
  },
  Q15: {
    avant_aout_2026: 0,
    fin_2026: 0.2,
    "2027": 0.3,
    pas_de_calendrier: 0.5,
  },
};

// ─── KILL SWITCH DETECTION (Art. 5) ──────────────────────────────────────────

const FORBIDDEN_PRACTICES = [
  {
    code: "Q-INTERDIT-01",
    questionCodes: ["Q7", "Q21"],
    optionKeys: ["scoring_social", "techniques_subliminales", "A"],
    articleRef: "Art. 5(1)(a)",
    description:
      "Techniques subliminales ou manipulatrices alterant le comportement",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-02",
    questionCodes: ["Q7", "Q22"],
    optionKeys: ["exploitation_vulnerabilites", "B"],
    articleRef: "Art. 5(1)(b)",
    description:
      "Exploitation des vulnerabilites de personnes (age, handicap, situation sociale)",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-03",
    questionCodes: ["Q7", "Q23"],
    optionKeys: ["scoring_social", "C"],
    articleRef: "Art. 5(1)(c)",
    description: "Scoring social par les autorites publiques ou pour leur compte",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-04",
    questionCodes: ["Q24"],
    optionKeys: ["police_predictive"],
    articleRef: "Art. 5(1)(d)",
    description:
      "Police predictive fondee uniquement sur le profilage de personnes physiques",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-05",
    questionCodes: ["Q25"],
    optionKeys: ["moissonnage_facial"],
    articleRef: "Art. 5(1)(e)",
    description:
      "Moissonnage non cible d'images faciales sur Internet ou via la videosurveillance",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-06",
    questionCodes: ["Q7", "Q26"],
    optionKeys: ["inference_emotions", "D"],
    articleRef: "Art. 5(1)(f)",
    description:
      "Inference des emotions sur le lieu de travail ou dans l'enseignement",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-07",
    questionCodes: ["Q7", "Q27"],
    optionKeys: ["categorisation_biometrique", "E"],
    articleRef: "Art. 5(1)(g)",
    description:
      "Categorisation biometrique inferant des donnees sensibles (origine, orientation, etc.)",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
  {
    code: "Q-INTERDIT-08",
    questionCodes: ["Q7", "Q28"],
    optionKeys: ["identification_biometrique_tr", "C"],
    articleRef: "Art. 5(1)(h)",
    description:
      "Identification biometrique a distance en temps reel dans des espaces publics",
    penalty: "Jusqu'a 35M EUR ou 7% du CA mondial",
  },
];

function detectKillSwitches(
  answers: AnswerWithScore[]
): KillSwitchViolation[] {
  const violations: KillSwitchViolation[] = [];

  for (const practice of FORBIDDEN_PRACTICES) {
    for (const answer of answers) {
      if (!practice.questionCodes.includes(answer.questionCode)) continue;

      const selected = answer.value.selected;
      const selectedArray = Array.isArray(selected) ? selected : [selected];

      for (const sel of selectedArray) {
        const normalizedSel = sel.toLowerCase().replace(/\s+/g, "_");
        if (
          practice.optionKeys.some(
            (key) =>
              normalizedSel.includes(key.toLowerCase()) ||
              normalizedSel === key.toLowerCase()
          )
        ) {
          if (!violations.some((v) => v.articleRef === practice.articleRef)) {
            violations.push({
              articleRef: practice.articleRef,
              questionCode: answer.questionCode,
              description: practice.description,
              penalty: practice.penalty,
            });
          }
        }
      }
    }
  }

  return violations;
}

// ─── PRE-AUDIT ALERTS ─────────────────────────────────────────────────────────

function generatePreAuditAlerts(
  answers: AnswerWithScore[],
  killSwitches: KillSwitchViolation[],
  scoreFinal: number,
  roles: Role[]
): Alert[] {
  const alerts: Alert[] = [];

  // Critical: forbidden practices
  for (const ks of killSwitches) {
    alerts.push({
      id: `KS-${ks.articleRef}`,
      severity: "CRITIQUE",
      title: "Pratique interdite detectee",
      message: `${ks.description}. En vigueur depuis le 2 fevrier 2025. Amende : ${ks.penalty}. ACTION IMMEDIATE REQUISE.`,
      reference: ks.articleRef,
      condition: `Kill switch ${ks.articleRef}`,
    });
  }

  // High risk system alerts
  const q8 = answers.find((a) => a.questionCode === "Q8");
  if (q8) {
    const selected = Array.isArray(q8.value.selected)
      ? q8.value.selected
      : [q8.value.selected];
    const hrDomains = selected.filter(
      (s) => !s.toLowerCase().includes("aucun")
    );
    if (hrDomains.length > 0) {
      alerts.push({
        id: "A6-HR",
        severity: "ATTENTION",
        title: "Systemes a haut risque detectes",
        message: `${hrDomains.length} domaine(s) haut risque identifie(s). Obligations renforcees applicables des aout 2026 : documentation technique, FRIA, surveillance humaine.`,
        reference: "Annexe III",
        condition: "Q8 >= 1 domaine HR",
      });
    }
  }

  // Transparency
  const q9 = answers.find((a) => a.questionCode === "Q9");
  if (q9) {
    const sel = (
      Array.isArray(q9.value.selected)
        ? q9.value.selected[0]
        : q9.value.selected
    ).toLowerCase();
    if (sel.includes("non")) {
      alerts.push({
        id: "A12",
        severity: "LACUNE",
        title: "Obligation de transparence non respectee",
        message:
          "L'AI Act impose d'informer les personnes qu'elles interagissent avec un systeme d'IA. Cette obligation est deja en vigueur.",
        reference: "Art. 50(1)",
        condition: "Q9 = Non",
      });
    }
  }

  // No compliance action
  const q14 = answers.find((a) => a.questionCode === "Q14");
  if (q14) {
    const sel = (
      Array.isArray(q14.value.selected)
        ? q14.value.selected[0]
        : q14.value.selected
    ).toLowerCase();
    if (sel.includes("rien") || sel.includes("inconnue")) {
      alerts.push({
        id: "A17",
        severity: "URGENCE",
        title: "Aucune demarche de conformite engagee",
        message:
          "Vous n'avez engage aucune demarche de conformite alors que plusieurs obligations sont deja en vigueur et que l'echeance d'aout 2026 approche.",
        reference: "Art. 99 ; Art. 113",
        condition: "Q14 = Rien initie ou Inconnue",
      });
    }
  }

  // Calendar urgency
  const q15 = answers.find((a) => a.questionCode === "Q15");
  if (q15 && scoreFinal >= 6) {
    const sel = (
      Array.isArray(q15.value.selected)
        ? q15.value.selected[0]
        : q15.value.selected
    ).toLowerCase();
    if (sel.includes("pas_de_calendrier") || sel.includes("pas de calendrier")) {
      alerts.push({
        id: "A18",
        severity: "URGENCE",
        title: "Alerte calendrier",
        message:
          "Sans calendrier defini et avec un niveau de risque eleve, votre entreprise pourrait ne pas etre conforme avant le 2 aout 2026.",
        reference: "Art. 113(1)",
        condition: "Q15 = Pas de calendrier ET score >= 6",
      });
    }
  }

  // Indeterminate role
  if (roles.includes(Role.INDETERMINE)) {
    alerts.push({
      id: "A20",
      severity: "POINT_VIGILANCE",
      title: "Role a clarifier",
      message:
        "Vous n'avez pas pu identifier votre role au sens de l'AI Act. Un diagnostic precis de votre position dans la chaine de valeur IA est necessaire.",
      reference: "Art. 3",
      condition: "Role = INDETERMINE",
    });
  }

  // Training gap
  const q11 = answers.find((a) => a.questionCode === "Q11");
  if (q11) {
    const sel = (
      Array.isArray(q11.value.selected)
        ? q11.value.selected[0]
        : q11.value.selected
    ).toLowerCase();
    if (sel.includes("non") || sel.includes("pas_identifie") || sel.includes("pas identifie")) {
      alerts.push({
        id: "A14",
        severity: "LACUNE",
        title: "Formation IA manquante",
        message:
          "L'AI Act exige que toute personne manipulant un systeme d'IA dispose d'un niveau suffisant de maitrise. La formation est une obligation legale.",
        reference: "Art. 4",
        condition: "Q11 = Non ou Pas identifie",
      });
    }
  }

  // Sort: CRITIQUE first, then URGENCE, ATTENTION, LACUNE, POINT_VIGILANCE
  const severityOrder: Record<string, number> = {
    CRITIQUE: 0,
    URGENCE: 1,
    ATTENTION: 2,
    LACUNE: 3,
    POINT_VIGILANCE: 4,
  };
  alerts.sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  // Return max 5 alerts
  return alerts.slice(0, 5);
}

// ─── ROLE DETECTION ───────────────────────────────────────────────────────────

function detectRoles(answers: AnswerWithScore[]): Role[] {
  const roles: Role[] = [];

  const q1 = answers.find(
    (a) => a.questionCode === "Q1" || a.questionCode === "Q-ROLE-A"
  );
  if (q1) {
    const sel = (
      Array.isArray(q1.value.selected)
        ? q1.value.selected[0]
        : q1.value.selected
    ).toLowerCase();
    if (sel.includes("developp") || sel === "a") roles.push(Role.FOURNISSEUR);
    else if (sel.includes("utilis") || sel === "b") roles.push(Role.DEPLOYEUR);
    else if (sel.includes("import") || sel === "c")
      roles.push(Role.IMPORTATEUR);
    else if (sel.includes("revend") || sel.includes("distribu") || sel === "d")
      roles.push(Role.DISTRIBUTEUR);
    else roles.push(Role.INDETERMINE);
  }

  // Check for cumul from diagnostic deep questions
  for (const a of answers) {
    if (
      (a.questionCode === "Q-ROLE-A" || a.questionCode === "Q6") &&
      isYes(a.value.selected) &&
      !roles.includes(Role.FOURNISSEUR)
    ) {
      roles.push(Role.FOURNISSEUR);
    }
    if (
      (a.questionCode === "Q-ROLE-B" || a.questionCode === "Q8_role") &&
      isYes(a.value.selected) &&
      !roles.includes(Role.DEPLOYEUR)
    ) {
      roles.push(Role.DEPLOYEUR);
    }
    if (
      (a.questionCode === "Q-ROLE-C" || a.questionCode === "Q9_role") &&
      isYes(a.value.selected) &&
      !roles.includes(Role.IMPORTATEUR)
    ) {
      roles.push(Role.IMPORTATEUR);
    }
    if (
      (a.questionCode === "Q-ROLE-D" || a.questionCode === "Q10_role") &&
      isYes(a.value.selected) &&
      !roles.includes(Role.DISTRIBUTEUR)
    ) {
      roles.push(Role.DISTRIBUTEUR);
    }
  }

  return roles.length > 0 ? roles : [Role.INDETERMINE];
}

function isYes(selected: string | string[]): boolean {
  const s = (Array.isArray(selected) ? selected[0] : selected).toLowerCase();
  return s === "oui" || s === "a" || s === "yes" || s === "true";
}

// ─── PRE-AUDIT SCORE CALCULATION (/10) ────────────────────────────────────────

function normalizeAnswer(selected: string | string[]): string {
  const s = Array.isArray(selected) ? selected[0] : selected;
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function calculatePreAuditRawPoints(
  answers: AnswerWithScore[]
): { points: number; answersWithPoints: AnswerWithScore[] } {
  let points = 0;
  const answersWithPoints: AnswerWithScore[] = [];

  for (const answer of answers) {
    let answerPoints = 0;
    const code = answer.questionCode;

    // Q7: multiple choices for forbidden practices
    if (code === "Q7") {
      const selected = Array.isArray(answer.value.selected)
        ? answer.value.selected
        : [answer.value.selected];
      const practices = selected.filter(
        (s) => !s.toLowerCase().includes("aucune")
      );
      answerPoints = practices.length * 2.0;
    }
    // Q8: multiple choices for high risk
    else if (code === "Q8") {
      const selected = Array.isArray(answer.value.selected)
        ? answer.value.selected
        : [answer.value.selected];
      const hrDomains = selected.filter(
        (s) => !s.toLowerCase().includes("aucun")
      );
      answerPoints = hrDomains.length * 1.0;
    }
    // Standard single-choice questions
    else if (PRE_AUDIT_POINTS[code]) {
      const normalizedSel = normalizeAnswer(answer.value.selected);
      const pointsMap = PRE_AUDIT_POINTS[code];
      // Try exact match first, then partial match
      if (pointsMap[normalizedSel] !== undefined) {
        answerPoints = pointsMap[normalizedSel];
      } else {
        for (const [key, val] of Object.entries(pointsMap)) {
          if (normalizedSel.includes(key) || key.includes(normalizedSel)) {
            answerPoints = val;
            break;
          }
        }
      }
    }

    points += answerPoints;
    answersWithPoints.push({
      ...answer,
      rawPoints: answerPoints,
    });
  }

  return { points, answersWithPoints };
}

export function calculatePreAuditScore(
  answers: AnswerWithScore[],
  roleOverride?: Role,
  sectorOverride?: string,
  sizeOverride?: string
): PreAuditScoreResult {
  const detectedRoles = roleOverride
    ? [roleOverride]
    : detectRoles(answers);
  const primaryRole = detectedRoles[0];

  // Detect sector and size from answers if not overridden
  const sectorAnswer = answers.find(
    (a) => a.questionCode === "Q2"
  );
  const sizeAnswer = answers.find((a) => a.questionCode === "Q3");
  const sector =
    sectorOverride ??
    (sectorAnswer
      ? normalizeAnswer(sectorAnswer.value.selected)
      : null);
  const companySize =
    sizeOverride ??
    (sizeAnswer
      ? normalizeAnswer(sizeAnswer.value.selected)
      : null);

  // Calculate raw points
  const { points: scoreBrut, answersWithPoints } =
    calculatePreAuditRawPoints(answers);

  // Apply multipliers
  const multiplicateurRole = ROLE_MULTIPLIERS[primaryRole];
  const multiplicateurSecteur = getSectorMultiplier(sector);
  const multiplicateurTaille = getSizeMultiplier(companySize);

  const scoreAjuste =
    scoreBrut * multiplicateurRole * multiplicateurSecteur * multiplicateurTaille;
  const scoreFinal = Math.min(10, Math.round(scoreAjuste * 10) / 10);

  // Risk level
  let riskLevel: RiskLevel;
  if (scoreFinal <= 3) riskLevel = RiskLevel.FAIBLE;
  else if (scoreFinal <= 5) riskLevel = RiskLevel.MODERE;
  else if (scoreFinal <= 7) riskLevel = RiskLevel.ELEVE;
  else riskLevel = RiskLevel.CRITIQUE;

  // Kill switch detection
  const killSwitchDetails = detectKillSwitches(answersWithPoints);
  const hasKillSwitch = killSwitchDetails.length > 0;

  // If kill switch detected, force CRITIQUE
  if (hasKillSwitch) {
    riskLevel = RiskLevel.CRITIQUE;
  }

  // Generate alerts
  const alerts = generatePreAuditAlerts(
    answersWithPoints,
    killSwitchDetails,
    scoreFinal,
    detectedRoles
  );

  return {
    scoreBrut,
    scoreAjuste,
    scoreFinal,
    maxPossible: 10,
    riskLevel,
    multiplicateurRole,
    multiplicateurSecteur,
    multiplicateurTaille,
    hasKillSwitch,
    killSwitchDetails,
    alerts,
    detectedRoles,
  };
}

// ─── DIAGNOSTIC SCORE CALCULATION (/100) ──────────────────────────────────────

const FOURNISSEUR_DIMENSIONS: Omit<ScoringDimension, "rawScore" | "normalizedScore">[] = [
  { code: "D1-F", label: "Documentation technique", reference: "Annexe IV", weight: 0.2, maxScore: 50 },
  { code: "D2-F", label: "Systeme de gestion de la qualite (QMS)", reference: "Art. 17", weight: 0.15, maxScore: 40 },
  { code: "D3-F", label: "Evaluation de la conformite", reference: "Art. 43-46", weight: 0.15, maxScore: 40 },
  { code: "D4-F", label: "Marquage CE & declaration conformite", reference: "Art. 47-49", weight: 0.1, maxScore: 30 },
  { code: "D5-F", label: "Transparence & information", reference: "Art. 13", weight: 0.15, maxScore: 40 },
  { code: "D6-F", label: "Surveillance post-marche", reference: "Art. 72", weight: 0.15, maxScore: 40 },
  { code: "D7-F", label: "Cybersecurite & robustesse", reference: "Art. 15", weight: 0.1, maxScore: 30 },
];

const DEPLOYEUR_DIMENSIONS: Omit<ScoringDimension, "rawScore" | "normalizedScore">[] = [
  { code: "D1-D", label: "Surveillance humaine", reference: "Art. 26(1-2), Art. 14", weight: 0.2, maxScore: 40 },
  { code: "D2-D", label: "Registre des activites", reference: "Art. 26(6)", weight: 0.1, maxScore: 20 },
  { code: "D3-D", label: "FRIA", reference: "Art. 27", weight: 0.2, maxScore: 40 },
  { code: "D4-D", label: "Conservation des logs", reference: "Art. 26(5)", weight: 0.1, maxScore: 25 },
  { code: "D5-D", label: "Information des personnes", reference: "Art. 26(6), Art. 50", weight: 0.15, maxScore: 35 },
  { code: "D6-D", label: "Verification fournisseur", reference: "Art. 26(1)", weight: 0.15, maxScore: 35 },
  { code: "D7-D", label: "Gestion incidents & non-conformites", reference: "Art. 26(5)", weight: 0.1, maxScore: 25 },
];

const IMPORTATEUR_DIMENSIONS: Omit<ScoringDimension, "rawScore" | "normalizedScore">[] = [
  { code: "D1-I", label: "Verification conformite fournisseur", reference: "Art. 23(1)", weight: 0.25, maxScore: 40 },
  { code: "D2-I", label: "Documentation & marquage CE", reference: "Art. 23(2-3)", weight: 0.2, maxScore: 35 },
  { code: "D3-I", label: "Conditions de stockage & transport", reference: "Art. 23(4)", weight: 0.15, maxScore: 25 },
  { code: "D4-I", label: "Actions correctives & cooperation", reference: "Art. 23(5-6)", weight: 0.2, maxScore: 30 },
  { code: "D5-I", label: "Conservation documentation", reference: "Art. 23(7)", weight: 0.1, maxScore: 20 },
  { code: "D6-I", label: "Transparence & information", reference: "Art. 50", weight: 0.1, maxScore: 20 },
];

const DISTRIBUTEUR_DIMENSIONS: Omit<ScoringDimension, "rawScore" | "normalizedScore">[] = [
  { code: "D1-R", label: "Verification avant mise a disposition", reference: "Art. 24(1)", weight: 0.3, maxScore: 35 },
  { code: "D2-R", label: "Conditions de stockage", reference: "Art. 24(2)", weight: 0.15, maxScore: 20 },
  { code: "D3-R", label: "Actions correctives", reference: "Art. 24(3-4)", weight: 0.25, maxScore: 30 },
  { code: "D4-R", label: "Cooperation autorites", reference: "Art. 24(5)", weight: 0.15, maxScore: 20 },
  { code: "D5-R", label: "Transparence", reference: "Art. 50", weight: 0.15, maxScore: 20 },
];

function getDimensionsForRole(
  role: Role
): Omit<ScoringDimension, "rawScore" | "normalizedScore">[] {
  switch (role) {
    case Role.FOURNISSEUR:
      return FOURNISSEUR_DIMENSIONS;
    case Role.DEPLOYEUR:
      return DEPLOYEUR_DIMENSIONS;
    case Role.IMPORTATEUR:
      return IMPORTATEUR_DIMENSIONS;
    case Role.DISTRIBUTEUR:
      return DISTRIBUTEUR_DIMENSIONS;
    default:
      return DEPLOYEUR_DIMENSIONS; // Fallback for INDETERMINE
  }
}

function calculateDimensionScores(
  answers: AnswerWithScore[],
  role: Role
): ScoringDimension[] {
  const dimensionDefs = getDimensionsForRole(role);
  const dimensionScores: Map<string, number> = new Map();

  // Initialize all dimensions to 0
  for (const dim of dimensionDefs) {
    dimensionScores.set(dim.code, 0);
  }

  // Accumulate raw points per dimension
  for (const answer of answers) {
    if (answer.dimension) {
      const current = dimensionScores.get(answer.dimension) ?? 0;
      dimensionScores.set(answer.dimension, current + answer.rawPoints);
    }
  }

  return dimensionDefs.map((dim) => {
    const rawScore = dimensionScores.get(dim.code) ?? 0;
    // Normalize: higher raw = worse compliance, so invert
    // normalized = (maxScore - rawScore) / maxScore * 100 (capped 0-100)
    const normalizedScore = Math.max(
      0,
      Math.min(100, ((dim.maxScore - rawScore) / dim.maxScore) * 100)
    );
    return {
      ...dim,
      rawScore,
      normalizedScore: Math.round(normalizedScore * 10) / 10,
    };
  });
}

function generateDiagnosticAlerts(
  answers: AnswerWithScore[],
  killSwitches: KillSwitchViolation[],
  dimensions: ScoringDimension[],
  roles: Role[]
): Alert[] {
  const alerts: Alert[] = [];

  // Kill switch alerts
  for (const ks of killSwitches) {
    alerts.push({
      id: `KS-${ks.articleRef}`,
      severity: "CRITIQUE",
      title: "PRATIQUE INTERDITE DETECTEE",
      message: `${ks.description}. En vigueur depuis le 2 fevrier 2025. Amende : ${ks.penalty}. ACTION IMMEDIATE REQUISE : cessation et remediation.`,
      reference: ks.articleRef,
      condition: `Kill switch ${ks.articleRef}`,
    });
  }

  // Dimension-based alerts (low scoring dimensions)
  for (const dim of dimensions) {
    if (dim.normalizedScore < 30) {
      alerts.push({
        id: `DIM-${dim.code}-CRITICAL`,
        severity: "CRITIQUE",
        title: `Defaillance majeure : ${dim.label}`,
        message: `Votre score sur la dimension "${dim.label}" est critique (${dim.normalizedScore}%). Des actions correctives immediates sont necessaires.`,
        reference: dim.reference,
        condition: `${dim.code} normalizedScore < 30%`,
      });
    } else if (dim.normalizedScore < 50) {
      alerts.push({
        id: `DIM-${dim.code}-HIGH`,
        severity: "ATTENTION",
        title: `Lacune importante : ${dim.label}`,
        message: `Des manquements significatifs ont ete detectes sur "${dim.label}" (${dim.normalizedScore}%). Un plan d'action prioritaire est recommande.`,
        reference: dim.reference,
        condition: `${dim.code} normalizedScore < 50%`,
      });
    }
  }

  // Role cumulation alert
  if (roles.length > 1) {
    alerts.push({
      id: "CUMUL-ROLES",
      severity: "ATTENTION",
      title: "Cumul de roles detecte",
      message: `Votre organisation cumule ${roles.length} roles (${roles.join(", ")}). L'Art. 25 s'applique : les obligations se cumulent. Un accompagnement specifique est recommande.`,
      reference: "Art. 25",
      condition: `${roles.length} roles detectes`,
    });
  }

  const severityOrder: Record<string, number> = {
    CRITIQUE: 0,
    URGENCE: 1,
    ATTENTION: 2,
    LACUNE: 3,
    POINT_VIGILANCE: 4,
  };
  alerts.sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  return alerts.slice(0, 8);
}

export function calculateDiagnosticScore(
  answers: AnswerWithScore[],
  roleOverride?: Role,
  sectorOverride?: string,
  sizeOverride?: string
): DiagnosticScoreResult {
  const detectedRoles = roleOverride
    ? [roleOverride]
    : detectRoles(answers);
  const primaryRole = detectedRoles[0];

  const sectorAnswer = answers.find(
    (a) => a.questionCode === "Q2" || a.questionCode === "Q-SECTOR"
  );
  const sizeAnswer = answers.find(
    (a) => a.questionCode === "Q3" || a.questionCode === "Q-SIZE"
  );
  const sector =
    sectorOverride ??
    (sectorAnswer ? normalizeAnswer(sectorAnswer.value.selected) : null);
  const companySize =
    sizeOverride ??
    (sizeAnswer ? normalizeAnswer(sizeAnswer.value.selected) : null);

  // Calculate dimension scores
  const dimensions = calculateDimensionScores(answers, primaryRole);

  // Calculate raw score as weighted average of dimensions (inverted: 100 = worst)
  const scoreBrut = dimensions.reduce((sum, dim) => {
    // rawScore is the accumulated penalty points
    return sum + dim.rawScore;
  }, 0);

  // Calculate weighted compliance score
  const weightedCompliance = dimensions.reduce((sum, dim) => {
    return sum + dim.normalizedScore * dim.weight;
  }, 0);

  // Add kill switch and forbidden practice penalties
  const killSwitchDetails = detectKillSwitches(answers);
  const hasKillSwitch = killSwitchDetails.length > 0;
  const interditPenalty = killSwitchDetails.length * 20;

  // Apply multipliers
  const multiplicateurRole = ROLE_MULTIPLIERS[primaryRole];
  const multiplicateurSecteur = getSectorMultiplier(sector);
  const multiplicateurTaille = getSizeMultiplier(companySize);
  const escalationSectorielle = getSectoralEscalation(sector);

  // Final score: weighted compliance minus penalties, scaled by multipliers
  // Higher score = more compliant
  let scoreAjuste = weightedCompliance - interditPenalty;
  // Apply inverse multipliers (higher multipliers = more obligations = lower score)
  scoreAjuste =
    scoreAjuste /
    (multiplicateurRole *
      multiplicateurSecteur *
      multiplicateurTaille *
      escalationSectorielle);
  // Normalize to 0-100
  scoreAjuste = Math.max(0, scoreAjuste);

  const scoreFinal = Math.min(100, Math.round(scoreAjuste));

  // Compliance level thresholds
  let complianceLevel: ComplianceLevel;
  let riskLevel: RiskLevel;

  if (hasKillSwitch) {
    complianceLevel = ComplianceLevel.NON_CONFORME;
    riskLevel = RiskLevel.CRITIQUE;
  } else if (scoreFinal >= 80) {
    complianceLevel = ComplianceLevel.CONFORME;
    riskLevel = RiskLevel.FAIBLE;
  } else if (scoreFinal >= 50) {
    complianceLevel = ComplianceLevel.CONDITIONNEL;
    riskLevel = scoreFinal >= 70 ? RiskLevel.MODERE : RiskLevel.ELEVE;
  } else {
    complianceLevel = ComplianceLevel.NON_CONFORME;
    riskLevel = RiskLevel.CRITIQUE;
  }

  const alerts = generateDiagnosticAlerts(
    answers,
    killSwitchDetails,
    dimensions,
    detectedRoles
  );

  return {
    scoreBrut,
    scoreAjuste,
    scoreFinal,
    maxPossible: 100,
    riskLevel,
    complianceLevel,
    multiplicateurRole,
    multiplicateurSecteur,
    multiplicateurTaille,
    hasKillSwitch,
    killSwitchDetails,
    dimensions,
    alerts,
    detectedRoles,
  };
}

// ─── PARTIAL SCORE RECALCULATION ──────────────────────────────────────────────

export function recalculatePartialScore(
  answers: AnswerWithScore[],
  type: "PRE_AUDIT" | "DIAGNOSTIC",
  role?: Role,
  sector?: string,
  size?: string
): PreAuditScoreResult | DiagnosticScoreResult {
  if (type === "PRE_AUDIT") {
    return calculatePreAuditScore(answers, role, sector, size);
  }
  return calculateDiagnosticScore(answers, role, sector, size);
}

// ─── ANSWER SCORING HELPER ───────────────────────────────────────────────────

/**
 * Evaluate a single answer and return its points + metadata.
 * Used when saving individual answers to provide immediate feedback.
 */
export function evaluateAnswer(
  questionCode: string,
  value: { selected: string | string[]; text?: string },
  role?: Role
): { rawPoints: number; dimension: string | null; isCritical: boolean; alertMessage: string | null } {
  let rawPoints = 0;
  let dimension: string | null = null;
  let isCritical = false;
  let alertMessage: string | null = null;

  // Pre-audit questions (Q1-Q15)
  if (PRE_AUDIT_POINTS[questionCode]) {
    const normalizedSel = normalizeAnswer(value.selected);
    const pointsMap = PRE_AUDIT_POINTS[questionCode];
    if (pointsMap[normalizedSel] !== undefined) {
      rawPoints = pointsMap[normalizedSel];
    } else {
      for (const [key, val] of Object.entries(pointsMap)) {
        if (normalizedSel.includes(key) || key.includes(normalizedSel)) {
          rawPoints = val;
          break;
        }
      }
    }
  }

  // Q7: forbidden practices
  if (questionCode === "Q7") {
    const selected = Array.isArray(value.selected) ? value.selected : [value.selected];
    const practices = selected.filter((s) => !s.toLowerCase().includes("aucune"));
    rawPoints = practices.length * 2.0;
    if (practices.length > 0) {
      isCritical = true;
      alertMessage = `${practices.length} pratique(s) interdite(s) detectee(s). Amende max: 35M EUR ou 7% CA mondial.`;
    }
  }

  // Q8: high risk
  if (questionCode === "Q8") {
    const selected = Array.isArray(value.selected) ? value.selected : [value.selected];
    const hrDomains = selected.filter((s) => !s.toLowerCase().includes("aucun"));
    rawPoints = hrDomains.length * 1.0;
    if (hrDomains.length > 0) {
      alertMessage = `${hrDomains.length} domaine(s) haut risque identifie(s).`;
    }
  }

  // Diagnostic questions: assign dimension based on question code prefix
  if (questionCode.startsWith("Q-F-")) {
    const qNum = parseInt(questionCode.replace("Q-F-", ""), 10);
    if (qNum <= 9) dimension = "D1-F";
    else if (qNum <= 11) dimension = "D5-F";
    else if (qNum === 12) dimension = "D5-F";
    else if (qNum <= 14) dimension = "D7-F";
    else if (qNum <= 16) dimension = "D1-F";
    else if (qNum <= 19) dimension = "D2-F";
    else if (qNum <= 22) dimension = "D3-F";
    else if (qNum <= 25) dimension = "D4-F";
    else if (qNum <= 29) dimension = "D6-F";
    else if (qNum <= 32) dimension = "D5-F";
    else if (qNum === 33) dimension = "D2-F";
    else if (qNum === 34) dimension = "D1-F";
    else if (qNum === 35) dimension = "D3-F";
  }

  if (questionCode.startsWith("Q-D-")) {
    const qNum = parseInt(questionCode.replace("Q-D-", ""), 10);
    if (qNum <= 3) dimension = "D6-D";
    else if (qNum <= 7) dimension = "D1-D";
    else if (qNum === 8) dimension = "D6-D";
    else if (qNum <= 10) dimension = "D4-D";
    else if (qNum <= 13) dimension = "D3-D";
    else if (qNum === 14) dimension = "D2-D";
    else if (qNum <= 17) dimension = "D5-D";
    else if (qNum === 18) dimension = "D1-D";
    else dimension = "D7-D";
  }

  if (questionCode.startsWith("Q-I-")) {
    const qNum = parseInt(questionCode.replace("Q-I-", ""), 10);
    if (qNum <= 5) dimension = "D1-I";
    else if (qNum <= 10) dimension = "D2-I";
    else if (qNum <= 12) dimension = "D3-I";
    else if (qNum <= 16) dimension = "D4-I";
    else if (qNum <= 18) dimension = "D5-I";
    else dimension = "D6-I";
  }

  if (questionCode.startsWith("Q-R-")) {
    const qNum = parseInt(questionCode.replace("Q-R-", ""), 10);
    if (qNum <= 4) dimension = "D1-R";
    else if (qNum <= 6) dimension = "D2-R";
    else if (qNum <= 10) dimension = "D3-R";
    else if (qNum <= 12) dimension = "D4-R";
    else dimension = "D5-R";
  }

  // Forbidden practice check on diagnostic Art. 5 questions
  if (questionCode.startsWith("Q-INTERDIT-")) {
    const selected = Array.isArray(value.selected) ? value.selected : [value.selected];
    const sel = selected[0].toLowerCase();
    if (sel === "oui" || sel === "a" || sel === "yes") {
      rawPoints = 20;
      isCritical = true;
      alertMessage = `PRATIQUE INTERDITE DETECTEE. En vigueur depuis le 2 fevrier 2025. Amende: jusqu'a 35M EUR ou 7% CA mondial. ACTION IMMEDIATE REQUISE.`;
    } else if (sel === "nsp" || sel.includes("sais pas")) {
      rawPoints = 5;
      alertMessage = "Investigation urgente recommandee sur cette pratique.";
    }
  }

  return { rawPoints, dimension, isCritical, alertMessage };
}
