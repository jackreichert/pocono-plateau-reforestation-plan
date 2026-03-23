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
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = group.querySelector(`[data-panel="${btn.dataset.tab}"]`);
    if (target) target.classList.add('active');
  });
});

// ── Species modal ─────────────────────────────────────────────────────────
const overlay = document.getElementById('species-modal-overlay');
if (overlay) {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(data) {
  if (!overlay) return;
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
}

function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
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
