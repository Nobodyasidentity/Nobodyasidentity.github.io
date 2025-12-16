document.addEventListener("DOMContentLoaded",function(){
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('theme')||'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  fetch('/files/navbar.html')
    .then(res => res.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      const toggleBtn = document.getElementById('theme-toggle');
      function updateIcon() {
        toggleBtn.textContent = htmlEl.getAttribute('data-theme') === 'dark' ?'🌙':'☀️';
      }
      toggleBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon();
      });
      updateIcon();
      const links = document.querySelectorAll('.nav-links a, .nav-links button');
      const menuToggle = document.getElementById('menu-toggle');
      links.forEach(link => {
        link.addEventListener('click', () => {
          if (menuToggle.checked) menuToggle.checked = false;
        });
      });
    });
});
