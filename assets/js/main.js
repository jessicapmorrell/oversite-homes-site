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

  /* ---------- intake form: submit to Formspree via fetch, show success ---------- */
  const form = document.querySelector('#intake-form');
  const successCard = document.querySelector('#form-success');
  const successEmailSpan = document.querySelector('#success-email');
  if (form && successCard) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const email = (new FormData(form).get('email') || '').toString().trim();

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          if (successEmailSpan) successEmailSpan.textContent = email || 'the email you provided';
          form.classList.add('hidden');
          successCard.classList.remove('hidden');
          successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          successCard.focus();
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        alert('Something went wrong sending your request. Please email oversitehomes@gmail.com directly and we will respond within 24 hours.');
      }
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
