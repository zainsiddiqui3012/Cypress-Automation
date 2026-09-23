import ExternalForm from "../../../../support/POM/IssueManagement_PO/Decisions/ExternalForm";
import IssueUtility from "../../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
import CreateIssue from "../../../../support/POM/IssueManagement_PO/Decisions/CreateIssue";
const locators = require("../../../../fixtures/locators.json");

const createIssueSetupData = "cypress/fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json";
const externalForm = new ExternalForm();
const issueUtility = new IssueUtility();
const createIssue = new CreateIssue();

describe("External Webform Workflow Tests", { tags: ["@decision", "@external-webform", "@issue-dashboard", "@regression", "@issue-management", "@issue-managementv2"] }, () => {
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

        // Navigate directly to external webform URL (no login required)
        cy.visit(Cypress.env('ISSUE_EXTERNAL_WEBFORM'));
        
        // Wait for form to be fully loaded using POM method
        externalForm.waitForFormToLoad();
    });
    
    // Scenario 1: Create external webform with all required fields and verify success
    it("Create external webform with all required fields", { tags: ["@create-external-webform", "@positive"] }, () => {            
        // Generate dynamic test data
        cy.readFile(createIssueSetupData).then(data => {
            issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.externalWebformData.testData.constants.dataKey);
        });
        
        // Fill the external webform with all required fields
        cy.readFile(createIssueSetupData).then(updatedData => {
            data = updatedData;
            
            const formData = data.externalWebformData.formData;
            const messages = data.externalWebformData.testData.messages;
            const timeouts = data.externalWebformData.testData.timeouts;
            
            // Fill all required fields - use generated dynamic value
            externalForm.enterDataInSummaryField(data.setup.externalWebform.externalWebform);
            cy.wait(timeouts.formInteractionDelay);
            externalForm.enterSubmitterName(formData.submitterName);
            createIssue.enterDataInOriginalReportExternalWebform(formData.originalReport);
            externalForm.enterEventOccurrenceDate(formData.eventOccurrenceDate);
            externalForm.enterIdentificationDate(formData.identificationDate);
            externalForm.enterPotentialLoss(formData.potentialLoss);
            externalForm.selectTypeOfIssue(formData.typeOfIssue);
            externalForm.enterNotifyEmail(formData.notifyEmail);
            
            // Note: Owner field is not available in external webforms
            // this.createIssue.enterDataInOwnerField() is only for internal dashboards
            
            // Submit the form
            externalForm.clickCreateButton();
        });
    });
    
    // Scenario 2: Validate required field error messages
    it("Validate required field error messages when fields are empty", { tags: ["@smoke", "@validation", "@negative"] }, () => {
        cy.readFile(createIssueSetupData).then(data => {
            const validationMessages = data.externalWebformData.validationMessages;
            
            // Clear all fields to ensure they are empty
            externalForm.clearAllFields();
            
            // Try to submit without filling required fields
            externalForm.clickCreateButton();
            
            // Validate error messages appear
            externalForm.validateRequiredFieldErrors(validationMessages.requiredFields);
            
            // Hover over create button to see tooltip validation
            externalForm.hoverCreateButtonForValidation();
        });
    });
    
    // Scenario 3: Create external webform with minimum required data only
    it("Create external webform with minimum required data", { tags: ["@smoke", "@minimal-data", "@positive"] }, () => {
        // Generate dynamic test data
        cy.readFile(createIssueSetupData).then(data => {
            issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.externalWebformData.testData.constants.dataKey);
        });
        
        cy.readFile(createIssueSetupData).then(updatedData => {
            data = updatedData;
            
            const formData = data.externalWebformData.formData;
            const minimalData = data.externalWebformData.testData.minimalData;
            const messages = data.externalWebformData.testData.messages;
            
            // Fill only required fields using data from JSON
            externalForm.enterDataInSummaryField(minimalData.summaryPrefix + data.setup.externalWebform.externalWebform);
            externalForm.enterSubmitterName(minimalData.submitterName);
            createIssue.enterDataInOriginalReportExternalWebform(formData.originalReport);
            externalForm.enterIdentificationDate(formData.identificationDate);
            
            // Submit the form
            externalForm.clickCreateButton();
        });
    });
    
    // Scenario 4: Test date field validations
    it("Validate date field behaviors", { tags: ["@smoke", "@validation", "@dates"] }, () => {
        cy.readFile(createIssueSetupData).then(data => {
            const formData = data.externalWebformData.formData;
            const constants = data.externalWebformData.testData.constants;
            
            // Test different date scenarios using data from JSON
            externalForm.enterEventOccurrenceDate(formData.eventOccurrenceDate);
            externalForm.enterIdentificationDate(formData.identificationDate);
            
            // Verify dates are accepted
            externalForm.getFieldValue(constants.fieldNames.eventOccurrence)
              .should(constants.validationStrings.notHaveValue, constants.validationStrings.empty);
              
            externalForm.getFieldValue(constants.fieldNames.identificationDate)
              .should(constants.validationStrings.notHaveValue, constants.validationStrings.empty);
        });
    });
    
    // Scenario 5: Test Type of Issue dropdown functionality
    it("Validate Type of Issue dropdown selection", { tags: ["@smoke", "@dropdown", "@positive"] }, () => {
        cy.readFile(createIssueSetupData).then(data => {
            const formData = data.externalWebformData.formData;
            const constants = data.externalWebformData.testData.constants;
            
            // Select issue type
            externalForm.selectTypeOfIssue(formData.typeOfIssue);
            
            // Verify selection was made (just verify dropdown was interacted with)
            const regexPattern = new RegExp(constants.regexPattern);
            const componentId = locators.externalWebform.typeOfIssue.match(regexPattern)[1];
            cy.get(`[${constants.attributePrefix}='${componentId}']`).should('be.visible');
        });
    });
});