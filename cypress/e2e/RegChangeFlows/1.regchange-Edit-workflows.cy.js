import RegChangeCreatePage from "../../support/POM/RegChangeFlows/RegChangeCreatePage.js";
import RegChangeEditPage from "../../support/POM/RegChangeFlows/RegChangeEditPage.js";
import RegChangeParentWorkflowPage from "../../support/POM/RegChangeFlows/RegChangeParentWorkflowPage.js";
import SubtaskWorkflowPage from "../../support/POM/RegChangeFlows/SubtaskWorkflowPage.js";

import locatorsData from "../../fixtures/locators.json";
import testDataFile from "../../fixtures/RegChangeFlows/RegulatoryChange.json";

describe(
  "RegChange Parent Ticket Edit Workflows",
  {
    tags: [
      "@regression",
      "@cms",
      "@regchange",
      "@regchange-edit",
      "@customer-space",
      "@pd51738",
    ],
  },
  () => {
    const createPage = new RegChangeCreatePage();
    const editPage = new RegChangeEditPage();
    const parentWorkflow = new RegChangeParentWorkflowPage();
    const subtaskWorkflow = new SubtaskWorkflowPage();

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
          { tags: ["@smoke", "@pd51739", "@pd51740"] },
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

        it(
          "should verify that the newly created parent ticket is automatically set to New status",
          { tags: ["@smoke", "@pd51741"] },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              parentWorkflow.visitParent(data.parentTicketKey);
            });
            parentWorkflow.verifyStatusIs(testData.parent.statuses.new);
          },
        );

        it(
          "should verify that Create Action Plan and Implement workflow buttons are visible in New status",
          { tags: ["@regchange-workflow", "@pd51742"] },
          () => {
            cy.readFile(savedTicketKeysPath).then((data) => {
              parentWorkflow.visitParent(data.parentTicketKey);
              parentWorkflow.verifyWorkflowButtonVisible(
                testData.workflowButtons.createActionPlan,
              );
              parentWorkflow.verifyWorkflowButtonVisible(
                testData.workflowButtons.implement,
              );
            });
          },
        );
      },
    );

    describe(
      "STEP 2: Edit Parent Ticket",
      { tags: ["@regchange-edit"] },
      () => {
        beforeEach(() => {
          cy.readFile(savedTicketKeysPath).then((data) => {
            parentWorkflow.visitParent(data.parentTicketKey);
          });
        });

        describe("2.1 Edit Summary", { tags: "@edit-summary" }, () => {
          const newSummary = testData.parent.edit.summary;

          it(
            "should successfully edit and update the parent ticket summary field with new text",
            { tags: ["@smoke", "@pd51743"] },
            () => {
              editPage.editSummary(newSummary);
              editPage.verifySummaryText(newSummary);
            },
          );
        });

        describe("2.2 Summary Validations", { tags: "@validation" }, () => {
          it(
            "should display validation error when attempting to save an empty summary field",
            { tags: ["@validation", "@pd51744"] },
            () => {
              editPage.testEmptySummaryValidation();
            },
          );

          it(
            "should display validation error when summary text exceeds the maximum character limit of 255 characters",
            { tags: ["@validation", "@pd51745"] },
            () => {
              editPage.testSummaryCharacterLimit(260);
            },
          );
        });

        describe("2.3 Edit Description", { tags: "@edit-description" }, () => {
          const newDescription = testData.parent.edit.description;

          it(
            "should successfully edit and save the parent ticket description field with detailed text",
            { tags: ["@smoke", "@pd51746"] },
            () => {
              editPage.editDescription(newDescription);
              editPage.verifySuccessMessage();
            },
          );
        });

        describe("2.4 Edit Dropdown Fields", { tags: "@edit-dropdown" }, () => {
          it(
            "should successfully update Nature of Change dropdown field from Final Rule to News",
            { tags: ["@edit-dropdown", "@pd51747"] },
            () => {
              editPage.editNatureOfChange(testData.parent.edit.natureOfChange);
              createPage.verifyFieldValue(
                "Nature of Change",
                testData.parent.edit.natureOfChange,
              );
            },
          );

          it(
            "should successfully update Type of Change dropdown field from Regulation to Enforcement Action",
            { tags: ["@edit-dropdown", "@pd51748"] },
            () => {
              editPage.editTypeOfChange(testData.parent.edit.typeOfChange);
              createPage.verifyFieldValue(
                "Type of change",
                testData.parent.edit.typeOfChange,
              );
            },
          );

          it(
            "should successfully update Magnitude dropdown field from Medium to High",
            { tags: ["@edit-dropdown", "@pd51749"] },
            () => {
              editPage.editMagnitude(testData.parent.edit.magnitude);
              createPage.verifyFieldValue(
                "Magnitude",
                testData.parent.edit.magnitude,
              );
            },
          );
        });

        describe(
          "2.5 Edit Assignee - Single User",
          { tags: "@edit-assignee" },
          () => {
            it.skip(
              "should successfully assign the parent ticket to the current logged-in user using Assign to Me option",
              { tags: ["@edit-assignee", "@pd51750"] },
              () => {
                editPage.enterEditMode();
                editPage.clickAssigneeTypeSingle();
                editPage.clickAssignToMe();
                editPage.clickUpdate();
                editPage.verifyAssigneeIs(testData.parent.edit.assignee);
              },
            );
          },
        );

        describe("2.6 Edit Date Fields", { tags: "@edit-date" }, () => {
          it(
            "should successfully set the due date for the parent ticket using the calendar date picker",
            { tags: ["@edit-date", "@pd51751"] },
            () => {
              editPage.enterEditMode();
              editPage.clickDueDateCalendarButton();
              editPage.selectDateFromPicker(
                testData.parent.edit.dueDate.day,
                testData.parent.edit.dueDate.month,
                testData.parent.edit.dueDate.year,
              );
              editPage.clickUpdate();
              editPage.verifyDueDateIs(testData.parent.edit.dueDate.formatted);
            },
          );
        });
      },
    );
  },
);
