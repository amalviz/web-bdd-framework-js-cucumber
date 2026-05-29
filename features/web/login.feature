@web
Feature: User login
  As a registered user
  I want to log in to the application
  So that I can access secure areas

  Background:
    Given I am on the login page

  @smoke
  Scenario: Successful login with valid credentials
    When I login with valid credentials
    Then I should see a successful login message
    And the current url should contain "/secure"

  Scenario Outline: Failed login with invalid credentials
    When I login with username "<username>" and password "<password>"
    Then I should see an invalid login message
    And the current url should contain "/login"

    Examples:
      | username    | password        |
      | invaliduser | wrongpassword   |
      | baduser     | badpassword     |
