class ProductsPage {
  visit() {
    cy.visit("/products");
    cy.contains("h2", "All Products").should("be.visible");
  }

  search(productName) {
    cy.get("#search_product").should("be.visible").clear().type(productName);
    cy.get("#submit_search").click();
    cy.contains("h2", "Searched Products").should("be.visible");
  }

  assertSearchResultsContain(productName) {
    cy.get(".features_items .product-image-wrapper").should(
      "have.length.greaterThan",
      0,
    );

    cy.get(".features_items .productinfo p").each(($name) => {
      expect($name.text().trim().toLowerCase()).to.include(
        productName.toLowerCase(),
      );
    });
  }

  assertNoSearchResults() {
    cy.get(".features_items .product-image-wrapper").should("not.exist");
  }

  captureFirstProduct() {
    return cy
      .get(".features_items .product-image-wrapper")
      .first()
      .then(($card) => {
        const name = $card.find(".productinfo p").first().text().trim();
        const price = $card.find(".productinfo h2").first().text().trim();

        expect(name).to.not.equal("");
        expect(price).to.not.equal("");

        return { name, price };
      });
  }

  addProductToCart(productName) {
    cy.contains(".features_items .productinfo p", productName)
      .parents(".product-image-wrapper")
      .first()
      .within(() => {
        cy.get("a.add-to-cart").first().click({ force: true });
      });

    cy.get("#cartModal").should("be.visible");
  }

  openCartFromModal() {
    cy.get("#cartModal").within(() => {
      cy.contains("a", "View Cart").click();
    });

    cy.url().should("include", "/view_cart");
  }
}

module.exports = new ProductsPage();
