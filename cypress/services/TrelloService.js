class TrelloService {
  get actionUrl() {
    return Cypress.env("trelloActionUrl");
  }

  get defaultHeaders() {
    return {
      Accept: "application/json",
    };
  }

  getAction({
    key = Cypress.env("trelloKey"),
    token = Cypress.env("trelloToken"),
    headers,
  } = {}) {
    const query = {};

    if (key) {
      query.key = key;
    }

    if (token) {
      query.token = token;
    }

    return cy.request({
      method: "GET",
      url: this.actionUrl,
      qs: query,
      headers: headers ?? this.defaultHeaders,
      failOnStatusCode: false,
    });
  }
}

module.exports = new TrelloService();