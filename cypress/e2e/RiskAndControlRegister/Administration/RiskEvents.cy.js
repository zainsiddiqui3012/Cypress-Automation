import RiskEvents from "../../../support/POM/RiskAndControlRegister/Administration/RiskEvents";
const FIXTURE_DATA_FILE = "cypress/fixtures/RiskModule/RiskEvents.json";
import TableHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/TableHelper";
//import locators from "../../../cypress/fixtures/locators.json";
import locators from "../../../fixtures/locators.json";

describe(
  "Risk Events Management",
  {
    tags: ["@regression", "@riskevents", "@pd36725", "@predict", "@customer"],
  },
  () => {
    // Constant for fixture data file path
    let testData;

    before(() => {
      // Use cy.readFile() to enable read/write operations on the same file
      cy.readFile(FIXTURE_DATA_FILE).then((data) => {
        testData = data;
      });
    });

    /**
     * Helper method to read fresh data from fixture file
     */
    const readFreshTestData = () => {
      return cy.readFile(FIXTURE_DATA_FILE);
    };

    /**
     * Helper method to write updated data back to fixture file
     * @param {Object} updatedData - The updated test data object
     */
    const writeTestData = (updatedData) => {
      return cy.writeFile(FIXTURE_DATA_FILE, updatedData);
    };

    /**
     * Helper method to update specific test data and save to file
     * @param {string} path - Dot notation path to the data (e.g., 'addRiskEvent.validData.name')
     * @param {any} value - New value to set
     */
    const updateTestDataValue = (path, value) => {
      return cy.readFile(FIXTURE_DATA_FILE).then((data) => {
        // Use lodash-like path setting
        const pathArray = path.split(".");
        let current = data;

        // Navigate to the parent object
        for (let i = 0; i < pathArray.length - 1; i++) {
          if (!current[pathArray[i]]) {
            current[pathArray[i]] = {};
          }
          current = current[pathArray[i]];
        }

        // Set the final value
        current[pathArray[pathArray.length - 1]] = value;

        // Write back to file
        return cy.writeFile(FIXTURE_DATA_FILE, data).then(() => {
          testData = data; // Update local testData as well
          return data;
        });
      });
    };

    context(
      "Add/Create - Positive Cases",
      {
        tags: ["@pd40997"],
      },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitRiskEvent();
          cy.waitForTopMsgLoaderToDisappear(15000);
        });

        it(
          "Add a new risk event with all valid fields",
          {
            tags: ["@smoke", "@pd40997", "@pd41918"],
          },
          () => {
            // Read fresh data from file to ensure latest values
            readFreshTestData().then((freshData) => {
              // Use enhanced method for aonlyutomatic unique naming
              const createdEventData = RiskEvents.createRiskEventWithUniqueName(
                freshData.addRiskEvent.validData
              );

              cy.verifyToastMessageContains("successfully", 10000);
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(createdEventData.name);

              // Store the created event name back to fixture file for future reference
              updateTestDataValue("lastCreatedEvents.validDataEvent", {
                name: createdEventData.name,
                createdAt: new Date().toISOString(),
                testCase:
                  "Should add Risk Event with valid name and description",
              });
            });
          }
        );

        it(
          "Add a risk event with a past Risk Event Date",
          {
            tags: ["@pd41931"],
          },
          () => {
            // Read fresh data from file to ensure latest values
            readFreshTestData().then((freshData) => {
              // Use enhanced method for aonlyutomatic unique naming
              const createdEventData = RiskEvents.createRiskEventWithUniqueName(
                freshData.addRiskEvent.validData,
                freshData.addRiskEvent.previousDate
              );

              cy.verifyToastMessageContains("successfully", 10000);
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(createdEventData.name);

              // Store the created event name back to fixture file for future reference
              updateTestDataValue("lastCreatedEvents.validDataEvent", {
                name: createdEventData.name,
                createdAt: new Date().toISOString(),
                testCase:
                  "Should add Risk Event with valid name and description",
              });
            });
          }
        );

        it(
          "Add a risk event with future Risk Event Date",
          {
            tags: ["@pd41923"],
          },
          () => {
            // Read fresh data from file to ensure latest values
            readFreshTestData().then((freshData) => {
              // Use enhanced method for aonlyutomatic unique naming
              const createdEventData = RiskEvents.createRiskEventWithUniqueName(
                freshData.addRiskEvent.validData,
                freshData.addRiskEvent.futureDate
              );

              cy.verifyToastMessageContains("successfully", 10000);
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(createdEventData.name);

              // Store the created event name back to fixture file for future reference
              updateTestDataValue("lastCreatedEvents.validDataEvent", {
                name: createdEventData.name,
                createdAt: new Date().toISOString(),
                testCase:
                  "Should add Risk Event with valid name and description",
              });
            });
          }
        );

        it(
          "Add a risk event without selecting 'Event Type'",
          {
            tags: ["@pd41925"],
          },
          () => {
            // Read fresh data from file
            readFreshTestData().then((freshData) => {
              // Use enhanced method for automatic unique naming
              const createdEventData = RiskEvents.createRiskEventWithUniqueName(
                freshData.addRiskEvent.nameOnly
              );

              cy.verifyToastMessageContains("successfully", 10000);
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(createdEventData.name);

              // Store the created event name back to fixture file
              updateTestDataValue("lastCreatedEvents.nameOnlyEvent", {
                name: createdEventData.name,
                createdAt: new Date().toISOString(),
                testCase: "Should add Risk Event with name only",
              });
            });
          }
        );

        it(
          "Should cancel action without saving",
          {
            tags: ["@pd41907"],
          },
          () => {
            readFreshTestData().then((freshData) => {
              RiskEvents.clickAddButton();
              cy.wait(1000);
              // Use FormHelper through RiskEvents to fill the form
              RiskEvents.fillRiskEventForm(
                freshData.addRiskEvent.validData,
                freshData.addRiskEvent.validData
              );
              RiskEvents.clickCancelButton();
            });
          }
        );
      }
    );

    context(
      "Edit/Update - Positive Cases",
      {
        tags: ["@pd40998"],
      },
      () => {
        let createdRiskEventData;

        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitRiskEvent();
          cy.waitForTopMsgLoaderToDisappear(15000);

          // Read fresh data from file and create a risk event for editing
          readFreshTestData().then((freshData) => {
            createdRiskEventData = RiskEvents.createRiskEventWithUniqueName(
              freshData.addRiskEvent.validData
            );
            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);

            // Store the created event for editing tests
            updateTestDataValue("currentEditTest.baseEvent", {
              name: createdRiskEventData.name,
              originalData: freshData.addRiskEvent.validData,
              createdAt: new Date().toISOString(),
            });
          });
        });
        it(
          "Edit risk event and remove mandatory field and save",
          {
            tags: ["@pd41906"],
          },
          () => {
            RiskEvents.editRiskEvent(createdRiskEventData.name, {
              eventType: "Meeting",
            });
            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);

            RiskEvents.verifyRiskEventWithDetails({
              name: createdRiskEventData.name,
              eventType: createdRiskEventData.name.eventType,
            });
          }
        );
        it(
          "Edit an existing risk event",
          {
            tags: ["@smoke", "@pd41912"],
          },
          () => {
            // Use DataHelper through RiskEvents to generate unique name
            const uniqueTestData = RiskEvents.createUniqueRiskEventData({
              name: "UpdatedName",
            });

            RiskEvents.editRiskEvent(createdRiskEventData.name, uniqueTestData);
            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);
            RiskEvents.verifyRiskEventInTable(uniqueTestData.name);
          }
        );
        it(
          "Edit only the status of a risk event",
          {
            tags: ["@pd40998", "@pd41910"],
          },
          () => {
            // Find the first event in the table
            RiskEvents.getFirstEventNameFromTable("#riskEvents").then(
              (eventName) => {
                // Open the event for editing
                RiskEvents.clickRiskEventInTable(eventName);
                cy.get(locators.general.riskEventStatus).check({ force: true });
                RiskEvents.clickSaveButton();
                cy.verifyToastMessageContains("successfully", 10000);
                cy.waitForTopMsgLoaderToDisappear(15000);
              }
            );
          }
        );
      }
    );
    context(
      "Negative/Validation Cases",
      {
        tags: ["@pd41000"],
      },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitRiskEvent();
          cy.waitForTopMsgLoaderToDisappear(15000);
        });

        it(
          "Should show validation error when saving with empty name",
          {
            tags: ["@pd41927"],
          },
          () => {
            // Read fresh data from file for current validation messages
            readFreshTestData().then((freshData) => {
              // Use enhanced validation testing method
              RiskEvents.testEmptyNameValidation(
                freshData.addRiskEvent.validData
              );
              RiskEvents.verifyValidationError(
                freshData.validationMessages.saveError
              );
              RiskEvents.verifyFormErrorHighlight();
              RiskEvents.clickCancelButton();

              // Log validation test result to fixture file
              updateTestDataValue("validationTestResults.emptyName", {
                testExecutedAt: new Date().toISOString(),
                testCase:
                  "Should show validation error when saving with empty name",
                expectedError: freshData.validationMessages.saveError,
                result: "passed",
              });
            });
          }
        );

        it(
          "Input long characters in Name",
          {
            tags: ["@pd41000"],
          },
          () => {
            readFreshTestData().then((freshData) => {
              // Use enhanced validation testing method for long names
              RiskEvents.testLongNameValidation(
                freshData.addRiskEvent.validData,
                255
              );
              RiskEvents.verifyValidationError(
                freshData.validationMessages.saveError
              );
              RiskEvents.verifyFormErrorHighlight();
              RiskEvents.clickCancelButton();

              // Log validation test result
              updateTestDataValue("validationTestResults.longName", {
                testExecutedAt: new Date().toISOString(),
                testCase:
                  "Should show validation error when name exceeds 255 characters",
                maxLength: 255,
                expectedError: freshData.validationMessages.saveError,
                result: "passed",
              });
            });
          }
        );

        it(
          "Should show error for duplicate event name",
          {
            tags: ["@pd41000", "@pd41912"],
          },
          () => {
            // Use enhanced data helper for creating unique test data
            const firstEventData = RiskEvents.createUniqueRiskEventData(
              testData.addRiskEvent.validData
            );

            // Create first event
            RiskEvents.createRiskEvent(firstEventData);
            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);

            // Try to create duplicate with same name
            const duplicateEventData = {
              ...testData.addRiskEvent.duplicateName,
              name: firstEventData.name, // Use same name to test duplicate validation
            };
            RiskEvents.createRiskEvent(duplicateEventData);
            RiskEvents.verifyValidationError(
              testData.validationMessages.duplicateName
            );
            RiskEvents.clickCancelButton();
          }
        );

        it(
          "Should show validation error when editing name to blank",
          {
            tags: ["@pd41000", "@pd41910"],
          },
          () => {
            // Use enhanced method to create initial event
            const initialEventData = RiskEvents.createRiskEventWithUniqueName(
              testData.addRiskEvent.validData
            );
            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);

            // Edit to blank name using enhanced validation method
            RiskEvents.editRiskEvent(initialEventData.name, { name: "" });
            RiskEvents.verifyValidationError(
              testData.validationMessages.saveError
            );
            RiskEvents.verifyFormErrorHighlight();
          }
        );
      }
    );

    context(
      "Search/Filter Functionality",
      {
        tags: ["@pd41002"],
      },
      () => {
        let searchTestEventData;

        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitRiskEvent();
          cy.waitForTopMsgLoaderToDisappear(15000);
        });
        it(
          "Click on Event Name hyperlink",
          {
            tags: ["@pd41002", "@pd41904"],
          },
          () => {
            // Get the first event name and click its link
            RiskEvents.getFirstEventNameFromTable(
              locators.general.riskEventname
            ).then((eventName) => {
              cy.get(locators.general.riskeventBody)
                .contains("a", eventName)
                .click();
              // Verify edit screen loads with correct prefilled data
              cy.get(locators.general.riskeventName1).should(
                "have.value",
                eventName
              );
              cy.get(locators.general.riskManagementform).should("be.visible");
              // Check that Event Type, Owner, Status, Dates are present
              cy.get(locators.general.riskEventTypeID).should("exist");
              cy.get(locators.general.riskEventOwnerID).should("exist");
              cy.get(locators.general.riskEventStatusActive).should("exist");
              cy.get(locators.general.riskEventDate).should("exist");
            });
          }
        );
        it(
          "Should filter with full event name",
          {
            tags: ["@pd41002", "@pd41907"],
          },
          () => {
            readFreshTestData().then((freshData) => {
              RiskEvents.applyFilter(
                freshData.lastCreatedEvents.validDataEvent.name
              );
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(
                freshData.lastCreatedEvents.validDataEvent.name
              );

              // Store successful filter operation
              updateTestDataValue("filterHistory.fullNameSearch", {
                searchTerm: freshData.lastCreatedEvents.validDataEvent.name,
                searchType: "full_name",
                searchExecutedAt: new Date().toISOString(),
                testCase: "Should filter with full event name",
                result: "found_results",
              });
            });
          }
        );

        it(
          "Should filter with partial event name",
          {
            tags: ["@pd41002", "@pd41909"],
          },
          () => {
            readFreshTestData().then((freshData) => {
              const expectedName =
                freshData.lastCreatedEvents.validDataEvent?.name;
              // const partialName = expectedName.substring(0, 22);

              const partialName = expectedName.substring(
                0,
                expectedName.length - 4
              ); // include almost full name

              RiskEvents.applyFilter(partialName);
              cy.waitForTopMsgLoaderToDisappear(15000);

              TableHelper.verifyEventExistsInTable(
                locators.general.tableContainer,
                expectedName
              );
            });
          }
        );

        it(
          "Filter by Name (No Match)",
          {
            tags: ["@pd41002", "@pd41905"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              cy.get(locators.general.filterRiskEventName).type(
                "NonExistentEventName12345",
                {
                  force: true,
                }
              );
              cy.get(locators.general.saveB).contains("Apply").click();
              // cy.get("a.btn.btn-primary").contains("Apply").click();
            }
          }
        );

        it(
          "Filter by Event Type",
          {
            tags: ["@pd41002", "@pd41930"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              // Open the dropdown
              cy.get(locators.general.dropdownEventType).click();
              cy.get(locators.general.selectEventTypeDropdown)
                .contains("Risk Assessment")
                .click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );
        it(
          "Filter by Owner",
          {
            tags: ["@pd41002", "@pd41903"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              cy.get(locators.general.dropdownOwner).click();
              cy.get(locators.general.selectOwnerDropdown).type("admin BU");
              // Select result
              cy.get(locators.general.selectOwnerOption)
                .contains("admin BU")
                .click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );
        it(
          "Filter by Status = Active",
          {
            tags: ["@pd41002", "@pd41928"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              cy.get(locators.general.selectActiveStatus).click(); // open dropdown
              cy.get(locators.general.selectActiveOption)
                .contains("Active")
                .click(); // select Active
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Filter by Status = InActive",
          {
            tags: ["@pd41002", "@pd41902"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              cy.get(locators.general.selectInactiveStatus).click(); // open dropdown
              cy.get(locators.general.selectInactiveOption)
                .contains("Inactive")
                .click(); // select Inactive
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Filter by Created Date",
          {
            tags: ["@pd41002", "@pd41914"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              // open calendar
              // open calendar
              cy.get(locators.general.creatEventDate)
                .parents(locators.general.SelectcreateEventDate)
                .find("button")
                .click();
              // click the active day (today)
              cy.get(locators.general.ActivecreateEventDate).click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Filter by Event Date",
          {
            tags: ["@pd41002", "@pd41900"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              // Open the calendar for eventDate field
              cy.get(locators.general.eventDate)
                .parents(locators.general.SelectcreateEventDate)
                .find("button")
                .click();

              // Select today’s date (highlighted day)
              cy.get(locators.general.selectActiveEventDate).click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Filter by Closed Date",
          {
            tags: ["@pd41002", "@pd41920"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              // Open the calendar for closedDate field
              cy.get(locators.general.closedDate)
                .parents(locators.general.SelectcreateEventDate)
                .find("button")
                .click();

              // Select today’s date (highlighted day)
              cy.get(locators.general.selectActiveEventDate).click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Apply all filters together",
          {
            tags: ["@pd41002", "@pd41915"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              cy.get(locators.general.filterRiskEventName)
                .clear()
                .type("My Test Event");

              cy.get(locators.general.dropdownEventType).click();
              cy.get(locators.general.selectEventTypeDropdown)
                .contains("Risk Assessment")
                .click();

              cy.get(locators.general.dropdownOwner).click();
              cy.get(locators.general.selectOwnerDropdown).type("admin BU");
              // Select result
              cy.get(locators.general.selectOwnerOption)
                .contains("admin BU")
                .click();

              cy.get(locators.general.selectActiveStatus).click(); // open dropdown
              cy.get(locators.general.selectActiveOption)
                .contains("Active")
                .click(); // select Active

              cy.get(locators.general.eventDate)
                .parents(locators.general.SelectcreateEventDate)
                .find("button")
                .click();

              // Select today’s date (highlighted day)
              cy.get(locators.general.selectActiveEventDate).click();

              // // Select today’s date (highlighted day)
              cy.get(locators.general.selectActiveEventDate).click();
              // Select today’s date (highlighted day)
              cy.get(locators.general.selectActiveEventDate).click();
              cy.get(locators.general.saveB).contains("Apply").click();
            }
          }
        );

        it(
          "Cancel filter popup",
          {
            tags: ["@pd41002", "@pd41926"],
          },
          () => {
            RiskEvents.applyFilter();
            {
              // Open the calendar for closedDate field
              cy.get('button.close[data-dismiss="modal"]').last().click();
            }
          }
        );

        it(
          "Should clear filter and show all records",
          {
            tags: ["@pd41002", "@pd41922"],
          },
          () => {
            readFreshTestData().then((freshData) => {
              const searchTestEventData =
                freshData.lastCreatedEvents.validDataEvent;

              expect(searchTestEventData?.name, "Event name must exist").to.not
                .be.undefined;

              // Apply filter
              RiskEvents.applyFilter(searchTestEventData.name);
              cy.waitForTopMsgLoaderToDisappear(15000);
              RiskEvents.verifyRiskEventInTable(searchTestEventData.name);

              // Clear filter
              RiskEvents.clearFilter();
              cy.get("a.btn.btn-primary").contains("Apply").click();
            });
          }
        );

        it(
          "Should handle special characters in filter",
          {
            tags: ["@pd41002"],
          },
          () => {
            RiskEvents.searchFilterAllowEmpty(
              testData.searchFilters.specialChars
            );
            cy.waitForTopMsgLoaderToDisappear(15000);
            // Verify no crash occurs
            cy.get(locators.general.tableContainer).should("be.visible");
          }
        );
      }
    );

    context(
      "Other Functionality Cases",
      {
        tags: ["@pd41001"],
      },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitRiskEvent();
          cy.waitForTopMsgLoaderToDisappear(15000);
        });

        it(
          "Check pagination",
          {
            tags: ["@pd41002", "@pd41921"],
          },
          () => {
            const pageSizes = ["5", "10"];

            pageSizes.forEach((size) => {
              RiskEvents.changePageSize(size);
              cy.wait(2000);
              cy.get(locators.general.pageSizeSelect).should(
                "have.value",
                size
              );
            });
          }
        );

        it(
          "Should verify date picker functionality",
          {
            tags: ["@pd41001", "@pd41931"],
          },
          () => {
            RiskEvents.clickAddButton();
            cy.wait(1000);

            // Use FormHelper through RiskEvents for better form interaction
            RiskEvents.fillRiskEventForm({ eventDate: "12/25/2024" });

            // Verify date picker appears (this selector may need adjustment)
            cy.get(".datepicker, .calendar, [data-testid='calendar']").should(
              "be.visible"
            );
          }
        );

        it(
          "Add a risk event with Risk Closed Date earlier than Event Date",
          {
            tags: ["@pd41001", "@pd41931"],
          },
          () => {
            RiskEvents.clickAddButton();
            cy.wait(1000);

            // Use FormHelper through RiskEvents to fill form fields
            RiskEvents.fillRiskEventForm({
              eventType: "Meeting",
              eventDate: "12/25/2024",
            });

            RiskEvents.clickSaveButton();

            // Verify error is shown but form data is maintained
            RiskEvents.verifyValidationError(
              testData.validationMessages.saveError
            );
            cy.get(locators.general.eventDateInput).should(
              "contain.value",
              "12/25/2024"
            );
          }
        );

        it(
          "Should verify pagination controls when multiple records exist",
          {
            tags: ["@pd41001", "@pd41921", , "@pd41924"],
          },
          () => {
            // Use enhanced method to create multiple records for pagination testing
            // Check that at least one created event is in the table
            const createdEvents = RiskEvents.createMultipleRiskEvents(
              testData.addRiskEvent.validData,
              3
            );

            cy.verifyToastMessageContains("successfully", 10000);
            cy.waitForTopMsgLoaderToDisappear(15000);

            // Change page size to ensure pagination is visible
            RiskEvents.changePageSize("5");
            cy.wait(2000);

            // Verify at least one of the created events exists
            cy.wrap(createdEvents).each((event) => {
              RiskEvents.verifyRiskEventInTable(event.name);
              return false; // stop after first match to speed up
            });
          }
        );
        it(
          "View the Risk Events list",
          {
            tags: ["@pd41001", "@pd41916"],
          },
          () => {
            // Verify table loads and columns are present
            cy.get(locators.general.riskEventname).should("be.visible");
            cy.get(locators.general.riskeventBodyTd).then(($ths) => {
              const headers = [...$ths].map((th) => th.innerText.trim());
              expect(headers).to.include.members([
                "Name",
                "Event Type",
                "Owner",
                "Status",
                "Risk Created Date",
                "Risk Event Date",
                "Risk Closed Date",
              ]);
            });
            // Should have at least one row
            cy.get(locators.general.riskeventBody).should(
              "have.length.greaterThan",
              0
            );
          }
        );
      }
    );
  }
);
