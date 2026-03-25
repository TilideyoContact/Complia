# COMPLIA v3.0 — Workflow Complet du Questionnaire AI Act
## Diagramme de parcours par type de déclarant, branches conditionnelles et niveaux de risque

---

## Architecture globale

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LANDING / HERO                                  │
│                                                                         │
│  ⚖️ COMPLIA — Auto-diagnostic conformité AI Act                        │
│                                                                         │
│  ┌──────────┐  ┌────────────────┐  ┌──────────┐                        │
│  │  35M€    │  │ ██ jours       │  │  ~5 min  │                        │
│  │  amende  │  │ restants 🔴    │  │  durée   │                        │
│  │  max     │  │ (countdown     │  │          │                        │
│  └──────────┘  │  dynamique)    │  └──────────┘                        │
│                └────────────────┘                                       │
│                                                                         │
│  Social proof: "127 entreprises diagnostiquées"                         │
│  Trust: "Basé sur 180+ articles du Règl. (UE) 2024/1689"              │
│                                                                         │
│  [ 🌙 Dark mode toggle ]    [ Commencer le diagnostic → ]              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────┐               │
│  │ localStorage check → "Diagnostic en cours repris"    │               │
│  │ [ Reprendre ] [ Recommencer ]                        │               │
│  └──────────────────────────────────────────────────────┘               │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 1 — Identification de l'entreprise (Q1-Q5)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 01 — IDENTIFICATION                                            │
│  Commune à TOUS les déclarants                                          │
│  ─────────────────────────────                                          │
│                                                                         │
│  Q1  Raison sociale ──────────────────────────── [texte libre]          │
│                                                                         │
│  Q2  Secteur d'activité ─────────────────────── [select 14 options]     │
│       │                                                                 │
│       ├─ finance ──────────────→ Multiplicateur risque ×1.15            │
│       ├─ sante ────────────────→ Multiplicateur risque ×1.15            │
│       ├─ rh ──────────────────→ Multiplicateur risque ×1.15             │
│       ├─ education ───────────→ Multiplicateur risque ×1.15             │
│       ├─ administration ──────→ Multiplicateur risque ×1.15             │
│       └─ autre secteur ──────→ Pas de majoration                       │
│                                                                         │
│  Q3  Taille de l'entreprise ─────────────────── [radio cards]           │
│       │                                                                 │
│       ├─ TPE (< 10) ─────────→ Pas de majoration                      │
│       ├─ PME (10-249) ───────→ Pas de majoration                      │
│       ├─ ETI (250-4999) ─────→ Multiplicateur ×1.05                    │
│       └─ GE (5000+) ─────────→ Multiplicateur ×1.10                   │
│                                                                         │
│  Q4  Chiffre d'affaires ────────────────────── [select 5 tranches]     │
│       → Sert au calcul du plafond de sanction (% CA vs montant fixe)   │
│                                                                         │
│  Q5  Opérations dans l'UE ? ────────────────── [radio: Oui/Non/Part.]  │
│       │                                                                 │
│       ├─ Non ──────→ ⚠️ Hors périmètre AI Act potentiel               │
│       └─ Oui/Part. → AI Act applicable → Continue                     │
│                                                                         │
│  [Continuer →]                                                          │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 2 — Rôle au regard de l'AI Act (Q6-Q10)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 02 — DÉTERMINATION DU RÔLE                                     │
│  ═══════════════════════════════════                                     │
│  🔀 POINT DE BRANCHEMENT PRINCIPAL                                      │
│  ═══════════════════════════════════                                     │
│                                                                         │
│  Q6  Développez-vous / entraînez-vous des systèmes IA ? ── Art. 3(3)   │
│       ├─ OUI ──→ 🏷️ FOURNISSEUR détecté                               │
│       ├─ NON                                                            │
│       └─ Ne sais pas ──→ ⚠️ Investigation recommandée                  │
│                                                                         │
│  Q7  Mise sur le marché sous votre marque ? ──────────── Art. 3(4)     │
│       └─ OUI ──→ 🏷️ FOURNISSEUR détecté                               │
│                                                                         │
│  Q8  Utilisez-vous des systèmes IA ? ────────────────── Art. 3(4)     │
│       ├─ OUI ──→ 🏷️ DÉPLOYEUR détecté                                 │
│       └─ Ne sais pas ──→ 🏷️ DÉPLOYEUR (potentiel)                     │
│                                                                         │
│  Q9  Importez-vous des systèmes IA hors UE ? ───────── Art. 3(6)      │
│       └─ OUI ──→ 🏷️ IMPORTATEUR détecté                               │
│                                                                         │
│  Q10 Distribuez-vous sans modifier ? ────────────────── Art. 3(7)      │
│       └─ OUI ──→ 🏷️ DISTRIBUTEUR détecté                              │
│                                                                         │
│  ⚠️  CUMUL POSSIBLE : une entreprise peut avoir 2+ rôles               │
│  📌 Résultat stocké → active le branching conditionnel                  │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
              ┌────────────┼─────────────────────────────┐
              │            │                             │
              ▼            ▼                             ▼
     ┌────────────┐  ┌──────────┐              ┌──────────────┐
     │FOURNISSEUR │  │DÉPLOYEUR │              │ IMPORTATEUR/ │
     │ détecté    │  │ détecté  │              │ DISTRIBUTEUR │
     └─────┬──────┘  └────┬─────┘              └──────┬───────┘
           │              │                           │
           ▼              │                           │
  ┌────────────────┐      │                           │
  │ SECTION 2b     │      │                           │
  │ s'affiche      │      │                           │
  └────────┬───────┘      │                           │
           │              │                           │
           └──────────────┴───────────────────────────┘
                           │
                           ▼
```

---

## Section 2b — Fournisseur Avancé (Q11-Q15) — CONDITIONNELLE

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 2b — FOURNISSEUR AVANCÉ (CONDITIONNELLE)                       │
│  🟡 Visible UNIQUEMENT si Q6=OUI ou Q7=OUI                             │
│  ─────────────────────────────────────────────                          │
│                                                                         │
│  Q11 Système de gestion des risques couvrant                            │
│      le cycle de vie complet ? ──────────────────── Art. 9(1)          │
│       ├─ OUI ──→ ✅ Conforme                                            │
│       ├─ Partiel ──→ 🟡 (+3 pts risque)                                │
│       └─ NON ──→ 🔴 Non conforme (+6 pts)                              │
│                                                                         │
│  Q12 Notice d'utilisation avec caractéristiques                         │
│      de performance et niveaux de précision ? ────── Art. 13(1)        │
│       ├─ OUI ──→ ✅                                                     │
│       ├─ Partiel ──→ 🟡 (+2 pts)                                       │
│       └─ NON ──→ 🔴 (+5 pts)                                           │
│                                                                         │
│  Q13 QMS (système de gestion de la qualité)                             │
│      documenté ? ───────────────────────────────── Art. 17(1)          │
│       ├─ OUI ──→ ✅                                                     │
│       ├─ En cours ──→ 🟡 (+2 pts)                                      │
│       └─ NON ──→ 🔴 (+5 pts)                                           │
│                                                                         │
│  Q14 Surveillance post-marché                                           │
│      proportionnée en place ? ──────────────────── Art. 72(1)          │
│       ├─ OUI ──→ ✅                                                     │
│       └─ NON ──→ 🔴 (+4 pts)                                           │
│                                                                         │
│  Q15 Mandataire désigné dans l'UE ? ────────────── Art. 3(5)          │
│       🟡 Visible UNIQUEMENT si Q5 ≠ "Oui" (opérations hors UE)        │
│       ├─ OUI ──→ ✅                                                     │
│       └─ NON ──→ 🔴 (+5 pts)                                           │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 3 — Inventaire des systèmes IA (Q16-Q20)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 03 — INVENTAIRE DES SYSTÈMES IA                                │
│  Commune à TOUS — Détermine la CLASSIFICATION DE RISQUE                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────┐           │
│  │ 📌 Profil sticky visible :                                │           │
│  │ "Rôle: [Déployeur] | Secteur: [Finance] | Taille: [ETI]" │           │
│  └───────────────────────────────────────────────────────────┘           │
│                                                                         │
│  Q16 Types de systèmes IA (sélection multiple) ──── Annexe III         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │              MATRICE DE CLASSIFICATION (Art. 6)                 │     │
│  │                                                                 │     │
│  │  HAUT RISQUE — Annexe III          RISQUE LIMITÉ — Art. 50     │     │
│  │  ┌────────────────────────┐        ┌────────────────────────┐  │     │
│  │  │ pt 1: Biométrie        │        │ • IA générative        │  │     │
│  │  │ pt 2: Infra critique   │        │ • Recommandation       │  │     │
│  │  │ pt 3: Éducation        │        └────────────────────────┘  │     │
│  │  │ pt 4: RH/Recrutement   │                                    │     │
│  │  │ pt 5: Scoring/Crédit   │        MINIMAL — Art. 6            │     │
│  │  │ pt 5: Services essent. │        ┌────────────────────────┐  │     │
│  │  │ pt 6: Justice/Police   │        │ • Autre IA             │  │     │
│  │  │ pt 7: Migration        │        └────────────────────────┘  │     │
│  │  │ pt 8: Démocratie       │                                    │     │
│  │  │ + Surveillance         │                                    │     │
│  │  │ + Diag. médical        │                                    │     │
│  │  │ + Véhicule autonome    │                                    │     │
│  │  └────────────────────────┘                                    │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  Q17 Nombre de systèmes IA distincts ──────── [select]                  │
│       ├─ >10 ──→ +8 pts risque                                         │
│       ├─ 6-10 ─→ +5 pts                                                │
│       ├─ 3-5 ──→ +3 pts                                                │
│       └─ NSP ──→ +6 pts ⚠️                                             │
│                                                                         │
│  Q18 Registre/inventaire existant ? ──────── Art. 26(1)                │
│                                                                         │
│  Q19 ═══ NOUVEAU v3 ═══                                                │
│      Dérogation Art. 6(3) : vos systèmes Annexe III ne posent          │
│      pas de risque significatif ? ──────────── Art. 6(3)               │
│       │                                                                 │
│       ├─ OUI ──→ Reclassification : Haut risque → Risque limité       │
│       │          + Obligation de documenter la dérogation               │
│       │          + Score haut risque divisé par 2                       │
│       ├─ NON ──→ Classification maintenue                              │
│       └─ NSP ──→ Classification maintenue par précaution               │
│                                                                         │
│  Q20 ═══ NOUVEAU v3 ═══                                                │
│      Systèmes IA intégrés dans des produits soumis à                    │
│      réglementation sectorielle ? ──────────── Annexe I                │
│       │                                                                 │
│       ├─ □ MedTech (MDR 2017/745)                                      │
│       ├─ □ Finance (DORA 2022/2554)                                    │
│       ├─ □ Aviation (2018/1139)                                        │
│       ├─ □ Automobiles (2019/2144)                                     │
│       └─ □ Aucune                                                       │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 4 — Pratiques d'IA interdites (Q21-Q28)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 04 — PRATIQUES INTERDITES                                      │
│  🔴 Badge: "En vigueur depuis fév. 2025"                                │
│  ⚠️ COMMUNE À TOUS — Art. 5(1)(a)-(h)                                  │
│  🚨 SANCTION MAX : 35M€ OU 7% CA MONDIAL                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  ⚠️ ALERTE : Ces pratiques sont interdites depuis le           │     │
│  │  2 février 2025. Amende max : 35M€ ou 7% du CA mondial.       │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  Pour CHAQUE question : OUI → +20 pts 🚨 | NSP → +5 pts ⚠️            │
│                                                                         │
│  Q21 Techniques subliminales/manipulatrices ──────── Art. 5(1)(a)      │
│  Q22 Exploitation vulnérabilités (âge, handicap) ─── Art. 5(1)(b)      │
│  Q23 Scoring social ─────────────────────────────── Art. 5(1)(c)       │
│  Q24 Police prédictive basée sur profilage ──────── Art. 5(1)(d)       │
│  Q25 Moissonnage facial internet/CCTV ──────────── Art. 5(1)(e)        │
│  Q26 Inférence émotions travail/éducation ──────── Art. 5(1)(f)        │
│  Q27 Catégorisation biométrique sensible ───────── Art. 5(1)(g)        │
│  Q28 Identification biométrique temps réel ─────── Art. 5(1)(h)        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  RÉSULTAT INTERMÉDIAIRE :                                       │     │
│  │  ≥1 "OUI"  → 🚨 PRATIQUE INTERDITE DÉTECTÉE                    │     │
│  │  ≥1 "NSP"  → ⚠️ INVESTIGATION NÉCESSAIRE                      │     │
│  │  Tout "NON" → ✅ AUCUNE PRATIQUE INTERDITE                     │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  💡 Floating badge en bas à droite : mise à jour du risque live        │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 5 — État de conformité actuelle (Q29-Q39)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 05 — CONFORMITÉ ACTUELLE                                       │
│  🟠 Badge: "Échéance : 2 août 2026"                                    │
│  🔀 BRANCHING CONDITIONNEL ACTIF                                        │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  TRONC COMMUN (tous rôles)                                              │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  Q29 Formation maîtrise IA des employés ──────── Art. 4                │
│       ├─ OUI ──→ ✅ (+0)                                                │
│       ├─ Partiel ──→ 🟡 (+2)                                           │
│       └─ NON ──→ 🔴 (+5)                                               │
│                                                                         │
│  Q30 Transparence vis-à-vis des utilisateurs ──── Art. 50(1)           │
│       └─ (même logique)                                                 │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  BRANCHE DÉPLOYEUR (data-role="deployeur")                              │
│  🟡 Masquée si l'utilisateur n'est PAS déployeur                       │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  Q31 Vérification docs fournisseurs ──────────── Art. 26(1)           │
│  Q32 Surveillance humaine ────────────────────── Art. 14 & 26(1)       │
│  Q33 Conservation logs ≥ 6 mois ─────────────── Art. 26(5)            │
│  Q34 FRIA réalisée ? ────────────────────────── Art. 27               │
│       │                                                                 │
│       └─ Pertinence conditionnelle :                                    │
│          ┌──────────────────────────────────────────────┐                │
│          │ Si systèmes HAUT RISQUE en Q16 :            │                │
│          │   → FRIA OBLIGATOIRE (+8 pts si absente)    │                │
│          │ Si aucun haut risque :                      │                │
│          │   → FRIA non requise                        │                │
│          └──────────────────────────────────────────────┘                │
│                                                                         │
│  Q35 Information travailleurs/CE ─────────────── Art. 26(7)            │
│  Q36 Information personnes sur décisions IA ──── Art. 26(11)           │
│                                                                         │
│  ══════════════════════════════════════════════════════════════════       │
│  COMMUN                                                                 │
│  ══════════════════════════════════════════════════════════════════       │
│                                                                         │
│  Q37 Responsable conformité IA désigné ?                                │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 6 — GPAI, Transparence & Conformité croisée (Q38-Q45)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 06 — GPAI & CONFORMITÉ CROISÉE                                 │
│  🔴 Badge: "En vigueur depuis août 2025"                                │
│                                                                         │
│  Q38 Utilisation modèles GPAI ? ──────────────── Art. 51-56            │
│       ├─ OUI ──→ Active Q39-Q41                                        │
│       └─ NON ──→ Skip vers Q42                                         │
│                                                                         │
│  Q39 Marquage contenu généré par IA ─────────── Art. 50(2)             │
│       (si Q38 = OUI)                                                    │
│                                                                         │
│  Q40 Deepfakes générés/diffusés ? ───────────── Art. 50(4)             │
│       ├─ OUI ──→ Obligation étiquetage (+6 pts si non marqué)           │
│       └─ NON ──→ OK                                                     │
│                                                                         │
│  Q41 Risque systémique > 10²⁵ FLOPs ? ──────── Art. 51                │
│       │  🟡 data-role="fournisseur" — masquée si non-fournisseur       │
│       │                                                                 │
│       ├─ OUI ──→ 🔴 +10 pts + 4 obligations renforcées :               │
│       │          ├─ Tests contradictoires (Art. 55(1)(a))               │
│       │          ├─ Évaluation risques systémiques (Art. 55(1)(b))      │
│       │          ├─ Signalement incidents (Art. 55(1)(c))               │
│       │          └─ Cybersécurité (Art. 55(1)(d))                       │
│       ├─ NON ──→ Obligations GPAI standard (Art. 53)                    │
│       └─ Non concerné ──→ Skip                                         │
│                                                                         │
│  ═══ NOUVEAU v3 : CONFORMITÉ CROISÉE ═══                               │
│                                                                         │
│  Q42 Plateforme avec IA pour recommandation contenu ? ── DSA           │
│       ├─ OUI ──→ Obligation transparence recommandation                │
│       │          (Art. 27 DSA — Règl. 2022/2065)                       │
│       └─ NON ──→ Skip                                                   │
│                                                                         │
│  Q43 Réglementation sectorielle applicable ? ──── Annexe I             │
│       ├─ □ MedTech (MDR 2017/745) → +4 pts, obligation conformité     │
│       ├─ □ Finance (DORA 2022/2554) → +3 pts                          │
│       ├─ □ Aviation (2018/1139) → +3 pts                               │
│       ├─ □ Automobiles (2019/2144) → +3 pts                           │
│       └─ □ Aucune → pas d'impact                                       │
│                                                                         │
│  [← Retour]  [Continuer →]                                             │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Section 7 — Données personnelles & Finalisation (Q44-Q47)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION 07 — RGPD & FINALISATION                                       │
│                                                                         │
│  Q44 Traitement données personnelles ? ──────── RGPD (2016/679)        │
│       ├─ OUI ──→ Active Q45                                            │
│       └─ NON ──→ Skip Q45                                               │
│                                                                         │
│  Q45 Conformité RGPD ? ─────────────────────── Règl. 2016/679          │
│       ├─ NON ──→ 🔴 Double exposition AI Act + RGPD (+6 pts)           │
│       ├─ Partiel ──→ 🟡 (+3 pts)                                       │
│       └─ OUI ──→ ✅                                                     │
│                                                                         │
│  Q46 Connaissance AI Act avant ce questionnaire ?                       │
│       ├─ Oui, en détail                                                 │
│       ├─ Vaguement                                                      │
│       └─ Non                                                            │
│                                                                         │
│  [← Retour]  [ Obtenir mon diagnostic → ]                              │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Moteur de scoring

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     MOTEUR DE SCORING v3.0                               │
│              Calcul automatique du score /100                            │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │  FACTEURS DE RISQUE                              POINTS       │      │
│  │  ─────────────────────────────────────────────────────────    │      │
│  │                                                                │      │
│  │  RÔLE                                                          │      │
│  │    Fournisseur ─────────────────────────── +15               │      │
│  │    Importateur ─────────────────────────── +10               │      │
│  │    Déployeur ───────────────────────────── +8                │      │
│  │    Distributeur ────────────────────────── +3                │      │
│  │                                                                │      │
│  │  PRATIQUES INTERDITES (Art. 5)                                 │      │
│  │    Chaque "OUI" ────────────────────────── +20 🚨            │      │
│  │    Chaque "Ne sais pas" ────────────────── +5                │      │
│  │                                                                │      │
│  │  SYSTÈMES HAUT RISQUE (Annexe III)                             │      │
│  │    Chaque système HR ───────────────────── +6                │      │
│  │    (÷2 si dérogation Art. 6(3) invoquée)                      │      │
│  │                                                                │      │
│  │  VOLUME                                                        │      │
│  │    >10 systèmes ────────────────────────── +8                │      │
│  │    6-10 ────────────────────────────────── +5                │      │
│  │    3-5 ─────────────────────────────────── +3                │      │
│  │    "Ne sais pas" ───────────────────────── +6                │      │
│  │                                                                │      │
│  │  LACUNES CONFORMITÉ                                            │      │
│  │    Formation manquante ─────────────────── +5                │      │
│  │    Docs fournisseurs manquants ─────────── +5                │      │
│  │    Surveillance humaine manquante ──────── +6                │      │
│  │    Logs non conservés ──────────────────── +5                │      │
│  │    Transparence manquante ──────────────── +5                │      │
│  │    FRIA manquante + HR ─────────────────── +8                │      │
│  │    Travailleurs non informés ───────────── +5                │      │
│  │    Personnes non informées ─────────────── +5                │      │
│  │    Deepfakes non marqués ───────────────── +6                │      │
│  │    GPAI systémique ─────────────────────── +10               │      │
│  │    Marquage contenu IA manquant ────────── +4                │      │
│  │    Responsable conformité absent ───────── +3                │      │
│  │                                                                │      │
│  │  FOURNISSEUR (Section 2b)                                      │      │
│  │    Gestion risques manquante ───────────── +6                │      │
│  │    Notice utilisation manquante ────────── +5                │      │
│  │    QMS manquant ────────────────────────── +5                │      │
│  │    Post-marché manquant ────────────────── +4                │      │
│  │    Mandataire UE manquant ──────────────── +5                │      │
│  │                                                                │      │
│  │  CONFORMITÉ CROISÉE                                            │      │
│  │    Plateforme DSA ──────────────────────── +4                │      │
│  │    Réglementation sectorielle ──────────── +3-4/secteur      │      │
│  │    RGPD non conforme + données perso ───── +6                │      │
│  │                                                                │      │
│  │  MULTIPLICATEURS                                               │      │
│  │    Secteur sensible ────────────────────── ×1.15             │      │
│  │    Grande entreprise ───────────────────── ×1.10             │      │
│  │    ETI ─────────────────────────────────── ×1.05             │      │
│  │                                                                │      │
│  │  SCORE FINAL = min(100, score × multiplicateurs)              │      │
│  └────────────────────────────────────────────────────────────────┘      │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
```

---

## Page de résultats

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PAGE DE RÉSULTATS v3.0                                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │ 🛡️ Diagnostic basé sur 15 articles du Règl. (UE) 2024/1689    │     │
│  │    Dernière mise à jour : Mars 2026                             │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  ┌──────── TOUJOURS VISIBLE ────────┐                                   │
│  │                                   │                                  │
│  │  ┌───────────┐                    │                                  │
│  │  │   Score   │  Niveau de risque  │                                  │
│  │  │    /100   │  + Description     │                                  │
│  │  └───────────┘                    │                                  │
│  │                                   │                                  │
│  │  0-19  → 🟢 FAIBLE               │                                  │
│  │  20-44 → 🟡 MODÉRÉ               │                                  │
│  │  45-69 → 🟠 ÉLEVÉ                │                                  │
│  │  70+   → 🔴 CRITIQUE             │                                  │
│  └───────────────────────────────────┘                                  │
│                                                                         │
│  ┌──────── EMAIL GATE ────────┐                                         │
│  │                             │                                        │
│  │  "Pour accéder à votre     │                                        │
│  │   diagnostic détaillé :"   │                                        │
│  │                             │                                        │
│  │  Prénom: [___________]     │                                        │
│  │  Email:  [___________]     │                                        │
│  │  Tél:    [___________]     │                                        │
│  │                             │                                        │
│  │  [Accéder au diagnostic →] │                                        │
│  └──────────────┬──────────────┘                                        │
│                 │                                                       │
│                 ▼ (après soumission gate)                               │
│                                                                         │
│  ┌──────── DÉTAILS RÉVÉLÉS ────────┐                                    │
│  │                                  │                                   │
│  │  📋 Rôle(s) détecté(s)          │                                   │
│  │     Badges colorés par rôle      │                                   │
│  │                                  │                                   │
│  │  🚨 Alertes conditionnelles     │                                   │
│  │     • Pratiques interdites       │                                   │
│  │     • Systèmes haut risque       │                                   │
│  │     • Dérogation Art. 6(3)       │                                   │
│  │     • DSA / RGPD                 │                                   │
│  │     • Régl. sectorielle          │                                   │
│  │                                  │                                   │
│  │  📊 Classification systèmes     │                                   │
│  │     Chaque système avec badge    │                                   │
│  │     INTERDIT / HAUT / LIMITÉ     │                                   │
│  │                                  │                                   │
│  │  ✅ Obligations identifiées     │                                   │
│  │     Liste avec statut :          │                                   │
│  │     ✅ Conforme                  │                                   │
│  │     🟡 Partiel                   │                                   │
│  │     ❌ Manquant                  │                                   │
│  │                                  │                                   │
│  │  📅 Timeline réglementaire      │                                   │
│  │     Fév 2025 ✅ → Août 2025 ✅  │                                   │
│  │     → Août 2026 🔴 → Août 2027  │                                   │
│  │                                  │                                   │
│  │  ⚖️ Disclaimer dynamique        │                                   │
│  │     Articles applicables listés  │                                   │
│  │     + Régl. croisées             │                                   │
│  └──────────────────────────────────┘                                   │
│                                                                         │
│  ┌──────── SOCIAL PROOF ──────────┐                                     │
│  │  ★★★★★                         │                                    │
│  │  "Grâce à Complia, nous avons  │                                    │
│  │   identifié 3 systèmes à haut  │                                    │
│  │   risque non détectés."        │                                    │
│  │   — DSI, ETI secteur santé     │                                    │
│  └─────────────────────────────────┘                                    │
│                                                                         │
│  ┌──────── OFFRE PERSONNALISÉE ───────┐                                 │
│  │                                     │                                │
│  │  Score + Rôle → Recommandation :    │                                │
│  │                                     │                                │
│  │  <20 ──→ Veille (190€/mois)        │                                │
│  │  20-44 → Diagnostic Flash (990€)   │                                │
│  │  45-69 + Dépl. → Pack (3 990€) ⭐  │                                │
│  │  45-69 + Fourn. → Roadmap (6 990€) │                                │
│  │  70+ + Dépl. → Pack+ (6 990€)      │                                │
│  │  70+ + Fourn. → Conformité (35k€+) │                                │
│  │  Import. → Pack Import. (4 990€)   │                                │
│  │  Distrib. → Pack Distrib. (2 490€) │                                │
│  │                                     │                                │
│  │  ┌─────────────────────────────┐    │                                │
│  │  │ 🏆 RECOMMANDÉ POUR VOUS    │    │                                │
│  │  │ [Offre principale]         │    │                                │
│  │  │ [Prix]                     │    │                                │
│  │  └─────────────────────────────┘    │                                │
│  │                                     │                                │
│  │  Comparateur de prix :              │                                │
│  │  Avocats: 5-15k€ | Big4: 20-50k€  │                                │
│  │  Complia: à partir de 990€ 💙      │                                │
│  │                                     │                                │
│  │  [Réserver un appel (gratuit) →]    │                                │
│  │  → calendly.com/complia/decouverte  │                                │
│  │                                     │                                │
│  │  [Nous contacter par email]         │                                │
│  └─────────────────────────────────────┘                                │
│                                                                         │
│  [ 📄 Télécharger le diagnostic (PDF) ]                                 │
│                                                                         │
│  ┌──────── DISCLAIMER JURIDIQUE ──────┐                                 │
│  │  AVERTISSEMENT LÉGAL...             │                                │
│  │  Articles applicables : Art. X,Y,Z  │                                │
│  │  Dernière MAJ guidelines : Juil.25  │                                │
│  └─────────────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Fonctionnalités transversales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   FONCTIONNALITÉS TRANSVERSALES v3.0                     │
│                                                                         │
│  🔄 localStorage                                                        │
│     • Auto-save à chaque changement de réponse                          │
│     • Restauration automatique au rechargement                          │
│     • Bannière "Diagnostic en cours repris" + bouton Recommencer        │
│     • Nettoyage après soumission                                        │
│                                                                         │
│  📊 Floating Risk Badge                                                 │
│     • Position fixe bottom-right                                        │
│     • Mise à jour live à chaque réponse                                 │
│     • Couleurs : 🟢 Faible → 🟡 Modéré → 🟠 Élevé → 🔴 Critique      │
│     • Masqué sur la page de résultats                                   │
│                                                                         │
│  📌 Profil Sticky Sidebar                                               │
│     • Visible à partir de la Section 3                                  │
│     • Affiche : Rôle | Secteur | Taille                                │
│     • Mise à jour dynamique                                             │
│     • Masqué sur résultats                                              │
│                                                                         │
│  🌙 Dark Mode                                                          │
│     • Détection automatique prefers-color-scheme                        │
│     • Toggle dans le header                                             │
│     • Variables CSS dark theme                                          │
│     • Préférence sauvegardée localStorage                               │
│                                                                         │
│  💡 Tooltips                                                            │
│     • Termes : FRIA, GPAI, déployeur, fournisseur, Annexe III, QMS     │
│     • Desktop : hover                                                   │
│     • Mobile : tap                                                      │
│                                                                         │
│  📱 Mobile-first                                                        │
│     • Touch targets 56px minimum                                        │
│     • Grilles → colonne unique sous 640px                               │
│     • Boutons pleine largeur                                            │
│                                                                         │
│  ⏱️ Countdown dynamique                                                │
│     • Compte à rebours vers le 2 août 2026                              │
│     • Pulse rouge si < 180 jours                                        │
│     • Mise à jour toutes les 60 secondes                                │
│                                                                         │
│  📄 Export PDF                                                          │
│     • Bouton dans les résultats                                         │
│     • @media print : masque nav/footer/floating                         │
│     • Header Complia + disclaimer imprimés                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tableau récapitulatif des questions

| # | Question | Article | Section | Conditionnel |
|---|----------|---------|---------|-------------|
| Q1 | Raison sociale | — | S1 | Non |
| Q2 | Secteur d'activité | — | S1 | Non |
| Q3 | Taille entreprise | — | S1 | Non |
| Q4 | Chiffre d'affaires | — | S1 | Non |
| Q5 | Opérations UE | — | S1 | Non |
| Q6 | Développe/entraîne IA | Art. 3(3) | S2 | Non |
| Q7 | Mise sur le marché | Art. 3(4) | S2 | Non |
| Q8 | Utilise systèmes IA | Art. 3(4) | S2 | Non |
| Q9 | Importe IA hors UE | Art. 3(6) | S2 | Non |
| Q10 | Distribue sans modifier | Art. 3(7) | S2 | Non |
| Q11 | Gestion des risques cycle vie | Art. 9(1) | S2b | Fournisseur only |
| Q12 | Notice d'utilisation | Art. 13(1) | S2b | Fournisseur only |
| Q13 | QMS documenté | Art. 17(1) | S2b | Fournisseur only |
| Q14 | Surveillance post-marché | Art. 72(1) | S2b | Fournisseur only |
| Q15 | Mandataire UE | Art. 3(5) | S2b | Fournisseur + hors UE |
| Q16 | Types systèmes IA | Annexe III | S3 | Non |
| Q17 | Nombre systèmes IA | — | S3 | Non |
| Q18 | Registre existant | Art. 26(1) | S3 | Non |
| Q19 | Dérogation Art. 6(3) | Art. 6(3) | S3 | Non |
| Q20 | Réglementation sectorielle | Annexe I | S3 | Non |
| Q21 | Manipulation subliminale | Art. 5(1)(a) | S4 | Non |
| Q22 | Exploitation vulnérabilités | Art. 5(1)(b) | S4 | Non |
| Q23 | Scoring social | Art. 5(1)(c) | S4 | Non |
| Q24 | Police prédictive | Art. 5(1)(d) | S4 | Non |
| Q25 | Moissonnage facial | Art. 5(1)(e) | S4 | Non |
| Q26 | Inférence émotions | Art. 5(1)(f) | S4 | Non |
| Q27 | Catégorisation biométrique | Art. 5(1)(g) | S4 | Non |
| Q28 | Identification biométrique TR | Art. 5(1)(h) | S4 | Non |
| Q29 | Formation maîtrise IA | Art. 4 | S5 | Non |
| Q30 | Transparence utilisateurs | Art. 50(1) | S5 | Non |
| Q31 | Vérification docs fournisseurs | Art. 26(1) | S5 | Déployeur only |
| Q32 | Surveillance humaine | Art. 14, 26(1) | S5 | Déployeur only |
| Q33 | Conservation logs ≥ 6 mois | Art. 26(5) | S5 | Déployeur only |
| Q34 | FRIA réalisée | Art. 27 | S5 | Déployeur + HR |
| Q35 | Information travailleurs | Art. 26(7) | S5 | Déployeur only |
| Q36 | Information personnes décisions | Art. 26(11) | S5 | Déployeur only |
| Q37 | Responsable conformité IA | — | S5 | Non |
| Q38 | Utilisation modèles GPAI | Art. 51-56 | S6 | Non |
| Q39 | Marquage contenu IA | Art. 50(2) | S6 | Si Q38=OUI |
| Q40 | Deepfakes | Art. 50(4) | S6 | Non |
| Q41 | Risque systémique GPAI | Art. 51, 55 | S6 | Fournisseur only |
| Q42 | Plateforme DSA | Art. 27 DSA | S6 | Non |
| Q43 | Réglementation sectorielle | Annexe I | S6 | Non |
| Q44 | Données personnelles | RGPD 2016/679 | S7 | Non |
| Q45 | Conformité RGPD | Règl. 2016/679 | S7 | Si Q44=OUI |
| Q46 | Connaissance AI Act | — | S7 | Non |

**Total : 46 questions (dont ~10 conditionnelles selon le profil)**
**Parcours moyen Déployeur : ~35 questions**
**Parcours moyen Distributeur : ~25 questions**

---

## Articles et réglementations couverts

| Réglementation | Articles | Couverture |
|----------------|----------|------------|
| **AI Act (2024/1689)** | Art. 3, 4, 5, 6, 9, 13, 14, 17, 26, 27, 47-50, 51-56, 72, 99 | 15 articles |
| **RGPD (2016/679)** | Conformité traitements IA | Conformité croisée |
| **DSA (2022/2065)** | Art. 27 (recommandation) | Plateformes |
| **MDR (2017/745)** | Dispositifs médicaux | Sectoriel |
| **DORA (2022/2554)** | Résilience numérique finance | Sectoriel |
| **Règl. 2018/1139** | Aviation | Sectoriel |
| **Règl. 2019/2144** | Automobiles | Sectoriel |
| **Annexe I** | Législation sectorielle | Classification |
| **Annexe III** | 8 domaines haut risque | Classification |
| **Annexe IV** | Documentation technique | Fournisseurs |

---

*COMPLIA v3.0 — Mars 2026*
*Basé sur le Règlement (UE) 2024/1689 — Journal Officiel de l'Union Européenne*
