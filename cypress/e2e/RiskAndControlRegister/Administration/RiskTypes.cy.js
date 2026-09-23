import RiskTypes from "../../../support/POM/RiskAndControlRegister/Administration/RiskTypes";
import locators from "../../../fixtures/locators.json";
import testData from "../../../fixtures/RiskAndControlRegister/Administration/RiskTypes.json";
describe(
  "Risk Types Management",
  {
    tags: [
      "@risk-management",
      "@event-types",
      "@regression",
      "@customer",
      "@predict",
      "@pd36724",
    ],
  },
  () => {
    const riskTypesPage = new RiskTypes();

    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("USER").FNBA.USERNAME,
        Cypress.env("USER").FNBA.PASSWORD,
        Cypress.env("USER").FNBA.KEY
      );
      riskTypesPage.visitRiskTypesPage();
    });

    context(
      "Add/Create - Positive Cases",
      {
        tags: ["@smoke", "@customer", "@predict", "@pd41003"],
      },
      () => {
        it(
          "Add with valid name and description",
          {
            tags: ["@smoke", "@pd41003", "@pd41947"],
          },
          () => {
            riskTypesPage.openAddForm();
            const data = {
              name: riskTypesPage.generateUniqueRiskTypeName("ValidName"),
              description: "Valid description",
            };
            riskTypesPage.fillRiskTypeForm(data);
            riskTypesPage.saveRiskType();
            riskTypesPage.verifySuccessMessage(testData.toastMessage.added);
            riskTypesPage.verifyRiskTypeInTable(data.name);
          }
        );

        it(
          "Add with name only",
          {
            tags: ["@smoke", "@pd41003", "@pd41944"],
          },
          () => {
            riskTypesPage.openAddForm();
            const data = {
              name: riskTypesPage.generateUniqueRiskTypeName("NameOnly"),
              description: "",
            };
            riskTypesPage.fillRiskTypeForm(data);
            riskTypesPage.saveRiskType();
            riskTypesPage.verifySuccessMessage(testData.toastMessage.added);
            riskTypesPage.verifyRiskTypeInTable(data.name);
          }
        );

        it(
          "Cancel action",
          {
            tags: ["@pd41003", "@pd41950"],
          },
          () => {
            riskTypesPage.openAddForm();
            riskTypesPage.cancelForm();
            riskTypesPage.verifyFormModalNotVisible();
          }
        );
      }
    );

    context("Negative/Validation Cases", () => {
      it(
        "Attempt to save with empty name",
        {
          tags: ["@pd41006", "@customer", "@predict"],
        },
        () => {
          riskTypesPage.openAddForm();
          riskTypesPage.fillRiskTypeForm({ name: "", description: "desc" });
          riskTypesPage.saveRiskType();
          riskTypesPage.verifyValidationErrorMessage(
            testData.toastMessage.validationError
          );
        }
      );

      it(
        "Add with name exceeding 255 characters",
        {
          tags: ["@pd41006", "@pd41938"],
        },
        () => {
          riskTypesPage.openAddForm();
          const longName = riskTypesPage.generateLongName(256);
          riskTypesPage.fillRiskTypeForm({
            name: longName,
            description: "desc",
          });
          riskTypesPage.saveRiskType();
          riskTypesPage.verifyValidationErrorMessage(
            testData.toastMessage.validationError
          );
        }
      );

      it(
        "Attempt to add duplicate event type name/Edit name to an already existing one",
        {
          tags: ["@pd41006", "@pd41946", "@pd41936"],
        },
        () => {
          const duplicateName = "Risk Assessment"; // Use an existing name
          riskTypesPage.openAddForm();
          riskTypesPage.fillRiskTypeForm({
            name: duplicateName,
            description: "desc",
          });
          riskTypesPage.saveRiskType();
          riskTypesPage.verifyValidationErrorMessage(
            testData.toastMessage.duplicateError
          );
        }
      );
    });

    context(
      "Edit/Update - Positive Cases",
      {
        tags: ["@pd41006", "@customer", "@predict"],
      },
      () => {
        let createdName;
        beforeEach(() => {
          createdName = riskTypesPage.generateUniqueRiskTypeName("EditTest");
          riskTypesPage.openAddForm();
          riskTypesPage.fillRiskTypeForm({
            name: createdName,
            description: "desc",
          });
          riskTypesPage.saveRiskType();
          riskTypesPage.verifyRiskTypeInTable(createdName);
        });

        it(
          "Edit name and save",
          {
            tags: ["@smoke", "@pd41006", "@pd41938"],
          },
          () => {
            const newName =
              riskTypesPage.generateUniqueRiskTypeName("EditedName");
            riskTypesPage.editRiskType(createdName);
            riskTypesPage.fillRiskTypeForm({ name: newName });
            riskTypesPage.saveRiskType();
            riskTypesPage.verifySuccessMessage(testData.toastMessage.added);
            riskTypesPage.verifyRiskTypeInTable(newName);
          }
        );

        it(
          "Edit description only and save",
          {
            tags: ["@smoke", "@pd41006", "@pd41943"],
          },
          () => {
            const newDesc = "Updated description";
            riskTypesPage.editRiskType(createdName);
            riskTypesPage.fillRiskTypeForm({ description: newDesc });
            riskTypesPage.saveRiskType();
            riskTypesPage.verifySuccessMessage(testData.toastMessage.added);
            riskTypesPage.verifyRiskTypeInTable(createdName);
          }
        );

        it(
          "Cancel edit",
          {
            tags: ["@pd41006", "@pd41950"],
          },
          () => {
            riskTypesPage.editRiskType(createdName);
            riskTypesPage.fillRiskTypeForm({ name: "ShouldNotSave" });
            riskTypesPage.cancelFormbtn();
            riskTypesPage.verifyFormModalNotVisible();
            riskTypesPage.verifyRiskTypeInTable(createdName);
          }
        );
      }
    );

    context(
      "Load/View Screen",
      {
        tags: ["@pd41005", "@customer", "@predict"],
      },
      () => {
        it(
          "View existing event types",
          {
            tags: ["@pd41005", "@pd41935"],
          },
          () => {
            riskTypesPage.verifyTableHasRecords();
          }
        );

        it(
          "Verify pagination",
          {
            tags: ["@pd41005", "@pd41952"],
          },
          () => {
            riskTypesPage.changeRecordsPerPage(
              testData.pagination.infoTexts.five
            );
            riskTypesPage.verifyPaginationVisible();
          }
        );

        it(
          "Click on an event type row",
          {
            tags: ["@pd41005", "@pd41954"],
          },
          () => {
            riskTypesPage.changeRecordsPerPage("All");
            riskTypesPage.editRiskType(testData.search.fullName);
            riskTypesPage.verifyFormModalVisible();
          }
        );

        it(
          "Add button presence and functionality",
          {
            tags: ["@pd41005", "@pd41932"],
          },
          () => {
            riskTypesPage.verifyElementVisible(locators.riskType.addButton);
            riskTypesPage.openAddForm();
            riskTypesPage.verifyFormModalVisible();
          }
        );
      }
    );

    context(
      "Search/Filter Functionality",
      {
        tags: ["@pd41008", "@customer", "@predict"],
      },
      () => {
        it(
          "Search/filter (partial name)",
          {
            tags: ["@pd41005", "@pd41940"],
          },
          () => {
            riskTypesPage.applyFilter(
              `${testData.search.filterName}{downarrow}{enter}`
            );
            riskTypesPage.verifyRiskTypeInTable(testData.search.fullName);
          }
        );

        it(
          "Filter with full event type name",
          {
            tags: ["@pd41005", "@pd41949"],
          },
          () => {
            riskTypesPage.applyFilter(
              `${testData.search.filterName}{downarrow}{enter}`
            );
            riskTypesPage.verifyRiskTypeInTable(testData.search.filterName);
          }
        );

        it(
          "Filter with mixed case input",
          {
            tags: ["@pd41005", "@pd41953"],
          },
          () => {
            riskTypesPage.applyFilter(
              `${testData.search.caseInsensitive}{downarrow}{enter}`
            );
            riskTypesPage.verifyRiskTypeInTable(testData.search.filterName);
          }
        );

        it(
          "Filter with no matching results",
          {
            tags: ["@pd41005", "@pd41941"],
          },
          () => {
            riskTypesPage.applyFilter(testData.search.noMatching);
            riskTypesPage.verifyNoDataMessage();
          }
        );

        it(
          "Leave input blank and click Apply",
          {
            tags: ["@pd41005", "@pd41948"],
          },
          () => {
            riskTypesPage.applyFilter("");
            riskTypesPage.verifyTableHasRecords();
          }
        );

        it(
          "Clear after applying filter",
          {
            tags: ["@pd41005", "@pd41942"],
          },
          () => {
            riskTypesPage.applyFilter(
              `${testData.search.filterName}{downarrow}{enter}`
            );
            riskTypesPage.clearFilter();
            riskTypesPage.verifyTableHasRecords();
          }
        );

        it(
          "Cancel filtering",
          {
            tags: ["@pd41005", "@pd41955"],
          },
          () => {
            riskTypesPage.openFilter();

            cy.get(locators.administration.resellers.cancelArea)
              .contains(testData.search.cancelFilter)
              .click();
            riskTypesPage.verifyTableHasRecords();
          }
        );

        it(
          "Apply special characters in filter",
          {
            tags: ["@pd41005", "@pd41951"],
          },
          () => {
            riskTypesPage.applyFilter(testData.search.specialChars);
            riskTypesPage.verifyNoDataMessage();
          }
        );
      }
    );
  }
);
