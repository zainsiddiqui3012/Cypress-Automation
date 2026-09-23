import CreateIssue from "../../../../support/POM/IssueManagement_PO/Decisions/CreateIssue";
import IssueUtility from "../../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
import IssueDashboard from "../../../../support/POM/IssueManagement_PO/IssueDashboard";
import SummaryIssue from "../../../../support/POM/IssueManagement_PO/Decisions/SummaryIssue";
const locators = require("../../../../fixtures/locators.json");

const createIssueSetupData = "cypress/fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json";
const createIssue = new CreateIssue();
const issueUtility = new IssueUtility();
const issueDashboard = new IssueDashboard();
const summaryIssue = new SummaryIssue();

describe("Issue Management Workflow Tests", { tags: ["@decision", "@issue-workflow", "@issue-dashboard", "@regression", "@issue-management", "@issue-managementv2", "@smoke"] }, () => {
    const issueManagementUser = Cypress.env("ISSUE_USER");
    // Shared data variable at describe level
    let data;
    
    beforeEach(function() {
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        
        // Load test data once before each test
        cy.readFile(createIssueSetupData).then(setupData => {       
            data = setupData; // Assign to shared variable
            Cypress.env('testData', setupData);
        });

        cy.loginWithSession("IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY);
        cy.visitIssueManagementDashboard();
    });
    
    // Scenario 1: Create issue and verify it has Open status (Simple Severity)
    it("Create a new issue and verify it has Open status", { tags: ["@smoke", "@severity-simple", "@create-issue"] }, () => {            
        // Click create issue button
        issueDashboard.clicksOnCreateIssueButton();
        
        cy.readFile(createIssueSetupData).then(data => {
            issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);
        });
        
        // Re-read the file to get updated values
        cy.readFile(createIssueSetupData).then(updatedData => {
            // Update our shared data variable
            data = updatedData;
            
            // Fill in the form - using Simple Severity
            createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
            createIssue.enterDataInDescription(data.setup.descriptionSummary);
            createIssue.selectSeverity("Simple"); // Use Simple severity directly
            createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
            createIssue.selectRegulatorAgency(data.setup.regulatorAgency.regulatorAgencyFullName);
            createIssue.selectIssueType(data.setup.issueType.issueTypeFullName);
            createIssue.enterAssociateProjectExamAudit(data.setup.summary.summaryFullName);
            createIssue.selectResponsibleDepartment(data.OrganizationalHierarchy.OG);
            createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
            createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.IssueAssignees.Assignee);
            createIssue.selectReporter(data.IssueAssignees.Reporter);
            createIssue.selectSubjectArea(data.setup.category.categoryFullName);
            createIssue.selectVendor(data.setup.vendor.vendorFullName);
            createIssue.enterDateInIdentificationDate(data.date.currentDate);
            createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
            
            // Generate more random data for details
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.originalReport, 30);
            issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.recommendation);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.managementResponse);
            
            // Navigate to Key Dates tab
            createIssue.clicksOnTab(data.tabs.keyDates);
            createIssue.enterReportDate(data.date.pastDate, 3);
            createIssue.enterDueDate(data.date.futureDate, 6);
            
            // Navigate to Details tab
            createIssue.clicksOnTab(data.tabs.details);
            createIssue.enterDataInRiskArea(data.setup.riskArea);
            
            // Create the issue
            createIssue.clicksOnCreateButton();
            
            cy.log('=== ISSUE CREATED SUCCESSFULLY WITH SIMPLE SEVERITY ===');
            
            // Validate the status and verify buttons for Simple Severity (NO CANCEL BUTTON)
            summaryIssue.verifyStatusChanged(data.simpleSeverityWorkflow.statusTransitions.openToInProgress.fromStatus);
            
            // Verify buttons for Simple Severity Open status (without Cancel button)
            summaryIssue.verifyButtonVisibility(data.simpleSeverityWorkflow.statusButtons.open);

            // After successful creation, extract the issue ID and save it for other tests
            summaryIssue.extractIssueId();
        });
    });
    
    // Scenario 2: Change status from Open to In Progress (Simple Severity)
    it("Change status from Open to In Progress", { tags: ["@smoke", "@severity-simple", "@status-transition", "@regression"] }, () => {
        // Navigate to the issue by ID
        summaryIssue.navigateToIssueById();

        cy.readFile(createIssueSetupData).then(data => {
            // Change status to In Progress using Simple Severity workflow
            summaryIssue.changeStatus(data.simpleSeverityWorkflow.statusTransitions.openToInProgress.buttonText);
            
            // Validate the status changed
            summaryIssue.verifyStatusChanged(data.simpleSeverityWorkflow.statusTransitions.openToInProgress.toStatus);
            
            // Verify buttons in In Progress status for Simple Severity
            summaryIssue.verifyButtonVisibility(data.simpleSeverityWorkflow.statusButtons.inProgress);
        });
    });
    
    // Scenario 3: Change status from In Progress to Closed (Simple Severity)
    it("Change status from In Progress to Closed", { tags: ["@smoke", "@severity-simple", "@status-transition", "@regression"] }, () => {
        // Navigate to the issue by ID
        summaryIssue.navigateToIssueById();

        cy.readFile(createIssueSetupData).then(data => {
            // Change status to Closed using Simple Severity workflow
            summaryIssue.changeStatus(data.simpleSeverityWorkflow.statusTransitions.inProgressToClosed.buttonText);
            
            // Validate the status changed
            summaryIssue.verifyStatusChanged(data.simpleSeverityWorkflow.statusTransitions.inProgressToClosed.toStatus);
            
            // Verify buttons in Closed status for Simple Severity
            summaryIssue.verifyButtonVisibility(data.simpleSeverityWorkflow.statusButtons.closed);
            
            cy.log('=== SIMPLE SEVERITY WORKFLOW COMPLETED SUCCESSFULLY ===');
        });
    });
});







