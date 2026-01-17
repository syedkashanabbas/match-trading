const ctaSection = document.getElementById('cta-calm-bitcoin');

function revealCTA() {
  const rect = ctaSection.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.top < vh * 0.7) {
    ctaSection.classList.add('cta-visible');
  }
}

window.addEventListener('scroll', revealCTA);
window.addEventListener('resize', revealCTA);
revealCTA();
