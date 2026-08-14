const Ajv = require("ajv");
const {
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

const advantageCatalogService = require(
  "../../../services/AdvantageCatalogService",
);

const {
  getProductList,
} = require("../../../utils/ApiResponseUtils");

const productSchema = require(
  "../../../schemas/AdvantageProductSchema.json",
);

const searchResponseSchema = require(
  "../../../schemas/AdvantageSearchResponseSchema.json",
);

const ajv = new Ajv({
  allErrors: true,
});

const validateProduct = ajv.compile(productSchema);

When("I search the Advantage catalog for {string}", (term) => {
  advantageCatalogService
    .searchProducts({
      name: term,
    })
    .then((response) => {
      cy.wrap(response, {
        log: false,
      }).as("advantageResponse");

      cy.wrap(term, {
        log: false,
      }).as("advantageSearchTerm");
    });
});

Then("the search should return matching products", () => {
  cy.get("@advantageResponse").then((response) => {
    expect(response.status).to.eq(200);

    const products = getProductList(response.body);

    expect(products)
      .to.be.an("array")
      .and.not.be.empty;

    cy.get("@advantageSearchTerm").then((term) => {
      products.forEach((product) => {
        expect(product.productName).to.be.a("string");

        expect(
          product.productName.toLowerCase(),
        ).to.include(term.toLowerCase());
      });
    });
  });
});

Then(
  "the Advantage service should respond without a server error",
  () => {
    cy.get("@advantageResponse").then((response) => {
      expect(response.status).to.eq(200);
    });
  },
);

Then("no unrelated products should be returned", () => {
  cy.get("@advantageResponse").then((response) => {
    const products = getProductList(response.body);

    expect(products)
      .to.be.an("array")
      .and.be.empty;
  });
});

Then("the Advantage response should be valid JSON", () => {
  cy.get("@advantageResponse").then((response) => {
    expect(response.status).to.eq(200);

    expect(
      response.headers["content-type"],
    ).to.include("application/json");

    const products = getProductList(response.body);

    expect(products)
      .to.be.an("array")
      .and.not.be.empty;
  });
});

Then(
  "returned products should contain the required catalog fields",
  () => {
    cy.get("@advantageResponse").then((response) => {
      const products = getProductList(response.body);

      expect(products)
        .to.be.an("array")
        .and.not.be.empty;

      products.forEach((product) => {
        const isValid = validateProduct(product);

        expect(
          isValid,
          ajv.errorsText(validateProduct.errors),
        ).to.eq(true);
      });
    });
  },
);

Then(
  "the catalog response should follow the expected contract",
  () => {
    cy.get("@advantageResponse").then((response) => {
      const body =
        typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

      const ajv = new Ajv({
        allErrors: true,
        strict: false,
      });

      ajv.addSchema(productSchema);

      const validate = ajv.compile(searchResponseSchema);

      expect(
        validate(body),
        JSON.stringify(validate.errors, null, 2),
      ).to.be.true;
    });
  },
);

Then(
  "each product should belong to its returned category",
  () => {
    cy.get("@advantageResponse").then((response) => {
      const body =
        typeof response.body === "string"
          ? JSON.parse(response.body)
          : response.body;

      body.forEach((category) => {
        category.products.forEach((product) => {
          expect(product.categoryId).to.eq(
            category.categoryId,
          );
        });
      });
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


Then(
  "the catalog service should not fail with a server error",
  () => {
    cy.get("@advantageResponse").then((response) => {
      expect(response.status).to.be.within(200, 499);
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