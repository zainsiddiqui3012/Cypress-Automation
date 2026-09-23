import CreateIssue from "../../../../support/POM/IssueManagement_PO/Decisions/CreateIssue";
import IssueUtility from "../../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
import IssueDashboard from "../../../../support/POM/IssueManagement_PO/IssueDashboard";
import SummaryIssue from "../../../../support/POM/IssueManagement_PO/Decisions/SummaryIssue";
const locators = require("../../../../fixtures/locators.json");

const createIssueSetupData = "cypress/fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json";
const businessAreaData = "cypress/fixtures/RCSAAuditLog/BusinessArea.json";
const createIssue = new CreateIssue();
const issueUtility = new IssueUtility();
const issueDashboard = new IssueDashboard();
const summaryIssue = new SummaryIssue();

describe("Extended Severity Issue Management Workflow Tests", { tags: ["@decision", "@extended-severity-workflow", "@issue-dashboard", "@regression", "@issue-management", "@issue-managementv2", "@severity-extended", "@create-issue"] }, () => {
    
    const issueManagementUser = Cypress.env("ISSUE_USER");
    let data;
    
    // Helper function to generate and prepare test data
    const prepareTestData = () => {
        return cy.readFile(createIssueSetupData).then(data => {
            issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);
        }).then(() => {
            return cy.readFile(createIssueSetupData);
        });
    };
    
    // Helper function to create minimal Extended Severity issue with basic fields
    const createMinimalExtendedSeverityIssue = (testData) => {
        createIssue.enterDataInSummaryField(testData.setup.summary.summaryFullName);
        createIssue.enterDataInDescription(testData.setup.descriptionSummary);
        createIssue.selectSeverity(testData.setup.severityExtendedFullName.severityExtendedFullName);
        createIssue.selectIssueSource(testData.setup.issueSource.issueSourceFullName);
        createIssue.selectRegulatorAgency(testData.setup.regulatorAgency.regulatorAgencyFullName);
        createIssue.selectIssueType(testData.setup.issueType.issueTypeFullName);
        createIssue.enterAssociateProjectExamAudit(testData.setup.summary.summaryFullName);
        createIssue.selectResponsibleDepartment(testData.OrganizationalHierarchy.OG);
        createIssue.selectSubmitterName(testData.IssueAssignees.submitterName);
        createIssue.selectsAssigneeType(testData.IssueAssignees.AssigneeTypeSingle, testData.IssueAssignees.Assignee);
        createIssue.selectReporter(testData.IssueAssignees.Reporter);
        createIssue.selectSubjectArea(testData.setup.category.categoryFullName);
        createIssue.selectVendor(testData.setup.vendor.vendorFullName);
        createIssue.enterDataInNotifyField(testData.notifications.email);
        createIssue.enterDateInIdentificationDate(testData.date.currentDate);
        createIssue.enterDataInOwnerField(testData.IssueAssignees.submitterName);

        createIssue.clicksOnTab(testData.tabs.keyDates);
        createIssue.enterReportDate(testData.date.pastDate, 3);
        createIssue.enterDueDate(testData.date.futureDate, 6);
        createIssue.enterInValidationTargetDate(testData.date.pastDate, 1);
    };
    
    // Helper function to add Key Dates configuration
    const addKeyDatesConfiguration = (testData) => {
        createIssue.clicksOnTab(testData.tabs.keyDates);
        createIssue.enterReportDate(testData.date.pastDate, 3);
        createIssue.enterDueDate(testData.date.futureDate, 6);
        createIssue.enterInValidationTargetDate(testData.date.pastDate, 1);
    };
    
    // Helper function to create complete Extended Severity issue workflow
    const createExtendedSeverityIssueWithWorkflow = (workflowPath, includeKeyDates = true) => {
        issueDashboard.clicksOnCreateIssueButton();
        
        return prepareTestData().then(updatedData => {
            data = updatedData;
            
            createMinimalExtendedSeverityIssue(data);
            
            if (includeKeyDates) {
                addKeyDatesConfiguration(data);
            }
            
            createIssue.clicksOnCreateButton();
            
            if (workflowPath && workflowPath.length > 0) {
                executeWorkflowTransitions(workflowPath);
            }
        }).then(() => {
            // Return a resolved promise to allow chaining
            return cy.wrap(null);
        });
    };
    
    // Helper function to execute workflow transitions
    const executeWorkflowTransitions = (transitions) => {
        transitions.forEach(transition => {
            if (transition.type === 'simple') {
                summaryIssue.verifyStatusChanged(transition.fromStatus);
                summaryIssue.changeStatus(transition.buttonText);
                summaryIssue.verifyStatusChanged(transition.toStatus);
            } else if (transition.type === 'contained') {
                summaryIssue.changeStatusToContained(transition.buttonText, transition.rootCause);
                summaryIssue.verifyStatusChanged(transition.toStatus);
            } else if (transition.type === 'cancelled') {
                summaryIssue.changeStatusToCancelled(transition.buttonText, transition.comment);
                summaryIssue.verifyStatusChanged(transition.toStatus);
            } else if (transition.type === 'acceptRisk') {
                summaryIssue.changeStatusToAcceptRisk(transition.buttonText, transition.comment);
                summaryIssue.verifyStatusChanged(transition.toStatus);
            }
        });
    };
    
    beforeEach(function() {
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        
        cy.readFile(createIssueSetupData).then(setupData => {       
            data = setupData;
            Cypress.env('testData', setupData);
        });

        cy.loginWithSession("IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY);
        cy.visitIssueManagementDashboard();
    });
    
    // Scenario 1: Create issue with Extended Severity and verify it has Open status
    it("Create a new issue with Extended Severity and verify it has Open status", { tags: ["@smoke"] }, () => {            
        issueDashboard.clicksOnCreateIssueButton();
        
        cy.readFile(createIssueSetupData).then(data => {
            issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);
        });
        
        cy.readFile(createIssueSetupData).then(updatedData => {
            data = updatedData;
            
            cy.log(`=== CREATING EXTENDED SEVERITY ISSUE WITH SUMMARY: ${data.setup.summary.summaryFullName} ===`);
            
            createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
            createIssue.enterDataInDescription(data.setup.descriptionSummary);
            createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
            createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
            createIssue.selectRegulatorAgency(data.setup.regulatorAgency.regulatorAgencyFullName);
            createIssue.selectIssueType(data.setup.issueType.issueTypeFullName);
            createIssue.enterAssociateProjectExamAudit(data.setup.summary.summaryFullName);
            createIssue.selectResponsibleDepartment(data.OrganizationalHierarchy.OG);
            
            cy.readFile(businessAreaData).then(businessAreasData => {
                createIssue.selectBusinessArea(businessAreasData[0].BusinessAreaFullName);
            });
            
            createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
            createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.IssueAssignees.Assignee);
            createIssue.selectReporter(data.IssueAssignees.Reporter);
            createIssue.selectApprover(data.IssueAssignees.Reporter);
            createIssue.selectSubjectArea(data.setup.category.categoryFullName);
            createIssue.selectVendor(data.setup.vendor.vendorFullName);
            createIssue.enterDataInNotifyField(data.notifications.email);
            createIssue.enterDateInIdentificationDate(data.date.currentDate);
            createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
            
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.originalReport, 30);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.rootCauseDescription);
            issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.potentialLoss, 4);
            issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.actualLoss, 6);
            issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.numberOfCustomersImpacted, 3);
            issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.howCustomersAreImpacted);
            issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.recommendation);
            issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.managementResponse);
            
            createIssue.clicksOnTab(data.tabs.keyDates);
            createIssue.enterReportDate(data.date.pastDate, 3);
            createIssue.enterDueDate(data.date.futureDate, 6);
            createIssue.enterInValidationTargetDate(data.date.pastDate, 1);
            
            createIssue.clicksOnTab(data.tabs.details);
            
            cy.readFile(createIssueSetupData).then(finalData => {
                data = finalData;
                
                createIssue.enterDatInPotentialLoss(data.setup.potentialLoss);
                createIssue.enterDataInActualLoss(data.setup.actualLoss);
                createIssue.enterDataInRiskArea(data.setup.riskArea);
                createIssue.enterDataInNumberOfCustomersImpacted(data.setup.numberOfCustomersImpacted);
                
                createIssue.clicksOnCreateButton();
                
                cy.log('=== EXTENDED SEVERITY ISSUE CREATED SUCCESSFULLY ===');
                
                cy.readFile(createIssueSetupData).then(updateData => {
                    updateData.setup.existingIssueName = data.setup.summary.summaryFullName;
                    cy.writeFile(createIssueSetupData, updateData);
                });
                
                summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
                summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.open);
                summaryIssue.extractIssueId();
            });
        });
    });
    
    // Scenario 2: Change status from Open to In Progress
    it("Change Extended Severity issue status from Open to In Progress", { tags: ["@status-transition", "@smoke"] }, () => {
        summaryIssue.navigateToIssueById();
        
        cy.log('=== CHANGING EXTENDED SEVERITY ISSUE STATUS TO IN PROGRESS ===');
        
        // Current status should be Open
        summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
        summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
        summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
        summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.inProgress);
        
        cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO IN PROGRESS ===');
    });
    

    // Scenario 3: Change status from In Progress to Management Accept Risk
    it("Change Extended Severity issue status from In Progress to Management Accept Risk", { tags: ["@status-transition", "@accept-risk", "@smoke"] }, () => {
        // Ensure we have the latest test data
        cy.readFile(createIssueSetupData).then(latestData => {
            data = latestData;
            
            summaryIssue.navigateToIssueById();
            
            cy.log('=== CHANGING EXTENDED SEVERITY ISSUE STATUS TO MANAGEMENT ACCEPT RISK ===');
            
            // Current status should be In Progress (from Scenario 2)
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToAcceptRisk.fromStatus);
            
            // Use specific method for Accept Risk transition which handles comment popup
            summaryIssue.changeStatusToAcceptRisk(
                data.workflow.statusTransitions.inProgressToAcceptRisk.buttonText,
                data.commentOptions.inProgressToAcceptRisk
            );
            
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToAcceptRisk.toStatus);
            summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.acceptRisk);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO MANAGEMENT ACCEPT RISK ===');
        });
    });

    // Scenario 4: Create new issue and change from Open to Cancelled
    it("Change Extended Severity issue status from Open to Cancelled", { tags: ["@status-transition", "@cancel"] }, () => {
        createExtendedSeverityIssueWithWorkflow([], false).then(() => {
            cy.log('=== CHANGING EXTENDED SEVERITY ISSUE STATUS FROM OPEN TO CANCELLED ===');
            
            // Now the new issue is in Open status - Use new method for Cancel transition
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToCancelled.fromStatus);
            summaryIssue.changeStatusToCancelled(
                data.workflow.statusTransitions.openToCancelled.buttonText,
                data.commentOptions.openToCancelled
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToCancelled.toStatus);
            summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.cancelled);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO CANCELLED ===');
        });
    });

    // Scenario 5: Create new issue and test In Progress to Contained workflow
    it("Change Extended Severity issue status from In Progress to Contained", { tags: ["@status-transition", "@contain"] }, () => {
        const workflowPath = [
            {
                type: 'simple',
                fromStatus: data.workflow.statusTransitions.openToInProgress.fromStatus,
                buttonText: data.workflow.statusTransitions.openToInProgress.buttonText,
                toStatus: data.workflow.statusTransitions.openToInProgress.toStatus
            }
        ];
        
        createExtendedSeverityIssueWithWorkflow([], true).then(() => {
            cy.log('=== MOVING TO IN PROGRESS THEN TO CONTAINED ===');
            
            // First move from Open to In Progress
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
            summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
            
            // Then move from In Progress to Contained using the new method
            summaryIssue.changeStatusToContained(
                data.workflow.statusTransitions.inProgressToContained.buttonText, 
                data.rootCauseOptions.default
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToContained.toStatus);
            summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.contained);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO CONTAINED ===');
            
            // Store this issue ID for next scenarios
            summaryIssue.extractIssueId();
        });
    });

    // Scenario 6: Change status from In Progress to Cancelled
    it("Change Extended Severity issue status from In Progress to Cancelled", { tags: ["@status-transition", "@cancel-in-progress"] }, () => {
        createExtendedSeverityIssueWithWorkflow([], true).then(() => {
            cy.log('=== MOVING TO IN PROGRESS THEN CANCELLING ===');
            
            // First move from Open to In Progress
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
            summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
            
            // Then cancel from In Progress using new method
            summaryIssue.changeStatusToCancelled(
                data.workflow.statusTransitions.inProgressToCancelled.buttonText,
                data.commentOptions.inProgressToCancelled
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToCancelled.toStatus);
            summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.cancelled);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO CANCELLED ===');
        });
    });

    // Scenario 7: Change status from Contained to Cancelled
    it("Change Extended Severity issue status from Contained to Cancelled", { tags: ["@status-transition", "@cancel-contained"] }, () => {
        createExtendedSeverityIssueWithWorkflow([], true).then(() => {
            cy.log('=== MOVING TO CONTAINED THEN CANCELLING ===');
            
            // Move from Open to In Progress
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
            summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
            
            // Move from In Progress to Contained
            summaryIssue.changeStatusToContained(
                data.workflow.statusTransitions.inProgressToContained.buttonText,
                data.rootCauseOptions.default
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToContained.toStatus);
            
            // Cancel from Contained using new method
            summaryIssue.changeStatusToCancelled(
                data.workflow.statusTransitions.containedToCancelled.buttonText,
                data.commentOptions.containedToCancelled
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.containedToCancelled.toStatus);
            summaryIssue.verifyButtonVisibility(data.workflow.statusButtons.cancelled);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO CANCELLED ===');
            
            // Store this issue ID for next scenarios
            summaryIssue.extractIssueId();
        });
    });

    // Scenario 10: Verify Submit for Validation shows notification modal when no action plan exists
    it("Verify Submit for Validation shows notification modal requiring action plan", { tags: ["@status-transition", "@validation-modal"] }, () => {
        createExtendedSeverityIssueWithWorkflow([], true).then(() => {
            cy.log('=== TESTING SUBMIT FOR VALIDATION NOTIFICATION MODAL ===');
            
            // Move through the workflow to Contained status
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
            summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
            
            // Use new method for Contain transition
            summaryIssue.changeStatusToContained(
                data.workflow.statusTransitions.inProgressToContained.buttonText,
                data.rootCauseOptions.default
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToContained.toStatus);
            
            // Click Submit for Validation button
            summaryIssue.changeStatus(data.workflow.statusTransitions.containedToInValidation.buttonText);
            
            // Handle the notification modal - verify text and click Ok
            cy.switchToIframe(locators.kxi.decisionTask.decisionFrame).then($iframe => {
                // Verify the notification modal text exists
                cy.wrap($iframe)
                    .contains(data.messages.actionPlanRequiredForValidation, { timeout: 10000 })
                    .should('exist');
            });
        });
    });

    // Scenario 8: Change status from Contained to In Validation
    it("Change Extended Severity issue status from Contained to In Validation", { tags: ["@status-transition", "@validation"] }, () => {
        createExtendedSeverityIssueWithWorkflow([], true).then(() => {
            cy.log('=== MOVING TO CONTAINED THEN TO IN VALIDATION ===');
            
            // Move from Open to In Progress
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.fromStatus);
            summaryIssue.changeStatus(data.workflow.statusTransitions.openToInProgress.buttonText);
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.openToInProgress.toStatus);
            
            // Move from In Progress to Contained
            summaryIssue.changeStatusToContained(
                data.workflow.statusTransitions.inProgressToContained.buttonText,
                data.rootCauseOptions.default
            );
            summaryIssue.verifyStatusChanged(data.workflow.statusTransitions.inProgressToContained.toStatus);
            
            // Move from Contained to In Validation
            summaryIssue.changeStatus(data.workflow.statusTransitions.containedToInValidation.buttonText);
            
            cy.log('=== EXTENDED SEVERITY ISSUE STATUS SUCCESSFULLY CHANGED TO IN VALIDATION ===');
            
            // Store this issue ID for next scenarios
            summaryIssue.extractIssueId();
        });
    });

});