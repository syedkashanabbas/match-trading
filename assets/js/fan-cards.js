const section = document.getElementById('problem-section');
const cards = document.querySelectorAll('.fan-card');

let state = 'stacked';

function updateCards(expand) {
  cards.forEach((card, index) => {
    let rotate = 0;
    let x = 0;
    let y = 0;
    let scale = 1;
    let z = 0;

    if (expand) {
      if (index === 0) {
        rotate = -16;
        x = -220;
        y = 40;
        scale = 0.96;
        z = -40;
      }

      if (index === 1) {
        rotate = 0;
        x = 0;
        y = -30;
        scale = 1.05;
        z = 40;
      }

      if (index === 2) {
        rotate = 16;
        x = 220;
        y = 40;
        scale = 0.96;
        z = -40;
      }
    }

    card.style.transition =
      'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform =
      `translate3d(${x}px, ${y}px, ${z}px) rotate(${rotate}deg) scale(${scale})`;
  });
}

function onScroll() {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;

  const expandAt = viewport * 0.55;
  const collapseAt = viewport * 0.8;

  if (rect.top < expandAt && state !== 'expanded') {
    state = 'expanded';
    updateCards(true);
  }

  if (rect.top > collapseAt && state !== 'stacked') {
    state = 'stacked';
    updateCards(false);
  }
}

window.addEventListener('scroll', onScroll);
