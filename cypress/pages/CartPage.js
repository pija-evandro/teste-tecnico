class CartPage {
  assertProduct(product) {
    cy.get("#cart_items").within(() => {
      cy.contains("tbody tr", product.name).should("be.visible").within(() => {
        cy.get(".cart_description").should("contain.text", product.name);
        cy.get(".cart_price").should("contain.text", product.price);
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
}

module.exports = new CartPage();
