// quick load log
console.info('script.js loaded');

// Initialization and state (assigned on DOMContentLoaded)
let yesBtn;
let noBtn;
let note;
let hearts;
let cute;
// phone number to receive SMS; using international format
const ALERT_NUMBER = '+917670874133';

// basic mobile detection — only attempt sms: navigation on mobile devices
const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function sendSmsLink(message) {
  if (!isMobile) {
    // On desktop browsers `sms:` often does nothing or blocks further script execution.
    // Skip navigation and log so the UI interactions remain responsive on desktop.
    console.info('Skipping sms: navigation on non-mobile device. Message:', message);
    return;
  }

  try {
    const uri = `sms:${ALERT_NUMBER}?body=${encodeURIComponent(message)}`;
    // open the SMS composer on mobile devices
    window.location.href = uri;
  } catch (e) {
    console.warn('Could not open SMS app', e);
  }
}

let sizeLevel = 0; // increments on each No click (1..5)
const MAX = 5; // after 5 increases, the next No (6th) hides Yes
let yesCount = 0;
let noCount = 0;

// store base button metrics so growth affects layout (not transform)
let baseMetrics = { font: 16, padY: 12, padX: 16, radius: 10 };

function init() {
  yesBtn = document.getElementById('yesBtn');
  noBtn = document.getElementById('noBtn');
  note = document.getElementById('note');
  hearts = document.getElementById('hearts');
  cute = document.getElementById('cute');

  // compute baseMetrics now that `yesBtn` exists
  if (yesBtn) {
    const cs = getComputedStyle(yesBtn);
    baseMetrics = {
      font: parseFloat(cs.fontSize) || baseMetrics.font,
      padY: parseFloat(cs.paddingTop) || baseMetrics.padY,
      padX: parseFloat(cs.paddingLeft) || baseMetrics.padX,
      radius: parseFloat(cs.borderRadius) || baseMetrics.radius
    };
  }

  // Attach handlers
  if (noBtn) noBtn.addEventListener('click', handleNo);
  if (yesBtn) yesBtn.addEventListener('click', handleYes);

  console.info('script.js initialized', { yesBtn: !!yesBtn, noBtn: !!noBtn, hearts: !!hearts, cute: !!cute });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(init, 0);
} else {
  document.addEventListener('DOMContentLoaded', init);
}

function handleYes() {
  // Update UI first, then attempt to open SMS composer on mobile (delayed)
  // Always change the image (with fade)
  if (cute) {
    const newSrc = 'pictures/baby-yoda.webp';
    cute.style.transition = 'opacity 220ms ease';
    cute.style.opacity = '0';
    setTimeout(() => {
      cute.src = newSrc;
      cute.onload = () => { cute.style.opacity = '1'; };
      setTimeout(() => { cute.style.opacity = '1'; }, 300);
    }, 220);
  }

  // Then show the final message and hide buttons
  const btns = document.querySelector('.btns');
  if (yesBtn) {
    yesBtn.style.transition = 'all 300ms ease';
    yesBtn.style.transform = 'scale(0)';
    yesBtn.style.opacity = '0';
  }
  setTimeout(() => {
    if (btns) btns.innerHTML = `<p class="note">yes veldammmmm....</p>`;
  }, 260);
  if (noBtn) noBtn.disabled = true;

  // Delay SMS navigation so UI updates are visible before any navigation occurs
  setTimeout(() => sendSmsLink('yes veldammmmm....'), 300);
}

function pushNo() {
  noCount += 1;
}

function updateYesText() {
  if (!yesBtn) return;
  yesBtn.textContent = 'Yes';
}


function applyScale(level) {
  if (!yesBtn) return;
  const scale = Math.pow(1.4, level); // 1.2× growth per level
  yesBtn.style.transition = 'font-size 220ms ease, padding 220ms ease, border-radius 220ms ease';
  yesBtn.style.display = 'inline-block';
  yesBtn.style.boxSizing = 'border-box';
  yesBtn.style.fontSize = `${baseMetrics.font * scale}px`;
  yesBtn.style.padding = `${baseMetrics.padY * scale}px ${baseMetrics.padX * scale}px`;
  yesBtn.style.borderRadius = `${baseMetrics.radius * scale}px`;
}

function pulseYes() {
  if (!yesBtn) return;
  const orig = yesBtn.style.boxShadow || '';
  yesBtn.style.transition = 'box-shadow 140ms ease';
  yesBtn.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)';
  setTimeout(() => {
    yesBtn.style.boxShadow = orig;
  }, 180);
}

function spawnHearts(count = 4) {
  if (!hearts) return;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    // random horizontal offset centered around 50%
    const left = 40 + Math.random() * 20; // 40%..60%
    h.style.left = `${left}%`;
    h.style.top = `${40 + Math.random() * 20}%`;
    const dur = 1400 + Math.floor(Math.random() * 800);
    const delay = Math.floor(Math.random() * 200);
    h.style.animation = `heart-rise ${dur}ms linear ${delay}ms forwards`;
    hearts.appendChild(h);

    // cleanup
    setTimeout(() => {
      if (h && h.parentNode) h.parentNode.removeChild(h);
    }, dur + delay + 200);
  }
}

function handleNo() {
  // Update UI first, then attempt to open SMS composer on mobile (delayed)
  // We delay SMS navigation so that DOM changes complete and are visible.
  pushNo();

  // For first 5 clicks → grow YES exponentially
  if (sizeLevel < MAX) {
    sizeLevel += 1;

    yesCount = sizeLevel;
    updateYesText();

    applyScale(sizeLevel);
    pulseYes();
    spawnHearts(4);

    if (note) note.textContent = '';
  } 
  // 6th click → disappear YES and show message
  else {
    if (yesBtn) {
      yesBtn.style.transition = 'all 400ms ease';
      yesBtn.style.transform = 'scale(0)';
      yesBtn.style.opacity = '0';
    }

    setTimeout(() => {
      const btns = document.querySelector('.btns');
      if (btns) {
        btns.innerHTML = `<p class="note">I know you will agree.. abbbaa... ❤️</p>`;
      }
    }, 350);

    // also swap the image when we show the final message
    if (cute) {
      cute.style.transition = 'opacity 220ms ease';
      cute.style.opacity = '0';
      setTimeout(() => {
        cute.src = 'pictures/baby-yoda.webp';
        cute.onload = () => { cute.style.opacity = '1'; };
        setTimeout(() => { cute.style.opacity = '1'; }, 300);
      }, 220);
    }

    if (noBtn) noBtn.disabled = true;

    // Delay SMS navigation so UI updates finish
    setTimeout(() => sendSmsLink('yesss veldammm'), 300);
  }
}
