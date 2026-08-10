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
