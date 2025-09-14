/* Core behavior: mobile menu, theme toggle, reveal on scroll, active nav highlight, contact form (client-side) */

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.getElementById('navLinks');
  const mobileLinkEls = Array.from(document.querySelectorAll('.mobile-link'));
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const yearEl = document.getElementById('year');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // MOBILE MENU
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.classList.toggle('is-active');
      mobileMenu.hidden = !expanded;
      hamburger.setAttribute('aria-expanded', expanded);
    });

    // hide mobile menu on link click
    mobileLinkEls.forEach(a => a.addEventListener('click', () => {
      mobileMenu.hidden = true;
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  // THEME: simple dark/light toggle (localStorage)
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme === 'light') root.classList.add('light-mode');
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light-mode');
    const mode = root.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('site-theme', mode);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    // swap icon (sun for light, moon for dark)
    const isLight = root.classList.contains('light-mode');
    themeIcon.innerHTML = isLight
      ? '<path d=\"M6.76 4.84l-1.8-1.79L4.2 4.8l1.79 1.8 0.77-1.76zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zM6.76 19.16l-1.79 1.79 1.22 1.22 1.79-1.79-1.22-1.22zM20 11h3v-2h-3v2zM17.24 4.84l1.79-1.79-1.22-1.22-1.79 1.79 1.22 1.22zM12 4a1 1 0 110 2 1 1 0 010-2z'/>'
      : '<path d=\"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z\"/>';
  }

  // SCROLL reveal using IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // Active nav link highlight (on scroll)
  const sections = document.querySelectorAll('main section[id]');
  const navLinksDesktop = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksDesktop.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => sectionObserver.observe(s));

  // Smooth scroll behavior for internal links (in case browser doesn't support)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile menu if open
          if (!mobileMenu.hidden) {
            mobileMenu.hidden = true;
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // Contact form (client-side only): collect and show message (no server). Add action or Netlify form if you want backend.
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const clearBtn = document.getElementById('clearBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // basic validation (HTML already handles required)
      formStatus.textContent = 'Preparing message...';
      // Here we can use `mailto:` fallback: open user's mail client with prefilled message
      const data = new FormData(contactForm);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const message = data.get('message') || '';
      const mailto = `mailto:amr.ayyad@email.com?subject=${encodeURIComponent('Portfolio contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>')}`;
      // open mailto (lets user's email client send)
      window.location.href = mailto;
      formStatus.textContent = 'Opening your email client...';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      contactForm.reset();
      formStatus.textContent = '';
    });
  }
});
