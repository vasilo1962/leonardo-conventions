import { availableIn } from './articles.mjs';

// Topic membership is shared across languages; titles and labels are localized.
export const articleTopics = {
  'jacoby-transfer': ['opening-responses', 'responses-1nt'],
  'multi-landy': ['defense-1nt', 'two-suited'],
  'michaels-cue-bid': ['overcalls', 'two-suited'],
  'unusual-2nt': ['overcalls', 'two-suited'],
  'dont': ['defense-1nt', 'two-suited'],
  'inverted-minors': ['opening-responses', 'minor-fit'],
  'bergen-raises': ['opening-responses', 'major-fit'],
  'jacoby-2nt': ['opening-responses', 'major-fit', 'slam'],
  'drury': ['opening-responses', 'major-fit', 'late-opening-responses'],
  'two-way-drury': ['opening-responses', 'major-fit', 'late-opening-responses'],
  'splinter-responder': ['opening-responses', 'major-fit', 'slam'],
  'splinter-opener': ['opener-rebids', 'major-fit', 'slam']
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const catalogTitle = (article, language) => article.titles?.[language.code] || article.title;
export function catalogArticles(articles, language) {
  const collator = new Intl.Collator(language.code, { sensitivity: 'base', numeric: true });
  return articles.filter(article => availableIn(article, language.code))
    .sort((a, b) => collator.compare(catalogTitle(a, language), catalogTitle(b, language)) || a.slug.localeCompare(b.slug));
}

export function renderCatalog(articles, language, ui, prefix) {
  const sorted = catalogArticles(articles, language);
  const topics = [...new Set(sorted.flatMap(article => {
    if (!articleTopics[article.slug]?.length) throw new Error(`Missing catalog topics: ${article.slug}`);
    return articleTopics[article.slug];
  }))];
  for (const key of ['all', 'topic', 'tags', 'results']) {
    if (!ui?.[key]) throw new Error(`${language.code}: missing catalog UI ${key}`);
  }
  for (const topic of topics) if (!ui.labels?.[topic]) throw new Error(`${language.code}: missing topic ${topic}`);
  topics.sort((a, b) => new Intl.Collator(language.code).compare(ui.labels[a], ui.labels[b]));
  const button = (topic, label, className, disabled = false) => '<button type="button" class="' + className + '" data-topic="' + topic + '" aria-controls="convention-list" aria-pressed="' + (topic === 'all') + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(label) + '</button>';
  return '<section id="convention-list" class="convention-list" aria-label="' + escapeHtml(language.ui.conventions) + '">' + sorted.map(article =>
      '<div class="convention-entry" data-convention="' + article.slug + '" data-topics="' + articleTopics[article.slug].join(' ') + '">' +
      '<a class="card-link" href="' + prefix + language.code + '/' + article.slug + '/"><strong dir="' + (article.titles && language.dir === 'rtl' ? 'rtl' : 'ltr') + '">' + escapeHtml(catalogTitle(article, language)) + '</strong></a>' +
      '<div class="catalog-tags" role="group" aria-label="' + escapeHtml(ui.tags) + '">' + articleTopics[article.slug].map(topic => button(topic, ui.labels[topic], 'catalog-tag', true)).join('<span class="tag-separator" aria-hidden="true">, </span>') + '</div></div>'
    ).join('') + '</section>' +
    '<fieldset class="catalog-filters" hidden><legend>' + escapeHtml(ui.topic) + '</legend><div class="catalog-filter-buttons">' +
    [button('all', ui.all, 'catalog-filter'), ...topics.map(topic => button(topic, ui.labels[topic], 'catalog-filter'))].join('<span class="tag-separator" aria-hidden="true">, </span>') + '</div></fieldset>' +
    '<p class="sr-only" id="catalog-status" role="status" aria-live="polite" aria-atomic="true" data-results="' + escapeHtml(ui.results) + '"></p>';
}
