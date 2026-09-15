// ---- theme toggle ----
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
function applyTheme(t){
  root.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('irc-taxi-theme', t);
}
applyTheme(localStorage.getItem('irc-taxi-theme') || 'dark');
themeToggle.addEventListener('click', () => {
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ---- package selection ----
const selPkgName = document.getElementById('selPkgName');
const selPkgPrice = document.getElementById('selPkgPrice');
document.querySelectorAll('.select-pkg').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.pkg-card');
    selPkgName.textContent = card.dataset.pkg;
    selPkgPrice.textContent = card.dataset.price;
  });
});

// ---- music toggle ----
const musicChips = document.querySelectorAll('.chip');
const musicOptions = document.getElementById('musicOptions');
musicChips.forEach(chip => {
  chip.addEventListener('click', () => {
    musicChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    if(chip.dataset.music === 'yes'){
      musicOptions.classList.add('show');
    } else {
      musicOptions.classList.remove('show');
      document.querySelectorAll('input[name="music"]').forEach(r => r.checked = false);
    }
  });
});
document.querySelectorAll('.music-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.music-opt').forEach(o => o.classList.remove('checked'));
    opt.classList.add('checked');
  });
});

// ---- hero slideshow (car illustration <-> logo) ----
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-slide-dots .dot');
let heroIndex = 0;
function showHeroSlide(i){
  heroIndex = i;
  heroSlides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  heroDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
}
heroDots.forEach((dot, idx) => {
  dot.addEventListener('click', () => showHeroSlide(idx));
});
if (heroSlides.length > 1) {
  setInterval(() => {
    showHeroSlide((heroIndex + 1) % heroSlides.length);
  }, 4500);
}

// ---- form submit ----
const form = document.getElementById('bookForm');
const toast = document.getElementById('toast');
const submitBtn = form.querySelector('button[type="submit"]');
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const wantsMusic = document.querySelector('.chip[data-music="yes"]').classList.contains('active');
  const musicChoice = wantsMusic
    ? (document.querySelector('input[name="music"]:checked')?.value || 'Yes — genre not picked yet')
    : 'No';

  const booking = {
    package: selPkgName.textContent,
    price: selPkgPrice.textContent,
    name: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    pickup: document.getElementById('pickup').value,
    dropoff: document.getElementById('dropoff').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    music: musicChoice,
    notes: document.getElementById('notes').value || '—'
  };

  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    const result = await res.json();

    if (!result.ok) {
      showToast(result.error || 'Something went wrong sending that booking.');
      return;
    }

    window.open(result.url, '_blank');
    showToast('Opening WhatsApp with your booking filled in — hit send there to confirm.');
  } catch (err) {
    showToast('Could not reach the server. Check your connection and try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});
