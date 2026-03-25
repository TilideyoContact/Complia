# COMPLIA — Workflow du Questionnaire AI Act
## Diagramme de parcours par type de déclarant et niveau de risque

---

## Vue d'ensemble du flux

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        POINT D'ENTRÉE                                   │
│                     Page d'accueil / Hero                                │
│              "Commencer le diagnostic" (CTA)                            │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 1 — IDENTIFICATION (Q1-Q5)                                     │
│  Commune à TOUS les déclarants                                          │
│                                                                         │
│  Q1  Raison sociale                                                     │
│  Q2  Secteur ──────────────────────────┐                                │
│       │                                │ Déclenche majorations :        │
│       ├─ finance/sante/rh/education ───┤ → Multiplicateur risque ×1.15  │
│       └─ autre secteur ───────────────→│ → Pas de majoration            │
│  Q3  Taille ───────────────────────────┐                                │
│       ├─ GE ──────────────────────────→│ → Multiplicateur ×1.10         │
│       ├─ ETI ─────────────────────────→│ → Multiplicateur ×1.05         │
│       └─ TPE/PME ─────────────────────→│ → Pas de majoration            │
│  Q4  Chiffre d'affaires                │ (calcul sanctions max)         │
│  Q5  Opérations UE ───────────────────┐│                                │
│       ├─ Non ─────────────────────────→│→ ⚠️ Hors périmètre potentiel  │
│       └─ Oui / Partiellement ─────────→│→ AI Act applicable             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 2 — DÉTERMINATION DU RÔLE (Q6-Q10)                            │
│  ═══════════════════════════════════════════                             │
│  POINT DE BRANCHEMENT PRINCIPAL                                         │
│  ═══════════════════════════════════════════                             │
│                                                                         │
│  Q6  Développez-vous des systèmes IA ?                                  │
│       └─ OUI ──→ 🏷️ RÔLE: FOURNISSEUR (Art. 3(3))                     │
│                                                                         │
│  Q7  Mettez-vous sur le marché sous votre marque ?                      │
│       └─ OUI ──→ 🏷️ RÔLE: FOURNISSEUR (Art. 3(4))                     │
│                                                                         │
│  Q8  Utilisez-vous des systèmes IA ?                                    │
│       └─ OUI / Ne sais pas ──→ 🏷️ RÔLE: DÉPLOYEUR (Art. 3(4))         │
│                                                                         │
│  Q9  Importez-vous des systèmes IA hors UE ?                            │
│       └─ OUI ──→ 🏷️ RÔLE: IMPORTATEUR (Art. 3(6))                     │
│                                                                         │
│  Q10 Distribuez-vous sans modifier ?                                    │
│       └─ OUI ──→ 🏷️ RÔLE: DISTRIBUTEUR (Art. 3(7))                    │
│                                                                         │
│  ⚠️  CUMUL POSSIBLE : une entreprise peut avoir plusieurs rôles         │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
              ┌────────────┼────────────┬──────────────┐
              ▼            ▼            ▼              ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │FOURNISSEUR│ │ DÉPLOYEUR│ │IMPORTATEUR│ │DISTRIBUTEUR│
        │ Art.3(3) │ │ Art.3(4) │ │ Art.3(6) │ │ Art.3(7) │
        │ 🔴 Élevé │ │ 🟡 Moyen │ │ 🟠 Élevé │ │ 🟢 Faible│
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │             │
             └────────────┴────────────┴─────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 3 — INVENTAIRE DES SYSTÈMES IA (Q11-Q13)                      │
│  Commune à TOUS — Détermine la CLASSIFICATION DE RISQUE                 │
│                                                                         │
│  Q11 Types de systèmes IA utilisés (sélection multiple)                 │
│                                                                         │
│  Chaque système sélectionné est classifié automatiquement :             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │              MATRICE DE CLASSIFICATION (Art. 6)                 │     │
│  │                                                                 │     │
│  │  RISQUE LIMITÉ (Art. 50)              HAUT RISQUE (Annexe III) │     │
│  │  ┌─────────────────────┐              ┌─────────────────────┐  │     │
│  │  │ • IA générative     │              │ • Biométrie (pt 1)  │  │     │
│  │  │ • Recommandation    │              │ • Infra critique(2) │  │     │
│  │  └─────────────────────┘              │ • Éducation (pt 3)  │  │     │
│  │                                       │ • RH/Recrutement(4) │  │     │
│  │  MINIMAL (Art. 6)                     │ • Scoring/Crédit(5) │  │     │
│  │  ┌─────────────────────┐              │ • Services ess. (5) │  │     │
│  │  │ • Autre IA          │              │ • Justice/Police(6) │  │     │
│  │  └─────────────────────┘              │ • Migration (pt 7)  │  │     │
│  │                                       │ • Démocratie (pt 8) │  │     │
│  │                                       │ • Surveillance      │  │     │
│  │                                       │ • Diag. médical     │  │     │
│  │                                       │ • Véhicule autonome │  │     │
│  │                                       └─────────────────────┘  │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  Q12 Nombre de systèmes IA ──→ Impact sur le score de risque           │
│  Q13 Registre existant ? ────→ Vérification obligation Art. 26(1)      │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 4 — PRATIQUES INTERDITES (Q14-Q21)                             │
│  Commune à TOUS — Art. 5(1)(a)-(h)                                      │
│  ⚠️  EN VIGUEUR DEPUIS LE 2 FÉVRIER 2025                                │
│  🚨 SANCTION MAX : 35M€ OU 7% CA MONDIAL                               │
│                                                                         │
│  Q14 Manipulation subliminale ──────────────── Art. 5(1)(a)             │
│       ├─ OUI ──→ 🔴 ALERTE CRITIQUE (+20 pts risque)                   │
│       ├─ NON ──→ ✅ OK                                                  │
│       └─ NSP ──→ ⚠️ À vérifier (+5 pts)                                │
│                                                                         │
│  Q15 Exploitation vulnérabilités ──────────── Art. 5(1)(b)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q16 Scoring social ──────────────────────── Art. 5(1)(c)              │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q17 Police prédictive / profilage ────────── Art. 5(1)(d)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q18 Moissonnage facial internet/CCTV ─────── Art. 5(1)(e)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q19 Inférence émotions travail/éducation ─── Art. 5(1)(f)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q20 Catégorisation biométrique sensible ──── Art. 5(1)(g)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  Q21 Identification biométrique temps réel ── Art. 5(1)(h)             │
│       └─ (même logique)                                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  RÉSULTAT INTERMÉDIAIRE :                                       │     │
│  │  Si ≥1 réponse "OUI" → 🚨 PRATIQUE POTENTIELLEMENT INTERDITE   │     │
│  │  Si ≥1 réponse "NSP" → ⚠️ INVESTIGATION NÉCESSAIRE             │     │
│  │  Si tout "NON"       → ✅ AUCUNE PRATIQUE INTERDITE DÉTECTÉE    │     │
│  └─────────────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 5 — CONFORMITÉ ACTUELLE (Q22-Q30)                              │
│  Questions adaptées selon le RÔLE détecté en Section 2                  │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  TRONC COMMUN (tous rôles)                                              │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  Q22 Formation maîtrise IA des employés ───── Art. 4                   │
│       ├─ OUI ──→ ✅ Conforme                                            │
│       ├─ Partiel ──→ 🟡 Lacune partielle (+2 pts)                      │
│       └─ NON ──→ 🔴 Non conforme (+5 pts)                              │
│                                                                         │
│  Q26 Transparence utilisateurs ────────────── Art. 50(1)               │
│       └─ (même logique)                                                 │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  BRANCHE DÉPLOYEUR (Art. 26)                                            │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  Q23 Vérification docs fournisseurs ──────── Art. 26(1)                │
│  Q24 Surveillance humaine ────────────────── Art. 14 & 26(1)           │
│  Q25 Conservation logs ≥ 6 mois ─────────── Art. 26(5)                 │
│  Q27 FRIA réalisée ? ────────────────────── Art. 27                    │
│       │                                                                 │
│       └─ Pertinence conditionnelle :                                    │
│          ┌──────────────────────────────────────────────┐                │
│          │ Si systèmes HAUT RISQUE détectés en Q11 :   │                │
│          │   → FRIA OBLIGATOIRE                        │                │
│          │ Si aucun système haut risque :               │                │
│          │   → FRIA non requise                        │                │
│          └──────────────────────────────────────────────┘                │
│                                                                         │
│  Q28 Information travailleurs/CE ─────────── Art. 26(7)                │
│  Q29 Information personnes sur décisions IA ─ Art. 26(11)              │
│  Q30 Responsable conformité IA désigné ?                                │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  BRANCHE FOURNISSEUR (obligations additionnelles détectées)             │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  → Pas de questions supplémentaires dans le questionnaire actuel        │
│  → Le RÉSULTAT affiche les obligations spécifiques :                    │
│     • QMS (Art. 17)           • Marquage CE (Art. 48)                   │
│     • Doc technique (Art. 11) • Enregistrement UE (Art. 49)             │
│     • Décl. conformité (Art. 47) • Surveillance post-marché (Art. 72)   │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  BRANCHE IMPORTATEUR (obligations additionnelles)                       │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  → Résultat affiche :                                                   │
│     • Vérification conformité fournisseur étranger (Art. 23)            │
│     • Vérification marquage CE et documentation (Art. 23(2))            │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 6 — GPAI & CONFORMITÉ CROISÉE (Q31-Q37)                       │
│                                                                         │
│  Q31 Utilisation modèles GPAI ? ─────────── Art. 51-56                 │
│       ├─ OUI ──→ Active les questions Q32-Q34                           │
│       └─ NON ──→ Skip vers Q35                                         │
│                                                                         │
│  Q32 Marquage contenu généré par IA ──────── Art. 50(2)                │
│       (si Q31 = OUI)                                                    │
│                                                                         │
│  Q33 Deepfakes générés/diffusés ? ────────── Art. 50(4)                │
│       ├─ OUI ──→ Obligation étiquetage (+6 pts si non marqué)           │
│       └─ NON ──→ OK                                                     │
│                                                                         │
│  Q34 Risque systémique > 10²⁵ FLOPs ? ───── Art. 51                   │
│       ├─ OUI ──→ 🔴 Obligations renforcées (+10 pts) :                 │
│       │          • Tests contradictoires (Art. 55(1)(a))                 │
│       │          • Évaluation risques systémiques (Art. 55(1)(b))        │
│       │          • Signalement incidents (Art. 55(1)(c))                 │
│       │          • Cybersécurité (Art. 55(1)(d))                         │
│       ├─ NON ──→ Obligations GPAI standard (Art. 53)                    │
│       └─ Non concerné ──→ Skip                                         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────       │
│  CONFORMITÉ CROISÉE (tous rôles)                                        │
│  ─────────────────────────────────────────────────────────────────       │
│                                                                         │
│  Q35 Traitement données personnelles ? ───── RGPD (2016/679)           │
│       ├─ OUI ──→ Active Q36                                             │
│       └─ NON ──→ Skip Q36                                               │
│                                                                         │
│  Q36 Conformité RGPD ? ──────────────────── Règl. 2016/679             │
│       ├─ NON ──→ 🔴 Double exposition AI Act + RGPD (+6 pts)           │
│       ├─ Partiel ──→ 🟡 (+3 pts)                                       │
│       └─ OUI ──→ ✅                                                     │
│                                                                         │
│  Q37 Connaissance AI Act + Email                                        │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     MOTEUR DE SCORING                                    │
│              Calcul automatique du score /100                            │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  PONDÉRATION DU SCORE                                          │      │
│  │                                                                │      │
│  │  Rôle détecté                                                  │      │
│  │    Fournisseur ────────────────────── +15 pts                  │      │
│  │    Importateur ────────────────────── +10 pts                  │      │
│  │    Déployeur ──────────────────────── +8 pts                   │      │
│  │    Distributeur ───────────────────── +3 pts                   │      │
│  │                                                                │      │
│  │  Pratiques interdites (Art. 5)                                 │      │
│  │    Chaque "OUI" ──────────────────── +20 pts 🚨               │      │
│  │    Chaque "Ne sais pas" ──────────── +5 pts                    │      │
│  │                                                                │      │
│  │  Systèmes haut risque (Annexe III)                             │      │
│  │    Chaque système HR ─────────────── +6 pts                    │      │
│  │                                                                │      │
│  │  Volume de systèmes                                            │      │
│  │    >10 systèmes ──────────────────── +8 pts                    │      │
│  │    6-10 ──────────────────────────── +5 pts                    │      │
│  │    3-5 ───────────────────────────── +3 pts                    │      │
│  │    "Ne sais pas" ─────────────────── +6 pts                    │      │
│  │                                                                │      │
│  │  Lacunes de conformité                                         │      │
│  │    Chaque obligation manquante ───── +3 à +8 pts               │      │
│  │    FRIA manquante + HR ───────────── +8 pts                    │      │
│  │    GPAI systémique ───────────────── +10 pts                   │      │
│  │                                                                │      │
│  │  Multiplicateurs                                               │      │
│  │    Secteur sensible ──────────────── ×1.15                     │      │
│  │    Grande entreprise ─────────────── ×1.10                     │      │
│  │    ETI ───────────────────────────── ×1.05                     │      │
│  └────────────────────────────────────────────────────────────────┘      │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PAGE DE RÉSULTATS                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  SCORE DE RISQUE /100                                           │     │
│  │                                                                 │     │
│  │  0-19  ──→ 🟢 FAIBLE    "Exposition limitée"                   │     │
│  │  20-44 ──→ 🟡 MODÉRÉ    "Axes d'amélioration identifiés"       │     │
│  │  45-69 ──→ 🟠 ÉLEVÉ     "Plan de conformité indispensable"     │     │
│  │  70-100──→ 🔴 CRITIQUE  "Action immédiate nécessaire"          │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  BLOCS AFFICHÉS                                                 │     │
│  │                                                                 │     │
│  │  1. Score animé + niveau de risque + description                │     │
│  │  2. Rôle(s) détecté(s) avec badges colorés                     │     │
│  │  3. Alertes conditionnelles :                                   │     │
│  │     🚨 Pratique interdite (si détectée)                         │     │
│  │     ⚠️ Systèmes haut risque (si détectés)                      │     │
│  │     ℹ️ Articulation RGPD (si données perso)                    │     │
│  │  4. Classification de chaque système IA                         │     │
│  │  5. Liste obligations avec statut ✅ 🟡 ❌                      │     │
│  │  6. Timeline réglementaire                                      │     │
│  │  7. CTA → Offres Complia personnalisées                        │     │
│  └─────────────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              RECOMMANDATION D'OFFRE COMPLIA                              │
│              (basée sur score + rôle + taille)                           │
│                                                                         │
│  Score 0-19                                                             │
│  └──→ Veille IA Simple (190€/mois)                                     │
│                                                                         │
│  Score 20-44                                                            │
│  └──→ Diagnostic Flash ⚡ (990€)                                       │
│                                                                         │
│  Score 45-69 + Déployeur                                                │
│  └──→ Pack Conformité Déployeur ⭐ (3 990€)                            │
│                                                                         │
│  Score 45-69 + Fournisseur                                              │
│  └──→ Roadmap Fournisseur (6 990€)                                     │
│                                                                         │
│  Score 70+ + Déployeur                                                  │
│  └──→ Pack Conformité Déployeur+ (6 990€)                              │
│       ou Diagnostic Stratégique urgent (2 490€)                         │
│                                                                         │
│  Score 70+ + Fournisseur                                                │
│  └──→ Conformité Fournisseur (à partir de 35 000€)                     │
│                                                                         │
│  Importateur (tout score)                                               │
│  └──→ Pack Importateur (4 990€)                                        │
│                                                                         │
│  Distributeur (tout score)                                              │
│  └──→ Pack Distributeur (2 490€)                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Légende

| Symbole | Signification |
|---------|---------------|
| 🔴 | Risque critique / Non conforme |
| 🟠 | Risque élevé |
| 🟡 | Risque modéré / Partiel |
| 🟢 | Risque faible / Conforme |
| 🚨 | Alerte pratique interdite |
| ⚠️ | Attention / Investigation requise |
| ✅ | Conforme |
| ──→ | Flux conditionnel |

## Articles du Règlement couverts

| Article | Objet | Section |
|---------|-------|---------|
| Art. 3 | Définitions (rôles) | S2 |
| Art. 4 | Maîtrise de l'IA | S5 |
| Art. 5(1)(a-h) | 8 pratiques interdites | S4 |
| Art. 6 | Classification haut risque | S3 |
| Art. 14 | Surveillance humaine | S5 |
| Art. 26 | Obligations déployeur (12 §) | S5 |
| Art. 27 | FRIA | S5 |
| Art. 50 | Transparence | S5, S6 |
| Art. 51-56 | GPAI / Risque systémique | S6 |
| Art. 99 | Sanctions | Résultats |
| Annexe III | 8 domaines haut risque | S3 |
| Règl. 2016/679 | RGPD | S6 |

---

*Document généré pour COMPLIA — Mars 2026*
*Basé sur le Règlement (UE) 2024/1689 — Journal Officiel*
