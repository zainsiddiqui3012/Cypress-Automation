import locators from "../../../fixtures/locators.json";
import task from "../../../fixtures/RegChangeManagementV2-Decisions/CreateTask.json";
import dayjs from "dayjs";
import "cypress-file-upload";
const selectPath = Cypress.env("DECISION_API_SELECTPATH");
const getAll = Cypress.env("DECISION_API_GET_ALL_MESSAGES");
const apiURL = Cypress.env("DECISION_GRID_LOAD");
const formURL = Cypress.env("DECISION_API_FORMLOAD");
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";
export default class CreateTask {
  validateTaskButtonOnDashboard() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.contains(
        "a",
        locators.regChangeManagementV2.regChangeDashboard.allTasks,
        {
          timeout: 20000,
        }
      )
        .should("be.visible")
        .click();
      cy.get(locators.kxi.decisionTask.createRegularButton, {
        timeout: 50000,
      })
        .contains(task.buttonText)
        .should("be.visible")
        .click();
    });
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const finalName = task.summary + timeStamp;
    cy.readFile(taskFilePath).then((file) => {
      file.taskName = finalName;
      cy.writeFile(taskFilePath, file);
    });
    this.createTaskForm(finalName, task.assigneeUser);
  }
  createTaskForm(summary, assignee) {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      this.verifyTaskPage();
      cy.get(locators.kxi.kxiData.kxiRegularTask.summaryField).type(summary);
      cy.get(locators.kxi.kxiData.kxiRegularTask.priorityArrow).click();
      cy.get(locators.kxi.kxiData.kxiRegularTask.priorityValueMedium).click();
      cy.get(locators.kxi.kxiData.kxiRegularTask.dueDateDropdown)
        .first()
        .click();
      this.selectDateAhead();
      this.selectAssigneeUser(assignee);
      this.selectBusinessUnit();
      this.selectCategory();
      cy.intercept("POST", selectPath).as("decision");
      this.clicksOnCreateButton();
      cy.wait("@decision", { timeout: 20000 })
        .its("response.statusCode")
        .should("eq", 200);
    });
  }

  verifyTaskPage() {
    cy.get(locators.regChangeManagementV2.regChangeDashboard.formHeading, {
      timeout: 20000,
    });
    cy.get(locators.regChangeManagementV2.regChangeDashboard.formHeading, {
      timeout: 20000,
    })
      .should("be.visible")
      .and("contain", task.labelTaskTypeValue);
  }

  selectBusinessUnit() {
    cy.get(locators.kxi.kxiData.kxiRegularTask.dropdownArrow)
      .first()
      .click({ force: true });
    cy.get(locators.kxi.kxiData.kxiRegularTask.listofValue).first().click();
  }

  selectCategory() {
    cy.get(locators.kxi.kxiData.kxiRegularTask.dropdownArrow)
      .eq(2)
      .click({ force: true });
    cy.get(locators.kxi.kxiData.kxiRegularTask.listofValue).eq(0).click();
  }

  clicksOnCreateButton() {
    cy.get(locators.kxi.kxiData.kxiRegularTask.createButton).click();
  }

  selectAssigneeUser(assignee) {
    cy.get(locators.kxi.kxiData.kxiRegularTask.assigneeInput)
      .type(assignee, {
        delay: 220,
      })
      .type("{Enter}");
  }

  selectDateAhead() {
    // Find today's date element
    cy.get(locators.kxi.kxiData.kxiRegularTask.todayDate).then(
      (todayElement) => {
        // Get today's date
        const todayDate = parseInt(
          todayElement.attr(
            locators.kxi.kxiData.kxiRegularTask.dateFieldAttribute
          )
        );

        const futureDateOffset = 10; // Adjust the number of days to add
        const totalDaysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate(); // Get total days in the current month

        let futureDate = todayDate + futureDateOffset;

        // If futureDate exceeds total days in the current month
        if (futureDate > totalDaysInMonth) {
          // Calculate new date for the next month
          const nextMonthDate = futureDate - totalDaysInMonth;

          // Move to next month
          cy.get(locators.kxi.kxiData.kxiRegularTask.nextArrowButton).click();
          const newDateSelector =
            locators.kxi.kxiData.kxiRegularTask.dateCell.replace(
              "{{date}}",
              nextMonthDate
            );

          // Wait and ensure the element is visible
          cy.get(newDateSelector)
            .should("be.visible")
            .then(($el) => {
              if ($el.length > 1) {
                cy.log("More than one date found, selecting the second one.");
                cy.wrap($el).eq(1).click(); // Select second occurrence
              } else if ($el.length === 1) {
                cy.log("Only one date found, clicking the only one.");
                cy.wrap($el).click();
              } else {
                cy.log("No date found!");
              }
            });
        } else {
          // If futureDate is within the current month
          const futureDateSelector =
            locators.kxi.kxiData.kxiRegularTask.dateCell.replace(
              "{{date}}",
              futureDate
            );

          // Wait and ensure the element is visible
          cy.get(futureDateSelector)
            .should("be.visible")
            .then(($el) => {
              if ($el.length > 1) {
                cy.log("More than one date found, selecting the second one.");
                cy.wrap($el).eq(1).click(); // Select second occurrence
              } else if ($el.length === 1) {
                cy.log("Only one date found, clicking the only one.");
                cy.wrap($el).click();
              } else {
                cy.log("No date found!");
              }
            });
        }
      }
    );
  }
  waitForTaskSummaryPageToAppear() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.contains("label", task.labelTaskTypeValue, {
        timeout: 50000,
      })
        .scrollIntoView()
        .should("exist");
    });
  }


  verifyTaskAndStatusOfTaskDecision() {
    cy.intercept("POST", getAll).as("element");

    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      this.verifyLabelsOfRegularTaskSummary();
      // this.verifyStatusInProgressOnClickingStartProgressButton();
      // this.verifyStatusOpenOnClickingStopProgressButton();
      // this.verifyStatusCloseOnClickingCloseButton();
      // this.verifyStatusReopenOnClickingReopenButton();
      // this.verifyStatusClosedWhenStatusOpen();
    });
  }

  waitForGridLoad() {
    cy.intercept("POST", apiURL).as("loadGrid");
    cy.wait("@loadGrid", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  waitForFormLoad() {
    cy.intercept("POST", formURL).as("loadGrid");
    cy.wait("@loadGrid", { timeout: 100000 })
      .its("response.statusCode")
      .should("eq", 200);
  }

  shouldVerifyLinkedKXIDefinition(kxiDefinition) {
    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.get(
        locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
          .linkedKXISectionLabel
      )
        .scrollIntoView()
        .should("exist")
        .and("be.visible")
        .and("include.text", "Linked KXI");
      cy.get(
        locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
          .linkedKXIDefinitionLink
      )
        .scrollIntoView()
        .should("exist");
    });
  }

  shouldClicksOnKxiDefinitionLink() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.url().then((initialUrl) => {
        // Extract query parameters
        const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
        // Extract 'kxiDefId' from the URL
        const dynamicKriDefinitionId = urlParams.get("kxiDefId");

        const newUrl = `https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid?kriDefinitionId=${dynamicKriDefinitionId}`;

        cy.visit(newUrl);
      });
    });
  }

  shouldClicksOnEnterDataLink() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.url().then((initialUrl) => {
        // Extract query parameters
        const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
        // Extract 'kxiDefId' from the URL
        const dynamicKriDefinitionId = urlParams.get("kxiDefIds");

        const newUrl = `https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid?kriDefinitionIds=${dynamicKriDefinitionId}`;

        cy.visit(newUrl);
      });
    });
  }

  verifyLabelExistance(labelLocators) {
    labelLocators.forEach((label) => {
      cy.contains("label", label, { timeout: 15000 })
        .scrollIntoView()
        .should("exist");
    });
  }

  performActionAndVerifyStatus(buttonLabel, expectedLabel) {
    cy.contains("button", buttonLabel, { timeout: 20000 })
      .scrollIntoView()
      .click();
    cy.contains("label", expectedLabel, { timeout: 20000 })
      .scrollIntoView()
      .should("exist");
  }

  verifyLabelsOfRegularTaskSummary() {
    const labels = [
      task.labelForHeadingTaskSummaryPage,
      task.labelStatusNewValue,
      task.labelAssigneeTypeValue,
      task.labelPriorityValue,
      task.labelCategoryValue,
    ];
    cy.wait("@element", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
    this.verifyLabelExistance(labels);
  }

  verifyStatusInProgressOnClickingStartProgressButton() {
    this.performActionAndVerifyStatus(
      task.labelStartProgressButtonLabel,
      task.labelStatusInProgressValue
    );
  }

  verifyStatusOpenOnClickingStopProgressButton() {
    this.performActionAndVerifyStatus(
      task.labelStopProgressButtonLabel,
      task.labelStatusOpenValue
    );
  }

  verifyStatusCloseOnClickingCloseButton() {
    this.performActionAndVerifyStatus(
      task.labelStartProgressButtonLabel,
      task.labelStatusInProgressValue
    );

    this.performActionAndVerifyStatus(
      task.labelCloseButtonLabel,
      task.labelStatusCloseValue
    );
  }

  verifyStatusReopenOnClickingReopenButton() {
    this.performActionAndVerifyStatus(
      task.labelReopenButtonLabel,
      task.labelStatusInProgressValue
    );
  }

  verifyStatusClosedWhenStatusOpen() {
    this.performActionAndVerifyStatus(
      task.labelStopProgressButtonLabel,
      task.labelStatusOpenValue
    );
    this.performActionAndVerifyStatus(
      task.labelCloseButtonLabel,
      task.labelStatusCloseValue
    );
  }
}
