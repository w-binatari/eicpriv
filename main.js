import './style.css';

/* =========================================================
   Scroll Fade-In Animation (Intersection Observer)
   ========================================================= */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.fade-in').forEach((el) => {
  // Only animate elements that are NOT already in the viewport on load
  const rect = el.getBoundingClientRect();
  const inViewOnLoad = rect.top < window.innerHeight && rect.bottom > 0;
  if (!inViewOnLoad) {
    el.classList.add('will-animate');
    fadeObserver.observe(el);
  }
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
   Services Vertical Tabs
   ========================================================= */
document.querySelectorAll('.service-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all buttons
    document.querySelectorAll('.service-tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    
    // Hide all panels
    document.querySelectorAll('.service-panel').forEach(p => {
      p.classList.remove('active');
    });
    
    // Set clicked button strictly active
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    
    // Show correct panel
    const targetId = btn.getAttribute('data-target');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

/* =========================================================
   Contact Form — Basic Validation & Submission Handler
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
  submitBtn.textContent = '✅ Message Sent!';
  submitBtn.disabled = true;
  submitBtn.style.background = '#00c864';
  submitBtn.style.color = '#fff';
  form.reset();

  setTimeout(() => {
    submitBtn.textContent = 'Send Message →';
    submitBtn.style.background = '';
    submitBtn.style.color = '';
    submitBtn.disabled = false;
  }, 4000);
});

/* =========================================================
   Sticky Navbar — shrink on scroll
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
    slideInterval = setInterval(nextSlide, 5000); // Swipe every 5 seconds
  };

  const stopAutoPlay = () => {
    clearInterval(slideInterval);
  };

  achNext?.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
  achPrev?.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });

  // Pause auto-play when hovering over the carousel
  const carouselContainer = document.getElementById('achCarousel');
  carouselContainer?.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer?.addEventListener('mouseleave', startAutoPlay);

  // Initialize auto-play
  startAutoPlay();
}

/* =========================================================
   Hero Background Carousel Logic
   ========================================================= */
const heroSlides = document.querySelectorAll('.hero-bg-slide');
if (heroSlides.length > 0) {
  let currentHeroSlide = 0;
  setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
  }, 9000); // Change image every 9 seconds
}
