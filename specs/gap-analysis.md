# GAP ANALYSIS -- DeepSEARCH vs. Complia App vs. AI Act officiel

**Date** : 26 mars 2026
**Auteur** : Analyse automatisee (Claude Opus 4.6)
**Sources** :
- Formulaire DeepSEARCH (Gold Standard v2.0)
- Application Complia (index.html + app.js, 7 sections, ~35 questions)
- Specs internes (03-pre-audit-complet.md = 15 questions, 04-diagnostic-complet.md = 35+ questions/role)
- Reglement (UE) 2024/1689 -- texte officiel (144 pages)

---

## SYNTHESE EXECUTIVE

| Critere | DeepSEARCH | App Complia actuelle | Specs 03 (pre-audit) | Specs 04 (diagnostic) |
|---------|------------|---------------------|----------------------|----------------------|
| Nombre de questions | ~200+ | ~35 | 15 | ~120 (35/role) |
| Pratiques interdites Art. 5 | 10 sous-sections (a-j) | 8 questions | 1 question (Q7) | 8 questions |
| Classification haut-risque | 8 categories Annexe III detaillees | 1 question multichoix | 1 question (Q8) | Noeud 5 (8 domaines) |
| Exemptions Art. 6(3) | Section complete avec profilage kill-switch | Absent (seulement derogation simple) | Absent | Noeud 6 (4 criteres) |
| GPAI Art. 51-56 | Section complete (standard + risque systemique) | 3 questions basiques | 1 question (Q13) | Noeud 8 (detaille) |
| Audit fournisseur Art. 8-17 | 102 points sur 11 articles | ~5 questions dans section 2b | Via Q6F | Q-F-01 a Q-F-35 |
| Audit deployeur Art. 26 | Section 4-B complete (FRIA detaillee) | ~5 questions (data-role=deployeur) | Via Q6D | Q-D-01 a Q-D-30 |
| Audit importateur Art. 23 | Absent (mentionne dans matrice) | 0 | Via Q6I | Q-I-01 a Q-I-10 |
| Audit distributeur Art. 24 | Absent (mentionne dans matrice) | 0 | Via Q6R | Q-R-01 a Q-R-15 |
| Perimetre territorial Art. 2 | Q0.6 (pays UE/EEE) | Q4 (1 question) | Q4 | Noeud 0 |
| Definition systeme IA Art. 3(1) | Q0.4 + 3 sous-questions | Absent | Absent | Noeud 1 |
| Basculement role Art. 25 | Section 0-BIS complete | Absent | Absent | Noeud 7 |
| FRIA Art. 27 | 7 questions detaillees (6 elements obligatoires) | 1 question (fria) | Absent | Q-D-11 a Q-D-13 |
| Post-market Art. 72 | 5 questions | 0 | Absent | Q-F-26 a Q-F-29 |
| Sanctions Art. 99 | Mentionne dans alertes | Mentionne dans hero | Alertes | Alertes |

---

# A. QUESTIONS PRESENTES DANS DeepSEARCH MAIS ABSENTES DE L'APP ACTUELLE

## A.1 -- Questions fondamentales de perimetre (CRITIQUES)

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A01 | **Q0.3.bis** -- Exclusions champ d'application (securite nationale, recherche, usage personnel) | Art. 2(2)(8)(10) | CRITIQUE -- sans cette question, on risque d'auditer un systeme hors perimetre | ABSENT |
| GAP-A02 | **Q0.4** -- Le systeme utilise-t-il l'IA au sens Art. 3(1) ? (avec definition legale) | Art. 3(1) | CRITIQUE -- prerequis juridique avant toute analyse | ABSENT |
| GAP-A03 | **Q0.4.1-3** -- Sous-questions de qualification IA (outputs, autonomie, techniques Annexe I) | Art. 3(1), Annexe I | ELEVE -- red flags si pas systeme IA | ABSENT |
| GAP-A04 | **Q0.7** -- Statut developpement systeme (conception/dev/test/production/commercialise) | Art. 6, 99 | ELEVE -- determine urgence conformite | ABSENT |
| GAP-A05 | **Q0.8** -- Date mise sur marche / mise en service (croisee avec calendrier AI Act) | Art. 99 | ELEVE -- echeances differentes selon date | ABSENT |

## A.2 -- Basculement de role Art. 25 (CRITIQUE)

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A06 | **Q0-BIS.1** -- Rebranding, modification objectif prevu, modification substantielle | Art. 25(1)(a-c) | CRITIQUE -- un deployeur peut devenir fournisseur sans le savoir | ABSENT |
| GAP-A07 | **Q0-BIS.1.1** -- Confirmation basculement fournisseur | Art. 25 | CRITIQUE -- change toutes les obligations applicables | ABSENT |
| GAP-A08 | **Q0-BIS.2** -- Nature de la modification substantielle (texte libre) | Art. 3(68), 25 | ELEVE -- tracabilite audit | ABSENT |
| GAP-A09 | **Q0-BIS.3** -- Accord contractuel rebranding (exemption possible) | Art. 25(a) | MODERE -- exemption etroite | ABSENT |

## A.3 -- Pratiques interdites -- Sous-questions manquantes

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A10 | **Q1.1.2-3** -- Exceptions biometrie temps reel (autorite repressive + 4 conditions cumulatives) | Art. 5(2)(3) | ELEVE -- determine si prohibition ou exception | ABSENT (app dit juste oui/non) |
| GAP-A11 | **Q1.3.2-3** -- Contexte emotions (travail vs medical/securite = exception) | Art. 5(1)(f) | ELEVE -- faux positifs possibles sans exception | ABSENT |
| GAP-A12 | **Q1.5.3-4** -- Evaluation risque infraction : evaluation prealable objective + support humain | Art. 5(1)(e) | MODERE -- nuance police predictive | ABSENT (app couvre 5(1)(d) mais pas 5(1)(e) completement) |
| GAP-A13 | **Q1.10.1-4** -- Credit scoring base sur profiling/reseau social (interdit Art. 5(1)(i)) | Art. 5(1)(i) | ELEVE -- pratique courante en finance, l'app ne distingue pas prohibition vs haut-risque | ABSENT comme prohibition (presente seulement comme HR) |
| GAP-A14 | **Q1.7.1-2** -- Inference emotions dans contexte law enforcement/migration | Art. 5(1)(j) | MODERE -- specifique law enforcement | ABSENT (note: erreur DeepSEARCH qui cite (j) mais l'AI Act utilise (h) pour biometrie TR) |

## A.4 -- Classification haut-risque detaillee

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A15 | **Q2.A.1-4** -- Branche Annexe I complete (produits reglementes, composant securite, evaluation tierce partie) | Art. 6(1), Annexe I | CRITIQUE -- l'app ne distingue pas Annexe I vs Annexe III | ABSENT (l'app traite sectoral_regulation dans section 6, mais sans logique Art. 6(1)) |
| GAP-A16 | **Q2.B.2.1-3** -- Infrastructure critique (8 types + impact vie/sante) | Annexe III pt 2 | ELEVE -- absent de l'app (seulement dans options Q8 via F) | PARTIEL |
| GAP-A17 | **Q2.B.6.1-3** -- Law enforcement detaille (5 sous-categories a-e) | Annexe III pt 6 | MODERE -- niche mais legalement requis | ABSENT |
| GAP-A18 | **Q2.B.7.1-3** -- Migration/asile/controle frontieres (4 sous-categories) | Annexe III pt 7 | MODERE -- niche | ABSENT |
| GAP-A19 | **Q2.B.8.1-3** -- Administration justice/processus democratiques | Annexe III pt 8 | MODERE -- niche | ABSENT |

## A.5 -- Exemptions Art. 6(3) (CRITIQUE)

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A20 | **Q3.0** -- Kill-switch profilage (bloque exemption si profilage avec effets significatifs) | Art. 6(3) dernier alinea | CRITIQUE -- change la classification finale | ABSENT (l'app a une checkbox "derogation Art. 6(3)" mais sans verification profilage) |
| GAP-A21 | **Q3.1** -- Risque significatif sante/securite/droits fondamentaux | Art. 6(3) condition generale | ELEVE | ABSENT |
| GAP-A22 | **Q3.1.1-2** -- Dommage potentiel maximal + populations vulnerables | Art. 6(3) | ELEVE | ABSENT |
| GAP-A23 | **Q3.2** -- Influence materielle sur prise de decision | Art. 6(3) | ELEVE | ABSENT |
| GAP-A24 | **Q3.2.1-2** -- Role systeme dans decision (informatif a automatique) + donnees ecart humain/IA | Art. 6(3) | ELEVE -- defensibilite juridique | ABSENT |
| GAP-A25 | **Q3.3** -- Conditions alternatives (a-d) : tache procedurale etroite, amelioration resultat humain, detection patterns, tache preparatoire | Art. 6(3)(a-d) | CRITIQUE | ABSENT |

## A.6 -- Audit conformite fournisseur detaille

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A26 | **Q4-A.1.3** -- 4 etapes obligatoires Risk Management (identification, estimation, evaluation emergents, mesures) | Art. 9(2)(a-d) | ELEVE -- l'app a seulement "systeme de gestion des risques" generique | ABSENT |
| GAP-A27 | **Q4-A.1.6** -- Prevention boucles feedback biaisees (systemes auto-apprentissage) | Art. 9(5) | ELEVE | ABSENT |
| GAP-A28 | **Q4-A.2.1-5** -- Data Governance detaillee (pertinence, representativite, erreurs, completude, biais, donnees sensibles) | Art. 10(2-5) | ELEVE -- l'app n'a aucune question data governance | ABSENT |
| GAP-A29 | **Q4-A.3.2** -- 23 elements Annexe IV documentation technique (checklist) | Art. 11, Annexe IV | CRITIQUE -- coeur de la conformite fournisseur | ABSENT (l'app demande juste si documentation existe) |
| GAP-A30 | **Q4-A.4.1-5** -- Record-Keeping detaille (capacite technique, types logs, biometrie, retention 6 mois) | Art. 12, 19 | ELEVE | PARTIEL (logs dans section 5 deployeur seulement) |
| GAP-A31 | **Q4-A.5.2-5** -- Instructions d'utilisation : 9 elements obligatoires Art. 13(3) | Art. 13(3)(a-h) | ELEVE | ABSENT |
| GAP-A32 | **Q4-A.6.1-7** -- Human Oversight : 5 capacites (a-e) + 2-person rule biometrie | Art. 14(4)(a-e), 14(5) | ELEVE | PARTIEL (1 question generique) |
| GAP-A33 | **Q4-A.7.1-5** -- Exactitude/Robustesse/Cybersecurite : 5 protections (data poisoning, adversarial, etc.) | Art. 15(1-5) | ELEVE | ABSENT |
| GAP-A34 | **Q4-A.8.1** -- 13 obligations fournisseur Art. 16 (checklist) | Art. 16(a-m) | ELEVE | ABSENT |
| GAP-A35 | **Q4-A.9.1-5** -- QMS : 13 aspects obligatoires Art. 17(1) | Art. 17(1)(a-m) | ELEVE | ABSENT |
| GAP-A36 | **Q4-A.10.1-5** -- Conformity Assessment (procedure, EU Declaration, marquage CE, registration) | Art. 43, 47, 48, 49 | CRITIQUE | ABSENT |
| GAP-A37 | **Q4-A.11.1-5** -- Post-market monitoring + incident reporting | Art. 72, 73 | ELEVE | ABSENT |

## A.7 -- Audit deployeur detaille

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A38 | **Q4-B.2.2** -- Information representants travailleurs + contenu communication (existence, finalite, decisions) | Art. 26(7) | ELEVE -- l'app a workers_informed mais sans detail contenu | PARTIEL |
| GAP-A39 | **Q4-B.2.3** -- DPIA RGPD si decisions RH basees outputs IA | Art. 35 RGPD | MODERE | ABSENT |
| GAP-A40 | **Q4-B.3.1-3** -- Traitement donnees personnelles : responsable traitement, base legale, donnees sensibles | Art. 26(8-10), RGPD | MODERE | PARTIEL (personal_data + rgpd_compliant mais sans detail) |
| GAP-A41 | **Q4-B.5.1-3** -- Obligations law enforcement biometrie (6 obligations specifiques) | Art. 26(10-11) | MODERE -- niche mais critique pour ce secteur | ABSENT |
| GAP-A42 | **Q4-B.6.1-7** -- FRIA detaillee (6 elements obligatoires Art. 27(2) + consultation stakeholders + distinction FRIA/DPIA) | Art. 27(1-6) | CRITIQUE -- l'app a 1 question FRIA, DeepSEARCH en a 7 | INSUFFISANT |

## A.8 -- Obligations risque limite Art. 50

| # | Question DeepSEARCH | Ref. AI Act | Impact | Statut App |
|---|---------------------|-------------|--------|------------|
| GAP-A43 | **Q5.2.1** -- Marquage contenu : machine-readable, persistant, interoperable | Art. 50(2) | MODERE -- l'app demande si marque mais pas la qualite du marquage | ABSENT |
| GAP-A44 | **Q5.5-6** -- Safeguards contre utilisations interdites (filtres, policies, monitoring, blocage) | Art. 50(3) | MODERE | ABSENT |

---

# B. QUESTIONS PRESENTES DANS L'AI ACT MAIS ABSENTES DES DEUX (DeepSEARCH + App)

## B.1 -- Articles non couverts ou insuffisamment couverts

| # | Exigence AI Act | Article | Impact | Statut DeepSEARCH | Statut App |
|---|----------------|---------|--------|-------------------|------------|
| GAP-B01 | **Representant autorise Art. 22** -- Obligations specifiques du mandataire (pas seulement sa designation) : conservation doc, cooperation autorites, information fournisseur non-conformite | Art. 22(1-4) | MODERE | Mentionne en Q0-BIS.3 mais pas d'audit specifique role mandataire | mandataire_question existe mais basique |
| GAP-B02 | **Obligations importateur Art. 23** -- 7 obligations specifiques detaillees (verification conformite, stockage, identification, signalement) | Art. 23(1-5) | ELEVE -- role frequent en pratique | ABSENT dans formulaire principal (mentionne dans matrice) | ABSENT |
| GAP-B03 | **Obligations distributeur Art. 24** -- Verification marquage CE, conditions stockage, signalement non-conformite | Art. 24(1-5) | MODERE | ABSENT | ABSENT |
| GAP-B04 | **Systemes d'IA pour determiner acces assurance (Annexe III 5(d))** -- Evaluation risque sante/vie specifique assurance | Annexe III pt 5(d) | MODERE -- secteur assurance souvent oublie | Couvert dans Q2.B.5.2 | ABSENT |
| GAP-B05 | **Organismes notifies Art. 28-39** -- Questions sur la relation avec l'organisme notifie, choix procedure conformite | Art. 28-39, 43 | MODERE | Mentionne Q4-A.10.2 | ABSENT |
| GAP-B06 | **Sandbox reglementaire Art. 57-62** -- Le systeme beneficie-t-il d'un sandbox ? | Art. 57-62 | FAIBLE -- exceptionnel mais pertinent | ABSENT | ABSENT |
| GAP-B07 | **Codes de conduite Art. 95** -- Le systeme est-il couvert par un code de conduite volontaire ? | Art. 95 | FAIBLE | ABSENT | ABSENT |
| GAP-B08 | **Accessibilite Directive 2019/882** -- Conformite exigences accessibilite | Art. 16(l) | MODERE -- obligation explicite mais rarement auditee | Mentionne Art. 16(l) dans checklist | ABSENT |
| GAP-B09 | **Conservation documentation 10 ans Art. 18** -- Politique archivage documentation technique et logs | Art. 18 | MODERE | Mentionne dans Q4-A.8.1(d) | ABSENT |
| GAP-B10 | **Real-time testing Art. 60** -- Tests en conditions reelles, obligations specifiques | Art. 60 | FAIBLE -- specifique phase dev | ABSENT | ABSENT |
| GAP-B11 | **Enregistrement deployeur public base de donnees UE Art. 49(3)** -- Obligation specifique deployeurs publics | Art. 49(3) | MODERE | ABSENT | ABSENT |
| GAP-B12 | **Protection lanceurs d'alerte Art. 87** -- Mecanismes de signalement | Art. 87 | FAIBLE -- bonne pratique | ABSENT | ABSENT |
| GAP-B13 | **Droit a explication Art. 86** -- Droit des personnes affectees a recevoir explication decision HR | Art. 86 | ELEVE -- obligation juridique directe | ABSENT | ABSENT |

---

# C. QUESTIONS DeepSEARCH QUI AMELIORENT L'EFFICACITE AUDIT vs. NOTRE APPROCHE

## C.1 -- Ameliorations structurelles

| # | Apport DeepSEARCH | Notre approche actuelle | Gain |
|---|-------------------|------------------------|------|
| IMP-C01 | **Logique STOP eliminatoire** : Si Art. 5 = PROHIBITED, le formulaire s'arrete. Si hors perimetre Art. 2, STOP. | L'app continue meme si pratique interdite detectee | CRITIQUE -- evite perte de temps, message juridique clair |
| IMP-C02 | **Sous-questions conditionnelles** : chaque question prohibee a des sous-questions pour verifier exceptions | L'app a seulement OUI/NON/NSP sans nuance | ELEVE -- reduit faux positifs de 30-50% |
| IMP-C03 | **Section 0-BIS basculement Art. 25** insere AVANT l'audit principal | L'app ne detecte jamais le basculement de role | CRITIQUE -- erreur juridique majeure si deployeur est en fait fournisseur |
| IMP-C04 | **Kill-switch profilage dans exemptions Art. 6(3)** | L'app permet derogation Art. 6(3) sans verifier profilage | CRITIQUE -- fausse derogation possible |
| IMP-C05 | **Scoring granulaire par article** (/102 fournisseur, /8 deployeur) | L'app a un score global /10 sans decomposition par obligation | ELEVE -- permet plan d'action priorise |
| IMP-C06 | **Section 4 divisee 4-A (Fournisseur) et 4-B (Deployeur)** avec questions totalement differentes | L'app melange fournisseur et deployeur dans les memes sections | CRITIQUE -- confond les obligations |
| IMP-C07 | **Definitions legales citees in extenso** (Art. 3(1), 3(41), 3(63), etc.) dans chaque question | L'app a des tooltips courts | ELEVE -- defensibilite juridique du diagnostic |
| IMP-C08 | **Validation logique explicite** a chaque etape (IF/THEN/ELSE documente) | L'app a du scoring implicite dans app.js | MODERE -- auditabilite du processus |
| IMP-C09 | **Matrice responsabilites par role** affichee (quelle obligation pour quel role) | L'app affiche role mais ne filtre pas les obligations | ELEVE -- clarte pour l'utilisateur |
| IMP-C10 | **Calendrier AI Act croise avec date mise sur marche** (fev 2025, aout 2026, aout 2027) | L'app montre un countdown fixe aout 2026 | MODERE -- certaines obligations sont deja en vigueur |

## C.2 -- Ameliorations de contenu

| # | Apport DeepSEARCH | Notre approche actuelle | Gain |
|---|-------------------|------------------------|------|
| IMP-C11 | **GPAI section complete** avec distinction standard vs risque systemique + 6 obligations Art. 55 + copyright Art. 53 | 3 questions basiques | ELEVE |
| IMP-C12 | **FRIA 7 questions** couvrant 6 elements obligatoires Art. 27(2) + distinction FRIA/DPIA | 1 question binaire | CRITIQUE pour deployeurs HR |
| IMP-C13 | **23 elements Annexe IV** en checklist | Aucune checklist | CRITIQUE pour fournisseurs |
| IMP-C14 | **Cybersecurite 5 protections specifiques** (data poisoning, model poisoning, adversarial, confidentiality, defaut) | Aucune question cybersecurite | ELEVE |
| IMP-C15 | **Exemples concrets** pour chaque question (ex: "Systeme concu pour recrutement cadres utilise pour evaluation performance") | Pas d'exemples | MODERE -- comprehension utilisateur |

---

# D. LISTE DE QUESTIONS FINALE RECOMMANDEE

## Architecture recommandee

```
PHASE 1: PERIMETRE & QUALIFICATION (8 questions)
    |
PHASE 2: PRATIQUES INTERDITES (10 questions, logique STOP)
    |
PHASE 3: SCREENING GPAI (5 questions conditionnelles)
    |
PHASE 4: CLASSIFICATION RISQUE (12 questions, 2 branches)
    |
PHASE 5: EXEMPTIONS Art. 6(3) (6 questions conditionnelles)
    |
PHASE 6: AUDIT CONFORMITE PAR ROLE (variable)
    ├── Fournisseur: 35 questions
    ├── Deployeur: 30 questions
    ├── Importateur: 10 questions
    └── Distributeur: 8 questions
    |
PHASE 7: TRANSPARENCE & RISQUE LIMITE (6 questions)
    |
PHASE 8: SCORING & RAPPORT
```

---

## D.1 -- PHASE 1 : PERIMETRE & QUALIFICATION

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P1-01 | Quel est le rapport de votre entreprise avec l'intelligence artificielle ? | radio cards | A. Developpe/entraine IA (=Fournisseur) / B. Utilise outils IA (=Deployeur) / C. Importe IA hors-UE (=Importateur) / D. Revend/distribue IA (=Distributeur) / E. Plusieurs roles / F. Je ne sais pas | Art. 3(3-7) | Determine branchement | Toujours | SPECS-03 Q1 |
| P1-02 | Dans quel secteur votre entreprise evolue-t-elle ? | select | Sante-MedTech / Finance-Assurance / RH / Education / Juridique / Commerce / Industrie / Transport / Energie / Immobilier / Media / Administration publique / Autre | Art. 6, Annexe III | Multiplicateur x1.2 si sensible | Toujours | SPECS-03 Q2 |
| P1-03 | Combien de collaborateurs compte votre entreprise ? | radio | TPE (<10) / PME (10-249) / ETI (250-4999) / Grand groupe (5000+) | Art. 99(6) (PME) | Multiplicateur taille | Toujours | SPECS-03 Q3 |
| P1-04 | Vos produits ou services touchent-ils des utilisateurs dans l'Union europeenne ? | radio | Oui exclusivement / Oui en partie / Non / Je ne suis pas certain(e) | Art. 2(1) | STOP si hors perimetre (mais verifier extraterritorialite) | Toujours | SPECS-03 Q4 + DeepSEARCH Q0.6 |
| P1-05 | Le systeme est-il utilise exclusivement pour : securite nationale/defense, recherche avant mise sur marche, usage personnel non-professionnel ? | checkbox | Securite nationale-defense (Art. 2.2) / Recherche-dev (Art. 2.8) / Usage personnel (Art. 2.10) / Aucun | Art. 2(2)(8)(10) | STOP si exclusion applicable | Toujours | **NEW** (DeepSEARCH Q0.3.bis) |
| P1-06 | Votre systeme repond-il a la definition d'un systeme d'IA au sens de l'Art. 3(1) ? [Definition complete affichee] | radio | Oui / Non / Incertain | Art. 3(1) | STOP si Non | Toujours | **NEW** (DeepSEARCH Q0.4) |
| P1-07 | Combien de systemes ou outils IA sont utilises dans votre organisation ? | radio | Aucun / 1-2 / 3-5 / 6-10 / Plus de 10 / NSP | -- | +0.3 a +1.0 | Toujours | SPECS-03 Q5 |
| P1-08 | Quel est le statut de developpement de votre systeme IA ? | radio | Conception / Developpement / Test / Production / Commercialise / Retire | Art. 99 | Determine urgence | Toujours | **NEW** (DeepSEARCH Q0.7) |

---

## D.2 -- PHASE 1-BIS : BASCULEMENT ROLE Art. 25

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P1B-01 | Effectuez-vous l'une des actions suivantes sur un systeme IA existant ? (a) Apposer votre nom/marque (rebranding) (b) Modifier l'objectif prevu (c) Apporter une modification substantielle (algorithme, donnees, logique) | checkbox | Rebranding / Modification objectif / Modification substantielle / Aucune | Art. 25(1)(a-c) | Si coché -> basculement FOURNISSEUR | P1-01 != Fournisseur | **NEW** (DeepSEARCH Q0-BIS) |
| P1B-02 | Si rebranding : existe-t-il un accord contractuel attribuant les obligations au fournisseur initial ? | radio | Oui (document signe) / Non / N/A | Art. 25(a) | Exemption possible si accord | P1B-01 = rebranding | **NEW** (DeepSEARCH Q0-BIS.3) |

---

## D.3 -- PHASE 2 : PRATIQUES INTERDITES (Art. 5) -- LOGIQUE STOP

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P2-01 | Utilisez-vous des techniques subliminales ou manipulatrices via l'IA causant un prejudice significatif ? | radio | Oui / Non / NSP | Art. 5(1)(a) | CRITICAL (+20) si Oui | Toujours | APP + DeepSEARCH |
| P2-02 | Exploitez-vous les vulnerabilites de groupes specifiques (age, handicap, situation sociale) pour alterer leur comportement ? | radio | Oui / Non / NSP | Art. 5(1)(b) | CRITICAL (+20) | Toujours | APP + DeepSEARCH |
| P2-03 | Evaluez-vous ou classez-vous des personnes sur la base de leur comportement social menant a un traitement defavorable ? | radio | Oui / Non / NSP | Art. 5(1)(c) | CRITICAL (+20) | Toujours | APP (scoring social) |
| P2-04 | Evaluez-vous le risque qu'une personne commette une infraction UNIQUEMENT sur la base de son profilage ? | radio+sous-question | Oui / Non / NSP -> si Oui: evaluation prealable objective ? support humain ? | Art. 5(1)(d) | CRITICAL (+20) sauf si support humain | Toujours | APP + DeepSEARCH Q1.5 |
| P2-05 | Collectez-vous des images faciales (scraping internet/CCTV) pour constituer des bases de reconnaissance faciale ? | radio | Oui / Non / NSP | Art. 5(1)(e) | CRITICAL (+20) | Toujours | APP |
| P2-06 | Inferez-vous les emotions sur le lieu de travail ou dans des etablissements educatifs ? | radio+sous-question | Oui / Non / NSP -> si Oui: exception medicale ou securite ? | Art. 5(1)(f) | CRITICAL (+20) sauf exception | Toujours | APP + DeepSEARCH Q1.3 |
| P2-07 | Categorisez-vous des individus selon des attributs sensibles (race, religion, orientation sexuelle) a partir de donnees biometriques ? | radio | Oui / Non / NSP | Art. 5(1)(g) | CRITICAL (+20) | Toujours | APP |
| P2-08 | Utilisez-vous l'identification biometrique a distance en temps reel dans des espaces publics ? | radio+sous-question | Oui / Non / NSP -> si Oui: autorite repressive ? exception Art. 5(2) ? autorisation judiciaire ? | Art. 5(1)(h) | CRITICAL (+20) sauf exceptions strictes | Toujours | APP + DeepSEARCH Q1.1 |
| P2-09 | Evaluez-vous la solvabilite de personnes UNIQUEMENT par profiling ou analyse reseaux sociaux menant a un traitement defavorable ? | radio | Oui / Non / NSP / N/A | Art. 5(1)(i) | CRITICAL (+20) | Toujours | **NEW** (DeepSEARCH Q1.10) |
| P2-10 | Inferez-vous des emotions dans un contexte de repression/frontiere/asile/migration (hors exception medicale/securite) ? | radio | Oui / Non / N/A | Art. 5(1)(f) contexte LE | CRITICAL (+20) | Toujours | **NEW** (DeepSEARCH Q1.7) |

---

## D.4 -- PHASE 3 : SCREENING GPAI (Art. 51-56)

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P3-01 | Votre systeme est-il un modele d'IA a usage general (GPAI) ? [Caracteristiques: entraine large echelle, polyvalent, multi-taches, integrable downstream] | radio+checklist | Oui (>=4 caracteristiques) / Non / Incertain | Art. 3(63) | Route vers obligations GPAI | Toujours | SPECS-04 + DeepSEARCH Q1-BIS.1 |
| P3-02 | Si GPAI : le modele presente-t-il un risque systemique ? (capacite calcul > 10^25 FLOPs ou designation Commission) | radio | Oui / Non / NSP | Art. 51(1-2) | +10 si risque systemique | P3-01 = Oui | APP + DeepSEARCH Q1-BIS.4 |
| P3-03 | Si GPAI standard : documentation technique conforme Art. 53 fournie aux providers downstream ? | radio | Oui / Non / Partiel | Art. 53(1)(a) | +8 si Non | P3-01=Oui, P3-02=Non | DeepSEARCH Q1-BIS.6 |
| P3-04 | Si GPAI standard : politique respect droits d'auteur etablie + resume contenu entrainement publie ? | radio | Oui / Non / Partiel | Art. 53(1)(b) | +8 si Non | P3-01=Oui, P3-02=Non | DeepSEARCH Q1-BIS.6.2 |
| P3-05 | Si GPAI risque systemique : les 6 obligations Art. 55 sont-elles remplies ? (evaluation modele, mitigation risques systemiques, incident reporting, cybersecurite, reporting Commission, info entrainement) | checklist | 6 items | Art. 55(1)(a-f) | +5 par obligation manquante | P3-01=Oui, P3-02=Oui | DeepSEARCH Q1-BIS.5 |

---

## D.5 -- PHASE 4 : CLASSIFICATION HAUT-RISQUE (Art. 6 + Annexe III)

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P4-01 | Le systeme IA est-il un composant de securite d'un produit OU lui-meme un produit couvert par legislation harmonisee UE Annexe I ? | radio | Oui / Non / Incertain | Art. 6(1) | Si Oui -> HR via Annexe I | Toujours | DeepSEARCH Q2.A.1 |
| P4-02 | Si Annexe I : quel secteur produit reglemente ? | select | Machinery / Medical Devices / Aviation / Motor Vehicles / Rail / Marine / Lifts / Radio Equipment / Toys / PPE / ATEX / Gas / Pressure Equipment | Annexe I | Route evaluation tierce partie | P4-01 = Oui | DeepSEARCH Q2.A.2 |
| P4-03 | Le produit doit-il faire l'objet d'une evaluation de conformite par organisme notifie (tierce partie) ? | radio | Oui / Non / NSP | Art. 6(1) | Si Oui -> HR confirme | P4-01 = Oui | DeepSEARCH Q2.A.4 |
| P4-04 | Vos systemes IA interviennent-ils dans l'un de ces domaines ? (Cochez tous applicables) | checkbox | A. Biometrie (identification, verification, categorisation) / B. Infrastructure critique (eau, gaz, electricite, transport) / C. Education-formation (admission, notation, surveillance exams) / D. Emploi (recrutement, evaluation, promotion, licenciement) / E. Services essentiels (sante, aide sociale, credit scoring, urgences, assurance) / F. Repression (risque victime, polygraphe, fiabilite preuves, recidive, profiling) / G. Migration-asile-frontieres (veracite, risque securite, demandes, identification) / H. Justice-democratie (assistance juges, elections) / I. Aucun | Annexe III pts 1-8 | +8 par domaine HR | P4-01 = Non | APP Q8 enrichi + DeepSEARCH |
| P4-05 | Pour chaque domaine coche : le systeme influence-t-il significativement des decisions affectant droits/libertes ? | radio par domaine | Oui / Non | Annexe III | Confirme HR si Oui | P4-04 != I | DeepSEARCH Q2.B.x.3 |

---

## D.6 -- PHASE 5 : EXEMPTIONS Art. 6(3)

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| P5-01 | Le systeme effectue-t-il du PROFILAGE ? (traitement automatise de donnees personnelles pour evaluer aspects personnels : rendement, situation economique, sante, preferences, comportement) | radio | Oui / Non / Incertain | Art. 6(3) dernier alinea, Art. 3(60) | Si Oui -> exemption BLOQUEE (sauf si sans effet juridique) | Systeme classe HR via Annexe III | **NEW** (DeepSEARCH Q3.0 -- KILL-SWITCH) |
| P5-02 | Si profilage : ce profilage a-t-il un effet juridique ou un effet significatif similaire sur les personnes ? | radio | Oui (effet juridique) / Non (profilage mineur sans consequences) | Art. 6(3) | Si Oui -> HR confirme, pas d'exemption | P5-01 = Oui | **NEW** (DeepSEARCH Q3.0.2) |
| P5-03 | Le systeme presente-t-il un risque significatif de prejudice a la sante, securite ou droits fondamentaux ? | radio | Risques negligeables / Risques moderes reversibles / Risques significatifs | Art. 6(3) | Si significatifs -> HR confirme | P5-01 = Non ou P5-02 = Non | **NEW** (DeepSEARCH Q3.1) |
| P5-04 | Le systeme influence-t-il materiellement l'issue de la prise de decision ? | radio | Purement informatif / Suggestion facultative / Recommandation forte suivie >50% / Decision quasi-automatique >90% / Decision automatique | Art. 6(3) | Si >=recommandation forte -> HR confirme | P5-03 = Risques negligeables | **NEW** (DeepSEARCH Q3.2.1) |
| P5-05 | Le systeme remplit-il au moins une des conditions alternatives : (a) tache procedurale etroite (b) ameliore resultat activite humaine (c) detecte patterns sans influencer decision (d) tache preparatoire evaluation | checkbox | a / b / c / d / Aucune | Art. 6(3)(a-d) | Si aucune -> HR confirme | P5-04 = informatif ou suggestion | **NEW** (DeepSEARCH Q3.3) |
| P5-06 | VERDICT : le systeme peut-il etre declasse ? | auto-calcule | HR confirme / Exemption applicable -> Risque limite | Art. 6(3) | Declassement ou HR | Logique auto | DeepSEARCH + SPECS-04 |

---

## D.7 -- PHASE 6-A : AUDIT FOURNISSEUR (Art. 8-17)

*Condition : role = FOURNISSEUR + systeme = HAUT-RISQUE*

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| **Art. 9 -- Risk Management** | | | | | | | |
| F6-01 | Un systeme de gestion des risques est-il etabli, implemente, documente et maintenu ? | radio | Oui formalise / En cours / Non / NSP | Art. 9(1) | +0/+3/+8/+6 D1-F | Toujours | SPECS-04 Q-F-01 |
| F6-02 | Avez-vous identifie et analyse les risques pour la sante, securite et droits fondamentaux ? | radio | Oui tous / Partiel / Non / NSP | Art. 9(2)(a) | +0/+3/+6/+4 D1-F | Toujours | SPECS-04 Q-F-02 |
| F6-03 | Des mesures d'attenuation documentees et testees sont-elles en place ? | radio | Oui / En partie / Non | Art. 9(4) | +0/+3/+6 D1-F | Toujours | SPECS-04 Q-F-03 |
| F6-04 | Vos systemes sont-ils testes de maniere appropriee avant mise sur marche ? | radio | Oui protocole formalise / Tests partiels / Non / NSP | Art. 9(7) | +0/+2/+5/+4 D1-F | Toujours | SPECS-04 Q-F-04 |
| **Art. 10 -- Data Governance** | | | | | | | |
| F6-05 | Les jeux de donnees sont-ils soumis a gouvernance documentee ? | radio | Oui / Partiel / Non / Pas de donnees entrainement | Art. 10 | +0/+3/+7/+0 D1-F | Toujours | SPECS-04 Q-F-05 |
| F6-06 | Avez-vous evalue et attenué les biais dans vos jeux de donnees ? | radio | Oui / Partiel / Non / NSP | Art. 10(2)(f) | +0/+2/+5/+4 D1-F | F6-05 != Pas de donnees | SPECS-04 Q-F-06 |
| F6-06b | Les donnees sensibles traitees le sont-elles strictement pour detection/correction biais ? | radio | Oui + safeguards / Non / N/A | Art. 10(5) | NON-CONFORMITE si Non | F6-06 != N/A | **NEW** (DeepSEARCH Q4-A.2.5) |
| **Art. 11 + Annexe IV -- Documentation technique** | | | | | | | |
| F6-07 | Disposez-vous d'une documentation technique conforme Annexe IV AVANT mise sur marche ? | radio | Oui complete / Partiellement / Non / NSP | Art. 11, Annexe IV | +0/+4/+8/+7 D1-F | Toujours | SPECS-04 Q-F-07 |
| F6-08 | La documentation inclut-elle : description generale, elements conception/architecture, notice utilisation ? | oui-non par element | 3 items | Annexe IV §1-3 | +3 par element manquant | Toujours | SPECS-04 Q-F-08/09 |
| F6-08b | Combien des 23 elements Annexe IV sont presents ? (checklist detaillee) | checklist | 23 items categorises | Annexe IV | NON-CONFORMITE si <23 | Audit approfondi | **NEW** (DeepSEARCH Q4-A.3.2) |
| **Art. 12 -- Record-Keeping** | | | | | | | |
| F6-09 | Vos systemes IA HR disposent-ils de capacites de journalisation automatique (logging) ? | radio | Oui actifs / Partiel / Non / N/A | Art. 12 | +0/+3/+6/+0 D1-F | Toujours | SPECS-04 Q-F-15 |
| F6-10 | Les logs permettent-ils de tracer les evenements pertinents et situations de risque ? | oui-non | Oui / Non / NSP | Art. 12(2) | +0/+3/+2 D1-F | F6-09 = Oui ou Partiel | SPECS-04 Q-F-16 |
| F6-10b | Duree retention logs >= 6 mois ? | radio | Oui / Non | Art. 19(1) | NON-CONFORMITE si Non | F6-09 = Oui | **NEW** (DeepSEARCH Q4-A.4.5) |
| **Art. 13 -- Transparence** | | | | | | | |
| F6-11 | Fournissez-vous une notice d'utilisation claire et comprehensible aux deployeurs ? | radio | Oui complete / Partielle / Non / NSP | Art. 13 | +0/+3/+6/+5 D5-F | Toujours | SPECS-04 Q-F-10 |
| F6-12 | La notice precise-t-elle capacites, limites et risques residuels ? | oui-non | Oui / Non / NSP | Art. 13(3)(b) | +0/+4/+3 D5-F | F6-11 = Oui ou Partielle | SPECS-04 Q-F-11 |
| **Art. 14 -- Controle humain** | | | | | | | |
| F6-13 | Vos systemes sont-ils concus pour permettre surveillance humaine effective, incluant interpretation sorties et capacite interruption ? | radio | Oui integree conception / Partiel / Non / NSP | Art. 14 | +0/+3/+7/+5 D5-F | Toujours | SPECS-04 Q-F-12 |
| F6-13b | Les 5 capacites de controle humain sont-elles presentes ? (a) comprendre capacites/limites (b) conscience automation bias (c) interpreter outputs (d) ignorer/inverser output (e) bouton STOP | checklist | 5 items | Art. 14(4)(a-e) | NON-CONFORMITE si <5 | Audit approfondi | **NEW** (DeepSEARCH Q4-A.6.5) |
| **Art. 15 -- Exactitude, robustesse, cybersecurite** | | | | | | | |
| F6-14 | Avez-vous defini et documente les niveaux d'exactitude, robustesse et cybersecurite ? | radio | Oui tous / Certains / Non / NSP | Art. 15 | +0/+3/+6/+5 D7-F | Toujours | SPECS-04 Q-F-13 |
| F6-15 | Vos systemes sont-ils proteges contre les manipulations par tiers (adversarial attacks, data poisoning) ? | radio | Oui mesures techniques / Partiel / Non / NSP | Art. 15(4) | +0/+2/+5/+4 D7-F | Toujours | SPECS-04 Q-F-14 |
| **Art. 17 -- QMS** | | | | | | | |
| F6-16 | Disposez-vous d'un QMS documente couvrant les aspects Art. 17 ? | radio | Oui formalise / En cours / Non / NSP | Art. 17 | +0/+4/+8/+7 D2-F | Toujours | SPECS-04 Q-F-17 |
| F6-16b | Le QMS comprend-il les 13 aspects obligatoires ? (strategie conformite, design control, QA/QC, tests, specs techniques, gestion donnees, gestion risques, monitoring post-marche, incidents, communication autorites, record-keeping, ressources, accountability) | checklist | 13 items | Art. 17(1)(a-m) | NON-CONFORMITE si <13 | F6-16 = En cours | **NEW** (DeepSEARCH Q4-A.9.2) |
| **Art. 43-49 -- Conformity Assessment** | | | | | | | |
| F6-17 | Avez-vous determine la procedure d'evaluation conformite applicable ? | radio | Oui (controle interne / organisme notifie) / En cours / Non / NSP | Art. 43 | +0/+3/+7/+6 D3-F | Toujours | SPECS-04 Q-F-20 |
| F6-18 | Etablissez-vous une declaration UE de conformite pour chaque systeme ? | radio | Oui / Partiel / Non / NSP | Art. 47 | +0/+3/+6/+5 D4-F | Toujours | SPECS-04 Q-F-23 |
| F6-19 | Apposez-vous le marquage CE ? | radio | Oui / En preparation / Non / NSP | Art. 48 | +0/+2/+5/+4 D4-F | Toujours | SPECS-04 Q-F-24 |
| F6-20 | Avez-vous enregistre vos systemes dans la base de donnees UE ? | radio | Oui / En cours / Non / NSP | Art. 49 | +0/+2/+5/+4 D4-F | Toujours | SPECS-04 Q-F-25 |
| **Art. 72-73 -- Post-market** | | | | | | | |
| F6-21 | Avez-vous mis en place un systeme de surveillance post-commercialisation ? | radio | Oui operationnel / En cours / Non / NSP | Art. 72 | +0/+4/+8/+7 D6-F | Toujours | SPECS-04 Q-F-26 |
| F6-22 | Disposez-vous d'une procedure de signalement incidents graves ? | radio | Oui definie et testee / Definie non testee / Non / NSP | Art. 73 | +0/+2/+5/+4 D6-F | Toujours | SPECS-04 Q-F-28 |
| F6-23 | Etes-vous en mesure de prendre des actions correctives (retrait, rappel) ? | radio | Oui documente / Partiel / Non | Art. 16(j), 20 | +0/+2/+5 D6-F | Toujours | SPECS-04 Q-F-29 |
| **Art. 4 -- Maitrise IA** | | | | | | | |
| F6-24 | Avez-vous pris des mesures pour garantir un niveau suffisant de maitrise de l'IA pour votre personnel ? | radio | Oui programme formation / Partiel / Non / Pas identifie | Art. 4 | +0/+2/+5/+4 D2-F | Toujours | SPECS-04 Q-F-33 |
| **Art. 50 -- Transparence** | | | | | | | |
| F6-25 | Les personnes interagissant avec vos systemes IA sont-elles informees ? | radio | Oui systematiquement / Pas toujours / Non / N/A | Art. 50(1) | +0/+3/+6/+0 D5-F | Toujours | SPECS-04 Q-F-31 |
| F6-26 | Les contenus generes par IA sont-ils marques de maniere lisible par machine ? | radio | Oui / Partiel / Non / N/A | Art. 50(2) | +0/+2/+5/+0 D5-F | Toujours | SPECS-04 Q-F-32 |
| **Art. 18, 21, 22** | | | | | | | |
| F6-27 | Conservez-vous la documentation technique et logs pendant au moins 10 ans ? | radio | Oui / Partiel / Non / NSP | Art. 18 | +0/+2/+4/+3 D1-F | Toujours | SPECS-04 Q-F-34 |
| F6-28 | Etes-vous en mesure de fournir toute information demontrant conformite a une autorite ? | radio | Oui / Partiel / Non / NSP | Art. 21 | +0/+2/+4/+3 D3-F | Toujours | SPECS-04 Q-F-35 |
| F6-29 | Si etabli hors UE : avez-vous designe un mandataire autorise dans l'Union ? | radio | Oui / En cours / Non / N/A (dans UE) | Art. 22 | +0/+3/+8/+0 D3-F | Toujours | SPECS-04 Q-F-30 |

---

## D.8 -- PHASE 6-B : AUDIT DEPLOYEUR (Art. 26)

*Condition : role = DEPLOYEUR + systeme = HAUT-RISQUE*

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| D6-01 | Avez-vous verifie documentation technique et notice fournisseur ? | radio | Oui tous / Partiel / Non / NSP | Art. 26(1) | +0/+3/+7/+6 D6-D | Toujours | SPECS-04 Q-D-01 |
| D6-02 | Avez-vous verifie marquage CE et declaration conformite ? | radio | Oui / Partiel / Non / NSP | Art. 26(1) | +0/+2/+5/+4 D6-D | Toujours | SPECS-04 Q-D-02 |
| D6-03 | Utilisez-vous le systeme conformement a la notice d'utilisation ? | radio | Oui strictement / Globalement / Usage modifie / Pas de notice | Art. 26(1) | +0/+2/+8/+6 D6-D (si modifie -> alerte Art. 25) | Toujours | SPECS-04 Q-D-03 |
| D6-04 | Avez-vous designe des personnes physiques pour la surveillance humaine ? | radio | Oui designees et formees / Designees non formees / Non / NSP | Art. 26(2) | +0/+4/+8/+7 D1-D | Toujours | SPECS-04 Q-D-04 |
| D6-05 | Les personnes de surveillance peuvent-elles interrompre ou annuler les decisions du systeme ? | radio | Oui a tout moment / Certains cas / Non / NSP | Art. 14(4), 26(2) | +0/+3/+7/+5 D1-D | Toujours | SPECS-04 Q-D-06 |
| D6-06 | Avez-vous pris des mesures contre le biais d'automatisation (automation bias) ? | radio | Oui mesures specifiques / Partiel / Non / NSP | Art. 14(4)(b) | +0/+2/+4/+5 D1-D | Toujours | SPECS-04 Q-D-07 |
| D6-07 | Les donnees d'entree sont-elles pertinentes et representatives ? | radio | Oui / Partiel / Non / NSP | Art. 26(4) | +0/+2/+5/+4 D6-D | Toujours | SPECS-04 Q-D-08 |
| D6-08 | Conservez-vous les logs >= 6 mois et sont-ils accessibles aux autorites ? | radio | Oui >= 6 mois / Oui < 6 mois / Non / NSP | Art. 26(5) | +0/+3/+6/+5 D4-D | Toujours | SPECS-04 Q-D-09/10 |
| D6-09 | Avez-vous realise une FRIA ? | radio | Oui realisee et documentee / En cours / Non / NSP | Art. 27 | +0/+4/+8/+8 D3-D | Toujours | SPECS-04 Q-D-11 + APP |
| D6-09b | La FRIA couvre-t-elle les 6 elements obligatoires ? (processus deploiement, categories personnes, droits fondamentaux, risques prejudice, mesures attenuation, respect instructions) | checklist | 6 items | Art. 27(2)(a-f) | +1 par element manquant D3-D | D6-09 = En cours | **NEW** (DeepSEARCH Q4-B.6.3) |
| D6-09c | La FRIA est-elle distincte de la DPIA (RGPD) ? | radio | Oui distincte / FRIA integree dans DPIA elargie / Seulement DPIA | Art. 27 | NON-CONFORMITE si seulement DPIA | D6-09 = Oui | **NEW** (DeepSEARCH Q4-B.6.5) |
| D6-10 | Informez-vous les personnes physiques qu'elles sont soumises a un systeme IA HR ? | radio | Oui systematiquement / Parfois / Non / NSP | Art. 26(6) | +0/+3/+6/+5 D5-D | Toujours | SPECS-04 Q-D-15 + APP |
| D6-11 | Informez-vous les representants des travailleurs avant deploiement IA sur lieu de travail ? | radio | Oui / Partiel / Non / N/A | Art. 26(7) | +0/+2/+5/+0 D5-D | Toujours | SPECS-04 Q-D-16 + APP |
| D6-12 | Disposez-vous d'une procedure pour signaler dysfonctionnements au fournisseur et aux autorites ? | radio | Oui formalisee / Informel / Non / NSP | Art. 26(5), 73 | +0/+2/+5/+4 D7-D | Toujours | SPECS-04 Q-D-19 |
| D6-13 | En cas de risque, pouvez-vous suspendre immediatement l'utilisation du systeme ? | radio | Oui processus prevu / Possible non formalise / Non / NSP | Art. 26(5) | +0/+2/+5/+4 D7-D | Toujours | SPECS-04 Q-D-20 |
| D6-14 | Avez-vous pris des mesures pour garantir maitrise de l'IA pour votre personnel ? | radio | Oui programme / Partiel / Non / Pas identifie | Art. 4 | +0/+2/+5/+4 D1-D | Toujours | SPECS-04 Q-D-18 |
| D6-15 | Tenez-vous un inventaire complet de tous vos systemes IA deployes ? | radio | Oui complet / Partiel / Non / NSP | Art. 26(1) implicite | +0/+3/+6/+5 D2-D | Toujours | SPECS-04 Q-D-28 |
| D6-16 | Vos systemes IA traitent-ils des donnees personnelles ? Si oui, conformite RGPD verifiee ? | radio | Oui verifiee / Partiel / Non / NSP | Art. 2(7), RGPD | +0/+3/+6/+5 D7-D | Toujours | SPECS-04 Q-D-23/24 + APP |
| D6-17 | Avez-vous designe un responsable conformite IA ? | radio | Oui avec mandat / Informellement / Non | Bonne pratique | +0/+2/+4 D1-D | Toujours | SPECS-04 Q-D-27 + APP |
| D6-18 | Si organisme public/service public/institution financiere/assureur : avez-vous enregistre l'utilisation dans la base de donnees UE ? | radio | Oui / Non / N/A (prive) / NSP | Art. 49(3) | +0/+5/+0/+3 D2-D | Toujours | **NEW** (SPECS-04 Q-D-26) |
| D6-19 | Avez-vous apporte ou prevoyez-vous des modifications substantielles a un systeme IA acquis aupres d'un fournisseur ? | radio | Oui / Modifications mineures / Non / NSP | Art. 25(1)(b) | Si Oui -> ALERTE requalification Fournisseur | Toujours | SPECS-04 Q-D-29 |
| D6-20 | Les personnes affectees par une decision IA sont-elles informees de ce fait et des voies de recours ? | radio | Oui / Partiel / Non / NSP | Art. 26(11), Art. 86 | +0/+3/+6/+5 D5-D | Toujours | SPECS-04 Q-D-17 + APP + **NEW** Art. 86 |

---

## D.9 -- PHASE 7 : TRANSPARENCE & RISQUE LIMITE (Art. 50)

| ID | Texte | Type | Options | Ref. AI Act | Score impact | Condition | Source |
|----|-------|------|---------|-------------|-------------|-----------|--------|
| T7-01 | Le systeme genere-t-il du contenu synthetique (texte, image, audio, video) ? | radio | Oui / Non | Art. 50(2) | Route vers marquage | Toujours | DeepSEARCH Q5.1 |
| T7-02 | Si oui : le contenu est-il marque comme artificiel (watermark, metadata, label visible) ? | radio | Oui / Non | Art. 50(2) | NON-CONFORMITE si Non | T7-01 = Oui | DeepSEARCH Q5.2 + APP |
| T7-03 | Le marquage est-il machine-readable, persistant et interoperable ? | checklist | 3 items | Art. 50(2) | NON-CONFORMITE si element manquant | T7-02 = Oui | **NEW** (DeepSEARCH Q5.2.1) |
| T7-04 | Le systeme interagit-il directement avec des personnes (chatbot, assistant) ? | radio | Oui / Non | Art. 50(1) | Route vers notification | Toujours | DeepSEARCH Q5.3 |
| T7-05 | Les utilisateurs sont-ils informes qu'ils interagissent avec un systeme IA ? | radio | Oui notification explicite / Non mais evident du contexte / Non | Art. 50(1) | NON-CONFORMITE si Non (sans justification) | T7-04 = Oui | DeepSEARCH Q5.4 + APP |
| T7-06 | Le systeme est-il concu pour prevenir les utilisations interdites Art. 5 ? (filtres, policies, monitoring) | radio | Oui (>=3 safeguards) / Partiel / Non | Art. 50(3) | NON-CONFORMITE si Non | Toujours | **NEW** (DeepSEARCH Q5.5-6) |

---

## D.10 -- QUESTIONS IMPORTATEUR & DISTRIBUTEUR (resumes)

### Importateur (Art. 23)

| ID | Texte | Ref. | Source |
|----|-------|------|--------|
| I-01 | Verification procedure conformite fournisseur hors-UE (Art. 43) | Art. 23(1) | SPECS-04 Q-I-01 |
| I-02 | Verification documentation technique Annexe IV | Art. 23(1) | SPECS-04 Q-I-02 |
| I-03 | Verification marquage CE | Art. 23(1) | SPECS-04 Q-I-03 |
| I-04 | Verification declaration conformite | Art. 23(1) | SPECS-04 Q-I-04 |
| I-05 | Verification mandataire designe | Art. 22, 23(1) | SPECS-04 Q-I-05 |
| I-06 | Politique non-mise sur marche si non-conforme | Art. 23(2) | SPECS-04 Q-I-06 |
| I-07 | Identification importateur sur produit/documentation | Art. 23(3) | SPECS-04 Q-I-07 |
| I-08 | Conditions stockage/transport | Art. 23(4) | SPECS-04 Q-I-08 |
| I-09 | Conservation documents 10 ans | Art. 23(5) | SPECS-04 Q-I-09 |
| I-10 | Cooperation autorites | Art. 23(5) | SPECS-04 Q-I-10 |

### Distributeur (Art. 24)

| ID | Texte | Ref. | Source |
|----|-------|------|--------|
| R-01 | Verification marquage CE et declaration conformite avant distribution | Art. 24(1) | SPECS-04 Q-R-01 |
| R-02 | Verification identification fournisseur et importateur | Art. 24(1) | SPECS-04 Q-R-02 |
| R-03 | Non-mise a disposition si non-conforme | Art. 24(2) | SPECS-04 Q-R-03 |
| R-04 | Conditions stockage/transport | Art. 24(3) | SPECS-04 Q-R-04 |
| R-05 | Information fournisseur/importateur si non-conformite | Art. 24(4) | SPECS-04 Q-R-05 |
| R-06 | Actions correctives (retrait, rappel) | Art. 24(5) | SPECS-04 Q-R-06 |
| R-07 | Cooperation autorites | Art. 24(5) | SPECS-04 Q-R-07 |
| R-08 | Basculement fournisseur Art. 25 | Art. 25 | SPECS-04 Q-R-08 |

---

# ANNEXE : ARTICLES AI ACT NON COUVERTS (completude)

Les articles suivants du Reglement (UE) 2024/1689 ne sont couverts par aucune des trois sources et pourraient etre pertinents dans une version avancee :

| Article | Sujet | Pertinence audit |
|---------|-------|-----------------|
| Art. 57-62 | Bacs a sable reglementaires (regulatory sandboxes) | FAIBLE -- exceptionnel |
| Art. 63-70 | Organismes notifies (designation, competences, obligations) | FAIBLE -- pertinent pour organismes notifies eux-memes |
| Art. 74-79 | Surveillance du marche (autorites, pouvoirs, procedures) | FAIBLE -- cote autorite, pas operateur |
| Art. 80-84 | Voies de recours (plaintes, droit a explication) | MODERE -- Art. 86 droit a explication devrait etre couvert |
| Art. 85-87 | Confidentialite, protection lanceurs d'alerte | FAIBLE |
| Art. 88-94 | Gouvernance (Bureau IA, Comite, Forum consultatif, Groupe scientifique) | FAIBLE -- institutionnel |
| Art. 95 | Codes de conduite | FAIBLE |
| Art. 96-98 | Actes delegues et d'execution | FAIBLE |
| Annexe II | Liste infractions penales (seuil gravite biometrie TR) | FAIBLE -- reference technique |
| Annexe V-VII | Procedures evaluation conformite (detaillees) | MODERE -- pourrait enrichir F6-17 |
| Annexe VIII-XIII | Informations enregistrement, monitoring, risque systemique | FAIBLE |

---

# RESUME DES PRIORITES D'IMPLEMENTATION

## Priorite CRITIQUE (Impact juridique majeur -- a implementer en premier)

1. **Kill-switch perimetre** (P1-05, P1-06) -- Eviter d'auditer un systeme hors champ
2. **Basculement role Art. 25** (P1B-01, P1B-02) -- Un deployeur peut etre fournisseur
3. **Kill-switch profilage exemptions** (P5-01, P5-02) -- Fausses derogations possibles
4. **Exemptions Art. 6(3) completes** (P5-03 a P5-06) -- Classification finale erronee sans
5. **Distinction Annexe I vs Annexe III** (P4-01 a P4-03) -- Deux voies de classification
6. **Sous-questions exceptions Art. 5** (P2-04, P2-06, P2-08, P2-09) -- Faux positifs prohibitions
7. **23 elements Annexe IV** (F6-08b) -- Coeur conformite fournisseur
8. **FRIA detaillee 6 elements** (D6-09b, D6-09c) -- Obligation deployeur HR

## Priorite ELEVEE (Completude reglementaire)

9. Parcours Importateur complet (I-01 a I-10)
10. Parcours Distributeur complet (R-01 a R-08)
11. Data Governance Art. 10 detaillee (F6-05, F6-06, F6-06b)
12. 5 capacites controle humain Art. 14(4) (F6-13b)
13. QMS 13 aspects Art. 17 (F6-16b)
14. Cybersecurite 5 protections Art. 15 (F6-14, F6-15)
15. Post-market monitoring (F6-21, F6-22, F6-23)
16. Droit a explication Art. 86 (D6-20)
17. GPAI section complete (P3-01 a P3-05)

## Priorite MODEREE (Qualite audit)

18. Safeguards Art. 50(3) (T7-06)
19. Marquage contenu qualite (T7-03)
20. Sandbox reglementaire (GAP-B06)
21. Codes de conduite (GAP-B07)
22. Accessibilite Directive 2019/882 (GAP-B08)
