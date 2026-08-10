class CheckoutPage {
  assertReviewProduct(product) {
    cy.contains("h2", "Review Your Order").should("be.visible");

    cy.get("#cart_items").within(() => {
      cy.contains("tbody tr", product.name).should("be.visible").within(() => {
        cy.get(".cart_description").should("contain.text", product.name);
        cy.get(".cart_price").should("contain.text", product.price);
      });
    });
  }
}

module.exports = new CheckoutPage();
