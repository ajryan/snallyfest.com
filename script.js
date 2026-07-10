/* ============================================================
   Snallyfest 2026 — script.js
   ============================================================ */

// ── Gallery lightbox ─────────────────────────────────────────
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Photo lightbox');
lightbox.innerHTML =
  '<button class="lightbox-close" aria-label="Close photo">&times;</button>' +
  '<img src="" alt="">';
document.body.appendChild(lightbox);

const lbImg   = lightbox.querySelector('img');
const lbClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-strip img').forEach(img => {
  img.setAttribute('tabindex', '0');
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', 'View photo full-size');

  img.addEventListener('click', () => openLightbox(img.src, img.alt));
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    }
  });
});

function openLightbox(src, alt) {
  lbImg.src = src;
  lbImg.alt = alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


// ── Gallery drag-to-scroll ───────────────────────────────────
const strip = document.querySelector('.gallery-strip');
if (strip) {
  let isDragging = false;
  let startX, scrollStart;

  strip.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - strip.offsetLeft;
    scrollStart = strip.scrollLeft;
    strip.style.userSelect = 'none';
  });

  strip.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const x = e.pageX - strip.offsetLeft;
    strip.scrollLeft = scrollStart - (x - startX);
  });

  ['mouseup', 'mouseleave'].forEach(evt =>
    strip.addEventListener(evt, () => {
      isDragging = false;
      strip.style.userSelect = '';
    })
  );
}


// ── Email signup placeholder ─────────────────────────────────
// Replace this handler with your email provider's embed/form handling.
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm.querySelector('input[type="email"]').value;
    const btn   = signupForm.querySelector('button[type="submit"]');
    btn.textContent = 'Thanks!';
    btn.disabled = true;
    signupForm.querySelector('input[type="email"]').disabled = true;
    console.info('Signup placeholder — integrate email provider for:', email);
  });
}
