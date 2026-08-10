const {
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
const { getProductList } = require("../../../utils/ApiResponseUtils");

When("I search the Advantage catalog for {string}", (term) => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("advantageCatalogApiUrl")}/products/search`,
    qs: {
      name: term,
    },
    failOnStatusCode: false,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    cy.wrap(response, { log: false }).as("advantageResponse");
    cy.wrap(getProductList(response.body), { log: false }).as(
      "advantageProducts",
    );
    cy.wrap(term, { log: false }).as("advantageSearchTerm");
  });
});

Then("the search should return matching products", () => {
  cy.get("@advantageResponse").then((response) => {
    expect(response.status).to.eq(200);
  });

  cy.get("@advantageProducts").then((products) => {
    expect(products).to.be.an("array").and.not.be.empty;

    cy.get("@advantageSearchTerm").then((term) => {
      products.forEach((product) => {
        expect(product.productName).to.be.a("string");
        expect(product.productName.toLowerCase()).to.include(
          term.toLowerCase(),
        );
      });
    });
  });
});

Then("the Advantage service should respond without a server error", () => {
  cy.get("@advantageResponse").then((response) => {
    expect(response.status).to.be.lessThan(500);
  });
});

Then("no unrelated products should be returned", () => {
  cy.get("@advantageProducts").should("be.an", "array").and("be.empty");
});

Then("the Advantage response should be valid JSON", () => {
  cy.get("@advantageResponse").then((response) => {
    expect(response.status).to.eq(200);
    expect(response.headers["content-type"]).to.include("application/json");
  });
});

Then("returned products should contain the required catalog fields", () => {
  cy.get("@advantageProducts").then((products) => {
    expect(products).to.be.an("array").and.not.be.empty;

    products.forEach((product) => {
      expect(product.productId).to.be.a("number");
      expect(product.productName).to.be.a("string").and.not.be.empty;
      expect(product.price).to.be.a("number");
    });
  });
});
