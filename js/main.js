/* =============================================================================
   GREENLIGHT COURIER — main.js
   MigsFlow Web Design

   Loads on EVERY page.

   TABLE OF CONTENTS
   01. Navigation — Scroll Shadow
   02. Navigation — Hamburger & Mobile Drawer
   03. Navigation — Services Dropdown (Desktop)
   04. Navigation — Services Dropdown (Mobile Drawer)
   05. Navigation — Close on Outside Click / Resize
   06. Scroll Animations — IntersectionObserver
   07. Scroll To Top Button
============================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');

  /* ===========================================================================
     01 — NAVIGATION — SCROLL SHADOW
  =========================================================================== */
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }


  /* ===========================================================================
     02 — NAVIGATION — HAMBURGER & MOBILE DRAWER
  =========================================================================== */
  const hamburger   = document.querySelector('.nav-hamburger');
  const drawer      = document.querySelector('.nav-drawer');
  const drawerClose = document.querySelector('.nav-drawer-close');

  function closeMobileMenu() {
    if (!navbar) return;
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('menu-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);

    var navOverlay = document.querySelector('.nav-overlay');
    if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

    if (drawer) {
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }
  }


  /* ===========================================================================
     03 — NAVIGATION — SERVICES DROPDOWN (DESKTOP)
  =========================================================================== */
  function closeAllDropdowns() {
    document.querySelectorAll('.nav-links li.open').forEach(li => {
      li.classList.remove('open');
      const toggle = li.querySelector('.nav-drop-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('.nav-links .nav-drop-toggle').forEach(toggle => {
    const parentLi = toggle.closest('li');
    const dropdown = parentLi ? parentLi.querySelector('.nav-dropdown') : null;
    if (!parentLi || !dropdown) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = parentLi.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = parentLi.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
      }
      if (e.key === 'Escape') closeAllDropdowns();
    });

    parentLi.addEventListener('focusout', (e) => {
      if (!parentLi.contains(e.relatedTarget)) {
        parentLi.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });


  /* ===========================================================================
     04 — NAVIGATION — SERVICES DROPDOWN (MOBILE DRAWER)
  =========================================================================== */
  document.querySelectorAll('.nav-drawer .nav-drop-toggle').forEach(toggle => {
    const parentLi = toggle.closest('li');
    const subMenu  = parentLi ? parentLi.querySelector('.nav-sub') : null;
    if (!parentLi || !subMenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = subMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const chevron = toggle.querySelector('.nav-chevron');
      if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });


  /* ===========================================================================
     05 — NAVIGATION — CLOSE ON OUTSIDE CLICK / RESIZE
  =========================================================================== */
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) closeAllDropdowns();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 1200) {
        closeMobileMenu();
        closeAllDropdowns();
      }
    }, 150);
  });


  /* ===========================================================================
     06 — SCROLL ANIMATIONS
     Handled by the JS-driven reveal system near the bottom of this file
     (Web Animations API — not affected by CSS reduce-motion or transitions).
  =========================================================================== */


  /* ===========================================================================
     07 — SCROLL TO TOP BUTTON
  =========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});


/* ===========================================================================
   PROCESS TIMELINE — azure line fills + nodes activate as you scroll
=========================================================================== */
(function () {
  const timeline     = document.querySelector('.timeline');
  const timelineFill = document.getElementById('timelineFill');
  if (!timeline || !timelineFill) return;

  const steps = Array.from(timeline.querySelectorAll('.timeline-step'));
  let ticking = false;

  function update() {
    const rect  = timeline.getBoundingClientRect();
    const start = window.innerHeight * 0.5;            // activation line = viewport middle
    const total = rect.height || 1;
    let p = (start - rect.top) / total;
    p = Math.max(0, Math.min(1, p));
    timelineFill.style.height = (p * 100) + '%';

    steps.forEach(step => {
      const node = step.querySelector('.timeline-node');
      if (!node) return;
      const nodeCenter = node.getBoundingClientRect().top + node.offsetHeight / 2;
      step.classList.toggle('active', nodeCenter <= start + 4);
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();


/* ===========================================================================
   COVERAGE TABS — switch the card panel (Where We Go / Live Tracking / Beyond)
=========================================================================== */
(function () {
  var tabs = document.querySelectorAll('.cov-tab');
  if (!tabs.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('.cov-panel').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-panel') === id);
      });
    });
  });
})();


/* ===========================================================================
   WHY CHOOSE US — carousel: auto-advance left every 3s,
   pause on hover, stop for good on click / drag.
=========================================================================== */
(function () {
  var track = document.getElementById('whyTrack');
  if (!track) return;
  var carousel = track.closest('.why-carousel') || track;
  var prev = document.querySelector('.why-prev');
  var next = document.querySelector('.why-next');

  var timer = null;
  var stopped = false; // set once the user takes control (click / drag)

  function step() {
    var card = track.querySelector('.why-card');
    if (!card) return 340;
    var gap = parseInt(getComputedStyle(track).gap) || 24;
    return card.offsetWidth + gap;
  }

  function atEnd() {
    return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  function advance() {
    if (atEnd()) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    }
  }

  function start() {
    if (stopped || timer) return;
    timer = setInterval(advance, 3000);
  }

  function pause() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function stopForGood() {
    stopped = true;
    pause();
  }

  // Auto-play
  start();

  // Pause while hovering, resume on leave (unless the user has taken control)
  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', start);

  // Clicking anywhere in the carousel (incl. nav) stops auto-play for good
  carousel.addEventListener('click', stopForGood);
  track.addEventListener('pointerdown', stopForGood);

  // Manual nav
  if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
})();


/* ===========================================================================
   SCROLL-SPY — highlight the nav link for the section in view
=========================================================================== */
(function () {
  var spies = Array.prototype.slice.call(document.querySelectorAll('#navbar [data-spy]'));
  if (!spies.length) return;

  var pairs = spies
    .map(function (el) {
      var sec = document.getElementById(el.getAttribute('data-spy'));
      return sec ? { el: el, sec: sec } : null;
    })
    .filter(Boolean);
  if (!pairs.length) return;

  // Sort by where the SECTIONS sit on the page, not by where their links sit
  // in the navbar. update() below picks "the last section whose top has passed
  // the line", which is only correct if we walk them in document order — and
  // the nav order no longer matches it (About Us / Our Process / Why Choose Us
  // are grouped under one dropdown, while on the page #why precedes #about).
  pairs.sort(function (a, b) {
    var rel = a.sec.compareDocumentPosition(b.sec);
    if (rel & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (rel & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  var dropParents = Array.prototype.slice
    .call(document.querySelectorAll('.nav-links > li'))
    .map(function (li) {
      var toggle = li.querySelector('.nav-drop-toggle');
      var menu   = li.querySelector('.nav-dropdown');
      return (toggle && menu) ? { toggle: toggle, menu: menu } : null;
    })
    .filter(Boolean);

  var ticking = false;

  function update() {
    ticking = false;
    var line = window.scrollY + window.innerHeight * 0.32; // activation line, ~1/3 down
    var current = null;
    pairs.forEach(function (p) {
      var top = p.sec.getBoundingClientRect().top + window.scrollY;
      if (top <= line) current = p; // last section whose top has passed the line
    });

    // Once the page bottoms out, later sections can no longer reach the
    // activation line, so the final link would never light up. Fall back to
    // the last section that is actually on screen.
    var atBottom = window.innerHeight + window.scrollY >=
                   document.documentElement.scrollHeight - 2;
    if (atBottom) {
      var viewBottom = window.scrollY + window.innerHeight;
      pairs.forEach(function (p) {
        var top = p.sec.getBoundingClientRect().top + window.scrollY;
        if (top <= viewBottom) current = p;
      });
    }
    spies.forEach(function (el) {
      el.classList.toggle('active', !!current && el === current.el);
    });

    // A section that lives inside a dropdown should also light up the parent
    // toggle, otherwise the nav looks inert while you scroll through it.
    dropParents.forEach(function (li) {
      li.toggle.classList.toggle('active', !!li.menu.querySelector('a.active'));
    });
  }

  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();


/* ===========================================================================
   SCROLL REVEAL — content fades in as each section scrolls into view.

   How it works:
   • Elements start hidden via `.js .reveal` in global.css, so the page still
     renders fine if this script never runs.
   • An IntersectionObserver reveals them. Everything that crosses into view in
     the same frame is treated as one batch, sorted top-to-bottom then
     left-to-right, and staggered — so a row of cards arrives one by one in
     reading order instead of all at once or in a scrambled order. Batch
     position is the only thing that sets the stagger; the .delay-N classes
     in the markup apply to the on-load animations only.
   • Motion runs on the Web Animations API with `fill: backwards`, so once an
     element finishes the animation stops applying and the element's own CSS
     takes over again (this is what lets the card hover lifts work).
=========================================================================== */
(function () {
  var DURATION  = 850;   // ms — length of one element's fade
  var STEP      = 110;   // ms — gap between consecutive elements in a batch
  var MAX_TOTAL = 900;   // ms — longest a whole cascade may take end to end
  var SHIFT_Y   = 32;    // px of vertical travel
  var SHIFT_X   = 40;    // px of horizontal travel
  var EASING    = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Reduced motion: still fade, still cascade, but don't slide anything.
  var reduced = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduced) DURATION = 600;

  // 1) Auto-tag section content that wasn't tagged by hand in the markup.
  var sel = 'main section:not(#hero) :is(' +
    '.eyebrow, h2, h3, p, li, .btn-primary, .btn-ghost-dark, .btn-ghost-light,' +
    '.service-card, .process-card, .why-card, .timeline-step,' +
    '.about-photo, .about-figure, .about-quote, .coverage-map-panel, .cov-card, .hero-stat' +
    ')';
  document.querySelectorAll(sel).forEach(function (el) {
    // .closest() matches the element itself, so this covers both "already
    // tagged" and "lives inside a block that reveals as a unit".
    if (el.closest('.reveal')) return;
    if (el.closest('.marquee, .trust-marquee, #navbar')) return; // never hide bars/nav
    el.classList.add('reveal', 'fade-up');
  });

  // Tell the <head> failsafe we booted, so it leaves the .js class alone.
  document.documentElement.dataset.revealReady = '1';

  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  // 2) Helpers
  function startTransform(el) {
    if (reduced) return 'none';
    if (el.classList.contains('fade-left'))  return 'translateX(' + SHIFT_X + 'px)';
    if (el.classList.contains('fade-right')) return 'translateX(-' + SHIFT_X + 'px)';
    if (el.classList.contains('fade-down'))  return 'translateY(-' + SHIFT_Y + 'px)';
    if (el.classList.contains('fade-in'))    return 'none';
    return 'translateY(' + SHIFT_Y + 'px)'; // fade-up (default)
  }

  // Horizontal card rails (the services row, the "why" rail) scroll sideways,
  // so their off-screen cards never intersect the viewport and would sit at
  // opacity 0 forever. Treat a rail as one group: when any card in it comes
  // into view, cascade the whole rail.
  function railOf(el) {
    var p = el.parentElement;
    while (p && p !== document.body) {
      var ox = getComputedStyle(p).overflowX;
      if ((ox === 'auto' || ox === 'scroll') && p.scrollWidth > p.clientWidth + 4) return p;
      p = p.parentElement;
    }
    return null;
  }

  function show(el, delay) {
    el.classList.add('is-visible');
    if (typeof el.animate !== 'function') return; // .is-visible alone is the fallback

    el.style.willChange = 'opacity, transform';
    var anim = el.animate(
      [{ opacity: 0, transform: startTransform(el) },
       { opacity: 1, transform: 'none' }],
      { duration: DURATION, delay: delay, easing: EASING, fill: 'backwards' }
    );
    anim.addEventListener('finish', function () {
      el.style.willChange = '';
      anim.cancel(); // hand transform back to CSS (hover lifts, etc.)
    });
  }

  // 3) Reveal on scroll into view (no observer support: just show everything)
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { show(el, 0); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; });
    if (!batch.length) return;

    // Reading order: top to bottom, then left to right within the same row.
    batch.sort(function (a, b) {
      var dy = a.boundingClientRect.top - b.boundingClientRect.top;
      if (Math.abs(dy) > 8) return dy;
      return a.boundingClientRect.left - b.boundingClientRect.left;
    });

    // Expand each entry into the group it belongs to, keeping reading order
    // and never revealing the same element twice.
    var seen = [];
    batch.forEach(function (e) {
      var rail = railOf(e.target);
      var group = rail
        ? Array.prototype.slice.call(rail.querySelectorAll('.reveal'))
        : [e.target];
      group.forEach(function (el) {
        if (seen.indexOf(el) === -1) seen.push(el);
      });
    });

    // Tighten the gap on long batches instead of clamping the index — clamping
    // makes everything past the cap arrive at the same moment.
    var step = Math.min(STEP, MAX_TOTAL / Math.max(seen.length - 1, 1));
    seen.forEach(function (el, i) {
      show(el, Math.round(i * step));
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  items.forEach(function (el) { obs.observe(el); });
})();


/* ===========================================================================
   JOIN OUR TEAM — front-end form validation + success state
   (Backend submission is wired later by the backend team.)
=========================================================================== */
(function () {
  var form = document.getElementById('careersForm');
  var success = document.getElementById('careersSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    // Text / email / date / select fields
    form.querySelectorAll('input[required]:not([type="radio"]), select[required], textarea[required]').forEach(function (field) {
      var ok = field.value.trim() !== '';
      if (field.type === 'email') {
        ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }
      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });

    // Required radio groups (e.g. work authorization)
    var radioGroups = {};
    form.querySelectorAll('input[type="radio"][required]').forEach(function (r) { radioGroups[r.name] = true; });
    Object.keys(radioGroups).forEach(function (name) {
      var checked = form.querySelector('input[name="' + name + '"]:checked');
      var row = form.querySelector('input[name="' + name + '"]').closest('.radio-row');
      if (row) row.classList.toggle('error', !checked);
      if (!checked) valid = false;
    });

    if (!valid) return;

    // Front-end only for now — hand off to backend endpoint when ready.
    form.style.display = 'none';
    success.classList.add('show');
  });

  // Clear the error state as the user fixes a field
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('error')) e.target.classList.remove('error');
    if (e.target.type === 'radio') {
      var row = e.target.closest('.radio-row');
      if (row) row.classList.remove('error');
    }
  });
})();


/* ===========================================================================
   SCHEDULE NOW — multi-step order wizard
=========================================================================== */
(function () {
  var form = document.getElementById('scheduleForm');
  if (!form) return;

  var card = form.closest('.schedule-card') || form.parentElement;
  var steps = Array.prototype.slice.call(form.querySelectorAll('.qf-step'))
    .filter(function (s) { return !s.classList.contains('qf-success'); });
  var success = form.querySelector('.qf-success');
  var bar = card.querySelector('.qf-progress-bar span');
  var text = card.querySelector('.qf-progress-text');
  var backBtn = form.querySelector('.qf-back');
  var nextBtn = form.querySelector('.qf-next');
  var submitBtn = form.querySelector('.qf-submit');
  var i = 0;

  function show(n) {
    i = n;
    steps.forEach(function (s, idx) { s.classList.toggle('is-active', idx === n); });
    if (bar) bar.style.width = ((n + 1) / steps.length * 100) + '%';
    if (text) text.textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
    backBtn.style.display = n === 0 ? 'none' : '';
    nextBtn.style.display = n === steps.length - 1 ? 'none' : '';
    submitBtn.style.display = n === steps.length - 1 ? '' : 'none';
  }

  function validate(n) {
    var ok = true, first = null;
    steps[n].querySelectorAll('[required]').forEach(function (f) {
      var good = f.value.trim() !== '';
      if (f.type === 'email') good = good && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
      f.classList.toggle('qf-invalid', !good);
      if (!good) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus();
    return ok;
  }

  nextBtn.addEventListener('click', function () { if (validate(i)) show(i + 1); });
  backBtn.addEventListener('click', function () { if (i > 0) show(i - 1); });
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('qf-invalid')) e.target.classList.remove('qf-invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(i)) return;
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    if (success) success.classList.add('is-active');
    if (bar) bar.style.width = '100%';
    if (text) text.textContent = 'Done';
    var nav = form.querySelector('.qf-nav');
    if (nav) nav.style.display = 'none';
  });

  show(0);
})();
