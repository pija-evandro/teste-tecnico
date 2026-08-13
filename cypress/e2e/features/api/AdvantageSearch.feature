@api @regression
Feature: Advantage product search API
  As a catalog consumer
  I want to search products by name
  So that I receive a valid and relevant catalog response

  @smoke
  Scenario: Search products by name
    When I search the Advantage catalog for "HP"
    Then the search should return matching products

  Scenario: Search for a nonexistent product
    When I search the Advantage catalog for "DefinitelyNotAProduct987654"
    Then the Advantage service should respond without a server error
    And no unrelated products should be returned

  Scenario: Validate the product search response contract
    When I search the Advantage catalog for "HP"
    Then the Advantage response should be valid JSON
    And returned products should contain the required catalog fields
    And the catalog response should follow the expected contract
    And each product should belong to its returned category

@negative
Scenario: Search with an empty product name
  When I search the Advantage catalog with an empty product name
  Then the catalog service should not fail with a server error

@negative @knownIssue
Scenario: Search without a product name
  When I search the Advantage catalog without a product name
  Then the catalog service should not fail with a server error

@negative
Scenario: Search with an unusual product name
  When I search the Advantage catalog using an unusual product name
  Then the catalog service should not fail with a server error

@negative @knownIssue
Scenario: Search requesting an unsupported response format
  When I request the Advantage catalog using an unsupported response format
  Then the catalog service should not fail with a server error

@negative @knownIssue
Scenario: Search using an unsupported operation
  When I invoke the Advantage catalog search using an unsupported operation
  Then the unsupported catalog operation should be rejected