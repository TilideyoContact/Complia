# COMPLIA -- Pre-audit Express : Specifications Completes

**Document** : Auto-diagnostic express -- Architecture questionnaire, scoring et conversion
**Version** : 1.0
**Date** : 26 mars 2026
**Base reglementaire** : Reglement (UE) 2024/1689 (EU AI Act)
**Objectif** : Qualifier, alerter, convertir en 5 min max -- Score /10

---

## TABLE DES MATIERES

1. Livrable 1 -- Architecture du questionnaire
   - A. Questions et logique conditionnelle
   - B. Logique de scoring /10
   - C. Catalogue d'alertes personnalisees
   - D. Matrice de recommandation d'offres
2. Livrable 2 -- Contenu des questions (ordre d'apparition)

---

# LIVRABLE 1 -- ARCHITECTURE DU QUESTIONNAIRE

---

## A. QUESTIONS ET LOGIQUE CONDITIONNELLE

### Vue d'ensemble de l'arbre decisionnel

```
Q1 (Role)
 |
 ├── Fournisseur ──> Q2 ──> Q3 ──> Q4 ──> Q5 ──> Q6F ──> Q7 ──> Q8 ──> Q9 ──> Q10 ──> Q11 ──> Q12 ──> Q13 ──> Q14 ──> Q15
 |
 ├── Deployeur ────> Q2 ──> Q3 ──> Q4 ──> Q5 ──> Q6D ──> Q7 ──> Q8 ──> Q9 ──> Q10 ──> Q11 ──> Q12 ──> Q13 ──> Q14 ──> Q15
 |
 ├── Importateur ──> Q2 ──> Q3 ──> Q4 ──> Q5 ──> Q6I ──> Q7 ──> Q8 ──> Q9 ──> Q10 ──> Q11 ──> Q12 ──> Q13 ──> Q14 ──> Q15
 |
 ├── Distributeur ─> Q2 ──> Q3 ──> Q4 ──> Q5 ──> Q6R ──> Q7 ──> Q8 ──> Q9 ──> Q10 ──> Q11 ──> Q12 ──> Q13 ──> Q14 ──> Q15
 |
 └── Je ne sais pas > Q2 ──> Q3 ──> Q4 ──> Q5 ──> Q6X ──> Q7 ──> Q8 ──> Q9 ──> Q10 ──> Q11 ──> Q12 ──> Q13 ──> Q14 ──> Q15

Legende :
  Q6F / Q6D / Q6I / Q6R / Q6X = variante de Q6 selon le role detecte en Q1
  Toutes les autres questions sont communes.
```

### Detail par question

---

#### Q1 -- Detection du role

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Quel est le rapport de votre entreprise avec l'intelligence artificielle ? |
| **Type** | Choix unique (radio cards) |
| **Options** | A. Nous developpons ou entrainons des systemes d'IA / B. Nous utilisons des outils integrant de l'IA / C. Nous importons des solutions IA de l'exterieur de l'UE / D. Nous revendons ou distribuons des solutions IA / E. Je ne suis pas sur(e) |
| **Condition d'affichage** | Toujours (premiere question) |
| **Routing** | A --> role = FOURNISSEUR / B --> role = DEPLOYEUR / C --> role = IMPORTATEUR / D --> role = DISTRIBUTEUR / E --> role = INDETERMINE |
| **Impact scoring** | Aucun impact direct. Determine le branchement de Q6 et le multiplicateur de role dans le scoring final. |

---

#### Q2 -- Secteur d'activite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Dans quel secteur votre entreprise evolue-t-elle principalement ? |
| **Type** | Choix unique (select dropdown) |
| **Options** | Technologie / SaaS -- Finance / Assurance -- Sante / MedTech -- Ressources humaines -- Education / Formation -- Juridique -- Commerce / Retail -- Industrie / Manufacturing -- Transport / Logistique -- Energie -- Immobilier -- Media / Communication -- Administration publique -- Autre |
| **Condition d'affichage** | Toujours (apres Q1) |
| **Routing** | --> Q3 |
| **Impact scoring** | Secteur sensible (Finance, Sante, RH, Education, Administration) --> multiplicateur x1.2 sur le score brut |

---

#### Q3 -- Taille de l'entreprise

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Combien de collaborateurs compte votre entreprise ? |
| **Type** | Choix unique (radio cards) |
| **Options** | Moins de 10 (TPE) -- 10 a 249 (PME) -- 250 a 4 999 (ETI) -- 5 000 et plus (Grand groupe) |
| **Condition d'affichage** | Toujours (apres Q2) |
| **Routing** | --> Q4 |
| **Impact scoring** | ETI : multiplicateur x1.05 / Grand groupe : multiplicateur x1.1 |

---

#### Q4 -- Perimetre geographique

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos produits ou services touchent-ils des utilisateurs dans l'Union europeenne ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, exclusivement -- Oui, en partie -- Non, aucune activite dans l'UE -- Je ne suis pas certain(e) |
| **Condition d'affichage** | Toujours (apres Q3) |
| **Routing** | "Non" --> alerte hors perimetre + poursuite du questionnaire (le reglement peut s'appliquer par effet extraterritorial). Autres --> Q5 |
| **Impact scoring** | "Non" : -1 pt sur score brut (reduction legere, car l'extraterritorialite s'applique souvent). "Je ne suis pas certain(e)" : +0.5 pt |

---

#### Q5 -- Volume de systemes IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Combien de systemes ou outils integrant de l'IA sont utilises dans votre organisation ? |
| **Type** | Choix unique (radio) |
| **Options** | Aucun a ma connaissance -- 1 a 2 -- 3 a 5 -- 6 a 10 -- Plus de 10 -- Je ne sais pas |
| **Condition d'affichage** | Toujours (apres Q4) |
| **Routing** | --> Q6 (variante selon role) |
| **Impact scoring** | Aucun : 0 pt / 1-2 : +0.3 / 3-5 : +0.5 / 6-10 : +0.8 / Plus de 10 : +1.0 / NSP : +0.7 (l'absence de visibilite est un risque) |

---

#### Q6 -- Question pivot par role (BRANCHEE)

**Q6F -- Fournisseur** (si Q1 = A)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous mis en place un systeme de gestion des risques pour le cycle de vie de vos systemes d'IA ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, formalise -- En cours de mise en place -- Non -- Je ne comprends pas la question |
| **Impact scoring** | Oui : 0 / En cours : +0.5 / Non : +1.5 / NSP : +1.0 |

**Q6D -- Deployeur** (si Q1 = B)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie la documentation technique fournie par vos fournisseurs de solutions IA ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, pour tous nos outils -- Partiellement -- Non -- Je ne savais pas que c'etait necessaire |
| **Impact scoring** | Oui : 0 / Partiellement : +0.5 / Non : +1.2 / NSP : +1.0 |

**Q6I -- Importateur** (si Q1 = C)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie que les systemes IA que vous importez portent un marquage CE et disposent d'une documentation de conformite ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, systematiquement -- Parfois -- Non -- Je decouvre cette obligation |
| **Impact scoring** | Oui : 0 / Parfois : +0.5 / Non : +1.5 / NSP : +1.2 |

**Q6R -- Distributeur** (si Q1 = D)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que les solutions IA que vous distribuez sont conformes avant de les commercialiser ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, toujours -- Partiellement -- Non -- Je ne savais pas que c'etait mon role |
| **Impact scoring** | Oui : 0 / Partiellement : +0.5 / Non : +1.0 / NSP : +0.8 |

**Q6X -- Indetermine** (si Q1 = E)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre entreprise a-t-elle deja identifie ses obligations legales en matiere d'intelligence artificielle ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui -- En partie -- Non, pas du tout -- Je ne savais pas qu'il y en avait |
| **Impact scoring** | Oui : 0 / En partie : +0.5 / Non : +1.2 / NSP : +1.5 |

**Condition d'affichage Q6** : Toujours (apres Q5). La variante affichee depend du role detecte en Q1.
**Routing Q6** : --> Q7 (commune)

---

#### Q7 -- Pratiques interdites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Utilisez-vous l'IA pour l'une de ces finalites ? (Cochez celles qui s'appliquent) |
| **Type** | Choix multiple (checkboxes) |
| **Options** | A. Evaluer ou noter des individus sur la base de leur comportement social / B. Exploiter les vulnerabilites de personnes (age, handicap...) pour influencer leurs decisions / C. Identifier des personnes par reconnaissance faciale en temps reel dans des espaces publics / D. Deduire les emotions de collaborateurs sur le lieu de travail / E. Classer des individus sur la base de donnees biometriques (origine, orientation...) / F. Aucune de ces pratiques |
| **Condition d'affichage** | Toujours (apres Q6) |
| **Routing** | --> Q8 |
| **Impact scoring** | Chaque option A-E cochee : +2.0 pts / "Aucune" : 0 pt / Si >=1 pratique cochee ET "Aucune" non cochee : flag CRITIQUE |

---

#### Q8 -- Systemes a haut risque

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes d'IA interviennent-ils dans l'un de ces domaines ? (Cochez ceux qui s'appliquent) |
| **Type** | Choix multiple (checkboxes) |
| **Options** | A. Recrutement, evaluation ou gestion des employes / B. Notation ou scoring de clients (credit, assurance...) / C. Acces a des services essentiels (energie, logement, prestations sociales...) / D. Education, notation ou orientation d'etudiants / E. Identification biometrique de personnes / F. Surveillance video ou securite dans des espaces publics / G. Aucun de ces domaines |
| **Condition d'affichage** | Toujours (apres Q7) |
| **Routing** | --> Q9 |
| **Impact scoring** | Chaque option A-F cochee : +1.0 pt / "Aucun" : 0 pt |

---

#### Q9 -- Transparence et information

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les personnes qui interagissent avec vos systemes d'IA savent-elles qu'elles ont affaire a une IA ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, nous les informons systematiquement -- Pas toujours -- Non -- La question ne s'applique pas a notre cas |
| **Condition d'affichage** | Toujours (apres Q8) |
| **Routing** | --> Q10 |
| **Impact scoring** | Oui : 0 / Pas toujours : +0.5 / Non : +1.0 / NA : 0 |

---

#### Q10 -- Surveillance humaine

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Un humain peut-il intervenir ou corriger les decisions prises par vos systemes d'IA ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, toujours -- Dans certains cas seulement -- Non, les decisions sont entierement automatisees -- Je ne sais pas |
| **Condition d'affichage** | Toujours (apres Q9) |
| **Routing** | --> Q11 |
| **Impact scoring** | Oui : 0 / Certains cas : +0.5 / Non : +1.2 / NSP : +0.8 |

---

#### Q11 -- Formation des equipes

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos equipes ont-elles ete formees a l'utilisation responsable des outils d'IA qu'elles manipulent ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, formation realisee -- Formation prevue mais pas encore realisee -- Non, aucune formation -- Nous n'avons pas identifie ce besoin |
| **Condition d'affichage** | Toujours (apres Q10) |
| **Routing** | --> Q12 |
| **Impact scoring** | Oui : 0 / Prevue : +0.3 / Non : +0.8 / Pas identifie : +1.0 |

---

#### Q12 -- Donnees personnelles et RGPD

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes d'IA traitent-ils des donnees personnelles (noms, images, donnees RH, donnees clients...) ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui -- Probablement -- Non -- Je ne sais pas |
| **Condition d'affichage** | Toujours (apres Q11) |
| **Routing** | Si "Oui" ou "Probablement" --> Q13 avec mention RGPD / Si "Non" ou "NSP" --> Q13 |
| **Impact scoring** | Oui ou Probablement : +0.3 (flag RGPD pour alertes) / Non : 0 / NSP : +0.3 |

---

#### Q13 -- IA generative et contenu synthetique

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Utilisez-vous des outils d'IA generative (chatbots, generateurs d'images, assistants de redaction...) ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, de maniere intensive -- Oui, occasionnellement -- Non -- En projet |
| **Condition d'affichage** | Toujours (apres Q12) |
| **Routing** | --> Q14 |
| **Impact scoring** | Intensive : +0.5 / Occasionnel : +0.3 / Non : 0 / En projet : +0.2 |

---

#### Q14 -- Niveau de preparation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous deja engage des demarches de mise en conformite avec l'AI Act ? |
| **Type** | Choix unique (radio) |
| **Options** | Oui, un audit complet a ete realise -- Nous avons commence a nous renseigner -- Non, nous n'avons rien initie -- Nous ne connaissions pas cette reglementation |
| **Condition d'affichage** | Toujours (apres Q13) |
| **Routing** | --> Q15 |
| **Impact scoring** | Audit complet : -0.5 (reduction) / Commence : 0 / Rien initie : +0.8 / Inconnue : +1.0 |

---

#### Q15 -- Urgence percue

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Quelle est votre echeance pour etre en conformite ? |
| **Type** | Choix unique (radio) |
| **Options** | Avant aout 2026 (echeance systemes haut risque) -- D'ici fin 2026 -- En 2027 -- Nous n'avons pas de calendrier defini |
| **Condition d'affichage** | Toujours (apres Q14) |
| **Routing** | --> Ecran de capture email --> Resultats |
| **Impact scoring** | Avant aout 2026 : 0 (deja mobilise) / Fin 2026 : +0.2 / 2027 : +0.3 / Pas de calendrier : +0.5 |

---

### Synthese du parcours

```
BLOC QUALIFICATION (Q1-Q5) ──> BLOC CONFORMITE (Q6-Q10) ──> BLOC CALIBRAGE (Q11-Q15)
         ~2 min                       ~2 min                        ~1 min
    Role, secteur,              Obligations cle,              Preparation, RGPD,
    taille, perimetre,          pratiques interdites,          IA generative,
    volume systemes             haut risque, transparence      urgence

                                        |
                                        v
                                [CAPTURE EMAIL]
                                Prenom + Email
                                        |
                                        v
                                   RESULTATS
                              Score /10 + Alertes
                              + Offre recommandee
```

---

## B. LOGIQUE DE SCORING /10

### Principes

- **Score brut** : somme des points de risque accumules sur les 15 questions (echelle brute 0 a ~18 pts max theorique)
- **Score normalise** : ramene sur une echelle /10 via une formule de plafonnement
- **Multiplicateurs** : appliques selon le role, le secteur et la taille

### Formule de calcul

```
score_brut = somme(points_risque_Q1..Q15)

multiplicateur_role =
  FOURNISSEUR   : 1.20
  IMPORTATEUR   : 1.10
  DEPLOYEUR     : 1.05
  DISTRIBUTEUR  : 1.00
  INDETERMINE   : 1.15  (l'incertitude est un facteur aggravant)

multiplicateur_secteur =
  Finance / Sante / RH / Education / Administration : 1.20
  Industrie / Transport / Energie                   : 1.10
  Autres                                            : 1.00

multiplicateur_taille =
  Grand groupe (5000+)  : 1.10
  ETI (250-4999)        : 1.05
  PME / TPE             : 1.00

score_ajuste = score_brut * multiplicateur_role * multiplicateur_secteur * multiplicateur_taille

score_final = min(10, round(score_ajuste, 1))
```

### Baremes de points par question (recapitulatif)

| Question | Reponse a risque | Points |
|----------|------------------|--------|
| Q1 | (pas de points directs) | 0 |
| Q2 | Secteur sensible | via multiplicateur |
| Q3 | Taille ETI/GE | via multiplicateur |
| Q4 | "Non" (pas dans l'UE) | -1.0 |
| Q4 | "Je ne suis pas certain(e)" | +0.5 |
| Q5 | Plus de 10 systemes | +1.0 |
| Q5 | NSP | +0.7 |
| Q6 | Non / NSP (selon variante) | +1.0 a +1.5 |
| Q7 | Chaque pratique interdite | +2.0 |
| Q8 | Chaque domaine haut risque | +1.0 |
| Q9 | Non (pas de transparence) | +1.0 |
| Q10 | Pas de surveillance humaine | +1.2 |
| Q11 | Pas de formation | +0.8 a +1.0 |
| Q12 | Donnees perso + pas de RGPD | +0.3 |
| Q13 | IA generative intensive | +0.5 |
| Q14 | Aucune demarche / inconnue | +0.8 a +1.0 |
| Q15 | Pas de calendrier | +0.5 |

### Seuils de risque

| Score /10 | Niveau | Couleur | Interpretation |
|-----------|--------|---------|----------------|
| 0 -- 3 | **FAIBLE** | Vert (#16a34a) | Exposition limitee. Quelques points de vigilance. Une veille reglementaire est recommandee. |
| 4 -- 5 | **MODERE** | Jaune (#f59e0b) | Lacunes identifiees. Un diagnostic flash vous permettrait de les cartographier precisement. |
| 6 -- 7 | **ELEVE** | Orange (#f97316) | Manquements significatifs detectes. Un diagnostic approfondi est fortement recommande avant les echeances. |
| 8 -- 10 | **CRITIQUE** | Rouge (#dc2626) | Exposition tres elevee. Des actions correctives immediates sont necessaires pour eviter les sanctions. |

---

## C. CATALOGUE D'ALERTES PERSONNALISEES

Chaque alerte est declenchee par une condition specifique. Le systeme selectionne les 3 a 5 alertes les plus pertinentes selon le profil et les affiche apres la capture email.

### Alertes liees aux pratiques interdites (Q7)

| # | Condition | Message d'alerte | Reference |
|---|-----------|-------------------|-----------|
| A1 | Q7.A cochee (scoring social) | **Alerte critique** -- Le scoring social est interdit depuis le 2 fevrier 2025. Les amendes atteignent 35 M EUR ou 7 % du CA mondial. Une mise en conformite immediate est indispensable. | Art. 5(1)(c) |
| A2 | Q7.B cochee (exploitation vulnerabilites) | **Alerte critique** -- L'utilisation de l'IA pour exploiter les vulnerabilites de personnes (age, handicap, situation sociale) est une pratique prohibee depuis fevrier 2025. | Art. 5(1)(b) |
| A3 | Q7.C cochee (reconnaissance faciale TR) | **Alerte critique** -- L'identification biometrique en temps reel dans des espaces publics est interdite sauf exceptions strictement encadrees (autorite judiciaire). | Art. 5(1)(h) |
| A4 | Q7.D cochee (inference emotions travail) | **Alerte critique** -- La detection des emotions sur le lieu de travail et dans les etablissements d'enseignement est prohibee par l'AI Act. | Art. 5(1)(f) |
| A5 | Q7.E cochee (categorisation biometrique) | **Alerte critique** -- La classification de personnes sur la base de donnees biometriques sensibles (origine ethnique, orientation sexuelle...) est interdite. | Art. 5(1)(g) |

### Alertes liees aux systemes haut risque (Q8)

| # | Condition | Message d'alerte | Reference |
|---|-----------|-------------------|-----------|
| A6 | Q8.A cochee (RH/recrutement) | **Attention** -- Les systemes d'IA utilises pour le recrutement, l'evaluation ou la gestion des employes sont classes "haut risque". Obligations renforcees applicables des aout 2026 : documentation technique, FRIA, surveillance humaine. | Annexe III, pt 4 |
| A7 | Q8.B cochee (scoring credit) | **Attention** -- Le scoring de solvabilite et l'evaluation de credit par IA sont des systemes "haut risque". La conformite a l'Annexe III est exigee. | Annexe III, pt 5 |
| A8 | Q8.C cochee (services essentiels) | **Attention** -- L'IA intervenant dans l'acces aux services essentiels est classee "haut risque". Une evaluation d'impact (FRIA) est obligatoire pour les deployeurs. | Annexe III, pt 5 ; Art. 27 |
| A9 | Q8.D cochee (education) | **Attention** -- Les systemes de notation, d'orientation ou de surveillance dans l'education sont "haut risque". Documentation et surveillance humaine obligatoires. | Annexe III, pt 3 |
| A10 | Q8.E cochee (biometrie) | **Attention** -- Les systemes d'identification biometrique sont classes "haut risque". Des exigences strictes s'appliquent en matiere de donnees, de transparence et de controle humain. | Annexe III, pt 1 |
| A11 | Q8.F cochee (surveillance video) | **Attention** -- La surveillance video assistee par IA dans les espaces publics releve du haut risque. Vous etes soumis aux obligations de l'Art. 6(1) et de l'Annexe III. | Art. 6(1) |

### Alertes liees aux lacunes de conformite (Q9-Q11)

| # | Condition | Message d'alerte | Reference |
|---|-----------|-------------------|-----------|
| A12 | Q9 = "Non" | **Obligation non respectee** -- L'AI Act impose d'informer les personnes qu'elles interagissent avec un systeme d'IA. Cette obligation de transparence est deja en vigueur. | Art. 50(1) |
| A13 | Q10 = "Non" ET Q8 >=1 haut risque | **Risque eleve** -- Pour les systemes haut risque, une supervision humaine effective est obligatoire. L'absence totale de controle humain constitue un manquement majeur. | Art. 14 ; Art. 26(1) |
| A14 | Q11 = "Non" ou "Pas identifie" | **Lacune detectee** -- L'AI Act exige que toute personne manipulant un systeme d'IA dispose d'un niveau suffisant de maitrise de l'IA. La formation est une obligation legale. | Art. 4 |

### Alertes liees au contexte (Q12-Q15)

| # | Condition | Message d'alerte | Reference |
|---|-----------|-------------------|-----------|
| A15 | Q12 = "Oui" ou "Probablement" | **Point de vigilance** -- Vos systemes d'IA traitent des donnees personnelles. L'AI Act s'articule avec le RGPD : vous devez garantir la conformite a ces deux reglements simultanement. | Art. 2(7) ; RGPD 2016/679 |
| A16 | Q13 = "Intensive" ou "Occasionnel" | **Obligation de transparence** -- L'utilisation d'IA generative (chatbots, generateurs de contenus) impose de marquer les contenus generes par IA et d'en informer les utilisateurs. | Art. 50(2) |
| A17 | Q14 = "Rien initie" ou "Inconnue" | **Urgence** -- Vous n'avez engage aucune demarche de conformite alors que plusieurs obligations sont deja en vigueur et que l'echeance d'aout 2026 approche. Le risque d'amende est reel. | Art. 99 ; Art. 113 |
| A18 | Q15 = "Pas de calendrier" ET score >= 6 | **Alerte calendrier** -- Sans calendrier defini et avec un niveau de risque eleve, votre entreprise pourrait ne pas etre conforme avant l'entree en application des obligations haut risque le 2 aout 2026. | Art. 113(1) |

### Alertes liees au role (Q1 + Q6)

| # | Condition | Message d'alerte | Reference |
|---|-----------|-------------------|-----------|
| A19 | Q1 = Fournisseur ET Q6F = "Non" | **Risque fournisseur** -- En tant que fournisseur de systemes d'IA, l'absence de systeme de gestion des risques vous expose a des obligations non remplies parmi les plus lourdes du reglement. | Art. 9 |
| A20 | Q1 = Indetermine | **Role a clarifier** -- Vous n'avez pas pu identifier votre role au sens de l'AI Act. C'est un signal : un diagnostic precis de votre position dans la chaine de valeur IA est necessaire pour determiner vos obligations exactes. | Art. 3 (definitions) |

### Priorite d'affichage des alertes

```
SI pratique_interdite_detectee :
    afficher A1..A5 concernees EN PREMIER (max 2)

PUIS alertes_haut_risque triees par score_impact :
    afficher A6..A11 concernees (max 2)

PUIS alerte_la_plus_pertinente parmi A12..A20 :
    afficher 1 alerte contextuelle

TOTAL : 3 a 5 alertes affichees maximum
```

---

## D. MATRICE DE RECOMMANDATION D'OFFRES

### Matrice principale : [Role] x [Score /10]

| Score \ Role | DEPLOYEUR | FOURNISSEUR | IMPORTATEUR | DISTRIBUTEUR | INDETERMINE |
|-------------|-----------|-------------|-------------|--------------|-------------|
| **0 -- 3 (Faible)** | Veille (190 EUR/mois) | Veille (190 EUR/mois) | Veille (190 EUR/mois) | Veille (190 EUR/mois) | Diagnostic Flash (990 EUR) |
| **4 -- 5 (Modere)** | Diagnostic Flash (990 EUR) | Diagnostic Flash (990 EUR) | Diagnostic Flash (990 EUR) | Diagnostic Flash (990 EUR) | Diagnostic Flash (990 EUR) |
| **6 -- 7 (Eleve)** | Diag. Strategique (2 490 EUR) | Roadmap Fournisseur (6 990 EUR) | Pack Importateur (4 990 EUR) | Pack Distributeur (2 490 EUR) | Diag. Strategique (2 490 EUR) |
| **8 -- 10 (Critique)** | Pack Conformite+ (6 990 EUR) | Conformite Fournisseur (35 000 EUR+) | Pack Importateur (4 990 EUR) | Pack Distributeur (2 490 EUR) | Diag. Premium (6 490 EUR) |

### Ajustements sectoriels

| Secteur | Impact | Argumentaire additionnel |
|---------|--------|--------------------------|
| **Finance / Assurance** | Priorite haute, mention DORA | "Vos systemes de scoring sont haut risque ET soumis a DORA. La double conformite est un enjeu strategique." |
| **Sante / MedTech** | Priorite haute, mention MDR | "Les dispositifs medicaux integrant de l'IA cumulent les exigences AI Act et MDR (2017/745). Un accompagnement specialise est indispensable." |
| **RH** | Priorite moyenne-haute | "Les systemes de recrutement et d'evaluation automatises sont au coeur du reglement. Vos obligations entrent en application en aout 2026." |
| **Education** | Priorite moyenne-haute | "La notation et l'orientation assistees par IA sont classees haut risque. L'echeance d'aout 2026 s'applique." |
| **Administration** | Priorite elevee | "Les administrations publiques sont soumises a des obligations renforcees, notamment en matiere de FRIA et de registre public." |

### Matrice detaillee : [Role] x [Score] x [Secteur] --> [Offre] + [Argumentaire]

| Role | Score | Secteur | Offre recommandee | Offre secondaire | Argumentaire cle |
|------|-------|---------|-------------------|------------------|-------------------|
| Deployeur | 0-3 | Tous | Veille (190 EUR/mois) | Diag. Flash (990 EUR) | "Votre exposition semble limitee. Restez informe des evolutions reglementaires pour anticiper." |
| Deployeur | 4-5 | Standard | Diag. Flash (990 EUR) | Pack Conformite (3 990 EUR) | "Des lacunes ont ete identifiees. Un diagnostic de 2h vous donnera une feuille de route claire." |
| Deployeur | 4-5 | Finance/Sante | Diag. Flash (990 EUR) | Pack Conformite (3 990 EUR) | "Votre secteur sensible renforce l'urgence. Un diagnostic cible est le premier pas." |
| Deployeur | 6-7 | Standard | Diag. Strategique (2 490 EUR) | Pack Conformite+ (6 990 EUR) | "Manquements significatifs detectes. Un diagnostic approfondi avec plan d'action est recommande avant les echeances." |
| Deployeur | 6-7 | Finance/Sante | Diag. Strategique (2 490 EUR) | Pack Conformite+ (6 990 EUR) | "Votre secteur reglemente necessite un accompagnement approfondi. Conformite croisee AI Act + sectoriel." |
| Deployeur | 8-10 | Tous | Pack Conformite+ (6 990 EUR) | Compliance Officer (890 EUR/mois) | "Risque critique : des actions correctives immediates sont necessaires. Nous vous accompagnons de A a Z." |
| Fournisseur | 0-3 | Tous | Veille (190 EUR/mois) | Diag. Flash (990 EUR) | "Bon niveau de preparation. Maintenez votre conformite avec notre veille." |
| Fournisseur | 4-5 | Tous | Diag. Flash (990 EUR) | Roadmap Fournisseur (6 990 EUR) | "En tant que fournisseur, vos obligations sont parmi les plus lourdes. Un diagnostic vous evitera les angles morts." |
| Fournisseur | 6-7 | Tous | Roadmap Fournisseur (6 990 EUR) | Conformite Fournisseur (35 000 EUR+) | "Votre feuille de route conformite doit couvrir gestion des risques, documentation technique, QMS et post-marche." |
| Fournisseur | 8-10 | Tous | Conformite Fournisseur (35 000 EUR+) | Certification Ready (45-70k EUR) | "Situation critique pour un fournisseur. Un accompagnement complet est necessaire pour atteindre la conformite." |
| Importateur | 0-3 | Tous | Veille (190 EUR/mois) | Diag. Flash (990 EUR) | "Maintenez votre vigilance sur la conformite des systemes que vous importez." |
| Importateur | 4-5 | Tous | Diag. Flash (990 EUR) | Pack Importateur (4 990 EUR) | "Des obligations specifiques s'appliquent a votre role. Un diagnostic clarifiera vos responsabilites." |
| Importateur | 6-10 | Tous | Pack Importateur (4 990 EUR) | Compliance Officer (890 EUR/mois) | "En tant qu'importateur, vous etes garant de la conformite des systemes IA entrant dans l'UE." |
| Distributeur | 0-3 | Tous | Veille (190 EUR/mois) | Diag. Flash (990 EUR) | "Votre exposition est moderee. La veille reglementaire reste recommandee." |
| Distributeur | 4-5 | Tous | Diag. Flash (990 EUR) | Pack Distributeur (2 490 EUR) | "Quelques points de conformite a verifier sur les solutions que vous commercialisez." |
| Distributeur | 6-10 | Tous | Pack Distributeur (2 490 EUR) | Compliance Officer (890 EUR/mois) | "Des manquements ont ete detectes dans votre chaine de distribution IA. Une mise en conformite est recommandee." |
| Indetermine | 0-3 | Tous | Diag. Flash (990 EUR) | Veille (190 EUR/mois) | "Votre role exact n'est pas clair. Un diagnostic permettra d'identifier vos obligations precises." |
| Indetermine | 4-10 | Tous | Diag. Strategique (2 490 EUR) | Diag. Flash (990 EUR) | "Sans role clairement identifie et avec un risque detecte, un accompagnement approfondi est votre meilleure protection." |

### Logique d'affichage

```
1. OFFRE RECOMMANDEE (badge "RECOMMANDE POUR VOUS", card mise en avant)
   --> determinee par matrice [role x score x secteur]

2. OFFRE SECONDAIRE (affichee a cote, sans badge)
   --> offre immediatement superieure ou inferieure

3. COMPARATEUR DE PRIX (toujours visible)
   "Avocats specialises : 5 000 - 15 000 EUR"
   "Big Four : 20 000 - 50 000 EUR"
   "Complia : a partir de 990 EUR"

4. CTA PRINCIPAL : "Reserver un appel decouverte gratuit (20 min)" --> Calendly
5. CTA SECONDAIRE : "Nous contacter par email"

6. MENTION DEDUCTIBILITE :
   "Le cout du diagnostic est deductible de tout pack conformite signe sous 30 jours."
```

---

# LIVRABLE 2 -- CONTENU DES QUESTIONS

Les 15 questions dans l'ordre d'apparition, avec formulation exacte, options et notes internes.

---

### BLOC 1 -- QUALIFICATION (Q1-Q5)

---

**QUESTION 1**

> Quel est le rapport de votre entreprise avec l'intelligence artificielle ?

- A. Nous developpons ou entrainons des systemes d'IA
- B. Nous utilisons des outils integrant de l'IA
- C. Nous importons des solutions IA de l'exterieur de l'UE
- D. Nous revendons ou distribuons des solutions IA
- E. Je ne suis pas sur(e)

[Note interne : Question de routage. Determine le role au sens de l'Art. 3 du Reglement. Impact : pas de points directs, mais conditionne le multiplicateur de role et la variante de Q6. Le choix E (Indetermine) declenche un multiplicateur aggravant x1.15 car l'absence de visibilite sur son propre role est un facteur de risque. Peut generer l'alerte A20.]

---

**QUESTION 2**

> Dans quel secteur votre entreprise evolue-t-elle principalement ?

- Technologie / SaaS
- Finance / Assurance
- Sante / MedTech
- Ressources humaines
- Education / Formation
- Juridique
- Commerce / Retail
- Industrie / Manufacturing
- Transport / Logistique
- Energie
- Immobilier
- Media / Communication
- Administration publique
- Autre

[Note interne : Qualification sectorielle. Les 5 secteurs sensibles (Finance, Sante, RH, Education, Administration) declenchent un multiplicateur x1.20 sur le score brut. Industrie/Transport/Energie : x1.10. Autres : x1.00. Ce multiplicateur reflete les obligations renforcees liees a l'Annexe III et aux reglementations croisees (DORA, MDR). Contribue a l'argumentaire sectoriel dans l'offre recommandee.]

---

**QUESTION 3**

> Combien de collaborateurs compte votre entreprise ?

- Moins de 10 (TPE)
- 10 a 249 (PME)
- 250 a 4 999 (ETI)
- 5 000 et plus (Grand groupe)

[Note interne : Calibrage du risque par taille. ETI x1.05, Grand groupe x1.10. Les grandes structures ont plus de systemes IA deployes et des obligations de gouvernance renforcees. Permet aussi de calibrer le plafond de sanction (Art. 99 : % du CA mondial). Pas d'alerte directe, mais impacte le score final.]

---

**QUESTION 4**

> Vos produits ou services touchent-ils des utilisateurs dans l'Union europeenne ?

- Oui, exclusivement
- Oui, en partie
- Non, aucune activite dans l'UE
- Je ne suis pas certain(e)

[Note interne : Verification du perimetre d'application. L'Art. 2 du Reglement a un effet extraterritorial : meme une entreprise hors UE est concernee si ses systemes IA impactent des personnes dans l'UE. "Non" donne un leger bonus (-1 pt) mais ne disqualifie pas. "NSP" : +0.5 pt. Peut generer un message d'alerte specifique sur l'extraterritorialite.]

---

**QUESTION 5**

> Combien de systemes ou outils integrant de l'IA sont utilises dans votre organisation ?

- Aucun a ma connaissance
- 1 a 2
- 3 a 5
- 6 a 10
- Plus de 10
- Je ne sais pas

[Note interne : Indicateur du perimetre de conformite. Plus le volume est eleve, plus le risque est important. "NSP" score presque autant que "Plus de 10" car l'absence d'inventaire est en soi un manquement (Art. 26(1) pour les deployeurs). Scoring : 0 / +0.3 / +0.5 / +0.8 / +1.0 / +0.7.]

---

### BLOC 2 -- DETECTION DE NON-CONFORMITES (Q6-Q10)

---

**QUESTION 6** (variante selon le role detecte en Q1)

**Si Fournisseur (Q1=A) :**

> Avez-vous mis en place un systeme de gestion des risques pour le cycle de vie de vos systemes d'IA ?

- Oui, formalise
- En cours de mise en place
- Non
- Je ne comprends pas la question

[Note interne : Art. 9 -- Systeme de gestion des risques. Obligation centrale du fournisseur. "Non" ou "NSP" declenche l'alerte A19. Scoring : 0 / +0.5 / +1.5 / +1.0.]

**Si Deployeur (Q1=B) :**

> Avez-vous verifie la documentation technique fournie par vos fournisseurs de solutions IA ?

- Oui, pour tous nos outils
- Partiellement
- Non
- Je ne savais pas que c'etait necessaire

[Note interne : Art. 26(1) -- Obligation de verification du deployeur. "Non" ou "NSP" indique un manquement a une obligation deja applicable. Scoring : 0 / +0.5 / +1.2 / +1.0.]

**Si Importateur (Q1=C) :**

> Avez-vous verifie que les systemes IA que vous importez portent un marquage CE et disposent d'une documentation de conformite ?

- Oui, systematiquement
- Parfois
- Non
- Je decouvre cette obligation

[Note interne : Art. 23 -- Obligations des importateurs. Le marquage CE et la doc de conformite sont des pre-requis avant mise sur le marche. Scoring : 0 / +0.5 / +1.5 / +1.2.]

**Si Distributeur (Q1=D) :**

> Verifiez-vous que les solutions IA que vous distribuez sont conformes avant de les commercialiser ?

- Oui, toujours
- Partiellement
- Non
- Je ne savais pas que c'etait mon role

[Note interne : Art. 24 -- Obligations des distributeurs. Le distributeur doit verifier marquage CE, notice et conformite du fournisseur/importateur. Scoring : 0 / +0.5 / +1.0 / +0.8.]

**Si Indetermine (Q1=E) :**

> Votre entreprise a-t-elle deja identifie ses obligations legales en matiere d'intelligence artificielle ?

- Oui
- En partie
- Non, pas du tout
- Je ne savais pas qu'il y en avait

[Note interne : Question generique pour les profils n'ayant pas su identifier leur role. Le "Non" total ou l'ignorance du cadre reglementaire sont des signaux d'alerte forts. Scoring : 0 / +0.5 / +1.2 / +1.5. Renforce l'alerte A20.]

---

**QUESTION 7**

> Utilisez-vous l'IA pour l'une de ces finalites ? (Cochez tout ce qui s'applique)

- A. Evaluer ou noter des individus sur la base de leur comportement social
- B. Exploiter les vulnerabilites de personnes (age, handicap...) pour influencer leurs decisions
- C. Identifier des personnes par reconnaissance faciale en temps reel dans des espaces publics
- D. Deduire les emotions de collaborateurs sur le lieu de travail
- E. Classer des individus sur la base de donnees biometriques (origine, orientation...)
- F. Aucune de ces pratiques

[Note interne : Detection des pratiques interdites (Art. 5). Question la plus critique du questionnaire. Chaque item A-E coche = +2.0 pts + flag CRITIQUE + alerte A1-A5 correspondante. En vigueur depuis le 2 fevrier 2025. Amendes : 35M EUR ou 7 % CA mondial. "Aucune" = 0 pt. La formulation volontairement descriptive (pas de jargon juridique) permet aux non-experts de se reconnaitre.]

---

**QUESTION 8**

> Vos systemes d'IA interviennent-ils dans l'un de ces domaines ? (Cochez tout ce qui s'applique)

- A. Recrutement, evaluation ou gestion des employes
- B. Notation ou scoring de clients (credit, assurance...)
- C. Acces a des services essentiels (energie, logement, prestations sociales...)
- D. Education, notation ou orientation d'etudiants
- E. Identification biometrique de personnes
- F. Surveillance video ou securite dans des espaces publics
- G. Aucun de ces domaines

[Note interne : Detection des systemes haut risque (Annexe III). Chaque item A-F coche = +1.0 pt + alerte A6-A11 correspondante. L'echeance pour les systemes haut risque est le 2 aout 2026. Le cumul de plusieurs domaines aggrave fortement le score. "Aucun" = 0 pt.]

---

**QUESTION 9**

> Les personnes qui interagissent avec vos systemes d'IA savent-elles qu'elles ont affaire a une IA ?

- Oui, nous les informons systematiquement
- Pas toujours
- Non
- La question ne s'applique pas a notre cas

[Note interne : Obligation de transparence (Art. 50(1)). Applicable a TOUS les roles depuis aout 2025. "Non" = +1.0 pt + alerte A12. "Pas toujours" = +0.5. "NA" = 0 (mais verifie en diagnostic). Question simple mais revelatrice : beaucoup d'entreprises deployent des chatbots ou outils IA sans en informer les utilisateurs.]

---

**QUESTION 10**

> Un humain peut-il intervenir ou corriger les decisions prises par vos systemes d'IA ?

- Oui, toujours
- Dans certains cas seulement
- Non, les decisions sont entierement automatisees
- Je ne sais pas

[Note interne : Surveillance humaine (Art. 14 pour fournisseurs, Art. 26(1) pour deployeurs). Obligation renforcee pour les systemes haut risque. "Non" + systemes HR (Q8) = alerte A13. Scoring : 0 / +0.5 / +1.2 / +0.8. L'automatisation totale sans supervision est l'un des risques les plus eleves sous l'AI Act.]

---

### BLOC 3 -- CALIBRAGE RISQUE ET URGENCE (Q11-Q15)

---

**QUESTION 11**

> Vos equipes ont-elles ete formees a l'utilisation responsable des outils d'IA qu'elles manipulent ?

- Oui, formation realisee
- Formation prevue mais pas encore realisee
- Non, aucune formation
- Nous n'avons pas identifie ce besoin

[Note interne : Maitrise de l'IA (Art. 4). Obligation applicable a TOUS les operateurs depuis fevrier 2025. "Non" ou "Pas identifie" declenchent l'alerte A14. L'obligation de formation est souvent meconnue et facile a detecter. Scoring : 0 / +0.3 / +0.8 / +1.0.]

---

**QUESTION 12**

> Vos systemes d'IA traitent-ils des donnees personnelles (noms, images, donnees RH, donnees clients...) ?

- Oui
- Probablement
- Non
- Je ne sais pas

[Note interne : Articulation AI Act / RGPD (Art. 2(7)). Si "Oui" ou "Probablement" : flag RGPD + alerte A15. Scoring modere (+0.3) car la question ne mesure pas la non-conformite RGPD en tant que telle, mais signale le risque de double exposition. Le diagnostic complet approfondira ce point.]

---

**QUESTION 13**

> Utilisez-vous des outils d'IA generative (chatbots, generateurs d'images, assistants de redaction...) ?

- Oui, de maniere intensive
- Oui, occasionnellement
- Non
- En projet

[Note interne : IA generative et obligations de transparence (Art. 50(2)). Usage intensif ou occasionnel declenche l'alerte A16 sur le marquage des contenus generes par IA. Scoring leger (+0.2 a +0.5) car il s'agit de risque limite, pas haut risque. Mais la quasi-totalite des entreprises sont concernees, donc tres utile pour la qualification lead.]

---

**QUESTION 14**

> Avez-vous deja engage des demarches de mise en conformite avec l'AI Act ?

- Oui, un audit complet a ete realise
- Nous avons commence a nous renseigner
- Non, nous n'avons rien initie
- Nous ne connaissions pas cette reglementation

[Note interne : Mesure de la maturite et qualification lead. "Rien initie" ou "Inconnue" = alerte A17 + scoring +0.8 a +1.0. "Audit complet" = -0.5 (bonus). Cette question est aussi un indicateur commercial : les profils "Rien initie" et "Inconnue" sont les leads les plus chauds car l'urgence est maximale. Les "Commence" sont des leads mid-funnel.]

---

**QUESTION 15**

> Quelle est votre echeance pour etre en conformite ?

- Avant aout 2026 (echeance systemes haut risque)
- D'ici fin 2026
- En 2027
- Nous n'avons pas de calendrier defini

[Note interne : Qualification de l'urgence et timing commercial. "Pas de calendrier" + score >= 6 = alerte A18. Scoring : 0 / +0.2 / +0.3 / +0.5. La reponse conditionne aussi le ton de l'offre recommandee : "Avant aout 2026" = lead tres chaud, "2027" = lead warm, "Pas de calendrier" = lead a eduquer puis convertir. Information transmise a l'equipe commerciale dans le CRM.]

---

## ANNEXES

### Annexe 1 -- Ecran de capture email (entre Q15 et resultats)

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   Votre score est pret.                                  │
│                                                          │
│   Renseignez vos coordonnees pour acceder                │
│   a votre diagnostic personnalise.                       │
│                                                          │
│   Prenom *         [___________________________]         │
│   Email pro *      [___________________________]         │
│   Telephone        [___________________________]         │
│                                                          │
│   [ ] J'accepte de recevoir des informations             │
│       sur la conformite AI Act (optionnel)               │
│                                                          │
│   [   Acceder a mon diagnostic   ]                       │
│                                                          │
│   Vos donnees sont traitees conformement a               │
│   notre politique de confidentialite.                     │
│   Nous ne les partageons jamais avec des tiers.          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Champs obligatoires** : Prenom, Email
**Champ optionnel** : Telephone
**Consentement marketing** : Opt-in explicite (RGPD)
**Action** : Soumission --> creation Lead en DB --> affichage page resultats

### Annexe 2 -- Structure de la page resultats

```
1. SCORE /10 (jauge circulaire animee)
   - Couleur selon le seuil (vert/jaune/orange/rouge)
   - Niveau en texte : "FAIBLE" / "MODERE" / "ELEVE" / "CRITIQUE"
   - Phrase d'accroche contextuelle

2. ROLE DETECTE
   - Badge : "FOURNISSEUR" / "DEPLOYEUR" / "IMPORTATEUR" / "DISTRIBUTEUR" / "A DETERMINER"
   - Reference article

3. ALERTES PERSONNALISEES (3 a 5 alertes)
   - Icone de severite (critique / attention / vigilance)
   - Message court
   - Reference article
   - Pour chaque alerte : "En savoir plus" --> lien blog Complia

4. OFFRE RECOMMANDEE
   - Card mise en avant avec badge "RECOMMANDE POUR VOUS"
   - Prix, description, benefices cles
   - CTA : "Reserver un appel decouverte gratuit (20 min)"
   - Offre secondaire a cote

5. COMPARATEUR DE PRIX
   - Avocats / Big Four / Complia

6. DISCLAIMER
   - "Ce pre-diagnostic est indicatif et ne constitue pas un avis juridique.
     Il vise a identifier les principaux axes de risque. Seul un diagnostic
     complet permettra d'etablir votre situation de conformite exacte."
```

### Annexe 3 -- Donnees transmises au CRM apres soumission

| Champ | Source | Usage |
|-------|--------|-------|
| prenom | Formulaire gate | Personnalisation |
| email | Formulaire gate | Lead nurturing |
| telephone | Formulaire gate (opt.) | Relance commerciale |
| role_detecte | Q1 | Segmentation |
| secteur | Q2 | Segmentation |
| taille | Q3 | Segmentation |
| score_10 | Moteur scoring | Priorisation |
| niveau_risque | Seuils | Priorisation |
| alertes[] | Moteur alertes | Personnalisation relance |
| offre_recommandee | Matrice offre | Pipeline commercial |
| reponses_brutes | Q1-Q15 | Contexte pour le consultant |
| source | "pre-audit-express" | Attribution |
| timestamp | Serveur | Tracking |
| consentement_marketing | Opt-in | RGPD |
