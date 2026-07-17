/* ============================================================
   Snallyfest 2026 — script.js
   ============================================================ */

// ── Hero video rotation ──────────────────────────────────────
// hero-01 (first 10 s of the 2025 recap) always plays first; after
// it ends, clips rotate at random with no immediate repeats.
// Drop new clips in assets/ and add them here to join the rotation.
const HERO_CLIPS = [
  'assets/hero-01.mp4',
  'assets/hero-02.mp4',
  'assets/hero-03.mp4',
  'assets/hero-04.mp4',
  'assets/hero-05.mp4',
  'assets/hero-06.mp4',
  'assets/hero-07.mp4',
  'assets/hero-08.mp4',
  'assets/hero-09.mp4',
  'assets/hero-10.mp4',
  'assets/hero-11.mp4',
  'assets/hero-12.mp4',
  'assets/hero-13.mp4',
  'assets/hero-14.mp4',
  'assets/hero-15.mp4',
  'assets/hero-16.mp4',
  'assets/hero-17.mp4',
];

const heroVideo = document.querySelector('.hero-video');
if (heroVideo && HERO_CLIPS.length > 1) {
  heroVideo.removeAttribute('loop'); // loop is only the no-JS fallback

  // Second <video> buffer so the next clip is preloaded and the
  // swap is a crossfade instead of a black flash.
  const buddy = heroVideo.cloneNode();
  buddy.removeAttribute('autoplay');
  buddy.removeAttribute('poster');
  buddy.preload = 'auto';
  buddy.classList.add('hero-video-hidden');
  buddy.setAttribute('aria-hidden', 'true');
  heroVideo.after(buddy);

  let visible = heroVideo;
  let standby = buddy;
  let playingIdx = 0; // hero-01

  function pickNextIdx() {
    let i;
    do {
      i = Math.floor(Math.random() * HERO_CLIPS.length);
    } while (i === playingIdx);
    return i;
  }

  let queuedIdx = pickNextIdx();
  standby.src = HERO_CLIPS[queuedIdx];
  standby.load();

  function performSwap() {
    standby.currentTime = 0;
    standby.removeAttribute('poster'); // never flash the thumbnail mid-rotation
    const played = standby.play();
    if (played) played.catch(() => {});
    standby.classList.remove('hero-video-hidden');
    visible.classList.add('hero-video-hidden');
    [visible, standby] = [standby, visible];
    playingIdx = queuedIdx;
    queuedIdx = pickNextIdx();
    standby.src = HERO_CLIPS[queuedIdx];
    standby.load();
  }

  // Only swap once the queued clip has buffered enough to play through;
  // until then the ended video stays frozen on its final frame.
  function rotateHero() {
    if (standby.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      performSwap();
    } else {
      standby.addEventListener('canplay', performSwap, { once: true });
    }
  }

  heroVideo.addEventListener('ended', rotateHero);
  buddy.addEventListener('ended', rotateHero);
}


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


// ── Venue map (Leaflet + CARTO dark basemap) ─────────────────
const mapEl = document.getElementById('venue-map');
if (mapEl && typeof L !== 'undefined') {
  const venues = [
    { name: 'Creek Stage', addr: 'Carroll Creek Amphitheater', lat: 39.41264, lng: -77.40869 },
    { name: 'Sky Stage', addr: '59 S Carroll St', lat: 39.41185, lng: -77.40797 },
    { name: 'Cafe Nola', addr: '4 E Patrick St', lat: 39.41401, lng: -77.41055 },
    { name: 'Eagles Club', addr: '207 W Patrick St', lat: 39.41383, lng: -77.41541 },
    { name: 'Sandbox Brewhouse', addr: '880 N East St', lat: 39.42507, lng: -77.40328 },
  ];

  const map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  const pin = L.divIcon({
    className: 'venue-pin',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
  });

  const markers = L.featureGroup(
    venues.map(v => {
      const gmaps =
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(`${v.name}, ${v.addr}, Frederick, MD 21701`);
      return L.marker([v.lat, v.lng], { icon: pin, title: v.name, alt: v.name })
        .bindPopup(
          `<strong>${v.name}</strong><br>${v.addr}<br>` +
          `<a href="${gmaps}" target="_blank" rel="noopener noreferrer">Directions</a>`
        );
    })
  ).addTo(map);

  map.fitBounds(markers.getBounds(), { padding: [45, 45] });
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
