# COMPLIA -- Specifications Produit v1.0

**Document** : Architecture Produit & Specifications Fonctionnelles
**Version** : 1.0
**Date** : 26 mars 2026
**Auteur** : Equipe Produit Complia
**Base reglementaire** : Reglement (UE) 2024/1689 (EU AI Act)

---

## TABLE DES MATIERES

1. Sitemap complet
2. Parcours utilisateur principal
3. Specifications fonctionnelles par module
4. Regles de recommandation d'offres
5. Exigences techniques

---

## 1. SITEMAP COMPLET

```
complia.eu/
|
|-- / .................................................. Landing Page (publique)
|   |-- Hero + CTA "Commencer le diagnostic"
|   |-- Social proof, countdown, trust badges
|   `-- Footer (mentions legales, CGV, contact)
|
|-- /pre-audit ........................................ Pre-audit express (publique)
|   |-- /section/1 .................................... Identification entreprise
|   |-- /section/2 .................................... Role AI Act (branching)
|   |-- /section/2b ................................... Fournisseur avance (conditionnelle)
|   |-- /section/3 .................................... Inventaire systemes IA
|   |-- /section/4 .................................... Pratiques interdites (Art. 5)
|   |-- /section/5 .................................... Conformite actuelle (branching role)
|   |-- /section/6 .................................... GPAI & conformite croisee
|   `-- /section/7 .................................... RGPD & finalisation
|
|-- /resultats ........................................ Resultats & Score (publique, gate email)
|   |-- Score global /100 (toujours visible)
|   |-- [EMAIL GATE] .................................. Formulaire prenom + email + tel
|   |-- Details gated (apres soumission email)
|   |   |-- Roles detectes
|   |   |-- Alertes conditionnelles
|   |   |-- Classification systemes
|   |   |-- Obligations identifiees
|   |   |-- Timeline reglementaire
|   |   `-- Disclaimer dynamique
|   |-- Offre personnalisee (recommandation)
|   `-- CTA Calendly / Contact
|
|-- /rdv .............................................. Prise de RDV (publique, embed Calendly)
|   |-- /rdv/decouverte ............................... Consultation decouverte 20 min
|   `-- /rdv/diagnostic ............................... RDV diagnostic payant
|
|-- /offres ........................................... Catalogue offres (publique)
|   |-- /offres/diagnostic-flash ...................... 990 EUR HT
|   |-- /offres/diagnostic-strategique ................ 2 490 EUR HT
|   |-- /offres/diagnostic-premium .................... 6 490 EUR HT
|   |-- /offres/conformite-deployeur .................. 3 990 EUR HT
|   |-- /offres/conformite-deployeur-plus ............. 6 990 EUR HT
|   |-- /offres/conformite-groupe ..................... Sur devis
|   |-- /offres/roadmap-fournisseur ................... 6 990 EUR HT
|   |-- /offres/conformite-fournisseur ................ 35 000 EUR+ HT
|   |-- /offres/certification-ready ................... 45 000 - 70 000 EUR HT
|   |-- /offres/importateur ........................... 4 990 EUR HT
|   |-- /offres/distributeur .......................... 2 490 EUR HT
|   |-- /offres/compliance-officer .................... 890 EUR/mois
|   `-- /offres/veille ................................ 190 EUR/mois
|
|-- /blog ............................................. Blog / Ressources (publique)
|   `-- /blog/[slug] .................................. Article individuel
|
|-- /a-propos ......................................... Page "Qui sommes-nous" (publique)
|
|-- /mentions-legales ................................. Mentions legales (publique)
|
|-- /cgv .............................................. CGV (publique)
|
|-- /login ............................................ Connexion espace client (publique)
|
|-- /espace-client .................................... Espace client (authentifiee)
|   |-- /espace-client/dashboard ...................... Tableau de bord
|   |-- /espace-client/diagnostics .................... Historique diagnostics
|   |-- /espace-client/diagnostics/[id] ............... Detail diagnostic
|   |-- /espace-client/documents ...................... Documents & livrables
|   |-- /espace-client/factures ....................... Factures Stripe
|   |-- /espace-client/profil ......................... Profil entreprise
|   `-- /espace-client/veille ......................... Flux veille reglementaire
|
|-- /admin ............................................ Back-office admin (authentifiee, role admin)
|   |-- /admin/leads .................................. Gestion leads
|   |-- /admin/clients ................................ Gestion clients
|   |-- /admin/diagnostics ............................ Tous les diagnostics
|   |-- /admin/offres ................................. Configuration offres
|   |-- /admin/analytics .............................. Metriques & KPIs
|   `-- /admin/veille ................................. Publication veille
|
`-- /api .............................................. API Backend (interne)
    |-- /api/diagnostic/submit ........................ Soumission pre-audit
    |-- /api/diagnostic/score ......................... Calcul score
    |-- /api/leads .................................... CRUD leads
    |-- /api/auth ..................................... Authentification
    |-- /api/stripe/checkout .......................... Paiement Stripe
    |-- /api/stripe/webhook ........................... Webhooks Stripe
    |-- /api/resend ................................... Envoi emails
    `-- /api/calendly/webhook ......................... Webhooks Calendly
```

**Legende des types de pages :**

| Type | Description | Acces |
|------|-------------|-------|
| Publique | Accessible sans authentification | Tout visiteur |
| Authentifiee | Necessite un compte client | Client connecte |
| Conditionnelle | Affichage conditionne par le profil utilisateur (role IA detecte) | Logique metier |
| Admin | Restreinte au back-office | Administrateur |

---

## 2. PARCOURS UTILISATEUR PRINCIPAL

### 2.1 Vue d'ensemble du tunnel

```
VISITEUR ──> LANDING PAGE ──> PRE-AUDIT (5 min) ──> SCORE + ALERTE
                                                         |
                                                    [EMAIL GATE]
                                                         |
                                                         v
                                              DIAGNOSTIC DETAILLE
                                              + OFFRE PERSONNALISEE
                                                         |
                                              [CTA: RDV Calendly]
                                              [CTA: Acheter Pack]
                                                         |
                                                         v
                                              CONSULTATION DECOUVERTE
                                              (20 min, gratuit)
                                                         |
                                                         v
                                              DIAGNOSTIC PAYANT
                                              (990 / 2 490 / 6 490 EUR)
                                                         |
                                                         v
                                              RECOMMANDATION PACK
                                              CONFORMITE PAR ROLE
                                                         |
                                                         v
                                              ACHAT / SIGNATURE
                                              (Stripe Checkout)
                                                         |
                                                         v
                                              ESPACE CLIENT
                                              + RECURRENT (optionnel)
```

### 2.2 Etapes detaillees

| # | Etape | Page | Action utilisateur | CTA / Gate | Friction | Donnee capturee |
|---|-------|------|--------------------|------------|----------|-----------------|
| 1 | Arrivee | `/` | Decouvre Complia, voit le countdown, la social proof, les sanctions | "Commencer le diagnostic" | Aucune | -- |
| 2 | Section 1 : Identification | `/pre-audit` | Saisit raison sociale, secteur, taille, CA, operations UE | "Continuer" | Faible : 5 champs obligatoires | Profil entreprise |
| 3 | Section 2 : Role AI Act | `/pre-audit` | Repond aux 5 questions de determination de role | "Continuer" | Moyenne : necessite connaissance du role | Role(s) detecte(s) |
| 4 | Section 2b : Fournisseur (cond.) | `/pre-audit` | Questions avancees fournisseur (si Q6=OUI ou Q7=OUI) | "Continuer" | Elevee : questions techniques | Maturite fournisseur |
| 5 | Section 3 : Inventaire IA | `/pre-audit` | Selectionne les systemes IA utilises, nombre, registre | "Continuer" | Moyenne : inventaire requis | Systemes + classification |
| 6 | Section 4 : Pratiques interdites | `/pre-audit` | 8 questions OUI/NON/NSP sur Art. 5 | "Continuer" | Elevee : questions sensibles | Alertes Art. 5 |
| 7 | Section 5 : Conformite actuelle | `/pre-audit` | Questions sur obligations en cours (branching par role) | "Continuer" | Moyenne | Lacunes de conformite |
| 8 | Section 6 : GPAI & croise | `/pre-audit` | GPAI, deepfakes, DSA, reglementation sectorielle | "Continuer" | Faible a moyenne | Conformite croisee |
| 9 | Section 7 : RGPD & fin | `/pre-audit` | Donnees personnelles, RGPD, connaissance AI Act | "Obtenir mon diagnostic" | Faible | RGPD + qualification lead |
| 10 | Resultats : Score visible | `/resultats` | Voit le score /100 avec jauge animee + niveau de risque | -- | Aucune (teaser) | -- |
| 11 | **EMAIL GATE** | `/resultats` | Saisit prenom, email, telephone | "Acceder au diagnostic" | **GATE PRINCIPALE** | **Lead capture** |
| 12 | Resultats : Details | `/resultats` | Consulte roles, alertes, classification, obligations, timeline | "Reserver un appel" / "Telecharger PDF" | Aucune | -- |
| 13 | Offre personnalisee | `/resultats` | Voit l'offre recommandee selon score + role | "Reserver un appel gratuit" | Decision d'achat | Offre vue |
| 14 | Prise de RDV | `/rdv/decouverte` | Calendly embed, choisit un creneau | Confirmation Calendly | Faible | RDV planifie |
| 15 | Consultation decouverte | Hors plateforme | Call 20 min avec consultant | Proposition diagnostic payant | Commerciale | Qualification |
| 16 | Diagnostic payant | `/offres/*` | Choisit le niveau de diagnostic | Checkout Stripe | Prix | Paiement |
| 17 | Livraison diagnostic | `/espace-client` | Recoit rapport, call restitution | CTA pack conformite | Aucune | -- |
| 18 | Pack conformite | `/offres/*` | Choisit le pack par role | Checkout Stripe / Devis | Prix eleve | Paiement |
| 19 | Espace client | `/espace-client` | Suit l'avancement, consulte documents | -- | Aucune | -- |
| 20 | Recurrent | `/offres/compliance-officer` | Souscrit a la veille ou au Compliance Officer | Stripe abonnement | Engagement | Abonnement |

### 2.3 Points de branchement conditionnel

```
                    Section 2 : Determination du role
                                |
            +-------------------+-------------------+
            |                   |                   |
       FOURNISSEUR         DEPLOYEUR         IMPORTATEUR /
       (Q6=OUI ou         (Q8=OUI ou        DISTRIBUTEUR
        Q7=OUI)           Q8=NSP)           (Q9/Q10=OUI)
            |                   |                   |
            v                   |                   |
    Section 2b visible          |                   |
    (5 questions                |                   |
     fournisseur)               |                   |
            |                   |                   |
            +-------------------+-------------------+
                                |
                    Section 3 : Inventaire (commun)
                                |
                    Section 4 : Interdits (commun)
                                |
                    Section 5 : Conformite
                    +-- Tronc commun (Art. 4, Art. 50)
                    +-- Branche DEPLOYEUR (Q31-Q36, data-role="deployeur")
                    |   +-- FRIA obligatoire si systemes haut risque
                    +-- Commun (Q37)
                                |
                    Section 6 : GPAI
                    +-- Q38=OUI --> Q39-Q41 actives
                    +-- Q41 masquee si non-fournisseur
                                |
                    Section 7 : RGPD
                    +-- Q44=OUI --> Q45 active

    CUMUL POSSIBLE : une entreprise peut avoir 2+ roles simultanes.
```

---

## 3. SPECIFICATIONS FONCTIONNELLES PAR MODULE

### 3.1 Module : Landing Page (`/`)

| Element | Specification |
|---------|---------------|
| **Hero** | Titre : "Evaluez votre conformite a l'EU AI Act". Sous-titre explicatif. Badge "Reglement (UE) 2024/1689". |
| **Countdown** | Compte a rebours dynamique vers le 2 aout 2026. Pulse rouge si < 180 jours. MAJ toutes les 60s. |
| **Stats** | 3 cartes : "35M EUR amende max" / "[X] jours restants" / "~5 min duree" |
| **Social proof** | "127 entreprises diagnostiquees" (compteur dynamique via DB). Trust badges : donnees securisees, base juridique, resultat instantane. |
| **CTA principal** | Bouton "Commencer le diagnostic" --> `/pre-audit`. Taille large, couleur accent (#2563eb). |
| **Auto-save banner** | Si localStorage contient un diagnostic en cours : banniere "Diagnostic en cours repris" + bouton "Recommencer". |
| **Dark mode** | Toggle dans le header. Detection auto `prefers-color-scheme`. Sauvegarde localStorage. |
| **Responsive** | Mobile-first. Touch targets 56px min. Hero stack vertical sous 640px. |
| **SEO** | H1 unique. Meta description. Balises OG/Twitter. Schema.org LocalBusiness. |
| **Performance** | LCP < 2.5s. Fonts Inter preload. Images WebP/AVIF. |

### 3.2 Module : Pre-audit -- Questionnaire express 5 min (`/pre-audit`)

#### 3.2.1 Architecture generale

| Propriete | Valeur |
|-----------|--------|
| Nombre de sections | 7 (+ section 2b conditionnelle) |
| Nombre total de questions | 46 (dont ~10 conditionnelles) |
| Parcours moyen deployeur | ~35 questions |
| Parcours moyen distributeur | ~25 questions |
| Duree cible | 5 minutes |
| Sauvegarde | localStorage auto-save a chaque changement |
| Navigation | Lineaire avec retour, pas de skip |
| Validation | Par section, champs requis signales visuellement |

#### 3.2.2 Section 1 -- Identification (Q1-Q5)

| Question | Type | Options | Impact scoring |
|----------|------|---------|----------------|
| Q1 Raison sociale | Texte libre | -- | Aucun |
| Q2 Secteur d'activite | Select | 14 secteurs (tech_saas, finance, sante, rh, education, juridique, commerce, industrie, transport, energie, immobilier, media, administration, autre) | Multiplicateur x1.15 si finance/sante/rh/education/administration |
| Q3 Taille entreprise | Radio cards | TPE (<10), PME (10-249), ETI (250-4999), GE (5000+) | ETI: x1.05, GE: x1.10 |
| Q4 Chiffre d'affaires | Select | 5 tranches (<2M, 2-10M, 10-50M, 50-250M, >250M) | Calcul plafond sanction |
| Q5 Operations UE | Radio | Oui / Non / Partiellement | Non = alerte hors perimetre |

#### 3.2.3 Section 2 -- Role AI Act (Q6-Q10)

| Question | Type | Options | Role detecte |
|----------|------|---------|-------------|
| Q6 Developpe/entraine IA | Radio | Oui / Non / NSP | OUI --> FOURNISSEUR |
| Q7 Mise sur marche sous sa marque | Radio | Oui / Non | OUI --> FOURNISSEUR |
| Q8 Utilise systemes IA | Radio | Oui / Non / NSP | OUI/NSP --> DEPLOYEUR |
| Q9 Importe IA hors UE | Radio | Oui / Non | OUI --> IMPORTATEUR |
| Q10 Distribue sans modifier | Radio | Oui / Non | OUI --> DISTRIBUTEUR |

**Regle** : Cumul possible. Stockage dans state global pour branching.

#### 3.2.4 Section 2b -- Fournisseur avance (Q11-Q15, CONDITIONNELLE)

**Condition d'affichage** : Q6=OUI ou Q7=OUI

| Question | Type | Options | Points risque |
|----------|------|---------|---------------|
| Q11 Gestion risques cycle vie | Radio | Oui / Partiel / Non | 0 / +3 / +6 |
| Q12 Notice d'utilisation | Radio | Oui / Partiel / Non | 0 / +2 / +5 |
| Q13 QMS documente | Radio | Oui / En cours / Non | 0 / +2 / +5 |
| Q14 Surveillance post-marche | Radio | Oui / Non | 0 / +4 |
| Q15 Mandataire UE | Radio | Oui / Non | 0 / +5 |

**Q15** visible uniquement si Q5 != "Oui".

#### 3.2.5 Section 3 -- Inventaire systemes IA (Q16-Q20)

| Question | Type | Options | Impact |
|----------|------|---------|--------|
| Q16 Types systemes IA | Checkbox multiple | 15 categories (dont 12 haut risque Annexe III + 2 risque limite + 1 autre) | Chaque HR: +6 pts |
| Q17 Nombre systemes | Select | 1-2 / 3-5 / 6-10 / >10 / NSP | 0 / +3 / +5 / +8 / +6 |
| Q18 Registre existant | Radio | Oui / Non | Non: +5 |
| Q19 Derogation Art. 6(3) | Radio | Oui / Non / NSP | OUI: score HR divise par 2 |
| Q20 Regl. sectorielle | Checkbox | MedTech / Finance / Aviation / Auto / Aucune | +3-4 par secteur |

**Classification automatique des systemes (Q16)** :

| Categorie | Classification | Reference |
|-----------|---------------|-----------|
| Biometrie | HAUT RISQUE | Annexe III, pt 1 |
| Infrastructure critique | HAUT RISQUE | Annexe III, pt 2 |
| Education / Notation | HAUT RISQUE | Annexe III, pt 3 |
| RH / Recrutement | HAUT RISQUE | Annexe III, pt 4 |
| Scoring / Credit | HAUT RISQUE | Annexe III, pt 5 |
| Services essentiels | HAUT RISQUE | Annexe III, pt 5 |
| Justice / Police | HAUT RISQUE | Annexe III, pt 6 |
| Migration / Frontieres | HAUT RISQUE | Annexe III, pt 7 |
| Democratie | HAUT RISQUE | Annexe III, pt 8 |
| Surveillance / Video | HAUT RISQUE | Art. 6(1) |
| Diagnostic medical | HAUT RISQUE | Annexe I |
| Vehicule autonome | HAUT RISQUE | Annexe I |
| IA generative / Chatbots | RISQUE LIMITE | Art. 50 |
| Recommandation | RISQUE LIMITE | Art. 50 |
| Autre systeme IA | MINIMAL | Art. 6 |

#### 3.2.6 Section 4 -- Pratiques interdites (Q21-Q28)

**Alerte permanente** : "En vigueur depuis le 2 fevrier 2025. Amende max : 35M EUR ou 7% CA mondial."

| Question | Reference | Scoring |
|----------|-----------|---------|
| Q21 Techniques subliminales/manipulatrices | Art. 5(1)(a) | OUI: +20, NSP: +5 |
| Q22 Exploitation vulnerabilites | Art. 5(1)(b) | OUI: +20, NSP: +5 |
| Q23 Scoring social | Art. 5(1)(c) | OUI: +20, NSP: +5 |
| Q24 Police predictive profilage | Art. 5(1)(d) | OUI: +20, NSP: +5 |
| Q25 Moissonnage facial | Art. 5(1)(e) | OUI: +20, NSP: +5 |
| Q26 Inference emotions travail/education | Art. 5(1)(f) | OUI: +20, NSP: +5 |
| Q27 Categorisation biometrique sensible | Art. 5(1)(g) | OUI: +20, NSP: +5 |
| Q28 Identification biometrique TR | Art. 5(1)(h) | OUI: +20, NSP: +5 |

**Resultat intermediaire** : >= 1 OUI --> alerte critique. >= 1 NSP --> investigation recommandee.

#### 3.2.7 Section 5 -- Conformite actuelle (Q29-Q37)

| Question | Reference | Branching | Scoring |
|----------|-----------|-----------|---------|
| Q29 Formation maitrise IA | Art. 4 | Commun | NON: +5, Partiel: +2 |
| Q30 Transparence utilisateurs | Art. 50(1) | Commun | NON: +5, Partiel: +2 |
| Q31 Verification docs fournisseurs | Art. 26(1) | Deployeur only | NON: +5, Partiel: +2 |
| Q32 Surveillance humaine | Art. 14, 26(1) | Deployeur only | NON: +6, Partiel: +3 |
| Q33 Conservation logs >= 6 mois | Art. 26(5) | Deployeur only | NON: +5, NSP: +4 |
| Q34 FRIA realisee | Art. 27 | Deployeur + si systemes HR | NON + HR: +8 |
| Q35 Information travailleurs | Art. 26(7) | Deployeur only | NON: +5 |
| Q36 Information personnes decisions IA | Art. 26(11) | Deployeur only | NON: +5 |
| Q37 Responsable conformite IA | -- | Commun | NON: +3 |

#### 3.2.8 Section 6 -- GPAI & Conformite croisee (Q38-Q43)

| Question | Reference | Branching | Scoring |
|----------|-----------|-----------|---------|
| Q38 Utilisation modeles GPAI | Art. 51-56 | Commun | Active Q39-Q41 si OUI |
| Q39 Marquage contenu genere IA | Art. 50(2) | Si Q38=OUI | NON: +4, Partiel: +2 |
| Q40 Deepfakes generes/diffuses | Art. 50(4) | Commun | OUI + non marque: +6 |
| Q41 Risque systemique > 10^25 FLOPs | Art. 51, 55 | Fournisseur only | OUI: +10 |
| Q42 Plateforme DSA recommandation | Art. 27 DSA | Commun | OUI: +4 |
| Q43 Regl. sectorielle applicable | Annexe I | Commun | +3-4 par secteur |

#### 3.2.9 Section 7 -- RGPD & Finalisation (Q44-Q46)

| Question | Reference | Branching | Scoring |
|----------|-----------|-----------|---------|
| Q44 Traitement donnees personnelles | RGPD 2016/679 | Commun | Active Q45 si OUI |
| Q45 Conformite RGPD | Regl. 2016/679 | Si Q44=OUI | NON: +6, Partiel: +3 |
| Q46 Connaissance AI Act | -- | Commun | Qualification lead uniquement |

### 3.3 Module : Resultats & Score (`/resultats`)

#### 3.3.1 Moteur de scoring

**Formule** : `Score final = min(100, score_brut * multiplicateur_secteur * multiplicateur_taille)`

| Categorie | Facteur | Points |
|-----------|---------|--------|
| **Role** | Fournisseur | +15 |
| | Importateur | +10 |
| | Deployeur | +8 |
| | Distributeur | +3 |
| **Pratiques interdites** | Chaque OUI | +20 |
| | Chaque NSP | +5 |
| **Systemes haut risque** | Chaque systeme HR | +6 (divise par 2 si derogation Art. 6(3)) |
| **Volume** | >10 systemes | +8 |
| | 6-10 | +5 |
| | 3-5 | +3 |
| | NSP | +6 |
| **Lacunes conformite** | Formation manquante | +5 |
| | Docs fournisseurs manquants | +5 |
| | Surveillance humaine manquante | +6 |
| | Logs non conserves | +5 |
| | Transparence manquante | +5 |
| | FRIA manquante + systeme HR | +8 |
| | Travailleurs non informes | +5 |
| | Personnes non informees | +5 |
| | Deepfakes non marques | +6 |
| | GPAI systemique | +10 |
| | Marquage contenu IA manquant | +4 |
| | Responsable conformite absent | +3 |
| **Fournisseur (S2b)** | Gestion risques manquante | +6 |
| | Notice utilisation manquante | +5 |
| | QMS manquant | +5 |
| | Post-marche manquant | +5 |
| | Mandataire UE manquant | +6 |
| **Conformite croisee** | Plateforme DSA | +4 |
| | Regl. sectorielle | +3-4 par secteur |
| | RGPD non conforme + donnees perso | +6 |
| **Multiplicateurs** | Secteur sensible (finance, sante, rh, education, admin) | x1.15 |
| | Grande entreprise (5000+) | x1.10 |
| | ETI (250-4999) | x1.05 |

#### 3.3.2 Niveaux de risque

| Score | Niveau | Couleur | Description |
|-------|--------|---------|-------------|
| 0 - 19 | FAIBLE | Vert (#16a34a) | Exposition limitee. Veille recommandee. |
| 20 - 44 | MODERE | Jaune (#f59e0b) | Axes d'amelioration identifies. Diagnostic flash recommande. |
| 45 - 69 | ELEVE | Orange (#f97316) | Manquements significatifs. Diagnostic strategique indispensable. |
| 70 - 100 | CRITIQUE | Rouge (#dc2626) | Risque tres eleve. Action immediate necessaire. |

#### 3.3.3 Structure de la page resultats

| Bloc | Visibilite | Contenu |
|------|------------|---------|
| Score /100 | TOUJOURS visible | Jauge circulaire animee, niveau de risque, description |
| **Email Gate** | Avant soumission email | Prenom + Email + Tel. Bouton "Acceder au diagnostic" |
| Roles detectes | Apres gate | Badges colores par role + reference article |
| Alertes conditionnelles | Apres gate | Pratiques interdites, systemes HR, derogation, DSA, RGPD, sectoriel |
| Classification systemes | Apres gate | Chaque systeme avec badge INTERDIT/HAUT/LIMITE/MINIMAL |
| Obligations identifiees | Apres gate | Liste avec statut (Conforme / Partiel / Manquant) + reference |
| Timeline reglementaire | Apres gate | Fev 2025 --> Aout 2025 --> Aout 2026 --> Aout 2027 |
| Social proof | Apres gate | Temoignage client |
| **Offre personnalisee** | Apres gate | Recommandation basee sur score x role (voir section 4) |
| Comparateur prix | Apres gate | Avocats: 5-15k / Big4: 20-50k / Complia: a partir de 990 EUR |
| CTA Calendly | Apres gate | "Reserver un appel gratuit" --> calendly.com/complia/decouverte |
| CTA Contact | Apres gate | "Nous contacter par email" |
| Export PDF | Apres gate | Bouton telecharger diagnostic PDF (@media print) |
| Disclaimer juridique | Apres gate | Articles applicables listes dynamiquement + reglementations croisees |

### 3.4 Module : Recommandation d'offres

Voir section 4 (matrice de recommandation).

### 3.5 Module : Prise de RDV (`/rdv`)

| Propriete | Specification |
|-----------|---------------|
| Integration | Calendly embed inline (pas popup) |
| Types de RDV | Decouverte (20 min, gratuit) / Diagnostic (30 min) |
| Pre-remplissage | Email et prenom depuis le formulaire gate si disponibles |
| Webhook | Calendly webhook --> `/api/calendly/webhook` pour MaJ statut lead en DB |
| Confirmation | Page de confirmation avec recap + prochaines etapes |
| Rappel | Email automatique via Resend J-1 et H-1 |

### 3.6 Module : Espace client (`/espace-client`)

| Fonctionnalite | Description |
|----------------|-------------|
| **Dashboard** | Score actuel, statut conformite, prochaine echeance, actions en cours |
| **Diagnostics** | Historique des diagnostics (pre-audit + payants). Detail par diagnostic avec score, roles, obligations, alertes. |
| **Documents** | Upload/download des livrables (rapports, templates, dossiers conformite). Organises par prestation. |
| **Factures** | Synchronisation Stripe. Historique paiements. Telecharger factures PDF. |
| **Profil** | Informations entreprise editables. Coordonnees contact. |
| **Veille** | Flux articles veille reglementaire (si abonnement actif). Alertes urgentes. |
| **Authentification** | Magic link par email (Resend) + option mot de passe. Session JWT. |

---

## 4. REGLES DE RECOMMANDATION D'OFFRES

### 4.1 Matrice principale : [Score] x [Role] --> [Offre recommandee]

| Score \ Role | DEPLOYEUR | FOURNISSEUR | IMPORTATEUR | DISTRIBUTEUR |
|-------------|-----------|-------------|-------------|--------------|
| **0 - 19 (Faible)** | Veille (190 EUR/mois) | Veille (190 EUR/mois) | Veille (190 EUR/mois) | Veille (190 EUR/mois) |
| **20 - 44 (Modere)** | **Diagnostic Flash (990 EUR)** | **Diagnostic Flash (990 EUR)** | **Diagnostic Flash (990 EUR)** | **Diagnostic Flash (990 EUR)** |
| **45 - 69 (Eleve)** | **Pack Conformite Deployeur (3 990 EUR)** | **Roadmap Fournisseur (6 990 EUR)** | Pack Importateur (4 990 EUR) | Pack Distributeur (2 490 EUR) |
| **70 - 100 (Critique)** | Pack Conformite Deployeur+ (6 990 EUR) | **Conformite Fournisseur (35 000 EUR+)** | Pack Importateur (4 990 EUR) | Pack Distributeur (2 490 EUR) |

### 4.2 Ajustements par secteur

| Secteur | Majoration | Offre additionnelle |
|---------|------------|---------------------|
| HealthTech / MedTech | +20% sur diagnostic | Mention conformite MDR (2017/745) |
| FinTech / Assurance | +15% sur diagnostic | Mention conformite DORA (2022/2554) |
| Autres secteurs sensibles (RH, education, admin) | Pas de majoration prix | Mise en avant urgence Annexe III |

### 4.3 Matrice complete : [Role] x [Score] x [Secteur] --> [Offre]

| Role | Score | Secteur | Offre recommandee | Prix affiche | Offre secondaire |
|------|-------|---------|-------------------|-------------|-----------------|
| Deployeur | 0-19 | Tous | Veille simple | 190 EUR/mois | Diagnostic Flash (990 EUR) |
| Deployeur | 20-44 | Standard | Diagnostic Flash | 990 EUR HT | Pack Conformite (3 990 EUR) |
| Deployeur | 20-44 | MedTech | Diagnostic Flash + MedTech | 1 390 EUR HT | Pack Conformite (3 990 EUR) |
| Deployeur | 20-44 | FinTech | Diagnostic Flash + FinTech | 1 290 EUR HT | Pack Conformite (3 990 EUR) |
| Deployeur | 45-69 | Standard | Pack Conformite | **3 990 EUR HT** | Pack Conformite+ (6 990 EUR) |
| Deployeur | 45-69 | MedTech/FinTech | Pack Conformite | **3 990 EUR HT** + majoration | Pack Conformite+ (6 990 EUR) |
| Deployeur | 70-100 | Standard | Pack Conformite+ | **6 990 EUR HT** | Compliance Officer (890 EUR/mois) |
| Deployeur | 70-100 | MedTech/FinTech | Pack Conformite+ | **6 990 EUR HT** + majoration | Compliance Officer (890 EUR/mois) |
| Fournisseur | 0-19 | Tous | Veille simple | 190 EUR/mois | Diagnostic Flash (990 EUR) |
| Fournisseur | 20-44 | Tous | Diagnostic Flash | 990 EUR HT | Roadmap Fournisseur (6 990 EUR) |
| Fournisseur | 45-69 | Tous | Roadmap Fournisseur | **6 990 EUR HT** | Conformite Fournisseur (35 000 EUR+) |
| Fournisseur | 70-100 | Tous | Conformite Fournisseur | **35 000 EUR+ HT** | Certification Ready (45-70k EUR) |
| Importateur | 0-19 | Tous | Veille simple | 190 EUR/mois | Diagnostic Flash (990 EUR) |
| Importateur | 20-44 | Tous | Diagnostic Flash | 990 EUR HT | Pack Importateur (4 990 EUR) |
| Importateur | 45-100 | Tous | Pack Importateur | **4 990 EUR HT** | Compliance Officer (890 EUR/mois) |
| Distributeur | 0-19 | Tous | Veille simple | 190 EUR/mois | Diagnostic Flash (990 EUR) |
| Distributeur | 20-44 | Tous | Diagnostic Flash | 990 EUR HT | Pack Distributeur (2 490 EUR) |
| Distributeur | 45-100 | Tous | Pack Distributeur | **2 490 EUR HT** | Compliance Officer (890 EUR/mois) |

### 4.4 Logique d'affichage des offres

1. **Offre recommandee** : badge "RECOMMANDE POUR VOUS", card mise en avant (featured).
2. **Offre inferieure** : affichee a gauche, prix plus bas, option de decouverte.
3. **Offre superieure** : affichee a droite, pour profils plus exposes.
4. **Comparateur de prix** : toujours visible en dessous.
   - Avocats specialises : 5 000 - 15 000 EUR
   - Cabinets Big Four : 20 000 - 50 000 EUR
   - Complia : a partir de 990 EUR
5. **CTA principal** : "Reserver un appel gratuit" --> Calendly decouverte.
6. **CTA secondaire** : "Nous contacter par email".

### 4.5 Regle de deductibilite

Le prix du diagnostic payant (990 / 2 490 / 6 490 EUR) est **deductible** de tout pack conformite signe dans les 30 jours. Cette information est affichee sur chaque offre de diagnostic.

---

## 5. EXIGENCES TECHNIQUES

### 5.1 Stack technologique

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework** | Next.js | 14 (App Router) | SSR/SSG pour SEO landing page. Server Components pour performance. Route handlers pour API. Middleware pour auth. Ecossysteme React mature. |
| **Langage** | TypeScript | 5.x | Typage statique indispensable pour le moteur de scoring et les regles metier complexes (roles, branches conditionnelles). Previent les regressions. |
| **Styling** | Tailwind CSS | 3.x | Design system rapide a iterer. Dark mode natif via `dark:`. Classes utilitaires pour responsive mobile-first. Variables CSS custom deja en place. |
| **ORM** | Prisma | 5.x | Schema declaratif type-safe. Migrations automatiques. Compatible PostgreSQL. Excellent pour les relations complexes (Lead -> Diagnostic -> Offre -> Paiement). |
| **Base de donnees** | PostgreSQL | 16 | Relationnel robuste pour les donnees structurees (leads, diagnostics, scores, obligations). JSON columns pour les reponses questionnaire. Full-text search pour la veille. |
| **State management** | Zustand | 4.x | Store leger pour l'etat du questionnaire multi-sections (actuellement localStorage). Middleware `persist` pour auto-save. Pas de boilerplate Redux. Compatible React Server Components. |
| **Paiement** | Stripe | API v2024 | Checkout Sessions pour les packs one-shot. Subscriptions pour les offres recurrentes (890/190 EUR/mois). Customer Portal pour les factures. Webhooks pour synchronisation. |
| **Email** | Resend | API v2 | Emails transactionnels (capture lead, confirmation RDV, magic link auth, rappels). Templates React Email. Delivrabilite superieure a Nodemailer. Domain verification. |
| **Prise de RDV** | Calendly | Embed + API | Widget inline sur `/rdv`. Prefill email/nom. Webhooks pour mettre a jour le statut lead en DB. Pas besoin de reinventer un systeme de reservation. |
| **Hebergement** | Vercel | -- | Deploiement natif Next.js. Edge Functions pour le middleware. Preview deployments pour la QA. Analytics integres. Deja configure (`.vercel/` present). |
| **Monitoring** | Vercel Analytics + Sentry | -- | Web Vitals, erreurs runtime, performance scoring engine. |

### 5.2 Schema de donnees (Prisma)

```prisma
model Lead {
  id            String    @id @default(cuid())
  email         String    @unique
  firstName     String
  phone         String?
  company       String?
  sector        String?
  companySize   String?
  revenue       String?
  source        String    @default("pre-audit")
  status        LeadStatus @default(NEW)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  diagnostics   Diagnostic[]
  appointments  Appointment[]
  payments      Payment[]
}

model Diagnostic {
  id            String    @id @default(cuid())
  leadId        String
  lead          Lead      @relation(fields: [leadId], references: [id])
  type          DiagnosticType @default(PRE_AUDIT)
  answers       Json      // Stockage des reponses questionnaire
  score         Int
  riskLevel     String    // faible / modere / eleve / critique
  roles         Json      // [{id, label, ref}]
  systems       Json      // [{level, label, ref}]
  obligations   Json      // [{name, ref, status}]
  articles      Json      // Articles applicables
  offerRecommended String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Appointment {
  id            String    @id @default(cuid())
  leadId        String
  lead          Lead      @relation(fields: [leadId], references: [id])
  type          String    // decouverte / diagnostic
  calendlyEventId String?
  scheduledAt   DateTime?
  status        AppointmentStatus @default(SCHEDULED)
  createdAt     DateTime  @default(now())
}

model Payment {
  id            String    @id @default(cuid())
  leadId        String
  lead          Lead      @relation(fields: [leadId], references: [id])
  stripeSessionId String? @unique
  stripeCustomerId String?
  stripeSubscriptionId String?
  offerId       String
  amount        Int       // En centimes
  currency      String    @default("eur")
  status        PaymentStatus @default(PENDING)
  createdAt     DateTime  @default(now())
}

model Offer {
  id            String    @id @default(cuid())
  slug          String    @unique
  name          String
  description   String
  priceAmount   Int       // En centimes, 0 si "sur devis"
  priceType     PriceType // ONE_TIME / MONTHLY / CUSTOM
  targetRole    String?   // deployeur / fournisseur / importateur / distributeur / null (tous)
  minScore      Int       @default(0)
  maxScore      Int       @default(100)
  isActive      Boolean   @default(true)
  sortOrder     Int       @default(0)
}

model BlogPost {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  content       String
  excerpt       String?
  isPublished   Boolean   @default(false)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum LeadStatus {
  NEW
  PRE_AUDIT_DONE
  APPOINTMENT_SCHEDULED
  QUALIFIED
  PROPOSAL_SENT
  CLIENT
  LOST
}

enum DiagnosticType {
  PRE_AUDIT
  FLASH
  STRATEGIQUE
  PREMIUM
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PriceType {
  ONE_TIME
  MONTHLY
  CUSTOM
}
```

### 5.3 Architecture applicative

```
complia-app/
|
|-- src/
|   |-- app/                          # Next.js App Router
|   |   |-- (public)/                 # Groupe routes publiques
|   |   |   |-- page.tsx              # Landing page
|   |   |   |-- pre-audit/
|   |   |   |   `-- page.tsx          # Questionnaire
|   |   |   |-- resultats/
|   |   |   |   `-- page.tsx          # Resultats + gate
|   |   |   |-- rdv/
|   |   |   |   `-- page.tsx          # Calendly embed
|   |   |   |-- offres/
|   |   |   |   |-- page.tsx          # Catalogue
|   |   |   |   `-- [slug]/page.tsx   # Detail offre
|   |   |   |-- blog/
|   |   |   |   |-- page.tsx          # Liste articles
|   |   |   |   `-- [slug]/page.tsx   # Detail article
|   |   |   |-- a-propos/page.tsx
|   |   |   |-- mentions-legales/page.tsx
|   |   |   `-- cgv/page.tsx
|   |   |
|   |   |-- (auth)/                   # Groupe routes authentifiees
|   |   |   |-- login/page.tsx
|   |   |   `-- espace-client/
|   |   |       |-- layout.tsx        # Layout avec sidebar nav
|   |   |       |-- page.tsx          # Dashboard
|   |   |       |-- diagnostics/
|   |   |       |   |-- page.tsx
|   |   |       |   `-- [id]/page.tsx
|   |   |       |-- documents/page.tsx
|   |   |       |-- factures/page.tsx
|   |   |       |-- profil/page.tsx
|   |   |       `-- veille/page.tsx
|   |   |
|   |   |-- admin/                    # Routes admin
|   |   |   |-- layout.tsx
|   |   |   |-- leads/page.tsx
|   |   |   |-- clients/page.tsx
|   |   |   |-- diagnostics/page.tsx
|   |   |   |-- offres/page.tsx
|   |   |   |-- analytics/page.tsx
|   |   |   `-- veille/page.tsx
|   |   |
|   |   |-- api/                      # Route Handlers
|   |   |   |-- diagnostic/
|   |   |   |   |-- submit/route.ts
|   |   |   |   `-- score/route.ts
|   |   |   |-- leads/route.ts
|   |   |   |-- auth/route.ts
|   |   |   |-- stripe/
|   |   |   |   |-- checkout/route.ts
|   |   |   |   `-- webhook/route.ts
|   |   |   |-- resend/route.ts
|   |   |   `-- calendly/
|   |   |       `-- webhook/route.ts
|   |   |
|   |   |-- layout.tsx               # Root layout
|   |   `-- globals.css               # Tailwind + variables CSS
|   |
|   |-- components/
|   |   |-- ui/                       # Composants generiques
|   |   |-- questionnaire/            # Composants questionnaire
|   |   |   |-- QuestionnaireProvider.tsx  # Context/store
|   |   |   |-- SectionNavigation.tsx
|   |   |   |-- ProgressBar.tsx
|   |   |   |-- ProfileSidebar.tsx
|   |   |   |-- FloatingRiskBadge.tsx
|   |   |   |-- sections/
|   |   |   |   |-- Section1Identification.tsx
|   |   |   |   |-- Section2Role.tsx
|   |   |   |   |-- Section2bFournisseur.tsx
|   |   |   |   |-- Section3Inventaire.tsx
|   |   |   |   |-- Section4Interdits.tsx
|   |   |   |   |-- Section5Conformite.tsx
|   |   |   |   |-- Section6GPAI.tsx
|   |   |   |   `-- Section7RGPD.tsx
|   |   |   `-- inputs/
|   |   |       |-- RadioCardGroup.tsx
|   |   |       |-- CheckboxCardGroup.tsx
|   |   |       |-- SelectInput.tsx
|   |   |       `-- TextInput.tsx
|   |   |-- results/                  # Composants resultats
|   |   |   |-- ScoreCircle.tsx
|   |   |   |-- EmailGate.tsx
|   |   |   |-- RoleBadges.tsx
|   |   |   |-- AlertBlocks.tsx
|   |   |   |-- RiskClassification.tsx
|   |   |   |-- ObligationsList.tsx
|   |   |   |-- Timeline.tsx
|   |   |   |-- PersonalizedOffer.tsx
|   |   |   |-- PriceComparator.tsx
|   |   |   `-- DynamicDisclaimer.tsx
|   |   `-- layout/
|   |       |-- Header.tsx
|   |       |-- Footer.tsx
|   |       `-- DarkModeToggle.tsx
|   |
|   |-- lib/
|   |   |-- scoring/
|   |   |   |-- engine.ts             # Moteur de scoring (port depuis app.js)
|   |   |   |-- roles.ts              # Detection des roles
|   |   |   |-- classification.ts     # Classification des systemes
|   |   |   |-- obligations.ts        # Generation des obligations
|   |   |   |-- offers.ts             # Logique de recommandation d'offres
|   |   |   `-- constants.ts          # HIGH_RISK_SYSTEMS, SYSTEM_LABELS, etc.
|   |   |-- db.ts                     # Instance Prisma
|   |   |-- stripe.ts                 # Config Stripe
|   |   |-- resend.ts                 # Config Resend
|   |   |-- auth.ts                   # Logique d'authentification
|   |   `-- utils.ts
|   |
|   |-- stores/
|   |   `-- questionnaire.ts          # Zustand store (remplace localStorage brut)
|   |
|   `-- types/
|       |-- diagnostic.ts             # Types pour le questionnaire/scoring
|       |-- offer.ts
|       `-- lead.ts
|
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|
|-- public/
|   |-- fonts/
|   `-- images/
|
|-- .env.local                        # Variables d'environnement
|-- next.config.ts
|-- tailwind.config.ts
|-- tsconfig.json
`-- package.json
```

### 5.4 Variables d'environnement requises

```
# Base de donnees
DATABASE_URL="postgresql://..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="contact@complia.eu"

# Calendly
CALENDLY_API_KEY="..."
CALENDLY_WEBHOOK_SECRET="..."

# Auth
JWT_SECRET="..."
NEXTAUTH_URL="https://complia.eu"

# App
NEXT_PUBLIC_APP_URL="https://complia.eu"
```

### 5.5 Exigences non-fonctionnelles

| Categorie | Exigence | Cible |
|-----------|----------|-------|
| **Performance** | LCP (Largest Contentful Paint) | < 2.5s |
| | FID (First Input Delay) | < 100ms |
| | CLS (Cumulative Layout Shift) | < 0.1 |
| | TTFB (Time to First Byte) | < 200ms |
| **SEO** | Score Lighthouse SEO | >= 95 |
| | Pages publiques SSR/SSG | Oui |
| | Sitemap XML auto-genere | Oui |
| **Securite** | HTTPS obligatoire | Oui (Vercel) |
| | CORS restrictif | Domaine complia.eu uniquement |
| | Rate limiting API | 100 req/min par IP |
| | Sanitization inputs | Tous les champs |
| | RGPD | Consentement cookies, droit suppression |
| **Accessibilite** | WCAG 2.1 niveau AA | Oui |
| | Navigation clavier | Toutes les sections questionnaire |
| | Labels ARIA | Tous les inputs |
| | Contraste couleurs | Ratio >= 4.5:1 |
| **Disponibilite** | Uptime cible | 99.9% |
| | CDN mondial | Vercel Edge Network |
| **Internationalisation** | Langue | Francais (FR) par defaut |
| | Future | Anglais (EN), Allemand (DE) via next-intl |

### 5.6 Integrations externes

| Service | Usage | Declencheur |
|---------|-------|-------------|
| **Stripe Checkout** | Paiement packs one-shot | CTA "Acheter" sur offre |
| **Stripe Subscriptions** | Abonnements recurrents (890/190 EUR/mois) | CTA "S'abonner" |
| **Stripe Customer Portal** | Gestion factures/abonnements client | Lien dans espace client |
| **Stripe Webhooks** | Sync statut paiement --> DB | `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated` |
| **Resend** | Email capture lead | Soumission email gate |
| **Resend** | Email confirmation diagnostic | Fin pre-audit |
| **Resend** | Magic link auth | Login espace client |
| **Resend** | Rappels RDV | J-1 et H-1 avant RDV |
| **Calendly Embed** | Widget prise de RDV inline | Page `/rdv` |
| **Calendly Webhooks** | Sync RDV --> DB | `invitee.created`, `invitee.canceled` |

---

*Document genere le 26 mars 2026 -- COMPLIA*
*Base sur le Reglement (UE) 2024/1689 et le document d'entreprise Complia V3*
