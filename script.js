'use strict';

/* === Mobile Menu === */
(function () {
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.textContent = isOpen ? '✕' : '☰';
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });

  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    });
  });
})();

/* === Scroll: topbar shadow + nav active === */
(function () {
  var topbar = document.getElementById('topbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    if (topbar) {
      topbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* === Scroll Reveal === */
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Also reveal cards inside sections with a stagger */
  var cards = document.querySelectorAll('.card');
  if ('IntersectionObserver' in window) {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity .55s ease, transform .55s ease';
      cardObserver.observe(card);
    });
  }
})();

/* === Typing Effect === */
(function () {
  var el = document.getElementById('typingText');
  if (!el) return;

  var items = [
    'مواقع شخصية احترافية',
    'هوية بصرية متكاملة',
    'تصميمات سوشيال',
    'صفحات هبوط',
    'واجهات عصرية'
  ];

  var current = 0;
  var charIndex = 0;
  var deleting = false;
  var pauseFrames = 0;

  function tick() {
    var word = items[current];

    if (pauseFrames > 0) {
      pauseFrames--;
      setTimeout(tick, 80);
      return;
    }

    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        pauseFrames = 20;
      }
      setTimeout(tick, 90);
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        current = (current + 1) % items.length;
        pauseFrames = 5;
      }
      setTimeout(tick, 55);
    }
  }

  setTimeout(tick, 800);
})();

/* === Visitor Counter Count-Up === */
(function () {
  var el = document.getElementById('visitorCount');
  if (!el) return;

  var target = 80433;
  var started = false;

  function countUp() {
    if (started) return;
    started = true;

    var start = 0;
    var duration = 2200;
    var startTime = null;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString('ar-EG');
      if (progress < 1) { requestAnimationFrame(frame); }
      else { el.textContent = target.toLocaleString('ar-EG'); }
    }

    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el.closest('.visitor-counter') || el);
  } else {
    el.textContent = target.toLocaleString('ar-EG');
  }
})();

/* === Skill Cards Staggered Reveal === */
(function () {
  var skillCards = document.querySelectorAll('.skill-card.reveal-card');
  if (!skillCards.length) return;

  if ('IntersectionObserver' in window) {
    var seen = new Set();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          var idx = Array.prototype.indexOf.call(skillCards, entry.target);
          var col = idx % 3;
          setTimeout(function () {
            entry.target.classList.add('in-view');
          }, col * 90);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    skillCards.forEach(function (card) { obs.observe(card); });
  } else {
    skillCards.forEach(function (card) { card.classList.add('in-view'); });
  }
})();

/* === Smooth internal links === */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var topbarH = document.getElementById('topbar')
          ? document.getElementById('topbar').offsetHeight
          : 72;
        var pos = target.getBoundingClientRect().top + window.scrollY - topbarH - 8;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });
})();
