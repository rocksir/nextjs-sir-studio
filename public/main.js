function renderProducts() {
  const productGrid = document.getElementById('product-grid');
  const products = window.rockeyContent?.products().filter((product) => product.status !== 'placeholder');
  if (!productGrid || !products) return;

  productGrid.innerHTML = products.map((product, index) => {
    const imageClass = product.id === 'product-lineup' ? 'placeholder-lineup' : 'placeholder-materials';
    const imageLabel = product.altText || `Placeholder for ${product.name} image`;
    const imageText = product.id === 'product-lineup' ? 'Collection image|to come' : 'Image|to come';
    const classes = ['product-card', 'reveal', index % 2 === 1 ? 'reveal-delay' : ''].filter(Boolean).join(' ');
    return `<article class="${classes}" id="${product.id}">
      <div class="product-placeholder ${imageClass}" role="img" aria-label="${imageLabel}"><span>${imageText.split('|').join('<br />')}</span></div>
      <div class="product-card-copy">
        <p class="product-type">Product · ${product.category}</p>
        <h2>${product.name}</h2>
        <p>${product.shortDescription}</p>
        <a class="text-link" href="#${product.id}">View product <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join('');
}

function renderBooks() {
  const bookGrid = document.getElementById('book-grid');
  const books = window.rockeyContent?.books().filter((book) => book.visible);
  if (!bookGrid || !books) return;

  bookGrid.innerHTML = books.map((book, index) => `<article class="book-card reveal ${index % 2 === 1 ? 'reveal-delay' : ''}">
    <div class="book-cover book-cover-${(index % 4) + 1}" role="img" aria-label="${book.altText}">
      <span class="book-demo-label">${book.isDemo ? 'Demo' : 'Book'}</span>
      <strong>${book.title}</strong>
      <small>${book.author}</small>
    </div>
    <div class="book-card-copy">
      <p class="product-type">${book.genre} · ${book.availability}</p>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <span class="text-link book-disabled-link">Details coming later <span aria-hidden="true">↗</span></span>
    </div>
  </article>`).join('');
}

function renderServices() {
  const serviceList = document.getElementById('service-list');
  const services = window.rockeyContent?.services();
  if (!serviceList || !services) return;

  serviceList.innerHTML = services.map((service, index) => `<article class="service-detail">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <div>
      <p class="product-type">${service.category}</p>
      <h2>${service.name}</h2>
      <p>${service.description}</p>
    </div>
    <a class="text-link" href="/#contact">${service.cta} <span aria-hidden="true">↗</span></a>
  </article>`).join('');
}

function renderOffers() {
  const offerList = document.getElementById('offer-list');
  const offers = window.rockeyContent?.offers();
  if (!offerList || !offers) return;

  if (offers.length === 0) {
    offerList.innerHTML = `<div class="offer-mark" aria-hidden="true">R / 03</div>
      <div><p class="product-type">External recommendations</p><h2 id="offers-coming-title">The first offers are being selected.</h2><p>Offers will be clearly identified as external recommendations. Where an affiliate or referral relationship exists, it will be disclosed before you leave Rockey Studio.</p><a class="text-link" href="/products/">Explore Rockey Studio products <span aria-hidden="true">↗</span></a></div>`;
    return;
  }

  offerList.innerHTML = offers.map((offer) => `<article class="offer-card">
    <p class="product-type">External offer · ${offer.category}</p>
    <h2>${offer.title}</h2>
    <p>${offer.shortDescription}</p>
    <a class="text-link" href="${offer.offerUrl}" target="_blank" rel="noopener noreferrer">View offer <span aria-hidden="true">↗</span></a>
  </article>`).join('');
}

function initializeRockeyStudio() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderProducts();
  renderBooks();
  renderServices();
  renderOffers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRockeyStudio, { once: true });
} else {
  initializeRockeyStudio();
}
