@api
Feature: Users API
  As an API consumer
  I want to interact with the users endpoint
  So that I can verify REST API behavior

  @smoke
  Scenario: Get all users
    When I request all users from the API
    Then the API response status should be 200
    And the API response should contain a list of users
    And the API response content type should be JSON

  Scenario: Get user by id
    When I request user with id 1 from the API
    Then the API response status should be 200
    And the API response should contain user id 1
    And the API response user name should be "Leanne Graham"

  Scenario: Create a new user
    When I create a new user with name "Test User" and email "test@example.com"
    Then the API response status should be 201
    And the created user name should be "Test User"

  Scenario: Delete a user
    When I delete user with id 1 from the API
    Then the API response status should be 200
