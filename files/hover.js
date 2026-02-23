(function(){
  const GAP=6;
  function setup(el){
    if(el._hoverInit)return;
    el._hoverInit=true;
    const tip=el.querySelector(':scope > onhover');
    if(!tip)return;
    const parentTip=el.closest('onhover');
    el.removeChild(tip);
    document.body.appendChild(tip);
    tip._parent=parentTip;
    let timer=null,inside=false;
    tip._cancelHide=()=>clearTimeout(timer);
    function ancestors(){
      let a=parentTip;
      while(a){a._cancelHide&&a._cancelHide();a=a._parent;}
    }
    function show(){
      clearTimeout(timer);
      ancestors();
      document.body.appendChild(tip);
      tip.style.visibility='hidden';
      tip.style.display='inline-block';
      const r=el.getBoundingClientRect(),t=tip.getBoundingClientRect();
      const vw=window.innerWidth,vh=window.innerHeight;
      let top=r.bottom+GAP,left=r.left;
      if(top+t.height>vh)top=r.top-t.height-GAP;
      if(left+t.width>vw)left=r.right-t.width;
      tip.style.top =Math.max(4,Math.min(top, vh-t.height-4))+'px';
      tip.style.left=Math.max(4,Math.min(left,vw-t.width -4))+'px';
      requestAnimationFrame(()=>{tip.style.visibility='';tip.classList.add('visible');});
    }
    function hide(){
      clearTimeout(timer);
      tip.classList.remove('visible');
      setTimeout(()=>{if(!tip.classList.contains('visible'))tip.style.display='';},150);
    }
    el.addEventListener('mouseenter',show);
    el.addEventListener('mouseleave',()=>{timer=setTimeout(()=>{if(!inside)hide();},80);});
    tip.addEventListener('mouseenter',()=>{inside=true;clearTimeout(timer);ancestors();});
    tip.addEventListener('mouseleave',()=>{inside=false;hide();});
  }
  function init(){
    document.querySelectorAll('hover').forEach(setup);
    new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{
      if(n.nodeType!==1)return;
      if(n.tagName==='HOVER')setup(n);
      n.querySelectorAll&&n.querySelectorAll('hover').forEach(setup);
    }))).observe(document.body,{childList:true,subtree:true});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
