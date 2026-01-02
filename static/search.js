(() => {
  const q = document.getElementById('q');
  const results = document.getElementById('results');
  let projects = [];

  function render(items) {
    if (!items.length) {
      results.innerHTML = '<p>Geen resultaten</p>';
      return;
    }
    // render as single-row title per result
    // determine base prefix from injected window.BASEURL (normalize)
    const rawBase = (window.BASEURL || '');
    let base = String(rawBase || '').trim();
    if (base && !base.startsWith('/')) base = '/' + base;
    if (base.endsWith('/')) base = base.slice(0, -1);

    results.innerHTML = items.map(p => {
      const href = `${base}/projects/${p.slug}/`;
      return `
        <div class="result-row">
          <a class="result-link" href="${href}">${p.title}</a>
        </div>
      `;
    }).join('\n');
  }

  function match(p, qstr) {
    if (!qstr) return false; // do not match empty queries
    qstr = qstr.toLowerCase();
    const hay = [p.title, p.subtitle, p.summary, (p.tags || []).join(' ')].filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(qstr) !== -1;
  }

  // preload projects but do not show anything until user types
  fetch('static/projects.json')
    .then(r => r.json())
    .then(data => {
      projects = data;
    })
    .catch(err => {
      console.error('Kon projectenindex niet laden.', err);
    });

  q.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    if (!v) {
      results.innerHTML = ''; // hide results when empty
      return;
    }
    const filtered = projects.filter(p => match(p, v));
    render(filtered);
  });

})();
