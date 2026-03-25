/* ============================================
   COMPLIA — AI Act Compliance Questionnaire
   Scoring Engine & UI Logic
   Based on Reglement (UE) 2024/1689
   Combined: Legal + UX + Commercial
   ============================================ */

const TOTAL_SECTIONS = 7;
let currentSection = 1;
let section2bVisible = false;
let cachedScore = 0;
let cachedRoles = [];
let cachedRiskSystems = [];
let cachedObligations = [];

// Ordered list of sections for navigation
// Section 2b is conditionally inserted between 2 and 3
function getSectionOrder() {
    const order = [1, 2];
    if (section2bVisible) order.push('2b');
    order.push(3, 4, 5, 6, 7);
    return order;
}

function getEffectiveTotalSections() {
    return getSectionOrder().length;
}

// ============ COUNTDOWN ============

function updateCountdown() {
    var deadline = new Date('2026-08-02T00:00:00');
    var now = new Date();
    var diff = deadline - now;
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    var el = document.getElementById('countdownValue');
    if (!el) return;
    if (days <= 0) {
        el.textContent = 'Echeance depassee';
        el.classList.add('countdown-pulse');
    } else {
        el.textContent = days + ' jours restants';
        if (days < 180) {
            el.classList.add('countdown-pulse');
        } else {
            el.classList.remove('countdown-pulse');
        }
    }
    // Also update timeline critical date
    var timelineEl = document.getElementById('timelineCriticalDate');
    if (timelineEl) {
        timelineEl.textContent = 'Aout 2026 — ' + days + ' jours';
    }
}

// ============ DARK MODE ============

function initDarkMode() {
    var saved = localStorage.getItem('complia_darkmode');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (saved === null && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    var toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            if (current === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('complia_darkmode', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('complia_darkmode', 'dark');
            }
        });
    }
}

// ============ AUTOSAVE ============

function saveFormData() {
    var form = document.getElementById('questionnaireForm');
    if (!form) return;
    var data = {};
    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select').forEach(function(el) {
        if (el.name) data[el.name] = el.value;
    });
    form.querySelectorAll('input[type="radio"]:checked').forEach(function(el) {
        data[el.name] = el.value;
    });
    var checkboxes = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(function(el) {
        if (!checkboxes[el.name]) checkboxes[el.name] = [];
        checkboxes[el.name].push(el.value);
    });
    Object.assign(data, checkboxes);
    data._currentSection = currentSection;
    data._section2bVisible = section2bVisible;
    localStorage.setItem('complia_diagnostic', JSON.stringify(data));
}

function restoreFormData() {
    var saved = localStorage.getItem('complia_diagnostic');
    if (!saved) return false;
    try {
        var data = JSON.parse(saved);
        var form = document.getElementById('questionnaireForm');
        if (!form) return false;
        var hasData = false;
        Object.keys(data).forEach(function(key) {
            if (key.startsWith('_')) return;
            var val = data[key];
            if (Array.isArray(val)) {
                val.forEach(function(v) {
                    var el = form.querySelector('input[name="' + key + '"][value="' + v + '"]');
                    if (el) { el.checked = true; hasData = true; }
                });
            } else {
                var el = form.querySelector('[name="' + key + '"]');
                if (el) {
                    if (el.type === 'radio') {
                        var radio = form.querySelector('input[name="' + key + '"][value="' + val + '"]');
                        if (radio) { radio.checked = true; hasData = true; }
                    } else {
                        el.value = val;
                        if (val) hasData = true;
                    }
                }
            }
        });
        if (hasData && data._currentSection) {
            section2bVisible = !!data._section2bVisible;
            return true;
        }
    } catch(e) {}
    return false;
}

function clearAutoSave() {
    localStorage.removeItem('complia_diagnostic');
    location.reload();
}

// ============ NAVIGATION ============

function startQuestionnaire() {
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('questionnaire').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateProfileSidebar();
    updateSmartProgress();
    updateRiskBadge();
    document.getElementById('floatingRiskBadge').style.display = 'flex';
}

function showSection(n) {
    // Hide all sections
    var allSections = document.querySelectorAll('.section');
    allSections.forEach(function(s) { s.style.display = 'none'; });

    // Show the target section
    var target = document.getElementById('section-' + n);
    if (target) target.style.display = 'block';

    currentSection = n;
    updateProgress();
    updateSmartProgress();
    updateProfileSidebar();
    applyConditionalBranching();
    window.scrollTo({ top: document.getElementById('questionnaire').offsetTop - 80, behavior: 'smooth' });

    // Show sidebar from section 3+
    var order = getSectionOrder();
    var idx = order.findIndex(function(s) { return String(s) === String(n); });
    var sidebar = document.getElementById('profileSidebar');
    if (sidebar) {
        sidebar.style.display = idx >= 2 ? 'block' : 'none';
    }
}

function nextSection(current) {
    if (!validateSection(current)) return;

    // After section 2, check if we need to show section 2b
    if (current === 2 || current === '2') {
        checkFournisseurStatus();
    }

    var order = getSectionOrder();
    var currentStr = String(current);
    var idx = order.findIndex(function(s) { return String(s) === currentStr; });
    if (idx >= 0 && idx < order.length - 1) {
        showSection(order[idx + 1]);
    }

    saveFormData();
}

function prevSection(current) {
    var order = getSectionOrder();
    var currentStr = String(current);
    var idx = order.findIndex(function(s) { return String(s) === currentStr; });
    if (idx > 0) {
        showSection(order[idx - 1]);
    }
}

function checkFournisseurStatus() {
    var form = document.getElementById('questionnaireForm');
    var developsAi = form.querySelector('input[name="develops_ai"]:checked');
    var marketsAi = form.querySelector('input[name="markets_ai"]:checked');
    var euOperation = form.querySelector('input[name="eu_operation"]:checked');

    var isFournisseur = (developsAi && developsAi.value === 'oui') ||
                        (marketsAi && marketsAi.value === 'oui');

    section2bVisible = isFournisseur;

    // Show/hide mandataire question based on EU operation status
    if (section2bVisible) {
        var mandataireQ = document.getElementById('mandataire_question');
        if (mandataireQ) {
            if (euOperation && euOperation.value !== 'oui') {
                mandataireQ.style.display = 'block';
                var radios = mandataireQ.querySelectorAll('input[type="radio"]');
                radios.forEach(function(r) { r.setAttribute('required', 'required'); });
            } else {
                mandataireQ.style.display = 'none';
                var radios = mandataireQ.querySelectorAll('input[type="radio"]');
                radios.forEach(function(r) { r.removeAttribute('required'); });
            }
        }
    }
}

function updateProgress() {
    var order = getSectionOrder();
    var currentStr = String(currentSection);
    var idx = order.findIndex(function(s) { return String(s) === currentStr; });
    var total = order.length;
    var pct = ((idx + 1) / total) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressText').textContent = 'Section ' + (idx + 1) + ' / ' + total;
}

function updateSmartProgress() {
    var section = document.getElementById('section-' + currentSection);
    if (!section) return;
    var remaining = 0;
    var allRequired = section.querySelectorAll('[required]');
    var seen = {};
    allRequired.forEach(function(input) {
        if (input.closest('[style*="display: none"]') || input.closest('[style*="display:none"]') || input.closest('.role-hidden')) return;
        if (input.type === 'radio') {
            if (seen[input.name]) return;
            seen[input.name] = true;
            var checked = section.querySelector('input[name="' + input.name + '"]:checked');
            if (!checked) remaining++;
        } else if (!input.value.trim()) {
            remaining++;
        }
    });
    var el = document.getElementById('progressRemaining');
    if (el) {
        el.textContent = remaining > 0 ? 'Plus que ' + remaining + ' question' + (remaining > 1 ? 's' : '') : 'Section complete !';
    }
}

function validateSection(n) {
    var section = document.getElementById('section-' + n);
    if (!section) return true;

    var requiredInputs = section.querySelectorAll('[required]');
    var valid = true;

    for (var i = 0; i < requiredInputs.length; i++) {
        var input = requiredInputs[i];
        // Skip hidden elements
        if (input.closest('[style*="display: none"]') || input.closest('[style*="display:none"]') || input.closest('.role-hidden')) continue;

        if (input.type === 'radio') {
            var name = input.name;
            var checked = section.querySelector('input[name="' + name + '"]:checked');
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
        var first = section.querySelector('.question-group.missing');
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
    setTimeout(function() {
        group.classList.remove('missing');
        group.style.outline = 'none';
    }, 3000);
}

// ============ CONDITIONAL BRANCHING ============

function applyConditionalBranching() {
    var form = document.getElementById('questionnaireForm');
    var developsAi = form.querySelector('input[name="develops_ai"]:checked');
    var marketsAi = form.querySelector('input[name="markets_ai"]:checked');
    var deploysAi = form.querySelector('input[name="deploys_ai"]:checked');

    var isFournisseur = (developsAi && developsAi.value === 'oui') || (marketsAi && marketsAi.value === 'oui');
    var isDeployeur = deploysAi && (deploysAi.value === 'oui' || deploysAi.value === 'ne_sais_pas');

    // If user is ONLY fournisseur (not deployeur), hide deployeur-specific questions
    var deployeurQuestions = document.querySelectorAll('[data-role="deployeur"]');
    deployeurQuestions.forEach(function(q) {
        if (isFournisseur && !isDeployeur) {
            q.classList.add('role-hidden');
            // Remove required from hidden inputs
            q.querySelectorAll('[required]').forEach(function(inp) {
                inp.removeAttribute('required');
                inp.dataset.wasRequired = 'true';
            });
        } else {
            q.classList.remove('role-hidden');
            // Restore required on visible inputs
            q.querySelectorAll('[data-was-required="true"]').forEach(function(inp) {
                inp.setAttribute('required', 'required');
            });
        }
    });
}

// ============ PROFILE SIDEBAR ============

function updateProfileSidebar() {
    var form = document.getElementById('questionnaireForm');
    if (!form) return;

    var sectorEl = form.querySelector('[name="sector"]');
    var sizeChecked = form.querySelector('input[name="company_size"]:checked');
    var developsAi = form.querySelector('input[name="develops_ai"]:checked');
    var marketsAi = form.querySelector('input[name="markets_ai"]:checked');
    var deploysAi = form.querySelector('input[name="deploys_ai"]:checked');

    var sectorLabels = {
        'tech_saas': 'Tech / SaaS', 'finance': 'Finance', 'sante': 'Sante', 'rh': 'RH',
        'education': 'Education', 'juridique': 'Juridique', 'commerce': 'Commerce',
        'industrie': 'Industrie', 'transport': 'Transport', 'energie': 'Energie',
        'immobilier': 'Immobilier', 'media': 'Media', 'administration': 'Admin. publique', 'autre': 'Autre'
    };
    var sizeLabels = { 'tpe': 'TPE', 'pme': 'PME', 'eti': 'ETI', 'ge': 'Grande Entreprise' };

    var roles = [];
    if (developsAi && developsAi.value === 'oui') roles.push('Fournisseur');
    if (marketsAi && marketsAi.value === 'oui' && roles.indexOf('Fournisseur') === -1) roles.push('Fournisseur');
    if (deploysAi && (deploysAi.value === 'oui' || deploysAi.value === 'ne_sais_pas')) roles.push('Deployeur');

    var roleEl = document.getElementById('profileRole');
    var sectorOutEl = document.getElementById('profileSector');
    var sizeOutEl = document.getElementById('profileSize');

    if (roleEl) roleEl.textContent = 'Role : ' + (roles.length > 0 ? roles.join(', ') : '--');
    if (sectorOutEl) sectorOutEl.textContent = 'Secteur : ' + (sectorEl && sectorEl.value ? (sectorLabels[sectorEl.value] || sectorEl.value) : '--');
    if (sizeOutEl) sizeOutEl.textContent = 'Taille : ' + (sizeChecked ? (sizeLabels[sizeChecked.value] || sizeChecked.value) : '--');
}

// ============ FLOATING RISK BADGE ============

function updateRiskBadge() {
    var data = getFormData();
    var score = calculateScore(data);
    var badge = document.getElementById('floatingRiskBadge');
    var text = document.getElementById('floatingRiskText');
    var icon = document.getElementById('floatingRiskIcon');
    if (!badge || !text) return;

    badge.className = 'floating-risk-badge';
    if (score >= 70) {
        badge.classList.add('risk-critical');
        text.textContent = 'Risque : CRITIQUE';
    } else if (score >= 45) {
        badge.classList.add('risk-high');
        text.textContent = 'Risque : ELEVE';
    } else if (score >= 20) {
        badge.classList.add('risk-medium');
        text.textContent = 'Risque : MODERE';
    } else {
        badge.classList.add('risk-low');
        text.textContent = 'Risque : FAIBLE';
    }
}

// ============ FORM DATA ============

function getFormData() {
    var form = document.getElementById('questionnaireForm');
    var data = {};

    // Text & select inputs
    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select').forEach(function(el) {
        if (el.name) data[el.name] = el.value;
    });

    // Radio inputs
    form.querySelectorAll('input[type="radio"]:checked').forEach(function(el) {
        data[el.name] = el.value;
    });

    // Checkbox inputs
    var checkboxes = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(function(el) {
        if (!checkboxes[el.name]) checkboxes[el.name] = [];
        checkboxes[el.name].push(el.value);
    });
    Object.assign(data, checkboxes);

    return data;
}

// ============ SCORING ENGINE ============

// High-risk AI systems per Annexe III of AI Act (8 domains)
var HIGH_RISK_SYSTEMS = [
    'biometrie',              // Annexe III, pt 1
    'infrastructure_critique', // Annexe III, pt 2
    'education_notation',      // Annexe III, pt 3
    'rh_recrutement',          // Annexe III, pt 4
    'scoring_credit',          // Annexe III, pt 5 (services essentiels)
    'services_essentiels',     // Annexe III, pt 5
    'justice_police',          // Annexe III, pt 6
    'migration_frontieres',    // Annexe III, pt 7
    'democratie',              // Annexe III, pt 8
    'surveillance',            // Composant de securite (Art. 6(1))
    'diagnostic_medical',      // Dispositif medical (Annexe I, sect. A)
    'vehicule_autonome'        // Securite produit (Annexe I)
];

var SYSTEM_LABELS = {
    'chatbot_genai': 'IA generative / Chatbots',
    'biometrie': 'Biometrie / Reconnaissance faciale (Annexe III, pt 1)',
    'infrastructure_critique': 'Infrastructure critique (Annexe III, pt 2)',
    'education_notation': 'Education / Notation (Annexe III, pt 3)',
    'rh_recrutement': 'RH / Recrutement (Annexe III, pt 4)',
    'scoring_credit': 'Scoring / Credit (Annexe III, pt 5)',
    'services_essentiels': 'Services essentiels / Prestations sociales (Annexe III, pt 5)',
    'justice_police': 'Justice / Police / Securite (Annexe III, pt 6)',
    'migration_frontieres': 'Migration / Asile / Frontieres (Annexe III, pt 7)',
    'democratie': 'Justice / Processus democratiques (Annexe III, pt 8)',
    'surveillance': 'Surveillance / Video-analyse',
    'diagnostic_medical': 'Diagnostic medical / Sante',
    'vehicule_autonome': 'Vehicules autonomes / Transport',
    'recommandation': 'Recommandation / Personnalisation',
    'autre_ia': 'Autre systeme d\'IA'
};

var SECTORAL_LABELS = {
    'medtech': 'Dispositifs medicaux (MDR — Regl. (UE) 2017/745)',
    'finance': 'Finance (DORA — Regl. (UE) 2022/2554)',
    'aviation': 'Aviation (Regl. (UE) 2018/1139)',
    'automobiles': 'Automobiles (Regl. (UE) 2019/2144)'
};

function calculateScore(data) {
    var riskScore = 0;

    // --- 1. Role-based risk ---
    if (data.develops_ai === 'oui' || data.markets_ai === 'oui') riskScore += 15;
    if (data.deploys_ai === 'oui') riskScore += 8;
    if (data.imports_ai === 'oui') riskScore += 10;
    if (data.distributes_ai === 'oui') riskScore += 3;

    // --- 2. Prohibited practices — Art. 5(1)(a)-(h) (CRITICAL) ---
    var prohibitedFields = [
        'prohibited_manipulation', 'prohibited_vulnerability', 'prohibited_social_scoring',
        'prohibited_predictive_policing', 'prohibited_facial_scraping', 'prohibited_emotion',
        'prohibited_biometric_categorization', 'prohibited_biometric'
    ];
    var prohibitedCount = 0;
    prohibitedFields.forEach(function(field) {
        if (data[field] === 'oui') prohibitedCount++;
        if (data[field] === 'ne_sais_pas') riskScore += 5;
    });
    riskScore += prohibitedCount * 20;

    // --- 3. High-risk systems ---
    var systems = data.ai_systems || [];
    var highRiskCount = 0;
    systems.forEach(function(sys) {
        if (HIGH_RISK_SYSTEMS.indexOf(sys) !== -1) highRiskCount++;
    });

    // --- Art. 6(3) derogation ---
    if (data.art6_3_derogation === 'oui' && highRiskCount > 0) {
        highRiskCount = Math.max(1, Math.ceil(highRiskCount / 2));
    }

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
    if (data.workers_informed === 'non') riskScore += 5;
    if (data.individuals_informed === 'non') riskScore += 5;
    if (data.deepfakes === 'oui' && data.content_labeling !== 'oui') riskScore += 6;
    if (data.gpai_systemic === 'oui') riskScore += 10;

    // --- 6. Personal data & RGPD ---
    if (data.personal_data === 'oui' && data.rgpd_compliant === 'non') riskScore += 6;
    if (data.personal_data === 'oui' && data.rgpd_compliant === 'partiel') riskScore += 3;

    // --- 7. Provider (fournisseur) advanced questions scoring ---
    if (data.risk_management_system === 'non') riskScore += 6;
    if (data.risk_management_system === 'partiel') riskScore += 3;
    if (data.usage_notice === 'non') riskScore += 5;
    if (data.usage_notice === 'partiel') riskScore += 2;
    if (data.qms_documented === 'non') riskScore += 5;
    if (data.qms_documented === 'partiel') riskScore += 2;
    if (data.post_market_surveillance === 'non') riskScore += 5;
    if (data.post_market_surveillance === 'partiel') riskScore += 2;
    if (data.eu_mandataire === 'non') riskScore += 6;

    // --- 8. DSA cross-compliance ---
    if (data.dsa_platform === 'oui') riskScore += 4;

    // --- 9. Sectoral regulation ---
    var sectoralRegs = data.sectoral_regulation || [];
    var hasSectoralReg = sectoralRegs.filter(function(s) { return s !== 'aucune'; }).length;
    if (hasSectoralReg > 0) riskScore += hasSectoralReg * 3;

    // --- 10. Sector multiplier ---
    var highRiskSectors = ['finance', 'sante', 'rh', 'education', 'administration'];
    if (highRiskSectors.indexOf(data.sector) !== -1) riskScore = Math.round(riskScore * 1.15);

    // --- 11. Size multiplier ---
    if (data.company_size === 'ge') riskScore = Math.round(riskScore * 1.1);
    else if (data.company_size === 'eti') riskScore = Math.round(riskScore * 1.05);

    return Math.min(100, Math.max(0, riskScore));
}

function determineRoles(data) {
    var roles = [];
    if (data.develops_ai === 'oui' || data.markets_ai === 'oui') {
        roles.push({ id: 'fournisseur', label: 'Fournisseur', icon: '&#128295;', ref: 'Art. 3(3)' });
    }
    if (data.deploys_ai === 'oui' || data.deploys_ai === 'ne_sais_pas') {
        roles.push({ id: 'deployeur', label: 'Deployeur', icon: '&#128421;', ref: 'Art. 3(4)' });
    }
    if (data.imports_ai === 'oui') {
        roles.push({ id: 'importateur', label: 'Importateur', icon: '&#128230;', ref: 'Art. 3(6)' });
    }
    if (data.distributes_ai === 'oui') {
        roles.push({ id: 'distributeur', label: 'Distributeur', icon: '&#128279;', ref: 'Art. 3(7)' });
    }
    if (roles.length === 0) {
        roles.push({ id: 'deployeur', label: 'Deployeur (potentiel)', icon: '&#128421;', ref: 'Art. 3(4)' });
    }
    return roles;
}

function classifySystems(data) {
    var systems = data.ai_systems || [];
    var classified = [];

    // Check prohibited
    var hasProhibited = [
        'prohibited_manipulation', 'prohibited_vulnerability', 'prohibited_social_scoring',
        'prohibited_predictive_policing', 'prohibited_facial_scraping', 'prohibited_emotion',
        'prohibited_biometric_categorization', 'prohibited_biometric'
    ].some(function(f) { return data[f] === 'oui'; });

    if (hasProhibited) {
        classified.push({
            level: 'interdit',
            label: 'Pratique(s) d\'IA potentiellement interdite(s) detectee(s)',
            ref: 'Art. 5'
        });
    }

    systems.forEach(function(sys) {
        var label = SYSTEM_LABELS[sys] || sys;
        if (HIGH_RISK_SYSTEMS.indexOf(sys) !== -1) {
            if (data.art6_3_derogation === 'oui') {
                classified.push({ level: 'limite', label: label + ' (derogation Art. 6(3) invoquee)', ref: 'Art. 6(3)' });
            } else {
                classified.push({ level: 'haut', label: label, ref: 'Annexe III' });
            }
        } else if (sys === 'chatbot_genai') {
            classified.push({ level: 'limite', label: label, ref: 'Art. 50 (transparence)' });
        } else if (sys === 'recommandation') {
            classified.push({ level: 'limite', label: label, ref: 'Art. 50' });
        } else {
            classified.push({ level: 'minimal', label: label, ref: 'Art. 6' });
        }
    });

    return classified;
}

function getObligations(data, roles, riskSystems) {
    var obligations = [];
    var roleIds = roles.map(function(r) { return r.id; });
    var hasHighRisk = riskSystems.some(function(s) { return s.level === 'haut'; });

    // Universal obligations
    obligations.push({
        name: 'Formation en maitrise de l\'IA',
        ref: 'Art. 4',
        status: data.employee_informed === 'oui' ? 'done' : data.employee_informed === 'partiel' ? 'partial' : 'missing'
    });

    obligations.push({
        name: 'Transparence vis-a-vis des utilisateurs',
        ref: 'Art. 50',
        status: data.transparency === 'oui' ? 'done' : data.transparency === 'partiel' ? 'partial' : 'missing'
    });

    if (data.uses_gpai === 'oui') {
        obligations.push({
            name: 'Marquage du contenu genere par IA',
            ref: 'Art. 50(2)',
            status: data.content_labeling === 'oui' ? 'done' : data.content_labeling === 'partiel' ? 'partial' : 'missing'
        });
    }

    // Deployer obligations
    if (roleIds.indexOf('deployeur') !== -1) {
        obligations.push({
            name: 'Registre des systemes d\'IA',
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
            name: 'Verification conformite fournisseurs',
            ref: 'Art. 26(1)',
            status: data.supplier_docs === 'oui' ? 'done' : data.supplier_docs === 'partiel' ? 'partial' : 'missing'
        });

        obligations.push({
            name: 'Information des travailleurs et representants du personnel',
            ref: 'Art. 26(7)',
            status: data.workers_informed === 'oui' ? 'done' : data.workers_informed === 'non_concerne' ? 'done' : 'missing'
        });

        obligations.push({
            name: 'Information des personnes sur les decisions IA a haut risque',
            ref: 'Art. 26(11)',
            status: data.individuals_informed === 'oui' ? 'done' : data.individuals_informed === 'non_concerne' ? 'done' : 'missing'
        });

        if (hasHighRisk) {
            obligations.push({
                name: 'FRIA — Evaluation d\'impact droits fondamentaux',
                ref: 'Art. 27',
                status: data.fria === 'oui' ? 'done' : data.fria === 'en_cours' ? 'partial' : 'missing'
            });
        }
    }

    // Deepfake obligations
    if (data.deepfakes === 'oui') {
        obligations.push({
            name: 'Etiquetage des hypertrucages (deepfakes)',
            ref: 'Art. 50(4)',
            status: data.content_labeling === 'oui' ? 'done' : data.content_labeling === 'partiel' ? 'partial' : 'missing'
        });
    }

    // GPAI systemic risk
    if (data.gpai_systemic === 'oui') {
        obligations.push({ name: 'Tests contradictoires (adversarial testing)', ref: 'Art. 55(1)(a)', status: 'missing' });
        obligations.push({ name: 'Evaluation et attenuation des risques systemiques', ref: 'Art. 55(1)(b)', status: 'missing' });
        obligations.push({ name: 'Signalement des incidents graves', ref: 'Art. 55(1)(c)', status: 'missing' });
        obligations.push({ name: 'Protection en matiere de cybersecurite', ref: 'Art. 55(1)(d)', status: 'missing' });
    }

    // Provider obligations (fournisseur)
    if (roleIds.indexOf('fournisseur') !== -1) {
        obligations.push({
            name: 'Systeme de gestion des risques (cycle de vie)',
            ref: 'Art. 9(1)',
            status: data.risk_management_system === 'oui' ? 'done' : data.risk_management_system === 'partiel' ? 'partial' : 'missing'
        });
        obligations.push({
            name: 'Notice d\'utilisation (performance, precision, robustesse)',
            ref: 'Art. 13(1)',
            status: data.usage_notice === 'oui' ? 'done' : data.usage_notice === 'partiel' ? 'partial' : 'missing'
        });
        obligations.push({
            name: 'Systeme de gestion de la qualite (QMS)',
            ref: 'Art. 17(1)',
            status: data.qms_documented === 'oui' ? 'done' : data.qms_documented === 'partiel' ? 'partial' : 'missing'
        });
        obligations.push({ name: 'Documentation technique (Annexe IV)', ref: 'Art. 11', status: 'missing' });
        obligations.push({ name: 'Declaration de conformite UE', ref: 'Art. 47', status: 'missing' });
        obligations.push({ name: 'Marquage CE', ref: 'Art. 48', status: 'missing' });
        obligations.push({ name: 'Enregistrement base de donnees UE', ref: 'Art. 49', status: 'missing' });
        obligations.push({
            name: 'Surveillance post-marche',
            ref: 'Art. 72(1)',
            status: data.post_market_surveillance === 'oui' ? 'done' : data.post_market_surveillance === 'partiel' ? 'partial' : 'missing'
        });

        if (data.eu_operation !== 'oui' && data.eu_mandataire !== undefined) {
            obligations.push({
                name: 'Designation d\'un mandataire dans l\'UE',
                ref: 'Art. 3(5)',
                status: data.eu_mandataire === 'oui' ? 'done' : data.eu_mandataire === 'en_cours' ? 'partial' : 'missing'
            });
        }
    }

    // Art. 6(3) derogation documentation
    if (data.art6_3_derogation === 'oui') {
        obligations.push({
            name: 'Documentation de la derogation Art. 6(3)',
            ref: 'Art. 6(3)',
            status: 'missing'
        });
    }

    // Importer obligations
    if (roleIds.indexOf('importateur') !== -1) {
        obligations.push({ name: 'Verification conformite fournisseur etranger', ref: 'Art. 23', status: 'missing' });
        obligations.push({ name: 'Verification marquage CE et documentation', ref: 'Art. 23(2)', status: 'missing' });
    }

    // DSA obligations
    if (data.dsa_platform === 'oui') {
        obligations.push({ name: 'Transparence des systemes de recommandation', ref: 'Art. 27 DSA (Regl. 2022/2065)', status: 'missing' });
    }

    // Sectoral regulation
    var sectoralRegs = data.sectoral_regulation || [];
    if (sectoralRegs.indexOf('medtech') !== -1) {
        obligations.push({ name: 'Conformite reglementation dispositifs medicaux', ref: 'MDR — Regl. (UE) 2017/745', status: 'missing' });
    }
    if (sectoralRegs.indexOf('finance') !== -1) {
        obligations.push({ name: 'Conformite resilience operationnelle numerique', ref: 'DORA — Regl. (UE) 2022/2554', status: 'missing' });
    }
    if (sectoralRegs.indexOf('aviation') !== -1) {
        obligations.push({ name: 'Conformite reglementation securite aerienne', ref: 'Regl. (UE) 2018/1139', status: 'missing' });
    }
    if (sectoralRegs.indexOf('automobiles') !== -1) {
        obligations.push({ name: 'Conformite reglementation securite automobile', ref: 'Regl. (UE) 2019/2144', status: 'missing' });
    }

    // RGPD
    if (data.personal_data === 'oui') {
        obligations.push({
            name: 'Conformite RGPD pour les traitements IA',
            ref: 'Regl. 2016/679',
            status: data.rgpd_compliant === 'oui' ? 'done' : data.rgpd_compliant === 'partiel' ? 'partial' : 'missing'
        });
    }

    return obligations;
}

// ============ DYNAMIC LEGAL DISCLAIMER ============

function getApplicableArticles(data, roles, riskSystems, obligations) {
    var articles = [];
    var articleSet = {};
    var roleIds = roles.map(function(r) { return r.id; });

    function addArt(a) { if (!articleSet[a]) { articleSet[a] = true; articles.push(a); } }

    addArt('Art. 3'); addArt('Art. 4');

    var prohibitedFields = [
        'prohibited_manipulation', 'prohibited_vulnerability', 'prohibited_social_scoring',
        'prohibited_predictive_policing', 'prohibited_facial_scraping', 'prohibited_emotion',
        'prohibited_biometric_categorization', 'prohibited_biometric'
    ];
    if (prohibitedFields.some(function(f) { return data[f] === 'oui' || data[f] === 'ne_sais_pas'; })) {
        addArt('Art. 5');
    }

    addArt('Art. 6');
    if (data.art6_3_derogation === 'oui') addArt('Art. 6(3)');

    if (roleIds.indexOf('fournisseur') !== -1) {
        addArt('Art. 9'); addArt('Art. 11'); addArt('Art. 13'); addArt('Art. 17');
        addArt('Art. 47'); addArt('Art. 48'); addArt('Art. 49'); addArt('Art. 72');
        if (data.eu_operation !== 'oui') addArt('Art. 3(5)');
    }

    if (roleIds.indexOf('deployeur') !== -1) { addArt('Art. 14'); addArt('Art. 26'); }
    if (riskSystems.some(function(s) { return s.level === 'haut'; })) addArt('Art. 27');
    addArt('Art. 50');
    if (data.uses_gpai === 'oui') { addArt('Art. 51'); addArt('Art. 52'); }
    if (data.gpai_systemic === 'oui') addArt('Art. 55');
    if (roleIds.indexOf('importateur') !== -1) addArt('Art. 23');

    var externalRegs = [];
    if (data.personal_data === 'oui') externalRegs.push('RGPD (Regl. 2016/679)');
    if (data.dsa_platform === 'oui') externalRegs.push('DSA (Regl. 2022/2065, Art. 27)');
    var sectoralRegs = data.sectoral_regulation || [];
    if (sectoralRegs.indexOf('medtech') !== -1) externalRegs.push('MDR (Regl. 2017/745)');
    if (sectoralRegs.indexOf('finance') !== -1) externalRegs.push('DORA (Regl. 2022/2554)');
    if (sectoralRegs.indexOf('aviation') !== -1) externalRegs.push('Regl. 2018/1139');
    if (sectoralRegs.indexOf('automobiles') !== -1) externalRegs.push('Regl. 2019/2144');

    articles.sort();
    return { articles: articles, externalRegs: externalRegs };
}

// ============ EMAIL GATE ============

function unlockResults() {
    var prenom = document.getElementById('gatePrenom').value.trim();
    var email = document.getElementById('gateEmail').value.trim();

    if (!prenom || !email) {
        alert('Veuillez renseigner votre prenom et votre email.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    document.getElementById('emailGate').style.display = 'none';
    document.getElementById('gatedResults').style.display = 'block';

    // Clear autosave on successful submit
    localStorage.removeItem('complia_diagnostic');
}

// ============ PERSONALIZED OFFER ============

function renderPersonalizedOffer(score, roles) {
    var roleIds = roles.map(function(r) { return r.id; });
    var isFournisseur = roleIds.indexOf('fournisseur') !== -1;
    var isDeployeur = roleIds.indexOf('deployeur') !== -1;

    var offers = [];

    if (score < 20) {
        offers.push({ name: 'Veille Reglementaire', price: '190\u20AC/mois', desc: 'Restez informe des evolutions AI Act', featured: false, recommended: true });
        offers.push({ name: 'Diagnostic Flash', price: '990\u20AC HT', desc: 'Rapport complet en 5 jours', featured: false, recommended: false });
        offers.push({ name: 'Pack Conformite', price: '3 990\u20AC HT', desc: 'Conformite complete, audit ready', featured: false, recommended: false });
    } else if (score < 45) {
        offers.push({ name: 'Veille Reglementaire', price: '190\u20AC/mois', desc: 'Restez informe des evolutions', featured: false, recommended: false });
        offers.push({ name: 'Diagnostic Flash', price: '990\u20AC HT', desc: 'Rapport complet en 5 jours', featured: true, recommended: true });
        offers.push({ name: 'Pack Conformite', price: '3 990\u20AC HT', desc: 'Conformite complete, audit ready', featured: false, recommended: false });
    } else if (score < 70) {
        if (isFournisseur) {
            offers.push({ name: 'Diagnostic Flash', price: '990\u20AC HT', desc: 'Rapport complet en 5 jours', featured: false, recommended: false });
            offers.push({ name: 'Roadmap Fournisseur', price: '6 990\u20AC HT', desc: 'Plan conformite fournisseur complet', featured: true, recommended: true });
            offers.push({ name: 'Conformite Fournisseur', price: '35 000\u20AC+', desc: 'Accompagnement integral CE + QMS', featured: false, recommended: false });
        } else {
            offers.push({ name: 'Diagnostic Flash', price: '990\u20AC HT', desc: 'Rapport complet en 5 jours', featured: false, recommended: false });
            offers.push({ name: 'Pack Conformite', price: '3 990\u20AC HT', desc: 'Conformite deployeur, audit ready', featured: true, recommended: true });
            offers.push({ name: 'Pack Conformite+', price: '6 990\u20AC HT', desc: 'Haut risque maitrise + FRIA', featured: false, recommended: false });
        }
    } else {
        if (isFournisseur) {
            offers.push({ name: 'Pack Conformite+', price: '6 990\u20AC HT', desc: 'Haut risque maitrise + FRIA', featured: false, recommended: false });
            offers.push({ name: 'Conformite Fournisseur', price: '35 000\u20AC+', desc: 'Accompagnement integral CE + QMS', featured: true, recommended: true });
            offers.push({ name: 'Roadmap Fournisseur', price: '6 990\u20AC HT', desc: 'Plan conformite fournisseur complet', featured: false, recommended: false });
        } else {
            offers.push({ name: 'Pack Conformite', price: '3 990\u20AC HT', desc: 'Conformite complete, audit ready', featured: false, recommended: false });
            offers.push({ name: 'Pack Conformite+', price: '6 990\u20AC HT', desc: 'Haut risque maitrise + FRIA', featured: true, recommended: true });
            offers.push({ name: 'Conformite Fournisseur', price: '35 000\u20AC+', desc: 'Accompagnement integral', featured: false, recommended: false });
        }
    }

    var container = document.getElementById('ctaOffers');
    container.innerHTML = offers.map(function(o) {
        return '<div class="offer-card' + (o.featured ? ' featured' : '') + '">' +
            (o.recommended ? '<div class="offer-badge">RECOMMANDE POUR VOUS</div>' : '') +
            '<div class="offer-name">' + o.name + '</div>' +
            '<div class="offer-price">' + o.price + '</div>' +
            '<div class="offer-desc">' + o.desc + '</div>' +
        '</div>';
    }).join('');
}

// ============ RENDER RESULTS ============

function submitQuestionnaire() {
    if (!validateSection(7)) return;

    var data = getFormData();
    var score = calculateScore(data);
    var roles = determineRoles(data);
    var riskSystems = classifySystems(data);
    var obligations = getObligations(data, roles, riskSystems);

    // Cache for use after gate unlock
    cachedScore = score;
    cachedRoles = roles;
    cachedRiskSystems = riskSystems;
    cachedObligations = obligations;

    // Hide form, show results
    document.getElementById('questionnaire').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('floatingRiskBadge').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render score (always visible)
    renderScore(score);

    // Pre-render gated content (hidden until gate unlocked)
    renderRoles(roles);
    renderAlerts(data, score, riskSystems);
    renderRiskClassification(riskSystems);
    renderObligations(obligations);
    renderDynamicDisclaimer(data, roles, riskSystems, obligations);
    renderPersonalizedOffer(score, roles);

    saveFormData();
}

function renderScore(score) {
    var circle = document.getElementById('scoreCircle');
    var value = document.getElementById('scoreValue');
    var label = document.getElementById('scoreLevelLabel');
    var desc = document.getElementById('scoreLevelDesc');

    var level, levelClass, description;

    if (score >= 70) {
        level = 'Risque CRITIQUE';
        levelClass = 'critical';
        description = 'Votre entreprise presente un niveau de risque tres eleve au regard de l\'AI Act. Une action immediate est necessaire pour eviter des sanctions potentiellement lourdes. Nous recommandons un diagnostic strategique urgent.';
    } else if (score >= 45) {
        level = 'Risque ELEVE';
        levelClass = 'high';
        description = 'Plusieurs manquements significatifs ont ete identifies. Un plan de mise en conformite structure est indispensable avant les echeances de 2026. Nous recommandons un diagnostic strategique.';
    } else if (score >= 20) {
        level = 'Risque MODERE';
        levelClass = 'medium';
        description = 'Des axes d\'amelioration ont ete identifies. Votre entreprise a commence certaines demarches mais des lacunes subsistent. Un diagnostic flash permettrait de preciser les actions prioritaires.';
    } else {
        level = 'Risque FAIBLE';
        levelClass = 'low';
        description = 'Votre exposition au risque AI Act semble limitee a ce stade. Nous recommandons neanmoins une veille reglementaire pour anticiper les evolutions.';
    }

    circle.className = 'score-circle ' + levelClass;
    value.textContent = score;
    label.textContent = level;
    desc.textContent = description;

    // Animate score
    var current = 0;
    var increment = Math.ceil(score / 40);
    var timer = setInterval(function() {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        value.textContent = current;
    }, 30);
}

function renderRoles(roles) {
    var container = document.getElementById('roleTags');
    container.innerHTML = roles.map(function(role) {
        return '<div class="role-tag ' + role.id + '">' +
            '<span>' + role.icon + '</span>' +
            '<span>' + role.label + '</span>' +
            '<span style="opacity:0.6;font-size:12px">(' + role.ref + ')</span>' +
        '</div>';
    }).join('');
}

function renderAlerts(data, score, riskSystems) {
    var container = document.getElementById('alertsBlock');
    var html = '';

    var hasProhibited = riskSystems.some(function(s) { return s.level === 'interdit'; });
    if (hasProhibited) {
        html += '<div class="alert-block critical"><span class="alert-icon">&#128680;</span><div>' +
            '<strong>ALERTE — Pratique potentiellement interdite detectee</strong><br>' +
            'Certaines de vos reponses indiquent l\'utilisation possible de pratiques d\'IA interdites depuis le 2 fevrier 2025 (Art. 5). ' +
            'Sanction maximale : <strong>35M\u20AC ou 7% du CA mondial</strong>. Consultez immediatement un expert.' +
        '</div></div>';
    }

    var highRiskSystems = riskSystems.filter(function(s) { return s.level === 'haut'; });
    if (highRiskSystems.length > 0) {
        html += '<div class="alert-block warning"><span class="alert-icon">&#9888;&#65039;</span><div>' +
            '<strong>' + highRiskSystems.length + ' systeme(s) a haut risque identifie(s)</strong><br>' +
            'Ces systemes sont soumis aux obligations renforcees de l\'AI Act (Annexe III). ' +
            'Echeance de conformite : <strong>aout 2026</strong>.' +
        '</div></div>';
    }

    if (data.art6_3_derogation === 'oui') {
        html += '<div class="alert-block info"><span class="alert-icon">&#8505;&#65039;</span><div>' +
            '<strong>Derogation Art. 6(3) invoquee</strong><br>' +
            'Vous estimez que vos systemes Annexe III ne posent pas de risque significatif. Cette derogation doit etre <strong>documentee et justifiee</strong>. L\'autorite de surveillance peut contester cette qualification.' +
        '</div></div>';
    }

    if (data.dsa_platform === 'oui') {
        html += '<div class="alert-block info"><span class="alert-icon">&#8505;&#65039;</span><div>' +
            '<strong>Conformite croisee DSA</strong><br>' +
            'Votre plateforme en ligne utilise l\'IA pour la recommandation de contenu. L\'Art. 27 du DSA (Regl. 2022/2065) impose des obligations de transparence specifiques.' +
        '</div></div>';
    }

    var sectoralRegs = data.sectoral_regulation || [];
    var activeSectoral = sectoralRegs.filter(function(s) { return s !== 'aucune'; });
    if (activeSectoral.length > 0) {
        var sectorLabels = activeSectoral.map(function(s) { return SECTORAL_LABELS[s] || s; }).join(', ');
        html += '<div class="alert-block info"><span class="alert-icon">&#8505;&#65039;</span><div>' +
            '<strong>Reglementation sectorielle applicable (Annexe I)</strong><br>' +
            'Vos systemes d\'IA sont integres dans des produits soumis a : <strong>' + sectorLabels + '</strong>.' +
        '</div></div>';
    }

    if (data.personal_data === 'oui' && data.rgpd_compliant !== 'oui') {
        html += '<div class="alert-block info"><span class="alert-icon">&#8505;&#65039;</span><div>' +
            '<strong>Articulation AI Act / RGPD</strong><br>' +
            'Vos systemes d\'IA traitent des donnees personnelles. La conformite RGPD (Regl. 2016/679) est un prerequis complementaire a l\'AI Act.' +
        '</div></div>';
    }

    container.innerHTML = html;
}

function renderRiskClassification(systems) {
    var container = document.getElementById('riskClassification');
    if (systems.length === 0) {
        container.innerHTML = '<p style="color:#64748b;font-size:14px;">Aucun systeme d\'IA identifie.</p>';
        return;
    }

    container.innerHTML = systems.map(function(sys) {
        return '<div class="risk-item">' +
            '<span class="risk-badge ' + sys.level + '">' + (sys.level === 'interdit' ? 'INTERDIT' : sys.level === 'haut' ? 'HAUT RISQUE' : sys.level === 'limite' ? 'RISQUE LIMITE' : 'MINIMAL') + '</span>' +
            '<span class="risk-label">' + sys.label + '</span>' +
            '<span style="color:#94a3b8;font-size:12px;margin-left:auto">' + sys.ref + '</span>' +
        '</div>';
    }).join('');
}

function renderObligations(obligations) {
    var container = document.getElementById('obligationsList');

    var statusIcon = { done: '\u2713', partial: '~', missing: '\u2717' };

    container.innerHTML = obligations.map(function(ob) {
        return '<div class="obligation-item">' +
            '<div class="obligation-status ' + ob.status + '">' + statusIcon[ob.status] + '</div>' +
            '<div class="obligation-text">' +
                '<div class="obligation-name">' + ob.name + '</div>' +
                '<div class="obligation-ref">' + ob.ref + '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderDynamicDisclaimer(data, roles, riskSystems, obligations) {
    var container = document.getElementById('dynamicDisclaimer');
    var result = getApplicableArticles(data, roles, riskSystems, obligations);

    var html = '<p style="font-size:14px;color:var(--text-secondary);line-height:1.7;">' +
        'Ce diagnostic couvre les articles suivants du <strong>Reglement (UE) 2024/1689</strong> : ' +
        '<strong>' + result.articles.join(', ') + '</strong>.' +
    '</p>';

    if (result.externalRegs.length > 0) {
        html += '<p style="font-size:14px;color:var(--text-secondary);line-height:1.7;margin-top:8px;">' +
            'Reglementations complementaires identifiees : <strong>' + result.externalRegs.join(', ') + '</strong>.' +
        '</p>';
    }

    html += '<p style="font-size:12px;color:var(--text-light);margin-top:12px;">' +
        'Derniere mise a jour des guidelines de la Commission : Juillet 2025. ' +
        'Ce diagnostic ne couvre pas l\'ensemble des dispositions du Reglement et doit etre complete par une analyse juridique approfondie.' +
    '</p>';

    container.innerHTML = html;
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', function() {
    // Dark mode
    initDarkMode();

    // Countdown
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // Autosave restore
    var restored = restoreFormData();
    if (restored) {
        document.getElementById('autosaveBanner').style.display = 'block';
    }

    // Listen for form changes to autosave and update badge
    var form = document.getElementById('questionnaireForm');
    if (form) {
        form.addEventListener('input', function() {
            saveFormData();
            updateRiskBadge();
            updateSmartProgress();
            updateProfileSidebar();
        });
        form.addEventListener('change', function() {
            saveFormData();
            updateRiskBadge();
            updateSmartProgress();
            updateProfileSidebar();
            applyConditionalBranching();
        });
    }
});
