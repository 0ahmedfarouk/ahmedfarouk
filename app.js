const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const typingEl = document.getElementById('typingText');

menuBtn?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const phrases = [
  'برمجة مواقع احترافية',
  'تصميمات سوشيال وبراندنج',
  'صفحات هبوط وPortfolio',
  'UI/UX بشكل رايق وسريع'
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    charIndex += 1;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tick, 1300);
      return;
    }
  } else {
    charIndex -= 1;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(tick, deleting ? 45 : 65);
}

typingEl.textContent = '';
tick();

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.55 });

document.querySelectorAll('section[id]').forEach(section => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


const visitorCountEl = document.getElementById('visitorCount');
if (visitorCountEl) {
  const target = 80433;
  const duration = 1400;
  const start = performance.now();
  const startValue = 0;

  function formatNumber(value) {
    return Math.floor(value).toLocaleString('en-US');
  }

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (target - startValue) * eased;
    visitorCountEl.textContent = formatNumber(current);
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
