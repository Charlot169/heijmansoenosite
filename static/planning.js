(() => {
  function parseISO(s) {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  document.querySelectorAll('.planning').forEach(block => {
    const radioName = block.querySelector('input[type="radio"]')?.name;
    const tableWrap = block.querySelector('.planning-table-wrap');
    const timelineWrap = block.querySelector('.planning-timeline-wrap');
    const timelineContainer = block.querySelector('.timeline-container');

    function showView(v){
      if (v === 'table'){
        tableWrap.style.display = '';
        timelineWrap.style.display = 'none';
        timelineWrap.setAttribute('aria-hidden','true');
      } else {
        tableWrap.style.display = 'none';
        timelineWrap.style.display = 'block';
        timelineWrap.setAttribute('aria-hidden','false');
        renderTimeline();
      }
    }

    block.querySelectorAll(`input[name="${radioName}"]`).forEach(r => {
      r.addEventListener('change', e => showView(e.target.value));
    });

    function renderTimeline(){
      if (!timelineContainer) return;
      const startStr = timelineContainer.getAttribute('data-start');
      const endStr = timelineContainer.getAttribute('data-end');
      const startDate = parseISO(startStr);
      const endDate = parseISO(endStr);
      if (!startDate || !endDate) {
        console.warn('timeline: invalid start/end dates', startStr, endStr);
        return;
      }
      const total = endDate - startDate;
      if (total <= 0) {
        console.warn('timeline: total duration is 0 or negative', total);
        return;
      }

      // Count rows and set height
      const rows = timelineContainer.querySelectorAll('.timeline-row').length;
      const headerHeight = 60; // header + spacing
      const rowHeight = 60; // per row
      const totalHeight = headerHeight + (rows * rowHeight);
      timelineWrap.style.height = totalHeight + 'px';

      // Position each timeline row's marker
      timelineContainer.querySelectorAll('.timeline-row').forEach(row => {
        const s = parseISO(row.getAttribute('data-start'));
        const e = parseISO(row.getAttribute('data-end'));
        if (!s || !e) {
          console.warn('timeline-row: invalid dates', row.getAttribute('data-start'), row.getAttribute('data-end'));
          return;
        }

        const markerDate = s;
        const relPos = clamp((markerDate - startDate) / total, 0, 1);
        const left = relPos * 100;

        const marker = row.querySelector('.timeline-marker');
        if (marker) {
          marker.style.left = left + '%';
        }
      });
    }

    showView('table');
  });
})();
