/* Core interactions: mobile menu, reveal-on-scroll, nav highlight,
   carousel arrows, form handling (placeholder Formspree fallback).
   The contact form uses a placeholder endpoint; replace with your Formspree URL.
*/

document.addEventListener('DOMContentLoaded', () => {
  // mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileToggle && mobileToggle.addEventListener('click', () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    mobileToggle.setAttribute('aria-expanded', String(open));
  });

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // nav highlight by section
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('main .section, main section'));
  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.id || current;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', (a.getAttribute('href').slice(1) === current));
    });
  }
  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });

  // projects carousel controls
  const projectsCarousel = document.getElementById('projectsCarousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (projectsCarousel) {
    prevBtn && prevBtn.addEventListener('click', () => projectsCarousel.scrollBy({ left: -360, behavior: 'smooth' }));
    nextBtn && nextBtn.addEventListener('click', () => projectsCarousel.scrollBy({ left: 360, behavior: 'smooth' }));
  }

  // contact form handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formClear = document.getElementById('formClear');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending…';

      const action = contactForm.getAttribute('action') || '';
      const data = new FormData(contactForm);

      // placeholder detection: if action includes 'placeholder', open mailto fallback
      if (!action || action.includes('placeholder')) {
        // mailto fallback
        const name = data.get('name') || 'No name';
        const email = data.get('_replyto') || '';
        const message = data.get('message') || '';
        const mailto = `mailto:amro.m.ayyad@gmail.com?subject=${encodeURIComponent('Website contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>')}`;
        window.location.href = mailto;
        formStatus.textContent = 'Opened mail client (fallback).';
        contactForm.reset();
        return;
      }

      // attempt POST to Formspree
      try {
        const resp = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (resp.ok) {
          formStatus.textContent = 'Message sent — thank you!';
          contactForm.reset();
        } else {
          const json = await resp.json();
          formStatus.textContent = (json?.error) ? json.error : 'Error sending form.';
        }
      } catch (err) {
        formStatus.textContent = 'Network error. Try opening your email client.';
      }
    });
  }

  formClear && formClear.addEventListener('click', () => {
    contactForm && contactForm.reset();
    formStatus && (formStatus.textContent = '');
  });

  // set footer year
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  // Accessibility: close mobile menu on link click
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
  }));
});
