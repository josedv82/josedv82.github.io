// Apply saved theme immediately (runs sync in <head>) to prevent flash
(function () {
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
})();

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.textContent = next === 'dark' ? 'light' : 'dark';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.textContent = theme === 'dark' ? 'light' : 'dark';
  });
});
