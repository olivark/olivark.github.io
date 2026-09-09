const contactForm = document.querySelector('.contact-form');
const submittedKey = 'olivark-contact-submitted';

if (contactForm) {
  contactForm.addEventListener('submit', () => {
    sessionStorage.setItem(submittedKey, 'true');
  });

  window.addEventListener('pageshow', () => {
    if (sessionStorage.getItem(submittedKey) !== 'true') return;

    contactForm.reset();
    sessionStorage.removeItem(submittedKey);
  });
}
