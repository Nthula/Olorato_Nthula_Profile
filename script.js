/* ============================================================
   OLORATO NTHULA — PORTFOLIO SCRIPT
   Handles: nav state, typing effect, scroll reveals,
   stat counters, skill bars, project filtering, contact form,
   button ripple, subtle cursor glow.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  // close mobile nav after clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- Typing effect ---------- */
  const roles = [
    'Information Systems Graduate',
    'Business Analyst',
    'Data Analyst',
    'Technology Enthusiast'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800); // pause on full word
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = deleting ? 40 : 70;
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out for a smoother finish
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const heroStats = document.getElementById('heroStats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ---------- Skill bar fill on scroll ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.dataset.level;
        fill.style.setProperty('--target-width', `${level}%`);
        // slight delay so the fill animates after entering view
        requestAnimationFrame(() => fill.classList.add('filled'));
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ---------- Project filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;

        if (matches) {
          card.classList.remove('hide', 'filtering-out');
        } else {
          card.classList.add('filtering-out');
          // wait for the fade/scale transition before hiding from layout
          setTimeout(() => {
            if (card.classList.contains('filtering-out')) {
              card.classList.add('hide');
            }
          }, 380);
        }
      });
    });
  });

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
      btn.classList.remove('rippling');
      // restart animation
      requestAnimationFrame(() => btn.classList.add('rippling'));
    });
  });

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      formNote.textContent = 'Please fill in all fields before sending.';
      formNote.style.color = '#b5533c';
      return;
    }

    const name = document.getElementById('name').value.trim();
    formNote.style.color = '';
    formNote.textContent = `Thanks, ${name.split(' ')[0]} — your message is ready to send. (Connect this form to an email service or backend to enable delivery.)`;
    form.reset();
  });

  /* ---------- Subtle cursor glow (desktop only) ---------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      glow.classList.add('is-active');
    });
    window.addEventListener('mouseleave', () => glow.classList.remove('is-active'));
  }

});
