(function(){
  const htmlEl=document.documentElement;
  const url=new URL(document.currentScript?.src);
  const hash=url.hash.slice(1);
  function applyTheme(theme){
    htmlEl.setAttribute('data-theme',theme);
    localStorage.setItem('theme',theme);
  }
  const savedTheme=localStorage.getItem('theme')||'dark';
  htmlEl.setAttribute('data-theme',savedTheme);
  function injectHead(tag,attrs,check){
    if(check&&document.querySelector(check))return;
    const el=document.createElement(tag);
    for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);
    document.head.appendChild(el);
  }
  injectHead('meta',{ charset:'UTF-8'},'meta[charset]');
  injectHead('meta',{ name:'viewport',content:'width=device-width, initial-scale=1.0'},'meta[name="viewport"]');
  injectHead('link',{ rel:'stylesheet',href:`${hash}/files/style.css`},`link[href="${hash}/files/style.css"]`);
  injectHead('link',{ rel:'icon',href:`${hash}/files/icon.png`},'link[rel="icon"]');
  function loadScript(src){
    if(document.querySelector(`script[src="${src}"]`))return;
    const s=document.createElement('script');
    s.src=src;
    document.body.appendChild(s);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);
  }else{run();}
  function run(){loadScript(`${hash}/files/hover.js`);}
})();