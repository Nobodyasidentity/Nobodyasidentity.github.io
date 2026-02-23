function initNavbar(){
  const htmlEl=document.documentElement;
  if(!htmlEl.getAttribute('data-theme')){
    htmlEl.setAttribute('data-theme',localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  }
  fetch('/files/navbar.html').then(res=>res.text()).then(data=>{
      document.body.insertAdjacentHTML('afterbegin',data);
      const toggleBtn=document.getElementById('theme-toggle');
      function updateIcon(){
        toggleBtn.textContent=htmlEl.getAttribute('data-theme')==='dark'?'🌙':'☀️';
      }
      toggleBtn.addEventListener('click',()=>{
        const next=htmlEl.getAttribute('data-theme')==='dark'?'light':'dark';
        htmlEl.setAttribute('data-theme',next);
        localStorage.setItem('theme',next);
        updateIcon();
      });
      updateIcon();
      const menuToggle=document.getElementById('menu-toggle');
      const links=document.querySelectorAll('.nav-links a, .nav-links button');
      links.forEach(link=>{
        link.addEventListener('click',()=>{
          if(menuToggle.checked)menuToggle.checked=false;
        });
      });
    }).catch(err=>console.error('[navbar.js] Failed to load /files/navbar.html:',err));}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initNavbar);}else{initNavbar();}
