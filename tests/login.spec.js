const { test, expect } = require("@playwright/test");
require("dotenv").config({ override: true });

class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators 
    this.locators = {
      usernameInput: page.getByPlaceholder("Username"),
      passwordInput: page.getByPlaceholder("Password"),
      loginButton: page.locator("button[type='submit']"),
      loginForm: page.locator("form"),
      errorMessage: page.locator(".oxd-alert-content-text"),
      usernameError: page.locator("div:has(input[name='username']) span.oxd-input-field-error-message"),
      passwordError: page.locator("div:has(input[name='password']) span.oxd-input-field-error-message"),
      dashboardHeading: page.locator("h6:has-text('Dashboard')"),
    };
  }

  /**
   * Navigate to the login page and verify it loaded correctly
   * @param {number} timeout - Optional timeout for page load (default: 30s)
   */
  async navigateToLoginPage(timeout = 30000) {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      { waitUntil: "networkidle" }
    );
    
    // Verify critical elements are visible before proceeding
    await expect(this.locators.usernameInput).toBeVisible({ timeout });
    await expect(this.locators.passwordInput).toBeVisible({ timeout });
    await expect(this.locators.loginButton).toBeVisible({ timeout });
  }

  /**
   * Perform login action with given credentials
   * @param {string} username - The username to login with
   * @param {string} password - The password to login with
   */
  async performLogin(username, password) {
    await this.locators.usernameInput.clear();
    await this.locators.usernameInput.fill(username);
    
    await this.locators.passwordInput.clear();
    await this.locators.passwordInput.fill(password);
    
    // Click login and wait for navigation
    await Promise.all([
      this.page.waitForLoadState("networkidle"),
      this.locators.loginButton.click(),
    ]);
  }

  /**
   * Verify successful login by checking URL and dashboard elements
   */
  async verifySuccessfulLogin() {
    // Multiple verification points for robust assertion
    await expect(this.page).toHaveURL(/dashboard/, { timeout: 10000 });
    await expect(this.locators.dashboardHeading).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify login failed by checking for error message
   * @param {string} expectedErrorMessage - Expected error message text
   */
  async verifyInvalidCredentialsError(expectedErrorMessage = "Invalid credentials") {
    await expect(this.locators.errorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.locators.errorMessage).toContainText(expectedErrorMessage);
  }
  
  async verifyUsernameRequiredError(expectedErrorMessage = "Required") {
    await expect(this.locators.usernameError).toBeVisible({ timeout: 5000 });
    await expect(this.locators.usernameError).toContainText(expectedErrorMessage);
  }
  
  async verifyPasswordRequiredError(expectedErrorMessage = "Required") {
    await expect(this.locators.passwordError).toBeVisible({ timeout: 5000 });
    await expect(this.locators.passwordError).toContainText(expectedErrorMessage);
  }
}

test.describe("Authentication Tests - OrangeHRM Login", () => {
  let loginPage;

  // Test data - moving to external JSON file for larger test suites
  const TEST_DATA = {
    validCredentials: {
      username: process.env.USERNAME || "Admin",
      password: process.env.PASSWORD || "admin123",
    },
    invalidCredentials: {
      username: "invalid_user",
      password: "wrong_password",
    }
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test.describe("Valid Login Scenarios", () => {
    test("TC001: Should successfully login with valid credentials", async () => {
      // Arrange - Test data is already set up in beforeEach
      const { username, password } = TEST_DATA.validCredentials;

      // Act
      await loginPage.performLogin(username, password);

      // Assert
      await loginPage.verifySuccessfulLogin();
    });

    test("TC002: Should login successfully after clearing previous input", async ({ page }) => {
      // Arrange - Fill with wrong data first
      await loginPage.locators.usernameInput.fill("wrong_data");
      await loginPage.locators.passwordInput.fill("wrong_data");
      
      const { username, password } = TEST_DATA.validCredentials;

      // Act
      await loginPage.performLogin(username, password);

      // Assert
      await loginPage.verifySuccessfulLogin();
    });
  });

  test.describe("Invalid Login Scenarios", () => {
    test("TC003: Should show error message with invalid credentials", async () => {
      // Arrange
      const { username, password } = TEST_DATA.invalidCredentials;

      // Act
      await loginPage.performLogin(username, password);

      // Assert
      await loginPage.verifyInvalidCredentialsError("Invalid credentials");
    });

    test("TC004: Should show error with empty username", async () => {
      // Act
      await loginPage.performLogin("", TEST_DATA.validCredentials.password);

      // Assert
      await loginPage.verifyUsernameRequiredError("Required");
    });

    test("TC005: Should show error with empty password", async () => {
      // Act
      await loginPage.performLogin(TEST_DATA.validCredentials.username, "");

      // Assert
      await loginPage.verifyPasswordRequiredError("Required");
    });
  });

  test.describe("UI Validation Tests", () => {
    test("TC006: Should verify all login form elements are present", async ({ page }) => {
      // Assert - Verify form structure
      await expect(loginPage.locators.loginForm).toBeVisible();
      await expect(loginPage.locators.usernameInput).toHaveAttribute("placeholder", "Username");
      await expect(loginPage.locators.passwordInput).toHaveAttribute("placeholder", "Password");
      await expect(loginPage.locators.passwordInput).toHaveAttribute("type", "password");
      await expect(loginPage.locators.loginButton).toBeEnabled();
    });
  });
});