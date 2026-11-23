const catalog = document.querySelector('.catalog');
if (catalog) {
  const entries = [...catalog.querySelectorAll('.convention-entry')];
  const buttons = [...catalog.querySelectorAll('button[data-topic]')];
  const status = catalog.querySelector('#catalog-status');
  const filters = catalog.querySelector('.catalog-filters');
  function selectTopic(topic) {
    let count = 0;
    for (const entry of entries) {
      entry.hidden = topic !== 'all' && !entry.dataset.topics.split(' ').includes(topic);
      if (!entry.hidden) count++;
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
    // A row tag stays visible after selecting its own topic. Keep keyboard focus there.
    status.textContent = status.dataset.results.replace('{count}', String(count));
  }
  for (const button of buttons) {
    button.disabled = false;
    button.addEventListener('click', () => selectTopic(button.dataset.topic));
  }
  filters.hidden = false;
}
