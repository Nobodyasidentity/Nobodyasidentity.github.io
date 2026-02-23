// hover.js — portals <onhover> tooltips to <body> to escape stacking
// contexts, and re-appends them to end of <body> on each show so the
// active tooltip is always last in DOM = always painted on top.

(function () {
  const GAP = 6;

  function init() {
    document.querySelectorAll('hover').forEach(setup);

    new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'HOVER') setup(node);
          node.querySelectorAll && node.querySelectorAll('hover').forEach(setup);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function setup(hoverEl) {
    if (hoverEl._hoverInit) return;
    hoverEl._hoverInit = true;

    const tooltip = hoverEl.querySelector(':scope > onhover');
    if (!tooltip) return;

    // Portal to body
    hoverEl.removeChild(tooltip);
    document.body.appendChild(tooltip);

    let bridgeTimer = null;
    let tooltipHovered = false;

    function show() {
      clearTimeout(bridgeTimer);

      // Move to END of body — last in DOM always paints on top of
      // all other portalled tooltips, no z-index juggling needed.
      document.body.appendChild(tooltip);

      // Measure size before revealing (invisible but display:block)
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity    = '0';
      tooltip.style.display    = 'inline-block';

      const rect  = hoverEl.getBoundingClientRect();
      const tRect = tooltip.getBoundingClientRect();
      const vw    = window.innerWidth;
      const vh    = window.innerHeight;

      let top  = rect.bottom + GAP;
      let left = rect.left;

      // Flip above if not enough room below
      if (top + tRect.height > vh) top  = rect.top - tRect.height - GAP;
      // Flip left if overflows right edge
      if (left + tRect.width  > vw) left = rect.right - tRect.width;

      // Clamp to viewport
      left = Math.max(4, Math.min(left, vw - tRect.width  - 4));
      top  = Math.max(4, Math.min(top,  vh - tRect.height - 4));

      tooltip.style.top  = top  + 'px';
      tooltip.style.left = left + 'px';

      // Reveal on next frame so the transition actually plays
      requestAnimationFrame(() => {
        tooltip.style.visibility = '';
        tooltip.style.opacity    = '';
        tooltip.classList.add('visible');
      });
    }

    function hide() {
      clearTimeout(bridgeTimer);
      tooltip.classList.remove('visible');
    }

    hoverEl.addEventListener('mouseenter', show);
    hoverEl.addEventListener('mouseleave', () => {
      bridgeTimer = setTimeout(() => {
        if (!tooltipHovered) hide();
      }, 80);
    });

    tooltip.addEventListener('mouseenter', () => {
      tooltipHovered = true;
      clearTimeout(bridgeTimer);
    });
    tooltip.addEventListener('mouseleave', () => {
      tooltipHovered = false;
      hide();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
