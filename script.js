/* ============================================================
   PORTFOLIO 2026 – FRISKA SAPUTRA REDOANSAH
   script.js  |  Navigation, transitions, helpers
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  const PAGES = ['home', 'profil', 'project', 'contact'];
  const PAGE_IDS = PAGES.map(p => 'page-' + p);

  let current = 'home';
  let busy = false;
  let wheelCooldown = false;

  /* ── DOM helpers ─────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  /* ── Go to page ──────────────────────────────────────────── */
  function goTo(name) {
    if (!PAGES.includes(name)) return;
    if (name === current || busy) return;

    busy = true;

    const fromIdx = PAGES.indexOf(current);
    const toIdx   = PAGES.indexOf(name);
    const down    = toIdx > fromIdx;

    const fromEl = $('page-' + current);
    const toEl   = $('page-' + name);

    /* prep incoming page (invisible, offset below/above) */
    toEl.style.transform = down ? 'translateY(55px)' : 'translateY(-55px)';
    toEl.style.opacity   = '0';
    toEl.style.pointerEvents = 'none';

    /* exit current */
    fromEl.classList.remove('active');
    fromEl.classList.add(down ? 'leave-up' : 'leave-down');

    /* activate incoming (rAF double to ensure browser picks up initial state) */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toEl.style.transform = '';
        toEl.style.opacity   = '';
        toEl.classList.add('active');

        /* cleanup after transition */
        setTimeout(() => {
          fromEl.classList.remove('leave-up', 'leave-down');
          fromEl.style.transform = '';
          fromEl.style.opacity   = '';
          toEl.style.pointerEvents = '';
          busy = false;

          /* trigger language bars animation if going to profil */
          if (name === 'profil') animateLangBars();
        }, 650);
      });
    });

    current = name;
    syncDots();
    syncTabs();
  }

  /* ── Sync dot nav ────────────────────────────────────────── */
  function syncDots() {
    $$('.dnav-dot').forEach(d => {
      d.classList.toggle('active', d.dataset.go === current);
    });
  }

  /* ── Sync tab highlights (all tab bars) ─────────────────── */
  function syncTabs() {
    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.go === current);
    });
  }

  /* ── Language bar animation ──────────────────────────────── */
  function animateLangBars() {
    $$('.lang-fill').forEach(bar => {
      const target = bar.dataset.w + '%';
      bar.style.width = '0';
      /* small delay so transition is visible */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = target;
        });
      });
    });
  }

  /* ── Click delegation ────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-go]');
    if (!el) return;
    e.preventDefault();
    goTo(el.dataset.go);
  });

  /* ── Keyboard ────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    const idx = PAGES.indexOf(current);
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (idx < PAGES.length - 1) goTo(PAGES[idx + 1]);
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (idx > 0) goTo(PAGES[idx - 1]);
    }
  });

  /* ── Mouse Wheel ─────────────────────────────────────────── */
  document.addEventListener('wheel', function (e) {
    if (wheelCooldown) return;

    const el = $('page-' + current);
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
    const atTop    = el.scrollTop <= 3;

    const idx = PAGES.indexOf(current);

    if (e.deltaY > 30 && atBottom && idx < PAGES.length - 1) {
      wheelCooldown = true;
      goTo(PAGES[idx + 1]);
      setTimeout(() => { wheelCooldown = false; }, 900);
    } else if (e.deltaY < -30 && atTop && idx > 0) {
      wheelCooldown = true;
      goTo(PAGES[idx - 1]);
      setTimeout(() => { wheelCooldown = false; }, 900);
    }
  }, { passive: true });

  /* ── Touch swipe ─────────────────────────────────────────── */
  let touchY0 = 0, touchX0 = 0;

  document.addEventListener('touchstart', function (e) {
    touchY0 = e.touches[0].clientY;
    touchX0 = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    const dy = touchY0 - e.changedTouches[0].clientY;
    const dx = touchX0 - e.changedTouches[0].clientX;

    if (Math.abs(dy) < Math.abs(dx) || Math.abs(dy) < 45) return;

    const el  = $('page-' + current);
    const bot = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    const top = el.scrollTop <= 4;
    const idx = PAGES.indexOf(current);

    if (dy > 0 && bot  && idx < PAGES.length - 1) goTo(PAGES[idx + 1]);
    if (dy < 0 && top  && idx > 0)                goTo(PAGES[idx - 1]);
  }, { passive: true });

  
  window.Portfolio = {
    goTo,
    setPhoto: function (slot, src) {
      const map = {
        home    : '.home-avatar',
        profil  : '.profil-avatar',
        contact : '.contact-avatar',
      };
      const targets = slot === 'all'
        ? Object.values(map)
        : [map[slot]];

      targets.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.innerHTML = `<img src="${src}" alt="Foto Profil" style="
          position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
        "/>`;
      });
    }
  };
Portfolio.setPhoto('all', 'foto-kamu.jpg')
  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    $('page-home').classList.add('active');
    syncDots();
    syncTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
