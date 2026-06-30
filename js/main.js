/* =============================================================================
   METRO ATLANTA COURIER — main.js
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
      if (window.innerWidth > 1024) {
        closeMobileMenu();
        closeAllDropdowns();
      }
    }, 150);
  });


  /* ===========================================================================
     06 — SCROLL ANIMATIONS — INTERSECTIONOBSERVER
  =========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const isMobile = window.innerWidth < 768;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: isMobile ? 0.05 : 0.15,
      rootMargin: isMobile ? '0px' : '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


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
   PROCESS TIMELINE — green line fills + nodes activate as you scroll
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
