import locators from "../../../../fixtures/locators.json";
import dayjs from "dayjs";
const taskFilePath = "cypress/fixtures/KXIModule/KXIChildTask.json";
export default class KXIChildTask {
  createChildTaskForm(assignee) {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      this.verifyMoreOptions();

      const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
      const taskName = "kxi Child Task";
      cy.get(locators.kxi.kxiData.kxiRegularTask.summaryField, {
        timeout: 10000,
      }).type(taskName);
      cy.get(locators.kxi.kxiData.kxiRegularTask.summaryField).type(timeStamp);

      const finalName = taskName + timeStamp;

      //Saving entered Summary of Child task in json file
      cy.readFile(taskFilePath).then((file) => {
        file.taskName = finalName;
        cy.writeFile(taskFilePath, file);
      });
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
      this.clicksOnCreateButton();
      cy.get(locators.kxi.decisionTask.childTask.arrow, {
        timeout: 50000,
      }).should("exist");
    });
  }

  verifyMoreOptions() {
    cy.get(locators.kxi.decisionTask.childTask.morePlaceholder, {
      timeout: 80000,
    }).type("Create Child Task");
    cy.get(locators.kxi.decisionTask.childTask.dataFlowLink, {
      timeout: 5000,
    })
      .eq(0)
      .click({ force: true });
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
    cy.get(locators.kxi.kxiData.kxiRegularTask.listofValue).click();
  }

  clicksOnCreateButton() {
    cy.get(locators.kxi.kxiData.kxiRegularTask.createButton).click();
  }

  selectAssigneeUser(assignee) {
    cy.get(locators.kxi.kxiData.kxiRegularTask.assigneeInput).type(assignee, {
      delay: 200,
    });

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
}
