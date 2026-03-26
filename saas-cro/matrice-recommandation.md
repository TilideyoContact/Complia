# MATRICE DE RECOMMANDATION D'OFFRES — COMPLIA

**Document** : Table de decision pour la recommandation automatique d'offres
**Version** : 1.0
**Logique** : [Role] x [Score /10] x [Secteur] x [Taille] --> [Offre principale] + [Argumentaire] + [Upsell]

---

## LEGENDE

### Niveaux de score
| Score /10 | Niveau     |
|-----------|------------|
| 0 - 3     | FAIBLE     |
| 4 - 5     | MODERE     |
| 6 - 7     | ELEVE      |
| 8 - 10    | CRITIQUE   |

### Secteurs
| Code | Secteur                     | Sensibilite |
|------|-----------------------------|-------------|
| S1   | Finance / Assurance         | Elevee      |
| S2   | Sante / MedTech             | Elevee      |
| S3   | RH / Recrutement            | Elevee      |
| S4   | Education / Formation       | Elevee      |
| S5   | Administration publique     | Elevee      |
| S6   | Tech / SaaS                 | Moyenne     |
| S7   | Industrie / Transport       | Moyenne     |
| S8   | Autre (Commerce, Media...)  | Standard    |

### Tailles
| Code | Taille                  |
|------|-------------------------|
| T1   | TPE (< 10 salaries)     |
| T2   | PME (10-249)            |
| T3   | ETI (250-4999)          |
| T4   | Grand Groupe (5000+)    |

---

## MATRICE PAR ROLE

---

### 1. DEPLOYEUR

| # | Score    | Secteur      | Taille  | Offre principale                      | Argumentaire                                                                                                                                  | Upsell                           |
|---|----------|--------------|---------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| 1 | FAIBLE   | S8 (Autre)   | T1/T2   | **Diagnostic Flash** (990 EUR)         | Votre exposition est limitee, mais quelques points de vigilance meritent une verification. Le Diagnostic Flash vous donne un verdict clair en 3-5 jours. | Veille Reglementaire (190 EUR/mois) |
| 2 | FAIBLE   | S1-S5 (Sensible) | T1/T2 | **Diagnostic Flash** (990 EUR)        | Meme avec un score faible, votre secteur est soumis a des obligations renforcees. Un diagnostic professionnel confirmera votre niveau de conformite. | Diagnostic Strategique (2 490 EUR) |
| 3 | FAIBLE   | S6-S8        | T3/T4   | **Diagnostic Strategique** (2 490 EUR) | Votre taille implique une surface d'exposition plus large. La roadmap 12 mois vous permettra d'anticiper les evolutions reglementaires avec serenite. | Compliance Officer (890 EUR/mois) |
| 4 | MODERE   | S8 (Autre)   | T1/T2   | **Diagnostic Flash** (990 EUR)         | Des lacunes sont identifiees. Le Diagnostic Flash vous les cartographie precisement pour que vous sachiez exactement quoi corriger en priorite. | Pack Conformite Deployeur (3 990 EUR) |
| 5 | MODERE   | S1-S5 (Sensible) | T1/T2 | **Diagnostic Strategique** (2 490 EUR) | Lacunes detectees dans un secteur sensible. Le Diagnostic Strategique inclut un gap analysis complet et une roadmap priorisee adaptee a votre secteur. | Pack Conformite Deployeur (3 990 EUR) |
| 6 | MODERE   | S6-S8        | T3/T4   | **Pack Conformite Deployeur** (3 990 EUR) | A votre taille, les lacunes detectees representent un risque reel. Le Pack Deployeur couvre toutes vos obligations de base et vous rend conforme en 15-20 jours. | Pack Deployeur+ (6 990 EUR) |
| 7 | MODERE   | S1-S5 (Sensible) | T3/T4 | **Pack Conformite Deployeur** (3 990 EUR) | Secteur sensible + taille significative = risque eleve. Le Pack Deployeur est le minimum pour securiser votre conformite avant aout 2026. | Pack Deployeur+ (6 990 EUR) |
| 8 | ELEVE    | S8 (Autre)   | T1/T2   | **Pack Conformite Deployeur** (3 990 EUR) | Manquements significatifs detectes. Le Pack Deployeur corrige toutes les lacunes et vous livre un dossier complet avec Garantie Audit Ready. | Pack Deployeur+ (6 990 EUR) |
| 9 | ELEVE    | S1-S5 (Sensible) | T1/T2 | **Pack Conformite Deployeur** (3 990 EUR) | Manquements importants dans un secteur ou les autorites seront particulierement vigilantes. Agir maintenant est une priorite pour eviter les sanctions. | Pack Deployeur+ (6 990 EUR) |
| 10 | ELEVE   | S6-S8        | T3/T4   | **Pack Deployeur+** (6 990 EUR)        | A votre echelle, les manquements detectes necessitent une approche complete incluant la FRIA et un audit blanc. Le Pack Deployeur+ est la reponse adaptee. | Compliance Officer (890 EUR/mois) |
| 11 | ELEVE   | S1-S5 (Sensible) | T3/T4 | **Pack Deployeur+** (6 990 EUR)       | Secteur reglemente + manquements significatifs + taille importante : le Pack Deployeur+ avec FRIA obligatoire et audit blanc est indispensable. | Compliance Officer (890 EUR/mois) |
| 12 | CRITIQUE | S8 (Autre)  | T1/T2   | **Pack Conformite Deployeur** (3 990 EUR) | Exposition tres elevee detectee. Des actions correctives immediates sont necessaires. Le Pack Deployeur vous met en conformite en 15-20 jours. | Pack Deployeur+ (6 990 EUR) |
| 13 | CRITIQUE | S1-S5 (Sensible) | T1/T2 | **Pack Deployeur+** (6 990 EUR)      | Situation critique dans un secteur sous haute surveillance. La FRIA et l'audit blanc du Pack Deployeur+ sont indispensables pour eviter les sanctions. | Compliance Officer (890 EUR/mois) |
| 14 | CRITIQUE | S6-S8       | T3/T4   | **Pack Deployeur+** (6 990 EUR)       | Risque majeur a votre echelle. Le Pack Deployeur+ avec FRIA, audit blanc et gouvernance IA est le minimum pour securiser votre organisation avant l'echeance. | Pack Groupe (15 000 EUR+) |
| 15 | CRITIQUE | S1-S5 (Sensible) | T3/T4 | **Pack Conformite Groupe** (15 000 EUR+) | Situation critique dans un secteur sensible a l'echelle d'un grand groupe. Un accompagnement sur mesure avec gouvernance multi-entites est necessaire. | Compliance Officer (890 EUR/mois) |

---

### 2. FOURNISSEUR

| # | Score    | Secteur      | Taille  | Offre principale                           | Argumentaire                                                                                                                                           | Upsell                                |
|---|----------|--------------|---------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| 16 | FAIBLE  | Tous         | T1/T2   | **Diagnostic Flash** (990 EUR)              | Vous developpez de l'IA mais votre exposition semble limitee. Un diagnostic professionnel confirmera votre classification et vos obligations reelles.    | Roadmap Fournisseur (6 990 EUR)        |
| 17 | FAIBLE  | Tous         | T3/T4   | **Diagnostic Strategique** (2 490 EUR)      | En tant que fournisseur IA de taille significative, une cartographie complete de vos obligations (QMS, Annexe IV, marquage CE) est essentielle.          | Roadmap Fournisseur (6 990 EUR)        |
| 18 | MODERE  | Tous         | T1/T2   | **Diagnostic Strategique** (2 490 EUR)      | Les obligations fournisseur sont les plus lourdes de l'AI Act. Le Diagnostic Strategique vous donne la visibilite necessaire avant de vous engager.      | Roadmap Fournisseur (6 990 EUR)        |
| 19 | MODERE  | S1-S5 (Sensible) | T3/T4 | **Roadmap Fournisseur** (6 990 EUR)        | Fournisseur IA dans un secteur sensible : vos obligations techniques sont maximales. La Roadmap vous donne un plan technique a 18 mois realiste.        | Conformite Fournisseur (35 000 EUR+)   |
| 20 | ELEVE   | Tous         | T1/T2   | **Roadmap Fournisseur** (6 990 EUR)         | Manquements importants detectes. En tant que fournisseur, vous portez la responsabilite principale. La Roadmap structure votre plan de mise en conformite. | Conformite Fournisseur (35 000 EUR+)   |
| 21 | ELEVE   | Tous         | T3/T4   | **Conformite Fournisseur** (35 000 EUR+)    | A votre echelle, avec des manquements significatifs, un accompagnement complet (QMS, Annexe IV, declaration CE) est la seule approche prudente.           | Compliance Officer (890 EUR/mois)      |
| 22 | CRITIQUE | Tous        | T1/T2   | **Roadmap Fournisseur** (6 990 EUR)         | Situation critique. Vos obligations fournisseur (Art. 8-17) necessitent un plan d'action structure immediatement. La Roadmap est la premiere etape.      | Conformite Fournisseur (35 000 EUR+)   |
| 23 | CRITIQUE | Tous        | T3/T4   | **Conformite Fournisseur** (35 000 EUR+)    | Risque maximal pour un fournisseur IA de votre taille. L'accompagnement complet avec documentation Annexe IV, QMS et marquage CE est indispensable.      | Compliance Officer (890 EUR/mois)      |

---

### 3. IMPORTATEUR

| # | Score    | Secteur      | Taille  | Offre principale                      | Argumentaire                                                                                                                                              | Upsell                              |
|---|----------|--------------|---------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| 24 | FAIBLE  | Tous         | T1/T2   | **Diagnostic Flash** (990 EUR)         | Votre exposition semble limitee, mais en tant qu'importateur, vous devez verifier la conformite de vos fournisseurs hors UE. Le diagnostic le confirme.     | Pack Importateur (4 990 EUR)         |
| 25 | FAIBLE  | Tous         | T3/T4   | **Diagnostic Strategique** (2 490 EUR) | A votre echelle d'importation, une cartographie complete des obligations (marquage CE, documentation, identification) est recommandee.                       | Pack Importateur (4 990 EUR)         |
| 26 | MODERE  | Tous         | Tous    | **Pack Importateur** (4 990 EUR)       | Lacunes detectees dans vos obligations d'importateur. Le Pack Importateur couvre la verification conformite fournisseur, le marquage CE et les procedures.   | Compliance Officer (890 EUR/mois)    |
| 27 | ELEVE/CRITIQUE | Tous  | Tous    | **Pack Importateur** (4 990 EUR)       | Manquements importants. En tant qu'importateur, vous etes co-responsable de la conformite des systemes que vous introduisez dans l'UE. Agissez maintenant. | Compliance Officer (890 EUR/mois)    |

---

### 4. DISTRIBUTEUR

| # | Score    | Secteur      | Taille  | Offre principale                      | Argumentaire                                                                                                                                              | Upsell                              |
|---|----------|--------------|---------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| 28 | FAIBLE  | Tous         | Tous    | **Diagnostic Flash** (990 EUR)         | Vos obligations de distributeur sont les plus legeres, mais un diagnostic confirme que tout est en ordre. 3-5 jours, 990 EUR deductible.                    | Veille Reglementaire (190 EUR/mois)  |
| 29 | MODERE  | Tous         | Tous    | **Pack Distributeur** (2 490 EUR)      | Des lacunes sont identifiees. Le Pack Distributeur met en place vos procedures de verification et de signalement pour une conformite complete.              | Veille Reglementaire (190 EUR/mois)  |
| 30 | ELEVE/CRITIQUE | Tous  | Tous    | **Pack Distributeur** (2 490 EUR)      | Manquements detectes dans vos obligations de distributeur. Le Pack couvre la verification marquage CE, les procedures de conformite et le signalement.      | Compliance Officer (890 EUR/mois)    |

---

### 5. INDETERMINE (Role non identifie)

| # | Score    | Secteur      | Taille  | Offre principale                      | Argumentaire                                                                                                                                              | Upsell                              |
|---|----------|--------------|---------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| 31 | FAIBLE  | Tous         | T1/T2   | **Diagnostic Flash** (990 EUR)         | Votre role AI Act n'est pas encore determine. Le Diagnostic Flash l'identifie en 3-5 jours et vous donne un verdict clair sur vos obligations.              | Diagnostic Strategique (2 490 EUR)   |
| 32 | FAIBLE  | Tous         | T3/T4   | **Diagnostic Strategique** (2 490 EUR) | A votre taille, l'incertitude sur votre role est un risque en soi. Le Diagnostic Strategique clarifie votre positionnement et anticipe vos obligations.     | Pack Conformite adapte au role       |
| 33 | MODERE/ELEVE | Tous    | T1/T2   | **Diagnostic Strategique** (2 490 EUR) | Lacunes detectees et role incertain : il est urgent de clarifier votre situation. Le Diagnostic Strategique identifie vos roles et vos priorites d'action.  | Pack Conformite adapte au role       |
| 34 | MODERE/ELEVE | Tous    | T3/T4   | **Diagnostic Premium** (6 490 EUR)     | Role incertain + manquements + taille significative : le Diagnostic Premium analyse jusqu'a 10 systemes et fournit un plan d'action exhaustif.              | Pack Conformite adapte au role       |
| 35 | CRITIQUE | Tous        | Tous    | **Diagnostic Strategique** (2 490 EUR) | Situation critique et role indetermine. Le Diagnostic Strategique est la premiere etape urgente pour identifier vos obligations et prioriser les actions.    | Pack Conformite adapte au role       |

---

## REGLES TRANSVERSALES

### Majorations sectorielles (applicables a tous les diagnostics)
| Secteur               | Majoration | Raison                     |
|----------------------|------------|----------------------------|
| HealthTech / MedTech | +400 EUR   | Croisement MDR + AI Act    |
| FinTech              | +300 EUR   | Croisement DORA + AI Act   |

### Regles de deductibilite
- Le montant de tout diagnostic (Flash, Strategique, Premium) est **integralement deduit** du pack conformite si le pack est signe **dans les 30 jours** suivant la livraison du rapport de diagnostic.
- Cette deduction s'applique une seule fois et sur le premier pack signe.

### Regles de paiement
- **Paiement en 3 fois sans frais** disponible sur tous les packs conformite (>= 3 990 EUR).
- Paiement par carte bancaire via Stripe.

### Upsell recurrent systematique
- Apres la livraison de tout pack conformite, proposer systematiquement :
  - **Compliance Officer Externalise** (890 EUR/mois) pour les T3/T4 ou scores >= 6
  - **Veille Reglementaire** (190 EUR/mois) pour les T1/T2 ou scores < 6

### Priorite d'affichage
1. Offre recommandee (badge "RECOMMANDE") = offre principale de la matrice
2. Offre alternative = un niveau en dessous
3. Offre upsell = affichee en cross-sell secondaire

---

## IMPLEMENTATION

### Pseudo-code de selection d'offre

```
FUNCTION recommander_offre(role, score, secteur, taille):

  niveau = determiner_niveau(score)  // FAIBLE | MODERE | ELEVE | CRITIQUE
  sensible = secteur IN [S1, S2, S3, S4, S5]
  grande = taille IN [T3, T4]

  // Lookup dans la matrice
  offre = MATRICE[role][niveau][sensible][grande]

  // Appliquer majorations
  IF secteur == "Sante/MedTech":
    offre.prix_diagnostic += 400
  IF secteur == "Finance/FinTech":
    offre.prix_diagnostic += 300

  // Determiner upsell recurrent
  IF grande OR score >= 6:
    offre.upsell_recurrent = "Compliance Officer (890 EUR/mois)"
  ELSE:
    offre.upsell_recurrent = "Veille Reglementaire (190 EUR/mois)"

  RETURN offre

FUNCTION determiner_niveau(score):
  IF score <= 3: RETURN "FAIBLE"
  IF score <= 5: RETURN "MODERE"
  IF score <= 7: RETURN "ELEVE"
  RETURN "CRITIQUE"
```

---

## EXEMPLES D'APPLICATION

| Scenario | Role | Score | Secteur | Taille | Offre recommandee | Upsell |
|----------|------|-------|---------|--------|-------------------|--------|
| PME SaaS utilisant ChatGPT + outil RH IA | Deployeur | 6.2 | Tech/SaaS | PME | Pack Conformite Deployeur (3 990 EUR) | Pack Deployeur+ |
| ETI bancaire avec scoring credit | Deployeur | 8.1 | Finance | ETI | Pack Deployeur+ (6 990 EUR) | Compliance Officer |
| Startup MedTech developpant un diagnostic IA | Fournisseur | 7.5 | Sante | TPE | Roadmap Fournisseur (6 990 EUR + 400 EUR) | Conformite Fournisseur |
| Grand groupe importateur de solutions US | Importateur | 5.8 | Tech/SaaS | GG | Pack Importateur (4 990 EUR) | Compliance Officer |
| PME revendeur d'outils IA | Distributeur | 3.1 | Commerce | PME | Diagnostic Flash (990 EUR) | Veille Reglementaire |
| ETI ne sachant pas son role | Indetermine | 6.5 | Industrie | ETI | Diagnostic Premium (6 490 EUR) | Pack Conformite adapte |
