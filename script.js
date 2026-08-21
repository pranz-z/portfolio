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
  if (event.key !== 'Tab') return;

  let container = null;
  if (isLightboxOpen()) {
    container = lightbox.querySelector('.lightbox-panel');
  } else if (isDossierOpen()) {
    container = dossier.querySelector('.dossier-panel');
  } else if (isMenuOpen()) {
    container = hunterMenu.querySelector('.hunter-menu-panel');
  }
  if (!container) return;

  const focusable = getFocusableElements(container);
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

  if (isLightboxOpen()) {
    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      stepLightbox(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    trapFocus(event);
    return;
  }

  if (isDossierOpen()) {
    if (event.key === 'Escape') {
      closeDossier();
      return;
    }
    trapFocus(event);
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
    screenshots: [
      {
        src: 'assets/thesis-sim-vehicle.jpg',
        alt: 'AR thesis app 3D vehicle model with interactive service hotspots',
        caption: '3D sedan model with tap-to-inspect component hotspots',
      },
      {
        src: 'assets/thesis-sim-wheel.jpg',
        alt: 'AR thesis app guided wheel disassembly step',
        caption: 'Guided disassembly — front wheel, remove-screw step',
      },
      {
        src: 'assets/thesis-sim-caliper.jpg',
        alt: 'AR thesis app brake caliper simulation step',
        caption: 'Brake caliper simulation — step-by-step removal sequence',
      },
      {
        src: 'assets/thesis-ai-detection.jpg',
        alt: 'AR thesis app real-time YOLO component detection on a live engine bay',
        caption: 'Real-time AI detection — engine components identified with confidence scores',
      },
    ],
    dossier: {
      overview: [
        'A mobile AR and AI training tool built with a team of co-researchers for our undergraduate thesis. It pairs a real-time object detector with an AR-rendered 3D vehicle model so automotive students can practice identifying and disassembling sedan and SUV components without needing an actual car on a lift.',
        'The system runs two complementary modes: a guided 3D simulation that walks a learner through a full disassembly sequence step by step, and a live camera mode that recognizes real engine components through the phone\u2019s camera and labels them in real time.',
      ],
      role: 'Co-developer and system architect on the team — owned the end-to-end technical layout (data flow and entity-relationship diagrams), the on-device AI inference pipeline, and the Unity-side rendering tying the 3D simulation to real-time detection.',
      stack: ['Unity Engine', 'Unity Sentis', 'YOLO Object Detection', 'C#', 'Firebase / Firestore', 'Augmented Reality'],
      highlights: [
        'Ran real-time component recognition on-device by wiring a YOLO model through Unity Sentis, so identification works without a server round-trip.',
        'Built a guided step-by-step disassembly simulation (wheel, brake caliper, and more) so learners can practice a full removal sequence entirely in AR.',
        'Piloted the system with automotive technology students to evaluate usability and learning impact against traditional hands-on training.',
      ],
    },
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
    screenshots: [
      {
        src: 'assets/adsumus-report.jpg',
        alt: 'Adsumus Dispatch client emergency reporting screen',
        caption: 'Client app — emergency type selection with SOS/Panic and Custom Report',
      },
      {
        src: 'assets/adsumus-map.jpg',
        alt: 'Adsumus Dispatch live dispatch map screen',
        caption: 'Live dispatch map with current assignments feed',
      },
      {
        src: 'assets/adsumus-responder.jpg',
        alt: 'Adsumus Dispatch responder portal screen',
        caption: 'Responder Portal — online status, live pin, and assignment queue',
      },
    ],
    dossier: {
      overview: [
        'Adsumus Dispatch is a real-time emergency response platform. Clients report a Medical, Fire, Crime, or Accident emergency — or hit the SOS/Panic button — and nearby responders see the request appear on a live map, accept it, and get tracked all the way to the scene.',
        'Built during a technical internship at BMWare, alongside InsureMe, a companion digital insurance product for the same client base.',
      ],
      role: 'Mobile and systems engineering intern — built the cross-platform client and responder apps, and worked on the backend services connecting them in a Great Place to Work-certified engineering team.',
      stack: ['Flutter / Dart', 'PHP Laravel', 'Firebase / Firestore', 'Real-Time GPS Tracking', 'PayPal SDK (sandboxed)'],
      highlights: [
        'Built both the client-facing emergency reporting app and the Responder Portal (online toggle, live assignment queue, status tracking) in Flutter.',
        'Designed microservices and state-sync fallback handling so dispatch stays consistent even on a flaky connection.',
        'Architected InsureMe, a digital insurance product, sandboxing the PayPal SDK to keep payment liability off the local runtime.',
      ],
    },
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
    dossier: {
      overview: [
        'An immersive, multi-user WebXR classroom that runs straight in the browser — no headset or native app install required — aimed at lowering the barrier to entry for VR-based learning, especially on lower-end mobile hardware.',
      ],
      role: 'Full-stack developer — built the 3D scene rendering, the backend, and the real-time multiplayer synchronization that lets multiple students share the same virtual space.',
      stack: ['A-Frame', 'WebXR', 'Node.js', 'Real-Time Multiplayer Sync'],
      highlights: [
        'Rendered high-fidelity 3D classrooms over standard HTTP using A-Frame, avoiding the need for a dedicated VR client.',
        'Structured authentication and real-time multiplayer state sync so multiple students can share the same virtual space at once.',
        'Optimized asset memory footprint specifically for resource-constrained mobile browsers to keep latency low.',
      ],
    },
  },
};

const questRows = document.querySelectorAll('.quest-row');
const questTitle = document.querySelector('.quest-detail-title');
const questLevel = document.querySelector('.quest-detail-level');
const questCopy = document.querySelector('.quest-detail-copy');
const questObjectives = document.querySelector('.quest-objectives');
const questGallery = document.getElementById('questGallery');
const questGalleryStrip = document.getElementById('questGalleryStrip');
const dossierTrigger = document.getElementById('dossierTrigger');

let currentGalleryShots = [];
let currentQuestKey = 'ultimate';

function renderQuestGallery(quest) {
  const shots = quest.screenshots || [];
  currentGalleryShots = shots;

  if (!questGallery || !questGalleryStrip) return;

  if (!shots.length) {
    questGallery.hidden = true;
    questGalleryStrip.innerHTML = '';
    return;
  }

  questGallery.hidden = false;
  questGalleryStrip.innerHTML = shots
    .map(
      (shot, index) => `
        <button class="quest-gallery-thumb" type="button" data-shot-index="${index}" aria-label="View screenshot: ${shot.alt}">
          <img src="${shot.src}" alt="${shot.alt}" loading="lazy" />
        </button>
      `
    )
    .join('');

  questGalleryStrip.querySelectorAll('.quest-gallery-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      openLightbox(Number(thumb.dataset.shotIndex));
    });
  });
}

function setActiveQuest(key) {
  const quest = quests[key];
  if (!quest) return;

  currentQuestKey = key;

  questRows.forEach((row) => {
    row.classList.toggle('active', row.dataset.quest === key);
  });

  questTitle.textContent = quest.title;
  questLevel.textContent = quest.level;
  questCopy.textContent = quest.narrative;
  questObjectives.innerHTML = quest.objectives
    .map((objective) => `<li>♦ ${objective}</li>`)
    .join('');
  renderQuestGallery(quest);

  if (dossierTrigger) {
    dossierTrigger.hidden = !quest.dossier;
  }
}

renderQuestGallery(quests.ultimate);

questRows.forEach((row) => {
  row.addEventListener('click', () => setActiveQuest(row.dataset.quest));
});

dossierTrigger?.addEventListener('click', () => {
  const quest = quests[currentQuestKey];
  if (quest?.dossier) openDossier(quest);
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

/* ---------- Project dossier ---------- */

const dossier = document.getElementById('dossier');
const dossierEyebrow = document.getElementById('dossierEyebrow');
const dossierTitle = document.getElementById('dossierTitle');
const dossierBody = document.getElementById('dossierBody');
let dossierLastFocused = null;

function isDossierOpen() {
  return Boolean(dossier) && dossier.classList.contains('visible');
}

function renderDossierBody(quest) {
  if (!dossierBody) return;
  const d = quest.dossier;
  if (!d) {
    dossierBody.innerHTML = '';
    return;
  }

  const overviewHtml = (d.overview || [])
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');

  const stackHtml = (d.stack || [])
    .map((tag) => `<span class="dossier-stack-tag">${tag}</span>`)
    .join('');

  const highlightsHtml = (d.highlights || [])
    .map((item) => `<li>${item}</li>`)
    .join('');

  const shots = quest.screenshots || [];
  const galleryHtml = shots.length
    ? `
      <section>
        <h3 class="dossier-section-label">Field Captures</h3>
        <div class="dossier-gallery">
          ${shots
            .map(
              (shot, index) => `
                <button class="dossier-gallery-thumb" type="button" data-shot-index="${index}" aria-label="View screenshot: ${shot.alt}">
                  <img src="${shot.src}" alt="${shot.alt}" loading="lazy" />
                </button>
              `
            )
            .join('')}
        </div>
      </section>
    `
    : '';

  dossierBody.innerHTML = `
    <section class="dossier-overview">
      <h3 class="dossier-section-label">Overview</h3>
      ${overviewHtml}
    </section>
    <section>
      <h3 class="dossier-section-label">My Role</h3>
      <p class="dossier-role">${d.role || ''}</p>
    </section>
    <section>
      <h3 class="dossier-section-label">Tech Stack</h3>
      <div class="dossier-stack">${stackHtml}</div>
    </section>
    <section>
      <h3 class="dossier-section-label">Highlights</h3>
      <ul class="dossier-highlights">${highlightsHtml}</ul>
    </section>
    ${galleryHtml}
  `;

  dossierBody.querySelectorAll('.dossier-gallery-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      currentGalleryShots = shots;
      openLightbox(Number(thumb.dataset.shotIndex));
    });
  });
}

function openDossier(quest) {
  if (!dossier || !quest.dossier) return;
  dossierLastFocused = document.activeElement;
  if (dossierEyebrow) dossierEyebrow.textContent = "Hunter's Notes — Field Dossier";
  if (dossierTitle) dossierTitle.textContent = quest.title;
  renderDossierBody(quest);
  dossier.classList.add('visible');
  dossier.setAttribute('aria-hidden', 'false');
  dossier.querySelector('.modal-close')?.focus();
}

function closeDossier() {
  if (!isDossierOpen()) return;
  dossier.classList.remove('visible');
  dossier.setAttribute('aria-hidden', 'true');
  dossierLastFocused?.focus();
}

document.querySelectorAll('[data-dossier-close]').forEach((el) => {
  el.addEventListener('click', closeDossier);
});

/* ---------- Screenshot lightbox ---------- */

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let lightboxIndex = 0;
let lightboxLastFocused = null;

function isLightboxOpen() {
  return Boolean(lightbox) && lightbox.classList.contains('visible');
}

function renderLightboxShot() {
  const shot = currentGalleryShots[lightboxIndex];
  if (!shot || !lightboxImage) return;
  lightboxImage.src = shot.src;
  lightboxImage.alt = shot.alt;
  if (lightboxCaption) lightboxCaption.textContent = shot.caption || '';
}

function openLightbox(index) {
  if (!lightbox || !currentGalleryShots.length) return;
  lightboxIndex = ((index % currentGalleryShots.length) + currentGalleryShots.length) % currentGalleryShots.length;
  lightboxLastFocused = document.activeElement;
  renderLightboxShot();
  lightbox.classList.add('visible');
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.querySelector('.lightbox-close')?.focus();
}

function closeLightbox() {
  if (!isLightboxOpen()) return;
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxLastFocused?.focus();
}

function stepLightbox(direction) {
  if (!currentGalleryShots.length) return;
  lightboxIndex = ((lightboxIndex + direction) % currentGalleryShots.length + currentGalleryShots.length) % currentGalleryShots.length;
  renderLightboxShot();
}

document.querySelectorAll('[data-lightbox-close]').forEach((el) => {
  el.addEventListener('click', closeLightbox);
});

document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => stepLightbox(-1));
document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => stepLightbox(1));
