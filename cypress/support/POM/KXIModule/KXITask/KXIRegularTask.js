import locators from "../../../../fixtures/locators.json";
import KXIRegularTasks from "../../../../fixtures/KXIModule/KXIRegularTasks.json";
import "cypress-file-upload";
import dayjs from "dayjs";
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";

export default class KXIRegularTask {
  createRegularTaskForm(summary, assignee, kxiTaskDashboard = false) {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      this.verifyRegularTaskPage(kxiTaskDashboard);
      cy.get(locators.kxi.kxiData.kxiRegularTask.summaryField, {
        timeout: 50000,
      }).type(summary);
      cy.get(locators.kxi.kxiData.kxiRegularTask.priorityArrow).click();
      cy.get(locators.kxi.kxiData.kxiRegularTask.priorityValueMedium).click();
      cy.get(locators.kxi.kxiData.kxiRegularTask.dueDateDropdown)
        .first()
        .click();
      this.selectDateAhead();
      this.selectAssigneeUser(assignee);
      this.selectBusinessUnit();
      this.shouldHaveLengthOne();
      this.selectCategory();

      // Set up intercept and log the URL being used
      const decisionApiUrl = Cypress.env("DECISION_API_SELECTPATH");
      const actualUrl =
        typeof decisionApiUrl === "function"
          ? decisionApiUrl()
          : decisionApiUrl;

      // Use a more flexible pattern to catch the request
      cy.intercept("POST", "**/API/FormService/js/SelectPath**").as("decision");

      this.clicksOnCreateButton();
      cy.wait("@decision", { timeout: 50000 }).then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  }

  verifyRegularTaskPage(kxiTaskDashboard = false) {
    cy.get(locators.kxi.kxiData.kxiRegularTask.headingRegularTask, {
      timeout: 60000,
    });
    if (kxiTaskDashboard) {
      cy.contains(KXIRegularTasks.kxiRegularTask);
    } else {
      cy.get(locators.kxi.kxiData.kxiRegularTask.headingRegularTask, {
        timeout: 20000,
      })
        .should("be.visible")
        .and("contain", KXIRegularTasks.createTask);
    }
  }

  shouldHaveLengthOne() {
    cy.get(locators.kxi.kxiData.kxiRegularTask.linkedKxIDefinition)
      .eq(1)
      .should("have.length", "1");
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
    // Save today's date as createdDate in MM/DD/YYYY format
    const todayDate = dayjs().format("MM/DD/YYYY");
    cy.readFile(taskFilePath).then((file) => {
      file.createdDate = todayDate;
      cy.writeFile(taskFilePath, file);
    });

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
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const totalDaysInMonth = new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();
        let futureDate = todayDate + futureDateOffset;

        // If futureDate exceeds total days in the current month
        if (futureDate > totalDaysInMonth) {
          // Calculate new date for the next month
          const nextMonthDate = futureDate - totalDaysInMonth;
          const nextMonth = currentMonth + 1; // Fixed: was currentMonth + 2
          const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
          const adjustedMonth = nextMonth > 11 ? nextMonth - 12 : nextMonth;

          // Create the full date in MM/DD/YYYY format
          const formattedDueDate = `${(adjustedMonth + 1)
            .toString()
            .padStart(2, "0")}/${nextMonthDate
            .toString()
            .padStart(2, "0")}/${nextYear}`;

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
                cy.wrap($el).eq(1).click(); // Select second occurrence
                cy.readFile(taskFilePath).then((file) => {
                  // Save the complete date in MM/DD/YYYY format
                  file.dueDate = formattedDueDate;
                  cy.writeFile(taskFilePath, file);
                });
              } else if ($el.length === 1) {
                cy.wrap($el).click();
                cy.readFile(taskFilePath).then((file) => {
                  // Save the complete date in MM/DD/YYYY format
                  file.dueDate = formattedDueDate;
                  cy.writeFile(taskFilePath, file);
                });
              }
            });
        } else {
          // If futureDate is within the current month
          const formattedDueDate = `${(currentMonth + 1)
            .toString()
            .padStart(2, "0")}/${futureDate
            .toString()
            .padStart(2, "0")}/${currentYear}`;

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
                cy.wrap($el).eq(1).click(); // Select second occurrence
                cy.readFile(taskFilePath).then((file) => {
                  // Save the complete date in MM/DD/YYYY format
                  file.dueDate = formattedDueDate;
                  cy.writeFile(taskFilePath, file);
                });
              } else if ($el.length === 1) {
                cy.wrap($el).click();
                cy.readFile(taskFilePath).then((file) => {
                  // Save the complete date in MM/DD/YYYY format
                  file.dueDate = formattedDueDate;
                  cy.writeFile(taskFilePath, file);
                });
              }
            });
        }
      }
    );
  }
}
