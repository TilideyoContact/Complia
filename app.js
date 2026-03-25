/* ============================================
   COMPLIA — AI Act Compliance Questionnaire
   Scoring Engine & UI Logic
   Based on Règlement (UE) 2024/1689
   ============================================ */

const TOTAL_SECTIONS = 6;
let currentSection = 1;

// ============ NAVIGATION ============

function startQuestionnaire() {
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('questionnaire').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(n) {
    for (let i = 1; i <= TOTAL_SECTIONS; i++) {
        document.getElementById(`section-${i}`).style.display = i === n ? 'block' : 'none';
    }
    currentSection = n;
    updateProgress();
    window.scrollTo({ top: document.getElementById('questionnaire').offsetTop - 80, behavior: 'smooth' });
}

function nextSection(current) {
    if (!validateSection(current)) return;
    showSection(current + 1);
}

function prevSection(current) {
    showSection(current - 1);
}

function updateProgress() {
    const pct = (currentSection / TOTAL_SECTIONS) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = `Section ${currentSection} / ${TOTAL_SECTIONS}`;
}

function validateSection(n) {
    const section = document.getElementById(`section-${n}`);
    const requiredInputs = section.querySelectorAll('[required]');
    let valid = true;

    for (const input of requiredInputs) {
        if (input.type === 'radio') {
            const name = input.name;
            const checked = section.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                highlightMissing(input.closest('.question-group'));
                valid = false;
            }
        } else if (!input.value.trim()) {
            highlightMissing(input.closest('.question-group'));
            valid = false;
        }
    }

    if (!valid) {
        // Scroll to first missing
        const first = section.querySelector('.question-group.missing');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
}

function highlightMissing(group) {
    if (!group) return;
    group.classList.add('missing');
    group.style.outline = '2px solid #dc2626';
    group.style.outlineOffset = '4px';
    group.style.borderRadius = '8px';
    setTimeout(() => {
        group.classList.remove('missing');
        group.style.outline = 'none';
    }, 3000);
}

// ============ FORM DATA ============

function getFormData() {
    const form = document.getElementById('questionnaireForm');
    const data = {};

    // Text & select inputs
    form.querySelectorAll('input[type="text"], input[type="email"], select').forEach(el => {
        if (el.name) data[el.name] = el.value;
    });

    // Radio inputs
    form.querySelectorAll('input[type="radio"]:checked').forEach(el => {
        data[el.name] = el.value;
    });

    // Checkbox inputs
    const checkboxes = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(el => {
        if (!checkboxes[el.name]) checkboxes[el.name] = [];
        checkboxes[el.name].push(el.value);
    });
    Object.assign(data, checkboxes);

    return data;
}

// ============ SCORING ENGINE ============

// High-risk AI systems per Annexe III of AI Act
const HIGH_RISK_SYSTEMS = [
    'rh_recrutement',
    'scoring_credit',
    'biometrie',
    'surveillance',
    'diagnostic_medical',
    'vehicule_autonome',
    'infrastructure_critique',
    'education_notation',
    'justice_police'
];

const SYSTEM_LABELS = {
    'chatbot_genai': 'IA générative / Chatbots',
    'rh_recrutement': 'RH / Recrutement',
    'scoring_credit': 'Scoring / Crédit',
    'biometrie': 'Biométrie / Reconnaissance faciale',
    'surveillance': 'Surveillance / Vidéo-analyse',
    'diagnostic_medical': 'Diagnostic médical / Santé',
    'vehicule_autonome': 'Véhicules autonomes / Transport',
    'recommandation': 'Recommandation / Personnalisation',
    'infrastructure_critique': 'Infrastructure critique',
    'education_notation': 'Éducation / Notation',
    'justice_police': 'Justice / Police / Sécurité',
    'autre_ia': 'Autre système d\'IA'
};

function calculateScore(data) {
    let riskScore = 0; // 0 = no risk, 100 = maximum risk

    // --- 1. Role-based risk ---
    if (data.develops_ai === 'oui' || data.markets_ai === 'oui') riskScore += 15;
    if (data.deploys_ai === 'oui') riskScore += 8;
    if (data.imports_ai === 'oui') riskScore += 10;
    if (data.distributes_ai === 'oui') riskScore += 3;

    // --- 2. Prohibited practices (CRITICAL) ---
    const prohibitedFields = [
        'prohibited_manipulation',
        'prohibited_vulnerability',
        'prohibited_social_scoring',
        'prohibited_biometric',
        'prohibited_emotion'
    ];
    let prohibitedCount = 0;
    prohibitedFields.forEach(field => {
        if (data[field] === 'oui') prohibitedCount++;
        if (data[field] === 'ne_sais_pas') riskScore += 5;
    });
    riskScore += prohibitedCount * 20; // Severe penalty

    // --- 3. High-risk systems ---
    const systems = data.ai_systems || [];
    let highRiskCount = 0;
    systems.forEach(sys => {
        if (HIGH_RISK_SYSTEMS.includes(sys)) highRiskCount++;
    });
    riskScore += highRiskCount * 6;

    // --- 4. Volume of AI systems ---
    if (data.ai_count === 'plus_10') riskScore += 8;
    else if (data.ai_count === '6_10') riskScore += 5;
    else if (data.ai_count === '3_5') riskScore += 3;
    else if (data.ai_count === 'ne_sais_pas') riskScore += 6;

    // --- 5. Compliance gaps ---
    if (data.has_registry === 'non') riskScore += 5;
    if (data.employee_informed === 'non') riskScore += 5;
    if (data.employee_informed === 'partiel') riskScore += 2;
    if (data.supplier_docs === 'non') riskScore += 5;
    if (data.supplier_docs === 'partiel') riskScore += 2;
    if (data.human_oversight === 'non') riskScore += 6;
    if (data.human_oversight === 'partiel') riskScore += 3;
    if (data.logs_conservation === 'non') riskScore += 5;
    if (data.logs_conservation === 'ne_sais_pas') riskScore += 4;
    if (data.transparency === 'non') riskScore += 5;
    if (data.transparency === 'partiel') riskScore += 2;
    if (data.fria === 'non' && highRiskCount > 0) riskScore += 8;
    if (data.compliance_officer === 'non') riskScore += 3;
    if (data.content_labeling === 'non') riskScore += 4;
    if (data.content_labeling === 'partiel') riskScore += 2;

    // --- 6. Personal data & RGPD ---
    if (data.personal_data === 'oui' && data.rgpd_compliant === 'non') riskScore += 6;
    if (data.personal_data === 'oui' && data.rgpd_compliant === 'partiel') riskScore += 3;

    // --- 7. Sector multiplier ---
    const highRiskSectors = ['finance', 'sante', 'rh', 'education', 'administration'];
    if (highRiskSectors.includes(data.sector)) riskScore = Math.round(riskScore * 1.15);

    // --- 8. Size multiplier ---
    if (data.company_size === 'ge') riskScore = Math.round(riskScore * 1.1);
    else if (data.company_size === 'eti') riskScore = Math.round(riskScore * 1.05);

    // Cap at 100
    return Math.min(100, Math.max(0, riskScore));
}

function determineRoles(data) {
    const roles = [];
    if (data.develops_ai === 'oui' || data.markets_ai === 'oui') {
        roles.push({ id: 'fournisseur', label: 'Fournisseur', icon: '🔧', ref: 'Art. 3(3)' });
    }
    if (data.deploys_ai === 'oui' || data.deploys_ai === 'ne_sais_pas') {
        roles.push({ id: 'deployeur', label: 'Déployeur', icon: '🖥️', ref: 'Art. 3(4)' });
    }
    if (data.imports_ai === 'oui') {
        roles.push({ id: 'importateur', label: 'Importateur', icon: '📦', ref: 'Art. 3(6)' });
    }
    if (data.distributes_ai === 'oui') {
        roles.push({ id: 'distributeur', label: 'Distributeur', icon: '🔗', ref: 'Art. 3(7)' });
    }
    if (roles.length === 0) {
        roles.push({ id: 'deployeur', label: 'Déployeur (potentiel)', icon: '🖥️', ref: 'Art. 3(4)' });
    }
    return roles;
}

function classifySystems(data) {
    const systems = data.ai_systems || [];
    const classified = [];

    // Check prohibited
    const hasProhibited = [
        'prohibited_manipulation',
        'prohibited_vulnerability',
        'prohibited_social_scoring',
        'prohibited_biometric',
        'prohibited_emotion'
    ].some(f => data[f] === 'oui');

    if (hasProhibited) {
        classified.push({
            level: 'interdit',
            label: 'Pratique(s) d\'IA potentiellement interdite(s) détectée(s)',
            ref: 'Art. 5'
        });
    }

    systems.forEach(sys => {
        const label = SYSTEM_LABELS[sys] || sys;
        if (HIGH_RISK_SYSTEMS.includes(sys)) {
            classified.push({ level: 'haut', label, ref: 'Annexe III' });
        } else if (sys === 'chatbot_genai') {
            classified.push({ level: 'limite', label, ref: 'Art. 50 (transparence)' });
        } else if (sys === 'recommandation') {
            classified.push({ level: 'limite', label, ref: 'Art. 50' });
        } else {
            classified.push({ level: 'minimal', label, ref: 'Art. 6' });
        }
    });

    return classified;
}

function getObligations(data, roles, riskSystems) {
    const obligations = [];
    const roleIds = roles.map(r => r.id);
    const hasHighRisk = riskSystems.some(s => s.level === 'haut');

    // Universal obligations
    obligations.push({
        name: 'Formation en maîtrise de l\'IA',
        ref: 'Art. 4',
        status: data.employee_informed === 'oui' ? 'done' : data.employee_informed === 'partiel' ? 'partial' : 'missing'
    });

    obligations.push({
        name: 'Transparence vis-à-vis des utilisateurs',
        ref: 'Art. 50',
        status: data.transparency === 'oui' ? 'done' : data.transparency === 'partiel' ? 'partial' : 'missing'
    });

    if (data.uses_gpai === 'oui') {
        obligations.push({
            name: 'Marquage du contenu généré par IA',
            ref: 'Art. 50(2)',
            status: data.content_labeling === 'oui' ? 'done' : data.content_labeling === 'partiel' ? 'partial' : 'missing'
        });
    }

    // Deployer obligations
    if (roleIds.includes('deployeur')) {
        obligations.push({
            name: 'Registre des systèmes d\'IA',
            ref: 'Art. 26(1)',
            status: data.has_registry === 'oui' ? 'done' : data.has_registry === 'partiel' ? 'partial' : 'missing'
        });

        obligations.push({
            name: 'Surveillance humaine',
            ref: 'Art. 14 & 26(1)',
            status: data.human_oversight === 'oui' ? 'done' : data.human_oversight === 'partiel' ? 'partial' : 'missing'
        });

        obligations.push({
            name: 'Conservation des logs',
            ref: 'Art. 26(5)',
            status: data.logs_conservation === 'oui_6m' ? 'done' : data.logs_conservation === 'oui_moins' ? 'partial' : 'missing'
        });

        obligations.push({
            name: 'Vérification conformité fournisseurs',
            ref: 'Art. 26(1)',
            status: data.supplier_docs === 'oui' ? 'done' : data.supplier_docs === 'partiel' ? 'partial' : 'missing'
        });

        if (hasHighRisk) {
            obligations.push({
                name: 'FRIA — Évaluation d\'impact droits fondamentaux',
                ref: 'Art. 27',
                status: data.fria === 'oui' ? 'done' : data.fria === 'en_cours' ? 'partial' : 'missing'
            });
        }
    }

    // Provider obligations
    if (roleIds.includes('fournisseur')) {
        obligations.push({
            name: 'Système de gestion de la qualité (QMS)',
            ref: 'Art. 17',
            status: 'missing'
        });
        obligations.push({
            name: 'Documentation technique (Annexe IV)',
            ref: 'Art. 11',
            status: 'missing'
        });
        obligations.push({
            name: 'Déclaration de conformité UE',
            ref: 'Art. 47',
            status: 'missing'
        });
        obligations.push({
            name: 'Marquage CE',
            ref: 'Art. 48',
            status: 'missing'
        });
        obligations.push({
            name: 'Enregistrement base de données UE',
            ref: 'Art. 49',
            status: 'missing'
        });
        obligations.push({
            name: 'Surveillance post-marché',
            ref: 'Art. 72',
            status: 'missing'
        });
    }

    // Importer obligations
    if (roleIds.includes('importateur')) {
        obligations.push({
            name: 'Vérification conformité fournisseur étranger',
            ref: 'Art. 23',
            status: 'missing'
        });
        obligations.push({
            name: 'Vérification marquage CE et documentation',
            ref: 'Art. 23(2)',
            status: 'missing'
        });
    }

    // RGPD
    if (data.personal_data === 'oui') {
        obligations.push({
            name: 'Conformité RGPD pour les traitements IA',
            ref: 'Règl. 2016/679',
            status: data.rgpd_compliant === 'oui' ? 'done' : data.rgpd_compliant === 'partiel' ? 'partial' : 'missing'
        });
    }

    return obligations;
}

// ============ RENDER RESULTS ============

function submitQuestionnaire() {
    if (!validateSection(6)) return;

    const data = getFormData();
    const score = calculateScore(data);
    const roles = determineRoles(data);
    const riskSystems = classifySystems(data);
    const obligations = getObligations(data, roles, riskSystems);

    // Hide form, show results
    document.getElementById('questionnaire').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render score
    renderScore(score);
    renderRoles(roles);
    renderAlerts(data, score, riskSystems);
    renderRiskClassification(riskSystems);
    renderObligations(obligations);
}

function renderScore(score) {
    const circle = document.getElementById('scoreCircle');
    const value = document.getElementById('scoreValue');
    const label = document.getElementById('scoreLevelLabel');
    const desc = document.getElementById('scoreLevelDesc');

    let level, levelClass, description;

    if (score >= 70) {
        level = 'Risque CRITIQUE';
        levelClass = 'critical';
        description = 'Votre entreprise présente un niveau de risque très élevé au regard de l\'AI Act. Une action immédiate est nécessaire pour éviter des sanctions potentiellement lourdes. Nous recommandons un diagnostic stratégique urgent.';
    } else if (score >= 45) {
        level = 'Risque ÉLEVÉ';
        levelClass = 'high';
        description = 'Plusieurs manquements significatifs ont été identifiés. Un plan de mise en conformité structuré est indispensable avant les échéances de 2026. Nous recommandons un diagnostic stratégique.';
    } else if (score >= 20) {
        level = 'Risque MODÉRÉ';
        levelClass = 'medium';
        description = 'Des axes d\'amélioration ont été identifiés. Votre entreprise a commencé certaines démarches mais des lacunes subsistent. Un diagnostic flash permettrait de préciser les actions prioritaires.';
    } else {
        level = 'Risque FAIBLE';
        levelClass = 'low';
        description = 'Votre exposition au risque AI Act semble limitée à ce stade. Nous recommandons néanmoins une veille réglementaire pour anticiper les évolutions.';
    }

    circle.className = 'score-circle ' + levelClass;
    value.textContent = score;
    label.textContent = level;
    desc.textContent = description;

    // Animate score
    let current = 0;
    const increment = Math.ceil(score / 40);
    const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        value.textContent = current;
    }, 30);
}

function renderRoles(roles) {
    const container = document.getElementById('roleTags');
    container.innerHTML = roles.map(role =>
        `<div class="role-tag ${role.id}">
            <span>${role.icon}</span>
            <span>${role.label}</span>
            <span style="opacity:0.6;font-size:12px">(${role.ref})</span>
        </div>`
    ).join('');
}

function renderAlerts(data, score, riskSystems) {
    const container = document.getElementById('alertsBlock');
    let html = '';

    // Prohibited practices alert
    const hasProhibited = riskSystems.some(s => s.level === 'interdit');
    if (hasProhibited) {
        html += `
        <div class="alert-block critical">
            <span class="alert-icon">🚨</span>
            <div>
                <strong>ALERTE — Pratique potentiellement interdite détectée</strong><br>
                Certaines de vos réponses indiquent l'utilisation possible de pratiques d'IA interdites depuis le 2 février 2025 (Art. 5).
                Sanction maximale : <strong>35M€ ou 7% du CA mondial</strong>. Consultez immédiatement un expert.
            </div>
        </div>`;
    }

    // High risk systems
    const highRiskSystems = riskSystems.filter(s => s.level === 'haut');
    if (highRiskSystems.length > 0) {
        html += `
        <div class="alert-block warning">
            <span class="alert-icon">⚠️</span>
            <div>
                <strong>${highRiskSystems.length} système(s) à haut risque identifié(s)</strong><br>
                Ces systèmes sont soumis aux obligations renforcées de l'AI Act (Annexe III).
                Échéance de conformité : <strong>août 2026</strong>.
            </div>
        </div>`;
    }

    // RGPD
    if (data.personal_data === 'oui' && data.rgpd_compliant !== 'oui') {
        html += `
        <div class="alert-block info">
            <span class="alert-icon">ℹ️</span>
            <div>
                <strong>Articulation AI Act / RGPD</strong><br>
                Vos systèmes d'IA traitent des données personnelles. La conformité RGPD (Règl. 2016/679) est un prérequis complémentaire à l'AI Act.
            </div>
        </div>`;
    }

    container.innerHTML = html;
}

function renderRiskClassification(systems) {
    const container = document.getElementById('riskClassification');
    if (systems.length === 0) {
        container.innerHTML = '<p style="color:#64748b;font-size:14px;">Aucun système d\'IA identifié.</p>';
        return;
    }

    container.innerHTML = systems.map(sys =>
        `<div class="risk-item">
            <span class="risk-badge ${sys.level}">${sys.level === 'interdit' ? 'INTERDIT' : sys.level === 'haut' ? 'HAUT RISQUE' : sys.level === 'limite' ? 'RISQUE LIMITÉ' : 'MINIMAL'}</span>
            <span class="risk-label">${sys.label}</span>
            <span style="color:#94a3b8;font-size:12px;margin-left:auto">${sys.ref}</span>
        </div>`
    ).join('');
}

function renderObligations(obligations) {
    const container = document.getElementById('obligationsList');

    const statusIcon = {
        done: '✓',
        partial: '~',
        missing: '✗'
    };

    container.innerHTML = obligations.map(ob =>
        `<div class="obligation-item">
            <div class="obligation-status ${ob.status}">${statusIcon[ob.status]}</div>
            <div class="obligation-text">
                <div class="obligation-name">${ob.name}</div>
                <div class="obligation-ref">${ob.ref}</div>
            </div>
        </div>`
    ).join('');
}
