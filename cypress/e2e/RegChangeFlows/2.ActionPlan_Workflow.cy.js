import RegChangeParentWorkflowPage from "../../support/POM/RegChangeFlows/RegChangeParentWorkflowPage.js";
import RegChangeEditPage from "../../support/POM/RegChangeFlows/RegChangeEditPage.js";
import RegChangeDialogWorkflowsPage from "../../support/POM/RegChangeFlows/RegChangeDialogWorkflowsPage.js";
import ActionPlanWorkflowPage from "../../support/POM/RegChangeFlows/ActionPlanWorkflowPage.js";
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";

import locatorsData from "../../fixtures/locators.json";
import testDataFile from "../../fixtures/RegChangeFlows/RegulatoryChange.json";
import CustomerProfile from "../../support/POM/Administration/CustomerProfile";

describe(
  "Action Plan Workflow - Complete Test Suite",
  {
    tags: [
      "@regression",
      "@cms",
      "@regchange",
      "@action-plan",
      "@customer-space",
      "@pd51738",
    ],
  },
  () => {
    const parentWorkflow = new RegChangeParentWorkflowPage();
    const editPage = new RegChangeEditPage();
    const dialogWorkflows = new RegChangeDialogWorkflowsPage();
    const actionPlanWorkflow = new ActionPlanWorkflowPage();

    const customerProfile = new CustomerProfile();

    const locators = locatorsData;
    const testData = testDataFile;
    const savedTicketKeysPath =
      "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

    let actionPlanTicketKey;

    const session = () => {
      cy.loginWithSession(
        "🔐 Logging in with CMS credentials",
        Cypress.env("cms_auto_username"),
        Cypress.env("cms_auto_password"),
        Cypress.env("cms_auto_customerKey"),
      );
    };

    beforeEach(() => {
      session();
      cy.visitComplianceDashboard();
    });

    describe(
      "STEP 3: Create Action Plan Child Ticket",
      { tags: ["@action-plan-create"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });

        it(
          "should successfully create an Action Plan child ticket from parent ticket using dialog with specified due date",
          { tags: ["@smoke", "@pd51800", "@pd51752"] },
          () => {
            dialogWorkflows.createActionPlanWithDueDate(
              testData.actionPlan.dueDate,
            );
          },
        );

        it(
          "should verify that the newly created Action Plan appears in parent ticket Issue Links section with correct due date",
          { tags: ["@smoke", "@pd51753"] },
          () => {
            dialogWorkflows.verifyChildInIssueLinks(
              testData.actionPlan.title,
              testData.actionPlan.dueDateFormatted,
              testData.actionPlan.statuses.open,
            );
            dialogWorkflows.saveActionPlanTicketKey().then((key) => {
              actionPlanTicketKey = key;
            });
          },
        );

        it(
          "should verify that parent ticket status remains unchanged in New after creating Action Plan child",
          { tags: ["@action-plan-create", "@pd51754"] },
          () => {
            dialogWorkflows.verifyParentStatusUnchanged(
              testData.parent.statuses.new,
            );
          },
        );
      },
    );

    describe(
      "STEP 4: Execute Action Plan Workflows",
      { tags: ["@action-plan-workflow"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.actionPlanTicketKey);
            cy.wait(testData.waitTimes.stabilize);
          });
        });

        describe(
          "4.1 Start Progress",
          { tags: "@action-plan-progress" },
          () => {
            it(
              "should successfully navigate to the Action Plan child ticket page using the extracted ticket key",
              { tags: ["@action-plan-progress", "@pd51755"] },
              () => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.actionPlanTicketKey);
                });
              },
            );

            it(
              "should successfully transition Action Plan from Open to In Progress status by clicking Start Progress button",
              { tags: ["@smoke", "@pd51756"] },
              () => {
                actionPlanWorkflow.verifyStatusIs(
                  testData.actionPlan.statuses.open,
                );
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  "a.issueaction-workflow-transition:contains('Start Progress')",
                  testData.actionPlan.statuses.inProgress,
                );
              },
            );
          },
        );

        describe(
          "4.2 Add Status Update",
          { tags: "@action-plan-status-update" },
          () => {
            const statusUpdateText = testData.actionPlan.statusUpdate;

            it(
              "should successfully add a status update to Action Plan via dialog and verify it is saved",
              { tags: ["@action-plan-status-update", "@pd51757"] },
              () => {
                actionPlanWorkflow.clickAddStatusUpdate();
                actionPlanWorkflow.fillAndSubmitStatusUpdate(statusUpdateText);
                actionPlanWorkflow.verifyStatusIs(
                  testData.actionPlan.statuses.inProgress,
                );
              },
            );

            it(
              "should successfully cancel the status update dialog without saving any changes when Cancel button is clicked",
              { tags: ["@action-plan-status-update", "@pd51758"] },
              () => {
                actionPlanWorkflow.clickAddStatusUpdate();
                actionPlanWorkflow.cancelStatusUpdate();
              },
            );
          },
        );

        describe(
          "4.3 Send for Approval",
          { tags: "@action-plan-approval" },
          () => {
            it(
              "Visit to Customer Profile and send for approval",
              { tags: "@action-plan-approval" },
              () => {
                customerProfile.checkRegChangeApprovalAndSave();
              },
            );
            it.skip(
              "should successfully send Action Plan for approval and transition status to Approval Needed with Accept and Reject buttons visible",
              { tags: ["@smoke", "@pd51759"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .sendForApproval,
                  testData.actionPlan.statuses.approvalNeeded,
                );
                actionPlanWorkflow.verifyWorkflowButtonsVisible([
                  testData.workflowButtons.accept,
                  testData.workflowButtons.reject,
                ]);
              },
            );
          },
        );

        describe(
          "4.4 Test Reject Approval Flow",
          { tags: "@action-plan-reject" },
          () => {
            it.skip(
              "should successfully reject the Action Plan approval and transition status back to Open with assignee cleared",
              { tags: ["@action-plan-reject", "@pd51760"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.reject,
                  testData.actionPlan.statuses.open,
                );

                actionPlanWorkflow.verifyAssigneeCleared();
              },
            );

            it.skip(
              "should successfully restart progress on Action Plan after rejection to bring it back to In Progress status",
              { tags: ["@action-plan-reject", "@pd51761"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .startProgress,
                  testData.actionPlan.statuses.inProgress,
                );
              },
            );
          },
        );

        describe(
          "4.5 Accept Approval and Close",
          { tags: "@action-plan-accept" },
          () => {
            it(
              "should successfully send Action Plan for approval again after rejection to test the approval flow",
              { tags: ["@action-plan-accept", "@pd51762"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .sendForApproval,
                  testData.actionPlan.statuses.approvalNeeded,
                );
              },
            );

            it(
              "should successfully accept the Action Plan approval and transition it to Closed status with resolved date set",
              { tags: ["@smoke", "@pd51763"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.accept,
                  testData.actionPlan.statuses.closed,
                );
              },
            );
          },
        );

        describe(
          "4.6 Test Reopen Action Plan",
          { tags: "@action-plan-reopen" },
          () => {
            it(
              "should successfully reopen the closed Action Plan and transition it back to In Progress with assignee preserved",
              { tags: ["@action-plan-reopen", "@pd51764"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.reopen,
                  testData.actionPlan.statuses.inProgress,
                );

                actionPlanWorkflow.verifyAssigneePreserved();
              },
            );

            it(
              "should close the Action Plan again through approval workflow to continue with the business process",
              { tags: ["@action-plan-reopen", "@pd51765"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .sendForApproval,
                  testData.actionPlan.statuses.approvalNeeded,
                );
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.accept,
                  testData.actionPlan.statuses.closed,
                );
              },
            );
          },
        );
      },
    );

    describe(
      "STEP 3: Action Plan Edit Scenarios",
      { tags: ["@action-plan-edit"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.actionPlanTicketKey);
          });
        });

        describe("3.1 Edit Summary", { tags: "@edit-summary" }, () => {
          const newSummary = testData.actionPlan.edit.summary;

          it(
            "should successfully edit and update the Action Plan summary field with new text",
            { tags: "@smoke" },
            () => {
              editPage.editSummary(newSummary);
              editPage.verifySummaryText(newSummary);
            },
          );
        });

        describe("3.2 Summary Validations", { tags: "@validation" }, () => {
          it(
            "should display validation error when attempting to save an empty summary field",
            { tags: "@validation" },
            () => {
              editPage.testEmptySummaryValidation();
            },
          );

          it(
            "should display validation error when summary text exceeds the maximum character limit of 255 characters",
            { tags: "@validation" },
            () => {
              editPage.testSummaryCharacterLimit(
                testData.validationLimits.testCharacterLimit,
              );
            },
          );
        });

        describe("3.3 Edit Description", { tags: "@edit-description" }, () => {
          const newDescription = testData.actionPlan.edit.description;

          it(
            "should successfully edit and save the Action Plan description field with detailed text",
            { tags: "@smoke" },
            () => {
              editPage.editDescription(newDescription);
              editPage.verifySuccessMessage();
            },
          );
        });

        describe(
          "3.4 Edit Assignee - Single User",
          { tags: "@edit-assignee" },
          () => {
            it(
              "should successfully assign the Action Plan ticket to the current logged-in user using Assign to Me option",
              { tags: "@edit-assignee" },
              () => {
                editPage.enterEditMode();
                editPage.clickAssigneeTypeSingle();
                editPage.clickInlineAssigneeField();
                editPage.clearInlineAssigneeField();
                editPage.enterInlineAssignee(testData.assignee.bfsiUser);
                editPage.clickUpdate();
                editPage.verifyAssigneeIs(testData.assignee.bfsiUser);
              },
            );
          },
        );

        describe("3.5 Edit Date Fields", { tags: "@edit-date" }, () => {
          it(
            "should successfully update the due date for the Action Plan ticket using the calendar date picker",
            { tags: "@edit-date" },
            () => {
              editPage.enterEditMode();
              editPage.clickDueDateCalendarButton();
              editPage.selectDateFromPicker(
                testData.actionPlan.edit.dueDate.day,
                testData.actionPlan.edit.dueDate.month,
                testData.actionPlan.edit.dueDate.year,
              );
              editPage.clickUpdate();
              editPage.verifyDueDateIs(
                testData.actionPlan.edit.dueDate.formatted,
              );
            },
          );
        });
      },
    );

    describe(
      "STEP 5: Action Plan Watchers and Notifications",
      { tags: ["@action-plan-watchers"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.actionPlanTicketKey);
          });
        });

        it(
          "should successfully add current user as a watcher to the Action Plan ticket and verify watcher count increases",
          { tags: "@action-plan-watchers" },
          () => {
            actionPlanWorkflow.clickMoreButton();
            cy.wait(testData.waitTimes.long);
            actionPlanWorkflow.clickWatchIssue();
            actionPlanWorkflow.verifyWatcherCount(testData.watchers.count);
          },
        );

        it(
          "should successfully add additional watcher to Action Plan through Manage Watchers dialog and verify watcher is added",
          { tags: "@action-plan-watchers" },
          () => {
            actionPlanWorkflow.clickMoreButton();
            cy.wait(testData.waitTimes.long);
            actionPlanWorkflow.openManageWatchers();
            cy.wait(testData.waitTimes.long);
            actionPlanWorkflow.addWatcher(testData.watchers.single);
            actionPlanWorkflow.verifyAddedWatcher(
              testData.watchers.singleWithBrackets,
            );
          },
        );

        it(
          "should successfully remove a watcher from Action Plan ticket",
          { tags: "@action-plan-watchers" },
          () => {
            actionPlanWorkflow.clickMoreButton();
            cy.wait(3000);
            actionPlanWorkflow.openManageWatchers();
            cy.wait(3000);
            actionPlanWorkflow.removeWatcher();
            actionPlanWorkflow.verifyRemovedWatcher();
          },
        );
      },
    );

    describe(
      "STEP 6: Action Plan Relationship with Parent",
      { tags: ["@action-plan-relationship"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.actionPlanTicketKey);
          });
        });

        it(
          "should verify that Action Plan ticket displays correct parent ticket link in Issue Links section",
          { tags: "@action-plan-relationship" },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              actionPlanWorkflow.verifyParentLinkExists(data.parentTicketKey);
            });
          },
        );

        it(
          "should successfully navigate to parent ticket from Action Plan using parent link",
          { tags: ["@action-plan-relationship", "@pd51766"] },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              actionPlanWorkflow.clickParentLink();
              parentWorkflow.verifyCurrentTicketIs(data.actionPlanTicketKey);
            });
          },
        );

        it(
          "should verify that parent ticket shows Action Plan in Issue Links section when navigating back",
          { tags: "@action-plan-relationship" },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              parentWorkflow.visitParent(data.parentTicketKey);
              dialogWorkflows.verifyChildInIssueLinks(
                testData.actionPlan.edit.summary,
              );
            });
          },
        );
      },
    );
    describe(
      "ADDITIONAL: Action Plan No Approval Workflow",
      { tags: ["@action-plan-no-approval"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.actionPlanTicketKey);
          });
        });

        it(
          "should successfully reopen the closed Action Plan and transition it back to In Progress with assignee preserved",
          { tags: ["@action-plan-no-approval", "@pd51792"] },
          () => {
            customerProfile.checkRegChangeApprovalAndSave(false);
            cy.readFile(savedTicketKeysPath).then((data) => {
              parentWorkflow.visitParent(data.actionPlanTicketKey);
            });
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.reopen,
              "In Progress",
            );
            actionPlanWorkflow.verifyStatusIs("In Progress");
          },
        );

        it(
          "should verify that Submit For Closure button is visible and Send for Approval button is not available for no approval workflow",
          { tags: ["@action-plan-no-approval", "@pd51793"] },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.submitForClosure,
              testData.actionPlan.statuses.submittedForClosure,
            );
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.reject,
            );
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.acceptAndClose,
            );
            actionPlanWorkflow.verifyStatusIs(
              testData.actionPlan.statuses.submittedForClosure,
            );
          },
        );

        it(
          "should successfully reject the Action Plan  and transition status back to In Progress with assignee cleared",
          { tags: ["@action-plan-no-approval", "@pd51794"] },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.reject,
              testData.actionPlan.statuses.inProgress,
            );
            actionPlanWorkflow.verifyStatusIs(
              testData.actionPlan.statuses.inProgress,
            );
            actionPlanWorkflow.verifyAssigneeCleared();
          },
        );
        it(
          "should verify that Submit For Closure button is clicked for Accept And Close",
          { tags: "@action-plan-no-approval" },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.submitForClosure,
              testData.actionPlan.statuses.submittedForClosure,
            );
            actionPlanWorkflow.verifyStatusIs(
              testData.actionPlan.statuses.submittedForClosure,
            );
          },
        );

        it(
          "should successfully Accept and Close the Action Plan",
          { tags: ["@smoke", "@pd51795"] },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            actionPlanWorkflow.clickAcceptAndClose();
            actionPlanWorkflow.verifyStatusIs(
              testData.actionPlan.statuses.closed,
            );
          },
        );
        it(
          "should successfully reopen the closed Action Plan and transition it back to In Progress with assignee preserved",
          { tags: "@action-plan-no-approval" },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.reopen,
              "In Progress",
            );
            actionPlanWorkflow.verifyStatusIs("In Progress");
          },
        );
      },
    );
  },
);
