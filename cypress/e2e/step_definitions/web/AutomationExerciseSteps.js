const {
  Before,
  After,
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
const loginPage = require("../../../pages/LoginPage");
const productsPage = require("../../../pages/ProductsPage");
const cartPage = require("../../../pages/CartPage");
const checkoutPage = require("../../../pages/CheckoutPage");
const UserDataFactory = require("../../../factories/UserDataFactory");
const advantageCatalogService = require(
  "../../../services/AdvantageCatalogService",
);

function createTemporaryCustomer() {
  const user = UserDataFactory.create();

  return cy
    .createAutomationExerciseUser(user)
    .then((createdUser) => {
      return cy
        .wrap(createdUser, { log: false })
        .as("scenarioUser");
    });
}

Before({ tags: "@usesTemporaryUser" }, () => {
  cy.wrap(null, { log: false }).as("scenarioUser");
});

Before(() => {
  cy.intercept(
    {
      middleware: true,
      url: /^https?:\/\/.*/,
    },
    (request) => {
      const hostname = new URL(request.url).hostname;

      const allowedHosts = [
        "automationexercise.com",
        "www.automationexercise.com",
      ];

      if (allowedHosts.includes(hostname)) {
        request.continue();
        return;
      }

      request.reply({
        statusCode: 204,
        body: "",
      });
    },
  );
});

After({ tags: "@usesTemporaryUser" }, () => {
  cy.get("@scenarioUser").then((user) => {
    if (user) {
      cy.deleteAutomationExerciseUser(user);
    }
  });
});

Given("a temporary customer exists", () => {
  return createTemporaryCustomer();
});

Given("I am on the login page", () => {
  loginPage.visit();
});

When("I authenticate with this customer", () => {
  cy.get("@scenarioUser").then((user) => {
    loginPage.visit();
    loginPage.login(user.email, user.password);
  });
});

Then("I should be logged in", () => {
  cy.get("@scenarioUser").then((user) => {
    loginPage.assertLoggedIn(user.name);
  });
});

When("I try to authenticate with invalid credentials", () => {
  const credentials = UserDataFactory.createInvalidCredentials();
  loginPage.login(credentials.email, credentials.password);
});

Then("the login should be rejected", () => {
  loginPage.assertInvalidLogin();
});

Given("I am on the products page", () => {
  productsPage.visit();
});

Given("I searched for {string}", (productName) => {
  productsPage.visit();
  productsPage.search(productName);
});

When("I search for {string}", (productName) => {
  productsPage.search(productName);
});

Then("the search should return products related to {string}", (productName) => {
  productsPage.assertSearchResultsContain(productName);
});

Then("the search should return no products", () => {
  productsPage.assertNoSearchResults();
});

When("I add the first result to the cart", () => {
  productsPage.captureFirstProduct().then((product) => {
    cy.wrap(product, { log: false }).as("scenarioProduct");
    productsPage.addProductToCart(product.name);
    productsPage.openCartFromModal();
  });
});

Given("I have {string} in my cart", (productName) => {
  productsPage.visit();
  productsPage.search(productName);

  productsPage.captureFirstProduct().then((product) => {
    cy.wrap(product, { log: false }).as("scenarioProduct");
    productsPage.addProductToCart(product.name);
    productsPage.openCartFromModal();
  });
});

Then("the selected product should be displayed in the cart", () => {
  cy.get("@scenarioProduct").then((product) => {
    cartPage.assertProduct(product);
  });
});

When("I remove the selected product", () => {
  cy.get("@scenarioProduct").then((product) => {
    cartPage.removeProduct(product.name);
  });
});

Then("the selected product should no longer be displayed", () => {
  cy.get("@scenarioProduct").then((product) => {
    cartPage.assertProductAbsent(product.name);
  });
});

Given("I am an authenticated customer", () => {
  return createTemporaryCustomer().then((createdUser) => {
    loginPage.visit();

    loginPage.login(
      createdUser.email,
      createdUser.password,
    );

    loginPage.assertLoggedIn(createdUser.name);
  });
});

When("I proceed to checkout", () => {
  cartPage.proceedToCheckout();
});

Then("the selected product should be displayed in the order review", () => {
  cy.get("@scenarioProduct").then((product) => {
    checkoutPage.assertReviewProduct(product);
  });
});

When(
  "I search the Advantage catalog with an empty product name",
  () => {
    return advantageCatalogService
      .searchProducts({
        name: "",
      })
      .then((response) => {
        cy.wrap(response, { log: false }).as(
          "advantageResponse",
        );
      });
  },
);

When(
  "I search the Advantage catalog without a product name",
  () => {
    return advantageCatalogService
      .searchProducts({
        query: {},
      })
      .then((response) => {
        cy.wrap(response, { log: false }).as(
          "advantageResponse",
        );
      });
  },
);

When(
  "I search the Advantage catalog using an unusual product name",
  () => {
    return advantageCatalogService
      .searchProducts({
        name: "<script>alert(1)</script>",
      })
      .then((response) => {
        cy.wrap(response, { log: false }).as(
          "advantageResponse",
        );
      });
  },
);

When(
  "I request the Advantage catalog using an unsupported response format",
  () => {
    return advantageCatalogService
      .searchProducts({
        name: "HP",
        headers: {
          Accept: "application/xml",
        },
      })
      .then((response) => {
        cy.wrap(response, { log: false }).as(
          "advantageResponse",
        );
      });
  },
);

When(
  "I invoke the Advantage catalog search using an unsupported operation",
  () => {
    return advantageCatalogService
      .searchProducts({
        name: "HP",
        method: "POST",
      })
      .then((response) => {
        cy.wrap(response, { log: false }).as(
          "advantageResponse",
        );
      });
  },
);

Then(
  "the catalog service should not fail with a server error",
  () => {
    cy.get("@advantageResponse").then((response) => {
      expect(response.status).to.be.within(200, 499);
    });
  },
);

Then(
  "the unsupported catalog operation should be rejected",
  () => {
    cy.get("@advantageResponse").then((response) => {
      expect(response.status).to.be.within(400, 499);
    });
  },
);

Given("my cart is empty", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

When("I open the cart", () => {
  cartPage.visit();
});

Then("checkout should not be available", () => {
  cartPage.assertCheckoutUnavailable();
});