/*
  Single source of truth for The Cybernetic Atlas:
  Core ontology catalog and persistent navigation widget.
  
  Usage:
    Root Hub (index.html):
      <script src="assets/library-nav.js" data-mode="hub"></script>
    Book pages (books/<book>/reader.html, interactive_atlas.html):
      <script src="../../assets/library-nav.js"></script>
*/
(function () {
  const BOOKS = [
    {
      dir: 'sheep-os',
      title: 'The Architecture of the Consensus Cluster',
      tagline: 'Distributed Mimetic Protocols, Byzantine frequency entrainment, and homeostatic damping loops.',
      badge: 'CONSENSUS CLUSTER',
      accent: '#a855f7',
      status: 'complete',
    },
    {
      dir: 'sovereign-engine',
      title: 'The Sovereign Engine',
      tagline: 'Internal command authority, hardware governance, and entropy reduction for high-variance minds.',
      badge: 'SOVEREIGN CORE',
      accent: '#8b5cf6',
      status: 'complete',
    },
    {
      dir: 'frame-stack',
      title: 'The Frame Stack',
      tagline: 'An OSI model for cognitive encounters: protocol layers, gated transport, and packet diagnostics.',
      badge: 'TELECOMMUNICATIONS',
      accent: '#0ea5e9',
      status: 'complete',
    },
  ];

  window.CYBERNETIC_ATLAS = BOOKS;
  window.ATLAS_LIBRARY = BOOKS;

  const thisScript = document.currentScript;
  const mode = (thisScript && thisScript.dataset && thisScript.dataset.mode) || 'book';
  if (mode === 'hub') return; // the hub renders its own cards from CYBERNETIC_ATLAS

  const path = decodeURIComponent(location.pathname).replace(/\\/g, '/');
  const segs = path.split('/').filter(Boolean);
  const currentDir = segs.length >= 2 ? segs[segs.length - 2] : '';
  const currentFile = segs.length >= 1 ? segs[segs.length - 1] : '';

  const style = document.createElement('style');
  style.textContent = `
    #atlas-lib-toggle {
      position: fixed; right: 20px; bottom: 20px; z-index: 99999;
      width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18);
      background: rgba(10,12,20,0.85); color: #e2e8f0; font-size: 20px; line-height: 1;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5); backdrop-filter: blur(12px);
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    #atlas-lib-toggle:hover { transform: scale(1.06); box-shadow: 0 6px 24px rgba(139,92,246,0.35); border-color: rgba(168,85,247,0.5); }
    #atlas-lib-panel {
      position: fixed; right: 20px; bottom: 76px; z-index: 99999;
      width: 300px; max-height: 75vh; overflow-y: auto;
      background: rgba(12,14,24,0.96); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px; padding: 12px; box-shadow: 0 16px 45px rgba(0,0,0,0.65);
      backdrop-filter: blur(16px); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #atlas-lib-panel a.atlas-lib-hub {
      display: flex; align-items: center; justify-content: space-between;
      padding: 9px 12px; margin-bottom: 8px; border-radius: 8px;
      color: #f8fafc; text-decoration: none; font-size: 0.84rem; font-weight: 600;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      transition: background 0.15s ease;
    }
    #atlas-lib-panel a.atlas-lib-hub:hover { background: rgba(255,255,255,0.12); }
    .atlas-lib-list { display: flex; flex-direction: column; gap: 6px; }
    .atlas-lib-item {
      display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 9px;
      color: #cbd5e1; border-left: 3px solid var(--b, #64748b);
      background: rgba(255,255,255,0.03);
    }
    .atlas-lib-item.is-current-book { background: rgba(255,255,255,0.08); border-color: var(--b, #a855f7); }
    .atlas-lib-item-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .atlas-lib-item-title { font-size: 0.86rem; font-weight: 600; color: #fff; }
    .atlas-lib-here { font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; white-space: nowrap; }
    .atlas-lib-item-links { display: flex; gap: 6px; }
    .atlas-lib-item-links a {
      flex: 1; text-align: center; font-size: 0.74rem; font-weight: 700; text-decoration: none;
      padding: 5px 8px; border-radius: 6px; color: #e2e8f0; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08); transition: all 0.15s ease;
    }
    .atlas-lib-item-links a:hover { background: rgba(255,255,255,0.15); border-color: var(--b, #64748b); }
    .atlas-lib-item-links a.is-current { pointer-events: none; color: #05070d; background: var(--b, #64748b); border-color: var(--b, #64748b); }
    .atlas-protocols-link {
      display: block; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 0.72rem; color: #94a3b8; text-align: center; text-decoration: none;
    }
    .atlas-protocols-link:hover { color: #c084fc; }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'atlas-lib-widget';
  wrap.innerHTML = `
    <div id="atlas-lib-panel" hidden>
      <a class="atlas-lib-hub" href="../../index.html">
        <span>&#8617; Atlas Portal</span>
        <span style="font-size:0.65rem; color:#a855f7; letter-spacing:0.08em; text-transform:uppercase;">Root</span>
      </a>
      <div class="atlas-lib-list">
        ${BOOKS.map(b => {
          const isCurrentBook = b.dir === currentDir;
          const dirEnc = encodeURIComponent(b.dir);
          const isCurrentReader = isCurrentBook && currentFile === 'reader.html';
          const isCurrentAtlas = isCurrentBook && currentFile === 'interactive_atlas.html';
          return `
          <div class="atlas-lib-item${isCurrentBook ? ' is-current-book' : ''}" style="--b:${b.accent}">
            <div class="atlas-lib-item-head">
              <span class="atlas-lib-item-title">${b.title}</span>
              <span class="atlas-lib-here">${isCurrentBook ? 'CURRENT' : b.badge}</span>
            </div>
            <div class="atlas-lib-item-links">
              <a class="${isCurrentReader ? 'is-current' : ''}" href="../${dirEnc}/reader.html">${isCurrentReader ? 'Reading' : 'Reader'}</a>
              <a class="${isCurrentAtlas ? 'is-current' : ''}" href="../${dirEnc}/interactive_atlas.html">${isCurrentAtlas ? 'Viewing' : 'Atlas'}</a>
            </div>
          </div>
        `;
        }).join('')}
      </div>
      <a class="atlas-protocols-link" href="../../protocols/RECIPROCITY.md">⚡ Autonomous Reciprocity Directive</a>
    </div>
    <button id="atlas-lib-toggle" type="button" title="Cybernetic Atlas Navigation" aria-label="Open atlas navigation">&#128218;</button>
  `;
  document.body.appendChild(wrap);

  const toggle = wrap.querySelector('#atlas-lib-toggle');
  const panel = wrap.querySelector('#atlas-lib-panel');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !wrap.contains(e.target)) panel.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') panel.hidden = true;
  });
})();
