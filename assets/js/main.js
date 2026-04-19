/* Oversite Homes — shared scripts */

(function () {
  'use strict';

  // Signal that JS is on so reveal animations become active.
  document.documentElement.classList.add('js-on');

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    // close mobile nav when clicking a link
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 899px)').matches) {
          nav.setAttribute('data-open', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------- sticky header border on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const updateHeader = () => {
      if (window.scrollY > 4) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.01 }
    );
    revealEls.forEach((el) => io.observe(el));
    // Safety net: any reveal element still hidden after 2s of page load is shown.
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) el.classList.add('is-in');
        });
      }, 300);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- intake form: compose mailto, show success ---------- */
  const form = document.querySelector('#intake-form');
  const successCard = document.querySelector('#form-success');
  const successEmailSpan = document.querySelector('#success-email');
  if (form && successCard) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const labelMap = {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        project_type: 'Project type',
        project_location: 'Project location',
        project_stage: 'Project stage',
        timeline: 'Timeline',
        budget: 'Budget range',
        contractor_status: 'Current contractor status',
        concern: "Biggest concern",
        tier: 'Service tier of interest',
      };

      const lines = [];
      Object.keys(labelMap).forEach((key) => {
        const val = (data.get(key) || '').toString().trim();
        lines.push(`${labelMap[key]}: ${val || '(not provided)'}`);
      });

      const subject = `Project assessment request from ${name || 'website visitor'}`;
      const body = [
        'Hi Oversite team,',
        '',
        'A new project assessment request came in from the Oversite Homes website:',
        '',
        ...lines,
        '',
        '— sent via oversitehomes.com',
      ].join('\n');

      const mailto =
        'mailto:oversitehomes@gmail.com' +
        '?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body);

      // trigger the email client
      window.location.href = mailto;

      // show success state regardless (static deploy, no backend)
      if (successEmailSpan) successEmailSpan.textContent = email || 'the email you provided';
      form.classList.add('hidden');
      successCard.classList.remove('hidden');
      successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      successCard.focus();
    });
  }

  /* ---------- active nav link ---------- */
  // Normalize both path and href: strip .html extension, treat empty as 'index'.
  const normalize = (s) => (s || '').toLowerCase().replace(/\.html$/, '').replace(/^\/+/, '') || 'index';
  const path = normalize(window.location.pathname.split('/').pop());
  document.querySelectorAll('.primary-nav a').forEach((a) => {
    const href = normalize(a.getAttribute('href') || '');
    if (href === path && !a.classList.contains('mobile-cta')) {
      a.classList.add('is-active');
    }
  });
})();
