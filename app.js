
let state = {
    onboarded: false,
    name: "Financially Healing Homie",
    age: 23,
    income: 65000,
    expenses: 30000,
    debts: 45000,
    savings: 72000,
    investments: 105000,
    riskComfort: "moderate",
    goal: "fire",
    bestieMode: "chaos",
    language: "en",
    theme: "dark",
    streak: 3,
    xp: 750,
    badges: ["onboarded", "first-investment"],
    jars: [
        { id: 1, name: "✨ Emergency Shield", target: 180000, current: 72000, category: "emergency" },
        { id: 2, name: "🏝️ Bali Vibes Fund", target: 350000, current: 45000, category: "travel" }
    ],
    lastSavingsLog: new Date().toISOString()
};

window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initApp();
});

function loadState() {
    const saved = localStorage.getItem('ploutos_state');
    if (saved) {
        try {
            state = { ...state, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Error parsing saved state, resetting to default.", e);
        }
    }
}

function saveState() {
    localStorage.setItem('ploutos_state', JSON.stringify(state));
}

let currentOnboardStep = 1;
function nextOnboardStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(el => el.classList.remove('active'));
    
    if (step === 2) {
        state.name = document.getElementById('onboardName').value || state.name;
        state.age = parseInt(document.getElementById('onboardAge').value) || state.age;
        document.getElementById('onboardStep2').classList.add('active');
    } else if (step === 3) {
        state.income = parseFloat(document.getElementById('onboardIncome').value) || state.income;
        state.expenses = parseFloat(document.getElementById('onboardExpenses').value) || state.expenses;
        state.debts = parseFloat(document.getElementById('onboardDebts').value) || state.debts;
        document.getElementById('onboardStep3').classList.add('active');
    }
    currentOnboardStep = step;
}

function prevOnboardStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(el => el.classList.remove('active'));
    if (step === 1) {
        document.getElementById('onboardStep1').classList.add('active');
    } else if (step === 2) {
        document.getElementById('onboardStep2').classList.add('active');
    }
    currentOnboardStep = step;
}

function selectRisk(risk) {
    state.riskComfort = risk;
    document.querySelectorAll('#onboardStep3 .option-card').forEach(el => el.classList.remove('selected'));
    if (risk === 'conservative') document.getElementById('risk-con').classList.add('selected');
    if (risk === 'moderate') document.getElementById('risk-mod').classList.add('selected');
    if (risk === 'degenerate') document.getElementById('risk-degen').classList.add('selected');
}

function finishOnboarding() {
    state.goal = document.getElementById('onboardGoal').value;
    state.bestieMode = document.getElementById('onboardBestie').value;
    
    document.querySelectorAll('.onboarding-step').forEach(el => el.classList.remove('active'));
    document.getElementById('onboardLoader').classList.add('active');
    
    const loaderPhrases = [
        "Analyzing caffeine dependency...",
        "Roasting late-night Amazon orders...",
        "Calculating emotional damage...",
        "Configuring financial situationship status...",
        "Generating compounding multiverse..."
    ];
    
    let phraseIdx = 0;
    const interval = setInterval(() => {
        if (phraseIdx < loaderPhrases.length) {
            document.getElementById('loaderSubtext').innerText = loaderPhrases[phraseIdx++];
        }
    }, 900);
    
    setTimeout(() => {
        clearInterval(interval);
        state.onboarded = true;
        saveState();
        document.getElementById('onboardingOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('onboardingOverlay').style.display = 'none';
        }, 500);
        initApp();
        triggerToast("Welcome Aboard!", "Your financial timeline has been structured.", "fa-wand-magic-sparkles");
    }, 4500);
}

function switchTab(tabId, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    
    const links = document.querySelectorAll('.sidebar .nav-item');
    links.forEach(link => {
        const onClickAttr = link.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(tabId)) {
            link.classList.add('active');
        }
    });

    if (tabId === 'calculators') {
        setTimeout(() => {
            initCalculatorsCharts();
            runScenarioSimulation();
        }, 100);
    }
}

function setTheme(theme) {
    state.theme = theme;
    saveState();
    
    document.body.className = '';
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    
    if (theme === 'light') {
        document.body.classList.add('theme-light');
        document.getElementById('themeBtnLight').classList.add('active');
    } else if (theme === 'intervention') {
        document.body.classList.add('theme-intervention');
        document.getElementById('themeBtnIntervene').classList.add('active');
        triggerToast("AI Intervention Mode Active", "Calming theme loaded to reduce financial anxiety. Take a deep breath.", "fa-heart");
    } else {
        document.body.classList.add('theme-dark');
        document.getElementById('themeBtnDark').classList.add('active');
    }
}

function getLifeStage() {
    const age = state.age;
    const income = state.income;
    const debts = state.debts;

    if (age >= 13 && age <= 18) {
        return {
            stage: "teen",
            title: "Teen Explorer 🐣",
            focus: "Saving habits & financial education"
        };
    } else if (age > 18 && age <= 22) {
        return {
            stage: "college",
            title: "Early Earner / Student 🎓",
            focus: "Budget control & starting small SIPs"
        };
    } else if (age > 22 && age <= 35) {
        if (debts > income * 10) {
            return {
                stage: "stability",
                title: "Stability Planner (Accelerated) 🛡️",
                focus: "Debt crunching & wealth protection"
            };
        }
        return {
            stage: "wealth",
            title: "Wealth Builder 🚀",
            focus: "Aggressive investing & career growth"
        };
    } else if (age > 35 && age <= 50) {
        return {
            stage: "stability",
            title: "Stability Planner 🛡️",
            focus: "Family protection, loans & passive growth"
        };
    } else {
        return {
            stage: "retired",
            title: "Retirement Strategist 👴",
            focus: "Safe withdrawals & legacy planning"
        };
    }
}

function renderLifeStageModules() {
    const stageInfo = getLifeStage();
    const container = document.getElementById('lifeStageModuleContainer');
    let html = '';

    if (stageInfo.stage === 'teen') {
        html = `
            <div class="dashboard-grid">
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">💵 Pocket Money Tracker</span></div>
                    <div>
                        <div style="font-size: 24px; font-weight:700;">Current Balance: ₹1,200</div>
                        <p style="font-size:11px; color:var(--text-muted); margin-top:5px;">Estimated save target: ₹50/week</p>
                    </div>
                    <button class="btn btn-primary" onclick="claimXP(50)" style="font-size:11px; padding: 6px; margin-top:auto;">Log ₹100 Saved! (+50 XP)</button>
                </div>
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">🎮 Future Wealth Simulator</span></div>
                    <p style="font-size:11px; color:var(--text-muted); margin-top:-5px;">See how much you will have at age 40 if you start investing ₹500/month at age 18 (at 12% returns).</p>
                    <div style="font-size:18px; font-weight:700; color:var(--aura-stable); margin-top:5px;" id="teenSimulatorVal">₹15,42,000!</div>
                    <p style="font-size:9px; color:var(--text-muted); margin-top:2px;">Formula: A = P * ((1 + r/n)^(nt) - 1) * (1 + r/n) / (r/n)</p>
                </div>
            </div>
        `;
    } else if (stageInfo.stage === 'college') {
        html = `
            <div class="dashboard-grid">
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">🍿 Subscription Analyzer</span></div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px;">
                            <span>Netflix + Spotify + Prime</span>
                            <strong>₹649/month</strong>
                        </div>
                        <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px;">
                            <div style="width: 80%; background:#ef4444; height:100%;"></div>
                        </div>
                        <p style="font-size:11px; color:var(--text-muted); font-style:italic;">"Reducing 1 unused sub saves ₹150/month = ₹1,800/yr."</p>
                    </div>
                </div>
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">💡 Side Hustle Suggestions</span></div>
                    <ul style="font-size:11px; color:var(--text-muted); padding-left:15px; display:flex; flex-direction:column; gap:4px;">
                        <li>Freelance copywriting/design (Earns ₹5k-15k/mo)</li>
                        <li>Micro-internships / tutoring online</li>
                        <li>Digital template creations (Notion, Figma)</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (stageInfo.stage === 'wealth') {
        html = `
            <div class="dashboard-grid">
                <div class="dashboard-card glass-panel card-span-4">
                    <div class="card-header"><span class="card-title">💰 Salary Allocation AI</span></div>
                    <div style="font-size:12px; display:flex; flex-direction:column; gap:8px;">
                        <div>Necessities (50%): <strong>₹` + Math.round(state.income * 0.5) + `</strong></div>
                        <div>Investments (30%): <strong style="color:var(--aura-stable);">₹` + Math.round(state.income * 0.3) + `</strong></div>
                        <div>Wants (20%): <strong style="color:#f472b6;">₹` + Math.round(state.income * 0.2) + `</strong></div>
                    </div>
                </div>
                <div class="dashboard-card glass-panel card-span-4">
                    <div class="card-header"><span class="card-title">🔥 FIRE Roadmap</span></div>
                    <div style="font-size:12px;">
                        <div>Target FIRE Corpus: <strong>₹3,00,00,000</strong></div>
                        <div>Years to retire at 40: <strong>` + Math.max(0, 40 - state.age) + ` Years</strong></div>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:5px;">Based on saving ₹` + Math.round((state.income - state.expenses) * 0.6) + `/month at 12% compounding.</p>
                    </div>
                </div>
                <div class="dashboard-card glass-panel card-span-4">
                    <div class="card-header"><span class="card-title">🛡️ Tax Optimization</span></div>
                    <p style="font-size:11px; color:var(--text-muted);">Max out Section 80C (PPF, ELSS) to save up to ₹46,800 in taxes annually.</p>
                    <button class="btn btn-secondary" onclick="switchTab('coach')" style="font-size:10px; padding: 4px; margin-top:auto;">Ask AI Coach about ELSS</button>
                </div>
            </div>
        `;
    } else if (stageInfo.stage === 'stability') {
        html = `
            <div class="dashboard-grid">
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">🏡 Home Loan payoff AI</span></div>
                    <p style="font-size:11px; color:var(--text-muted);">Prepaying just 1 extra EMI annually reduces loan tenure from 20 years to 16 years, saving ₹18,00,000 in interest!</p>
                    <button class="btn btn-primary" onclick="switchTab('calculators')" style="font-size:11px; padding: 6px; margin-top:auto;">Calculate Payoff Timeline</button>
                </div>
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">👨‍👩‍👧 Family Wealth Preservation</span></div>
                    <ul style="font-size:11px; color:var(--text-muted); padding-left:15px; display:flex; flex-direction:column; gap:4px;">
                        <li>Ensure Term Insurance cover is at least 15x annual salary.</li>
                        <li>Health insurance top-ups for parents/children.</li>
                        <li>Child education fund inflation target: 8% per annum.</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="dashboard-grid">
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">🏖️ Withdrawal Planner (4% Rule)</span></div>
                    <div style="font-size:12px;">
                        <div>Safe monthly withdrawal: <strong style="color:var(--aura-stable);">₹` + Math.round((state.savings + state.investments) * 0.04 / 12) + `</strong></div>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:5px;">Based on ₹` + (state.savings + state.investments).toLocaleString() + ` net savings. Your funds will safely last until age 88.</p>
                    </div>
                </div>
                <div class="dashboard-card glass-panel card-span-6">
                    <div class="card-header"><span class="card-title">🩺 Healthcare Budget & Estate</span></div>
                    <p style="font-size:11px; color:var(--text-muted);">Allocate 20% of passive cash flow to high-yield senior healthcare insurance riders.</p>
                    <button class="btn btn-secondary" onclick="switchTab('coach')" style="font-size:11px; padding:4px; margin-top:auto;"><i class="fa-solid fa-microphone"></i> Start Voice Consultation</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function initApp() {
    if (!state.onboarded) {
        document.getElementById('onboardingOverlay').style.display = 'flex';
        return;
    } else {
        document.getElementById('onboardingOverlay').style.display = 'none';
    }

    document.getElementById('welcomeUser').innerText = "Welcome back, " + state.name + "!";
    const stageInfo = getLifeStage();
    document.getElementById('timeGreeting').innerText = "Life Stage: " + stageInfo.title + " | Focus: " + stageInfo.focus;
    document.getElementById('activeBestieName').innerText = getBestieDisplayName(state.bestieMode);
    document.getElementById('activeBestieBadge').innerHTML = getBestieBadgeIcon(state.bestieMode) + " " + getBestieDisplayName(state.bestieMode);
    document.getElementById('streakCount').innerText = state.streak + " Days";
    document.getElementById('streakDaysCountBadge').innerHTML = "<i class='fa-solid fa-fire'></i> " + state.streak + " Day Streak";
    document.getElementById('userXPDisplay').innerText = state.xp;

    document.getElementById('profileName').value = state.name;
    document.getElementById('profileAge').value = state.age;
    document.getElementById('profileIncome').value = state.income;
    document.getElementById('profileExpenses').value = state.expenses;
    document.getElementById('profileDebts').value = state.debts;
    document.getElementById('profileSavings').value = state.savings;
    document.getElementById('profileInvestments').value = state.investments;
    document.getElementById('profileRisk').value = state.riskComfort;

    setTheme(state.theme);
    renderLifeStageModules();
    updateFinancialDashboard();
    initCoachPersonalitiesList();
    renderJarsList();
    updateCreditAndRiskInfo();
    initCharts();
}

function getBestieDisplayName(mode) {
    const modes = {
        chaos: "Chaos Gremlin",
        rich: "Rich Bestie",
        gym: "Gym Bro Investor",
        therapist: "Soft Therapist",
        villain: "Corporate Villain",
        delulu: "Delulu Motivator",
        parent: "Strict Indian Parent"
    };
    return modes[mode] || "Chaos Gremlin";
}

function getBestieBadgeIcon(mode) {
    const icons = {
        chaos: "<i class='fa-solid fa-ghost'></i>",
        rich: "<i class='fa-solid fa-gem'></i>",
        gym: "<i class='fa-solid fa-dumbbell'></i>",
        therapist: "<i class='fa-solid fa-hand-holding-heart'></i>",
        villain: "<i class='fa-solid fa-user-tie'></i>",
        delulu: "<i class='fa-solid fa-wand-magic-sparkles'></i>",
        parent: "<i class='fa-solid fa-skull'></i>"
    };
    return icons[mode] || "<i class='fa-solid fa-ghost'></i>";
}

function calculateFinancialHealthScore() {
    const savingsRate = ((state.income - state.expenses) / state.income) * 100;
    const debtRatio = (state.debts / (state.income || 1));
    const efCoverage = state.savings / (state.expenses || 1);
    const investmentRatio = state.investments / (state.income * 12 || 1);

    let score = 50;

    if (savingsRate > 40) score += 20;
    else if (savingsRate > 20) score += 12;
    else if (savingsRate > 5) score += 5;
    else score -= 10;

    if (debtRatio > 5) score -= 20;
    else if (debtRatio > 2) score -= 12;
    else if (debtRatio > 0.5) score -= 5;
    else score += 10;

    if (efCoverage >= 6) score += 15;
    else if (efCoverage >= 3) score += 10;
    else if (efCoverage >= 1) score += 5;
    else score -= 10;

    if (investmentRatio > 0.5) score += 15;
    else if (investmentRatio > 0.1) score += 8;

    score = Math.max(10, Math.min(100, Math.round(score)));

    let title = "Decent but Suspicious";
    let desc = "Your allocations are acceptable, but you're one late-night Amazon browse session away from complete financial collapse.";

    if (score >= 85) {
        title = "Financial Main Character";
        desc = "Your compounding is literally obsessed with you. You make responsible choices that make bankers cry.";
    } else if (score >= 65) {
        title = "Healing Wallet Era";
        desc = "Character development! You are building safety, but still order Zomato 5 times a week. We notice.";
    } else if (score >= 45) {
        title = "Surviving on Vibes";
        desc = "Current status: ₹183 in your account and a load of aesthetic hopes. It's complicated, homie.";
    } else {
        title = "Capitalism's Favorite Sugar Baby";
        desc = "You're funding the corporate boardroom's next vacation. Let's stabilize before you buy another skincare haul.";
    }

    return { score, title, desc };
}

function updateFinancialDashboard() {
    const health = calculateFinancialHealthScore();
    document.getElementById('scoreNum').innerText = health.score;
    document.getElementById('scoreTitle').innerText = health.title;
    document.getElementById('scoreDescription').innerText = health.desc;
    
    const canvas = document.getElementById('scoreCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.stroke();
    
    const pct = health.score / 100;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI/2, (-Math.PI/2) + (2 * Math.PI * pct), false);
    ctx.lineWidth = 6;
    
    let color = '#ef4444';
    if (health.score >= 80) color = '#10b981';
    else if (health.score >= 60) color = '#8b5cf6';
    else if (health.score >= 40) color = '#f59e0b';
    
    ctx.strokeStyle = color;
    ctx.stroke();

    const assetsVal = state.savings + state.investments;
    const liabilitiesVal = state.debts;
    const netWorth = assetsVal - liabilitiesVal;
    
    document.getElementById('netWorthDisplay').innerText = "₹" + netWorth.toLocaleString('en-IN');
    document.getElementById('nwAssets').innerText = "₹" + assetsVal.toLocaleString('en-IN');
    document.getElementById('nwLiabilities').innerText = "₹" + liabilitiesVal.toLocaleString('en-IN');
    
    const pctAssets = assetsVal > 0 ? (netWorth / assetsVal) * 100 : 100;
    document.getElementById('nwProgressBar').style.width = Math.max(5, Math.min(100, pctAssets)) + "%";

    updateAuraIndicator(health.score, netWorth);
    updateBurnRateWidget();
    updateVillainWidget();
}

function updateAuraIndicator(score, netWorth) {
    const indicator = document.getElementById('auraIndicator');
    const label = document.getElementById('auraLabel');
    const quote = document.getElementById('auraQuote');

    const savingsRate = ((state.income - state.expenses) / state.income) * 100;

    let emoji = "😎";
    let text = "Stable Aura";
    let quoteText = "You saved more than you spent. Capitalism is crying.";
    let color = '#10b981';

    if (netWorth > 1000000 && score > 80) {
        emoji = "👑";
        text = "Main Character Wealth";
        quoteText = "Compounding is literally writing love letters to your bank account.";
        color = '#f59e0b';
    } else if (savingsRate < 5 && state.expenses > state.income * 0.9) {
        emoji = "🫠";
        text = "Vibrations-Only Aura";
        quoteText = "Current status: surviving on vibes and hope. Please skip Zomato today.";
        color = '#ef4444';
    } else if (state.goal === 'fire' && state.investments > 200000 && state.riskComfort === 'degenerate') {
        emoji = "🦄";
        text = "Delusional Investor Aura";
        quoteText = "You simulated early retirement 18 times today. Take a walk outside.";
        color = '#3b82f6';
    } else if (score < 50 || savingsRate < 15) {
        emoji = "💀";
        text = "Chaotic Budgeting Aura";
        quoteText = "That Starbucks coffee gave you 3 minutes of joy and delayed retirement by 2 business days.";
        color = '#d946ef';
    }

    indicator.innerText = emoji;
    label.innerText = text;
    quote.innerText = quoteText;
    indicator.style.background = color;
    indicator.style.boxShadow = "0 0 20px " + color;
}

function updateBurnRateWidget() {
    const dailyExpenses = Math.round(state.expenses / 30);
    const daysSurvive = dailyExpenses > 0 ? Math.round(state.savings / dailyExpenses) : 999;
    
    document.getElementById('burnDaysText').innerText = daysSurvive + " Days";
    document.getElementById('burnSubtext').innerText = "At your average spending speed of ₹" + dailyExpenses.toLocaleString() + "/day";
    
    const warning = document.getElementById('burnWarning');
    if (daysSurvive < 10) {
        warning.innerHTML = "<i class='fa-solid fa-triangle-exclamation' style='color:#ef4444'></i> Warning: High risk of financial crash before payday.";
        warning.style.color = '#ef4444';
        
        if (daysSurvive < 5 && state.theme !== 'intervention') {
            setTimeout(() => {
                setTheme('intervention');
            }, 3000);
        }
    } else if (daysSurvive < 20) {
        warning.innerText = "Warning: Payday is 18 days away. High risk of vibrations-only nutrition.";
        warning.style.color = 'var(--text-muted)';
    } else {
        warning.innerHTML = "<i class='fa-solid fa-circle-check' style='color:var(--aura-stable)'></i> Safe cushion. Your bank account is breathing comfortably.";
        warning.style.color = 'var(--text-muted)';
    }
}

function updateVillainWidget() {
    const roast = document.getElementById('villainRoast');
    const risk = state.riskComfort;
    if (risk === 'degenerate') {
        roast.innerText = ""Crypto options trading is literally your financial arch-nemesis this month."";
    } else if (state.expenses > state.income * 0.7) {
        roast.innerText = ""Rent and food delivery are eating 80% of your earnings. You're basically funding Zomato's HQ expansion."";
    } else {
        roast.innerText = ""You ignored the urge to buy nonsense today. The economy hates to see you improving."";
    }
}

function updateCreditAndRiskInfo() {
    const container = document.getElementById('riskFlagsContainer');
    let flags = [];

    const savingsRate = ((state.income - state.expenses) / state.income) * 100;
    const debtRatio = (state.debts / state.income);
    const efCoverage = state.savings / (state.expenses || 1);

    if (savingsRate < 10) {
        flags.push({ label: "Low Savings Rate", severity: "high", desc: "Saving under 10% of monthly earnings." });
    }
    if (debtRatio > 3) {
        flags.push({ label: "Excessive Debt Leverage", severity: "high", desc: "Total debt is 3x higher than monthly income." });
    }
    if (efCoverage < 3) {
        flags.push({ label: "Low Emergency Shield", severity: "medium", desc: "Emergency savings cover less than 3 months of expenses." });
    }
    if (state.investments < 20000 && state.age > 24) {
        flags.push({ label: "Inflation Risk", severity: "medium", desc: "Cash is sitting in bank accounts losing value to inflation." });
    }
    if (state.riskComfort === 'degenerate') {
        flags.push({ label: "Poor Diversification", severity: "medium", desc: "Risk tolerance is set to Degenerate. High exposure." });
    }
    
    if (flags.length === 0) {
        flags.push({ label: "No Major Risk Flags", severity: "low", desc: "Financial vitals are stable. You are locked in." });
    }

    container.innerHTML = flags.map(f => {
        let color = 'var(--aura-stable)';
        if (f.severity === 'high') color = '#ef4444';
        if (f.severity === 'medium') color = '#f59e0b';
        return `
            <div style="font-size:11px; padding: 6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border-left:3px solid ` + color + `;Prefix">
                <strong style="color:` + color + `; font-weight:700;">` + f.label + `</strong>
                <p style="color:var(--text-muted); font-size:9px; margin-top:2px;">` + f.desc + `</p>
            </div>
        `;
    }).join('');
}

function renderJarsList() {
    const container = document.getElementById('jarsContainer');
    if (!container) return;

    if (state.jars.length === 0) {
        container.innerHTML = `<div style="grid-column: span 3; text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">No active jars. Create one above to track targets!</div>`;
        return;
    }

    container.innerHTML = state.jars.map(jar => {
        const pct = Math.min(100, Math.round((jar.current / jar.target) * 100));
        return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--panel-border); padding: 20px; border-radius: var(--border-radius-md); display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:14px; font-weight:700;">` + jar.name + `</strong>
                    <button onclick="deleteJar(` + jar.id + `)" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:14px;"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="color:var(--text-muted);">₹` + jar.current.toLocaleString() + ` saved</span>
                    <span style="font-weight:700;">` + pct + `% of ₹` + jar.target.toLocaleString() + `</span>
                </div>
                <div style="width:100%; height:8px; background:var(--input-bg); border-radius:4px; overflow:hidden;">
                    <div style="width: ` + pct + `%; background:linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); height:100%;"></div>
                </div>
                <div style="display:flex; gap:8px; margin-top:5px;">
                    <button class="btn btn-secondary" onclick="addJarFunds(` + jar.id + `, 1000)" style="font-size:10px; padding: 4px 8px; flex:1;">+₹1,000</button>
                    <button class="btn btn-secondary" onclick="addJarFunds(` + jar.id + `, 5000)" style="font-size:10px; padding: 4px 8px; flex:1;">+₹5,000</button>
                </div>
            </div>
        `;
    }).join('');
}

function openNewJarModal() {
    document.getElementById('jarModal').style.display = 'flex';
}

function closeNewJarModal() {
    document.getElementById('jarModal').style.display = 'none';
}

function createJar() {
    const name = document.getElementById('jarName').value || "Unnamed Goal";
    const target = parseFloat(document.getElementById('jarTarget').value) || 0;
    const current = parseFloat(document.getElementById('jarCurrent').value) || 0;

    if (target <= 0) {
        alert("Please enter a target amount larger than 0!");
        return;
    }

    const newJar = {
        id: Date.now(),
        name,
        target,
        current,
        category: "other"
    };

    state.jars.push(newJar);
    saveState();
    closeNewJarModal();
    renderJarsList();
    initApp();
    triggerToast("Savings Jar Created", '"' + name + '" jar is open. Keep feeding it.', "fa-jar");
}

function deleteJar(id) {
    state.jars = state.jars.filter(j => j.id !== id);
    saveState();
    renderJarsList();
    initApp();
}

function addJarFunds(id, amt) {
    state.jars = state.jars.map(j => {
        if (j.id === id) {
            j.current += amt;
            triggerToast("Jar Funded! (+100 XP)", "Added ₹" + amt.toLocaleString() + " to " + j.name, "fa-piggy-bank");
            claimXP(100);
        }
        return j;
    });
    saveState();
    renderJarsList();
    updateFinancialDashboard();
}

function toggleFamilyMode() {
    const checked = document.getElementById('familyModeToggle').checked;
    const status = document.getElementById('familyModeStatus');
    if (checked) {
        status.innerText = "Shared Budgeting Active";
        triggerToast("Couple Mode Sync", "Connecting savings feeds... Joint goals ready.", "fa-heart");
    } else {
        status.innerText = "Shared Budgeting Paused";
        triggerToast("Couple Mode Paused", "Feed split. Back to independent wallets.", "fa-user-lock");
    }
}

function nagPartner() {
    triggerToast("Nudge Sent 💬", "Nudge sent: 'Babe, did we REALLY need that ₹4,200 organizer?'", "fa-paper-plane");
}

function claimXP(amt) {
    state.xp += amt;
    saveState();
    document.getElementById('userXPDisplay').innerText = state.xp;
    triggerToast("XP Earned!", "+" + amt + " XP added to your ranking.", "fa-trophy");
}

function completeCoffeeChallenge(btn) {
    if (!state.badges.includes("coffee-slayer")) {
        state.badges.push("coffee-slayer");
        claimXP(300);
        document.getElementById('coffeeBadge').classList.add('unlocked');
        btn.innerText = "Claimed";
        btn.disabled = true;
        saveState();
        triggerToast("Badge Unlocked ☕", "Cafe Slayer badge added to your profile!", "fa-award");
    }
}

function triggerToast(title, msg, icon = "fa-circle-info") {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fa-solid ` + icon + ` toast-icon"></i>
        <div class="toast-content">
            <h5>` + title + `</h5>
            <p>` + msg + `</p>
        </div>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4500);
}

function triggerStreakToast() {
    triggerToast("Streak Locked In! 🔥", "You logged financial tracking 3 days consecutively. Next badge at 7 days.", "fa-fire");
}

function updateProfileFromInputs() {
    const tempName = document.getElementById('profileName').value || state.name;
    const tempAge = parseInt(document.getElementById('profileAge').value) || state.age;
    const tempIncome = parseFloat(document.getElementById('profileIncome').value) || state.income;
    const tempExpenses = parseFloat(document.getElementById('profileExpenses').value) || state.expenses;
    const tempDebts = parseFloat(document.getElementById('profileDebts').value) || state.debts;
    const tempSavings = parseFloat(document.getElementById('profileSavings').value) || state.savings;
    const tempInvestments = parseFloat(document.getElementById('profileInvestments').value) || state.investments;
    const tempRisk = document.getElementById('profileRisk').value;

    state.name = tempName;
    state.age = tempAge;
    state.income = tempIncome;
    state.expenses = tempExpenses;
    state.debts = tempDebts;
    state.savings = tempSavings;
    state.investments = tempInvestments;
    state.riskComfort = tempRisk;
}

function saveProfileChanges() {
    updateProfileFromInputs();
    saveState();
    initApp();
    triggerToast("Profile Updated", "AI recalculated life stage, aura, and multiverses.", "fa-user-check");
}

function calculateDebtOptimizer() {
    const debts = state.debts;
    
    let avalancheMonthsVal = 6;
    let snowballMonthsVal = 8;
    let interestSavedVal = 4200;

    if (debts <= 0) {
        document.getElementById('debtOptimizerTotal').innerText = "₹0";
        document.getElementById('avalancheMonths').innerText = "0 Months";
        document.getElementById('snowballMonths').innerText = "0 Months";
        document.getElementById('avalancheBar').style.width = "0%";
        document.getElementById('snowballBar').style.width = "0%";
        document.getElementById('debtOptimizerSavings').innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--aura-stable);"></i> You are completely debt-free. High financial discipline.`;
        return;
    }

    if (debts > 200000) {
        avalancheMonthsVal = 24;
        snowballMonthsVal = 32;
        interestSavedVal = Math.round(debts * 0.08);
    } else if (debts > 80000) {
        avalancheMonthsVal = 12;
        snowballMonthsVal = 16;
        interestSavedVal = Math.round(debts * 0.09);
    } else {
        avalancheMonthsVal = Math.max(2, Math.round(debts / 8000));
        snowballMonthsVal = Math.max(3, Math.round(avalancheMonthsVal * 1.3));
        interestSavedVal = Math.round(debts * 0.1);
    }

    document.getElementById('debtOptimizerTotal').innerText = "₹" + debts.toLocaleString('en-IN');
    document.getElementById('avalancheMonths').innerText = avalancheMonthsVal + " Months";
    document.getElementById('snowballMonths').innerText = snowballMonthsVal + " Months";
    
    const pctAv = Math.min(100, Math.max(10, (avalancheMonthsVal / 36) * 100));
    const pctSn = Math.min(100, Math.max(10, (snowballMonthsVal / 36) * 100));
    
    document.getElementById('avalancheBar').style.width = pctAv + "%";
    document.getElementById('snowballBar').style.width = pctSn + "%";
    
    document.getElementById('debtOptimizerSavings').innerHTML = `
        <i class="fa-solid fa-circle-info"></i> Using the <strong>Avalanche Method</strong> saves you <strong>₹` + interestSavedVal.toLocaleString() + ` in interest</strong> and gets you debt-free <strong>` + (snowballMonthsVal - avalancheMonthsVal) + ` months faster</strong>!
    `;
}

function calculateEmergencyFund() {
    const target = state.expenses * 6;
    const current = state.savings;
    
    const pct = Math.min(100, Math.round((current / (target || 1)) * 100));
    
    document.getElementById('efPercentage').innerText = pct + "% Saved";
    document.getElementById('efTargetVal').innerText = "₹" + target.toLocaleString('en-IN');
    document.getElementById('efCurrentVal').innerText = "₹" + current.toLocaleString('en-IN');
    document.getElementById('efProgressBar').style.width = pct + "%";
    
    const monthlyContribution = Math.round((target - current) / 12);
    const suggestion = document.getElementById('efSuggestion');
    
    if (current >= target) {
        suggestion.innerHTML = `<i class="fa-solid fa-check" style="color:var(--aura-stable);"></i> Your Emergency Shield is fully loaded! You're prepared for the worst.`;
    } else {
        suggestion.innerHTML = `Contributing <strong>₹` + Math.max(500, monthlyContribution).toLocaleString() + ` monthly</strong> will fully fund your emergency shield in 12 months.`;
    }
}

function updateSimParamLabel() {
    const select = document.getElementById('simScenario');
    const label = document.getElementById('simParamLabel');
    const input = document.getElementById('simParamInput');

    if (select.value === 'job') {
        label.innerText = "Salary Increase (₹/mo)";
        input.value = "25000";
    } else if (select.value === 'loan') {
        label.innerText = "Monthly EMI Added (₹/mo)";
        input.value = "8000";
    } else if (select.value === 'business') {
        label.innerText = "Side Hustle Profit (₹/mo)";
        input.value = "15000";
    } else if (select.value === 'city') {
        label.innerText = "Additional Rent Expense (₹/mo)";
        input.value = "12000";
    }
    runScenarioSimulation();
}

function runScenarioSimulation() {
    const scenario = document.getElementById('simScenario').value;
    const param = parseFloat(document.getElementById('simParamInput').value) || 0;
    
    const currentSavingsRate = (state.income - state.expenses) / (state.income || 1);
    let baseAge = 58 - Math.round(currentSavingsRate * 20) - Math.min(8, Math.round(state.investments / 80000));
    baseAge = Math.max(35, Math.min(75, baseAge));
    
    let simAge = baseAge;
    let feedback = "";
    let diff = 0;

    if (scenario === 'job') {
        const extraSavingsRate = param / (state.income + param);
        simAge = baseAge - Math.round(extraSavingsRate * 22);
        diff = simAge - baseAge;
        feedback = `"Awesome move! Increasing your salary by ₹` + param.toLocaleString() + `/month increases your savings throttle, letting you retire at ` + simAge + ` instead of ` + baseAge + `."`;
    } else if (scenario === 'loan') {
        simAge = baseAge + Math.round((param / state.income) * 28);
        diff = simAge - baseAge;
        feedback = `"Rough. Adding an EMI of ₹` + param.toLocaleString() + `/month delays early retirement by ` + diff + ` years. Future You is currently sighing."`;
    } else if (scenario === 'business') {
        simAge = baseAge - Math.round((param / state.income) * 24);
        diff = simAge - baseAge;
        feedback = `"Solid hustle. Generating ₹` + param.toLocaleString() + `/month in passive/side business cash flow chops ` + Math.abs(diff) + ` years off your retirement fight."`;
    } else if (scenario === 'city') {
        simAge = baseAge + Math.round((param / state.income) * 20);
        diff = simAge - baseAge;
        feedback = `"Moving to an expensive flat? Rent hikes delay your FIRE target by ` + diff + ` years. Hopefully, the cafes are worth it."`;
    }

    simAge = Math.max(30, Math.min(80, simAge));
    
    document.getElementById('simRetirementAge').innerText = simAge + " Years Old";
    
    const diffEl = document.getElementById('simRetirementDiff');
    if (diff < 0) {
        diffEl.innerText = diff + " Years Earlier!";
        diffEl.style.color = 'var(--aura-stable)';
    } else if (diff > 0) {
        diffEl.innerText = "+" + diff + " Years Later";
        diffEl.style.color = '#ef4444';
    } else {
        diffEl.innerText = "No Change";
        diffEl.style.color = 'var(--text-muted)';
    }
    
    document.getElementById('simFeedbackText').innerHTML = feedback;
}

function calculatePassiveIncome() {
    const div = parseFloat(document.getElementById('passiveDiv').value) || 0;
    const rent = parseFloat(document.getElementById('passiveRent').value) || 0;
    const hustle = parseFloat(document.getElementById('passiveHustle').value) || 0;
    const digital = parseFloat(document.getElementById('passiveDigital').value) || 0;
    
    const total = div + rent + hustle + digital;
    document.getElementById('passiveIncomeTotal').innerText = "Current Passive Flow: ₹" + total.toLocaleString() + "/month";
    
    let projection = [];
    let currentFlow = total;
    for (let yr = 0; yr <= 10; yr++) {
        projection.push(Math.round(currentFlow));
        currentFlow *= 1.12;
    }
    
    updatePassiveChart(projection);
}

function openDelusionSimulator() {
    document.getElementById('delusionModal').style.display = 'flex';
    updateDelusionSimData();
}

function closeDelusionSimulator() {
    document.getElementById('delusionModal').style.display = 'none';
}

function updateDelusionSimData() {
    const target = document.getElementById('delusionTarget').value;
    const currentVal = state.savings + state.investments;
    
    let needed = 15000000;
    let feedback = "";
    
    if (target === 'bali') {
        needed = 15000000;
        feedback = `"Okay diva, you are currently at ` + ((currentVal/needed)*100).toFixed(1) + `% of this goal. You would need to invest ₹45,000 monthly for 15 years, or secure a wealthy benefactor."`;
    } else if (target === 'car') {
        needed = 25000000;
        feedback = `"A Porsche GT3 requires ₹` + needed.toLocaleString() + `. You are at ` + ((currentVal/needed)*100).toFixed(2) + `% of this. Purchasing this would delay early retirement by 18 business years. Recommend scale models."`;
    } else if (target === 'penthouse') {
        needed = 80000000;
        feedback = `"South Mumbai Penthouse at ₹8 Crore. You are at ` + ((currentVal/needed)*100).toFixed(3) + `% of this goal. We support delusional confidence, but your interest payments alone would fund a small country."`;
    } else if (target === 'quit') {
        needed = 10000000;
        feedback = `"To quit your job and survive on vibes forever, you need at least ₹1 Crore in low-risk dividend funds. You're at ` + ((currentVal/needed)*100).toFixed(1) + `% of this. Let's close the shopping apps and return to Excel."`;
    }
    
    document.getElementById('delusionNeededVal').innerText = "₹" + needed.toLocaleString('en-IN');
    document.getElementById('delusionCurrentVal').innerText = "₹" + currentVal.toLocaleString('en-IN');
    document.getElementById('delusionFeedback').innerText = feedback;
    
    const delusionPercent = Math.min(99, Math.round(100 - (currentVal / needed * 100)));
    document.getElementById('delusionPercent').innerText = delusionPercent + "% Delusion";
    document.getElementById('delusionFillBar').style.width = delusionPercent + "%";
    document.getElementById('delusionPointer').style.left = delusionPercent + "%";
}

function applyDelusionToPlan() {
    const select = document.getElementById('delusionTarget');
    const targetName = select.options[select.selectedIndex].text.split('(')[0].trim();
    const needed = parseFloat(document.getElementById('delusionNeededVal').innerText.replace(/[^d]/g, ''));
    
    const newJar = {
        id: Date.now(),
        name: "🦄 Delusion: " + targetName,
        target: needed,
        current: state.savings + state.investments,
        category: "other"
    };
    
    state.jars.push(newJar);
    saveState();
    closeDelusionSimulator();
    renderJarsList();
    initApp();
    triggerToast("Delusional Goal Set", '"' + targetName + '" added as savings target.', "fa-wand-magic-sparkles");
}

let currentTraumaSlide = 1;
function triggerTraumaRecap() {
    document.getElementById('traumaModal').style.display = 'flex';
    currentTraumaSlide = 1;
    showTraumaSlide(1);
    
    const risk = state.riskComfort;
    const villainName = document.getElementById('traumaVillainName');
    const villainDesc = document.getElementById('traumaVillainDesc');
    
    if (risk === 'degenerate') {
        villainName.innerText = "F&O / Crypto Speculation";
        villainDesc.innerText = "You traded high-risk options 18 times this month. That gave you 3 minutes of adrenaline and wiped out 15% of your investment yield. Capital market thanks you.";
    } else if (state.expenses > state.income * 0.5) {
        villainName.innerText = "Food Delivery Demons";
        villainDesc.innerText = "You ordered food delivery 14 times this month. You basically funded the delivery app founder's early retirement, while delaying yours by 3 months.";
    } else {
        villainName.innerText = "Late-night E-Commerce";
        villainDesc.innerText = "Those midnight shopping splurges gave you a package delivery thrill, but delayed your home-buying plan. The boxes look beautiful in the trash though.";
    }
    
    setTimeout(() => {
        initTraumaPieChart();
    }, 100);
}

function closeTraumaRecap() {
    document.getElementById('traumaModal').style.display = 'none';
}

function nextTraumaSlide(slide) {
    showTraumaSlide(slide);
}

function prevTraumaSlide(slide) {
    showTraumaSlide(slide);
}

function showTraumaSlide(slide) {
    document.querySelectorAll('.trauma-slide').forEach(el => el.classList.remove('active'));
    document.getElementById('traumaSlide' + slide).classList.add('active');
    currentTraumaSlide = slide;
}

const personalities = {
    chaos: {
        name: "Chaos Gremlin",
        avatar: "💀",
        subtext: "Dark humor + savage roasts",
        color: "rgba(217, 70, 239, 0.2)",
        welcome: "Oh look, a financially vulnerable human. What are we overspending on today? Tell me, so I can judge you."
    },
    rich: {
        name: "Rich Bestie",
        avatar: "✨",
        subtext: "Glamorous luxury mentor",
        color: "rgba(245, 158, 11, 0.2)",
        welcome: "Hello, future millionaire! Let's get your money working so we can buy that penthouse. Coffee? Make it at home today, darling."
    },
    gym: {
        name: "Gym Bro Investor",
        avatar: "🏋️",
        subtext: "Discipline + grindset",
        color: "rgba(14, 165, 233, 0.2)",
        welcome: "No excuses! Compound interest is all about consistency. Time to bench press your savings rate. What's your leverage, bro?"
    },
    therapist: {
        name: "Soft Therapist",
        avatar: "🫂",
        subtext: "Gentle supportive coaching",
        color: "rgba(16, 185, 129, 0.2)",
        welcome: "Hey there. It's okay. One bad spending week doesn't define your worth. Take a deep breath. Let's organize this together."
    },
    villain: {
        name: "Corporate Villain",
        avatar: "💼",
        subtext: "\"Money never sleeps\" energy",
        color: "rgba(107, 114, 128, 0.2)",
        welcome: "Sleep is for the poor. Your capital should be operating 24/7. How can we optimize your net yield today? Empathy is not on the menu."
    },
    delulu: {
        name: "Delulu Motivator",
        avatar: "🦄",
        subtext: "Unrealistic confidence but useful",
        color: "rgba(167, 139, 250, 0.2)",
        welcome: "You are literally one investment away from building generational wealth! Manifest that penthouse! We are rich already! ✨"
    },
    parent: {
        name: "Strict Indian Parent",
        avatar: "💀",
        subtext: "Emotionally damaging parent",
        color: "rgba(239, 68, 68, 0.2)",
        welcome: "Sharma ji's child just invested in index funds. What are you doing? Spending all your salary on restaurants? Sharma ji's child never eats outside."
    }
};

let chatHistories = {
    chaos: [], rich: [], gym: [], therapist: [], villain: [], delulu: [], parent: []
};

function initCoachPersonalitiesList() {
    const list = document.getElementById('coachBestieList');
    if (!list) return;

    list.innerHTML = Object.keys(personalities).map(key => {
        const p = personalities[key];
        const selected = state.bestieMode === key ? 'selected' : '';
        return `
            <div class="personality-card ` + selected + `" onclick="switchChatPersonality('` + key + `')">
                <div class="personality-avatar">` + p.avatar + `</div>
                <div class="personality-info">
                    <h4>` + p.name + `</h4>
                    <p>` + p.subtext + `</p>
                </div>
            </div>
        `;
    }).join('');
}

function switchChatPersonality(key) {
    state.bestieMode = key;
    saveState();
    
    initCoachPersonalitiesList();
    
    const p = personalities[key];
    document.getElementById('chatActiveName').innerText = p.name;
    document.getElementById('chatActiveSubtext').innerText = p.subtext;
    document.getElementById('chatActiveAvatar').innerText = p.avatar;
    document.getElementById('chatActiveAvatar').style.background = p.color;

    const messages = chatHistories[key];
    const viewport = document.getElementById('chatMessagesViewport');
    viewport.innerHTML = '';

    if (messages.length === 0) {
        const welcomeText = translateText(p.welcome, state.language);
        addMessageBubble(welcomeText, 'ai');
    } else {
        messages.forEach(msg => {
            addMessageBubble(msg.text, msg.sender);
        });
    }
    
    document.getElementById('activeBestieName').innerText = p.name;
    document.getElementById('activeBestieBadge').innerHTML = getBestieBadgeIcon(key) + " " + p.name;
}

function clearChatHistory() {
    chatHistories[state.bestieMode] = [];
    switchChatPersonality(state.bestieMode);
}

function addMessageBubble(text, sender) {
    const viewport = document.getElementById('chatMessagesViewport');
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + sender;
    
    const avatar = sender === 'ai' ? personalities[state.bestieMode].avatar : "👤";
    
    msg.innerHTML = `
        <div class="personality-avatar">` + avatar + `</div>
        <div class="message-bubble">` + text + `</div>
    `;
    viewport.appendChild(msg);
    viewport.scrollTop = viewport.scrollHeight;
}

function sendQuickMessage(text) {
    document.getElementById('chatTextInput').value = text;
    sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chatTextInput');
    const text = input.value.trim();
    if (!text) return;

    addMessageBubble(text, 'user');
    chatHistories[state.bestieMode].push({ text, sender: 'user' });
    input.value = '';

    setTimeout(() => {
        const response = generateAIResponse(text);
        addMessageBubble(response, 'ai');
        chatHistories[state.bestieMode].push({ text: response, sender: 'ai' });
    }, 1000);
}

let isRecording = false;
function toggleVoiceInput() {
    const btn = document.getElementById('voiceToggleBtn');
    if (!isRecording) {
        isRecording = true;
        btn.classList.add('recording');
        triggerToast("Voice Assistant Listening 🎙️", "Simulating speech recognition... Talk now.", "fa-microphone");
        
        setTimeout(() => {
            if (isRecording) {
                const mockPhrases = [
                    "Can I afford a car loan?",
                    "Roast my budget!",
                    "Should I prepay my home loan?",
                    "What is SIP?"
                ];
                const phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
                document.getElementById('chatTextInput').value = phrase;
                isRecording = false;
                btn.classList.remove('recording');
                triggerToast("Voice Received", 'Decoded: "' + phrase + '"', "fa-check");
                sendChatMessage();
            }
        }, 3000);
    } else {
        isRecording = false;
        btn.classList.remove('recording');
    }
}

const translations = {
    hi: {
        "What is SIP?": "एसआईपी (SIP) क्या है?",
        "Should I close my credit card debt first?": "क्या मुझे पहले क्रेडिट कार्ड का कर्ज चुकाना चाहिए?",
        "Can I afford a car loan?": "क्या मुझे कार लोन लेना चाहिए?",
        "Roast my current profile settings!": "मेरे बजट का मज़ाक उड़ाओ! 💀"
    },
    ta: {
        "What is SIP?": "SIP என்றால் என்ன?",
        "Should I close my credit card debt first?": "நான் முதலில் கிரெடிட் கார்டு கடனை அடைக்க வேண்டுமா?",
        "Can I afford a car loan?": "என்னால் கார் லோன் வாங்க முடியுமா?",
        "Roast my current profile settings!": "என் பட்ஜெட்டை ரோஸ்ட் செய்! 💀"
    },
    te: {
        "What is SIP?": "SIP అంటే ఏమిటి?",
        "Should I close my credit card debt first?": "నేను ముందుగా క్రెడిట్ కార్డ్ అప్పు తీర్చాలా?",
        "Can I afford a car loan?": "నేను కార్ లోన్ తీసుకోగలనా?",
        "Roast my current profile settings!": "నా బడ్జెట్‌ను రోస్ట్ చేయండి! 💀"
    },
    kn: {
        "What is SIP?": "SIP ಎಂದರೇನು?",
        "Should I close my credit card debt first?": "ನಾನು ಮೊದಲು ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಸಾಲವನ್ನು ತೀರಿಸಬೇಕೇ?",
        "Can I afford a car loan?": "ನಾನು ಕಾರ್ ಲೋನ್ ಪಡೆಯಬಹುದೇ?",
        "Roast my current profile settings!": "ನನ್ನ ಬಜೆಟ್ ರೋಸ್ಟ್ ಮಾಡಿ! 💀"
    },
    bn: {
        "What is SIP?": "SIP কি?",
        "Should I close my credit card debt first?": "আমার কি প্রথমে ক্রেডিট কার্ডের ঋণ শোধ করা উচিত?",
        "Can I afford a car loan?": "আমি কি গাড়ি লোন নিতে পারি?",
        "Roast my current profile settings!": "আমার বাজেট রোস্ট করো! 💀"
    }
};

function translateText(text, lang) {
    if (lang === 'en' || !translations[lang]) return text;
    return translations[lang][text] || text;
}

function onLanguageChange() {
    state.language = document.getElementById('coachLanguage').value;
    saveState();
    
    switchChatPersonality(state.bestieMode);
    
    const lang = state.language;
    const pills = document.querySelectorAll('#chatSuggestions button');
    if (pills.length >= 4) {
        pills[0].innerText = translateText("What is SIP?", lang);
        pills[1].innerText = translateText("Should I close my credit card debt first?", lang);
        pills[2].innerText = translateText("Can I afford a car loan?", lang);
        pills[3].innerText = translateText("Roast my current profile settings!", lang);
    }
}

function generateAIResponse(userInput) {
    const input = userInput.toLowerCase();
    const bestie = state.bestieMode;
    const lang = state.language;

    let topic = "general";
    if (input.includes("sip") || input.includes("mutual fund") || input.includes("invest")) topic = "sip";
    else if (input.includes("credit card") || input.includes("debt") || input.includes("loan") || input.includes("repay")) topic = "debt";
    else if (input.includes("car") || input.includes("afford") || input.includes("buy")) topic = "car";
    else if (input.includes("roast") || input.includes("profile") || input.includes("budget")) topic = "roast";

    let response = "";

    if (topic === 'sip') {
        const matrix = {
            chaos: "SIP stands for Systematic Investment Plan, which is basically tricking yourself into saving money before you can spend it on sneakers. You invest ₹5,000 monthly, compound interest does the heavy lifting, and you get to retire before your spine gives out. Do it.",
            rich: "Darling, SIP is how you build a luxury cachet. Instead of buying one designer bag, you automate mutual fund shares monthly. In 15 years, compounding will buy you the entire boutique. Classy, isn't it?",
            gym: "SIP is the ultimate financial muscle building. You don't bench 100kg on day one. You lift ₹2,000 every single month consistently. Compounding is the protein shake. Lock it in, let the gains stack!",
            therapist: "A Systematic Investment Plan is a gentle way to nurture your future. By allocating a small amount monthly, you take away the stress of market timing. It's about taking small, loving steps for Future You.",
            villain: "SIP is taking liquidity away from your immediate consumption and locking it in index tracking funds where compound gains can outperform inflation. It's a calculated math machine. Do not think, just deploy capital.",
            delulu: "SIP is literally magic! You invest ₹1,000 today and manifest like ₹5 Crore later! Compounding is obsessed with you, queen! You are basically a venture capitalist now! 🦄",
            parent: "SIP means you give money to index funds instead of waste money on Netflix. Sharma ji's son does 3 SIPs. You cannot even do one? Invest ₹5,000 now, or don't call me when you are broke."
        };
        response = matrix[bestie];
    }
    else if (topic === 'debt') {
        const matrix = {
            chaos: "Close that credit card debt immediately! The interest rate is like 42% per year. That is not debt, that's a financial hostage situation. Stop buying aesthetic home decors and pay them off first.",
            rich: "Darling, paying 40% interest on credit cards is so un-chic. Pay off the card immediately, clear your liabilities, and focus on clean capital growth. Debt is a bad accessory.",
            gym: "Credit card debt is a weight vest that you can't take off. Crush the high-interest cards first (Avalanche style) and increase your agility. Cut the credit cards, lift the savings rate!",
            therapist: "Debt can feel so heavy on our minds. Clearing credit cards first relieves a lot of anxiety because they carry high interest rates. Let's tackle the smallest card first for a quick win to help you feel lighter.",
            villain: "Debt with interest over 12% is a leak in your balance sheet. Plug the high-interest liabilities first. Emotions do not matter. The numbers dictate credit cards go first.",
            delulu: "Manifesting zero debt! Honestly, pay the smallest card first, throw a mini party, celebrate character development, and then watch the rest of the debt literally disappear! 🦄",
            parent: "Why do you have credit card debt? Who told you to buy things you cannot afford? Pay it off now! No restaurants, no cafes, no new clothes until this number is ₹0. 💀"
        };
        response = matrix[bestie];
    }
    else if (topic === 'car') {
        const matrix = {
            chaos: "You want a car loan? With your current salary of ₹" + state.income.toLocaleString() + " and expenses of ₹" + state.expenses.toLocaleString() + "? Absolutely not. That depreciating metal box will consume 30% of your net worth in interest and fuel. Buy a cycle.",
            rich: "Darling, luxury is having investments that pay for your rides, not debt that binds you. Wait until your assets generate enough cash flow to lease the car. Buying on loan is basic.",
            gym: "A car is a liability that burns cash. Focus on building the engine (assets) first. Ride a bicycle or take public transport — think of the leg gains and cardio, bro! Save the car for later.",
            therapist: "Let's look at how a car payment might affect your peace of mind. Added EMIs can trigger financial stress. Maybe we start a separate 'Car Jar' and save for a larger down payment first?",
            villain: "A car loan is a negative cash flow yield. Depreciation eats 15% in year one. Take public transit. Allocate car budget directly into index equities to expand operations.",
            delulu: "You deserve the Porsche! But wait... Ploutos calculations show that Porsche EMI is 95% of your income. Maybe buy a cute keychain first and manifest the rest? ✨",
            parent: "Car loan? Why? Did you walk to school? No, you took the bus. Take the bus now also. Save that EMI money for family marriage or retirement. Stupidity."
        };
        response = matrix[bestie];
    }
    else if (topic === 'roast') {
        const savingsRate = Math.round(((state.income - state.expenses) / state.income) * 100);
        const matrix = {
            chaos: `"Roast time: You earn ₹" + state.income.toLocaleString() + " and spend ₹" + state.expenses.toLocaleString() + ", saving only " + savingsRate + "%. You order food 11 times a week and have ₹" + state.debts.toLocaleString() + " in debts. We are not building wealth, we are funding Zomato's expansion plans! 💀"`,
            rich: `"Sweetie, your budget allocations are giving 'budget brand'. Spending ₹" + state.expenses.toLocaleString() + " on necessities while saving so little? We need to elevate our income streams to match our luxury aspirations."`,
            gym: `"Your savings rate is weak, bro! " + savingsRate + "%? That's a warmup set. We need to cut down the junk expenses and increase our financial reps. Put the wallet on a calorie deficit!"`,
            therapist: `"Please don't be hard on yourself, but saving " + savingsRate + "% leaves you vulnerable to sudden life bumps. Let's see if we can gently reduce wants by ₹2,000 this month to build a thicker cushion."`,
            villain: `"Your current financial operations are highly inefficient. A " + savingsRate + "% savings rate with ₹" + state.debts.toLocaleString() + " debt is an administrative failure. I recommend immediate structural cuts to food/lifestyle budgets."`,
            delulu: `"You have a ₹" + state.income.toLocaleString() + " income which is basically a million dollars in parallel universes! Sure, saving " + savingsRate + "% is a little chill, but you're going to manifest an inheritance soon anyway! 🦄"`,
            parent: `"Disaster budget! You save " + savingsRate + "% of ₹" + state.income.toLocaleString() + "? In my days, I saved 90% of my ₹500 salary! Go wash your face and close the shopping apps immediately. No shame."`
        };
        response = matrix[bestie];
    }
    else {
        const matrix = {
            chaos: "I parsed your query but couldn't find a direct correlation to buying nonsense. Let's stick to core plans: close debts, save emergency funds, and stop late-night impulse shopping.",
            rich: "Darling, I only discuss wealth creation, compounding, and penthouse budgets. Keep your focus on building assets that feed you while you sleep.",
            gym: "Focus on the core lift, bro. Savings, investments, discipline. Clear out the mental clutter and execute the plan.",
            therapist: "That is an interesting question. Financial journeys are very personal. Take it one step at a time, and remember you are already doing better than you think.",
            villain: "Irrelevant query. Focus on the core vectors: net asset yield, liability reduction, tax optimization. Compound rate is the only metric that matters.",
            delulu: "Omg, literally yes! Just manifest cash, stay positive, keep your streaks alive, and compounding will handle the vibe check! ✨",
            parent: "Don't ask silly questions. Go check your saving jars, see why emergency fund is low, and think about your future. Sharma ji's child is already rich."
        };
        response = matrix[bestie];
    }

    if (lang === 'hi') {
        response = "👉 [AI Coach]: " + response + " (बजट सुधारें, खुश रहें!)";
    } else if (lang === 'ta') {
        response = "👉 [AI Coach]: " + response + " (சேமிப்பை உயர்த்துங்கள், வாழ்க வளமுடன்!)";
    } else if (lang === 'te') {
        response = "👉 [AI Coach]: " + response + " (బాగా సేవ్ చేయండి, భవిష్యత్తు బాగుంటుంది!)";
    }

    return response;
}

let stabilityChartInstance = null;
let multiverseChartInstance = null;
let passiveChartInstance = null;
let traumaPieChartInstance = null;

function initCharts() {
    initStabilityChart();
    initMultiverseChart();
}

function initStabilityChart() {
    const ctx = document.getElementById('stabilityChart');
    if (!ctx) return;

    if (stabilityChartInstance) stabilityChartInstance.destroy();

    const labels = ["Day 1 (Payday)", "Day 5", "Day 12", "Day 20", "Day 27", "Day 30 (Broke)"];
    
    const maxBal = state.income;
    const balanceData = [maxBal, maxBal * 0.85, maxBal * 0.60, maxBal * 0.35, maxBal * 0.15, maxBal * 0.05];
    const stabilityData = [95, 78, 65, 52, 40, 90];

    stabilityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Bank Balance (₹)',
                    data: balanceData,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    yAxisID: 'yBalance',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Mental Stability (%)',
                    data: stabilityData,
                    borderColor: '#d946ef',
                    backgroundColor: 'rgba(217, 70, 239, 0)',
                    yAxisID: 'ySanity',
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yBalance: {
                    type: 'linear',
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'var(--text-muted)' }
                },
                ySanity: {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    max: 100,
                    grid: { drawOnChartArea: false },
                    ticks: { color: 'var(--text-muted)' }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: 'var(--text-muted)' }
                }
            },
            plugins: {
                legend: { labels: { color: 'var(--text-main)', font: { family: 'Outfit' } } }
            }
        }
    });
}

function initMultiverseChart() {
    const ctx = document.getElementById('multiverseChart');
    if (!ctx) return;

    if (multiverseChartInstance) multiverseChartInstance.destroy();

    const age = state.age;
    const currentNW = state.savings + state.investments;
    const labels = ["Age " + age, "Age " + (age+5), "Age " + (age+10), "Age " + (age+15), "Age " + (age+20)];

    const r = 0.12;
    const monthlySave = state.income - state.expenses;

    let investorNW = [currentNW];
    let chaoticNW = [currentNW];
    let aestheticNW = [currentNW];

    let currentInv = currentNW;
    let currentCh = currentNW;
    let currentAes = currentNW;

    for (let yr = 1; yr <= 4; yr++) {
        currentInv = (currentInv * Math.pow(1 + r, 5)) + (monthlySave * 1.2 * 12 * 5);
        investorNW.push(Math.round(currentInv));

        currentCh = currentCh + (monthlySave * 0.1 * 12 * 5);
        chaoticNW.push(Math.round(currentCh));

        currentAes = (currentAes * Math.pow(1 + 0.06, 5)) + (monthlySave * 0.5 * 12 * 5);
        aestheticNW.push(Math.round(currentAes));
    }

    multiverseChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Investor Me',
                    data: investorNW,
                    borderColor: '#10b981',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Chaotic Me',
                    data: chaoticNW,
                    borderColor: '#ef4444',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Spent on Aesthetics',
                    data: aestheticNW,
                    borderColor: '#f59e0b',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'var(--text-muted)' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'var(--text-muted)' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function initCalculatorsCharts() {
    calculateDebtOptimizer();
    calculateEmergencyFund();
    calculatePassiveIncome();
}

function updatePassiveChart(projection) {
    const ctx = document.getElementById('passiveChart');
    if (!ctx) return;

    if (passiveChartInstance) passiveChartInstance.destroy();

    const labels = ["Yr 0", "Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5", "Yr 6", "Yr 7", "Yr 8", "Yr 9", "Yr 10"];

    passiveChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Projected Monthly Passive Flow (₹)',
                data: projection,
                backgroundColor: 'rgba(139, 92, 246, 0.4)',
                borderColor: '#8b5cf6',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'var(--text-muted)' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'var(--text-muted)' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function initTraumaPieChart() {
    const ctx = document.getElementById('traumaPieChart');
    if (!ctx) return;

    if (traumaPieChartInstance) traumaPieChartInstance.destroy();

    traumaPieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Necessities", "Coping Mechanisms", "I Deserved It", "It was on Sale", "Bad Decisions"],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(244, 114, 182, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff', font: { family: 'Outfit', size: 10 } }
                }
            }
        }
    });
}
