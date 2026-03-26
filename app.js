/* ============================================
   COMPLIA — EU AI Act Diagnostic
   Full questionnaire engine based on DeepSEARCH
   Vanilla JS — Branching, Scoring, localStorage
   ============================================ */

// ============ STATE ============
let currentSection = '0';
let effectiveRole = null; // may change via Art 25
let classification = null; // PROHIBITED, HIGH-RISK, LIMITED-RISK, MINIMAL-RISK
let isHighRisk = false;
let isProhibited = false;
let highRiskSources = []; // annex I, annex III categories
let complianceScore = 0;
let complianceMax = 0;

// Section flow - dynamic based on branching
function getSectionOrder() {
    const order = ['0'];
    const role = getVal('q0_1');
    if (role && role !== 'fournisseur') {
        order.push('0bis');
    }
    order.push('1');
    if (!isProhibited) {
        order.push('2');
        if (isHighRisk) {
            order.push('3', '4');
        } else {
            // If no high risk detected in section 2, still show section 3 if any annex III was detected
            const annexIII = checkAnnexIII();
            if (annexIII.length > 0) {
                order.push('3');
                // Section 4 added only if still high risk after exemptions
            }
        }
        order.push('5');
    }
    order.push('6');
    return order;
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    updateCountdown();
    setInterval(updateCountdown, 60000);
    initTooltips();
    initConditionalListeners();

    // Try restore
    if (restoreFormData()) {
        document.getElementById('autosaveBanner').style.display = 'block';
    }
});

// ============ COUNTDOWN ============
function updateCountdown() {
    const deadline = new Date('2026-08-02T00:00:00');
    const now = new Date();
    const diff = deadline - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const el = document.getElementById('countdownValue');
    if (!el) return;
    if (days <= 0) {
        el.textContent = 'Echeance depassee';
        el.classList.add('countdown-pulse');
    } else {
        el.textContent = days + ' jours restants';
        if (days < 180) {
            el.classList.add('countdown-pulse');
        }
    }
    const timelineEl = document.getElementById('timelineCriticalDate');
    if (timelineEl) {
        timelineEl.textContent = '2 aout 2026 — ' + days + ' jours';
    }
}

// ============ DARK MODE ============
function initDarkMode() {
    const saved = localStorage.getItem('complia_darkmode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (saved === null && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleDarkIcons(true);
    }
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('complia_darkmode', 'light');
                toggleDarkIcons(false);
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('complia_darkmode', 'dark');
                toggleDarkIcons(true);
            }
        });
    }
}

function toggleDarkIcons(isDark) {
    const moon = document.getElementById('iconMoon');
    const sun = document.getElementById('iconSun');
    if (moon && sun) {
        moon.style.display = isDark ? 'none' : 'block';
        sun.style.display = isDark ? 'block' : 'none';
    }
}

// ============ TOOLTIPS ============
function initTooltips() {
    const popup = document.getElementById('tooltipPopup');
    document.addEventListener('mouseover', function(e) {
        const trigger = e.target.closest('.tooltip-trigger');
        if (trigger && popup) {
            popup.textContent = trigger.getAttribute('data-tooltip');
            popup.style.display = 'block';
            const rect = trigger.getBoundingClientRect();
            popup.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
            popup.style.top = (rect.bottom + 8) + 'px';
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.tooltip-trigger') && popup) {
            popup.style.display = 'none';
        }
    });
    // Touch support
    document.addEventListener('touchstart', function(e) {
        const trigger = e.target.closest('.tooltip-trigger');
        if (trigger && popup) {
            e.preventDefault();
            popup.textContent = trigger.getAttribute('data-tooltip');
            popup.style.display = 'block';
            const rect = trigger.getBoundingClientRect();
            popup.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
            popup.style.top = (rect.bottom + 8) + 'px';
            setTimeout(function() { popup.style.display = 'none'; }, 4000);
        }
    });
}

// ============ CONDITIONAL LISTENERS ============
function initConditionalListeners() {
    // Q0.3bis: exclusions
    listenRadio('q0_3bis', function(val) {
        const alert = document.getElementById('alert_exclusion');
        if (val !== 'aucun') {
            show(alert);
            hide('q0_4'); hide('q0_4_sub'); hide('q0_5'); hide('q0_6'); hide('q0_7'); hide('q0_8');
        } else {
            hide(alert);
            show('q0_4');
        }
    });

    // Q0.4: IA definition
    listenRadio('q0_4', function(val) {
        if (val === 'non') {
            show('alert_not_ai');
            hide('q0_4_sub'); hide('q0_5'); hide('q0_6'); hide('q0_7'); hide('q0_8');
        } else {
            hide('alert_not_ai');
            if (val === 'oui' || val === 'incertain') {
                show('q0_4_sub');
                show('q0_5');
                show('q0_6');
                show('q0_7');
                show('q0_8');
            }
        }
    });

    // Q0.6: hors UE
    listenRadio('q0_6', function(val) {
        const alert = document.getElementById('alert_hors_ue');
        if (val === 'hors_ue') {
            show(alert);
        } else {
            hide(alert);
        }
    });

    // Q0.7: urgency
    listenRadio('q0_7', function(val) {
        const alert = document.getElementById('alert_urgence');
        if (val === 'production' || val === 'commercialise') {
            show(alert);
        } else {
            hide(alert);
        }
    });

    // Q0-BIS: Art 25 actions
    listenCheckboxGroup('q0bis_actions', function(vals) {
        const alert = document.getElementById('alert_art25');
        const detailGroup = document.getElementById('q0bis_modif_detail');
        const hasAction = vals.length > 0 && !vals.includes('aucune');
        const hasAucune = vals.includes('aucune');

        if (hasAction && !hasAucune) {
            show(alert);
            if (vals.includes('modif_substantielle')) {
                show(detailGroup);
            } else {
                hide(detailGroup);
            }
        } else {
            hide(alert);
            hide(detailGroup);
        }
    });

    // Q2.A.1: Annexe I branching
    listenRadio('q2_a1', function(val) {
        if (val === 'oui') {
            show('q2_a2_group');
            show('q2_a4_group');
        } else {
            hide('q2_a2_group');
            hide('q2_a4_group');
        }
    });

    // Q5.1: synthetic content
    listenRadio('q5_1', function(val) {
        if (val === 'oui') { show('q5_2_group'); } else { hide('q5_2_group'); }
    });

    // Q5.3: chatbot
    listenRadio('q5_3', function(val) {
        if (val === 'oui') { show('q5_4_group'); } else { hide('q5_4_group'); }
    });

    // Q3.0: profiling
    listenRadio('q3_0', function(val) {
        const alert = document.getElementById('alert_profiling');
        if (val === 'oui' || val === 'incertain') {
            show(alert);
            hide('q3_1_group'); hide('q3_2_group'); hide('q3_3_group');
        } else {
            hide(alert);
            show('q3_1_group'); show('q3_2_group'); show('q3_3_group');
        }
    });

    // Real-time Art. 5 kill switch monitoring
    ['q1_1','q1_2','q1_3','q1_4','q1_5','q1_6','q1_7','q1_8'].forEach(function(name) {
        listenRadio(name, function() {
            checkProhibitions();
            updateRiskBadge();
        });
    });

    // Auto-save on any input change
    document.getElementById('questionnaireForm').addEventListener('change', function() {
        saveFormData();
        updateRiskBadge();
        updateProfileSidebar();
    });
}

// ============ HELPERS ============
function getVal(name) {
    const el = document.querySelector('[name="' + name + '"]:checked') || document.querySelector('[name="' + name + '"]');
    if (!el) return null;
    if (el.type === 'radio' || el.type === 'checkbox') {
        const checked = document.querySelector('[name="' + name + '"]:checked');
        return checked ? checked.value : null;
    }
    return el.value || null;
}

function getCheckedValues(name) {
    const checked = document.querySelectorAll('[name="' + name + '"]:checked');
    return Array.from(checked).map(function(el) { return el.value; });
}

function show(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.style.display = 'block';
}

function hide(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.style.display = 'none';
}

function listenRadio(name, callback) {
    document.querySelectorAll('[name="' + name + '"]').forEach(function(radio) {
        radio.addEventListener('change', function() { callback(this.value); });
    });
}

function listenCheckboxGroup(name, callback) {
    document.querySelectorAll('[name="' + name + '"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            callback(getCheckedValues(name));
        });
    });
}

// ============ NAVIGATION ============
function startQuestionnaire() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('questionnaire').style.display = 'block';
    showSection('0');
    document.getElementById('floatingRiskBadge').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(id) {
    // Hide all sections
    document.querySelectorAll('#questionnaireForm > .section').forEach(function(s) {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    const target = document.getElementById('section-' + id);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    currentSection = id;
    updateProgress();
    updateProfileSidebar();

    // Show sidebar from section 1 onward
    const sidebar = document.getElementById('profileSidebar');
    if (sidebar) {
        sidebar.style.display = (id !== '0') ? 'block' : 'none';
    }

    // Section 4: show correct audit panel
    if (id === '4') {
        setupSection4();
    }

    // Section 6: compute and render results
    if (id === '6') {
        computeResults();
    }

    window.scrollTo({ top: document.getElementById('questionnaire').offsetTop - 70, behavior: 'smooth' });
}

function nextSection(current) {
    if (!validateSection(current)) return;

    // Process branching logic after each section
    processBranching(current);

    // KILL SWITCH: If prohibited detected in section 1, jump straight to results
    if (current === '1' && isProhibited) {
        classification = 'INTERDIT';
        updateRiskBadge();
        showSection('6');
        saveFormData();
        return;
    }

    // Determine next section
    const next = getNextSection(current);
    if (next) {
        showSection(next);
    }

    saveFormData();
}

function prevSection(current) {
    const prev = getPrevSection(current);
    if (prev) {
        showSection(prev);
    }
}

function getNextSection(current) {
    const flow = buildFlow();
    const idx = flow.indexOf(current);
    if (idx >= 0 && idx < flow.length - 1) {
        return flow[idx + 1];
    }
    return null;
}

function getPrevSection(current) {
    const flow = buildFlow();
    const idx = flow.indexOf(current);
    if (idx > 0) {
        return flow[idx - 1];
    }
    return null;
}

function buildFlow() {
    const flow = ['0'];
    const role = getVal('q0_1');

    // Section 0-BIS only if not fournisseur
    if (role && role !== 'fournisseur') {
        flow.push('0bis');
    }

    // Check if excluded
    const exclusion = getVal('q0_3bis');
    if (exclusion && exclusion !== 'aucun') {
        return flow; // Stop here
    }
    const isAI = getVal('q0_4');
    if (isAI === 'non') {
        return flow; // Stop here
    }

    flow.push('1');

    // If prohibited, go straight to results
    if (isProhibited) {
        flow.push('6');
        return flow;
    }

    flow.push('2');

    // If high risk detected in section 2, show section 3 (exemptions)
    const annexIII = checkAnnexIII();
    const annexI = checkAnnexI();
    if (annexI || annexIII.length > 0) {
        // Annexe I always high risk if 3rd party assessment needed
        if (annexI) {
            isHighRisk = true;
            flow.push('4'); // Skip exemptions for Annexe I
        } else {
            flow.push('3'); // Exemptions only for Annexe III
            if (isHighRisk) {
                flow.push('4');
            }
        }
    }

    flow.push('5');
    flow.push('6');

    return flow;
}

// ============ BRANCHING LOGIC ============
function processBranching(sectionId) {
    if (sectionId === '0') {
        // Determine effective role
        effectiveRole = getVal('q0_1');
    }

    if (sectionId === '0bis') {
        // Art 25 reclassification
        const actions = getCheckedValues('q0bis_actions');
        const hasAction = actions.length > 0 && !actions.includes('aucune');
        if (hasAction) {
            effectiveRole = 'fournisseur';
        }
    }

    if (sectionId === '1') {
        // Check prohibitions
        checkProhibitions();
    }

    if (sectionId === '2') {
        // Check high risk classification
        const annexI = checkAnnexI();
        const annexIII = checkAnnexIII();
        highRiskSources = [];

        if (annexI) {
            isHighRisk = true;
            highRiskSources.push('Annexe I (Produit reglemente)');
        }
        if (annexIII.length > 0) {
            isHighRisk = true;
            annexIII.forEach(function(cat) { highRiskSources.push(cat); });
        }

        // Show/hide alerts
        if (isHighRisk) {
            show('alert_highRisk');
            hide('alert_notHighRisk');
        } else {
            hide('alert_highRisk');
            show('alert_notHighRisk');
        }
    }

    if (sectionId === '3') {
        // Exemptions check
        const profiling = getVal('q3_0');
        if (profiling === 'oui' || profiling === 'incertain') {
            // Still high risk
            isHighRisk = true;
            show('alert_stillHighRisk');
            hide('alert_declassed');
        } else {
            const q31 = getVal('q3_1');
            const q32 = getVal('q3_2');
            const q33 = getCheckedValues('q3_3');

            if (q31 === 'oui' && q32 === 'oui' && q33.length > 0) {
                // Declassed
                isHighRisk = false;
                highRiskSources = [];
                show('alert_declassed');
                hide('alert_stillHighRisk');
            } else {
                isHighRisk = true;
                show('alert_stillHighRisk');
                hide('alert_declassed');
            }
        }
    }
}

function checkProhibitions() {
    isProhibited = false;
    const questions = ['q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7', 'q1_8'];
    for (let i = 0; i < questions.length; i++) {
        if (getVal(questions[i]) === 'oui') {
            isProhibited = true;
            break;
        }
    }

    const alert = document.getElementById('alert_prohibited');
    if (isProhibited) {
        show(alert);
    } else {
        hide(alert);
    }
}

function checkAnnexI() {
    const q2a1 = getVal('q2_a1');
    const q2a4 = getVal('q2_a4');
    return q2a1 === 'oui' && q2a4 === 'oui';
}

function checkAnnexIII() {
    const categories = [];
    const catNames = {
        'q2_b1': 'Annexe III Cat. 1 (Biometrie)',
        'q2_b2': 'Annexe III Cat. 2 (Infrastructure critique)',
        'q2_b3': 'Annexe III Cat. 3 (Education)',
        'q2_b4': 'Annexe III Cat. 4 (Emploi)',
        'q2_b5': 'Annexe III Cat. 5 (Services essentiels)',
        'q2_b6': 'Annexe III Cat. 6 (Law enforcement)',
        'q2_b7': 'Annexe III Cat. 7 (Migration)',
        'q2_b8': 'Annexe III Cat. 8 (Justice & democratie)'
    };
    Object.keys(catNames).forEach(function(name) {
        if (getVal(name) === 'oui') {
            categories.push(catNames[name]);
        }
    });
    return categories;
}

// ============ SECTION 4 SETUP ============
function setupSection4() {
    const role = effectiveRole || getVal('q0_1');
    const s4a = document.getElementById('section4A');
    const s4b = document.getElementById('section4B');

    if (role === 'deployeur') {
        hide(s4a);
        show(s4b);
        document.getElementById('section4Title').textContent = 'Audit Conformite Deployeur (Art. 26)';
        document.getElementById('section4Desc').textContent = 'Evaluation de la conformite aux obligations Article 26 pour les deployeurs.';
    } else {
        show(s4a);
        hide(s4b);
        document.getElementById('section4Title').textContent = 'Audit Conformite Fournisseur (Art. 8-17)';
        document.getElementById('section4Desc').textContent = 'Evaluation de la conformite aux Articles 8-17 pour les fournisseurs de systemes IA haut-risque.';
    }
}

// ============ VALIDATION ============
function validateSection(sectionId) {
    const section = document.getElementById('section-' + sectionId);
    if (!section) return true;

    // Check required fields
    const requiredRadios = {};
    section.querySelectorAll('input[required]').forEach(function(el) {
        if (el.type === 'radio') {
            requiredRadios[el.name] = true;
        } else if (el.type === 'text' || el.type === 'email') {
            if (!el.value.trim()) {
                highlightError(el);
                return false;
            }
        }
    });

    // Check required selects
    section.querySelectorAll('select[required]').forEach(function(el) {
        if (!el.value) {
            highlightError(el);
        }
    });

    // Check radio groups
    let valid = true;
    Object.keys(requiredRadios).forEach(function(name) {
        const checked = section.querySelector('[name="' + name + '"]:checked');
        if (!checked) {
            // Find the radio group and highlight
            const group = section.querySelector('[name="' + name + '"]');
            if (group) {
                const card = group.closest('.radio-card');
                if (card) {
                    const parent = card.parentElement;
                    if (parent) {
                        parent.style.outline = '2px solid var(--danger)';
                        parent.style.borderRadius = 'var(--radius)';
                        setTimeout(function() { parent.style.outline = 'none'; }, 3000);
                    }
                }
            }
            valid = false;
        }
    });

    // Special: Section 0 - check if excluded
    if (sectionId === '0') {
        const exclusion = getVal('q0_3bis');
        if (exclusion && exclusion !== 'aucun') {
            return false; // Don't proceed
        }
        const isAI = getVal('q0_4');
        if (isAI === 'non') {
            return false; // Don't proceed
        }
    }

    return valid;
}

function highlightError(el) {
    el.style.borderColor = 'var(--danger)';
    el.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.2)';
    setTimeout(function() {
        el.style.borderColor = '';
        el.style.boxShadow = '';
    }, 3000);
}

// ============ PROGRESS ============
function updateProgress() {
    const flow = buildFlow();
    const idx = flow.indexOf(currentSection);
    const total = flow.length;
    const pct = total > 1 ? Math.round((idx / (total - 1)) * 100) : 0;

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const remaining = document.getElementById('progressRemaining');

    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = 'Etape ' + (idx + 1) + ' / ' + total;
    if (remaining) {
        const left = total - idx - 1;
        remaining.textContent = left > 0 ? left + ' etape' + (left > 1 ? 's' : '') + ' restante' + (left > 1 ? 's' : '') : 'Derniere etape';
    }
}

// ============ PROFILE SIDEBAR ============
function updateProfileSidebar() {
    const role = effectiveRole || getVal('q0_1');
    const system = getVal('q0_2');
    const sector = getVal('q0_5');
    const country = getVal('q0_6');

    const roleNames = {
        'fournisseur': 'Fournisseur',
        'deployeur': 'Deployeur',
        'importateur': 'Importateur',
        'distributeur': 'Distributeur',
        'representant': 'Representant autorise',
        'autre': 'Autre'
    };
    const sectorNames = {
        'sante': 'Sante', 'finance': 'Finance', 'assurance': 'Assurance',
        'rh': 'RH/Recrutement', 'education': 'Education', 'law_enforcement': 'Law enforcement',
        'migration': 'Migration', 'admin_publique': 'Admin publique',
        'infrastructure': 'Infrastructure critique', 'produits_reglementes': 'Produits reglementes',
        'autre': 'Autre'
    };
    const countryNames = { 'ue': 'UE', 'eee': 'EEE', 'hors_ue': 'Hors UE' };

    setTextContent('profileRole', 'Role : ' + (roleNames[role] || '--'));
    setTextContent('profileSystem', 'Systeme : ' + (system || '--'));
    setTextContent('profileSector', 'Secteur : ' + (sectorNames[sector] || '--'));
    setTextContent('profileCountry', 'Marche : ' + (countryNames[country] || '--'));

    // Effective status
    const statusEl = document.getElementById('profileStatus');
    if (statusEl) {
        if (effectiveRole && effectiveRole !== getVal('q0_1')) {
            statusEl.textContent = 'Statut effectif : FOURNISSEUR (Art. 25)';
            statusEl.style.color = 'var(--danger)';
            statusEl.style.fontWeight = '600';
        } else {
            statusEl.textContent = 'Statut effectif : ' + (roleNames[role] || '--');
            statusEl.style.color = '';
            statusEl.style.fontWeight = '';
        }
    }

    // Classification
    const classEl = document.getElementById('profileClassification');
    const classText = document.getElementById('profileClassText');
    if (classEl && classText) {
        if (classification) {
            classEl.style.display = 'block';
            classText.textContent = classification;
            if (classification === 'INTERDIT') classText.style.color = 'var(--danger)';
            else if (classification === 'HAUT-RISQUE') classText.style.color = 'var(--warning)';
            else if (classification === 'RISQUE LIMITE') classText.style.color = 'var(--accent)';
            else classText.style.color = 'var(--success)';
        } else {
            classEl.style.display = 'none';
        }
    }
}

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ============ FLOATING RISK BADGE ============
function updateRiskBadge() {
    const badge = document.getElementById('floatingRiskBadge');
    const level = document.getElementById('riskLevel');
    if (!badge || !level) return;

    badge.className = 'floating-risk-badge';

    if (isProhibited) {
        level.textContent = 'INTERDIT';
        badge.classList.add('risk-prohibited');
        classification = 'INTERDIT';
    } else if (isHighRisk) {
        level.textContent = 'ELEVE';
        badge.classList.add('risk-high');
        classification = 'HAUT-RISQUE';
    } else {
        // Check if any concerning answers
        const concerns = checkAnnexIII();
        if (concerns.length > 0) {
            level.textContent = 'MOYEN';
            badge.classList.add('risk-medium');
            classification = 'A EVALUER';
        } else {
            level.textContent = 'FAIBLE';
            badge.classList.add('risk-low');
            classification = 'RISQUE LIMITE';
        }
    }
}

// ============ AUTOSAVE ============
function saveFormData() {
    const form = document.getElementById('questionnaireForm');
    if (!form) return;
    const data = {};

    form.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], select, textarea').forEach(function(el) {
        if (el.name) data[el.name] = el.value;
    });
    form.querySelectorAll('input[type="radio"]:checked').forEach(function(el) {
        data[el.name] = el.value;
    });
    const checkboxes = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach(function(el) {
        if (!checkboxes[el.name]) checkboxes[el.name] = [];
        checkboxes[el.name].push(el.value);
    });
    Object.assign(data, checkboxes);

    data._currentSection = currentSection;
    data._effectiveRole = effectiveRole;
    data._isHighRisk = isHighRisk;
    data._isProhibited = isProhibited;

    localStorage.setItem('complia_diagnostic', JSON.stringify(data));
}

function restoreFormData() {
    const saved = localStorage.getItem('complia_diagnostic');
    if (!saved) return false;
    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('questionnaireForm');
        if (!form) return false;
        let hasData = false;

        Object.keys(data).forEach(function(key) {
            if (key.startsWith('_')) return;
            const val = data[key];
            if (Array.isArray(val)) {
                val.forEach(function(v) {
                    const el = form.querySelector('input[name="' + key + '"][value="' + v + '"]');
                    if (el) { el.checked = true; hasData = true; }
                });
            } else {
                const el = form.querySelector('[name="' + key + '"]');
                if (el) {
                    if (el.type === 'radio') {
                        const radio = form.querySelector('input[name="' + key + '"][value="' + val + '"]');
                        if (radio) { radio.checked = true; hasData = true; }
                    } else {
                        el.value = val;
                        if (val) hasData = true;
                    }
                }
            }
        });

        if (hasData) {
            effectiveRole = data._effectiveRole || null;
            isHighRisk = !!data._isHighRisk;
            isProhibited = !!data._isProhibited;
            // Trigger change events to update conditional visibility
            form.querySelectorAll('input:checked, select').forEach(function(el) {
                el.dispatchEvent(new Event('change', { bubbles: true }));
            });
            return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

function clearAutoSave() {
    localStorage.removeItem('complia_diagnostic');
    location.reload();
}

// ============ COMPUTE RESULTS (SECTION 6) ============
function computeResults() {
    // Step 1: Classification
    if (isProhibited) {
        classification = 'INTERDIT';
    } else if (isHighRisk) {
        classification = 'HAUT-RISQUE';
    } else {
        // Check limited risk indicators
        const q51 = getVal('q5_1');
        const q53 = getVal('q5_3');
        if (q51 === 'oui' || q53 === 'oui') {
            classification = 'RISQUE LIMITE';
        } else {
            classification = 'RISQUE MINIMAL';
        }
    }

    // Step 2: Compliance scoring
    complianceScore = 0;
    complianceMax = 0;
    const details = [];
    const nonConformities = [];
    const recommendations = [];

    if (isProhibited) {
        renderProhibitedResults();
        return;
    }

    const role = effectiveRole || getVal('q0_1');

    if (isHighRisk) {
        if (role === 'deployeur') {
            // Deployer audit scoring
            const deployerQuestions = [
                { name: 'q4b_1', label: 'Utilisation conforme instructions', art: 'Art. 26(1)' },
                { name: 'q4b_2', label: 'Personnel supervision competent', art: 'Art. 26(2)' },
                { name: 'q4b_3', label: 'Monitoring operation', art: 'Art. 26(3)' },
                { name: 'q4b_4', label: 'Conservation logs & reporting', art: 'Art. 26(4)' },
                { name: 'q4b_5', label: 'Litteratie IA', art: 'Art. 4' },
                { name: 'q4b_6', label: 'FRIA (si applicable)', art: 'Art. 27' }
            ];

            deployerQuestions.forEach(function(q) {
                const val = getVal(q.name);
                complianceMax++;
                const isOk = val === 'oui' || val === 'na';
                if (isOk) complianceScore++;
                details.push({ label: q.label, ok: isOk, art: q.art });
                if (!isOk && val) {
                    nonConformities.push('NON-CONFORMITE ' + q.art + ' : ' + q.label);
                    recommendations.push('Corriger : ' + q.label + ' (' + q.art + ')');
                }
            });
        } else {
            // Provider audit scoring
            const providerQuestions = [
                { name: 'q4a_9_1', label: 'Risk Management System', art: 'Art. 9' },
                { name: 'q4a_9_3', label: 'Litteratie IA', art: 'Art. 4' },
                { name: 'q4a_10_1', label: 'Qualite donnees entrainement', art: 'Art. 10' },
                { name: 'q4a_10_2', label: 'Analyse des biais', art: 'Art. 10' },
                { name: 'q4a_10_3', label: 'Datasheets/documentation donnees', art: 'Art. 10' },
                { name: 'q4a_13_1', label: 'Instructions d\'utilisation', art: 'Art. 13' },
                { name: 'q4a_13_2', label: 'Documentation technique (Annexe IV)', art: 'Art. 11' },
                { name: 'q4a_14_1', label: 'Interfaces supervision humaine', art: 'Art. 14' },
                { name: 'q4a_14_2', label: '5 capacites supervision (Art. 14(4))', art: 'Art. 14' },
                { name: 'q4a_15_1', label: 'Exactitude & metriques', art: 'Art. 15' },
                { name: 'q4a_15_2', label: 'Robustesse & cybersecurite', art: 'Art. 15' },
                { name: 'q4a_17_1', label: 'Quality Management System', art: 'Art. 17' },
                { name: 'q4a_17_2', label: 'Conformity Assessment', art: 'Art. 43' },
                { name: 'q4a_17_3', label: 'Post-market monitoring', art: 'Art. 72' },
                { name: 'q4a_17_4', label: 'Record-keeping (logs)', art: 'Art. 12' }
            ];

            // Count risk management sub-items
            const rmsItems = getCheckedValues('q4a_9_2');
            complianceMax += 4;
            complianceScore += rmsItems.length;
            if (rmsItems.length < 4) {
                nonConformities.push('NON-CONFORMITE Art. 9(2) : ' + (4 - rmsItems.length) + ' etape(s) obligatoire(s) manquante(s)');
                recommendations.push('Completer le Risk Management System (Art. 9(2)) - ' + (4 - rmsItems.length) + ' etape(s) manquante(s)');
            }
            details.push({ label: 'Etapes RMS (Art. 9(2))', ok: rmsItems.length >= 4, art: 'Art. 9' });

            providerQuestions.forEach(function(q) {
                const val = getVal(q.name);
                complianceMax++;
                const isOk = val === 'oui' || val === 'na';
                if (isOk) complianceScore++;
                details.push({ label: q.label, ok: isOk, art: q.art });
                if (!isOk && val) {
                    nonConformities.push('NON-CONFORMITE ' + q.art + ' : ' + q.label);
                    recommendations.push('Corriger : ' + q.label + ' (' + q.art + ')');
                }
            });
        }
    }

    // Limited risk scoring
    if (!isHighRisk) {
        const limitedQuestions = [
            { name: 'q5_2', label: 'Marquage contenu synthetique', art: 'Art. 50(2)', cond: function() { return getVal('q5_1') === 'oui'; } },
            { name: 'q5_4', label: 'Transparence interaction IA', art: 'Art. 50(1)', cond: function() { return getVal('q5_3') === 'oui'; } },
            { name: 'q5_5', label: 'Safeguards contre utilisations interdites', art: 'Art. 50(3)', cond: function() { return true; } }
        ];

        limitedQuestions.forEach(function(q) {
            if (!q.cond()) return;
            const val = getVal(q.name);
            complianceMax++;
            const isOk = val === 'oui';
            if (isOk) complianceScore++;
            details.push({ label: q.label, ok: isOk, art: q.art });
            if (!isOk && val) {
                nonConformities.push('NON-CONFORMITE ' + q.art + ' : ' + q.label);
                recommendations.push('Corriger : ' + q.label + ' (' + q.art + ')');
            }
        });
    }

    // Always add generic recommendations based on classification
    if (isHighRisk && recommendations.length === 0) {
        recommendations.push('Effectuer un audit complet de conformite avec un expert EU AI Act');
        recommendations.push('Etablir la documentation technique complete (Annexe IV)');
        recommendations.push('Mettre en place un Quality Management System (Art. 17)');
    }

    if (classification === 'RISQUE LIMITE') {
        if (recommendations.length === 0) {
            recommendations.push('Verifier la transparence de vos systemes IA (Art. 50)');
            recommendations.push('Implementer des safeguards contre les utilisations interdites');
        }
    }

    renderResults(details, nonConformities, recommendations);
}

function renderProhibitedResults() {
    classification = 'INTERDIT';

    // Badge
    const badge = document.getElementById('resultBadge');
    badge.textContent = 'INTERDIT - Article 5';
    badge.className = 'result-badge prohibited';

    setTextContent('resultClassDesc', 'Votre systeme releve des pratiques interdites par l\'Article 5 du Reglement (UE) 2024/1689. Sa commercialisation et son deploiement sont impossibles dans l\'UE. Amende potentielle : jusqu\'a 35 millions EUR ou 7% du CA mondial.');

    // Score
    setTextContent('scoreValue', '0');
    setTextContent('scoreDesc', 'Systeme interdit - conformite impossible');
    const barFill = document.getElementById('scoreBarFill');
    if (barFill) { barFill.style.width = '0%'; barFill.style.background = 'var(--danger)'; }

    // Hide detail sections
    hide('resultDetails');
    hide('resultNonConf');
    setTextContent('recommendationsList', '');
    const recList = document.getElementById('recommendationsList');
    if (recList) {
        recList.innerHTML = '<li>Cesser immediatement toute utilisation du systeme dans l\'UE</li><li>Consulter un juriste specialise en EU AI Act</li><li>Evaluer la possibilite de modifier le systeme pour supprimer les fonctionnalites interdites</li>';
    }

    updateRiskBadge();
}

function renderResults(details, nonConformities, recommendations) {
    // Classification badge
    const badge = document.getElementById('resultBadge');
    const classNames = {
        'HAUT-RISQUE': 'high-risk',
        'RISQUE LIMITE': 'limited-risk',
        'RISQUE MINIMAL': 'minimal-risk'
    };
    badge.textContent = classification;
    badge.className = 'result-badge ' + (classNames[classification] || 'limited-risk');

    // Classification description
    const descriptions = {
        'HAUT-RISQUE': 'Votre systeme est classe HAUT-RISQUE au sens de l\'Article 6 du Reglement. ' + (highRiskSources.length > 0 ? 'Sources : ' + highRiskSources.join(', ') + '.' : '') + ' Des obligations de conformite strictes s\'appliquent (Articles 8-17).',
        'RISQUE LIMITE': 'Votre systeme est classe a RISQUE LIMITE. Les obligations de transparence de l\'Article 50 s\'appliquent.',
        'RISQUE MINIMAL': 'Votre systeme est classe a RISQUE MINIMAL. Aucune obligation specifique du Reglement ne s\'applique, mais les bonnes pratiques sont recommandees.'
    };
    setTextContent('resultClassDesc', descriptions[classification] || '');

    // Score
    const pct = complianceMax > 0 ? Math.round((complianceScore / complianceMax) * 100) : 0;
    setTextContent('scoreValue', pct);
    setTextContent('scoreLabel', '/ 100');

    const barFill = document.getElementById('scoreBarFill');
    if (barFill) {
        barFill.style.width = pct + '%';
        if (pct >= 80) barFill.style.background = 'var(--success)';
        else if (pct >= 60) barFill.style.background = 'var(--warning)';
        else barFill.style.background = 'var(--danger)';
    }

    if (pct >= 95) setTextContent('scoreDesc', 'CONFORME - Systeme pret pour la commercialisation');
    else if (pct >= 80) setTextContent('scoreDesc', 'PARTIELLEMENT CONFORME - Gaps mineurs a combler');
    else if (pct >= 60) setTextContent('scoreDesc', 'NON-CONFORMITE MODEREE - Actions correctives requises');
    else setTextContent('scoreDesc', 'NON-CONFORMITE GRAVE - Mise en conformite urgente requise');

    // Details grid
    const grid = document.getElementById('detailGrid');
    if (grid) {
        grid.innerHTML = '';
        details.forEach(function(d) {
            const item = document.createElement('div');
            item.className = 'detail-item';
            item.innerHTML = '<span class="label">' + d.label + '</span><span class="value ' + (d.ok ? 'ok' : 'fail') + '">' + (d.ok ? 'Conforme' : 'Non conforme') + '</span>';
            grid.appendChild(item);
        });
        if (details.length > 0) show('resultDetails');
        else hide('resultDetails');
    }

    // Non-conformities
    const ncList = document.getElementById('nonConfList');
    if (ncList) {
        ncList.innerHTML = '';
        nonConformities.forEach(function(nc) {
            const li = document.createElement('li');
            li.textContent = nc;
            ncList.appendChild(li);
        });
        if (nonConformities.length > 0) show('resultNonConf');
        else hide('resultNonConf');
    }

    // Recommendations
    const recList = document.getElementById('recommendationsList');
    if (recList) {
        recList.innerHTML = '';
        recommendations.forEach(function(r) {
            const li = document.createElement('li');
            li.textContent = r;
            recList.appendChild(li);
        });
    }

    updateRiskBadge();
}

// ============ EMAIL GATE & UNLOCK ============
function unlockReport() {
    const prenom = document.getElementById('gatePrenom');
    const email = document.getElementById('gateEmail');

    if (!prenom || !email) return;
    if (!prenom.value.trim()) { highlightError(prenom); return; }
    if (!email.value.trim() || !email.value.includes('@')) { highlightError(email); return; }

    // Hide gate, show full report
    hide('emailGate');
    show('fullReport');

    // Generate personalized offer
    generateOffer();
}

function generateOffer() {
    const role = effectiveRole || getVal('q0_1');
    const pct = complianceMax > 0 ? Math.round((complianceScore / complianceMax) * 100) : 50;
    const invertedScore = 100 - pct; // Higher = more work needed

    const ctaContent = document.getElementById('ctaContent');
    if (!ctaContent) return;

    let offerName = '';
    let offerPrice = '';
    let offerDesc = '';

    if (invertedScore < 20) {
        offerName = 'Veille Reglementaire';
        offerPrice = '190 EUR/mois';
        offerDesc = 'Restez informe des evolutions du Reglement et maintenez votre conformite.';
    } else if (invertedScore < 45) {
        offerName = 'Diagnostic Flash';
        offerPrice = '990 EUR';
        offerDesc = 'Audit rapide avec plan d\'action priorise pour combler vos gaps.';
    } else if (invertedScore < 70 && role === 'deployeur') {
        offerName = 'Pack Conformite Deployeur';
        offerPrice = '3 990 EUR';
        offerDesc = 'Accompagnement complet : FRIA, formation personnel, mise en conformite Article 26.';
    } else if (invertedScore < 70 && (role === 'fournisseur' || effectiveRole === 'fournisseur')) {
        offerName = 'Roadmap Conformite Fournisseur';
        offerPrice = '6 990 EUR';
        offerDesc = 'Plan de mise en conformite Articles 8-17, documentation technique et QMS.';
    } else if (role === 'fournisseur' || effectiveRole === 'fournisseur') {
        offerName = 'Conformite Fournisseur Complete';
        offerPrice = 'A partir de 35 000 EUR';
        offerDesc = 'Accompagnement integral : RMS, documentation technique Annexe IV, QMS, Conformity Assessment, marquage CE.';
    } else {
        offerName = 'Pack Conformite+';
        offerPrice = '6 990 EUR';
        offerDesc = 'Mise en conformite complete adaptee a votre profil et votre niveau de risque.';
    }

    ctaContent.innerHTML =
        '<div class="cta-offer">' +
        '<div class="cta-name">' + offerName + '</div>' +
        '<div class="cta-price">' + offerPrice + '</div>' +
        '<div class="cta-desc">' + offerDesc + '</div>' +
        '</div>' +
        '<div style="margin-top:16px;">' +
        '<a href="mailto:contact@complia.fr?subject=Demande%20' + encodeURIComponent(offerName) + '" class="btn-primary" style="text-decoration:none;display:inline-flex;">Demander un devis</a>' +
        '</div>';

    // Update price comparator
    const priceComplia = document.getElementById('priceComplia');
    if (priceComplia) priceComplia.textContent = offerPrice;
}

// ============ PREFERS COLOR SCHEME ============
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        const saved = localStorage.getItem('complia_darkmode');
        if (!saved) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggleDarkIcons(true);
            } else {
                document.documentElement.removeAttribute('data-theme');
                toggleDarkIcons(false);
            }
        }
    });
}
