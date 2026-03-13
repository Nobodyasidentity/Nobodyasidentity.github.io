(function(){
  const GAP=6,shown=new Set();
  function ancestors(tip){const a=[];let p=tip._par;while(p){a.push(p);p=p._par;}return a;}
  function hasShownDesc(tip){for(const t of shown)if(ancestors(t).includes(tip))return true;return false;}
  function setup(el){
    if(el._hi)return;
    el._hi=true;
    const tip=el.querySelector(':scope > onhover');
    if(!tip)return;
    tip._par=el.closest('onhover');
    el.removeChild(tip);
    document.body.appendChild(tip);
    let timer=null;
    function show(){
      clearTimeout(timer);
      shown.add(tip);
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
    function tryHide(){
      if(hasShownDesc(tip))return;
      shown.delete(tip);
      tip.classList.remove('visible');
      setTimeout(()=>{if(!tip.classList.contains('visible'))tip.style.display='';},150);
      ancestors(tip).forEach(a=>a._sched&&a._sched());
    }
    function sched(){clearTimeout(timer);timer=setTimeout(tryHide,80);}
    tip._sched=sched;
    el.addEventListener('mouseenter',show);
    el.addEventListener('mouseleave',sched);
    tip.addEventListener('mouseenter',()=>clearTimeout(timer));
    tip.addEventListener('mouseleave',sched);
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