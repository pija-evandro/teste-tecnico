@web @regression
Feature: Shopping journey
  As a customer
  I want to authenticate and manage products in my cart
  So that I can review the correct items before payment

  @smoke @usesTemporaryUser
  Scenario: Login with valid credentials
    Given a temporary customer exists
    When I authenticate with this customer
    Then I should be logged in

  Scenario: Reject invalid credentials
    Given I am on the login page
    When I try to authenticate with invalid credentials
    Then the login should be rejected

  Scenario: Search for an existing product
    Given I am on the products page
    When I search for "Blue Top"
    Then the search should return products related to "Blue Top"

  Scenario: Search for a nonexistent product
    Given I am on the products page
    When I search for "Product That Does Not Exist 987654"
    Then the search should return no products

  Scenario: Add a product to the cart
    Given I searched for "Blue Top"
    When I add the first result to the cart
    Then the selected product should be displayed in the cart

  Scenario: Remove a product from the cart
    Given I have "Blue Top" in my cart
    When I remove the selected product
    Then the selected product should no longer be displayed

  @negative
  Scenario: Prevent checkout with an empty cart
    Given my cart is empty
    When I open the cart
    Then checkout should not be available

  @smoke @usesTemporaryUser
  Scenario: Validate a product at checkout
    Given I am an authenticated customer
    And I have "Blue Top" in my cart
    When I proceed to checkout
    Then the selected product should be displayed in the order review
