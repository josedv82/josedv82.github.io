// Apply saved theme immediately (runs sync in <head>) to prevent flash
(function () {
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
})();

function currentTheme() {
  var set = document.documentElement.getAttribute('data-theme');
  if (set) return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function labelButtons(theme) {
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.textContent = theme === 'dark' ? 'light' : 'dark';
  });
}

function toggleTheme() {
  var next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  labelButtons(next);
}

document.addEventListener('DOMContentLoaded', function () {
  labelButtons(currentTheme());
});
