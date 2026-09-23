import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";

class FeedRegister {
  regLocator = locators.regChangeManagementV2.feedRegister;

  /**
   * Verify heading of Feed Register screen
   * * @param {String} name is heading name
   */
  verifyFeedHeading(name) {
    cy.get(this.regLocator.heading, {
      timeout: Cypress.env("waits").longWait,
    }).should("contain", name);
  }
  /**
   * Verify AG grid Columns
   * By scrolling right
   * Verify columns from Column picker
   */
  verifyAgGridAndColumns() {
    cy.get(this.regLocator.agGrid.gridID).should("be.visible");
    dataFile.columns.forEach((column) => {
      cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("right");
      cy.get(this.regLocator.columnLocator)
        .should("be.visible")
        .should("contain", column);
    });
    cy.get(locators.kxi.kxiData.columnPicker).should("be.visible").click();

    dataFile.columns.forEach((column) => {
      cy.get(this.regLocator.agGrid.columnPickerLocator).should(
        "contain",
        column
      );
    });
  }
  /**
   * Verify AG grid Filters
   * Verify filters from filter picker
   */
  verifyAgGridFilters() {
    cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("left");
    cy.get(this.regLocator.agGrid.filterLocator).should("be.visible");
    cy.get(this.regLocator.agGrid.filterPicker).should("be.visible").click();
    dataFile.columns.forEach((column) => {
      cy.get(this.regLocator.agGrid.filterPickerItems).should(
        "contain",
        column
      );
    });
  }
  /**
   * Verify General filter dopdown
   * And its values
   */
  verifyGeneralFilters(generalFilters) {
    cy.get(this.regLocator.generalFilter).should(
      "have.text",
      dataFile.generalFilters[0]
    );

    cy.get(this.regLocator.generalFilter).click();
    cy.get(this.regLocator.generalFilterInput).contains(generalFilters).click();
  }
  /**
   * Verify Column filter types
   * By input type
   */
  verifyFilterTypes() {
    cy.get(this.regLocator.agGrid.gridLabel, {
      timeout: Cypress.env("waits").longWait,
    }).each(($header) => {
      const columnName = $header.text().trim();

      if (dataFile.expectedFilters[columnName]) {
        // Click to activate the filter UI
        cy.wrap($header).click({ force: true });

        // Verify filter type by checking the correct selector
        cy.get(this.regLocator.filterBody) // Ensure filter UI is visible
          .find(dataFile.expectedFilters[columnName])
          .should(
            "exist",
            `Filter type for ${columnName} should match expected type`
          );
      }
    });
  }

  /**
   * Search title in AG grid
   * Execute query on the basis of Search title
   *  @param {Array} title The title values fetch from database table
   */

  searchTitleInGrid(title) {
    cy.waitForLoaderToDisappear("agGrid", Cypress.env("waits").longWait);
    cy.get(this.regLocator.agGrid.titleSearch, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 600 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 600 })
      .type(title, { delay: 250 });
    //   const query = dataFile.getDocumentData;

    //   cy.query(query, [title], (error, results) => {
    //     if (error) {
    //       console.error("Query error", error);
    //     } else {
    //       console.log("Query results", results);
    //     }
    //   }).as("dbData");
  }
  clearTitleInGrid() {
    cy.waitForLoaderToDisappear("agGrid", Cypress.env("waits").longWait);
    cy.get(this.regLocator.agGrid.titleSearch, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 600 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 600 });
  }
  /**
   * Get the rows of AG grid
   */
  getGridRows() {
    cy.waitForLoaderToDisappear("agGrid", Cypress.env("waits").longWait);
    return cy.get(this.regLocator.agGrid.gridRow, {
      timeout: Cypress.env("waits").longWait,
    });
  }

  /**
   * Match the AG grid values with
   * Database table values
   * @param {String} row AG grid row
   *  @param {String} dbRow Database table row
   */
  verifyRowData(row, dbRow) {
    cy.wrap(row, { timeout: Cypress.env("waits").longWait }).then(($row) => {
      cy.get(this.regLocator.agGrid.titleColumn, {
        timeout: Cypress.env("waits").longWait,
      }).should("contain", dbRow.title.trim());

      cy.get(this.regLocator.agGrid.categoryColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should(($el) => expect($el.text().trim()).to.contain(dbRow.category));

      cy.get(this.regLocator.agGrid.jurisdictionColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should(($el) =>
        expect($el.text().trim()).to.contain(dbRow.jurisdiction)
      );

      cy.get(this.regLocator.agGrid.summaryTextColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should(($el) =>
        expect($el.text().trim()).to.contain(dbRow.summary_text)
      );

      cy.get(this.regLocator.agGrid.publicationDateColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should("contain", dbRow.publicationDate);

      cy.get(this.regLocator.agGrid.updatedDateColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should("contain", dbRow.updatedDate);

      cy.get(this.regLocator.agGrid.officialIdColumn, {
        timeout: Cypress.env("waits").mediumWait,
      })
        .contains(dbRow.official_id)
        .scrollIntoView()
        .should(($el) =>
          expect($el.text().trim()).to.contain(dbRow.official_id)
        );

      cy.get(this.regLocator.agGrid.regulatorColumn, {
        timeout: Cypress.env("waits").mediumWait,
      })
        .contains(dbRow.regulator_code)
        .scrollIntoView()
        .should("contain", dbRow.regulator_code);

      cy.get(this.regLocator.agGrid.statusColumn, {
        timeout: Cypress.env("waits").mediumWait,
      }).should("contain", dbRow.STATUS);
    });
  }
  /**
   * Match grid data with database data
   * */
  fetchDBData() {
    this.getGridRows()
      .should("exist")
      .then(($rows) => {
        cy.get("@dbData").then((dbData) => {
          expect($rows.length).to.equal(dbData.length);

          // Use cy.wrap() with timeout to ensure correct re-querying of rows
          cy.wrap($rows, { timeout: 10000 }).each((row, index) => {
            const dbRow = dbData[index];
            // Make sure row data is verified properly
            this.verifyRowData(row, dbRow);
          });
        });
      });
  }
  /**
   * Verify kaia icon button is present in the grid
   * By scrolling right
   * Verify on clicking kaia
   * chat window should be opened
   * */

  verifyChatWindow() {
    cy.get(this.regLocator.agGrid.scrollGrid, {
      timeout: Cypress.env("waits").mediumWait,
    }).scrollTo("right");

    cy.get(this.regLocator.kaiaLink, { timeout: 20000 })
      .should("be.visible")
      .then(($el) => {
        console.log("Kaia button found:", $el);
        cy.wrap($el).click({ force: true });
      });

    cy.get(this.regLocator.chatWindow).should("be.visible");
  }

  /**
   * Verifies that the Dismiss and Resume buttons are visible and in a disabled state.
   * Useful for checking UI state before enabling actions.
   */
  verifyDismissResumeButtons() {
    cy.contains("a", dataFile.dismissBtnText)
      .should("be.visible")
      .and("have.class", "disabled");

    cy.get(this.regLocator.takeAction.resumeBtn, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .should("be.disabled");
    cy.get(this.regLocator.takeAction.takeActionBtn)
      .should("be.visible")
      .should("be.enabled");
    cy.get(this.regLocator.takeAction.updateBtn)
      .should("be.visible")
      .should("be.disabled");
  }

  /**
   * Selects the first checkbox in the feed and clicks the Dismiss button.
   * Used to initiate a dismissal action from the UI.
   */
  dismissFeed() {
    cy.get(this.regLocator.agGrid.checkBoxes).first().check();
    cy.contains("a", dataFile.dismissBtnText).should("be.visible").click();
  }

  /**
   * Enters a reason in the dismissal reason textbox, submits it,
   * verifies the success toast message, reloads the page, and
   * re-initiates the search using the first title from the data file.
   *
   * @param {string} reasonText - The reason for dismissal.
   * @param {string} successMessge - The expected success message text.
   */
  enterReason(reasonText, successMessge) {
    cy.get(this.regLocator.reasonText).type(reasonText);
    cy.get(this.regLocator.submitButton).click();
    cy.verifyToastMessageContains(successMessge, 3000);
    cy.reload();
    this.searchTitleInGrid(dataFile.title[0]);
  }

  /**
   * Applies the "Dismiss" filter from the general filters,
   * scrolls to the right to verify the status,
   * then scrolls back left and clicks the first available Resume button.
   */
  selectDismissFromGeneralFilter() {
    this.verifyGeneralFilters(dataFile.generalFilters[3]);
    cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("right");
    this.verifyStatus(dataFile.generalFilters[3]);
    cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("left");
    cy.get(this.regLocator.takeAction.takeActionBtn, {
      timeout: Cypress.env("waits").longWait,
    })
      .should("be.visible")
      .should("be.disabled");
    cy.get(this.regLocator.takeAction.resumeBtn, {
      timeout: Cypress.env("waits").longWait,
    })
      .eq(0)
      .should("be.visible")
      .should("be.enabled")
      .click();
  }

  /**
   * Enters a reason in the resume reason textbox, submits it,
   * verifies the success toast message, reloads the page, and
   * checks the updated status in the grid.
   *
   * @param {string} reasonText - The reason for resuming.
   * @param {string} successMessge - The expected success message text.
   */
  enterResumeReason(reasonText, successMessge) {
    cy.get(this.regLocator.resumeReasonText).type(reasonText);
    cy.get(this.regLocator.resumeSubmitButton).click();
    cy.verifyToastMessageContains(successMessge, 3000);
    cy.reload();
    cy.get(this.regLocator.agGrid.scrollGrid).scrollTo("right");
    this.verifyStatus(dataFile.generalFilters[0]);
  }

  /**
   * Verifies that the status column in the grid contains the expected status text.
   *
   * @param {string} status - The status text to verify.
   */
  verifyStatus(status) {
    cy.get(this.regLocator.agGrid.statusColumn, {
      timeout: Cypress.env("waits").longWait,
    }).should("contain", status);
  }

  /**
   * Verifies the visibility of the "Kaia" column in the AG Grid header.
   *
   * @param {boolean} [isExist=true] - Set to `true` to check if the column exists, or `false` to verify it does not exist.
   */
  isKaiaColumnVisible(isExist = true) {
    const headerSelector = this.regLocator.agGrid.gridHeaderList;

    if (isExist) {
      cy.get(headerSelector).contains("Kaia").should("exist");
    } else {
      cy.get(headerSelector).contains("Kaia").should("not.exist");
    }
  }
}
export default FeedRegister;
