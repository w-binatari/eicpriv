import './style.css';

/* =========================================================
   Hero Content Carousel (desktop/tablet only)
   ========================================================= */
const heroCarousel = document.getElementById('heroCarousel');
const heroSlides = heroCarousel?.querySelectorAll('.hero-slide');
const heroDots = heroCarousel?.querySelectorAll('.hero-dot');
const heroMq = window.matchMedia('(min-width: 901px)');

let heroIndex = 0;
let heroTimer;

const setHeroSlide = (index) => {
  if (!heroSlides?.length) return;

  heroIndex = index;
  heroSlides.forEach((slide, i) => {
    const active = i === index;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });

  heroDots?.forEach((dot, i) => {
    const active = i === index;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-current', active ? 'true' : 'false');
  });
};

const nextHeroSlide = () => {
  if (!heroSlides?.length) return;
  setHeroSlide((heroIndex + 1) % heroSlides.length);
};

const startHeroCarousel = () => {
  clearInterval(heroTimer);
  if (!heroMq.matches || !heroSlides || heroSlides.length < 2) {
    setHeroSlide(0);
    return;
  }
  heroTimer = setInterval(nextHeroSlide, 7000);
};

const stopHeroCarousel = () => {
  clearInterval(heroTimer);
};

heroDots?.forEach((dot) => {
  dot.addEventListener('click', () => {
    const target = Number(dot.dataset.heroGo);
    if (Number.isNaN(target)) return;
    setHeroSlide(target);
    stopHeroCarousel();
    startHeroCarousel();
  });
});

heroCarousel?.addEventListener('mouseenter', stopHeroCarousel);
heroCarousel?.addEventListener('mouseleave', startHeroCarousel);

heroMq.addEventListener('change', startHeroCarousel);
startHeroCarousel();

/* =========================================================
   Core Services Tabs
   ========================================================= */
const serviceTabButtons = document.querySelectorAll('.service-tab-btn');
const servicePanels = document.querySelectorAll('.service-panel');

serviceTabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;

    serviceTabButtons.forEach((tab) => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    servicePanels.forEach((panel) => {
      panel.classList.remove('active');
    });

    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    document.getElementById(targetId)?.classList.add('active');
  });
});

/* =========================================================
   Mobile Navigation Toggle
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navCta    = document.getElementById('navCta');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when a link is clicked
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   Event Filter (Tabs)
   ========================================================= */
window.filterEvents = function filterEvents(type, btn) {
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  // Show/hide cards
  document.querySelectorAll('.event-card').forEach((card) => {
    const match = type === 'all' || card.dataset.type === type;
    card.style.display = match ? '' : 'none';
  });
};

/* =========================================================
   Contact Form - Basic Validation & Submission Handler
   (Wire up to your CRM / backend endpoint here)
   ========================================================= */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Collect form data (ready for CRM API call)
  const data = Object.fromEntries(new FormData(form));

  // ── CRM Integration Point ──────────────────────────────
  // Replace the block below with your CRM endpoint, e.g.
  // HubSpot Forms API, Salesforce Web-to-Lead, Zoho CRM, etc.
  //
  // Example (HubSpot):
  // await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ fields: Object.entries(data).map(([n, v]) => ({ name: n, value: v })) }),
  // });
  // ────────────────────────────────────────────────────────

  console.log('Form submission:', data);

  // UI feedback
  submitBtn.textContent = 'Message Sent';
  submitBtn.disabled = true;
  submitBtn.style.background = '#00c864';
  submitBtn.style.color = '#fff';
  form.reset();

  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.style.background = '';
    submitBtn.style.color = '';
    submitBtn.disabled = false;
  }, 4000);
});

/* =========================================================
   Sticky Navbar - shrink on scroll
   ========================================================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });

/* =========================================================
   Achievements Carousel Logic
   ========================================================= */
const achTrack = document.getElementById('achTrack');
const achPrev = document.getElementById('achPrev');
const achNext = document.getElementById('achNext');

if (achTrack) {
  let currentSlide = 0;
  let slideInterval;
  const slides = achTrack.querySelectorAll('.ach-slide');
  const totalSlides = slides.length;
  const carouselContainer = document.getElementById('achCarousel');

  const updateCarousel = () => {
    achTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  };

  const startAutoPlay = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Swipe every 5 seconds
  };

  const stopAutoPlay = () => {
    clearInterval(slideInterval);
  };

  achNext?.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
  achPrev?.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });

  // Pause auto-play when hovering over the carousel
  carouselContainer?.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer?.addEventListener('mouseleave', startAutoPlay);

  // Carousel photography is far below the fold. Load it shortly before the
  // carousel enters view, then start animation so it does no offscreen work.
  const activateCarousel = () => {
    slides.forEach((slide) => {
      if (slide.dataset.background) {
        slide.style.backgroundImage = `url("${slide.dataset.background}")`;
        delete slide.dataset.background;
      }
    });
    startAutoPlay();
  };

  if ('IntersectionObserver' in window && carouselContainer) {
    const carouselObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        activateCarousel();
        observer.disconnect();
      }
    }, { rootMargin: '300px 0px' });
    carouselObserver.observe(carouselContainer);
  } else {
    activateCarousel();
  }
}
