export type AlertSeverity = 'critique' | 'attention' | 'vigilance' | 'urgence' | 'info';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  reference: string;
  condition: (answers: Record<string, string | string[]>, flags: string[], score: number) => boolean;
}

export const alerts: Alert[] = [
  // ── Pratiques interdites (A1-A5) ──
  {
    id: 'A1',
    severity: 'critique',
    title: 'Pratique interdite -- Scoring social',
    message: 'Le scoring social est interdit depuis le 2 fevrier 2025. Les amendes atteignent 35 M EUR ou 7 % du CA mondial. Une mise en conformite immediate est indispensable.',
    reference: 'Art. 5(1)(c)',
    condition: (answers) => {
      const q7 = answers['Q7'];
      return Array.isArray(q7) && q7.includes('scoring_social');
    },
  },
  {
    id: 'A2',
    severity: 'critique',
    title: 'Pratique interdite -- Exploitation de vulnerabilites',
    message: 'L\'utilisation de l\'IA pour exploiter les vulnerabilites de personnes (age, handicap, situation sociale) est une pratique prohibee depuis fevrier 2025.',
    reference: 'Art. 5(1)(b)',
    condition: (answers) => {
      const q7 = answers['Q7'];
      return Array.isArray(q7) && q7.includes('exploitation_vulnerabilites');
    },
  },
  {
    id: 'A3',
    severity: 'critique',
    title: 'Pratique interdite -- Reconnaissance faciale',
    message: 'L\'identification biometrique en temps reel dans des espaces publics est interdite sauf exceptions strictement encadrees (autorite judiciaire).',
    reference: 'Art. 5(1)(h)',
    condition: (answers) => {
      const q7 = answers['Q7'];
      return Array.isArray(q7) && q7.includes('reconnaissance_faciale');
    },
  },
  {
    id: 'A4',
    severity: 'critique',
    title: 'Pratique interdite -- Inference des emotions',
    message: 'La detection des emotions sur le lieu de travail et dans les etablissements d\'enseignement est prohibee par l\'AI Act.',
    reference: 'Art. 5(1)(f)',
    condition: (answers) => {
      const q7 = answers['Q7'];
      return Array.isArray(q7) && q7.includes('inference_emotions');
    },
  },
  {
    id: 'A5',
    severity: 'critique',
    title: 'Pratique interdite -- Categorisation biometrique',
    message: 'La classification de personnes sur la base de donnees biometriques sensibles (origine ethnique, orientation sexuelle...) est interdite.',
    reference: 'Art. 5(1)(g)',
    condition: (answers) => {
      const q7 = answers['Q7'];
      return Array.isArray(q7) && q7.includes('categorisation_biometrique');
    },
  },

  // ── Systemes haut risque (A6-A11) ──
  {
    id: 'A6',
    severity: 'attention',
    title: 'Systeme haut risque -- RH / Recrutement',
    message: 'Les systemes d\'IA utilises pour le recrutement, l\'evaluation ou la gestion des employes sont classes "haut risque". Obligations renforcees applicables des aout 2026 : documentation technique, FRIA, surveillance humaine.',
    reference: 'Annexe III, pt 4',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('rh_recrutement');
    },
  },
  {
    id: 'A7',
    severity: 'attention',
    title: 'Systeme haut risque -- Scoring de credit',
    message: 'Le scoring de solvabilite et l\'evaluation de credit par IA sont des systemes "haut risque". La conformite a l\'Annexe III est exigee.',
    reference: 'Annexe III, pt 5',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('scoring_credit');
    },
  },
  {
    id: 'A8',
    severity: 'attention',
    title: 'Systeme haut risque -- Services essentiels',
    message: 'L\'IA intervenant dans l\'acces aux services essentiels est classee "haut risque". Une evaluation d\'impact (FRIA) est obligatoire pour les deployeurs.',
    reference: 'Annexe III, pt 5 ; Art. 27',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('services_essentiels');
    },
  },
  {
    id: 'A9',
    severity: 'attention',
    title: 'Systeme haut risque -- Education',
    message: 'Les systemes de notation, d\'orientation ou de surveillance dans l\'education sont "haut risque". Documentation et surveillance humaine obligatoires.',
    reference: 'Annexe III, pt 3',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('education');
    },
  },
  {
    id: 'A10',
    severity: 'attention',
    title: 'Systeme haut risque -- Biometrie',
    message: 'Les systemes d\'identification biometrique sont classes "haut risque". Des exigences strictes s\'appliquent en matiere de donnees, de transparence et de controle humain.',
    reference: 'Annexe III, pt 1',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('biometrie');
    },
  },
  {
    id: 'A11',
    severity: 'attention',
    title: 'Systeme haut risque -- Surveillance video',
    message: 'La surveillance video assistee par IA dans les espaces publics releve du haut risque. Vous etes soumis aux obligations de l\'Art. 6(1) et de l\'Annexe III.',
    reference: 'Art. 6(1)',
    condition: (answers) => {
      const q8 = answers['Q8'];
      return Array.isArray(q8) && q8.includes('surveillance');
    },
  },

  // ── Lacunes de conformite (A12-A14) ──
  {
    id: 'A12',
    severity: 'attention',
    title: 'Obligation non respectee -- Transparence',
    message: 'L\'AI Act impose d\'informer les personnes qu\'elles interagissent avec un systeme d\'IA. Cette obligation de transparence est deja en vigueur.',
    reference: 'Art. 50(1)',
    condition: (answers) => {
      return answers['Q9'] === 'non';
    },
  },
  {
    id: 'A13',
    severity: 'attention',
    title: 'Risque eleve -- Surveillance humaine',
    message: 'Pour les systemes haut risque, une supervision humaine effective est obligatoire. L\'absence totale de controle humain constitue un manquement majeur.',
    reference: 'Art. 14 ; Art. 26(1)',
    condition: (answers) => {
      const q10 = answers['Q10'];
      const q8 = answers['Q8'];
      const hasHighRisk = Array.isArray(q8) && q8.some(v => v !== 'aucun');
      return q10 === 'non' && hasHighRisk;
    },
  },
  {
    id: 'A14',
    severity: 'attention',
    title: 'Lacune detectee -- Formation',
    message: 'L\'AI Act exige que toute personne manipulant un systeme d\'IA dispose d\'un niveau suffisant de maitrise de l\'IA. La formation est une obligation legale.',
    reference: 'Art. 4',
    condition: (answers) => {
      const q11 = answers['Q11'];
      return q11 === 'non' || q11 === 'pas_identifie';
    },
  },

  // ── Alertes contextuelles (A15-A20) ──
  {
    id: 'A15',
    severity: 'vigilance',
    title: 'Point de vigilance -- Donnees personnelles',
    message: 'Vos systemes d\'IA traitent des donnees personnelles. L\'AI Act s\'articule avec le RGPD : vous devez garantir la conformite a ces deux reglements simultanement.',
    reference: 'Art. 2(7) ; RGPD 2016/679',
    condition: (answers) => {
      const q12 = answers['Q12'];
      return q12 === 'oui' || q12 === 'probablement';
    },
  },
  {
    id: 'A16',
    severity: 'vigilance',
    title: 'Obligation de transparence -- IA generative',
    message: 'L\'utilisation d\'IA generative (chatbots, generateurs de contenus) impose de marquer les contenus generes par IA et d\'en informer les utilisateurs.',
    reference: 'Art. 50(2)',
    condition: (answers) => {
      const q13 = answers['Q13'];
      return q13 === 'intensive' || q13 === 'occasionnel';
    },
  },
  {
    id: 'A17',
    severity: 'urgence',
    title: 'Urgence -- Aucune demarche engagee',
    message: 'Vous n\'avez engage aucune demarche de conformite alors que plusieurs obligations sont deja en vigueur et que l\'echeance d\'aout 2026 approche. Le risque d\'amende est reel.',
    reference: 'Art. 99 ; Art. 113',
    condition: (answers) => {
      const q14 = answers['Q14'];
      return q14 === 'rien_initie' || q14 === 'inconnue';
    },
  },
  {
    id: 'A18',
    severity: 'urgence',
    title: 'Alerte calendrier',
    message: 'Sans calendrier defini et avec un niveau de risque eleve, votre entreprise pourrait ne pas etre conforme avant l\'entree en application des obligations haut risque le 2 aout 2026.',
    reference: 'Art. 113(1)',
    condition: (answers, _flags, score) => {
      return answers['Q15'] === 'pas_de_calendrier' && score >= 6;
    },
  },
  {
    id: 'A19',
    severity: 'attention',
    title: 'Risque fournisseur',
    message: 'En tant que fournisseur de systemes d\'IA, l\'absence de systeme de gestion des risques vous expose a des obligations non remplies parmi les plus lourdes du reglement.',
    reference: 'Art. 9',
    condition: (answers) => {
      return answers['Q1'] === 'FOURNISSEUR' && (answers['Q6'] === 'non' || answers['Q6'] === 'nsp');
    },
  },
  {
    id: 'A20',
    severity: 'info',
    title: 'Role a clarifier',
    message: 'Vous n\'avez pas pu identifier votre role au sens de l\'AI Act. C\'est un signal : un diagnostic precis de votre position dans la chaine de valeur IA est necessaire pour determiner vos obligations exactes.',
    reference: 'Art. 3 (definitions)',
    condition: (answers) => {
      return answers['Q1'] === 'INDETERMINE';
    },
  },
];

/**
 * Select the most relevant alerts based on priority rules:
 * 1. Critiques (pratiques interdites) first, max 2
 * 2. Haut risque alerts next, max 2
 * 3. 1 contextual alert from the rest
 * Total: 3-5 alerts max
 */
export function selectAlerts(
  answers: Record<string, string | string[]>,
  flags: string[],
  score: number
): Alert[] {
  const triggered = alerts.filter(a => a.condition(answers, flags, score));

  const critiques = triggered.filter(a => a.severity === 'critique').slice(0, 2);
  const attentions = triggered.filter(a => a.severity === 'attention').slice(0, 2);
  const others = triggered.filter(a =>
    a.severity !== 'critique' && a.severity !== 'attention'
  ).slice(0, 1);

  return [...critiques, ...attentions, ...others].slice(0, 5);
}
