const KEY = 'casi-real:bag:v1';
function loadBag() {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}
function bagCount() {
  return loadBag().reduce((s, i) => s + (Number(i.quantity) || 0), 0);
}
function updateCount() {
  document.querySelectorAll('.bag-count').forEach((el) => {
    el.textContent = String(bagCount());
  });
}
updateCount();
window.addEventListener('casi-real:bag-changed', updateCount);

const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}
