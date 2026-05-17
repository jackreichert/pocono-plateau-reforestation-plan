// ── Navigation ────────────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target))
      navLinks.classList.remove('open');
  });
}

// Mark active nav link
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === path) a.classList.add('active');
});

// ── Tabs ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('[data-tabs]');
    if (!group) return;
    group.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const target = group.querySelector(`[data-panel="${btn.dataset.tab}"]`);
    if (target) target.classList.add('active');
  });
});

// ── Species modal ─────────────────────────────────────────────────────────
const overlay = document.getElementById('species-modal-overlay');
let _modalTrigger = null;

if (overlay) {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
  // Focus trap: keep Tab cycling within the modal when open
  overlay.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open') || e.key !== 'Tab') return;
    const focusable = Array.from(overlay.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function openModal(data) {
  if (!overlay) return;
  _modalTrigger = document.activeElement;
  document.getElementById('modal-name').textContent   = data.name;
  document.getElementById('modal-latin').textContent  = data.latin || '';
  document.getElementById('modal-why').textContent    = data.why || '';
  document.getElementById('modal-notes').textContent  = data.notes || '';
  document.getElementById('modal-layer').textContent  = data.layer || '';
  document.getElementById('modal-protection').textContent = data.protection || '';
  const imgEl = document.getElementById('modal-img');
  const phEl  = document.getElementById('modal-img-placeholder');
  if (data.photo) {
    imgEl.src = data.photo; imgEl.alt = data.name;
    imgEl.style.display = 'block';
    if (phEl) phEl.style.display = 'none';
  } else {
    if (imgEl) imgEl.style.display = 'none';
    if (phEl) { phEl.style.display = 'flex'; phEl.textContent = '🌳'; }
  }
  document.getElementById('modal-attribution').innerHTML =
    data.attribution ? `<small class="text-xs text-mid">Photo: ${data.attribution}</small>` : '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (_modalTrigger) { _modalTrigger.focus(); _modalTrigger = null; }
}

window.openModal  = openModal;
window.closeModal = closeModal;

// ── Smooth-scroll for anchor links ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Lightbox (click-to-expand any photo) ──────────────────────────────────
// Usage:
//   window.openLightbox([{url, caption?, credit?, license?, file_page_url?, category?}], startIdx?)
// State is held on the lightbox element itself so the helper stays stateless.
(function lightboxModule() {
  let lb = null;

  function ensure() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = `
      <div class="lightbox-counter" aria-live="polite"></div>
      <button class="lightbox-close" aria-label="Close"></button>
      <button class="lightbox-prev" aria-label="Previous image"></button>
      <button class="lightbox-next" aria-label="Next image"></button>
      <img class="lightbox-img" src="" alt="" />
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
    lb.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
    lb.querySelector('.lightbox-img').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
    // Click backdrop to close (but not image/buttons)
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    });

    return lb;
  }

  function render() {
    const images = lb._images || [];
    const idx = lb._idx || 0;
    const item = images[idx] || {};
    const img = lb.querySelector('.lightbox-img');
    // Fade for the swap
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = item.url || '';
      img.alt = item.caption || item.category || '';
      img.style.opacity = '1';
    }, 120);

    const captionEl = lb.querySelector('.lightbox-caption');
    const parts = [];
    if (item.category) parts.push(`<em>${item.category}</em>`);
    if (item.caption && item.caption !== item.category) parts.push(item.caption);
    if (item.credit) parts.push(`Photo: ${item.credit}`);
    if (item.license) parts.push(item.license);
    if (item.file_page_url) parts.push(`<a href="${item.file_page_url}" target="_blank" rel="noopener">view source ↗</a>`);
    captionEl.innerHTML = parts.join(' · ') || '';
    captionEl.style.display = parts.length ? '' : 'none';

    const showNav = images.length > 1;
    lb.querySelector('.lightbox-prev').style.display = showNav ? '' : 'none';
    lb.querySelector('.lightbox-next').style.display = showNav ? '' : 'none';

    const counterEl = lb.querySelector('.lightbox-counter');
    if (showNav) {
      counterEl.textContent = `${idx + 1} / ${images.length}`;
      counterEl.style.display = '';
    } else {
      counterEl.style.display = 'none';
    }
  }

  function step(delta) {
    const images = lb._images || [];
    if (images.length < 2) return;
    lb._idx = (lb._idx + delta + images.length) % images.length;
    render();
  }

  function open(images, startIdx = 0) {
    if (!images || !images.length) return;
    ensure();
    lb._images = images;
    lb._idx = Math.max(0, Math.min(startIdx, images.length - 1));
    render();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openLightbox  = open;
  window.closeLightbox = close;
})();

// Auto-attach lightbox to any <img data-lightbox> or [data-lightbox] container.
// Single-image case: data-lightbox="single" with src on the img itself.
// Multi-image case: lightbox is triggered programmatically by feature code.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-lightbox="single"]');
  if (!trigger) return;
  e.preventDefault();
  const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
  if (!img) return;
  window.openLightbox([{
    url:           img.dataset.lightboxFull || img.src,
    caption:       img.alt || '',
    credit:        img.dataset.credit || '',
    license:       img.dataset.license || '',
    file_page_url: img.dataset.sourceUrl || '',
    category:      img.dataset.category || '',
  }]);
});

// ── Species strip renderer ────────────────────────────────────────────────
// Markup pattern:
//   <div class="species-strip" data-species="northern_red_oak,shagbark_hickory,..."></div>
// Each card uses gallery 'tree' image (falls back to leaf, then fruit).
(async function renderSpeciesStrips() {
  const strips = document.querySelectorAll('.species-strip[data-species]');
  if (!strips.length) return;

  // Photos: prefer window.SPECIES_GALLERY (if region-loader already populated it)
  // — otherwise fetch the gallery JSON directly.
  let gallery = window.SPECIES_GALLERY;
  let speciesIndex = {};
  if (!gallery) {
    try {
      const res = await fetch('data/regions/pocono-plateau/photos-gallery.json?v=20260511');
      if (res.ok) gallery = await res.json();
    } catch (_) { /* graceful: leave gallery undefined */ }
  }
  // Also fetch the species index so we can resolve key → display name.
  // Fallback: derive display name from the key itself.
  try {
    const idxRes = await fetch('data/regions/pocono-plateau/species/index.json?v=20260511');
    if (idxRes.ok) {
      const keys = await idxRes.json();
      // Lightweight name lookup — fetch each species' name only if needed for a strip.
      const stripKeys = new Set();
      strips.forEach(el => el.dataset.species.split(',').map(s => s.trim()).forEach(k => stripKeys.add(k)));
      const needed = keys.filter(k => stripKeys.has(k));
      const speciesArr = await Promise.all(needed.map(k =>
        fetch(`data/regions/pocono-plateau/species/${k.replace(/_/g, '-')}.json?v=20260511`).then(r => r.ok ? r.json() : null)
      ));
      speciesArr.filter(Boolean).forEach(s => { speciesIndex[s.key] = s; });
    }
  } catch (_) {}

  // If region-loader already populated SPECIES_DATA, use it
  if (window.SPECIES_DATA) {
    window.SPECIES_DATA.forEach(s => { speciesIndex[s.key] = s; });
  }

  function prettyName(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function cardHtml(key) {
    const sp = speciesIndex[key];
    const photo = (gallery || {})[key];
    const url = photo && (photo.tree?.url || photo.leaf?.url || photo.fruit?.url || photo.flower?.url);
    const name = sp ? sp.name : prettyName(key);
    const latin = sp ? sp.latin : '';
    const imgHtml = url
      ? `<img class="species-strip-img" src="${url}" alt="${name}" loading="lazy" onerror="this.style.display='none'">`
      : `<div class="species-strip-img" style="display:flex;align-items:center;justify-content:center;font-family:var(--display);font-style:italic;font-size:1.6rem;color:var(--lichen)">${(latin||name).split(' ')[0]}</div>`;
    return `
      <a href="species.html#${key}" class="species-strip-card">
        ${imgHtml}
        <div class="species-strip-body">
          ${latin ? `<div class="species-strip-binom">${latin}</div>` : ''}
          <div class="species-strip-name">${name}</div>
        </div>
      </a>`;
  }

  strips.forEach(strip => {
    const keys = strip.dataset.species.split(',').map(s => s.trim()).filter(Boolean);
    strip.innerHTML = keys.map(cardHtml).join('');
  });
})();
