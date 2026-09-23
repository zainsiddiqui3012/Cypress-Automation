import RegChangeCreatePage from "../../support/POM/RegChangeFlows/RegChangeCreatePage.js";
import RegChangeParentWorkflowPage from "../../support/POM/RegChangeFlows/RegChangeParentWorkflowPage.js";

import locatorsData from "../../fixtures/locators.json";
import testDataFile from "../../fixtures/RegChangeFlows/RegulatoryChange.json";

describe(
  "RegChange Parent Workflow - Complete Test Suite",
  {
    tags: [
      "@regression",
      "@cms",
      "@regchange",
      "@regchange-parent-workflow",
      "@customer-space",
      "@pd51738",
    ],
  },
  () => {
    const createPage = new RegChangeCreatePage();

    const parentWorkflow = new RegChangeParentWorkflowPage();

    const locators = locatorsData;
    const testData = testDataFile;
    const savedTicketKeysPath =
      "cypress/fixtures/RegChangeFlows/savedTicketKeys.json";

    let parentTicketKey;

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
      "STEP 1: Create New Regulatory Change",
      { tags: ["@regchange-create"] },
      () => {
        it(
          "should successfully create a new Regulatory Change parent ticket with all required fields and extract the ticket key",
          { tags: "@smoke" },
          () => {
            const createData = {
              summary: `${testData.parent.create.summaryPrefix} - ${new Date().toISOString()}`,
              businessUnit: testData.parent.create.businessUnit,
              natureOfChange: testData.parent.create.natureOfChange,
              typeOfChange: testData.parent.create.typeOfChange,
              subjectArea: testData.parent.create.subjectArea,
              magnitude: testData.parent.create.magnitude,
            };

            createPage.createNewRegulatoryChange(createData);
            parentTicketKey = parentWorkflow.saveParentTicketKey();
          },
        );
      },
    );

    describe(
      "STEP 4: Notify BU and Close Parent",
      { tags: ["@regchange-notify-close"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });

        describe(
          "4.1 Notify BU and Close",
          { tags: "@regchange-notify-close" },
          () => {
            it(
              "should verify that Notify BU & Close workflow button is visible when all child tickets are closed",
              { tags: ["@regchange-notify-close", "@pd51781"] },
              () => {
                parentWorkflow.verifyWorkflowButtonVisible(
                  testData.workflowButtons.notifyBUAndClose,
                );
              },
            );

            it(
              "should successfully execute Notify BU & Close workflow to notify business units and close the parent ticket",
              { tags: ["@smoke", "@pd51782"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons
                    .notifyBUAndClose,
                  testData.parent.statuses.closed,
                );
                cy.wait(testData.waitTimes.notification);
              },
            );

            it(
              "should verify that parent ticket has transitioned to Closed status with resolved date set after notification",
              { tags: ["@regchange-notify-close", "@pd51783"] },
              () => {
                parentWorkflow.verifyStatusIs(testData.parent.statuses.closed);
              },
            );
          },
        );
      },
    );

    describe(
      "STEP 5: Abandon Workflow (Alternative)",
      { tags: ["@regchange-abandon"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });
        it(
          "should successfully reopen the closed Action Plan and transition it back to In Progress with assignee preserved",
          { tags: ["@regchange-reopen", "@pd51786"] },
          () => {
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.reopen,
            );
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.reopen,
              testData.parent.statuses.evaluateImpact,
            );
          },
        );

        it(
          "should display abandon warning dialog when Abandon button is clicked and allow user to cancel the operation",
          { tags: ["@regchange-abandon", "@pd51787"] },
          () => {
            parentWorkflow.verifyWorkflowButtonVisible(
              testData.workflowButtons.abandon,
            );
            cy.cmsWaitForIframe("h1#summary-val", 120000);
            cy.cmsTransition(
              locators.cms.regChange.workflows.workflowButtons.abandon,
              testData.parent.statuses.abandonedClosed,
            );
          },
        );

        it(
          "should successfully abandon the parent ticket and automatically close all associated child tickets when confirmed",
          { tags: ["@regchange-abandon", "@pd51788"] },
          () => {
            parentWorkflow.verifyStatusIs(
              testData.parent.statuses.abandonedClosed,
            );
          },
        );
      },
    );

    describe(
      "STEP 6: Final Parent Close (Standard)",
      { tags: ["@regchange-close"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });

        describe("6.1 Close Parent", { tags: "@regchange-close" }, () => {
          it(
            "should successfully reopen the closed Action Plan and transition it back to In Progress with assignee preserved",
            { tags: "@regchange-reopen" },
            () => {
              parentWorkflow.verifyWorkflowButtonVisible(
                testData.workflowButtons.reopen,
              );
              cy.cmsWaitForIframe("h1#summary-val", 120000);
              cy.cmsTransition(
                locators.cms.regChange.workflows.workflowButtons.reopen,
                testData.parent.statuses.evaluateImpact,
              );
            },
          );
          it(
            "should successfully transition parent to Implementation status if not already in that state before closing",
            { tags: ["@regchange-close", "@pd51789"] },
            () => {
              parentWorkflow.verifyStatusIs(
                testData.parent.statuses.evaluateImpact,
              );
              cy.cmsWaitForIframe("h1#summary-val", 120000);
              cy.cmsTransition(
                locators.cms.regChange.workflows.workflowButtons.implement,
                testData.parent.statuses.implementation,
              );
            },
          );

          it(
            "should successfully close the parent ticket when all child tickets are closed and verify Closed status with resolved date",
            { tags: ["@smoke", "@pd51790"] },
            () => {
              cy.cmsWaitForIframe("h1#summary-val", 120000);
              cy.cmsTransition(
                locators.cms.regChange.workflows.workflowButtons.close,
                testData.parent.statuses.closed,
              );
            },
          );
        });

        describe(
          "6.2 Test Reopen Parent",
          { tags: "@regchange-reopen" },
          () => {
            it(
              "should successfully reopen the closed parent ticket and transition it back to Evaluate Impact status with resolved date cleared",
              { tags: ["@regchange-reopen", "@pd51791"] },
              () => {
                cy.cmsWaitForIframe("h1#summary-val", 120000);
                cy.cmsTransition(
                  locators.cms.regChange.workflows.workflowButtons.reopen,
                  testData.parent.statuses.evaluateImpact,
                );
                parentWorkflow.verifyResolvedDateNotExists();
              },
            );

            it(
              "should verify that Create Action Plan and Implement workflow buttons are available after reopening the parent ticket",
              { tags: "@regchange-reopen" },
              () => {
                parentWorkflow.verifyWorkflowButtonVisible(
                  testData.workflowButtons.createActionPlan,
                );
                parentWorkflow.verifyWorkflowButtonVisible(
                  testData.workflowButtons.implement,
                );
              },
            );
          },
        );
      },
    );
  },
);
