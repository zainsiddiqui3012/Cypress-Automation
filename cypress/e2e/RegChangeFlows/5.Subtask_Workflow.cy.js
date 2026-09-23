import RegChangeParentWorkflowPage from "../../support/POM/RegChangeFlows/RegChangeParentWorkflowPage.js";
import SubtaskWorkflowPage from "../../support/POM/RegChangeFlows/SubtaskWorkflowPage.js";

import locatorsData from "../../fixtures/locators.json";
import testDataFile from "../../fixtures/RegChangeFlows/RegulatoryChange.json";

describe(
  "RegChange Subtask Workflows",
  {
    tags: [
      "@regression",
      "@cms",
      "@regchange",
      "@regchange-subtask",
      "@customer-space",
      "@pd51738",
    ],
  },
  () => {
    const parentWorkflow = new RegChangeParentWorkflowPage();
    const subtaskWorkflow = new SubtaskWorkflowPage();

    const locators = locatorsData;
    const testData = testDataFile;
    const savedTicketKeysPath =
      "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

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

    describe("Subtask Workflows", { tags: ["@regchange-subtask"] }, () => {
      beforeEach(() => {
        cy.readFile(savedTicketKeysPath).then((data) => {
          parentWorkflow.visitParent(data.parentTicketKey);
        });
      });

      describe(
        "ADDITIONAL: Parent Ticket Enhancement Workflows",
        { tags: ["@regchange-subtask"] },
        () => {
          beforeEach(() => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              parentWorkflow.visitParent(data.parentTicketKey);
            });
          });

          describe("1. Create Subtask", { tags: "@subtask-create" }, () => {
            const subtaskSummary = testData.subtask.summary;
            const subtaskDescription = testData.subtask.description;

            it(
              "should successfully create a subtask from parent ticket using More menu with specified summary and description",
              { tags: ["@smoke", "@pd51796"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                parentWorkflow.clickMoreButton();
                cy.wait(5000);
                parentWorkflow.clickCreateSubtask();
                cy.cmsCreateRegChangeSubtask(
                  subtaskSummary,
                  subtaskDescription,
                );
                parentWorkflow.verifySubtaskInIssueLinks(subtaskSummary);
              },
            );
          });

          describe(
            "1. Verify Subtask Creation and Extract Key",
            { tags: "@subtask-create" },
            () => {
              it(
                "should verify that the created subtask exists in parent ticket Sub-Tasks section",
                { tags: ["@smoke", "@pd51802"] },
                () => {
                  subtaskWorkflow.verifySubtaskExists();
                },
              );

              it(
                "should successfully extract and store the subtask key from Sub-Tasks table for further testing",
                { tags: ["@subtask-create", "@pd51803"] },
                () => {
                  subtaskWorkflow.getSubtaskKeyFromParent();
                },
              );
            },
          );

          describe(
            "2. Navigate to Subtask and Verify Initial State",
            { tags: "@subtask-verify" },
            () => {
              beforeEach(() => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.subTaskTicketKey);
                });
              });

              it(
                "should navigate to the subtask ticket page using the extracted subtask key",
                { tags: ["@subtask-verify", "@pd51804"] },
                () => {
                  cy.readFile(savedTicketKeysPath).then((data) => {
                    parentWorkflow.visitParent(data.subTaskTicketKey);
                  });
                },
              );

              it(
                "should verify that the newly created subtask is in Open status by default",
                { tags: ["@smoke", "@pd51805"] },
                () => {
                  subtaskWorkflow.verifyStatusIs(
                    testData.subtask.statuses.open,
                  );
                },
              );
            },
          );

          describe(
            "3. Start Progress on Subtask and Verify Workflow Buttons",
            { tags: "@subtask-progress" },
            () => {
              beforeEach(() => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.subTaskTicketKey);
                });
              });

              it(
                "should successfully transition subtask from Open to In Progress status by clicking Start Progress button",
                { tags: ["@smoke", "@pd51806"] },
                () => {
                  cy.cmsWaitForIframe("h1#summary-val", 120000);
                  cy.cmsTransition(
                    locators.cms.regChange.workflows.workflowButtons
                      .startProgress,
                    testData.subtask.statuses.inProgress,
                  );
                },
              );

              it(
                "should verify that all expected workflow buttons are visible when subtask is in In Progress status",
                { tags: ["@subtask-progress", "@pd51807"] },
                () => {
                  cy.cmsWaitForIframe("h1#summary-val", 120000);
                  subtaskWorkflow.verifyWorkflowButtonsVisible([
                    testData.workflowButtons.assign,
                    testData.workflowButtons.resolve,
                    testData.workflowButtons.closeIssue,
                  ]);
                },
              );
            },
          );

          describe(
            "4. Close Subtask and Verify Closed State",
            { tags: "@subtask-close" },
            () => {
              beforeEach(() => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.subTaskTicketKey);
                });
              });

              it(
                "should successfully close the subtask and transition it from In Progress to Closed status",
                { tags: ["@smoke", "@pd51808"] },
                () => {
                  cy.cmsWaitForIframe("h1#summary-val", 120000);
                  subtaskWorkflow.clickCloseIssue(true);
                  subtaskWorkflow.verifyStatusIs(
                    testData.subtask.statuses.closed,
                  );
                },
              );

              it(
                "should verify that Reopen Issue button is available when subtask is in Closed status",
                { tags: ["@subtask-close", "@pd51809"] },
                () => {
                  subtaskWorkflow.verifyWorkflowButtonVisible(
                    testData.workflowButtons.reopenIssue,
                  );
                },
              );
            },
          );

          describe(
            "5. Test Reopen Subtask Workflow",
            { tags: "@subtask-reopen" },
            () => {
              beforeEach(() => {
                cy.readFile(savedTicketKeysPath).then((data) => {
                  parentWorkflow.visitParent(data.subTaskTicketKey);
                });
              });

              it(
                "should successfully reopen the closed subtask and transition it back to In Progress status",
                { tags: ["@subtask-reopen", "@pd51810"] },
                () => {
                  cy.cmsWaitForIframe("h1#summary-val", 120000);
                  subtaskWorkflow.clickReopenIssue(true);
                  subtaskWorkflow.verifyStatusIs(
                    testData.subtask.statuses.reopened,
                  );
                },
              );
            },
          );
        },
      );
    });
  },
);
