const { test, expect } = require('@playwright/test');
require('dotenv').config({ override: true });
test.use({ storageState: 'authState.json' });

class AdminPage {
    constructor(page) {
        this.page = page;
        this.adminLocators = {
            // Main container
            adminContainer: page.locator('.oxd-table-filter'),
            
            // Header elements
            systemUsersHeader: page.locator('.oxd-table-filter-title:has-text("System Users")'),
            systemUsersHeaderText: page.locator("//h5[normalize-space()='System Users']"),
            
            // Toggle button
            toggleButton: page.locator('.oxd-table-filter-header-options .--toggle button'),
            toggleIconUp: page.locator('.oxd-table-filter-header-options .--toggle button i.bi-caret-up-fill'),
            toggleIconDown: page.locator('.oxd-table-filter-header-options .--toggle button i.bi-caret-down-fill'),
            
            // Form area
            formArea: page.locator('.oxd-table-filter-area'),
            formContainer: page.locator('.oxd-form'),
            gridContainer: page.locator('.oxd-grid-4'),

            // Username
            usernameLabel: page.locator('.oxd-input-group:has(label:has-text("Username")) label'),
            usernameField: page.locator('.oxd-input-group:has(label:has-text("Username")) input'),

            // User Role
            userRoleLabel: page.locator('.oxd-input-group:has(label:has-text("User Role")) label'),
            userRoleDropdown: page.locator('.oxd-input-group:has(label:has-text("User Role")) .oxd-select-text'),
            userRoleDropdownText: page.locator('.oxd-input-group:has(label:has-text("User Role")) .oxd-select-text-input'),

            // Employee Name
            employeeNameLabel: page.locator('.oxd-input-group:has(label:has-text("Employee Name")) label'),
            employeeNameField: page.locator('.oxd-input-group:has(label:has-text("Employee Name")) input'),

            // Status
            statusLabel: page.locator('.oxd-input-group:has(label:has-text("Status")) label'),
            statusDropdown: page.locator('.oxd-input-group:has(label:has-text("Status")) .oxd-select-text'),
            statusDropdownText: page.locator('.oxd-input-group:has(label:has-text("Status")) .oxd-select-text-input'),

            
            // Buttons
            buttonContainer: page.locator('.oxd-form-actions'),
            resetButton: page.locator('button:has-text("Reset")'),
            searchButton: page.locator('button:has-text("Search")'),
            
            // Grid and layout elements
            gridItems: page.locator('.oxd-grid-item--gutters'),
            inputGroups: page.locator('.oxd-input-field-bottom-space'),
            dividers: page.locator('.oxd-table-filter .oxd-divider')
        };
    }

    /**
     * Navigate to the System Users admin page
     */
    async navigateToAdminPage() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
        await expect(this.adminLocators.adminContainer).toBeVisible({ timeout: 10000 });
    }

    /**
     * Generic method to verify element visibility
     * @param {Locator} adminPageElement - The element to check visibility for
     */
    async verifyAdminPageElementsVisibility(adminPageElement) {
        await expect(adminPageElement).toBeVisible({ timeout: 5000 });
    }
}

// Test Suite
test.describe('Admin Page Tests', () => {
    let adminPage;

    test.beforeEach(async ({ page }) => {
        adminPage = new AdminPage(page);
        await adminPage.navigateToAdminPage();
    })

    test.describe('System Users Form - Visibility & Layout Tests', () => {
        test('ADMIN-TC001: Verify "System Users" header is displayed', async ({ page }) => {
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.systemUsersHeader);
            await expect(adminPage.adminLocators.systemUsersHeader).toHaveText('System Users');
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.systemUsersHeaderText);
        });
    
        test('ADMIN-TC002: Verify all 4 input fields are visible', async ({ page }) => {
            // Username field
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.usernameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.usernameField);
            
            // User Role dropdown
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.userRoleLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.userRoleDropdown);
            await expect(adminPage.adminLocators.userRoleDropdownText).toContainText('-- Select --');
            
            // Employee Name field
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.employeeNameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.employeeNameField);
            await expect(adminPage.adminLocators.employeeNameField).toHaveAttribute('placeholder', 'Type for hints...');
            
            // Status dropdown
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.statusLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.statusDropdown);
            await expect(adminPage.adminLocators.statusDropdownText).toContainText('-- Select --');
        });
    
        test('ADMIN-TC003: Verify "Reset" and "Search" buttons are present and properly positioned', async ({ page }) => {
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.buttonContainer);
        
            // Reset button
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.resetButton);
            await expect(adminPage.adminLocators.resetButton).toHaveClass(/oxd-button--ghost/);
            await expect(adminPage.adminLocators.resetButton).toHaveAttribute('type', 'button');
            
            // Search button
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.searchButton);
            await expect(adminPage.adminLocators.searchButton).toHaveClass(/oxd-button--secondary/);
            await expect(adminPage.adminLocators.searchButton).toHaveAttribute('type', 'submit');
            await expect(adminPage.adminLocators.searchButton).toHaveClass(/orangehrm-left-space/);
            
            // Verify button order
            const buttons = adminPage.adminLocators.buttonContainer.locator('button');
            const buttonTexts = (await buttons.allTextContents()).map(text => text.trim());
            expect(buttonTexts).toEqual(['Reset', 'Search']);
        });
    
        test('ADMIN-TC004: Verify form collapse/expand toggle button functionality', async ({ page }) => {
            // Verify toggle button is visible
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.toggleButton);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.toggleIconUp);
            
            // Verify form area is initially visible (expanded state)
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.formArea);
            
            // Click toggle button to collapse
            await adminPage.adminLocators.toggleButton.click();
            await adminPage.page.waitForTimeout(500); // Wait for animation
            
            // Verify form area is hidden and icon changed
            await expect(adminPage.adminLocators.formArea).toBeHidden();
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.toggleIconDown);
            
            // Click toggle button again to expand
            await adminPage.adminLocators.toggleButton.click();
            await adminPage.page.waitForTimeout(500); // Wait for animation
            
            // Verify form area is visible again
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.formArea);
            await adminPage.verifyAdminPageElementsVisibility(tadminPage.adminLocators.toggleIconUp);
        });
    
        test('ADMIN-TC005: Verify form layout responsiveness on different screen sizes', async ({ page }) => {
            // Test desktop view
            await adminPage.page.setViewportSize({ width: 1920, height: 1080 });
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.gridContainer);
            
            const gridItemsCount = await adminPage.adminLocators.gridItems.count();
            expect(gridItemsCount).toBe(4);
            
            // Test tablet view
            await adminPage.page.setViewportSize({ width: 768, height: 1024 });
            await adminPage.page.waitForTimeout(300);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.adminContainer);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.gridContainer);
            
            // Test mobile view
            await adminPage.page.setViewportSize({ width: 375, height: 667 });
            await adminPage.page.waitForTimeout(300);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.adminContainer);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.usernameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.userRoleLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.employeeNameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.statusLabel);
            
            // Test extra small mobile
            await adminPage.page.setViewportSize({ width: 320, height: 568 });
            await adminPage.page.waitForTimeout(300);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.adminContainer);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.resetButton);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.searchButton);
            
            // Reset viewport to desktop
            await adminPage.page.setViewportSize({ width: 1920, height: 1080 });
        });
    
        test('ADMIN-TC006: Verify form elements maintain proper spacing and alignment', async ({ page }) => {
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.adminContainer);
        
            // Check grid items have gutters
            const gridItemsCount = await adminPage.adminLocators.gridItems.count();
            for (let i = 0; i < gridItemsCount; i++) {
                await expect(adminPage.adminLocators.gridItems.nth(i)).toHaveClass(/oxd-grid-item--gutters/);
            }
            
            // Check input groups have bottom spacing
            const inputGroupsCount = await adminPage.adminLocators.inputGroups.count();
            for (let i = 0; i < inputGroupsCount; i++) {
                await expect(adminPage.adminLocators.inputGroups.nth(i)).toHaveClass(/oxd-input-field-bottom-space/);
            }
            
            // Verify dividers are present
            const dividersCount = await adminPage.adminLocators.dividers.count();
            expect(dividersCount).toBeGreaterThanOrEqual(2);
        });
    
        test('ADMIN-TC007: Verify form accessibility elements', async ({ page }) => {
            // Check labels are visible
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.usernameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.userRoleLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.employeeNameLabel);
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.statusLabel);
            
            // Verify form structure
            await adminPage.verifyAdminPageElementsVisibility(adminPage.adminLocators.formContainer);
            await expect(adminPage.adminLocators.formContainer).toHaveAttribute('novalidate');
            
            // Verify dividers have proper ARIA attributes
            const dividersCount = await adminPage.adminLocators.dividers.count();
            for (let i = 0; i < dividersCount; i++) {
                await expect(adminPage.adminLocators.dividers.nth(i)).toHaveAttribute('role', 'separator');
                await expect(adminPage.adminLocators.dividers.nth(i)).toHaveAttribute('aria-orientation', 'horizontal');
            }
        });
    })
});
