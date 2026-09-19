function initializeRockeyStudio() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const productGrid = document.getElementById('product-grid');
  const products = window.rockeyCatalogue?.products;
  if (!productGrid || !products) return;

  productGrid.innerHTML = products.map((product, index) => {
    const classes = [
      'product-card',
      product.featured ? 'product-card-featured' : '',
      product.wide ? 'product-card-wide' : '',
      'reveal',
      index % 2 === 1 ? 'reveal-delay' : ''
    ].filter(Boolean).join(' ');
    const imageText = product.imageText.split('|').join('<br />');
    return `<article class="${classes}" id="${product.id}">
      <div class="product-placeholder ${product.imageClass}" role="img" aria-label="${product.imageLabel}"><span>${imageText}</span></div>
      <div class="product-card-copy">
        <p class="product-type">${product.type} · ${product.category}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <a class="text-link" href="${product.href}">${product.cta} <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRockeyStudio, { once: true });
} else {
  initializeRockeyStudio();
}
