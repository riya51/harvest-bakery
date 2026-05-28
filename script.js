/* ═══════════════════════════════════════════════════
   HARVEST BAKERY — script.js
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM Refs ──────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const pages     = document.querySelectorAll('.page');

  // ── Active Page System ────────────────────────────
  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
    // Close mobile menu
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }

  // ── Link Handling ─────────────────────────────────
  document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      const pageId = link.dataset.page;
      if (pageId) showPage(pageId);
    }
  });

  // Also handle href="#id" anchor-style links
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && !anchor.dataset.page) {
      const hash = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(hash);
      if (target && target.classList.contains('page')) {
        e.preventDefault();
        showPage(hash);
      }
    }
  });

  // ── Hamburger Menu ────────────────────────────────
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // ── Navbar Scroll Effect ──────────────────────────
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── Menu Filter ───────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      menuCards.forEach(card => {
        const cat = card.dataset.cat;
        const show = filter === 'all' || cat === filter;
        card.style.display = show ? '' : 'none';
        if (show) card.style.animation = 'fadeUp 0.3s ease both';
      });
    });
  });

  // ── Intersection Observer for Scroll Animations ───
  const animTargets = document.querySelectorAll(
    '.feature-card, .testimonial-card, .menu-card, .value-card, .contact-card, .gallery-item'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });

  // Re-observe when switching pages
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        document.querySelectorAll(
          '.feature-card, .testimonial-card, .menu-card, .value-card, .contact-card, .gallery-item'
        ).forEach(el => {
          observer.observe(el);
        });
      }, 50);
    });
  });

  // ── WhatsApp Float Button Tooltip ─────────────────
  const floatWa = document.querySelector('.float-wa');
  if (floatWa) {
    const tip = document.createElement('div');
    tip.textContent = 'Order on WhatsApp!';
    tip.style.cssText = `
      position: absolute;
      right: 70px;
      white-space: nowrap;
      background: #25D366;
      color: white;
      padding: 7px 14px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    floatWa.style.position = 'fixed';
    floatWa.appendChild(tip);
    floatWa.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
    floatWa.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });

    // Show tooltip automatically after 3 seconds
    setTimeout(() => {
      tip.style.opacity = '1';
      setTimeout(() => { tip.style.opacity = '0'; }, 3000);
    }, 3000);
  }

  // ── Initialise home page ──────────────────────────
  showPage('home');

})();
