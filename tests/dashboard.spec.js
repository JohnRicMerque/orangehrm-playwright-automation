const { test, expect } = require("@playwright/test");
require("dotenv").config({ override: true });
test.use({ storageState: 'authState.json' });

class DashboardPage {
  constructor (page) {
      this.page = page
      this.dashboardLocators = {
      // Main Dashboard Container
        dashboardContainer: page.locator(".oxd-layout-context"),
        dashboardGrid: page.locator(".orangehrm-dashboard-grid"),
    
        // Time at Work Widget
        timeAtWorkWidget: page.locator(".orangehrm-dashboard-widget:has(.bi-clock-fill)"),
        timeAtWorkHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Time at Work')"),
        timeAtWorkIcon: page.locator(".bi-clock-fill"),
        
        // Attendance Card Elements
        attendanceCard: page.locator(".orangehrm-attendance-card"),
        profileImage: page.locator(".orangehrm-attendance-card-profile-image img"),
        punchStatus: page.locator(".orangehrm-attendance-card-state"),
        punchDetails: page.locator(".orangehrm-attendance-card-details"),
        todayHours: page.locator(".orangehrm-attendance-card-fulltime b"),
        attendanceActionButton: page.locator(".orangehrm-attendance-card-action"),
        
        // Weekly Summary
        weeklyRange: page.locator(".orangehrm-attendance-card-summary-week p:nth-child(2)"),
        weeklyHours: page.locator(".orangehrm-attendance-card-summary-total .orangehrm-attendance-card-fulltime"),
        attendanceChart: page.locator(".emp-attendance-chart canvas"),
    
        // My Actions Widget
        myActionsWidget: page.locator(".orangehrm-dashboard-widget:has(.bi-list-check)"),
        myActionsHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('My Actions')"),
        myActionsIcon: page.locator(".bi-list-check"),
        
        // Action Items
        pendingSelfReview: page.locator("p:has-text('Pending Self Review')"),
        candidateToInterview: page.locator("p:has-text('Candidate to Interview')"),
        pendingSelfReviewButton: page.locator(".orangehrm-todo-list-item:has-text('Pending Self Review') button"),
        candidateInterviewButton: page.locator(".orangehrm-todo-list-item:has-text('Candidate to Interview') button"),
    
        // Quick Launch Widget
        quickLaunchWidget: page.locator(".orangehrm-dashboard-widget:has(.bi-lightning-charge-fill)"),
        quickLaunchHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Quick Launch')"),
        quickLaunchIcon: page.locator(".bi-lightning-charge-fill"),
        quickLaunchGrid: page.locator(".orangehrm-quick-launch"),
        
        // Quick Launch Cards
        assignLeaveCard: page.locator(".orangehrm-quick-launch-card:has([title='Assign Leave'])"),
        assignLeaveButton: page.locator("button[title='Assign Leave']"),
        assignLeaveText: page.locator(".orangehrm-quick-launch-heading:has-text('Assign Leave')"),
        
        leaveListCard: page.locator(".orangehrm-quick-launch-card:has([title='Leave List'])"),
        leaveListButton: page.locator("button[title='Leave List']"),
        leaveListText: page.locator(".orangehrm-quick-launch-heading:has-text('Leave List')"),
        
        timesheetsCard: page.locator(".orangehrm-quick-launch-card:has([title='Timesheets'])"),
        timesheetsButton: page.locator("button[title='Timesheets']"),
        timesheetsText: page.locator(".orangehrm-quick-launch-heading:has-text('Timesheets')"),
        
        applyLeaveCard: page.locator(".orangehrm-quick-launch-card:has([title='Apply Leave'])"),
        applyLeaveButton: page.locator("button[title='Apply Leave']"),
        applyLeaveText: page.locator(".orangehrm-quick-launch-heading:has-text('Apply Leave')"),
        
        myLeaveCard: page.locator(".orangehrm-quick-launch-card:has([title='My Leave'])"),
        myLeaveButton: page.locator("button[title='My Leave']"),
        myLeaveText: page.locator(".orangehrm-quick-launch-heading:has-text('My Leave')"),
        
        myTimesheetCard: page.locator(".orangehrm-quick-launch-card:has([title='My Timesheet'])"),
        myTimesheetButton: page.locator("button[title='My Timesheet']"),
        myTimesheetText: page.locator(".orangehrm-quick-launch-heading:has-text('My Timesheet')"),
    
        // Buzz Latest Posts Widget
        buzzWidget: page.locator(".orangehrm-dashboard-widget:has(.bi-camera-fill)"),
        buzzHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Buzz Latest Posts')"),
        buzzIcon: page.locator(".bi-camera-fill"),
        buzzGrid: page.locator(".orangehrm-buzz-widget"),
        
        // Buzz Post Cards
        buzzCards: page.locator(".orangehrm-buzz-widget-card"),
        buzzProfileImages: page.locator(".orangehrm-buzz-profile-image img"),
        buzzEmployeeNames: page.locator(".orangehrm-buzz-widget-header-emp"),
        buzzTimestamps: page.locator(".orangehrm-buzz-widget-header-time"),
        buzzPostBodies: page.locator(".orangehrm-buzz-widget-body"),
        buzzPostImages: page.locator(".orangehrm-buzz-widget-picture"),
        
        // Specific Buzz Posts
        testeTestePost: page.locator(".orangehrm-buzz-widget-card:has-text('Teste Teste Teste')"),
        saniaShakeenPost: page.locator(".orangehrm-buzz-widget-card:has-text('Sania  Shaheen')"),
        rebeccaHarmonyPost: page.locator(".orangehrm-buzz-widget-card:has-text('Rebecca  Harmony')"),
        russelHamiltonPost: page.locator(".orangehrm-buzz-widget-card:has-text('Russel  Hamilton')"),
    
        // Employees on Leave Today Widget
        employeesOnLeaveWidget: page.locator(".orangehrm-dashboard-widget:has-text('Employees on Leave Today')"),
        employeesOnLeaveHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Employees on Leave Today')"),
        employeesOnLeaveIcon: page.locator(".orangehrm-leave-card-icon"),
        noEmployeesOnLeaveMessage: page.locator("p:has-text('No Employees are on Leave Today')"),
        noContentImage: page.locator(".orangehrm-dashboard-widget-img"),
    
        // Employee Distribution by Sub Unit Widget
        subUnitDistributionWidget: page.locator(".orangehrm-dashboard-widget:has-text('Employee Distribution by Sub Unit')"),
        subUnitDistributionHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Employee Distribution by Sub Unit')"),
        subUnitPieChart: page.locator("#CME4dZtn"),
        subUnitLegend: page.locator(".oxd-chart-legend"),
        
        // Sub Unit Legend Items
        engineeringLegend: page.locator(".oxd-chart-legend li:has-text('Engineering')"),
        humanResourcesLegend: page.locator(".oxd-chart-legend li:has-text('Human Resources')"),
        administrationLegend: page.locator(".oxd-chart-legend li:has-text('Administration')"),
        clientServicesLegend: page.locator(".oxd-chart-legend li:has-text('Client Services')"),
        unassignedSubUnitLegend: page.locator(".oxd-chart-legend li:has-text('Unassigned')"),
    
        // Employee Distribution by Location Widget
        locationDistributionWidget: page.locator(".orangehrm-dashboard-widget:has-text('Employee Distribution by Location')"),
        locationDistributionHeader: page.locator(".orangehrm-dashboard-widget-name:has-text('Employee Distribution by Location')"),
        locationPieChart: page.locator("#cG3hHpvV"),
        locationLegend: page.locator(".oxd-chart-legend").last(),
        
        // Location Legend Items
        texasRDLegend: page.locator(".oxd-chart-legend li:has-text('Texas R&D')"),
        newYorkSalesLegend: page.locator(".oxd-chart-legend li:has-text('New York Sales Office')"),
        unassignedLocationLegend: page.locator(".oxd-chart-legend li:has-text('Unassigned')"),
    
        // Common Widget Elements
        widgetHeaders: page.locator(".orangehrm-dashboard-widget-header"),
        widgetBodies: page.locator(".orangehrm-dashboard-widget-body"),
        widgetDividers: page.locator(".oxd-divider"),
        widgetIcons: page.locator(".orangehrm-dashboard-widget-icon"),
        widgetSheets: page.locator(".oxd-sheet"),
        
        // Grid System
        gridItems: page.locator(".oxd-grid-item"),
        gridGutters: page.locator(".oxd-grid-item--gutters"),
        
        // Scrollable Areas
        scrollableWidgets: page.locator(".orangehrm-dashboard-widget-body.--scroll-visible"),
        
        // Button Elements
        iconButtons: page.locator(".oxd-icon-button"),
        solidMainButtons: page.locator(".oxd-icon-button--solid-main"),
        dangerButtons: page.locator(".oxd-icon-button--danger"),
        infoButtons: page.locator(".oxd-icon-button--info"),
        
        // Text Elements
        paragraphTexts: page.locator(".oxd-text--p"),
        spanTexts: page.locator(".oxd-text--span"),
        
        // Chart Elements
        pieCharts: page.locator(".oxd-pie-chart"),
        chartLegends: page.locator(".oxd-chart-legend"),
        chartLegendKeys: page.locator(".oxd-chart-legend-key"),
        canvasElements: page.locator("canvas"),
        
        // Profile Images
        profileImages: page.locator(".employee-image, .orangehrm-buzz-profile-image img"),
        
        // Widget Specific Classes
        empAttendanceChart: page.locator(".emp-attendance-chart"),
        empDistribChart: page.locator(".emp-distrib-chart"),
        empLeaveChart: page.locator(".emp-leave-chart"),
        
        // Action and Interactive Elements
        todoListItems: page.locator(".orangehrm-todo-list-item"),
        quickLaunchCards: page.locator(".orangehrm-quick-launch-card"),
        buzzWidgetCards: page.locator(".orangehrm-buzz-widget-card"),
        
        // Time and Date Elements
        timeElements: page.locator("*:has-text('3h'), *:has-text('38m'), *:has-text('2h 1m')"),
        dateRanges: page.locator("*:has-text('Aug 11 - Aug 17')"),
        timestamps: page.locator("*:has-text('2025-14-08'), *:has-text('2020-08-10')"),
        
        // Status Elements
        punchedOutStatus: page.locator("*:has-text('Punched Out')"),
        thisWeekText: page.locator("*:has-text('This Week')"),
        todayText: page.locator("*:has-text('Today')")
        }
    }

    /**
     * Navigate to the dashboard page after login
     */
    async navigateToDashboard() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
        await expect(this.dashboardLocators.dashboardContainer).toBeVisible({ timeout: 10000 });
    }

    /**
     * Verify Time at Work widget is visible
     */
    async verifyTimeAtWorkWidget() {
        await expect(this.dashboardLocators.timeAtWorkWidget).toBeVisible({ timeout: 5000 });
        await expect(this.dashboardLocators.timeAtWorkHeader).toBeVisible({ timeout: 5000 });
        await expect(this.dashboardLocators.timeAtWorkIcon).toBeVisible({ timeout: 5000 });
    }

    /**
     * Verify Time at Work header text
     * @param {string} expectedText - Expected header text (default: "Time at Work")
     */
    async verifyTimeAtWorkHeaderText(expectedText = "Time at Work") {
        await expect(this.dashboardLocators.timeAtWorkHeader).toHaveText(expectedText);
    }
}

test.describe("Dashboard Tests", () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        // Navigate to dashboard or perform login first
        await dashboardPage.navigateToDashboard();
    });
    
    test.describe("Time at Work Widget Tests", () => {
        test("TC001: Should verify Time at Work widget elements are present", async () => {
            // Act & Assert
            await dashboardPage.verifyTimeAtWorkWidget();
        });

        test("TC002: Should verify 'Time at Work' header text is correct", async () => {
            // Act & Assert
            await dashboardPage.verifyTimeAtWorkHeaderText("Time at Work");
        });

        test("TC003: Should verify Time at Work widget structure", async () => {
            // Assert individual elements
            await expect(dashboardPage.dashboardLocators.timeAtWorkWidget).toBeVisible({ timeout: 5000 });
            await expect(dashboardPage.dashboardLocators.timeAtWorkHeader).toContainText("Time at Work");
            await expect(dashboardPage.dashboardLocators.timeAtWorkIcon).toBeVisible({ timeout: 5000 });
            await expect(dashboardPage.dashboardLocators.attendanceCard).toBeVisible({ timeout: 5000 });
        });
    });
});