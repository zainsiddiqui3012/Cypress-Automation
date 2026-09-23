import locators from "../../../../fixtures/locators.json";
import KXI_POM from "../KxI_POM";
import dayjs from "dayjs";
import recurrenceFile from "../../../../fixtures/KXIModule/Recurrence.json";

const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";
const mainURL = Cypress.env("MAIN_URL");
const apiURL = Cypress.env("DECISION_GRID_LOAD");
const formURL = Cypress.env("DECISION_API_FORMLOAD");
const startDate = dayjs().format("M/D/YYYY");
const endDate = dayjs().add(2, "year").format("M/D/YYYY");
const TIMEOUT_SHORT = 3000;
const selectPath = Cypress.env("DECISION_API_SELECTPATH");
export default class KXIRecurrence {
  kxi = new KXI_POM();

  /**Filling the Recurrence Task Field in Update task Edit form
   * On Update task Summary form and Validate their correctly
   * displaying values
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   */
  fillRecurrence(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    const saveAndVerify = (verifyMessage) => {
      this.clickSave();
      this.waitForGridLoad(); // wait for grid load in decision for locating elements
      this.verifyField(recurrenceFile.recurrence, type);
      this.verifyField(recurrenceFile.recurData, verifyMessage);
    };

    const setFieldValues = (fields) => {
      fields.forEach(({ field, value }) => {
        if (value !== null && field !== recurrenceFile.recurWeek) {
          this.fillField(field, value);
        }
        if (field === recurrenceFile.recurWeek) {
          this.selectDay(field, value);
        }
      });
    };

    const recurrenceData = {
      Daily: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
        message: `Recur Every ${recurEvery} day(s).  Start Date:${startDate}.Total Occurences of task(s): ${Occurrences}`,
      },
      Weekly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
          { field: recurrenceFile.recurWeek, value: day },
        ],

        endMethod: () => this.setEndByDate(),
        message: `Recur Every ${recurEvery} week(s) on ${day}. Start Date:${startDate}. End Date: ${endDate}`,
      },
      Monthly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.dayOfMonthField, value: dayMonth },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
        message: `Recur Every ${recurEvery} month(s) on day ${dayMonth}. Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      "Bi-yearly": {
        fields: [{ field: recurrenceFile.startDate, value: startDate }],
        endMethod: () => this.setEndByOccurrences(Occurrences),
        message: `Recur Bi-yearly. Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      Yearly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
        message: `Recur Every ${recurEvery} year(s). Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      MultipleDays: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.recurWeek, value: day },
          { field: recurrenceFile.recurWeek, value: day1 },
          { field: recurrenceFile.recurWeek, value: day2 },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByDate(),
        message: `Recur Every ${recurEvery} week(s) on ${day}, ${day1}, ${day2}. Start Date:${startDate}. End Date: ${endDate}`,
      },
    };

    this.selectRecurrenceType(type);
    const data = recurrenceData[type] || recurrenceData.MultipleDays;
    setFieldValues(data.fields);
    if (data.endMethod) data.endMethod();
    saveAndVerify(data.message);
  }
  /**Search Definition on Grid
   * click Task Id from manual Data Entry Column
   * Navigate to Summary form
   * Click Edit button
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   */
  navigateToSummaryForm(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    cy.readFile(writeDataFilePath).then((file) => {
      this.kxi.searchKxiDefinitionOnGrid(file.kxiName);
      this.editRecurrenceOnSummaryForm(
        file.kxiName,
        type,
        recurEvery,
        Occurrences,
        day,
        dayMonth,
        day1,
        day2
      );
    });
  }

  /**  Navigate to Summary form
   * Click Edit button
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   * */
  editRecurrenceOnSummaryForm(
    kxiName,
    type,
    recurEvery,
    Occurrences,
    day,
    dayMonth,
    day1,
    day2
  ) {
    cy.get(locators.kxi.updateTask.nameKxi)
      .contains(kxiName)
      .parents("div[role='row']")
      .within(() => {
        cy.get(locators.kxi.updateTask.taskLink)
          .invoke("attr", "href")
          .then((href) => {
            const fullUrl = href.startsWith("http")
              ? href
              : `${mainURL}${href}`;
            cy.visit(fullUrl);
          });
      });

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.decisionUnlink, { timeout: 50000 })
        .contains(recurrenceFile.editText)
        .click({ force: true });
      this.fillRecurrence(
        type,
        recurEvery,
        Occurrences,
        day,
        dayMonth,
        day1,
        day2
      );
    });
  }
  /**Get day field locator
   * Enter Input
   *  @param {String} field Get the label name of field
   * @param {String} value Input in Field
   */
  fillField(field, value) {
    cy.contains("label", field)
      .scrollIntoView()
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.decisionInput)
      .clear({ force: true })
      .type(value, { force: true })
      .type("{Enter}");
  }

  selectDay(field, value) {
    cy.contains("label", field)
      .scrollIntoView()
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.childTask.dayLocator)
      .contains(value)
      .click();
  }
  /**Get 'Occurences' Radio button  field locator
   * Click it
   *  @param {String} Occurrences input value
   *
   */

  setEndByOccurrences(Occurrences) {
    cy.contains("label", recurrenceFile.end)
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.childTask.inputAfterOcurrences)
      .click({ force: true });
    this.fillField(recurrenceFile.occurencesField, Occurrences);
  }

  /**Get 'On Date' Radio button  field locator
   * Click it
   */
  setEndByDate() {
    cy.contains("label", recurrenceFile.end)
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.childTask.inputOnDate)
      .click({ force: true });
    this.fillField(recurrenceFile.endDate, endDate);
  }

  /**Get Recurrence Input  field locator
   * Click it
   *  @param {String} type input value
   */
  selectRecurrenceType(type) {
    cy.get(locators.kxi.decisionTask.recurrenceInput,{timeout:50000})
      .type(type)
      .type("{Enter}");
  }
  /**Verify Recurrence and Recurrence Data
   * On Summary Form
   *  @param {String} field Get the name of Fields on  Summary form
   *  @param {String} expectedValue Get the value of Fields on  Summary form
   */

  verifyField(field, expectedValue) {
    cy.contains("label", field)
      .closest("section")
      .next("section")
      .find("label", { timeout: 50000 })
      .invoke("text")
      .then((actualValue) => {
        // Normalize both actual and expected values by removing extra spaces
        const normalizeWhitespace = (str) => {
          // Remove spaces around colons and other unnecessary spaces
          return str
            .replace(/\s*(:|\.|,)\s*/g, "$1")
            .replace(/\s+/g, " ")
            .trim();
        };

        expect(normalizeWhitespace(actualValue)).to.equal(
          normalizeWhitespace(expectedValue)
        );
      });
  }

  /**Click Save Button
   * on Edit Form
   * After navigating to Summary Form
   */
  clickSave() {
    cy.contains("button", recurrenceFile.saveText).click();
  }

  /**Intercept when user change Recurrence
   * From Edit form and click save button
   * Wait for loading grid on Summary form
   */
  waitForGridLoad() {
    cy.intercept("POST", apiURL).as("loadGrid");
    cy.wait("@loadGrid", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", recurrenceFile.response);
  }

  waitForFormLoad() {
    cy.intercept("POST", formURL).as("loadGrid");
    cy.wait("@loadGrid", { timeout: 100000 })
      .its("response.statusCode")
      .should("eq", recurrenceFile.response);
  }
  /**Navigate to definition Screen
   * Open kxi Update Task modal
   * Select owner and definition
   * Click "Create" button
   * Navigate to KXI Update Task Creation form
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   */
  recurrenceTask(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    this.kxi.navigateToKxiDefAndOpenTaskModal();

    this.kxi.verifyUpdateTaskModal();

    this.kxi.verifySingleOwner();
    cy.readFile(writeDataFilePath).then((file) => {
      this.createTaskEithRecurrence(
        file.kxiName,
        type,
        recurEvery,
        Occurrences,
        day,
        dayMonth,
        day1,
        day2
      );
    });
  }
  /**Navigate to KXI Update Task Creation form
   * Create Update task by filling mandatory
   * And Recurrence fields
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   */
  createTaskEithRecurrence(
    kxiName,
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    cy.get(locators.kxi.updateTask.kxiDropdown, { timeout: 100000 })
      .should("be.enabled")
      .click();
    cy.wait(TIMEOUT_SHORT);
    cy.get(locators.kxi.updateTask.kxiOptions)
      .contains(kxiName)
      .click({ force: true });

    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");

      cy.get(locators.kxi.updateTask.createButton).click();

      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          cy.log("Captured new tab URL:", newTabUrl);

          const finalURL = mainURL + newTabUrl;

          cy.visit(finalURL);

          cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
            () => {
              const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
              const taskName = "kxi Update Task";

              cy.get(locators.kxi.decisionTask.summary, { timeout: 20000 })
                .eq(0)
                .type(taskName);
              cy.get(locators.kxi.decisionTask.summary).eq(0).type(timeStamp);
              const finalName = taskName + timeStamp;

              cy.readFile(taskFilePath).then((file) => {
                file.taskName = finalName;
                cy.writeFile(taskFilePath, file);
              });
              this.fillRecurrenceInCreationForm(
                type,
                recurEvery,
                Occurrences,
                day,
                dayMonth,
                day1,
                day2
              );
              cy.intercept("POST", selectPath).as("decision");

              cy.get(locators.kxi.decisionTask.createButton).click();
              cy.wait("@decision", { timeout: 100000 })
                .its("response.statusCode")
                .should("eq", recurrenceFile.response);
            }
          );
        });
    });
  }
  /**fill Recurrence Fields according to Recurrence type
   *  @param {String} type Input Recurrence type
   *  @param {number} recurEvery Input How much after time it Recur
   * @param {number} Occurrences Input Occurences after clicking After Occurences radio button
   * @param {String} day Select day of Weekly Recurrence
   * @param {String} dayMonth Input Day of month of Monthly Recurrence
   * @param {String} day1 Select multiple days of Weekly Recurrence
   * @param {String} day2 Select multiple days of Weekly Recurrence
   */
  fillRecurrenceInCreationForm(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    const setFieldValues = (fields) => {
      fields.forEach(({ field, value }) => {
        if (value !== null && field !== recurrenceFile.recurWeek) {
          this.fillField(field, value);
        }
        if (field === recurrenceFile.recurWeek) {
          this.selectDay(field, value);
        }
      });
    };

    const recurrenceData = {
      Daily: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
      },
      Weekly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
          { field: recurrenceFile.recurWeek, value: day },
        ],

        endMethod: () => this.setEndByDate(),
      },
      Monthly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.dayOfMonthField, value: dayMonth },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
      },
      "Bi-yearly": {
        fields: [{ field: recurrenceFile.startDate, value: startDate }],
        endMethod: () => this.setEndByOccurrences(Occurrences),
      },
      Yearly: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
        ],
        endMethod: () => this.setEndByOccurrences(Occurrences),
      },
      MultipleDays: {
        fields: [
          { field: recurrenceFile.recurEveryField, value: recurEvery },
          { field: recurrenceFile.startDate, value: startDate },
          { field: recurrenceFile.recurWeek, value: day },
          { field: recurrenceFile.recurWeek, value: day1 },
          { field: recurrenceFile.recurWeek, value: day2 },
        ],
        endMethod: () => this.setEndByDate(),
      },
    };
    this.selectRecurrenceType(type);
    const data = recurrenceData[type] || recurrenceData.MultipleDays;
    if (data.endMethod) data.endMethod();
    setFieldValues(data.fields);
  }
  /**Validate Recurrence Fields on KXI Update Task Summary form
   *  @param {String} type  Recurrence type
   *  @param {number} recurEvery  How much after time it Recur
   * @param {number} Occurrences  Occurences after clicking After Occurences radio button
   * @param {String} day day of Weekly Recurrence
   * @param {String} dayMonth  Day of month of Monthly Recurrence
   * @param {String} day1  multiple days of Weekly Recurrence
   * @param {String} day2 multiple days of Weekly Recurrence
   */
  validateRecurrence(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    const saveAndVerify = (verifyMessage) => {

      this.waitForFormLoad(); // wait for form load in decision

      this.verifyField(recurrenceFile.recurrence, type);
      this.verifyField(recurrenceFile.recurData, verifyMessage);
    };

    const recurrenceData = {
      Daily: {
        message: `Recur Every ${recurEvery} day(s).  Start Date:${startDate}.Total Occurences of task(s): ${Occurrences}`,
      },
      Weekly: {
        message: `Recur Every ${recurEvery} week(s) on ${day}. Start Date:${startDate}. End Date: ${endDate}`,
      },
      Monthly: {
        message: `Recur Every ${recurEvery} month(s) on day ${dayMonth}. Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      "Bi-yearly": {
        message: `Recur Bi-yearly. Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      Yearly: {
        message: `Recur Every ${recurEvery} year(s). Start Date:${startDate}. Total Occurrences of task(s): ${Occurrences}`,
      },
      MultipleDays: {
        message: `Recur Every ${recurEvery} week(s) on ${day}, ${day1}, ${day2}. Start Date:${startDate}. End Date: ${endDate}`,
      },
    };

    const data = recurrenceData[type] || recurrenceData.MultipleDays;
    saveAndVerify(data.message);
  }

  /**Validate Recurrence Fields on KXI Update Task Summary form
   *   @param {String} kxiName Name of kxi Definition which will be taken from write file
   *  @param {String} type  Recurrence type
   *  @param {number} recurEvery  How much after time it Recur
   * @param {number} Occurrences  Occurences after clicking After Occurences radio button
   * @param {String} day day of Weekly Recurrence
   * @param {String} dayMonth  Day of month of Monthly Recurrence
   * @param {String} day1  multiple days of Weekly Recurrence
   * @param {String} day2 multiple days of Weekly Recurrence
   */
  validateRecurrenceOnSummaryForm(
    kxiName,
    type,
    recurEvery,
    Occurrences,
    day,
    dayMonth,
    day1,
    day2
  ) {
    cy.get(locators.kxi.updateTask.nameKxi, { timeout: 50000 })
      .should("be.visible")
      .contains(kxiName)
      .parents("div[role='row']")
      .within(() => {
        cy.get(locators.kxi.updateTask.taskLink)
          .as("taskLink")
          .invoke("attr", "href")
          .then((href) => {
            const fullUrl = href.startsWith("http")
              ? href
              : `${mainURL}${href}`;

            cy.get("@taskLink").invoke("removeAttr", "target").first().click();

            cy.visit(fullUrl);
          });
      });

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      this.validateRecurrence(
        type,
        recurEvery,
        Occurrences,
        day,
        dayMonth,
        day1,
        day2
      );
    });
  }
  /**Navigate to definition Screen
   * Search definition in Grid
   * Click Task Id  from Manual Data Entry Column
   * Navigate to Summary Screen
   * To Validate Correctly displaying Values
   *  @param {String} type  Recurrence type
   *  @param {number} recurEvery  How much after time it Recur
   * @param {number} Occurrences  Occurences after clicking After Occurences radio button
   * @param {String} day day of Weekly Recurrence
   * @param {String} dayMonth  Day of month of Monthly Recurrence
   * @param {String} day1  multiple days of Weekly Recurrence
   * @param {String} day2 multiple days of Weekly Recurrence
   */
  navigateToSummaryFormAfterCreation(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.visitkxiDef();
      this.kxi.searchKxiDefinitionOnGrid(file.kxiName);
      this.kxi.verifyKXIDefinitionOnGrid();
      this.validateRecurrenceOnSummaryForm(
        file.kxiName,
        type,
        recurEvery,
        Occurrences,
        day,
        dayMonth,
        day1,
        day2
      );
    });
  }
  /**Helper Funtion
   * For Creating kxi definition
   * For Creating Recurring Update Task
   * For Validating values on Summary Form
   *  @param {String} type  Recurrence type
   *  @param {number} recurEvery  How much after time it Recur
   * @param {number} Occurrences  Occurences after clicking After Occurences radio button
   * @param {String} day day of Weekly Recurrence
   * @param {String} dayMonth  Day of month of Monthly Recurrence
   * @param {String} day1  multiple days of Weekly Recurrence
   * @param {String} day2 multiple days of Weekly Recurrence
   */
  recurrenceValidation(
    type,
    recurEvery,
    Occurrences = null,
    day = null,
    dayMonth = null,
    day1 = null,
    day2 = null
  ) {
    cy.fixture("KXIModule/kxiValues.json").then((data) => {
      cy.visitkxiDef();
      this.kxi.addKxiDefinition(
        data.kxiValue,
        data.Left1,
        data.Left2,
        data.Left3,
        data.Right1,
        data.Right2,
        data.Right3
      );
    });
    this.recurrenceTask(
      type,
      recurEvery,
      Occurrences,
      day,
      dayMonth,
      day1,
      day2
    );
    this.navigateToSummaryFormAfterCreation(
      type,
      recurEvery,
      Occurrences,
      day,
      dayMonth,
      day1,
      day2
    );
  }
}
