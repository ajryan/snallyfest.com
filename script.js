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


// ── Flyer Instagram link ──────────────────────────────────────
const INSTAGRAM_URL = 'https://www.instagram.com/p/Dafwi7aOVdu/';

const shareBtn = document.getElementById('flyer-share-btn');
if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
  });
}


// ── Email signup (Mailchimp JSONP) ───────────────────────────
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn    = signupForm.querySelector('button[type="submit"]');
    const params = new URLSearchParams(new FormData(signupForm));
    const cbName = 'mcCb_' + Date.now();

    btn.textContent = '...';
    btn.disabled = true;

    // Remove any previous error message
    const prev = signupForm.querySelector('.signup-error');
    if (prev) prev.remove();

    window[cbName] = function (res) {
      delete window[cbName];
      const s = document.getElementById('mc-jsonp');
      if (s) s.remove();

      if (res.result === 'success') {
        btn.textContent = 'Thanks!';
        signupForm.querySelectorAll('input, textarea').forEach(i => { i.disabled = true; });
      } else {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        const err = document.createElement('p');
        err.className = 'signup-error';
        // Mailchimp prepends a numeric code to some error messages — strip it
        err.textContent = (res.msg || 'Something went wrong. Please try again.')
          .replace(/^\d+ - /, '');
        signupForm.appendChild(err);
      }
    };

    const script  = document.createElement('script');
    script.id     = 'mc-jsonp';
    script.src    = `https://live.us3.list-manage.com/subscribe/post-json?${params}&c=${cbName}`;
    document.body.appendChild(script);

    // Fallback: re-enable if Mailchimp doesn't respond within 10 s
    setTimeout(() => {
      if (window[cbName]) {
        delete window[cbName];
        btn.textContent = 'Subscribe';
        btn.disabled = false;
      }
    }, 10000);
  });
}
