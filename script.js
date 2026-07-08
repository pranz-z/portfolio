const splashScreen = document.getElementById('splashScreen');
const mainScreen = document.getElementById('mainScreen');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const backdrop = document.getElementById('backdrop');
let activeModal = null;
let lastFocusedElement = null;
let phaseTwo = false;

function revealMainMenu() {
  if (phaseTwo) return;
  phaseTwo = true;
  splashScreen.classList.add('hide');
  mainScreen.classList.add('visible');
  mainScreen.setAttribute('aria-hidden', 'false');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('visible');
  backdrop.hidden = false;
  activeModal = modal;
  modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
  if (!activeModal) return;
  activeModal.classList.remove('visible');
  activeModal.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('visible');
  backdrop.hidden = true;
  activeModal = null;
  lastFocusedElement?.focus();
}

splashScreen.addEventListener('click', revealMainMenu);

document.addEventListener('keydown', (event) => {
  if (!phaseTwo) {
    revealMainMenu();
    return;
  }

  if (event.key === 'Escape') {
    closeModal();
  }
});

menuItems.forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.modal));
});

backdrop.addEventListener('click', closeModal);

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', closeModal);
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal();
    window.alert('Guild dispatch sent. Thank you.');
  });
}

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

const abandonButton = document.querySelector('.action-abandon');
if (abandonButton) {
  abandonButton.addEventListener('click', () => {
    window.alert('Quest abandoned.');
  });
}

const showAllCheckbox = document.querySelector('.show-all-checkbox');
if (showAllCheckbox) {
  showAllCheckbox.addEventListener('change', () => {
    const activeQuests = document.querySelectorAll('.quest-row:not(.active)');
    activeQuests.forEach((row) => {
      row.style.display = showAllCheckbox.checked ? 'grid' : 'none';
    });
  });
}
