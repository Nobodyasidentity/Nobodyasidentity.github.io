(function(){
  const head=document.head;
  function injectHead(tag,attrs,check){
    if(check&&document.querySelector(check))return;
    const el=document.createElement(tag);
    for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);
    head.appendChild(el);
  }
  injectHead('meta',{charset:'UTF-8'},'meta[charset]');
  injectHead('meta',{name:'viewport',content:'width=device-width,initial-scale=1.0'},'meta[name="viewport"]');
  injectHead('link',{rel:'stylesheet',href:'/files/style.css'},'link[href="/files/style.css"]');
  injectHead('link',{rel:'icon',href:'/files/icon.png'},'link[rel="icon"]');
  document.documentElement.setAttribute(
    'data-theme',
    localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  injectHead('script', { src: '/files/navbar.js' },
    'script[src="/files/navbar.js"]');
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }
  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  }
  onReady(function () {
    loadScript('/files/hover.js');
    document.addEventListener('click', function (e) {
      const clicked = e.target.closest('click');
      document.querySelectorAll('click[open]').forEach(el => {
        if (el !== clicked) el.removeAttribute('open');
      });
      if (clicked) {
        clicked.toggleAttribute('open');
        e.stopPropagation();
      }
    });
  });
})();
