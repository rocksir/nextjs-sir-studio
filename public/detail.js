function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function setMeta(name, content, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

function renderDetail() {
  const root = document.getElementById('detail-root');
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const type = pathParts[0];
  const slug = pathParts[1];
  const typeMap = { products: 'products', books: 'books', services: 'services', offers: 'offers' };
  const records = typeMap[type] ? window.rockeyContent[typeMap[type]]() : [];
  const record = records.find((item) => item.slug === slug);
  if (!root || !record) {
    if (root) root.innerHTML = '<section class="detail-empty container"><p class="eyebrow">Catalogue</p><h1>This entry is not available.</h1><a class="text-link" href="/products/">Return to products <span aria-hidden="true">↗</span></a></section>';
    return;
  }

  const isBook = type === 'books';
  const isOffer = type === 'offers';
  const label = isBook ? `Book · ${record.genre}` : `${type.slice(0, -1)} · ${record.category || ''}`;
  const title = record.title || record.name;
  const description = record.description || record.shortDescription;
  const canonicalUrl = `https://rockeystudio.com/${type}/${record.slug}/`;
  const pageTitle = record.seoTitle || `${title} | Rockey Studio`;
  const pageDescription = record.seoDescription || description;
  document.title = pageTitle;
  setMeta('description', pageDescription);
  setCanonical(canonicalUrl);
  setMeta('og:title', pageTitle, true);
  setMeta('og:description', pageDescription, true);
  setMeta('og:type', 'website', true);
  setMeta('og:url', canonicalUrl, true);
  setMeta('og:site_name', 'Rockey Studio', true);
  setMeta('twitter:card', 'summary');
  setMeta('twitter:title', pageTitle);
  setMeta('twitter:description', pageDescription);

  const sectionName = isBook ? 'Books' : type === 'services' ? 'Services' : type === 'products' ? 'Products' : 'Offers';
  const sectionUrl = `https://rockeystudio.com/${type}/`;
  const breadcrumbItems = [
    { name: 'Home', url: 'https://rockeystudio.com/' },
    { name: sectionName, url: sectionUrl },
    { name: title, url: canonicalUrl }
  ];

  root.innerHTML = `<section class="detail-hero container reveal">
    <div class="detail-visual detail-visual-${isBook ? 'book' : isOffer ? 'offer' : 'product'}"><span>${isBook ? 'Book' : isOffer ? 'Offer' : 'R / 02'}</span><strong>${escapeHtml(title)}</strong></div>
    <div class="detail-copy"><p class="eyebrow">${escapeHtml(label)}</p><h1>${escapeHtml(title)}</h1><p class="detail-lede">${escapeHtml(record.subtitle || record.shortDescription || description)}</p>${record.isDemo ? '<p class="demo-notice">Demo content for design testing. This is not a live product listing.</p>' : ''}<div class="detail-actions">${record.purchaseUrl || record.offerUrl ? `<a class="button button-dark" href="${escapeHtml(record.purchaseUrl || record.offerUrl)}" target="_blank" rel="noopener noreferrer">${isOffer ? 'View offer' : 'View product'} <span aria-hidden="true">↗</span></a>` : `<span class="button button-muted">Action link coming later</span>`}<a class="text-link" href="/${type}/">Back to ${type} <span aria-hidden="true">↗</span></a></div></div>
  </section>
  <nav class="breadcrumbs container" aria-label="Breadcrumb"><ol>${breadcrumbItems.map((item, index) => `<li>${index === breadcrumbItems.length - 1 ? `<span aria-current="page">${escapeHtml(item.name)}</span>` : `<a href="${item.url.replace('https://rockeystudio.com', '')}">${escapeHtml(item.name)}</a>`}</li>`).join('')}</ol></nav>
  <section class="detail-body container"><p class="eyebrow">About this ${isBook ? 'book' : type.slice(0, -1)}</p><h2>${escapeHtml(description)}</h2>${record.author ? `<p class="detail-meta"><strong>Author</strong>${escapeHtml(record.author)}</p>` : ''}${record.includedItems ? `<ul class="detail-list">${record.includedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}</section>`;

  const schema = { '@context': 'https://schema.org', '@type': isBook ? 'Book' : isOffer ? 'Thing' : type === 'services' ? 'Service' : 'Product', name: title, description, url: canonicalUrl };
  if (isBook) {
    if (record.author) schema.author = { '@type': 'Person', name: record.author };
    if (record.isbn) schema.isbn = record.isbn;
    if (record.publisher) schema.publisher = { '@type': 'Organization', name: record.publisher };
    if (record.language) schema.inLanguage = record.language;
    if (record.publicationDate) schema.datePublished = record.publicationDate;
    if (record.coverImage) schema.image = [record.coverImage];
  }
  if (record.category && !isBook) schema.category = record.category;
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })) };
  const schemaScript = document.head.querySelector('#structured-data') || document.createElement('script');
  schemaScript.id = 'structured-data';
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify([schema, breadcrumbSchema]);
  document.head.appendChild(schemaScript);
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderDetail();
});