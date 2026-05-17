/* ===== 💖 Romantic Website - Enhanced JS ===== */

let currentSlide = 0;
const totalSlides = 9;
let audioCtx = null;
let ytPlayer = null;
let musicStarted = false;

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loadingScreen').classList.add('hidden'), 2800);
});

// ===== YOUTUBE BACKGROUND MUSIC =====
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '1', width: '1',
    videoId: 'BksBNbTIoPE',
    playerVars: { autoplay: 0, loop: 1, playlist: 'BksBNbTIoPE', controls: 0, showinfo: 0, modestbranding: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: function (e) { e.target.setVolume(0); },
      onStateChange: function (e) {
        // If ended, replay (backup for loop)
        if (e.data === YT.PlayerState.ENDED) { e.target.playVideo(); }
      }
    }
  });
};

function tryStartMusic() {
  if (musicStarted || !ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
  try {
    ytPlayer.playVideo();
    musicStarted = true;
    // Smooth fade-in over 3 seconds
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol += 2;
      if (vol >= 35) { clearInterval(fadeIn); vol = 35; }
      try { ytPlayer.setVolume(vol); } catch (e) {}
    }, 100);
  } catch (e) { /* silent */ }
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  if (Math.random() < 0.35) createSparkle(mouseX, mouseY);
  applyParallax(e);
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

function createSparkle(x, y) {
  const s = document.createElement('div');
  s.className = 'sparkle-particle';
  const dx = (Math.random() - 0.5) * 30;
  const dy = -(Math.random() * 25 + 5);
  s.style.left = (x + dx * 0.3) + 'px';
  s.style.top = (y + dy * 0.3) + 'px';
  s.style.setProperty('--dx', dx + 'px');
  s.style.setProperty('--dy', dy + 'px');
  const colors = ['#FB6F92', '#FF8FAB', '#FFB3C1', '#D0BFFF', '#BE95FF', '#9F67FF', '#fff'];
  s.style.background = colors[Math.floor(Math.random() * colors.length)];
  const sz = 3 + Math.random() * 5;
  s.style.width = sz + 'px'; s.style.height = sz + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

// ===== PARALLAX =====
function applyParallax(e) {
  const card = document.querySelector('.slide.active .glass-card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  const dx = (e.clientX - r.left - r.width / 2) / r.width;
  const dy = (e.clientY - r.top - r.height / 2) / r.height;
  card.style.transform = `perspective(800px) rotateY(${dx * 2}deg) rotateX(${-dy * 2}deg) scale(1.003)`;
}
document.addEventListener('mouseleave', () => {
  const c = document.querySelector('.slide.active .glass-card');
  if (c) c.style.transform = '';
});

// ===== SLIDE NAVIGATION =====
function goToSlide(index) {
  if (index < 0 || index >= totalSlides || index === currentSlide) return;
  tryStartMusic();
  playClickSound();
  const prev = document.getElementById('slide-' + currentSlide);
  const next = document.getElementById('slide-' + index);
  const dir = index > currentSlide ? 'left' : 'right';
  prev.classList.remove('active');
  prev.classList.add('exit-' + dir);
  const pc = prev.querySelector('.glass-card');
  if (pc) pc.style.transform = '';
  setTimeout(() => {
    prev.classList.remove('exit-' + dir);
    next.classList.add('active');
    currentSlide = index;
    animateTextReveal(next);
    if (index === 7 || index === 8) triggerHeartRain();
    if (index === 8) setTimeout(triggerFinalExplosion, 500);
  }, 350);
}

function animateTextReveal(slide) {
  const el = slide.querySelector('.card-text, .final-poem, .title-text, .final-intro');
  if (!el) return;
  el.classList.remove('text-reveal');
  void el.offsetWidth;
  el.classList.add('text-reveal');
}

// ===== CLICK SOUND =====
function playClickSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o1.connect(g); o2.connect(g); g.connect(audioCtx.destination);
    o1.type = 'sine'; o2.type = 'triangle';
    o1.frequency.setValueAtTime(880, audioCtx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.06);
    o2.frequency.setValueAtTime(1100, audioCtx.currentTime);
    o2.frequency.exponentialRampToValueAtTime(660, audioCtx.currentTime + 0.12);
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    o1.start(audioCtx.currentTime); o2.start(audioCtx.currentTime);
    o1.stop(audioCtx.currentTime + 0.25); o2.stop(audioCtx.currentTime + 0.25);
  } catch (e) {}
}

// ===== BUTTON RIPPLE =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rip = document.createElement('span');
    rip.className = 'btn-ripple';
    const r = this.getBoundingClientRect();
    const sz = Math.max(r.width, r.height);
    rip.style.width = rip.style.height = sz + 'px';
    rip.style.left = (e.clientX - r.left - sz / 2) + 'px';
    rip.style.top = (e.clientY - r.top - sz / 2) + 'px';
    this.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  });
});

// ===== FLOATING ELEMENTS =====
const floatContainer = document.getElementById('floatingContainer');
const floatPool = [
  { items: ['💖','💕','💗','💝','💘','♥️'], w: 35 },
  { items: ['🌸','🌺','🌷'], w: 20 },
  { items: ['✨','⭐','🌟','💫'], w: 18 },
  { items: ['🐱','😸','😻','🐾'], w: 12 },
  { items: ['🦋'], w: 5 }
];

function pickEmoji() {
  const total = floatPool.reduce((s, g) => s + g.w, 0);
  let r = Math.random() * total;
  for (const g of floatPool) { r -= g.w; if (r <= 0) return g.items[Math.floor(Math.random() * g.items.length)]; }
  return '💖';
}

function createFloatingEl() {
  const el = document.createElement('div');
  const isBlossom = Math.random() < 0.15;
  el.className = 'floating-el' + (isBlossom ? ' blossom' : '');
  el.textContent = isBlossom ? '🌸' : pickEmoji();
  el.style.left = Math.random() * 100 + '%';
  el.style.fontSize = (13 + Math.random() * 15) + 'px';
  const dur = 10 + Math.random() * 15;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = Math.random() * 4 + 's';
  el.style.setProperty('--mo', (0.25 + Math.random() * 0.2).toFixed(2));
  el.style.setProperty('--rot', (180 + Math.random() * 360) + 'deg');
  floatContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 5) * 1000);
}
setInterval(createFloatingEl, 600);
for (let i = 0; i < 20; i++) setTimeout(createFloatingEl, i * 150);

// ===== HEART RAIN =====
function triggerHeartRain() {
  const c = document.getElementById('heartRain');
  const em = ['💖','💕','💗','❤️','💘','🌹','🌸','✨'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'rain-heart';
      h.textContent = em[Math.floor(Math.random() * em.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (14 + Math.random() * 22) + 'px';
      const d = 2 + Math.random() * 3;
      h.style.animationDuration = d + 's';
      c.appendChild(h);
      setTimeout(() => h.remove(), d * 1000 + 100);
    }, i * 60);
  }
}
setInterval(triggerHeartRain, 25000);

// ===== FINAL EXPLOSION =====
function triggerFinalExplosion() {
  const c = document.getElementById('heartRain');
  const em = ['💖','💕','💗','❤️','💘','🌹','✨','🌸','💝','🐱','😻'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'rain-heart';
      h.textContent = em[Math.floor(Math.random() * em.length)];
      h.style.left = (40 + Math.random() * 20) + '%';
      h.style.top = '40%';
      h.style.fontSize = (16 + Math.random() * 28) + 'px';
      h.style.animation = 'none';
      h.style.transition = 'all 1.5s cubic-bezier(.25,.46,.45,.94)';
      h.style.opacity = '1';
      c.appendChild(h);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 300;
      requestAnimationFrame(() => {
        h.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) rotate(${Math.random()*720}deg) scale(0.3)`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), 1800);
    }, i * 25);
  }
}

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(currentSlide + 1);
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(currentSlide - 1);
});

// ===== TOUCH SWIPE =====
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; tryStartMusic(); }, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) { dx < 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1); }
}, { passive: true });

// ===== HIDE CURSOR ON TOUCH =====
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
  document.querySelectorAll('.btn').forEach(b => b.style.cursor = 'pointer');
}

// ===== INITIAL =====
setTimeout(triggerHeartRain, 3500);
document.addEventListener('click', tryStartMusic, { once: true });
