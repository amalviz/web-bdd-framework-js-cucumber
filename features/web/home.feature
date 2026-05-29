@web
Feature: Home page
  As a visitor
  I want to view the application home page
  So that I can confirm the site is available

  Scenario: View home page title and heading
    Given I navigate to the application home page
    Then the page title should contain "The Internet"
    And the home page heading should be "Welcome to the-internet"

  Scenario: Navigate to login from home page
    Given I navigate to the application home page
    When I click on the Form Authentication link
    Then the current url should contain "/login"
