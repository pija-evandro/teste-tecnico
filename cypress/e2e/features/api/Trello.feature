@api @smoke @regression
Feature: Trello action API
  As an API consumer
  I want to read a known Trello action
  So that I can validate its list information

  Scenario: Read the list name from a Trello action
    When I request the configured Trello action
    Then the Trello request should succeed
    And the list name should be "Professional"
