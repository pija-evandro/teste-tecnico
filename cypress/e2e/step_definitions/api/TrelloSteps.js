const {
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

When("I request the configured Trello action", () => {
  const query = {};
  const key = Cypress.env("trelloKey");
  const token = Cypress.env("trelloToken");

  if (key) {
    query.key = key;
  }

  if (token) {
    query.token = token;
  }

  cy.request({
    method: "GET",
    url: Cypress.env("trelloActionUrl"),
    qs: query,
    failOnStatusCode: false,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    cy.wrap(response, { log: false }).as("trelloResponse");

    if (response.body?.data?.list?.name) {
      cy.log(`Trello list name: ${response.body.data.list.name}`);
    }
  });
});

Then("the Trello request should succeed", () => {
  cy.get("@trelloResponse").then((response) => {
    expect(response.status).to.eq(200);
  });
});

Then("the list name should be {string}", (expectedName) => {
  cy.get("@trelloResponse").then((response) => {
    expect(response.body).to.have.nested.property(
      "data.list.name",
      expectedName,
    );
  });
});
