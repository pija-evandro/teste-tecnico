class CheckoutPage {
  assertReviewProduct(product) {
    cy.contains("h2", "Review Your Order")
      .should("be.visible");

    cy.get("#cart_items").within(() => {
      cy.contains("tbody tr", product.name)
        .should("be.visible")
        .within(() => {
          cy.get(".cart_description")
            .should("contain.text", product.name);

          cy.get(".cart_price")
            .invoke("text")
            .then((price) => {
              expect(price.trim()).to.eq(product.price.trim());
            });

          cy.get(".cart_quantity button")
            .invoke("text")
            .then((quantity) => {
              expect(quantity.trim()).to.eq("1");
            });

          cy.get(".cart_total_price")
            .invoke("text")
            .then((total) => {
              expect(total.trim()).to.eq(product.price.trim());
            });
        });
    });
  }

} module.exports = new CheckoutPage();
