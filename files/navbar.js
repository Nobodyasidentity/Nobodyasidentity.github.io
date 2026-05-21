function initNavbar(){
  const url=new URL(document.currentScript?.src);
  const hash=url.hash.slice(1);
  const htmlEl=document.documentElement;
  if(!htmlEl.getAttribute('data-theme')){
    htmlEl.setAttribute('data-theme',localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  }
  fetch(`${hash}/files/navbar.html`).then(res=>res.text()).then(html=>{
    document.body.insertAdjacentHTML('afterbegin',html);
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
    const links=document.querySelectorAll('.nav-links a, .nav-links button:not(.branches-btn)');
    links.forEach(link=>{
      link.addEventListener('click',()=>{
        if(menuToggle.checked)menuToggle.checked=false;
      });
    });
    const btn=document.querySelector('.branches-btn');
    const panel=document.querySelector('.branches-panel');
    if(btn&&panel){
      function branchReposition(){
        if(window.innerWidth<=768) return;
        panel.style.position='fixed';
        panel.style.left='0';
        panel.style.right='auto';
        panel.style.top='0';
        panel.style.transform='none';
        const btnRect=btn.getBoundingClientRect();
        const pw=panel.offsetWidth;
        const vw=window.innerWidth;
        const pad=8;
        let left=btnRect.left+btnRect.width/2-pw/2;
        left=Math.max(pad,Math.min(left,vw-pw-pad));
        panel.style.top=(btnRect.bottom+10)+'px';
        panel.style.left=left+'px';
      }
      function branchOpen(){
        branchReposition();
        btn.setAttribute('aria-expanded','true');
        panel.classList.add('open');
      }
      function branchClose(){
        btn.setAttribute('aria-expanded','false');
        panel.classList.remove('open');
        panel.style.cssText='';
      }
      function branchToggle(){
        btn.getAttribute('aria-expanded')==='true'?branchClose():branchOpen();
      }
      btn.addEventListener('click',(e)=>{ e.stopPropagation(); branchToggle(); });
      document.addEventListener('click',branchClose);
      panel.addEventListener('click',(e)=>e.stopPropagation());
      document.addEventListener('keydown',(e)=>{ if(e.key==='Escape')branchClose(); });
      window.addEventListener('resize',()=>{
        if(btn.getAttribute('aria-expanded')==='true')branchReposition();
      });
    }
    const branchesInner=document.getElementById('branches-inner');
    const branchesItem=document.querySelector('.branches-item');
    fetch(`${hash}/pages.json`)
      .then(res=>{
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(pages=>{
        if(!branchesInner) return;
        if(!Array.isArray(pages.branches)||pages.branches.length===0){
          if(branchesItem) branchesItem.style.display='none';
          return;
        }
        function buildItem(item){
          if(item.pages&&item.pages.length>0){
            const folder=document.createElement('div');
            folder.className='branch-folder';

            const folderBtn=document.createElement('button');
            folderBtn.className='branch-folder-btn';

            const titleSpan=document.createElement('span');
            titleSpan.textContent=item.title;

            const arrow=document.createElement('span');
            arrow.className='branch-folder-arrow';
            arrow.setAttribute('aria-hidden','true');
            arrow.textContent='▶';

            folderBtn.appendChild(titleSpan);
            folderBtn.appendChild(arrow);
            folder.appendChild(folderBtn);

            const pagesWrap=document.createElement('div');
            pagesWrap.className='branch-folder-pages';

            const pagesInner=document.createElement('div');
            pagesInner.className='branch-folder-inner';

            item.pages.forEach(child=>pagesInner.appendChild(buildItem(child)));
            pagesWrap.appendChild(pagesInner);
            folder.appendChild(pagesWrap);

            folderBtn.addEventListener('click',(e)=>{
              e.stopPropagation();
              folder.classList.toggle('open');
            });

            return folder;
          } else {
            const a=document.createElement('a');
            a.href=item.url;
            a.textContent=item.title;
            return a;
          }
        }

        pages.branches.forEach((branch,i)=>{
          if(i>0){
            const divider=document.createElement('div');
            divider.className='branch-divider';
            branchesInner.appendChild(divider);
          }
          const col=document.createElement('div');
          col.className='branch-col';
          const labelEl=document.createElement('span');
          labelEl.className='branch-label';
          labelEl.textContent=branch.label;
          col.appendChild(labelEl);
          (branch.pages||[]).forEach(page=>{
            col.appendChild(buildItem(page));
          });
          branchesInner.appendChild(col);
        });
      })
      .catch(err=>{
        console.warn('[navbar.js] Could not load pages.json:',err);
        if(branchesItem) branchesItem.style.display='none';
      });
  }).catch(err=>console.error(`[navbar.js] Failed to load navbar.html:`,err));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initNavbar);}else{initNavbar();}