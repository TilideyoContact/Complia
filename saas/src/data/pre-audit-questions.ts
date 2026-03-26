import { type Question } from '@/types/question';

export const preAuditQuestions: Question[] = [
  // ── Q1 - Role detection ──
  {
    id: 'Q1',
    section: 1,
    order: 1,
    title: 'Quel est le rapport de votre entreprise avec l\'intelligence artificielle ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q1_A', label: 'Nous developpons ou entrainons des systemes d\'IA', value: 'FOURNISSEUR' },
      { id: 'Q1_B', label: 'Nous utilisons des outils integrant de l\'IA', value: 'DEPLOYEUR' },
      { id: 'Q1_C', label: 'Nous importons des solutions IA de l\'exterieur de l\'UE', value: 'IMPORTATEUR' },
      { id: 'Q1_D', label: 'Nous revendons ou distribuons des solutions IA', value: 'DISTRIBUTEUR' },
      { id: 'Q1_E', label: 'Je ne suis pas sur(e)', value: 'INDETERMINE' },
    ],
    scoringRules: [
      { optionValue: 'FOURNISSEUR', points: 0 },
      { optionValue: 'DEPLOYEUR', points: 0 },
      { optionValue: 'IMPORTATEUR', points: 0 },
      { optionValue: 'DISTRIBUTEUR', points: 0 },
      { optionValue: 'INDETERMINE', points: 0, flags: ['ROLE_INDETERMINE'] },
    ],
    helpText: 'Cette question determine votre role au sens du Reglement (UE) 2024/1689. Il conditionne vos obligations specifiques.',
  },

  // ── Q2 - Secteur ──
  {
    id: 'Q2',
    section: 1,
    order: 2,
    title: 'Dans quel secteur votre entreprise evolue-t-elle principalement ?',
    type: 'select',
    required: true,
    options: [
      { id: 'Q2_tech', label: 'Technologie / SaaS', value: 'tech_saas' },
      { id: 'Q2_finance', label: 'Finance / Assurance', value: 'finance' },
      { id: 'Q2_sante', label: 'Sante / MedTech', value: 'sante' },
      { id: 'Q2_rh', label: 'Ressources humaines', value: 'rh' },
      { id: 'Q2_education', label: 'Education / Formation', value: 'education' },
      { id: 'Q2_juridique', label: 'Juridique', value: 'juridique' },
      { id: 'Q2_commerce', label: 'Commerce / Retail', value: 'commerce' },
      { id: 'Q2_industrie', label: 'Industrie / Manufacturing', value: 'industrie' },
      { id: 'Q2_transport', label: 'Transport / Logistique', value: 'transport' },
      { id: 'Q2_energie', label: 'Energie', value: 'energie' },
      { id: 'Q2_immobilier', label: 'Immobilier', value: 'immobilier' },
      { id: 'Q2_media', label: 'Media / Communication', value: 'media' },
      { id: 'Q2_admin', label: 'Administration publique', value: 'administration' },
      { id: 'Q2_autre', label: 'Autre', value: 'autre' },
    ],
    scoringRules: [],
    helpText: 'Certains secteurs (finance, sante, RH, education, administration) sont soumis a des obligations renforcees.',
  },

  // ── Q3 - Taille ──
  {
    id: 'Q3',
    section: 1,
    order: 3,
    title: 'Combien de collaborateurs compte votre entreprise ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q3_tpe', label: 'Moins de 10 (TPE)', value: 'tpe' },
      { id: 'Q3_pme', label: '10 a 249 (PME)', value: 'pme' },
      { id: 'Q3_eti', label: '250 a 4 999 (ETI)', value: 'eti' },
      { id: 'Q3_ge', label: '5 000 et plus (Grand groupe)', value: 'ge' },
    ],
    scoringRules: [],
    helpText: 'La taille de votre entreprise influence le niveau d\'obligations et le calcul des sanctions.',
  },

  // ── Q4 - Perimetre geographique ──
  {
    id: 'Q4',
    section: 1,
    order: 4,
    title: 'Vos produits ou services touchent-ils des utilisateurs dans l\'Union europeenne ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q4_oui', label: 'Oui, exclusivement', value: 'oui_exclusivement' },
      { id: 'Q4_partie', label: 'Oui, en partie', value: 'oui_en_partie' },
      { id: 'Q4_non', label: 'Non, aucune activite dans l\'UE', value: 'non' },
      { id: 'Q4_nsp', label: 'Je ne suis pas certain(e)', value: 'nsp' },
    ],
    scoringRules: [
      { optionValue: 'oui_exclusivement', points: 0 },
      { optionValue: 'oui_en_partie', points: 0 },
      { optionValue: 'non', points: -1 },
      { optionValue: 'nsp', points: 0.5 },
    ],
    helpText: 'Le reglement a un effet extraterritorial : meme une entreprise hors UE peut etre concernee si ses systemes IA impactent des personnes dans l\'UE.',
  },

  // ── Q5 - Volume systemes IA ──
  {
    id: 'Q5',
    section: 1,
    order: 5,
    title: 'Combien de systemes ou outils integrant de l\'IA sont utilises dans votre organisation ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q5_aucun', label: 'Aucun a ma connaissance', value: 'aucun' },
      { id: 'Q5_1_2', label: '1 a 2', value: '1_2' },
      { id: 'Q5_3_5', label: '3 a 5', value: '3_5' },
      { id: 'Q5_6_10', label: '6 a 10', value: '6_10' },
      { id: 'Q5_10plus', label: 'Plus de 10', value: '10plus' },
      { id: 'Q5_nsp', label: 'Je ne sais pas', value: 'nsp' },
    ],
    scoringRules: [
      { optionValue: 'aucun', points: 0 },
      { optionValue: '1_2', points: 0.3 },
      { optionValue: '3_5', points: 0.5 },
      { optionValue: '6_10', points: 0.8 },
      { optionValue: '10plus', points: 1.0 },
      { optionValue: 'nsp', points: 0.7 },
    ],
    helpText: 'L\'absence d\'inventaire est en soi un facteur de risque au regard de l\'AI Act.',
  },

  // ── Q6 - Branching question by role ──
  {
    id: 'Q6',
    section: 2,
    order: 6,
    title: 'Question specifique a votre role',
    type: 'single',
    required: true,
    options: [],
    scoringRules: [],
    variants: {
      FOURNISSEUR: {
        title: 'Avez-vous mis en place un systeme de gestion des risques pour le cycle de vie de vos systemes d\'IA ?',
        options: [
          { id: 'Q6F_oui', label: 'Oui, formalise', value: 'oui' },
          { id: 'Q6F_encours', label: 'En cours de mise en place', value: 'en_cours' },
          { id: 'Q6F_non', label: 'Non', value: 'non' },
          { id: 'Q6F_nsp', label: 'Je ne comprends pas la question', value: 'nsp' },
        ],
        scoringRules: [
          { optionValue: 'oui', points: 0 },
          { optionValue: 'en_cours', points: 0.5 },
          { optionValue: 'non', points: 1.5, flags: ['FOURNISSEUR_NO_RISK_MGMT'] },
          { optionValue: 'nsp', points: 1.0 },
        ],
      },
      DEPLOYEUR: {
        title: 'Avez-vous verifie la documentation technique fournie par vos fournisseurs de solutions IA ?',
        options: [
          { id: 'Q6D_oui', label: 'Oui, pour tous nos outils', value: 'oui' },
          { id: 'Q6D_partiel', label: 'Partiellement', value: 'partiellement' },
          { id: 'Q6D_non', label: 'Non', value: 'non' },
          { id: 'Q6D_nsp', label: 'Je ne savais pas que c\'etait necessaire', value: 'nsp' },
        ],
        scoringRules: [
          { optionValue: 'oui', points: 0 },
          { optionValue: 'partiellement', points: 0.5 },
          { optionValue: 'non', points: 1.2 },
          { optionValue: 'nsp', points: 1.0 },
        ],
      },
      IMPORTATEUR: {
        title: 'Avez-vous verifie que les systemes IA que vous importez portent un marquage CE et disposent d\'une documentation de conformite ?',
        options: [
          { id: 'Q6I_oui', label: 'Oui, systematiquement', value: 'oui' },
          { id: 'Q6I_parfois', label: 'Parfois', value: 'parfois' },
          { id: 'Q6I_non', label: 'Non', value: 'non' },
          { id: 'Q6I_nsp', label: 'Je decouvre cette obligation', value: 'nsp' },
        ],
        scoringRules: [
          { optionValue: 'oui', points: 0 },
          { optionValue: 'parfois', points: 0.5 },
          { optionValue: 'non', points: 1.5 },
          { optionValue: 'nsp', points: 1.2 },
        ],
      },
      DISTRIBUTEUR: {
        title: 'Verifiez-vous que les solutions IA que vous distribuez sont conformes avant de les commercialiser ?',
        options: [
          { id: 'Q6R_oui', label: 'Oui, toujours', value: 'oui' },
          { id: 'Q6R_partiel', label: 'Partiellement', value: 'partiellement' },
          { id: 'Q6R_non', label: 'Non', value: 'non' },
          { id: 'Q6R_nsp', label: 'Je ne savais pas que c\'etait mon role', value: 'nsp' },
        ],
        scoringRules: [
          { optionValue: 'oui', points: 0 },
          { optionValue: 'partiellement', points: 0.5 },
          { optionValue: 'non', points: 1.0 },
          { optionValue: 'nsp', points: 0.8 },
        ],
      },
      INDETERMINE: {
        title: 'Votre entreprise a-t-elle deja identifie ses obligations legales en matiere d\'intelligence artificielle ?',
        options: [
          { id: 'Q6X_oui', label: 'Oui', value: 'oui' },
          { id: 'Q6X_partie', label: 'En partie', value: 'en_partie' },
          { id: 'Q6X_non', label: 'Non, pas du tout', value: 'non' },
          { id: 'Q6X_nsp', label: 'Je ne savais pas qu\'il y en avait', value: 'nsp' },
        ],
        scoringRules: [
          { optionValue: 'oui', points: 0 },
          { optionValue: 'en_partie', points: 0.5 },
          { optionValue: 'non', points: 1.2 },
          { optionValue: 'nsp', points: 1.5 },
        ],
      },
    },
  },

  // ── Q7 - Pratiques interdites (multi) ──
  {
    id: 'Q7',
    section: 2,
    order: 7,
    title: 'Utilisez-vous l\'IA pour l\'une de ces finalites ? (Cochez tout ce qui s\'applique)',
    type: 'multi',
    required: true,
    alertBanner: 'En vigueur depuis le 2 fevrier 2025. Amende max : 35M EUR ou 7% CA mondial.',
    options: [
      { id: 'Q7_A', label: 'Evaluer ou noter des individus sur la base de leur comportement social', value: 'scoring_social' },
      { id: 'Q7_B', label: 'Exploiter les vulnerabilites de personnes (age, handicap...) pour influencer leurs decisions', value: 'exploitation_vulnerabilites' },
      { id: 'Q7_C', label: 'Identifier des personnes par reconnaissance faciale en temps reel dans des espaces publics', value: 'reconnaissance_faciale' },
      { id: 'Q7_D', label: 'Deduire les emotions de collaborateurs sur le lieu de travail', value: 'inference_emotions' },
      { id: 'Q7_E', label: 'Classer des individus sur la base de donnees biometriques (origine, orientation...)', value: 'categorisation_biometrique' },
      { id: 'Q7_F', label: 'Aucune de ces pratiques', value: 'aucune' },
    ],
    scoringRules: [
      { optionValue: 'scoring_social', points: 2.0, flags: ['PRATIQUE_INTERDITE', 'CRITIQUE'] },
      { optionValue: 'exploitation_vulnerabilites', points: 2.0, flags: ['PRATIQUE_INTERDITE', 'CRITIQUE'] },
      { optionValue: 'reconnaissance_faciale', points: 2.0, flags: ['PRATIQUE_INTERDITE', 'CRITIQUE'] },
      { optionValue: 'inference_emotions', points: 2.0, flags: ['PRATIQUE_INTERDITE', 'CRITIQUE'] },
      { optionValue: 'categorisation_biometrique', points: 2.0, flags: ['PRATIQUE_INTERDITE', 'CRITIQUE'] },
      { optionValue: 'aucune', points: 0 },
    ],
    helpText: 'Ces pratiques sont interdites par l\'Article 5 du Reglement EU AI Act depuis fevrier 2025.',
  },

  // ── Q8 - Systemes haut risque (multi) ──
  {
    id: 'Q8',
    section: 2,
    order: 8,
    title: 'Vos systemes d\'IA interviennent-ils dans l\'un de ces domaines ? (Cochez tout ce qui s\'applique)',
    type: 'multi',
    required: true,
    options: [
      { id: 'Q8_A', label: 'Recrutement, evaluation ou gestion des employes', value: 'rh_recrutement' },
      { id: 'Q8_B', label: 'Notation ou scoring de clients (credit, assurance...)', value: 'scoring_credit' },
      { id: 'Q8_C', label: 'Acces a des services essentiels (energie, logement, prestations sociales...)', value: 'services_essentiels' },
      { id: 'Q8_D', label: 'Education, notation ou orientation d\'etudiants', value: 'education' },
      { id: 'Q8_E', label: 'Identification biometrique de personnes', value: 'biometrie' },
      { id: 'Q8_F', label: 'Surveillance video ou securite dans des espaces publics', value: 'surveillance' },
      { id: 'Q8_G', label: 'Aucun de ces domaines', value: 'aucun' },
    ],
    scoringRules: [
      { optionValue: 'rh_recrutement', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'scoring_credit', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'services_essentiels', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'education', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'biometrie', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'surveillance', points: 1.0, flags: ['HAUT_RISQUE'] },
      { optionValue: 'aucun', points: 0 },
    ],
    helpText: 'Les systemes classes "haut risque" sont soumis a des obligations renforcees a partir du 2 aout 2026.',
  },

  // ── Q9 - Transparence ──
  {
    id: 'Q9',
    section: 2,
    order: 9,
    title: 'Les personnes qui interagissent avec vos systemes d\'IA savent-elles qu\'elles ont affaire a une IA ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q9_oui', label: 'Oui, nous les informons systematiquement', value: 'oui' },
      { id: 'Q9_parfois', label: 'Pas toujours', value: 'pas_toujours' },
      { id: 'Q9_non', label: 'Non', value: 'non' },
      { id: 'Q9_na', label: 'La question ne s\'applique pas a notre cas', value: 'na' },
    ],
    scoringRules: [
      { optionValue: 'oui', points: 0 },
      { optionValue: 'pas_toujours', points: 0.5 },
      { optionValue: 'non', points: 1.0, flags: ['TRANSPARENCE_MANQUANTE'] },
      { optionValue: 'na', points: 0 },
    ],
    helpText: 'L\'obligation de transparence (Art. 50) est applicable a tous les roles.',
  },

  // ── Q10 - Surveillance humaine ──
  {
    id: 'Q10',
    section: 2,
    order: 10,
    title: 'Un humain peut-il intervenir ou corriger les decisions prises par vos systemes d\'IA ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q10_oui', label: 'Oui, toujours', value: 'oui' },
      { id: 'Q10_parfois', label: 'Dans certains cas seulement', value: 'certains_cas' },
      { id: 'Q10_non', label: 'Non, les decisions sont entierement automatisees', value: 'non' },
      { id: 'Q10_nsp', label: 'Je ne sais pas', value: 'nsp' },
    ],
    scoringRules: [
      { optionValue: 'oui', points: 0 },
      { optionValue: 'certains_cas', points: 0.5 },
      { optionValue: 'non', points: 1.2, flags: ['SURVEILLANCE_MANQUANTE'] },
      { optionValue: 'nsp', points: 0.8 },
    ],
    helpText: 'La surveillance humaine est une obligation renforcee pour les systemes haut risque (Art. 14).',
  },

  // ── Q11 - Formation ──
  {
    id: 'Q11',
    section: 3,
    order: 11,
    title: 'Vos equipes ont-elles ete formees a l\'utilisation responsable des outils d\'IA qu\'elles manipulent ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q11_oui', label: 'Oui, formation realisee', value: 'oui' },
      { id: 'Q11_prevue', label: 'Formation prevue mais pas encore realisee', value: 'prevue' },
      { id: 'Q11_non', label: 'Non, aucune formation', value: 'non' },
      { id: 'Q11_pas_identifie', label: 'Nous n\'avons pas identifie ce besoin', value: 'pas_identifie' },
    ],
    scoringRules: [
      { optionValue: 'oui', points: 0 },
      { optionValue: 'prevue', points: 0.3 },
      { optionValue: 'non', points: 0.8, flags: ['FORMATION_MANQUANTE'] },
      { optionValue: 'pas_identifie', points: 1.0, flags: ['FORMATION_MANQUANTE'] },
    ],
    helpText: 'L\'obligation de maitrise de l\'IA (Art. 4) est applicable a tous les operateurs depuis fevrier 2025.',
  },

  // ── Q12 - Donnees personnelles RGPD ──
  {
    id: 'Q12',
    section: 3,
    order: 12,
    title: 'Vos systemes d\'IA traitent-ils des donnees personnelles (noms, images, donnees RH, donnees clients...) ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q12_oui', label: 'Oui', value: 'oui' },
      { id: 'Q12_prob', label: 'Probablement', value: 'probablement' },
      { id: 'Q12_non', label: 'Non', value: 'non' },
      { id: 'Q12_nsp', label: 'Je ne sais pas', value: 'nsp' },
    ],
    scoringRules: [
      { optionValue: 'oui', points: 0.3, flags: ['RGPD'] },
      { optionValue: 'probablement', points: 0.3, flags: ['RGPD'] },
      { optionValue: 'non', points: 0 },
      { optionValue: 'nsp', points: 0.3 },
    ],
    helpText: 'L\'AI Act s\'articule avec le RGPD (Art. 2(7)). La double conformite est exigee.',
  },

  // ── Q13 - IA generative ──
  {
    id: 'Q13',
    section: 3,
    order: 13,
    title: 'Utilisez-vous des outils d\'IA generative (chatbots, generateurs d\'images, assistants de redaction...) ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q13_intensive', label: 'Oui, de maniere intensive', value: 'intensive' },
      { id: 'Q13_occasionnel', label: 'Oui, occasionnellement', value: 'occasionnel' },
      { id: 'Q13_non', label: 'Non', value: 'non' },
      { id: 'Q13_projet', label: 'En projet', value: 'en_projet' },
    ],
    scoringRules: [
      { optionValue: 'intensive', points: 0.5, flags: ['IA_GENERATIVE'] },
      { optionValue: 'occasionnel', points: 0.3, flags: ['IA_GENERATIVE'] },
      { optionValue: 'non', points: 0 },
      { optionValue: 'en_projet', points: 0.2 },
    ],
    helpText: 'L\'IA generative impose des obligations de transparence et de marquage des contenus (Art. 50(2)).',
  },

  // ── Q14 - Preparation ──
  {
    id: 'Q14',
    section: 3,
    order: 14,
    title: 'Avez-vous deja engage des demarches de mise en conformite avec l\'AI Act ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q14_audit', label: 'Oui, un audit complet a ete realise', value: 'audit_complet' },
      { id: 'Q14_commence', label: 'Nous avons commence a nous renseigner', value: 'commence' },
      { id: 'Q14_rien', label: 'Non, nous n\'avons rien initie', value: 'rien_initie' },
      { id: 'Q14_inconnue', label: 'Nous ne connaissions pas cette reglementation', value: 'inconnue' },
    ],
    scoringRules: [
      { optionValue: 'audit_complet', points: -0.5 },
      { optionValue: 'commence', points: 0 },
      { optionValue: 'rien_initie', points: 0.8, flags: ['AUCUNE_DEMARCHE'] },
      { optionValue: 'inconnue', points: 1.0, flags: ['AUCUNE_DEMARCHE'] },
    ],
    helpText: 'Plusieurs obligations de l\'AI Act sont deja en vigueur depuis fevrier 2025.',
  },

  // ── Q15 - Urgence ──
  {
    id: 'Q15',
    section: 3,
    order: 15,
    title: 'Quelle est votre echeance pour etre en conformite ?',
    type: 'single',
    required: true,
    options: [
      { id: 'Q15_aout2026', label: 'Avant aout 2026 (echeance systemes haut risque)', value: 'avant_aout_2026' },
      { id: 'Q15_fin2026', label: 'D\'ici fin 2026', value: 'fin_2026' },
      { id: 'Q15_2027', label: 'En 2027', value: '2027' },
      { id: 'Q15_pas_cal', label: 'Nous n\'avons pas de calendrier defini', value: 'pas_de_calendrier' },
    ],
    scoringRules: [
      { optionValue: 'avant_aout_2026', points: 0 },
      { optionValue: 'fin_2026', points: 0.2 },
      { optionValue: '2027', points: 0.3 },
      { optionValue: 'pas_de_calendrier', points: 0.5, flags: ['PAS_DE_CALENDRIER'] },
    ],
    helpText: 'L\'echeance d\'aout 2026 concerne les systemes haut risque. Les pratiques interdites sont deja en vigueur.',
  },
];
