const { chromium } = require('@playwright/test');
const fs = require('fs');
require('dotenv').config({ override: true });

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
    await this.page.waitForSelector("input[placeholder='Username']", { timeout });
    await this.page.waitForSelector("input[placeholder='Password']", { timeout });
    await this.page.waitForSelector("button[type='submit']", { timeout });
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
   * Verify successful login by checking for dashboard elements
   */
  async verifySuccessfulLogin() {
    await this.page.waitForSelector("h6:has-text('Dashboard')", { timeout: 10000 });
    return true;
  }
}

async function globalSetup() {
  console.log('🚀 Starting global setup with authentication...');
  
  const authFile = 'authState.json';
  
  // Check if auth state already exists and is recent (optional optimization)
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    
    // If auth file is less than 24 hours old, skip re-authentication
    // if (ageInHours < 24) {
    //   console.log('✅ Using existing authentication state (less than 24h old)');
    //   return;
    // } else {
    //   console.log('🔄 Auth state is old, creating fresh authentication...');
    // }
  }

  const browser = await chromium.launch({
    headless: false, // Set to true for CI environments
    channel: 'chrome'
  });
  
  const context = await browser.newContext({
    viewport: { width: 1536, height: 695 }
  });
  
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    console.log('📱 Navigating to OrangeHRM login page...');
    await loginPage.navigateToLoginPage();
    
    const credentials = {
      username: process.env.USERNAME || "Admin",
      password: process.env.PASSWORD || "admin123",
    };
    
    console.log('🔑 Performing login...');
    await loginPage.performLogin(credentials.username, credentials.password);
    
    console.log('✅ Verifying successful login...');
    await loginPage.verifySuccessfulLogin();
    
    console.log('💾 Saving authentication state...');
    await context.storageState({ path: authFile });
    
    console.log('🎉 Authentication state saved successfully to authState.json!');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error.message);
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'global-setup-error.png', 
      fullPage: true 
    });
    
    console.error('📸 Error screenshot saved as global-setup-error.png');
    throw error;
    
  } finally {
    await browser.close();
    console.log('🏁 Global setup completed!');
  }
}

module.exports = globalSetup;