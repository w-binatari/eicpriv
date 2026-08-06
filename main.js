import './style.css';

const header = document.querySelector('.site-header');
const nav = document.getElementById('siteNav');
const toggle = document.getElementById('menuBtn');

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
    header?.classList.toggle('is-scrolled', window.scrollY > 6);
  },
  { passive: true }
);

const deliver = document.getElementById('deliver');
if (deliver) {
  const items = deliver.querySelectorAll('.service[data-shot]');

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      deliver.dataset.active = item.dataset.shot || '';
      deliver.classList.add('is-hot');
    });

    item.addEventListener('focusin', () => {
      deliver.dataset.active = item.dataset.shot || '';
      deliver.classList.add('is-hot');
    });
  });

  deliver.addEventListener('mouseleave', () => {
    deliver.classList.remove('is-hot');
    deliver.dataset.active = '';
  });

  deliver.addEventListener('focusout', (event) => {
    if (!deliver.contains(event.relatedTarget)) {
      deliver.classList.remove('is-hot');
      deliver.dataset.active = '';
    }
  });
}

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  console.log('Form submission:', Object.fromEntries(new FormData(form)));

  if (note) {
    note.dataset.state = 'success';
    note.textContent = 'Thanks. Your message is in. We will get back to you shortly.';
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sent';
  }

  form.reset();

  window.setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  }, 3500);
});
