# COMPLIA -- Diagnostic Complet : Arbre Decisionnel & Parcours par Role

**Document** : Specifications du diagnostic approfondi -- Logique conditionnelle, scoring dimensionnel et rapport
**Version** : 1.0
**Date** : 26 mars 2026
**Base reglementaire** : Reglement (UE) 2024/1689 (EU AI Act)
**Prerequis** : Ce document etend le pre-audit express (spec 03) en un diagnostic complet avec parcours 100 % distincts par role.

---

## TABLE DES MATIERES

- Section A -- Arbre decisionnel global (pseudo-code)
- Section B -- Parcours Fournisseur (Art. 8-17)
- Section C -- Parcours Deployeur (Art. 26)
- Section D -- Parcours Importateur (Art. 23)
- Section E -- Parcours Distributeur (Art. 24)
- Section F -- Scoring & Rapport

---

# ═══ SECTION A — ARBRE DECISIONNEL GLOBAL ═══

## Pseudo-code complet de l'arbre de diagnostic

```
NOEUD 0 — PERIMETRE TERRITORIAL (Art. 2)
│
├── Q: L'organisation opere-t-elle, fournit-elle des outputs, ou impacte-t-elle
│   des personnes physiques situees dans l'Union europeenne ?
│
├── IF reponse == "OUI" OR reponse == "PARTIELLEMENT"
│   ├── THEN flag_territorial = IN_SCOPE
│   ├── note = "Application directe du Reglement (UE) 2024/1689"
│   └── GOTO NOEUD_1
│
├── IF reponse == "NON"
│   ├── THEN flag_territorial = EXTRATERRITORIAL_CHECK
│   ├── Q_sous: Les outputs de vos systemes IA sont-ils utilises dans l'UE ?
│   │   ├── IF OUI → flag_territorial = IN_SCOPE_EXTRATERRITORIAL
│   │   │   note = "Art. 2§1(c): le reglement s'applique par effet extraterritorial"
│   │   │   GOTO NOEUD_1
│   │   └── IF NON → flag_territorial = OUT_OF_SCOPE
│   │       ALERTE = "Hors perimetre probable. Le diagnostic s'arrete ici."
│   │       GENERATE rapport_hors_perimetre
│   │       EXIT
│   └── IF NSP → flag_territorial = IN_SCOPE_PRESUMED
│       note = "Presomption d'application — l'extraterritorialite est frequente"
│       GOTO NOEUD_1
│
│
NOEUD 1 — DEFINITION SYSTEME IA (Art. 3 §1)
│
├── Q: Votre organisation utilise-t-elle, developpe-t-elle ou commercialise-t-elle
│   un systeme fonde sur une machine, concu pour fonctionner avec differents
│   niveaux d'autonomie, qui peut faire preuve d'une capacite d'adaptation et qui,
│   a partir des entrees qu'il recoit, genere des sorties (predictions, contenus,
│   recommandations, decisions) pouvant influencer des environnements physiques
│   ou virtuels ?
│
├── IF reponse == "OUI"
│   ├── THEN flag_systeme_ia = CONFIRMED
│   └── GOTO NOEUD_2
│
├── IF reponse == "NON"
│   ├── Q_clarification: Utilisez-vous des outils incluant du machine learning,
│   │   du deep learning, des approches statistiques ou des systemes experts ?
│   │   ├── IF OUI → flag_systeme_ia = CONFIRMED
│   │   │   note = "Systeme IA confirme au sens de l'Art. 3§1"
│   │   │   GOTO NOEUD_2
│   │   └── IF NON → flag_systeme_ia = NOT_AI
│   │       note = "Logiciel classique — hors perimetre AI Act"
│   │       GENERATE rapport_hors_perimetre_ia
│   │       EXIT
│   └── IF NSP → flag_systeme_ia = PRESUMED
│       ALERTE = "Incertitude sur la qualification IA — investigation recommandee"
│       GOTO NOEUD_2
│
│
NOEUD 2 — PRATIQUES INTERDITES (Art. 5) — KILL SWITCH
│
├── Pour chacune des 8 pratiques interdites (Art. 5§1 a-h):
│   ├── Q-INTERDIT-01: Techniques subliminales/manipulatrices (Art. 5§1(a))
│   ├── Q-INTERDIT-02: Exploitation de vulnerabilites (Art. 5§1(b))
│   ├── Q-INTERDIT-03: Scoring social (Art. 5§1(c))
│   ├── Q-INTERDIT-04: Police predictive par profilage (Art. 5§1(d))
│   ├── Q-INTERDIT-05: Moissonnage facial non cible (Art. 5§1(e))
│   ├── Q-INTERDIT-06: Inference emotions travail/education (Art. 5§1(f))
│   ├── Q-INTERDIT-07: Categorisation biometrique sensible (Art. 5§1(g))
│   ├── Q-INTERDIT-08: Identification biometrique TR espace public (Art. 5§1(h))
│
│   ├── Pour chaque question:
│   │   IF reponse == "OUI"
│   │   ├── THEN flag_interdit = CRITICAL
│   │   ├── score_interdit += 20
│   │   ├── ALERTE_CRITIQUE = "PRATIQUE INTERDITE DETECTEE — Art. 5§1(x).
│   │   │   En vigueur depuis le 2 fevrier 2025.
│   │   │   Amende: jusqu'a 35M EUR ou 7% CA mondial.
│   │   │   ACTION IMMEDIATE REQUISE: cessation et remediation."
│   │   └── CONTINUE (ne pas arreter — detecter toutes les violations)
│   │
│   │   IF reponse == "NSP"
│   │   ├── THEN flag_interdit_nsp += 1
│   │   ├── score_interdit += 5
│   │   └── ALERTE = "Investigation urgente recommandee sur Art. 5§1(x)"
│   │
│   │   IF reponse == "NON"
│   │   └── score_interdit += 0
│
├── BILAN NOEUD 2:
│   ├── IF count(flag_interdit == CRITICAL) >= 1
│   │   ├── ALERTE_GLOBALE = "AU MOINS UNE PRATIQUE INTERDITE DETECTEE"
│   │   ├── flag_urgence = IMMEDIATE
│   │   └── Le diagnostic CONTINUE (les pratiques interdites n'excluent pas
│   │       d'autres obligations)
│   ├── IF count(flag_interdit_nsp) >= 1
│   │   └── RECOMMANDATION = "Audit Art. 5 approfondi necessaire"
│   └── GOTO NOEUD_3
│
│
NOEUD 3 — IDENTIFICATION DU ROLE (Art. 3 §§3-8)
│
├── Q-ROLE-A: Developpez-vous ou entrainez-vous des systemes IA
│   et/ou les mettez-vous sur le marche UE sous votre nom/marque ?
│   IF OUI → roles[] += FOURNISSEUR
│
├── Q-ROLE-B: Utilisez-vous des systemes IA sous votre autorite
│   dans le cadre de vos activites professionnelles ?
│   IF OUI → roles[] += DEPLOYEUR
│
├── Q-ROLE-C: Importez-vous dans l'UE des systemes IA developpes
│   par des fournisseurs etablis hors UE ?
│   IF OUI → roles[] += IMPORTATEUR
│
├── Q-ROLE-D: Mettez-vous a disposition sur le marche UE des systemes IA
│   sans les modifier substantiellement ?
│   IF OUI → roles[] += DISTRIBUTEUR
│
├── IF roles[] est vide
│   ├── ALERTE = "Role indetermine — qualification necessaire"
│   ├── roles[] += INDETERMINE
│   └── GOTO NOEUD_5 (classification risque directe)
│
├── IF len(roles[]) > 1
│   ├── flag_cumul = TRUE
│   ├── note = "CUMUL DE ROLES DETECTE — Art. 25 applicable"
│   ├── Pour chaque role dans roles[]:
│   │   LANCER parcours_role correspondant EN PARALLELE
│   └── GOTO NOEUD_7 (cumul Art. 25)
│
├── IF len(roles[]) == 1
│   └── GOTO NOEUD_4[role] (parcours unique)
│
│
NOEUD 4a — PARCOURS FOURNISSEUR → Voir SECTION B (Q-F-01 a Q-F-35)
NOEUD 4b — PARCOURS DEPLOYEUR   → Voir SECTION C (Q-D-01 a Q-D-30)
NOEUD 4c — PARCOURS IMPORTATEUR → Voir SECTION D (Q-I-01 a Q-I-20)
NOEUD 4d — PARCOURS DISTRIBUTEUR→ Voir SECTION E (Q-R-01 a Q-R-15)
│
│   Chaque parcours est ENTIEREMENT DISTINCT.
│   Un Deployeur ne voit JAMAIS une question Fournisseur.
│   Un Importateur ne voit JAMAIS une question Deployeur.
│   Les questions sont prefixees par le role (Q-F, Q-D, Q-I, Q-R).
│
│   A la fin de chaque parcours role:
│   └── GOTO NOEUD_5
│
│
NOEUD 5 — CLASSIFICATION RISQUE (Art. 6 + Annexe III)
│
├── Pour chaque systeme IA inventorie dans le parcours role:
│   ├── Comparer avec les 8 domaines Annexe III:
│   │   1. Biometrie (pt 1)
│   │   2. Infrastructure critique (pt 2)
│   │   3. Education/formation professionnelle (pt 3)
│   │   4. Emploi, gestion travailleurs, acces emploi (pt 4)
│   │   5. Services essentiels prives et publics (pt 5)
│   │   6. Repression (pt 6)
│   │   7. Migration, asile, controle frontieres (pt 7)
│   │   8. Administration de la justice, processus democratiques (pt 8)
│   │
│   ├── Verifier Annexe I (legislation harmonisation UE):
│   │   Dispositifs medicaux, vehicules, machines, jouets, etc.
│   │
│   ├── Verifier Art. 6§1 (composant de securite produit):
│   │   IF systeme == composant_securite AND produit ∈ Annexe I
│   │   → classification = HAUT_RISQUE
│   │
│   ├── Verifier Art. 6§2 (Annexe III directe):
│   │   IF systeme ∈ domaines_annexe_III
│   │   → classification = HAUT_RISQUE
│   │
│   ├── IF aucun match Annexe III / Annexe I:
│   │   ├── IF systeme == IA_generative OR chatbot OR recommandation
│   │   │   → classification = RISQUE_LIMITE (Art. 50)
│   │   └── ELSE → classification = RISQUE_MINIMAL
│   │
│   └── STOCKER classification par systeme
│
├── GOTO NOEUD_6
│
│
NOEUD 6 — EXEMPTIONS Art. 6(3)
│
├── IF au moins 1 systeme classifie HAUT_RISQUE:
│   ├── Pour chaque systeme HR:
│   │   ├── Q: Ce systeme effectue-t-il une tache procedurale etroite ?
│   │   ├── Q: Ameliore-t-il le resultat d'une activite humaine prealable ?
│   │   ├── Q: Detecte-t-il des schemas decisionnels sans remplacer/influencer
│   │   │   l'evaluation humaine prealable ?
│   │   ├── Q: Constitue-t-il une tache preparatoire a une evaluation humaine ?
│   │   │
│   │   ├── IF au moins 1 critere == OUI
│   │   │   ├── classification_systeme = HAUT_RISQUE_EXEMPT
│   │   │   ├── score_HR_systeme /= 2 (divise par 2)
│   │   │   └── note = "Exemption Art. 6§3 applicable — obligations reduites"
│   │   └── ELSE
│   │       └── classification_systeme = HAUT_RISQUE_CONFIRME
│   │           note = "Pas d'exemption — obligations completes Art. 8-15"
│
├── GOTO NOEUD_7 si flag_cumul == TRUE, sinon GOTO NOEUD_8
│
│
NOEUD 7 — CUMUL DE ROLES Art. 25
│
├── IF flag_cumul == TRUE:
│   ├── Q: Avez-vous commercialise sous votre nom/marque un systeme IA
│   │   initialement developpe par un tiers ? (Art. 25§1(a))
│   │   IF OUI → ALERTE = "Requalification en Fournisseur — obligations Art. 16"
│   │   score_cumul += 15
│   │
│   ├── Q: Avez-vous apporte une modification substantielle a un systeme IA
│   │   deja mis sur le marche ? (Art. 25§1(b))
│   │   IF OUI → ALERTE = "Requalification en Fournisseur — nouvelle evaluation
│   │             de conformite requise"
│   │   score_cumul += 15
│   │
│   ├── Q: Avez-vous modifie la destination d'un systeme IA de maniere
│   │   a le faire relever du haut risque ? (Art. 25§1(c))
│   │   IF OUI → ALERTE = "Systeme requalifie HR — obligations completes Art. 8-15"
│   │   score_cumul += 20
│   │
│   └── Fusionner les scores des parcours paralleles
│       score_cumul_total = max(score_parcours_A, score_parcours_B) * 1.15
│
├── GOTO NOEUD_8
│
│
NOEUD 8 — GPAI (Art. 51-55, Modeles IA a Usage General)
│
├── Q: Utilisez-vous ou fournissez-vous des modeles d'IA a usage general (GPAI) ?
│   ├── IF NON → GOTO NOEUD_FINAL
│   ├── IF OUI:
│   │   ├── Q: Fournissez-vous un modele GPAI integre dans vos systemes IA ?
│   │   │   IF OUI:
│   │   │   ├── Q: Documentation technique du modele conforme Art. 53 ? (OUI/NON/Partiel)
│   │   │   ├── Q: Politique respect droits auteur definie ? (OUI/NON)
│   │   │   ├── Q: Resume detaille des donnees d'entrainement publie ? (OUI/NON)
│   │   │   ├── IF NON a >=1 → score_gpai += 8
│   │   │
│   │   ├── Q: Le modele GPAI presente-t-il un risque systemique ?
│   │   │   (capacite de calcul > 10^25 FLOPs, ou designation Commission)
│   │   │   IF OUI (Art. 51§2 + Art. 55):
│   │   │   ├── score_gpai += 10
│   │   │   ├── ALERTE = "Modele GPAI a risque systemique — obligations renforcees"
│   │   │   ├── Q: Evaluation modele realisee selon Art. 55§1(a) ? (OUI/NON)
│   │   │   ├── Q: Risques systemiques evalues et attenués ? (OUI/NON)
│   │   │   ├── Q: Incidents graves documentes et signales ? (OUI/NON)
│   │   │   ├── Q: Cybersecurite adequate du modele ? (OUI/NON)
│   │   │   └── IF NON a >=1 → score_gpai += 5
│   │   │
│   │   └── Q: Marquage des contenus generes par IA (Art. 50§2) ? (OUI/NON/Partiel)
│   │       ├── IF NON → score_gpai += 4
│   │       └── IF Partiel → score_gpai += 2
│
├── GOTO NOEUD_FINAL
│
│
NOEUD FINAL — SCORE GLOBAL + RECOMMANDATION
│
├── CALCUL:
│   score_brut = score_parcours_role
│              + score_interdit
│              + score_classification_HR
│              + score_cumul (si applicable)
│              + score_gpai (si applicable)
│
│   score_ajuste = score_brut
│                * multiplicateur_secteur
│                * multiplicateur_taille
│                * escalade_sectorielle (si applicable)
│
│   score_final = min(100, round(score_ajuste))
│
├── SEUILS:
│   ├── IF score_final >= 80 → niveau = CONFORME
│   │   couleur = vert (#16a34a)
│   │   recommandation = "Veille reglementaire"
│   │
│   ├── IF 50 <= score_final < 80 → niveau = CONDITIONNEL
│   │   couleur = orange (#f97316)
│   │   recommandation = "Diagnostic strategique + plan remediation"
│   │
│   └── IF score_final < 50 → niveau = NON_CONFORME
│       couleur = rouge (#dc2626)
│       recommandation = "Mise en conformite urgente — pack complet"
│
├── GENERATE rapport_diagnostic
└── EXIT
```

---

# ═══ SECTION B — PARCOURS FOURNISSEUR (Art. 8-17) ═══

**Condition d'entree** : role == FOURNISSEUR (Q-ROLE-A == OUI au Noeud 3)
**Isolation** : Ce parcours est EXCLUSIF au role Fournisseur. Aucune question de ce parcours n'apparait dans les parcours Deployeur, Importateur ou Distributeur.

## Dimensions de scoring Fournisseur

| Code | Dimension | Reference principale | Poids |
|------|-----------|---------------------|-------|
| D1-F | Documentation technique | Annexe IV | 20% |
| D2-F | Systeme de gestion de la qualite (QMS) | Art. 17 | 15% |
| D3-F | Evaluation de la conformite | Art. 43-46 | 15% |
| D4-F | Marquage CE & declaration conformite | Art. 47-49 | 10% |
| D5-F | Transparence & information | Art. 13 | 15% |
| D6-F | Surveillance post-marche | Art. 72 | 15% |
| D7-F | Cybersecurite & robustesse | Art. 15 | 10% |

---

### Q-F-01 — Systeme de gestion des risques

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous mis en place un systeme de gestion des risques couvrant l'ensemble du cycle de vie de vos systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, formalise et documente / B. En cours de mise en place / C. Non / D. Je ne comprends pas cette obligation |
| **Condition** | Toujours (premiere question Fournisseur) |
| **Routing** | Si C ou D → ALERTE "Obligation fondamentale Art. 9 non remplie" + Q-F-02 / Si A ou B → Q-F-02 |
| **Score** | A: +0 D1-F / B: +3 D1-F / C: +8 D1-F / D: +6 D1-F |
| **Reference** | Art. 9 |

---

### Q-F-02 — Identification et analyse des risques

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous identifie et analyse les risques connus et raisonnablement previsibles que vos systemes IA peuvent presenter pour la sante, la securite ou les droits fondamentaux ? |
| **Type** | Choix unique |
| **Options** | A. Oui, pour tous nos systemes / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-01) |
| **Routing** | Si A → Q-F-03 / Si B ou C ou D → ALERTE "Analyse des risques incomplete — Art. 9§2" + Q-F-03 |
| **Score** | A: +0 D1-F / B: +3 D1-F / C: +6 D1-F / D: +4 D1-F |
| **Reference** | Art. 9§2 |

---

### Q-F-03 — Mesures d'attenuation des risques

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Des mesures de gestion et d'attenuation des risques identifies sont-elles mises en oeuvre ? |
| **Type** | Choix unique |
| **Options** | A. Oui, documentees et testees / B. En partie / C. Non |
| **Condition** | Toujours (apres Q-F-02) |
| **Routing** | Si A → Q-F-04 / Si B ou C → ALERTE + Q-F-04 |
| **Score** | A: +0 D1-F / B: +3 D1-F / C: +6 D1-F |
| **Reference** | Art. 9§4 |

---

### Q-F-04 — Tests des systemes IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes IA sont-ils testes de maniere appropriee a chaque etape du developpement et avant la mise sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, protocole de test formalise / B. Tests partiels / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-03) |
| **Routing** | Si A → Q-F-05 / Sinon → ALERTE "Tests insuffisants Art. 9§7" + Q-F-05 |
| **Score** | A: +0 D1-F / B: +2 D1-F / C: +5 D1-F / D: +4 D1-F |
| **Reference** | Art. 9§7 |

---

### Q-F-05 — Gouvernance des donnees

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les jeux de donnees d'entrainement, de validation et de test sont-ils soumis a des pratiques de gouvernance des donnees documentees ? |
| **Type** | Choix unique |
| **Options** | A. Oui, politique formalisee / B. Partiellement / C. Non / D. Pas de donnees d'entrainement (systeme base sur des regles) |
| **Condition** | Toujours (apres Q-F-04) |
| **Routing** | Si D → Q-F-07 (skip donnees) / Si C → ALERTE "Art. 10 non conforme" + Q-F-06 / Sinon → Q-F-06 |
| **Score** | A: +0 D1-F / B: +3 D1-F / C: +7 D1-F / D: +0 D1-F |
| **Reference** | Art. 10 |

---

### Q-F-06 — Biais et representativite des donnees

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous evalue et attenué les biais potentiels dans vos jeux de donnees, notamment en termes de representativite geographique, contextuelle et comportementale ? |
| **Type** | Choix unique |
| **Options** | A. Oui, evaluation documentee / B. Evaluation partielle / C. Non / D. NSP |
| **Condition** | Q-F-05 != D (donnees d'entrainement existantes) |
| **Routing** | Si A → Q-F-07 / Sinon → ALERTE "Risque biais Art. 10§2(f)" + Q-F-07 |
| **Score** | A: +0 D1-F / B: +2 D1-F / C: +5 D1-F / D: +4 D1-F |
| **Reference** | Art. 10§2(f) |

---

### Q-F-07 — Documentation technique Annexe IV

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'une documentation technique conforme a l'Annexe IV du reglement, etablie AVANT la mise sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, complete et a jour / B. Partiellement documentee / C. Non / D. Je ne connais pas les exigences de l'Annexe IV |
| **Condition** | Toujours (apres Q-F-05/Q-F-06) |
| **Routing** | Si D → ALERTE "Obligation meconnue — risque majeur" + Q-F-08 / Si C → ALERTE + Q-F-08 / Sinon → Q-F-08 |
| **Score** | A: +0 D1-F / B: +4 D1-F / C: +8 D1-F / D: +7 D1-F |
| **Reference** | Art. 11, Annexe IV |

---

### Q-F-08 — Description generale du systeme

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre documentation technique inclut-elle une description generale du systeme IA (destination, developpeur, version, interaction avec materiel/logiciel) ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Toujours (apres Q-F-07) |
| **Routing** | Si Non ou NSP → ALERTE "Annexe IV §1 incomplet" + Q-F-09 / Si Oui → Q-F-09 |
| **Score** | Oui: +0 D1-F / Non: +3 D1-F / NSP: +2 D1-F |
| **Reference** | Annexe IV §1 |

---

### Q-F-09 — Elements de conception et architecture

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | La documentation inclut-elle les elements de conception (logique, algorithmes, processus de developpement) et l'architecture du systeme ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Toujours (apres Q-F-08) |
| **Routing** | Sinon ALERTE + Q-F-10 / Oui → Q-F-10 |
| **Score** | Oui: +0 D1-F / Non: +3 D1-F / NSP: +2 D1-F |
| **Reference** | Annexe IV §2 |

---

### Q-F-10 — Notice d'utilisation (Instructions for Use)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Fournissez-vous une notice d'utilisation claire et comprehensible aux deployeurs de vos systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, complete et accessible / B. Notice partielle / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-09) |
| **Routing** | Si C ou D → ALERTE "Notice d'utilisation obligatoire Art. 13" + Q-F-11 / Sinon → Q-F-11 |
| **Score** | A: +0 D5-F / B: +3 D5-F / C: +6 D5-F / D: +5 D5-F |
| **Reference** | Art. 13 |

---

### Q-F-11 — Contenu de la notice : capacites et limites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | La notice d'utilisation precise-t-elle les capacites, les limites connues et les risques residuels du systeme IA ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Q-F-10 == A ou B (notice existante) |
| **Routing** | Si Non → ALERTE + Q-F-12 / Si Oui → Q-F-12 |
| **Score** | Oui: +0 D5-F / Non: +4 D5-F / NSP: +3 D5-F |
| **Reference** | Art. 13§3(b) |

---

### Q-F-12 — Surveillance humaine integree

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes IA sont-ils concus pour permettre une surveillance humaine effective, incluant des outils d'interpretation des sorties et de capacite d'interruption ? |
| **Type** | Choix unique |
| **Options** | A. Oui, surveillance humaine integree des la conception / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-10/Q-F-11) |
| **Routing** | Si C ou D → ALERTE "Art. 14 — obligation de conception" + Q-F-13 / Sinon → Q-F-13 |
| **Score** | A: +0 D5-F / B: +3 D5-F / C: +7 D5-F / D: +5 D5-F |
| **Reference** | Art. 14 |

---

### Q-F-13 — Exactitude, robustesse, cybersecurite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous defini et documente les niveaux d'exactitude, de robustesse et de cybersecurite de vos systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, pour tous les systemes / B. Pour certains systemes / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-12) |
| **Routing** | Si C ou D → ALERTE "Art. 15 non conforme" + Q-F-14 / Sinon → Q-F-14 |
| **Score** | A: +0 D7-F / B: +3 D7-F / C: +6 D7-F / D: +5 D7-F |
| **Reference** | Art. 15 |

---

### Q-F-14 — Protection contre les manipulations

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes IA sont-ils proteges contre les tentatives de manipulation par des tiers (adversarial attacks, data poisoning, model manipulation) ? |
| **Type** | Choix unique |
| **Options** | A. Oui, mesures techniques en place / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-13) |
| **Routing** | Vers Q-F-15 |
| **Score** | A: +0 D7-F / B: +2 D7-F / C: +5 D7-F / D: +4 D7-F |
| **Reference** | Art. 15§4 |

---

### Q-F-15 — Journalisation automatique (logging)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes IA HR disposent-ils de capacites de journalisation automatique (logging) conformes a l'Art. 12 ? |
| **Type** | Choix unique |
| **Options** | A. Oui, logs automatiques actifs / B. Partiellement / C. Non / D. Non applicable (pas de systeme HR) |
| **Condition** | Toujours (apres Q-F-14) |
| **Routing** | Si D → Q-F-17 / Sinon → Q-F-16 |
| **Score** | A: +0 D1-F / B: +3 D1-F / C: +6 D1-F / D: +0 D1-F |
| **Reference** | Art. 12 |

---

### Q-F-16 — Tracabilite des logs

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les logs permettent-ils de tracer les evenements pertinents durant le fonctionnement du systeme, y compris les situations de risque ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Q-F-15 == A ou B (logs existants) |
| **Routing** | Vers Q-F-17 |
| **Score** | Oui: +0 D1-F / Non: +3 D1-F / NSP: +2 D1-F |
| **Reference** | Art. 12§2 |

---

### Q-F-17 — Systeme de gestion de la qualite (QMS)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'un systeme de gestion de la qualite (QMS) documente couvrant les aspects enumeres a l'Art. 17 ? |
| **Type** | Choix unique |
| **Options** | A. Oui, QMS formalise et documente / B. QMS en cours d'elaboration / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-15/Q-F-16) |
| **Routing** | Si A → Q-F-20 / Si B → Q-F-18 / Si C ou D → ALERTE "QMS obligatoire Art. 17" + Q-F-18 |
| **Score** | A: +0 D2-F / B: +4 D2-F / C: +8 D2-F / D: +7 D2-F |
| **Reference** | Art. 17 |

---

### Q-F-18 — QMS : strategies conformite et processus

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre QMS inclut-il : strategie de conformite, techniques de conception, procedures d'examen, procedures de test et validation ? |
| **Type** | Choix multiple |
| **Options** | A. Strategie de conformite reglementaire / B. Techniques et procedures de conception / C. Procedures d'examen et test / D. Procedures de validation et verification / E. Aucun de ces elements |
| **Condition** | Q-F-17 == B (QMS en cours) |
| **Routing** | Vers Q-F-19 |
| **Score** | Chaque item A-D manquant: +2 D2-F / E (aucun): +8 D2-F |
| **Reference** | Art. 17§1(a-d) |

---

### Q-F-19 — QMS : gestion ressources et responsabilites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre QMS inclut-il des specifications de ressources, des attributions de responsabilites et un systeme de gestion des donnees ? |
| **Type** | Choix multiple |
| **Options** | A. Specifications de ressources / B. Attributions de responsabilites / C. Gestion des donnees / D. Actions correctives / E. Aucun |
| **Condition** | Q-F-17 == B (QMS en cours) |
| **Routing** | Vers Q-F-20 |
| **Score** | Chaque item A-D manquant: +1 D2-F / E: +5 D2-F |
| **Reference** | Art. 17§1(e-i) |

---

### Q-F-20 — Procedure d'evaluation de la conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous determine la procedure d'evaluation de la conformite applicable a vos systemes IA HR ? |
| **Type** | Choix unique |
| **Options** | A. Oui, procedure identifiee (controle interne Art. 43§1 ou organisme notifie Art. 43§2) / B. En cours d'identification / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-17/Q-F-19) |
| **Routing** | Si A → Q-F-21 / Sinon → ALERTE + Q-F-21 |
| **Score** | A: +0 D3-F / B: +3 D3-F / C: +7 D3-F / D: +6 D3-F |
| **Reference** | Art. 43 |

---

### Q-F-21 — Type de procedure de conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Quel type de procedure d'evaluation de la conformite appliquez-vous ? |
| **Type** | Choix unique |
| **Options** | A. Controle interne (Art. 43§1, Annexe VI) / B. Evaluation avec organisme notifie (Art. 43§2, Annexe VII) / C. Les deux selon les systemes / D. Pas encore determine |
| **Condition** | Q-F-20 == A (procedure identifiee) |
| **Routing** | Si B ou C → Q-F-22 (organisme notifie) / Sinon → Q-F-23 |
| **Score** | A: +0 D3-F / B: +0 D3-F / C: +0 D3-F / D: +3 D3-F |
| **Reference** | Art. 43§1-2 |

---

### Q-F-22 — Organisme notifie

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous identifie et contacte un organisme notifie pour l'evaluation de conformite de vos systemes IA necessitant une evaluation tierce ? |
| **Type** | Choix unique |
| **Options** | A. Oui, organisme designe / B. En cours de recherche / C. Non |
| **Condition** | Q-F-21 == B ou C (organisme notifie requis) |
| **Routing** | Vers Q-F-23 |
| **Score** | A: +0 D3-F / B: +2 D3-F / C: +5 D3-F |
| **Reference** | Art. 43§2, Art. 28-39 |

---

### Q-F-23 — Declaration UE de conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Etablissez-vous une declaration UE de conformite pour chaque systeme IA HR avant sa mise sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, pour chaque systeme / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-20/Q-F-22) |
| **Routing** | Vers Q-F-24 |
| **Score** | A: +0 D4-F / B: +3 D4-F / C: +6 D4-F / D: +5 D4-F |
| **Reference** | Art. 47 |

---

### Q-F-24 — Marquage CE

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Apposez-vous le marquage CE sur vos systemes IA HR conformement a l'Art. 48 ? |
| **Type** | Choix unique |
| **Options** | A. Oui, marquage CE appose / B. En preparation / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-23) |
| **Routing** | Vers Q-F-25 |
| **Score** | A: +0 D4-F / B: +2 D4-F / C: +5 D4-F / D: +4 D4-F |
| **Reference** | Art. 48-49 |

---

### Q-F-25 — Enregistrement base de donnees UE

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous enregistre vos systemes IA HR dans la base de donnees de l'UE prevue a l'Art. 71 ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. En cours / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-24) |
| **Routing** | Vers Q-F-26 |
| **Score** | A: +0 D4-F / B: +2 D4-F / C: +5 D4-F / D: +4 D4-F |
| **Reference** | Art. 49, Art. 71 |

---

### Q-F-26 — Surveillance post-marche : systeme en place

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous mis en place un systeme de surveillance apres commercialisation pour vos systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systeme documente et operationnel / B. En cours / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-25) |
| **Routing** | Si A → Q-F-28 / Si B → Q-F-27 / Si C ou D → ALERTE "Art. 72 — obligation post-marche" + Q-F-27 |
| **Score** | A: +0 D6-F / B: +4 D6-F / C: +8 D6-F / D: +7 D6-F |
| **Reference** | Art. 72 |

---

### Q-F-27 — Plan de surveillance post-marche

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'un plan de surveillance apres commercialisation au sens de l'Art. 72§3 ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Q-F-26 == B ou C ou D (pas de systeme operationnel) |
| **Routing** | Vers Q-F-28 |
| **Score** | Oui: +0 D6-F / Non: +4 D6-F / NSP: +3 D6-F |
| **Reference** | Art. 72§3 |

---

### Q-F-28 — Signalement incidents graves

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'une procedure de signalement des incidents graves aux autorites competentes ? |
| **Type** | Choix unique |
| **Options** | A. Oui, procedure definie et testee / B. Procedure definie mais non testee / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-26/Q-F-27) |
| **Routing** | Vers Q-F-29 |
| **Score** | A: +0 D6-F / B: +2 D6-F / C: +5 D6-F / D: +4 D6-F |
| **Reference** | Art. 73 |

---

### Q-F-29 — Actions correctives post-marche

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Etes-vous en mesure de prendre des actions correctives (retrait, rappel) si un systeme IA s'avere non conforme apres mise sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, processus documente / B. Partiellement / C. Non |
| **Condition** | Toujours (apres Q-F-28) |
| **Routing** | Vers Q-F-30 |
| **Score** | A: +0 D6-F / B: +2 D6-F / C: +5 D6-F |
| **Reference** | Art. 16(j), Art. 20 |

---

### Q-F-30 — Mandataire UE

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Si vous etes etabli hors de l'UE, avez-vous designe un mandataire autorise dans l'Union ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. En cours / C. Non / D. Non applicable (etabli dans l'UE) |
| **Condition** | Toujours (apres Q-F-29) |
| **Routing** | Si D → Q-F-31 / Sinon → Q-F-31 |
| **Score** | A: +0 D3-F / B: +3 D3-F / C: +8 D3-F / D: +0 D3-F |
| **Reference** | Art. 22 |

---

### Q-F-31 — Transparence : information interaction IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les personnes physiques interagissant avec vos systemes IA sont-elles informees qu'elles interagissent avec un systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Pas toujours / C. Non / D. Non applicable |
| **Condition** | Toujours (apres Q-F-30) |
| **Routing** | Vers Q-F-32 |
| **Score** | A: +0 D5-F / B: +3 D5-F / C: +6 D5-F / D: +0 D5-F |
| **Reference** | Art. 50§1 |

---

### Q-F-32 — Marquage contenu genere par IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les contenus generes par vos systemes IA (textes, images, audio, video) sont-ils marques de maniere lisible par machine ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. Non applicable (pas de generation de contenu) |
| **Condition** | Toujours (apres Q-F-31) |
| **Routing** | Vers Q-F-33 |
| **Score** | A: +0 D5-F / B: +2 D5-F / C: +5 D5-F / D: +0 D5-F |
| **Reference** | Art. 50§2 |

---

### Q-F-33 — Maitrise de l'IA (Art. 4)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous pris des mesures pour garantir un niveau suffisant de maitrise de l'IA au sein de votre personnel implique dans le developpement et l'exploitation de vos systemes ? |
| **Type** | Choix unique |
| **Options** | A. Oui, programme de formation en place / B. Mesures partielles / C. Non / D. Pas encore identifie comme priorite |
| **Condition** | Toujours (apres Q-F-32) |
| **Routing** | Vers Q-F-34 |
| **Score** | A: +0 D2-F / B: +2 D2-F / C: +5 D2-F / D: +4 D2-F |
| **Reference** | Art. 4 |

---

### Q-F-34 — Conservation documentation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Conservez-vous la documentation technique, la declaration de conformite et les logs pendant au moins 10 ans apres la mise sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-F-33) |
| **Routing** | Vers Q-F-35 |
| **Score** | A: +0 D1-F / B: +2 D1-F / C: +4 D1-F / D: +3 D1-F |
| **Reference** | Art. 18 |

---

### Q-F-35 — Cooperation autorites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Etes-vous en mesure de fournir a une autorite competente toutes les informations et la documentation demontrant la conformite de vos systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, en toute circonstance / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (derniere question Fournisseur) |
| **Routing** | FIN PARCOURS FOURNISSEUR → GOTO NOEUD_5 |
| **Score** | A: +0 D3-F / B: +2 D3-F / C: +4 D3-F / D: +3 D3-F |
| **Reference** | Art. 21 |

---

# ═══ SECTION C — PARCOURS DEPLOYEUR (Art. 26) ═══

**Condition d'entree** : role == DEPLOYEUR (Q-ROLE-B == OUI au Noeud 3)
**Isolation** : Ce parcours est EXCLUSIF au role Deployeur. Aucune question Fournisseur, Importateur ou Distributeur n'apparait.

## Dimensions de scoring Deployeur

| Code | Dimension | Reference principale | Poids |
|------|-----------|---------------------|-------|
| D1-D | Surveillance humaine | Art. 26§1-2, Art. 14 | 20% |
| D2-D | Registre des activites | Art. 26§6 | 10% |
| D3-D | FRIA (Evaluation d'impact droits fondamentaux) | Art. 27 | 20% |
| D4-D | Conservation des logs | Art. 26§5 | 10% |
| D5-D | Information des personnes concernees | Art. 26§6, Art. 50 | 15% |
| D6-D | Verification fournisseur | Art. 26§1 | 15% |
| D7-D | Gestion incidents & non-conformites | Art. 26§5 | 10% |

---

### Q-D-01 — Verification documentation fournisseur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie que vos fournisseurs de systemes IA vous ont remis la documentation technique et la notice d'utilisation prevues par le reglement ? |
| **Type** | Choix unique |
| **Options** | A. Oui, pour tous nos systemes IA / B. Partiellement / C. Non / D. Je ne savais pas que c'etait necessaire |
| **Condition** | Toujours (premiere question Deployeur) |
| **Routing** | Si C ou D → ALERTE "Obligation Art. 26§1 non remplie" + Q-D-02 / Sinon → Q-D-02 |
| **Score** | A: +0 D6-D / B: +3 D6-D / C: +7 D6-D / D: +6 D6-D |
| **Reference** | Art. 26§1 |

---

### Q-D-02 — Verification marquage CE et declaration conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie que vos systemes IA HR disposent du marquage CE et d'une declaration UE de conformite valide ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-01) |
| **Routing** | Vers Q-D-03 |
| **Score** | A: +0 D6-D / B: +2 D6-D / C: +5 D6-D / D: +4 D6-D |
| **Reference** | Art. 26§1 |

---

### Q-D-03 — Utilisation conforme a la destination

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Utilisez-vous vos systemes IA HR conformement a la notice d'utilisation fournie par le fournisseur ? |
| **Type** | Choix unique |
| **Options** | A. Oui, strictement / B. Globalement oui, avec quelques ecarts / C. Nous avons modifie l'usage / D. Nous n'avons pas de notice |
| **Condition** | Toujours (apres Q-D-02) |
| **Routing** | Si C → ALERTE "Risque de requalification Fournisseur Art. 25§1(c)" + Q-D-04 / Si D → ALERTE "Notice obligatoire" + Q-D-04 / Sinon → Q-D-04 |
| **Score** | A: +0 D6-D / B: +2 D6-D / C: +8 D6-D / D: +6 D6-D |
| **Reference** | Art. 26§1 |

---

### Q-D-04 — Surveillance humaine : organisation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous designe des personnes physiques chargees de la surveillance humaine de vos systemes IA HR ? |
| **Type** | Choix unique |
| **Options** | A. Oui, personnes designees et formees / B. Personnes designees mais non formees / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-03) |
| **Routing** | Si A → Q-D-06 / Si B → Q-D-05 / Si C ou D → ALERTE "Art. 26§2 — surveillance humaine obligatoire" + Q-D-05 |
| **Score** | A: +0 D1-D / B: +4 D1-D / C: +8 D1-D / D: +7 D1-D |
| **Reference** | Art. 26§2 |

---

### Q-D-05 — Formation des personnes en charge de la surveillance

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les personnes en charge de la surveillance humaine disposent-elles des competences, de la formation et de l'autorite necessaires pour exercer cette fonction ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Formation en cours / C. Non |
| **Condition** | Q-D-04 == B (designees mais non formees) |
| **Routing** | Vers Q-D-06 |
| **Score** | A: +0 D1-D / B: +2 D1-D / C: +5 D1-D |
| **Reference** | Art. 26§2 |

---

### Q-D-06 — Capacite d'interruption

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les personnes en charge de la surveillance humaine ont-elles la capacite effective d'interrompre ou d'annuler les decisions du systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, a tout moment / B. Dans certains cas / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-04/Q-D-05) |
| **Routing** | Vers Q-D-07 |
| **Score** | A: +0 D1-D / B: +3 D1-D / C: +7 D1-D / D: +5 D1-D |
| **Reference** | Art. 14§4, Art. 26§2 |

---

### Q-D-07 — Biais d'automatisation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous pris des mesures pour prevenir le biais d'automatisation (automation bias) chez les personnes en charge de la surveillance humaine ? |
| **Type** | Choix unique |
| **Options** | A. Oui, mesures specifiques / B. Partiellement / C. Non / D. NSP (qu'est-ce que le biais d'automatisation ?) |
| **Condition** | Toujours (apres Q-D-06) |
| **Routing** | Vers Q-D-08 |
| **Score** | A: +0 D1-D / B: +2 D1-D / C: +4 D1-D / D: +5 D1-D |
| **Reference** | Art. 14§4(b) |

---

### Q-D-08 — Donnees d'entree

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vous assurez-vous que les donnees d'entree fournies a vos systemes IA HR sont pertinentes et suffisamment representatives au regard de la destination du systeme ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-07) |
| **Routing** | Vers Q-D-09 |
| **Score** | A: +0 D6-D / B: +2 D6-D / C: +5 D6-D / D: +4 D6-D |
| **Reference** | Art. 26§4 |

---

### Q-D-09 — Conservation des logs automatiques

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Conservez-vous les logs generes automatiquement par vos systemes IA HR pendant au moins 6 mois ? |
| **Type** | Choix unique |
| **Options** | A. Oui, >= 6 mois / B. Oui, mais moins de 6 mois / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-08) |
| **Routing** | Vers Q-D-10 |
| **Score** | A: +0 D4-D / B: +3 D4-D / C: +6 D4-D / D: +5 D4-D |
| **Reference** | Art. 26§5 |

---

### Q-D-10 — Accessibilite des logs

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les logs sont-ils accessibles et exploitables en cas de demande d'une autorite competente ? |
| **Type** | Oui-Non |
| **Options** | Oui / Non / NSP |
| **Condition** | Toujours (apres Q-D-09) |
| **Routing** | Vers Q-D-11 |
| **Score** | Oui: +0 D4-D / Non: +4 D4-D / NSP: +3 D4-D |
| **Reference** | Art. 26§5 |

---

### Q-D-11 — FRIA : realisation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous realise une evaluation d'impact sur les droits fondamentaux (FRIA) pour vos systemes IA HR ? |
| **Type** | Choix unique |
| **Options** | A. Oui, FRIA realisee et documentee / B. En cours / C. Non / D. NSP (qu'est-ce qu'une FRIA ?) |
| **Condition** | Toujours (apres Q-D-10) |
| **Routing** | Si A → Q-D-13 / Si B → Q-D-12 / Si C ou D → ALERTE "FRIA obligatoire Art. 27" + Q-D-12 |
| **Score** | A: +0 D3-D / B: +4 D3-D / C: +8 D3-D / D: +8 D3-D |
| **Reference** | Art. 27 |

---

### Q-D-12 — FRIA : contenu

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre FRIA (en cours ou prevue) couvre-t-elle les elements suivants ? |
| **Type** | Choix multiple |
| **Options** | A. Description des processus du deployeur dans lesquels le systeme IA sera utilise / B. Periode et frequence d'utilisation prevues / C. Categories de personnes physiques susceptibles d'etre affectees / D. Risques specifiques pour les droits fondamentaux / E. Mesures de surveillance humaine / F. Mesures de remediation en cas d'impact / G. Aucun de ces elements |
| **Condition** | Q-D-11 == B (FRIA en cours) |
| **Routing** | Vers Q-D-13 |
| **Score** | Chaque item A-F manquant: +1 D3-D / G (aucun): +6 D3-D |
| **Reference** | Art. 27§1 |

---

### Q-D-13 — Notification FRIA a l'autorite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous notifie les resultats de votre FRIA a l'autorite de surveillance du marche competente ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non, pas encore / C. Non, je ne savais pas que c'etait necessaire |
| **Condition** | Q-D-11 == A (FRIA realisee) |
| **Routing** | Vers Q-D-14 |
| **Score** | A: +0 D3-D / B: +3 D3-D / C: +5 D3-D |
| **Reference** | Art. 27§4 |

---

### Q-D-14 — Registre des activites de deploiement

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Tenez-vous un registre de vos activites de deploiement de systemes IA HR, incluant les categories d'activites et les decisions prises ? |
| **Type** | Choix unique |
| **Options** | A. Oui, registre tenu a jour / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-11/Q-D-13) |
| **Routing** | Vers Q-D-15 |
| **Score** | A: +0 D2-D / B: +3 D2-D / C: +6 D2-D / D: +5 D2-D |
| **Reference** | Art. 26§6 |

---

### Q-D-15 — Information des personnes : interaction IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Informez-vous les personnes physiques qu'elles sont soumises a un systeme IA HR avant son utilisation ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Parfois / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-14) |
| **Routing** | Vers Q-D-16 |
| **Score** | A: +0 D5-D / B: +3 D5-D / C: +6 D5-D / D: +5 D5-D |
| **Reference** | Art. 26§6 |

---

### Q-D-16 — Information des travailleurs

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Informez-vous les representants des travailleurs et les travailleurs concernes avant le deploiement d'un systeme IA HR sur le lieu de travail ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. Non applicable (pas de systeme IA RH) |
| **Condition** | Toujours (apres Q-D-15) |
| **Routing** | Si D → Q-D-18 / Sinon → Q-D-17 |
| **Score** | A: +0 D5-D / B: +2 D5-D / C: +5 D5-D / D: +0 D5-D |
| **Reference** | Art. 26§7 |

---

### Q-D-17 — Information sur les decisions automatisees

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les personnes affectees par une decision prise ou assistee par un systeme IA HR sont-elles informees de ce fait et des voies de recours disponibles ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-16, sauf si D) |
| **Routing** | Vers Q-D-18 |
| **Score** | A: +0 D5-D / B: +3 D5-D / C: +6 D5-D / D: +5 D5-D |
| **Reference** | Art. 26§11 |

---

### Q-D-18 — Maitrise de l'IA (Art. 4)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous pris des mesures pour garantir un niveau suffisant de maitrise de l'IA pour votre personnel utilisant ou supervisant des systemes IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, programme de formation en place / B. Mesures partielles / C. Non / D. Pas identifie comme priorite |
| **Condition** | Toujours (apres Q-D-16/Q-D-17) |
| **Routing** | Vers Q-D-19 |
| **Score** | A: +0 D1-D / B: +2 D1-D / C: +5 D1-D / D: +4 D1-D |
| **Reference** | Art. 4 |

---

### Q-D-19 — Signalement non-conformite au fournisseur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'une procedure pour informer le fournisseur ou le distributeur si vous constatez un risque ou un dysfonctionnement dans un systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, procedure formalisee / B. Informel / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-18) |
| **Routing** | Vers Q-D-20 |
| **Score** | A: +0 D7-D / B: +2 D7-D / C: +5 D7-D / D: +4 D7-D |
| **Reference** | Art. 26§5 |

---

### Q-D-20 — Suspension d'utilisation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | En cas de risque identifie, etes-vous en mesure de suspendre immediatement l'utilisation d'un systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, processus de suspension prevu / B. Possible mais non formalise / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-19) |
| **Routing** | Vers Q-D-21 |
| **Score** | A: +0 D7-D / B: +2 D7-D / C: +5 D7-D / D: +4 D7-D |
| **Reference** | Art. 26§5 |

---

### Q-D-21 — Transparence systemes reconnaissance emotions / categorisation biometrique

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Si vous utilisez un systeme de reconnaissance des emotions ou de categorisation biometrique, informez-vous les personnes exposees de son fonctionnement ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Non applicable (pas ce type de systeme) |
| **Condition** | Toujours (apres Q-D-20) |
| **Routing** | Si C → Q-D-23 / Sinon → Q-D-22 |
| **Score** | A: +0 D5-D / B: +6 D5-D / C: +0 D5-D |
| **Reference** | Art. 50§3 |

---

### Q-D-22 — Deepfakes et contenus generes

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Si vous generez ou diffusez des contenus crees par IA (textes, images, audio, video), ces contenus sont-ils marques comme generes artificiellement ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Partiellement / C. Non / D. Non applicable |
| **Condition** | Toujours (apres Q-D-21) |
| **Routing** | Vers Q-D-23 |
| **Score** | A: +0 D5-D / B: +2 D5-D / C: +5 D5-D / D: +0 D5-D |
| **Reference** | Art. 50§4 |

---

### Q-D-23 — Donnees personnelles et RGPD

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vos systemes IA traitent-ils des donnees a caractere personnel ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Probablement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-21/Q-D-22) |
| **Routing** | Si A ou B → Q-D-24 / Si C ou D → Q-D-25 |
| **Score** | A: +0 (flag RGPD) / B: +1 D7-D / C: +0 / D: +2 D7-D |
| **Reference** | Art. 2§7, RGPD |

---

### Q-D-24 — Conformite RGPD articulee

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie la conformite RGPD de vos traitements de donnees personnelles lies a vos systemes IA (base legale, DPIA, information personnes) ? |
| **Type** | Choix unique |
| **Options** | A. Oui, conformite verifiee / B. Partiellement / C. Non / D. NSP |
| **Condition** | Q-D-23 == A ou B (donnees personnelles traitees) |
| **Routing** | Vers Q-D-25 |
| **Score** | A: +0 D7-D / B: +3 D7-D / C: +6 D7-D / D: +5 D7-D |
| **Reference** | Art. 2§7, RGPD 2016/679 |

---

### Q-D-25 — Reglementation sectorielle

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre organisation est-elle soumise a une reglementation sectorielle imposant des obligations supplementaires en matiere d'IA ? |
| **Type** | Choix multiple |
| **Options** | A. MedTech / MDR (2017/745) / B. Finance / DORA (2022/2554) / C. Legislation harmonisee Annexe I / D. DSA (services numeriques) / E. Aucune / F. NSP |
| **Condition** | Toujours (apres Q-D-23/Q-D-24) |
| **Routing** | Vers Q-D-26 |
| **Score** | A: +4 D7-D / B: +3 D7-D / C: +3 D7-D / D: +2 D7-D / E: +0 / F: +2 D7-D |
| **Reference** | Annexe I, reglementations sectorielles |

---

### Q-D-26 — Enregistrement base de donnees UE (deployeur public)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Si vous etes un organisme de droit public ou un prestataire de services publics, avez-vous enregistre l'utilisation de vos systemes IA HR dans la base de donnees de l'UE ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Non applicable (entite privee) / D. NSP |
| **Condition** | Toujours (apres Q-D-25) |
| **Routing** | Vers Q-D-27 |
| **Score** | A: +0 D2-D / B: +5 D2-D / C: +0 D2-D / D: +3 D2-D |
| **Reference** | Art. 49§3, Art. 71 |

---

### Q-D-27 — Responsable conformite IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous designe un responsable ou une equipe en charge de la conformite IA au sein de votre organisation ? |
| **Type** | Choix unique |
| **Options** | A. Oui, avec mandat clair / B. Informellement / C. Non |
| **Condition** | Toujours (apres Q-D-26) |
| **Routing** | Vers Q-D-28 |
| **Score** | A: +0 D1-D / B: +2 D1-D / C: +4 D1-D |
| **Reference** | Bonne pratique (Art. 26 implicite) |

---

### Q-D-28 — Inventaire des systemes IA

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'un inventaire complet et a jour de tous les systemes IA deployes dans votre organisation ? |
| **Type** | Choix unique |
| **Options** | A. Oui, inventaire complet / B. Inventaire partiel / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-27) |
| **Routing** | Vers Q-D-29 |
| **Score** | A: +0 D2-D / B: +3 D2-D / C: +6 D2-D / D: +5 D2-D |
| **Reference** | Art. 26§1 (implicite) |

---

### Q-D-29 — Modification substantielle

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous apporte ou prevoyez-vous d'apporter des modifications substantielles a un systeme IA acquis aupres d'un fournisseur ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Modifications mineures uniquement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-D-28) |
| **Routing** | Si A → ALERTE "Requalification possible en Fournisseur Art. 25" + Q-D-30 / Sinon → Q-D-30 |
| **Score** | A: +8 D6-D (requalification) / B: +1 D6-D / C: +0 D6-D / D: +3 D6-D |
| **Reference** | Art. 25§1(b) |

---

### Q-D-30 — Niveau de connaissance du reglement

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Comment evalueriez-vous votre niveau de connaissance des obligations du deploiement de systemes IA sous l'EU AI Act ? |
| **Type** | Echelle |
| **Options** | 1. Aucune connaissance / 2. Connaissance tres limitee / 3. Connaissance partielle / 4. Bonne connaissance / 5. Connaissance approfondie |
| **Condition** | Toujours (derniere question Deployeur) |
| **Routing** | FIN PARCOURS DEPLOYEUR → GOTO NOEUD_5 |
| **Score** | 5: +0 / 4: +0 / 3: +1 D1-D / 2: +2 D1-D / 1: +3 D1-D |
| **Reference** | Art. 4 (maitrise IA) |

---

# ═══ SECTION D — PARCOURS IMPORTATEUR (Art. 23) ═══

**Condition d'entree** : role == IMPORTATEUR (Q-ROLE-C == OUI au Noeud 3)
**Isolation** : Ce parcours est EXCLUSIF au role Importateur. Aucune question Fournisseur, Deployeur ou Distributeur n'apparait.

## Dimensions de scoring Importateur

| Code | Dimension | Reference principale | Poids |
|------|-----------|---------------------|-------|
| D1-I | Verification fournisseur hors UE | Art. 23§1-2 | 25% |
| D2-I | Marquage CE & declaration conformite | Art. 23§1 | 20% |
| D3-I | Documentation technique | Art. 23§1, Art. 11 | 20% |
| D4-I | Identification importateur | Art. 23§3 | 15% |
| D5-I | Signalement & retrait | Art. 23§4-5 | 20% |

---

### Q-I-01 — Verification procedure evaluation conformite fournisseur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avant de mettre un systeme IA HR sur le marche de l'UE, verifiez-vous que le fournisseur hors UE a effectue la procedure d'evaluation de la conformite appropriee (Art. 43) ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Parfois / C. Non / D. NSP |
| **Condition** | Toujours (premiere question Importateur) |
| **Routing** | Si C ou D → ALERTE "Obligation Art. 23§1 non remplie" + Q-I-02 / Sinon → Q-I-02 |
| **Score** | A: +0 D1-I / B: +4 D1-I / C: +8 D1-I / D: +7 D1-I |
| **Reference** | Art. 23§1 |

---

### Q-I-02 — Documentation technique du fournisseur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le fournisseur a etabli la documentation technique conforme a l'Annexe IV ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-01) |
| **Routing** | Vers Q-I-03 |
| **Score** | A: +0 D3-I / B: +3 D3-I / C: +6 D3-I / D: +5 D3-I |
| **Reference** | Art. 23§1 |

---

### Q-I-03 — Marquage CE

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le systeme IA HR porte le marquage CE avant son importation dans l'UE ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Parfois / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-02) |
| **Routing** | Vers Q-I-04 |
| **Score** | A: +0 D2-I / B: +3 D2-I / C: +7 D2-I / D: +6 D2-I |
| **Reference** | Art. 23§1 |

---

### Q-I-04 — Declaration UE de conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le fournisseur a etabli une declaration UE de conformite (Art. 47) ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-03) |
| **Routing** | Vers Q-I-05 |
| **Score** | A: +0 D2-I / B: +2 D2-I / C: +5 D2-I / D: +4 D2-I |
| **Reference** | Art. 23§1, Art. 47 |

---

### Q-I-05 — Mandataire designe

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le fournisseur hors UE a designe un mandataire autorise dans l'Union conformement a l'Art. 22 ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. NSP |
| **Condition** | Toujours (apres Q-I-04) |
| **Routing** | Vers Q-I-06 |
| **Score** | A: +0 D1-I / B: +6 D1-I / C: +5 D1-I |
| **Reference** | Art. 23§1, Art. 22 |

---

### Q-I-06 — Non-conformite presumes

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Si vous avez des raisons de considerer qu'un systeme IA HR n'est pas conforme, ou est falsifie, vous abstenez-vous de le mettre sur le marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, politique formalisee / B. Au cas par cas / C. Non / D. Situation non rencontree |
| **Condition** | Toujours (apres Q-I-05) |
| **Routing** | Vers Q-I-07 |
| **Score** | A: +0 D5-I / B: +2 D5-I / C: +6 D5-I / D: +0 D5-I |
| **Reference** | Art. 23§2 |

---

### Q-I-07 — Identification importateur sur le produit

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Indiquez-vous votre nom, raison sociale ou marque deposee ainsi qu'une adresse de contact sur le systeme IA ou son emballage ou documentation ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-06) |
| **Routing** | Vers Q-I-08 |
| **Score** | A: +0 D4-I / B: +2 D4-I / C: +5 D4-I / D: +4 D4-I |
| **Reference** | Art. 23§3 |

---

### Q-I-08 — Conditions de stockage et transport

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vous assurez-vous que les conditions de stockage ou de transport ne compromettent pas la conformite du systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. Non applicable (systeme SaaS/cloud) |
| **Condition** | Toujours (apres Q-I-07) |
| **Routing** | Vers Q-I-09 |
| **Score** | A: +0 D4-I / B: +2 D4-I / C: +4 D4-I / D: +0 D4-I |
| **Reference** | Art. 23§4 |

---

### Q-I-09 — Conservation des documents

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Conservez-vous une copie du certificat de l'organisme notifie (le cas echeant), de la notice d'utilisation et de la declaration UE de conformite pendant 10 ans ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-08) |
| **Routing** | Vers Q-I-10 |
| **Score** | A: +0 D3-I / B: +2 D3-I / C: +5 D3-I / D: +4 D3-I |
| **Reference** | Art. 23§5 |

---

### Q-I-10 — Communication aux autorites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Etes-vous en mesure de fournir aux autorites competentes toutes les informations et documentation demontrant la conformite du systeme IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-09) |
| **Routing** | Vers Q-I-11 |
| **Score** | A: +0 D3-I / B: +2 D3-I / C: +5 D3-I / D: +4 D3-I |
| **Reference** | Art. 23§6 |

---

### Q-I-11 — Cooperation mesures correctives

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Cooperez-vous avec les autorites competentes a toute mesure prise a l'egard d'un systeme IA que vous avez importe ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Situation non rencontree |
| **Condition** | Toujours (apres Q-I-10) |
| **Routing** | Vers Q-I-12 |
| **Score** | A: +0 D5-I / B: +5 D5-I / C: +0 D5-I |
| **Reference** | Art. 23§7 |

---

### Q-I-12 — Signalement non-conformite fournisseur et autorite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Lorsque vous estimez qu'un systeme IA HR est non conforme, en informez-vous le fournisseur et l'autorite de surveillance du marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui, procedure formalisee / B. Informellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-11) |
| **Routing** | Vers Q-I-13 |
| **Score** | A: +0 D5-I / B: +2 D5-I / C: +6 D5-I / D: +5 D5-I |
| **Reference** | Art. 23§4 |

---

### Q-I-13 — Actions correctives (retrait/rappel)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Disposez-vous d'un processus pour retirer ou rappeler un systeme IA non conforme que vous avez importe ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. NSP |
| **Condition** | Toujours (apres Q-I-12) |
| **Routing** | Vers Q-I-14 |
| **Score** | A: +0 D5-I / B: +5 D5-I / C: +4 D5-I |
| **Reference** | Art. 23§4 |

---

### Q-I-14 — Risque presente par le systeme

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Lorsqu'un systeme IA que vous avez importe presente un risque au sens de l'Art. 79, en informez-vous le fournisseur et les autorites ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Situation non rencontree / D. NSP |
| **Condition** | Toujours (apres Q-I-13) |
| **Routing** | Vers Q-I-15 |
| **Score** | A: +0 D5-I / B: +5 D5-I / C: +0 D5-I / D: +3 D5-I |
| **Reference** | Art. 23§2 |

---

### Q-I-15 — Maitrise de l'IA (Art. 4)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre personnel implique dans les operations d'importation de systemes IA dispose-t-il d'un niveau suffisant de maitrise de l'IA et de connaissance du reglement ? |
| **Type** | Choix unique |
| **Options** | A. Oui, formation realisee / B. Partiellement / C. Non / D. Pas identifie comme priorite |
| **Condition** | Toujours (apres Q-I-14) |
| **Routing** | Vers Q-I-16 |
| **Score** | A: +0 D1-I / B: +2 D1-I / C: +4 D1-I / D: +5 D1-I |
| **Reference** | Art. 4 |

---

### Q-I-16 — Cumul roles potentiel

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Commercialisez-vous des systemes IA importes sous votre propre nom ou marque, ou apportez-vous des modifications substantielles aux systemes importes ? |
| **Type** | Choix unique |
| **Options** | A. Oui, sous notre marque / B. Oui, avec modifications / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-15) |
| **Routing** | Si A ou B → ALERTE "Requalification Fournisseur Art. 25" + Q-I-17 / Sinon → Q-I-17 |
| **Score** | A: +8 D1-I / B: +10 D1-I / C: +0 / D: +3 D1-I |
| **Reference** | Art. 25§1 |

---

### Q-I-17 — Reglementation sectorielle

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les systemes IA que vous importez sont-ils soumis a une reglementation sectorielle complementaire ? |
| **Type** | Choix multiple |
| **Options** | A. MedTech / MDR / B. Machines / C. Jouets / D. Produits de construction / E. Autre legislation Annexe I / F. Aucune / G. NSP |
| **Condition** | Toujours (apres Q-I-16) |
| **Routing** | Vers Q-I-18 |
| **Score** | Chaque A-E: +3 D3-I / F: +0 / G: +2 D3-I |
| **Reference** | Annexe I |

---

### Q-I-18 — Conformite RGPD

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avez-vous verifie la conformite RGPD des systemes IA importes traitant des donnees personnelles de personnes dans l'UE ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. Non applicable (pas de donnees personnelles) |
| **Condition** | Toujours (apres Q-I-17) |
| **Routing** | Vers Q-I-19 |
| **Score** | A: +0 D3-I / B: +3 D3-I / C: +6 D3-I / D: +0 D3-I |
| **Reference** | Art. 2§7, RGPD |

---

### Q-I-19 — Transparence (Art. 50)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les systemes IA que vous importez respectent-ils les obligations de transparence de l'Art. 50 (information des personnes, marquage contenu IA) ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-I-18) |
| **Routing** | Vers Q-I-20 |
| **Score** | A: +0 D4-I / B: +2 D4-I / C: +5 D4-I / D: +4 D4-I |
| **Reference** | Art. 50 |

---

### Q-I-20 — Niveau de connaissance

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Comment evalueriez-vous votre connaissance des obligations specifiques de l'importateur sous l'EU AI Act ? |
| **Type** | Echelle |
| **Options** | 1. Aucune / 2. Tres limitee / 3. Partielle / 4. Bonne / 5. Approfondie |
| **Condition** | Toujours (derniere question Importateur) |
| **Routing** | FIN PARCOURS IMPORTATEUR → GOTO NOEUD_5 |
| **Score** | 5: +0 / 4: +0 / 3: +1 D1-I / 2: +2 D1-I / 1: +3 D1-I |
| **Reference** | Art. 4 |

---

# ═══ SECTION E — PARCOURS DISTRIBUTEUR (Art. 24) ═══

**Condition d'entree** : role == DISTRIBUTEUR (Q-ROLE-D == OUI au Noeud 3)
**Isolation** : Ce parcours est EXCLUSIF au role Distributeur. Aucune question Fournisseur, Deployeur ou Importateur n'apparait.

## Dimensions de scoring Distributeur

| Code | Dimension | Reference principale | Poids |
|------|-----------|---------------------|-------|
| D1-R | Verification marquage CE & conformite | Art. 24§1 | 30% |
| D2-R | Conditions de stockage & integrite | Art. 24§2 | 15% |
| D3-R | Signalement non-conformites | Art. 24§3-4 | 30% |
| D4-R | Absence de modification substantielle | Art. 24, Art. 25 | 25% |

---

### Q-R-01 — Verification marquage CE

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Avant de mettre a disposition un systeme IA HR sur le marche, verifiez-vous qu'il porte le marquage CE ? |
| **Type** | Choix unique |
| **Options** | A. Oui, systematiquement / B. Parfois / C. Non / D. NSP |
| **Condition** | Toujours (premiere question Distributeur) |
| **Routing** | Si C ou D → ALERTE "Obligation Art. 24§1" + Q-R-02 / Sinon → Q-R-02 |
| **Score** | A: +0 D1-R / B: +4 D1-R / C: +8 D1-R / D: +7 D1-R |
| **Reference** | Art. 24§1 |

---

### Q-R-02 — Verification notice d'utilisation

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le systeme IA HR est accompagne d'une notice d'utilisation conforme a l'Art. 13 ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Parfois / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-01) |
| **Routing** | Vers Q-R-03 |
| **Score** | A: +0 D1-R / B: +3 D1-R / C: +6 D1-R / D: +5 D1-R |
| **Reference** | Art. 24§1, Art. 13 |

---

### Q-R-03 — Verification declaration conformite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous la presence d'une declaration UE de conformite (Art. 47) pour les systemes IA HR que vous distribuez ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-02) |
| **Routing** | Vers Q-R-04 |
| **Score** | A: +0 D1-R / B: +2 D1-R / C: +5 D1-R / D: +4 D1-R |
| **Reference** | Art. 24§1, Art. 47 |

---

### Q-R-04 — Verification identification fournisseur et importateur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Verifiez-vous que le fournisseur et l'importateur (le cas echeant) ont indique leurs coordonnees sur le systeme IA ou sa documentation ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-03) |
| **Routing** | Vers Q-R-05 |
| **Score** | A: +0 D1-R / B: +2 D1-R / C: +4 D1-R / D: +3 D1-R |
| **Reference** | Art. 24§1 |

---

### Q-R-05 — Conditions de stockage

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Vous assurez-vous que les conditions de stockage ou de transport du systeme IA ne compromettent pas sa conformite ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. Non applicable (systeme SaaS/cloud) |
| **Condition** | Toujours (apres Q-R-04) |
| **Routing** | Vers Q-R-06 |
| **Score** | A: +0 D2-R / B: +2 D2-R / C: +5 D2-R / D: +0 D2-R |
| **Reference** | Art. 24§2 |

---

### Q-R-06 — Signalement non-conformite au fournisseur/importateur

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Lorsque vous estimez qu'un systeme IA HR n'est pas conforme, en informez-vous le fournisseur ou l'importateur ? |
| **Type** | Choix unique |
| **Options** | A. Oui, procedure formalisee / B. Informellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-05) |
| **Routing** | Vers Q-R-07 |
| **Score** | A: +0 D3-R / B: +2 D3-R / C: +6 D3-R / D: +5 D3-R |
| **Reference** | Art. 24§3 |

---

### Q-R-07 — Non-mise a disposition systeme non conforme

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Lorsqu'un systeme IA HR n'est pas conforme, vous abstenez-vous de le mettre a disposition tant que sa conformite n'est pas retablie ? |
| **Type** | Choix unique |
| **Options** | A. Oui, politique stricte / B. Au cas par cas / C. Non / D. Situation non rencontree |
| **Condition** | Toujours (apres Q-R-06) |
| **Routing** | Vers Q-R-08 |
| **Score** | A: +0 D3-R / B: +3 D3-R / C: +7 D3-R / D: +0 D3-R |
| **Reference** | Art. 24§3 |

---

### Q-R-08 — Signalement a l'autorite

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Lorsqu'un systeme IA HR presente un risque, en informez-vous l'autorite de surveillance du marche ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Situation non rencontree / D. NSP |
| **Condition** | Toujours (apres Q-R-07) |
| **Routing** | Vers Q-R-09 |
| **Score** | A: +0 D3-R / B: +6 D3-R / C: +0 D3-R / D: +4 D3-R |
| **Reference** | Art. 24§4 |

---

### Q-R-09 — Cooperation autorites

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Cooperez-vous avec les autorites competentes lorsqu'elles prennent des mesures a l'egard d'un systeme IA que vous distribuez ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non / C. Situation non rencontree |
| **Condition** | Toujours (apres Q-R-08) |
| **Routing** | Vers Q-R-10 |
| **Score** | A: +0 D3-R / B: +5 D3-R / C: +0 D3-R |
| **Reference** | Art. 24§5 |

---

### Q-R-10 — Absence de modification substantielle

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Confirmez-vous ne pas avoir apporte de modification substantielle au systeme IA HR avant sa distribution ? |
| **Type** | Choix unique |
| **Options** | A. Confirme, aucune modification / B. Modifications mineures (emballage, documentation) / C. Nous avons modifie le systeme / D. NSP |
| **Condition** | Toujours (apres Q-R-09) |
| **Routing** | Si C → ALERTE "Requalification Fournisseur Art. 25§1(b)" + Q-R-11 / Sinon → Q-R-11 |
| **Score** | A: +0 D4-R / B: +1 D4-R / C: +10 D4-R / D: +3 D4-R |
| **Reference** | Art. 25§1(b) |

---

### Q-R-11 — Commercialisation sous propre marque

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Commercialisez-vous des systemes IA sous votre propre nom ou marque ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Non |
| **Condition** | Toujours (apres Q-R-10) |
| **Routing** | Si A → ALERTE "Requalification Fournisseur Art. 25§1(a)" + Q-R-12 / Sinon → Q-R-12 |
| **Score** | A: +8 D4-R / B: +0 D4-R |
| **Reference** | Art. 25§1(a) |

---

### Q-R-12 — Maitrise de l'IA (Art. 4)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Votre personnel implique dans la distribution de systemes IA dispose-t-il d'un niveau suffisant de maitrise de l'IA ? |
| **Type** | Choix unique |
| **Options** | A. Oui, formation realisee / B. Partiellement / C. Non / D. Pas identifie comme priorite |
| **Condition** | Toujours (apres Q-R-11) |
| **Routing** | Vers Q-R-13 |
| **Score** | A: +0 D1-R / B: +2 D1-R / C: +4 D1-R / D: +5 D1-R |
| **Reference** | Art. 4 |

---

### Q-R-13 — Transparence (Art. 50)

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Les systemes IA que vous distribuez respectent-ils les obligations de transparence (information des utilisateurs qu'ils interagissent avec une IA) ? |
| **Type** | Choix unique |
| **Options** | A. Oui / B. Partiellement / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-12) |
| **Routing** | Vers Q-R-14 |
| **Score** | A: +0 D1-R / B: +2 D1-R / C: +5 D1-R / D: +4 D1-R |
| **Reference** | Art. 50§1 |

---

### Q-R-14 — Conservation documents

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Conservez-vous les documents de conformite (declaration, notice) des systemes IA que vous distribuez pendant une duree appropriee ? |
| **Type** | Choix unique |
| **Options** | A. Oui, au moins 10 ans / B. Oui, mais duree inconnue / C. Non / D. NSP |
| **Condition** | Toujours (apres Q-R-13) |
| **Routing** | Vers Q-R-15 |
| **Score** | A: +0 D2-R / B: +2 D2-R / C: +4 D2-R / D: +3 D2-R |
| **Reference** | Art. 24 (implicite, par analogie Art. 23§5) |

---

### Q-R-15 — Connaissance du reglement

| Propriete | Valeur |
|-----------|--------|
| **Intitule** | Comment evalueriez-vous votre connaissance des obligations du distributeur sous l'EU AI Act ? |
| **Type** | Echelle |
| **Options** | 1. Aucune / 2. Tres limitee / 3. Partielle / 4. Bonne / 5. Approfondie |
| **Condition** | Toujours (derniere question Distributeur) |
| **Routing** | FIN PARCOURS DISTRIBUTEUR → GOTO NOEUD_5 |
| **Score** | 5: +0 / 4: +0 / 3: +1 D1-R / 2: +2 D1-R / 1: +3 D1-R |
| **Reference** | Art. 4 |

---

# ═══ SECTION F — SCORING & RAPPORT ═══

## 1. Tableau de ponderations [Role] x [Dimension] x [Poids %]

### Fournisseur

| Dimension | Code | Poids % | Score max brut | Score max pondere |
|-----------|------|---------|---------------|-------------------|
| Documentation technique | D1-F | 20% | ~50 | 10.0 |
| Systeme gestion qualite | D2-F | 15% | ~25 | 3.75 |
| Evaluation conformite | D3-F | 15% | ~25 | 3.75 |
| Marquage CE & declaration | D4-F | 10% | ~16 | 1.60 |
| Transparence & information | D5-F | 15% | ~30 | 4.50 |
| Surveillance post-marche | D6-F | 15% | ~25 | 3.75 |
| Cybersecurite & robustesse | D7-F | 10% | ~20 | 2.00 |
| **TOTAL** | | **100%** | | **~29.35** |

### Deployeur

| Dimension | Code | Poids % | Score max brut | Score max pondere |
|-----------|------|---------|---------------|-------------------|
| Surveillance humaine | D1-D | 20% | ~40 | 8.00 |
| Registre des activites | D2-D | 10% | ~20 | 2.00 |
| FRIA | D3-D | 20% | ~25 | 5.00 |
| Conservation logs | D4-D | 10% | ~15 | 1.50 |
| Information personnes | D5-D | 15% | ~30 | 4.50 |
| Verification fournisseur | D6-D | 15% | ~30 | 4.50 |
| Gestion incidents | D7-D | 10% | ~25 | 2.50 |
| **TOTAL** | | **100%** | | **~28.00** |

### Importateur

| Dimension | Code | Poids % | Score max brut | Score max pondere |
|-----------|------|---------|---------------|-------------------|
| Verification fournisseur hors UE | D1-I | 25% | ~30 | 7.50 |
| Marquage CE & declaration | D2-I | 20% | ~15 | 3.00 |
| Documentation technique | D3-I | 20% | ~25 | 5.00 |
| Identification importateur | D4-I | 15% | ~15 | 2.25 |
| Signalement & retrait | D5-I | 20% | ~25 | 5.00 |
| **TOTAL** | | **100%** | | **~22.75** |

### Distributeur

| Dimension | Code | Poids % | Score max brut | Score max pondere |
|-----------|------|---------|---------------|-------------------|
| Verification marquage CE | D1-R | 30% | ~40 | 12.00 |
| Conditions stockage | D2-R | 15% | ~10 | 1.50 |
| Signalement non-conformites | D3-R | 30% | ~25 | 7.50 |
| Absence modification | D4-R | 25% | ~25 | 6.25 |
| **TOTAL** | | **100%** | | **~27.25** |

---

## 2. Formules de calcul du score global

```
# ETAPE 1 — Score brut par dimension
Pour chaque dimension Dx du role:
    score_brut_Dx = somme(points_questions_Dx)

# ETAPE 2 — Score normalise par dimension (ramene sur 100)
Pour chaque dimension Dx:
    score_norm_Dx = (1 - (score_brut_Dx / score_max_brut_Dx)) * 100
    # 100 = parfaitement conforme, 0 = totalement non conforme

# ETAPE 3 — Score pondere par dimension
Pour chaque dimension Dx:
    score_pond_Dx = score_norm_Dx * poids_Dx

# ETAPE 4 — Score role (avant multiplicateurs)
score_role = somme(score_pond_Dx pour toutes dimensions du role)
    # Resultat sur 100

# ETAPE 5 — Score global avec multiplicateurs
score_global = score_role
             * multiplicateur_secteur
             * multiplicateur_taille

# ETAPE 6 — Application escalade sectorielle
IF secteur ∈ {HealthTech, MedTech}:
    score_global = score_global * 0.80  # penalite -20% sur la conformite
IF secteur ∈ {FinTech, Assurance}:
    score_global = score_global * 0.85  # penalite -15% sur la conformite

# ETAPE 7 — Integration pratiques interdites
IF flag_interdit == CRITICAL:
    score_global = min(score_global, 30)  # plafonne a NON_CONFORME

# ETAPE 8 — Bornage final
score_final = max(0, min(100, round(score_global)))
```

### Multiplicateurs

| Facteur | Condition | Valeur |
|---------|-----------|--------|
| **Secteur sensible** | Finance, Sante, RH, Education, Administration | x0.90 (penalite -10% conformite) |
| **Secteur standard** | Industrie, Transport, Energie | x0.95 (penalite -5%) |
| **Secteur autre** | Tech, Commerce, Media, etc. | x1.00 |
| **Taille GE** | 5000+ collaborateurs | x0.95 (penalite -5%) |
| **Taille ETI** | 250-4999 | x0.97 (penalite -3%) |
| **Taille PME/TPE** | < 250 | x1.00 |

---

## 3. Seuils de conformite

| Score /100 | Niveau | Couleur | Icone | Interpretation | Recommandation |
|-----------|--------|---------|-------|----------------|----------------|
| **80 – 100** | **CONFORME** | Vert (#16a34a) | Bouclier vert | Niveau de conformite satisfaisant. Des ajustements mineurs peuvent rester necessaires. | Veille reglementaire (190 EUR/mois) + Compliance Officer optionnel |
| **50 – 79** | **CONDITIONNEL** | Orange (#f97316) | Triangle orange | Lacunes significatives identifiees. Un plan de remediation structure est necessaire avant les echeances. | Diagnostic strategique (2 490 EUR) ou Pack conformite role |
| **0 – 49** | **NON CONFORME** | Rouge (#dc2626) | Croix rouge | Non-conformite avere. Risque d'amende eleve. Actions correctives immediates requises. | Pack conformite complet + Compliance Officer (890 EUR/mois) |

### Sous-seuils par dimension

Pour chaque dimension, un scoring individuel est calcule :

| Score dimension | Statut |
|----------------|--------|
| >= 80% | Conforme (vert) |
| 50-79% | Partiel (orange) |
| < 50% | Manquant (rouge) |

---

## 4. Escalade sectorielle

| Secteur | Penalite conformite | Justification | Reglementation croisee |
|---------|---------------------|---------------|----------------------|
| **HealthTech / MedTech** | -20% sur score final | Cumul AI Act + MDR (2017/745). Dispositifs medicaux integrant IA : double evaluation conformite requise. | Reglement MDR 2017/745 |
| **FinTech / Assurance** | -15% sur score final | Cumul AI Act + DORA (2022/2554). Systemes de scoring credit : haut risque Annexe III pt 5. | Reglement DORA 2022/2554 |
| **RH / Recrutement** | -10% sur score final | Systemes recrutement/evaluation : haut risque Annexe III pt 4. FRIA obligatoire. | Code du travail (info CSE) |
| **Education** | -10% sur score final | Notation/orientation : haut risque Annexe III pt 3. | Reglementations education nationales |
| **Administration publique** | -10% sur score final | Obligations renforcees : FRIA, registre public, transparence accrue. | RGPD renforcee (interet public) |
| **Autres secteurs** | 0% | Pas d'escalade sectorielle. | — |

---

## 5. Modele de rapport de diagnostic

### 5.1 En-tete

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   COMPLIA — RAPPORT DE DIAGNOSTIC EU AI ACT                                 │
│   Reglement (UE) 2024/1689                                                  │
│                                                                             │
│   Entreprise : {raison_sociale}                                             │
│   Secteur : {secteur}                                                       │
│   Taille : {taille_entreprise}                                              │
│   Role(s) AI Act : {roles_detectes}                                         │
│   Date du diagnostic : {date}                                               │
│   Reference : {diagnostic_id}                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Score global

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   SCORE DE CONFORMITE GLOBAL                                                │
│                                                                             │
│               ╭──────────╮                                                  │
│               │          │                                                  │
│               │  {score} │   / 100                                          │
│               │          │                                                  │
│               ╰──────────╯                                                  │
│                                                                             │
│   Niveau : {CONFORME | CONDITIONNEL | NON CONFORME}                         │
│   Couleur : {vert | orange | rouge}                                         │
│                                                                             │
│   Interpretation :                                                          │
│   {texte_interpretation_selon_seuil}                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Detail par dimension

Pour chaque dimension du role :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   DIMENSION : {nom_dimension}                                               │
│   Reference : {articles_references}                                         │
│   Score dimension : {score_dim}% — {CONFORME | PARTIEL | MANQUANT}          │
│                                                                             │
│   ████████████████░░░░░░░░░░  {score_dim}%                                  │
│                                                                             │
│   Points cles :                                                             │
│   • {constat_1} — {statut}                                                  │
│   • {constat_2} — {statut}                                                  │
│   • {constat_3} — {statut}                                                  │
│                                                                             │
│   Recommandation :                                                          │
│   {recommandation_specifique_dimension}                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Top 3 manquements critiques

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ⚠ TOP 3 MANQUEMENTS LES PLUS CRITIQUES                                   │
│                                                                             │
│   1. {manquement_1}                                                         │
│      Dimension : {dim}  |  Reference : {art}  |  Impact : {score_pts}       │
│      Action requise : {action}                                              │
│                                                                             │
│   2. {manquement_2}                                                         │
│      Dimension : {dim}  |  Reference : {art}  |  Impact : {score_pts}       │
│      Action requise : {action}                                              │
│                                                                             │
│   3. {manquement_3}                                                         │
│      Dimension : {dim}  |  Reference : {art}  |  Impact : {score_pts}       │
│      Action requise : {action}                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 Top 3 points conformes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ✓ TOP 3 POINTS DE CONFORMITE                                              │
│                                                                             │
│   1. {point_conforme_1}                                                     │
│      Dimension : {dim}  |  Reference : {art}                                │
│                                                                             │
│   2. {point_conforme_2}                                                     │
│      Dimension : {dim}  |  Reference : {art}                                │
│                                                                             │
│   3. {point_conforme_3}                                                     │
│      Dimension : {dim}  |  Reference : {art}                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.6 Recommandation d'offre

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   RECOMMANDATION COMPLIA                                                    │
│                                                                             │
│   Sur la base de votre profil ({role}, {secteur}, score {score}/100),       │
│   nous vous recommandons :                                                  │
│                                                                             │
│   ┌────────────────────────────────────────┐                                │
│   │  RECOMMANDE POUR VOUS                  │                                │
│   │                                        │                                │
│   │  {nom_offre}                           │                                │
│   │  {prix} EUR HT                         │                                │
│   │                                        │                                │
│   │  Inclut :                              │                                │
│   │  • {prestation_1}                      │                                │
│   │  • {prestation_2}                      │                                │
│   │  • {prestation_3}                      │                                │
│   │                                        │                                │
│   │  [RESERVER UN APPEL GRATUIT]           │                                │
│   └────────────────────────────────────────┘                                │
│                                                                             │
│   Offre alternative : {offre_alternative} — {prix_alt} EUR HT               │
│                                                                             │
│   Comparateur :                                                             │
│   Avocats specialises : 5 000 - 15 000 EUR                                  │
│   Big Four : 20 000 - 50 000 EUR                                            │
│   Complia : a partir de 990 EUR                                             │
│                                                                             │
│   Le cout du diagnostic est deductible de tout pack                         │
│   conformite signe dans les 30 jours.                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.7 Matrice de recommandation [Role x Score → Offre]

| Role | Score 80-100 | Score 50-79 | Score 0-49 |
|------|-------------|-------------|------------|
| **Fournisseur** | Veille (190 EUR/mois) | Roadmap Fournisseur (6 990 EUR) | Conformite Fournisseur (35 000 EUR+) |
| **Deployeur** | Veille (190 EUR/mois) | Pack Conformite Deployeur (3 990 EUR) | Pack Conformite+ (6 990 EUR) |
| **Importateur** | Veille (190 EUR/mois) | Diagnostic Strategique (2 490 EUR) | Pack Importateur (4 990 EUR) |
| **Distributeur** | Veille (190 EUR/mois) | Diagnostic Flash (990 EUR) | Pack Distributeur (2 490 EUR) |

### 5.8 Disclaimer juridique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   AVERTISSEMENT JURIDIQUE                                                   │
│                                                                             │
│   Ce rapport de diagnostic est etabli a titre informatif et ne constitue    │
│   pas un avis juridique. Il est fonde sur les reponses declaratives         │
│   fournies par l'utilisateur et sur une interpretation du Reglement (UE)    │
│   2024/1689 (EU AI Act) en vigueur a la date du diagnostic.                 │
│                                                                             │
│   Articles applicables identifies :                                         │
│   {liste_dynamique_articles}                                                │
│                                                                             │
│   Reglementations croisees identifiees :                                    │
│   {liste_reglementations_croisees}                                          │
│                                                                             │
│   Ce diagnostic ne se substitue pas a un audit juridique approfondi mene    │
│   par un professionnel du droit. Complia recommande de valider les          │
│   conclusions de ce rapport avec votre conseil juridique.                   │
│                                                                             │
│   Complia SAS — complia.eu — contact@complia.eu                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.9 CTA (Call-to-Action)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PROCHAINE ETAPE                                                           │
│                                                                             │
│   [RESERVER UN APPEL DECOUVERTE GRATUIT (20 MIN)]                           │
│   → calendly.com/complia/decouverte                                         │
│                                                                             │
│   [NOUS CONTACTER PAR EMAIL]                                                │
│   → contact@complia.eu                                                      │
│                                                                             │
│   [TELECHARGER CE RAPPORT EN PDF]                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ANNEXE — TIMELINE REGLEMENTAIRE DE REFERENCE

| Date | Jalon | Statut |
|------|-------|--------|
| 1er aout 2024 | Entree en vigueur du reglement | Passe |
| 2 fevrier 2025 | Interdictions Art. 5 + Maitrise IA Art. 4 | En vigueur |
| 2 aout 2025 | GPAI Art. 51-55 + Transparence Art. 50 | En vigueur |
| 2 aout 2026 | Obligations systemes HR (Art. 6-27) + Evaluation conformite | A venir |
| 2 aout 2027 | Systemes IA composants securite produits Annexe I | A venir |

---

**Fin du document — Version 1.0**
