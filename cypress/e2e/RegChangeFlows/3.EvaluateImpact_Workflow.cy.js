import RegChangeParentWorkflowPage from "../../support/POM/RegChangeFlows/RegChangeParentWorkflowPage.js";
import RegChangeEditPage from "../../support/POM/RegChangeFlows/RegChangeEditPage.js";
import RegChangeDialogWorkflowsPage from "../../support/POM/RegChangeFlows/RegChangeDialogWorkflowsPage.js";
import ActionPlanWorkflowPage from "../../support/POM/RegChangeFlows/ActionPlanWorkflowPage.js";
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";

import locatorsData from "../../fixtures/locators.json";
import testDataFile from "../../fixtures/RegChangeFlows/RegulatoryChange.json";
import CustomerProfile from "../../support/POM/Administration/CustomerProfile";

describe(
  "Evaluate Impact Workflow - Complete Test Suite",
  {
    tags: [
      "@regression",
      "@cms",
      "@regchange",
      "@evaluate-impact",
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

    let evaluateImpactTicketKey;

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
      "STEP 1: Create Evaluate Impact Child Ticket",
      { tags: ["@evaluate-impact-create"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });

        it(
          "should successfully transition parent to Implementation status if not already in that state before closing",
          { tags: ["@regchange-workflow", "@pd51767"] },
          () => {
            parentWorkflow.verifyStatusIs(testData.parent.statuses.new);
            parentWorkflow.clickImplement();
            parentWorkflow.verifyStatusIs(
              testData.parent.statuses.implementation,
            );
          },
        );

        it(
          "Should verify that Create Action Plan and Close workflow buttons are visible when parent is in Implementation status",
          { tags: ["@regchange-workflow", "@pd51768"] },
          () => {
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.createActionPlan,
            );
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.close,
            );
          },
        );
        it(
          "should successfully create an Evaluate Impact child ticket from parent using dialog with specified due date",
          { tags: ["@smoke", "@pd51769"] },
          () => {
            dialogWorkflows.createEvaluateImpactWithDueDate(
              testData.evaluateImpact.dueDate,
            );
          },
        );

        it(
          "should verify that the newly created Evaluate Impact appears in parent Issue Links section with correct due date",
          { tags: ["@smoke", "@pd51770"] },
          () => {
            dialogWorkflows.verifyChildInIssueLinks(
              testData.evaluateImpact.title,
              testData.evaluateImpact.dueDateFormatted,
              testData.evaluateImpact.statuses.open,
            );
            dialogWorkflows
              .saveEvaluateImpactTicketKey(testData.evaluateImpact.title)
              .then((key) => {
                evaluateImpactTicketKey = key;
              });
          },
        );

        it(
          "should verify that parent ticket status changed in Evaluate Impact after creating Evaluate Impact child",
          { tags: ["@evaluate-impact-create", "@pd51771"] },
          () => {
            dialogWorkflows.verifyParentStatusUnchanged(
              testData.parent.statuses.evaluateImpact,
            );
          },
        );
      },
    );

    describe(
      "STEP 2: Execute Evaluate Impact Workflows",
      { tags: ["@evaluate-impact-workflow"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.evaluateImpactTicketKey);
          });
        });

        describe(
          "2.1 Start and Stop Progress",
          { tags: "@evaluate-impact-progress" },
          () => {
            it(
              "should successfully navigate to the Evaluate Impact child ticket page using the extracted ticket key",
              { tags: ["@evaluate-impact-progress", "@pd51772"] },
              () => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.evaluateImpactTicketKey);
                });
              },
            );

            it(
              "should successfully transition Evaluate Impact from Open to In Progress status by clicking Start Progress",
              { tags: ["@smoke", "@pd51773"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .startProgress,
                  testData.evaluateImpact.statuses.inProgress,
                );
              },
            );

            it(
              "should successfully stop the progress and transition Evaluate Impact back to Open status to test the workflow",
              { tags: ["@evaluate-impact-progress", "@pd51774"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.stopProgress,
                  testData.evaluateImpact.statuses.open,
                );
              },
            );

            it(
              "should restart the progress again on Evaluate Impact to continue with the completion workflow",
              { tags: ["@evaluate-impact-progress", "@pd51775"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .startProgress,
                  testData.evaluateImpact.statuses.inProgress,
                );
              },
            );
          },
        );
        describe(
          "STEP 5: Evaluate Impact Watchers and Notifications",
          { tags: "@evaluate-impact-watchers" },
          () => {
            beforeEach(() => {
              cy.readFile(savedTicketKeysPath).then((data) => {
                parentWorkflow.visitParent(data.evaluateImpactTicketKey);
                cy.cmsWaitForIframe("h1#summary-val", 120000);
              });
            });

            it(
              "should successfully add current user as a watcher to the Evaluate Impact ticket and verify watcher count increases",
              { tags: ["@evaluate-impact-watchers", "@pd51777"] },
              () => {
                actionPlanWorkflow.clickMoreButton();
                cy.wait(testData.waitTimes.stabilize);
                actionPlanWorkflow.clickWatchIssue();
                actionPlanWorkflow.verifyWatcherCount(testData.watchers.count);
              },
            );

            it(
              "should successfully add additional watcher to Evaluate Impact through Manage Watchers dialog and verify watcher is added",
              { tags: "@evaluate-impact-watchers" },
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
              "should successfully remove a watcher from Evaluate Impact ticket",
              { tags: "@evaluate-impact-watchers" },
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
          "2.2 Add Comments and Attachments",
          { tags: "@evaluate-impact-comments" },
          () => {
            it(
              "should successfully add a comment to the Evaluate Impact ticket and verify it appears in activity section",
              { tags: ["@evaluate-impact-comments", "@pd51776"] },
              () => {
                actionPlanWorkflow.addComment(testData.evaluateImpact.comment);
                actionPlanWorkflow.verifyCommentExists(
                  testData.evaluateImpact.comment,
                );
              },
            );

            it(
              "should successfully attach a file to the Evaluate Impact ticket",
              { tags: "@evaluate-impact-comments" },
              () => {
                const fileName = testData.evaluateImpact.attachment.fileName;
                const filePath = testData.evaluateImpact.attachment.path;
                actionPlanWorkflow.attachFile(filePath);
                actionPlanWorkflow.verifyFileAttached(fileName);
              },
            );
          },
        );

        describe(
          "2.4 Complete Evaluate Impact",
          { tags: "@evaluate-impact-approval" },
          () => {
            it(
              "should successfully send Evaluate Impact for approval and transition it to Approval Needed status",
              { tags: ["@smoke", "@pd51778"] },
              () => {
                customerProfile.checkRegChangeApprovalAndSave();
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.evaluateImpactTicketKey);
                });
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                actionPlanWorkflow.clickSendForApproval();
                actionPlanWorkflow.verifyStatusIs(
                  testData.evaluateImpact.statuses.approvalNeeded,
                );
              },
            );

            it(
              "should verify that Accept and Reject workflow buttons are visible when in Approval Needed status",
              { tags: "@evaluate-impact-approval" },
              () => {
                actionPlanWorkflow.verifyWorkflowButtonsVisible([
                  testData.workflowButtons.accept,
                  testData.workflowButtons.reject,
                ]);
              },
            );

            it(
              "should successfully accept the approval and close the Evaluate Impact ticket with Closed status",
              { tags: ["@smoke", "@pd51779"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.accept,
                  testData.evaluateImpact.statuses.closed,
                );
              },
            );
          },
        );

        describe(
          "2.5 Test Reopen Evaluate Impact",
          { tags: "@evaluate-impact-reopen" },
          () => {
            it(
              "should successfully reopen the closed Evaluate Impact and transition to Reopened with assignee preserved",
              { tags: "@evaluate-impact-reopen" },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                actionPlanWorkflow.clickReopen();
                cy.cmsWaitForIframe(
                  locators.cms.regChange.workflows.workflowButtons
                    .startProgress,
                  50000,
                );
                actionPlanWorkflow.verifyStatusIs(
                  testData.evaluateImpact.statuses.reopened,
                );
                actionPlanWorkflow.verifyAssigneePreserved();
              },
            );
          },
        );
      },
    );

    describe(
      "STEP 3: Evaluate Impact Edit Scenarios",
      { tags: ["@evaluate-impact-edit"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.evaluateImpactTicketKey);
          });
        });

        describe("3.1 Edit Summary", { tags: "@edit-summary" }, () => {
          const newSummary = testData.evaluateImpact.edit.summary;

          it(
            "should successfully edit and update the Evaluate Impact summary field with new text",
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
                true,
              );
            },
          );
        });

        describe("3.3 Edit Description", { tags: "@edit-description" }, () => {
          const newDescription = testData.evaluateImpact.edit.description;

          it(
            "should successfully edit and save the Evaluate Impact description field with detailed text",
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
              "should successfully assign the Evaluate Impact ticket to the current logged-in user using Assign to Me option",
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
            "should successfully update the due date for the Evaluate Impact ticket using the calendar date picker",
            { tags: "@edit-date" },
            () => {
              editPage.enterEditMode();
              editPage.clickDueDateCalendarButton();
              editPage.selectDateFromPicker(
                testData.evaluateImpact.edit.dueDate.day,
                testData.evaluateImpact.edit.dueDate.month,
                testData.evaluateImpact.edit.dueDate.year,
              );
              editPage.clickUpdate();
              editPage.verifyDueDateIs(
                testData.evaluateImpact.edit.dueDate.formatted,
              );
            },
          );
        });
      },
    );

    describe(
      "STEP 4: Evaluate Impact Rejection Flow",
      { tags: ["@evaluate-impact-reject"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.evaluateImpactTicketKey);
          });
        });
        it(
          "should successfully restart progress on Evaluate Impact after rejection to bring it back to In Progress status",
          { tags: "@evaluate-impact-reject" },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.startProgress,
              testData.evaluateImpact.statuses.inProgress,
            );
          },
        );
        it(
          "should successfully send Evaluate Impact for approval",
          { tags: "@evaluate-impact-reject" },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.sendForApproval,
              testData.evaluateImpact.statuses.approvalNeeded,
            );
          },
        );

        it(
          "should successfully reject the Evaluate Impact approval and transition status back to Open with assignee cleared",
          { tags: "@evaluate-impact-reject" },
          () => {
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.reject,
              testData.evaluateImpact.statuses.open,
            );
            actionPlanWorkflow.verifyAssigneeCleared();
          },
        );
      },
    );

    describe(
      "STEP 6: Evaluate Impact Relationship with Parent",
      { tags: ["@evaluate-impact-relationship"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.evaluateImpactTicketKey);
          });
        });

        it(
          "should verify that Evaluate Impact ticket displays correct parent ticket link in Issue Links section",
          { tags: "@evaluate-impact-relationship" },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              actionPlanWorkflow.verifyParentLinkExists(data.parentTicketKey);
            });
          },
        );

        it(
          "should successfully navigate to parent ticket from Evaluate Impact using parent link",
          { tags: "@pd51780" },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              actionPlanWorkflow.clickParentLink();
              parentWorkflow.verifyCurrentTicketIs(
                data.evaluateImpactTicketKey,
              );
            });
          },
        );

        it("should verify that parent ticket shows Evaluate Impact in Issue Links section when navigating back", () => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
            dialogWorkflows.verifyChildInIssueLinks(
              testData.evaluateImpact.title,
            );
          });
        });
      },
    );
  },
);
