(function(){
  const url=new URL(document.currentScript?.src);
  const hash=url.hash.slice(1);
  function loadScript(src){
    if(document.querySelector(`script[src="${src}"]`))return;
    const s=document.createElement('script');
    s.src=src;
    document.body.appendChild(s);
  }
  loadScript(`${hash}/files/main.js`);
  loadScript(`${hash}/files/navbar.js`);
})();