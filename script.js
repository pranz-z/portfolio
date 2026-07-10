const splashScreen = document.getElementById('splashScreen');
const mainScreen = document.getElementById('mainScreen');
const bootSweep = document.getElementById('bootSweep');
const menuItems = document.querySelectorAll('.menu-item');
const heroTag = document.getElementById('heroTag');
const heroTitle = document.getElementById('heroTitle');

const hunterMenu = document.getElementById('hunterMenu');
const hunterTabs = Array.from(document.querySelectorAll('.hunter-tab'));
const hunterPanels = Array.from(document.querySelectorAll('.hunter-panel'));
const prevTabButton = document.querySelector('[data-prev-tab]');
const nextTabButton = document.querySelector('[data-next-tab]');
const tabOrder = hunterTabs.map((tab) => tab.dataset.tab);

let phaseTwo = false;
let activeTab = tabOrder[0];
let lastFocusedElement = null;

const defaultHero = {
  tag: heroTag ? heroTag.textContent : '',
  title: heroTitle ? heroTitle.textContent : '',
};

/* ---------- Boot sequence ---------- */

function revealMainMenu() {
  if (phaseTwo) return;
  phaseTwo = true;
  splashScreen.classList.add('hide');
  mainScreen.classList.add('visible');
  mainScreen.setAttribute('aria-hidden', 'false');

  if (bootSweep) {
    bootSweep.classList.add('active');
    window.setTimeout(() => bootSweep.classList.remove('active'), 800);
  }
}

splashScreen.addEventListener('click', revealMainMenu);

/* ---------- Hunter's Notes menu (tabs) ---------- */

function setActiveTab(tabName, { focusPanel } = {}) {
  if (!tabOrder.includes(tabName)) return;
  activeTab = tabName;

  hunterTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  hunterPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === tabName);
  });

  if (focusPanel) {
    const panel = hunterPanels.find((p) => p.dataset.panel === tabName);
    panel?.focus?.();
  }
}

function stepTab(direction) {
  const currentIndex = tabOrder.indexOf(activeTab);
  const nextIndex = (currentIndex + direction + tabOrder.length) % tabOrder.length;
  setActiveTab(tabOrder[nextIndex]);
  hunterTabs[nextIndex]?.focus();
}

function openMenu(tabName) {
  lastFocusedElement = document.activeElement;
  setActiveTab(tabName || activeTab);
  hunterMenu.classList.add('visible');
  hunterMenu.setAttribute('aria-hidden', 'false');
  hunterMenu.querySelector('.modal-close')?.focus();
}

function closeMenu() {
  if (!hunterMenu.classList.contains('visible')) return;
  hunterMenu.classList.remove('visible');
  hunterMenu.setAttribute('aria-hidden', 'true');
  lastFocusedElement?.focus();
}

function isMenuOpen() {
  return hunterMenu.classList.contains('visible');
}

menuItems.forEach((button) => {
  button.addEventListener('click', () => openMenu(button.dataset.tab));

  button.addEventListener('mouseenter', () => {
    if (heroTag && button.dataset.previewTag) heroTag.textContent = button.dataset.previewTag;
    if (heroTitle && button.dataset.previewTitle) heroTitle.textContent = button.dataset.previewTitle;
  });

  button.addEventListener('focus', () => {
    if (heroTag && button.dataset.previewTag) heroTag.textContent = button.dataset.previewTag;
    if (heroTitle && button.dataset.previewTitle) heroTitle.textContent = button.dataset.previewTitle;
  });

  button.addEventListener('mouseleave', () => {
    if (heroTag) heroTag.textContent = defaultHero.tag;
    if (heroTitle) heroTitle.textContent = defaultHero.title;
  });

  button.addEventListener('blur', () => {
    if (heroTag) heroTag.textContent = defaultHero.tag;
    if (heroTitle) heroTitle.textContent = defaultHero.title;
  });
});

hunterTabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
});

prevTabButton?.addEventListener('click', () => stepTab(-1));
nextTabButton?.addEventListener('click', () => stepTab(1));

document.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeMenu);
});

/* ---------- Keyboard: boot / close / tab cycling / focus trap ---------- */

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);
}

function trapFocus(event) {
  if (!isMenuOpen() || event.key !== 'Tab') return;
  const focusable = getFocusableElements(hunterMenu.querySelector('.hunter-menu-panel'));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', (event) => {
  if (!phaseTwo) {
    revealMainMenu();
    return;
  }

  if (event.key === 'Escape') {
    closeMenu();
    return;
  }

  if (isMenuOpen() && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault();
    stepTab(event.key === 'ArrowLeft' ? -1 : 1);
    return;
  }

  trapFocus(event);
});

/* ---------- Quest log ---------- */

const quests = {
  ultimate: {
    title: 'THE ULTIMATE WORK EXPERIENCE HUNT',
    level: 'Requirement Level 100 (Immediate Availability)',
    narrative: 'A high-tier campaign to secure a long-term alliance with an industry-leading company. The ideal deployment must offer a competitive gold bounty, an exceptional collaborative environment, and full WFH Remote parameters to maximize technical efficiency.',
    objectives: [
      'Objective: Secure a full-time Full-Stack, Mobile, or AI Engineering position',
      'Objective: Guarantee a Work From Home (WFH) / Fully Remote ecosystem',
      'Objective: Establish synergy with a top-tier team culture (matching Great Place to Work ethos)',
      'Objective: Deploy optimized architectures for a high-value salary bounty',
    ],
  },
  thesis: {
    title: 'THESIS: AI-POWERED MAINTENANCE SIMULATOR',
    level: 'Requirement Level 99 (Research Leader Role)',
    narrative: 'Headed technical development and research layout constraints for a real-time smart object categorization system. Merges raw computer vision modeling with game engine environments for streamlined on-device compute.',
    objectives: [
      'Objective: Architect end-to-end system topologies including complete DFDs and ERDs',
      'Objective: Engineer low-latency on-device AI inference utilizing YOLOv11 and Unity Sentis',
      'Objective: Develop a unified mobile rendering interface via C# scripts within Unity Engine',
      'Objective: Establish real-time data streaming capabilities using a synchronized Firestore NoSQL pipeline',
    ],
  },
  raid: {
    title: 'RAID: THE BMWARE TRIALS',
    level: 'Requirement Level 90 (System Architect & Intern Edition)',
    narrative: 'Deployed as an elite engineering recruit to build cross-platform modular pipelines and bulletproof financial transaction abstraction boundaries in a certified Great Place to Work corporate ecosystem.',
    objectives: [
      'Objective: Build cross-platform mobile frontends in Flutter securely tethered to PHP Laravel APIs',
      'Objective: Design microservices and state sync fallback mechanisms for Adsumus Dispatch real-time logistics',
      'Objective: Architect digital insurance asset InsureMe, deploying a sandboxed PayPal SDK layer to eliminate local runtime liability',
    ],
  },
  webxr: {
    title: 'WEBXR VIRTUAL CLASSROOM',
    level: 'Requirement Level 75 (Full-Stack Sandbox)',
    narrative: 'Construct an immersive multi-user web VR portal built specifically for lightweight mobile browsers, lowering accessibility thresholds worldwide.',
    objectives: [
      'Objective: Render high-fidelity 3D classrooms over standard HTTP networks using A-Frame and Node.js',
      'Objective: Structure secure authentication and real-time multiplayer network state synchronization',
      'Objective: Minimize asset memory layout, slashing latency for resource-constrained mobile hardware',
    ],
  },
};

const questRows = document.querySelectorAll('.quest-row');
const questTitle = document.querySelector('.quest-detail-title');
const questLevel = document.querySelector('.quest-detail-level');
const questCopy = document.querySelector('.quest-detail-copy');
const questObjectives = document.querySelector('.quest-objectives');

function setActiveQuest(key) {
  const quest = quests[key];
  if (!quest) return;

  questRows.forEach((row) => {
    row.classList.toggle('active', row.dataset.quest === key);
  });

  questTitle.textContent = quest.title;
  questLevel.textContent = quest.level;
  questCopy.textContent = quest.narrative;
  questObjectives.innerHTML = quest.objectives
    .map((objective) => `<li>♦ ${objective}</li>`)
    .join('');
}

questRows.forEach((row) => {
  row.addEventListener('click', () => setActiveQuest(row.dataset.quest));
});

const showAllCheckbox = document.querySelector('.show-all-checkbox');
if (showAllCheckbox) {
  showAllCheckbox.addEventListener('change', () => {
    const inactiveQuests = document.querySelectorAll('.quest-row:not(.active)');
    inactiveQuests.forEach((row) => {
      row.style.display = showAllCheckbox.checked ? 'grid' : 'none';
    });
  });
}

/* ---------- Ambient ember particles ---------- */

(function initEmbers() {
  const canvas = document.getElementById('emberCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let rafId = null;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function makeParticle(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 10,
      r: 0.6 + Math.random() * 1.8,
      speed: 0.25 + Math.random() * 0.55,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.15 + Math.random() * 0.5,
      flicker: Math.random() * Math.PI * 2,
    };
  }

  function initParticles() {
    const count = width < 720 ? 18 : 36;
    particles = Array.from({ length: count }, () => makeParticle(true));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      p.flicker += 0.03;

      if (p.y < -10) {
        Object.assign(p, makeParticle(false));
      }

      const twinkle = 0.6 + Math.sin(p.flicker) * 0.4;
      ctx.beginPath();
      ctx.fillStyle = `rgba(224, 196, 127, ${(p.alpha * twinkle).toFixed(3)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = window.requestAnimationFrame(draw);
  }

  function start() {
    if (rafId) return;
    draw();
  }

  function stop() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  resize();
  initParticles();

  if (!prefersReducedMotion) {
    start();
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  document.addEventListener('visibilitychange', () => {
    if (prefersReducedMotion) return;
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
})();
