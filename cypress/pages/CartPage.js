class CartPage {
  assertProduct(product) {
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

  removeProduct(productName) {
    cy.contains("#cart_items tbody tr", productName).within(() => {
      cy.get(".cart_quantity_delete").click();
    });
  }

  assertProductAbsent(productName) {
    cy.get("#cart_items").should("not.contain.text", productName);
  }

  proceedToCheckout() {
    cy.contains("a", "Proceed To Checkout").click();
    cy.contains("h2", "Address Details").should("be.visible");
  }

  visit() {
    cy.visit("/view_cart");
  }

  assertCheckoutUnavailable() {
    cy.contains("a", "Proceed To Checkout").should("not.exist");
  }
}

module.exports = new CartPage();
