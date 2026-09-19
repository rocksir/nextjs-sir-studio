window.rockeyContent = {
  products() {
    return window.rockeyProducts || [];
  },

  books() {
    return window.rockeyBooks || [];
  },

  services() {
    return window.rockeyServices || [];
  },

  offers() {
    return window.rockeyOffers || [];
  },

  getBySlug(type, slug) {
    const records = this[type]?.();
    return records?.find((record) => record.slug === slug) || null;
  },

  featured(type) {
    return this[type]?.().filter((record) => record.featured) || [];
  }
};
