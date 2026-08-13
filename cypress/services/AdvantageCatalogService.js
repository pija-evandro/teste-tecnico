class AdvantageCatalogService {
  get baseUrl() {
    return Cypress.env("advantageCatalogApiUrl");
  }

  get defaultHeaders() {
    return {
      Accept: "application/json",
    };
  }

  searchProducts({
    name,
    query,
    headers,
    method = "GET",
  } = {}) {
    return cy.request({
      method,
      url: `${this.baseUrl}/products/search`,
      qs: query ?? { name },
      headers: headers ?? this.defaultHeaders,
      failOnStatusCode: false,
    });
  }
}

module.exports = new AdvantageCatalogService();