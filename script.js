/* ════════════════════════════════════════════════════════════════
   OPTASIA FOUNDATION — script.js
════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM REFERENCES ─── */
const navbar      = document.getElementById('navbar');
const bttBtn      = document.getElementById('btt');
const mobileMenu  = document.getElementById('mobileMenu');
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');


/* ════════════════════════════════════════════════════════════════
   1. NAVBAR — shadow on scroll + Back-To-Top visibility
════════════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 30;
  navbar.classList.toggle('scrolled', scrolled);
  bttBtn.classList.toggle('show', window.scrollY > 400);
});


/* ════════════════════════════════════════════════════════════════
   2. BACK TO TOP BUTTON
════════════════════════════════════════════════════════════════ */
bttBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ════════════════════════════════════════════════════════════════
   3. MOBILE MENU — open / close
════════════════════════════════════════════════════════════════ */
function openMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Close menu when pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Expose to HTML onclick handlers
window.openMenu  = openMenu;
window.closeMenu = closeMenu;


/* ════════════════════════════════════════════════════════════════
   4. SMOOTH SCROLL for internal anchor links
════════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // skip bare hashes

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});


/* ════════════════════════════════════════════════════════════════
   5. SCROLL-REVEAL ANIMATION (IntersectionObserver)
════════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, no need to keep observing
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ════════════════════════════════════════════════════════════════
   6. ANIMATED COUNTERS (triggered when impact section visible)
════════════════════════════════════════════════════════════════ */
/**
 * Animate a number from 0 to `target`.
 * @param {HTMLElement} el     - Element whose textContent to update
 * @param {number}      target - End value
 * @param {string}      suffix - Appended after the number (e.g. '+', 'k+')
 * @param {number}      duration - Animation duration in ms
 */
function animateCounter(el, target, suffix = '', duration = 1200) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + (target - startVal) * eased);

    el.textContent = current.toLocaleString() + (progress >= 1 ? suffix : '');

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Watch the impact section; fire counters once it comes into view
const impactSection = document.getElementById('impact');
let countersRan = false;

if (impactSection) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersRan) {
          countersRan = true;

          // Define each counter: [selector, target, suffix]
          const counters = [
            ['.color-saffron .ic-num', 5000, '+'],
            ['.color-green   .ic-num', 100,  '+'],
            ['.color-gold    .ic-num', 1000, '+'],
            ['.color-purple  .ic-num', 20,   '+'],
          ];

          counters.forEach(([selector, target, suffix]) => {
            const el = impactSection.querySelector(selector);
            if (el) animateCounter(el, target, suffix);
          });

          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  counterObserver.observe(impactSection);
}


/* ════════════════════════════════════════════════════════════════
   7. CONTACT FORM — submit handler with fake success state
════════════════════════════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation: check all required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        allValid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!allValid) return;

    // Simulate async submission
    submitBtn.textContent  = 'Sending…';
    submitBtn.disabled     = true;
    submitBtn.style.background = '';

    setTimeout(() => {
      submitBtn.textContent      = '✓ Message Sent! Thank you.';
      submitBtn.style.background = '#1A6B3A'; // green success

      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.textContent      = 'Send Message →';
        submitBtn.style.background = '';
        submitBtn.disabled         = false;
        contactForm.reset();
      }, 3000);

    }, 1500);
  });

  // Clear red border on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   8. ACTIVE NAV LINK HIGHLIGHT (highlight section in viewport)
════════════════════════════════════════════════════════════════ */
const sections    = document.querySelectorAll('section[id], div[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          const isActive = a.getAttribute('href') === `#${id}`;
          a.style.color = isActive ? 'var(--charcoal)' : '';
          if (isActive) {
            a.style.setProperty('--underline-width', '100%');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ════════════════════════════════════════════════════════════════
   9. LOGO STRIP — pause on hover
════════════════════════════════════════════════════════════════ */
const stripLogos = document.querySelector('.strip-logos');
if (stripLogos) {
  stripLogos.addEventListener('mouseenter', () => {
    stripLogos.style.animationPlayState = 'paused';
  });
  stripLogos.addEventListener('mouseleave', () => {
    stripLogos.style.animationPlayState = 'running';
  });
}


/* ════════════════════════════════════════════════════════════════
   10. TEAM CARDS — keyboard accessible hover
════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.team-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const link = card.querySelector('a');
      if (link) link.click();
    }
  });
});


/* ════════════════════════════════════════════════════════════════
   11. HERO HEADING — staggered word animation (runs on load)
════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  // Subtle entrance for hero heading lines after fonts are loaded
  document.querySelectorAll('.hero-heading, .hero-sub, .hero-buttons, .hero-stats, .hero-tag').forEach(el => {
    el.style.visibility = 'visible';
  });
});
