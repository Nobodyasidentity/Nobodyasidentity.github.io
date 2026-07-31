(function(){
  class mc_obfuscated{static TICK_MS=1;static CHARS=Array.from({length:94},(t,e)=>String.fromCharCode(33+e));constructor(){this._measureCanvas=document.createElement("canvas"),this._measureCtx=this._measureCanvas.getContext("2d"),this._state=new WeakMap,this._tick=this._tick.bind(this)}start(){this._tick()}_tick(){const t=document.getElementsByClassName("mc-obfuscated");for(let e=0;e<t.length;e++)this._obfuscateElement(t[e]);setTimeout(this._tick,mc_obfuscated.TICK_MS)}_fontStringFor(t){const e=getComputedStyle(t);return`${e.fontStyle} ${e.fontWeight} ${e.fontSize} ${e.fontFamily}`}_buildWidthGroups(t){this._measureCtx.font=t;const e=new Map;for(const t of mc_obfuscated.CHARS){const s=Math.round(10*this._measureCtx.measureText(t).width)/10;e.has(s)||e.set(s,[]),e.get(s).push(t)}return e}_randomTicks(){return 2+Math.floor(6*Math.random())}_prepareElement(t){const e=t.textContent,s=this._fontStringFor(t),n=this._buildWidthGroups(s);this._measureCtx.font=s,t.textContent="";const o=[];for(const s of e){const e=document.createElement("span");if(e.textContent=s,t.appendChild(e),/\s/.test(s)){o.push(null);continue}const a=Math.round(10*this._measureCtx.measureText(s).width)/10,r=n.get(a)||[s];o.push({span:e,pool:r,ticksLeft:this._randomTicks()})}this._state.set(t,{font:s,chars:o})}_obfuscateElement(t){let e=this._state.get(t);e&&e.font===this._fontStringFor(t)||(this._prepareElement(t),e=this._state.get(t));for(const t of e.chars)t&&(--t.ticksLeft>0||(t.span.textContent=t.pool[Math.floor(Math.random()*t.pool.length)],t.ticksLeft=this._randomTicks()))}}
  (new mc_obfuscated).start();
  const htmlEl=document.documentElement;
  const url=new URL(document.currentScript?.src);
  var hash=url.hash.slice(1)||(typeof process!=='undefined'&&process.versions?.electron?'app://':'https://nobodyasidentity.github.io');
  if(hash==="/"){hash="";}
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
