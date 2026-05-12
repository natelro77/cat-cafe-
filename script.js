/* ==========================================
   Mochi Cat Café — script.js
   ========================================== */

/* -- Yara surprise popup -- */
function closeYara() {
  const popup = document.getElementById('yara-popup');
  if (!popup) return;
  popup.classList.add('closing');
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      spawnPawAt(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.8
      );
    }, i * 60);
  }
  setTimeout(() => popup.remove(), 560);
}

/* -- Meow bubbles on cat cards -- */
function meow(card) {
  const bubble = card.querySelector('.bubble');
  if (!bubble) return;

  bubble.style.display = 'block';
  void bubble.offsetWidth; // reflow to re-trigger animation
  bubble.style.animation = 'none';
  void bubble.offsetWidth;
  bubble.style.animation = 'bubblePop 0.25s ease';

  spawnPaws(card);

  clearTimeout(card._meowTimer);
  card._meowTimer = setTimeout(() => {
    bubble.style.display = 'none';
  }, 1800);
}

/* -- Heart pop on menu items -- */
function addHeart(item) {
  const hpop = item.querySelector('.hpop');
  if (!hpop) return;
  hpop.classList.remove('pop');
  void hpop.offsetWidth;
  hpop.classList.add('pop');
  setTimeout(() => hpop.classList.remove('pop'), 560);
  spawnPaws(item);
}

/* -- Stamp hearts in gallery -- */
function stampHeart(btn) {
  const container = btn.nextElementSibling;
  if (!container) return;
  const hearts = ['💛', '🧡', '♡', '💖', '🌸', '✨', '🐾'];
  const h = document.createElement('span');
  h.className = 's-heart';
  h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  container.appendChild(h);

  if (container.children.length > 24) {
    container.removeChild(container.firstChild);
  }
}

/* -- Floating paw prints on click anywhere -- */
document.addEventListener('click', function (e) {
  spawnPawAt(e.clientX, e.clientY);
});

function spawnPaws(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 3;
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnPawAt(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 30), i * 80);
  }
}

function spawnPawAt(x, y) {
  const container = document.getElementById('paws-container');
  if (!container) return;
  const paw = document.createElement('span');
  paw.className = 'paw-float';
  paw.textContent = Math.random() > 0.4 ? '🐾' : '✦';
  paw.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
  paw.style.top  = (y + window.scrollY + (Math.random() - 0.5) * 20) + 'px';
  paw.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
  container.appendChild(paw);
  setTimeout(() => paw.remove(), 2500);
}

/* -- Eye tracking: cats look at cursor -- */
const allEyes = document.querySelectorAll('.eye');

document.addEventListener('mousemove', function (e) {
  document.querySelectorAll('.cat-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(4, Math.hypot(dx, dy) / 30);

    card.querySelectorAll('.pupil').forEach(pupil => {
      pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    });
  });
});

/* -- Ambient gentle scroll fade-in -- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.cat-card, .menu-item, .frame-wrap, .painting-info').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* -- Lazy random ambient paw drifts -- */
setInterval(() => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight * 0.6 + window.scrollY;
  spawnPawAt(x, y - window.scrollY);
}, 4200);

/* -- Ear wiggle on section enter -- */
const catSection = document.querySelector('.cats-section');
if (catSection) {
  const earObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.ear').forEach((ear, i) => {
          setTimeout(() => {
            ear.style.transition = 'transform 0.18s ease';
            ear.style.transform = ear.classList.contains('l')
              ? 'rotate(-22deg)'
              : 'rotate(22deg)';
            setTimeout(() => { ear.style.transform = ''; }, 320);
          }, i * 55);
        });
        earObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  earObserver.observe(catSection);
}
