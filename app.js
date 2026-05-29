/* ==========================================================================
   Ploutos Application Core – Powered by Antigravity AI Engine
   ========================================================================== */

const state = {
  profile: null,        // { name, age, income, expenses, debt, goal }
  metrics: {
    netWorth: 0,
    savingsRate: 0,
    burnRate: 0
  },
  aura: "Stable",       // Stable, Chaotic, Delusional, Wealthy
  insights: [],
  jars: [
    { name: "Emergency Fund", target: 150000, saved: 45000 },
    { name: "Wealth Seed SIP", target: 500000, saved: 120000 }
  ],
  chatHistory: []       // [{ from: 'user'|'bot', text: '...' }]
};

// Global reference to the chart instance to avoid redraw overlaps
let futureChartInstance = null;

/* ==========================================
   1. State Persistence
   ========================================== */
function loadState() {
  const raw = localStorage.getItem('ploutos_state_v2');
  if (raw) {
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  }
}

function saveState() {
  localStorage.setItem('ploutos_state_v2', JSON.stringify(state));
}

/* ==========================================
   2. Calculations & Analytical Engine
   ========================================== */
function calculateAuraAndMetrics() {
  if (!state.profile) return;
  const p = state.profile;
  
  // Calculate key metrics
  const yearlyIncome = p.income * 12;
  const yearlySurplus = (p.income - p.expenses) * 12;
  const net = yearlySurplus - p.debt;
  
  state.metrics.netWorth = net;
  state.metrics.savingsRate = Math.max(0, ((p.income - p.expenses) / p.income) * 100);
  
  // Survival Horizon (Burn Rate in Days)
  // Total current savings (approximated by net or dynamic jars) divided by daily burn rate
  const totalSaved = state.jars.reduce((sum, j) => sum + j.saved, 0);
  const dailyExpenses = p.expenses / 30;
  state.metrics.burnRate = dailyExpenses > 0 ? Math.round(totalSaved / dailyExpenses) : 365;

  // Determine Financial Aura
  if (p.debt > yearlyIncome * 0.4) {
    state.aura = "Chaotic";
  } else if (state.metrics.savingsRate < 15) {
    state.aura = "Delusional";
  } else if (state.metrics.savingsRate >= 35 && p.debt === 0) {
    state.aura = "Wealthy";
  } else {
    state.aura = "Stable";
  }

  // Generate actionable insights
  state.insights = [];
  if (p.debt > 0) {
    const ratio = Math.round((p.debt / yearlyIncome) * 100);
    state.insights.push(`⚡ Debt-to-Income is ${ratio}%: Antigravity suggests allocating ₹${Math.round(p.income * 0.15)} monthly into high-interest debt acceleration.`);
  }
  if (state.metrics.savingsRate < 20) {
    state.insights.push(`💡 Low margin detected: Target ₹${Math.round(p.income * 0.2)} in savings to trigger Stable aura protocol.`);
  } else {
    state.insights.push(`🚀 Excellent surplus margin: Launch compound growth vectors via monthly automated index SIPs.`);
  }
  if (totalSaved < p.expenses * 3) {
    state.insights.push(`🛡️ Shield coordinates incomplete: Expand your Emergency Fund Jar to cover at least ₹${p.expenses * 3} for basic safety.`);
  }
}

/* ==========================================
   3. Antigravity AI Conversational Logic
   ========================================== */
const ANTIGRAVITY_RESPONSES = {
  greetings: [
    "Awaiting commands. How shall we accelerate your financial vectors today?",
    "Coordinates secured. Antigravity core ready to optimize your capital deployment.",
    "System loaded. Net worth projection algorithms fully operational."
  ],
  default: "Analytical index updated. Let's redirect our focus to wealth multipliers: Try testing compound interest vectors or optimizing your active jars.",
  roast: [
    "Self-audit active: You have a healthy goal target, but let's be honest—that monthly survival margin is walking a tightrope. Let's cut back on the coffee-substance situations and add some gravity to your savings.",
    "Aura evaluation: Let's optimize that expense vector. Your lifestyle cost index is burning through fuel faster than your passive assets compile. Deploy savings automation before you experience capital decay."
  ]
};

function getAntigravityReply(query) {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    const greeting = ANTIGRAVITY_RESPONSES.greetings[Math.floor(Math.random() * ANTIGRAVITY_RESPONSES.greetings.length)];
    return `Greetings, ${state.profile.name}. ${greeting}`;
  }
  
  if (q.includes('roast') || q.includes('audit')) {
    if (state.aura === "Chaotic") {
      return `🔴 ANTIGRAVITY AUDIT: The situation is unstable. Your debt is currently sitting at ₹${state.profile.debt.toLocaleString()}. At this rate, your money survival horizon is only ${state.metrics.burnRate} days. Stop treating active credit cards as passive revenue. Prioritize the Avalanche payoff vector immediately.`;
    }
    if (state.aura === "Delusional") {
      return `🟡 ANTIGRAVITY AUDIT: You have grand ambitions (Target: ₹${state.profile.goal.toLocaleString()}), but your current saving rate is only ${state.metrics.savingsRate.toFixed(1)}%. Believing you'll build massive wealth without automated discipline is pure projection. Optimize your fixed expenses before the gravity of reality catches up.`;
    }
    return `🟢 ANTIGRAVITY AUDIT: Your financial aura is ${state.aura}. Net worth compiling perfectly. You have a solid margin of ${state.metrics.savingsRate.toFixed(1)}%. To accelerate, automate a secondary investment vector and challenge yourself to a no-spend sprint next week.`;
  }
  
  if (q.includes('debt') || q.includes('loan')) {
    return `🧱 Antigravity Debt Mitigation: I recommend the Avalanche Protocol. Rank all debts by interest rate. Pay the absolute minimum on all, and flood the highest interest rate with every surplus rupee. This mathematically minimizes capital leakage.`;
  }
  
  if (q.includes('retire') || q.includes('early')) {
    const targetAge = 45;
    const yearsToTarget = targetAge - state.profile.age;
    if (yearsToTarget <= 0) {
      return `🏝️ Early Retirement Protocol: You're already at or past the speed threshold! Focus on building high-yield passive income Jars to cover your annual expense run rate of ₹${(state.profile.expenses * 12).toLocaleString()}.`;
    }
    return `🏝️ Early Retirement Protocol: Target age 45 is in ${yearsToTarget} years. To support your expenses, we need a compounding corpus of ₹${(state.profile.expenses * 12 * 25).toLocaleString()}. An automated monthly investment vector is your primary path.`;
  }

  if (q.includes('sip') || q.includes('invest')) {
    return `📊 Compound Acceleration: Automating a monthly Systematic Investment Plan (SIP) in low-cost index funds is the highest probability path to wealth. At an average 12% CAGR, ₹10,000 monthly turns into ₹23 Lakhs in 10 years. Start small, stay regular.`;
  }

  return ANTIGRAVITY_RESPONSES.default;
}

function processUserMessage(text) {
  state.chatHistory.push({ from: 'user', text });
  
  // Trigger bot reply with a simulated typing delay
  const botBubble = document.createElement('div');
  botBubble.className = "msg-bubble bot typing-indicator";
  botBubble.textContent = "Antigravity is calculating...";
  const chatLog = document.getElementById('chatLog');
  chatLog.appendChild(botBubble);
  chatLog.scrollTop = chatLog.scrollHeight;
  
  setTimeout(() => {
    botBubble.remove();
    const reply = getAntigravityReply(text);
    state.chatHistory.push({ from: 'bot', text: reply });
    renderChat();
    saveState();
  }, 600);
}

/* ==========================================
   4. UI Render Engines
   ========================================== */
function renderApp() {
  document.getElementById('app').classList.remove('hidden');
  
  // Render welcome message
  document.getElementById('greeting').innerHTML = `Welcome back, <span class="text-accent">${state.profile.name}</span>`;
  
  // Render KPI values
  document.getElementById('netWorth').textContent = `₹${state.metrics.netWorth.toLocaleString()}`;
  document.getElementById('savingsRate').textContent = `${state.metrics.savingsRate.toFixed(1)}%`;
  document.getElementById('burnRate').textContent = `${state.metrics.burnRate} Days`;
  
  // Render Aura Badge
  const badge = document.getElementById('auraBadge');
  badge.textContent = state.aura;
  badge.className = "aura-badge-main"; // Clear existing
  if (state.aura === "Chaotic") badge.classList.add("aura-chaos");
  else if (state.aura === "Delusional") badge.classList.add("aura-delusional");
  else if (state.aura === "Wealthy") badge.classList.add("aura-wealthy");
  else badge.classList.add("aura-stable");

  // Render Insights list
  const list = document.getElementById('insightList');
  list.innerHTML = '';
  state.insights.forEach(txt => {
    const li = document.createElement('li');
    li.textContent = txt;
    list.appendChild(li);
  });

  renderJars();
  renderFutureChart();
  renderChat();
}

function renderJars() {
  const container = document.getElementById('jarsList');
  container.innerHTML = '';
  
  state.jars.forEach((jar, index) => {
    const pct = Math.min(100, Math.round((jar.saved / jar.target) * 100));
    
    const div = document.createElement('div');
    div.className = "jar-item";
    div.innerHTML = `
      <div class="jar-meta">
        <span class="jar-title"><i class="fa-solid fa-folder-open text-accent"></i> ${jar.name}</span>
        <span class="jar-amounts">₹${jar.saved.toLocaleString()} / ₹${jar.target.toLocaleString()} (${pct}%)</span>
      </div>
      <div class="jar-bar-bg">
        <div class="jar-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderChat() {
  const container = document.getElementById('chatLog');
  container.innerHTML = '';
  
  // Provide initial message if history is empty
  if (state.chatHistory.length === 0) {
    state.chatHistory.push({
      from: 'bot',
      text: `Systems fully online. I am Antigravity, your capital acceleration partner. Submit financial data files or ask questions to audit your wealth coordinates.`
    });
  }
  
  state.chatHistory.forEach(msg => {
    const div = document.createElement('div');
    div.className = `msg-bubble ${msg.from}`;
    div.textContent = msg.text;
    container.appendChild(div);
  });
  
  container.scrollTop = container.scrollHeight;
}

function renderFutureChart() {
  if (!state.profile) return;
  const p = state.profile;
  const ctx = document.getElementById('futureChart').getContext('2d');
  
  // Calculate compounding variables
  const currentSurplus = Math.max(0, (p.income - p.expenses) * 12);
  const years = [];
  const compValues = [];
  const baseValues = []; // Linear projection for comparison
  
  let compSum = state.metrics.netWorth;
  let baseSum = state.metrics.netWorth;
  const rate = 0.10; // Estimated market rate
  
  for (let i = 0; i <= 15; i++) {
    years.push(`Age ${p.age + i}`);
    compValues.push(Math.round(compSum));
    baseValues.push(Math.round(baseSum));
    
    // Compounding math: previous sum * growth rate + new savings
    compSum = compSum * (1 + rate) + currentSurplus;
    baseSum = baseSum + currentSurplus;
  }

  // Clear previous chart instance to avoid drawing bugs
  if (futureChartInstance) {
    futureChartInstance.destroy();
  }

  // Create highly premium neon charts with glowing properties
  futureChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Antigravity Accelerated',
          data: compValues,
          borderColor: '#00f2fe',
          borderWidth: 3,
          backgroundColor: 'rgba(0, 242, 254, 0.04)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6
        },
        {
          label: 'Standard Savings Vector',
          data: baseValues,
          borderColor: '#ff007f',
          borderWidth: 2,
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.1,
          pointBackgroundColor: '#ff007f'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Outfit', size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: {
            color: 'rgba(255,255,255,0.5)',
            font: { family: 'Inter' },
            callback: function(val) { return '₹' + (val / 100000).toFixed(0) + 'L'; }
          }
        }
      }
    }
  });

  // Future metric calculations text display
  const finalFutureValue = compValues[compValues.length - 1];
  const finalBaseValue = baseValues[baseValues.length - 1];
  const gain = finalFutureValue - finalBaseValue;

  const textDiv = document.getElementById('futureText');
  textDiv.innerHTML = `
    <div class="sub-projection-item">
      <span>Year 15 Target Cap</span>
      <strong>₹${Math.round(finalFutureValue / 100000).toFixed(1)} Lakhs</strong>
    </div>
    <div class="sub-projection-item">
      <span>Gravity Drag Loss</span>
      <strong style="color:var(--magenta)">₹${Math.round(finalBaseValue / 100000).toFixed(1)} Lakhs</strong>
    </div>
    <div class="sub-projection-item">
      <span>Acceleration Yield</span>
      <strong style="color:var(--emerald)">+₹${Math.round(gain / 100000).toFixed(1)} Lakhs</strong>
    </div>
  `;
}

/* ==========================================
   5. Interactive Form Handlers & Modal Triggers
   ========================================== */
function showOnboarding() {
  document.getElementById('onboard').showModal();
}

document.getElementById('onboardForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  state.profile = {
    name: form.name.value.trim(),
    age: parseInt(form.age.value),
    income: parseFloat(form.income.value),
    expenses: parseFloat(form.expenses.value),
    debt: parseFloat(form.debt.value),
    goal: parseFloat(form.goal.value)
  };
  
  // Seed default emergency jar based on their monthly expenses
  state.jars[0].target = state.profile.expenses * 6;
  state.jars[0].saved = state.profile.expenses * 2;
  
  document.getElementById('onboard').close();
  calculateAuraAndMetrics();
  renderApp();
  saveState();
});

// Chat submission handler
document.getElementById('chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const txt = input.value.trim();
  if (!txt) return;
  input.value = '';
  processUserMessage(txt);
});

// Suggestion buttons
document.getElementById('chatSuggestions').addEventListener('click', e => {
  if (e.target.classList.contains('sugg-btn')) {
    const q = e.target.getAttribute('data-query');
    processUserMessage(q);
  }
});

// Theme switcher (Glassmorphic Light Mode/Dark Mode)
document.getElementById('themeToggle').addEventListener('click', () => {
  const body = document.body;
  const icon = document.querySelector('#themeToggle i');
  if (body.classList.contains('theme-dark')) {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    icon.className = "fa-solid fa-sun";
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    icon.className = "fa-regular fa-moon";
  }
});

// Profile reset
document.getElementById('resetProfile').addEventListener('click', () => {
  if (confirm("Reset financial coordinates and erase local session memory?")) {
    localStorage.removeItem('ploutos_state_v2');
    window.location.reload();
  }
});

// Adding new jars
const jarModal = document.getElementById('jarModal');
document.getElementById('addJarBtn').addEventListener('click', () => jarModal.showModal());
document.getElementById('closeJarModal').addEventListener('click', () => jarModal.close());

document.getElementById('jarForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('jarName').value.trim();
  const target = parseFloat(document.getElementById('jarTarget').value);
  const saved = parseFloat(document.getElementById('jarSaved').value);
  
  state.jars.push({ name, target, saved });
  jarModal.close();
  e.target.reset();
  
  calculateAuraAndMetrics();
  renderApp();
  saveState();
});

/* ==========================================
   6. Boot System Initializer
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (!state.profile) {
    showOnboarding();
  } else {
    calculateAuraAndMetrics();
    renderApp();
  }
});
