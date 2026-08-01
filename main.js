import './style.css';

const header = document.querySelector('.site-header');
const nav = document.getElementById('siteNav');
const toggle = document.getElementById('navToggle');

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(Boolean(open)));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  },
  { passive: true }
);

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  console.log('Form submission:', data);

  if (note) {
    note.dataset.state = 'success';
    note.textContent = 'Thank you. Your message has been recorded. We will respond shortly.';
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Message sent';
  }

  form.reset();

  window.setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  }, 4000);
});
