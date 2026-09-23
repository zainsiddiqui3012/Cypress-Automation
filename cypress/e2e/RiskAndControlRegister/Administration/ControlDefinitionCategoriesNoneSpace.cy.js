import ControlDefinitionCategoriesNoneSpace from "../../../support/POM/RiskAndControlRegister/Administration/ControlDefinitionCategoriesNoneSpace";

describe(
  "Risk Management - Control Definition Categories",
  {
    tags: [
      "@pd36715",
      "@risk-management",
      "@none",
      "@regression",
      "@control-definition-categories",
    ],
  },

  () => {
    const controlDefinitionCategories = new ControlDefinitionCategoriesNoneSpace();
    const dataFilePath = "cypress/fixtures/RiskAndControlRegister/Administration/ControlDefinitionCategoriesNoneSpace.json";
    let data;

    before(() => {
      cy.readFile(dataFilePath).then((testData) => {
        data = testData;
      });
    });

    context("Validation Cases - Control Definition Categories", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlDefinitionCategories();
      });

      it("View Control Definition Categories List (Positive)",
        {
          tags: [
            "@pd42405",
            "@smoke"
          ],
        }, 

        () => {
        controlDefinitionCategories.validateHeaders(data.headers);
      });

      it("Toast notification error message when click Add button twice without Control Definition Category",
        {
          tags: [
            "@pd43738"
          ],
        },
        () => {
        controlDefinitionCategories.clickAddButton();
        controlDefinitionCategories.clickAddButton();
        controlDefinitionCategories.verifyErrorMessage(data.uiConfig.errorMessage);
      });

    });

    context("Add Cases - Control Definition Categories", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlDefinitionCategories();
      });

      it("Add Control Definition Category with Valid Data (Positive)",
        {
          tags: [
            "@pd42408",
            "@smoke"
          ],
        },
        () => {
        
        controlDefinitionCategories.getLastContentLibrary(data.parameters, data.scrollDirection.bottom, (contentLibrary) => {
          controlDefinitionCategories.updateDataInFile(
            {
              filePath: dataFilePath,
              key: data.parameters.add,
              keyObject: data.parameters,
              controlNameText: data.fileData.addText,
              contentLibrary: contentLibrary
            });
        });

        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.clickAddButton();
          controlDefinitionCategories.typeName(data.parameters, data.addData.name);
          controlDefinitionCategories.filterAndSelectLibrary(data.parameters, data.addData.contentLibrary, data.scrollDirection.bottom);
          controlDefinitionCategories.selectStatus(data.parameters, data.addData.status);
          controlDefinitionCategories.verifySuccessMessage(data.uiConfig.successMessage);
          controlDefinitionCategories.verifyControlOperationAdded(data.parameters, data.addData);
        });
      });

      it("Add Control Definition Category with Empty Name (Negative)",
        {
          tags: [
            "@pd42409",
            "@smoke"
          ],
        },
        () => {
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.verifyRecords();
          controlDefinitionCategories.clickAddButton();
          controlDefinitionCategories.filterAndSelectLibrary(data.parameters, data.addData.contentLibrary, data.scrollDirection.bottom);
          controlDefinitionCategories.selectStatus(data.parameters, data.addData.status);
        });
        // reading again from data file to validate no of records, because verifyRecords() updating the no of records
        // in file and when deployment happens, data is gone, so file has old no of records against which it validates and test might fail
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.verifyControlNotAdded(data.uiConfig.noOfRecords);
        });
      });

      it("Add Control Definition Category with Empty Content Library (Negative)",
        {
          tags: [
            "@pd42407",
            "@smoke"
          ],
        },
        () => {
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.verifyRecords();
          controlDefinitionCategories.clickAddButton();
          controlDefinitionCategories.typeName(data.parameters, data.addData.name);
          controlDefinitionCategories.selectStatus(data.parameters, data.addData.status);
          controlDefinitionCategories.verifyControlNotAdded(data.uiConfig.noOfRecords);
        });
      });
    });

    context("Filter Cases - Control Definition Categories", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlDefinitionCategories();
      });

      it("Filter Control Definition Category by Name (Positive)",
        {
          tags: [
            "@pd42414",
            "@filter"
          ],
        },
        () => {
          cy.readFile(dataFilePath).then((data) => {
            controlDefinitionCategories.filterByName(data.addData.name);
          });
      });

      it("Filter Control Definition Category by Invalid Name (Negative)",
        {
          tags: [
            "@pd42412",
            "@filter"
          ],
        },
        () => {
        controlDefinitionCategories.filterByName(data.negativeData.name, { verifyFilteredRecords: false });   // sending false to verifyFilteredRecords to check no records found
      });

      it("Filter Control Definition Category by Invalid Status (Negative)",
        {
          tags: [
            "@pd43739",
            "@filter"
          ],
        },
        () => {
        controlDefinitionCategories.filterByInvalidStatus(data.negativeData.status, data.uiConfig.noOfStatuses);
      });
    });

    context("Edit Cases - Control Definition Categories", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlDefinitionCategories();
      });

      it("Edit Control Definition Category (Positive)",
        {
          tags: [
            "@pd42406",
            "@smoke"
          ],
        },
        () => {
          controlDefinitionCategories.updateDataInFile(
            {
              filePath: dataFilePath,
              key: data.parameters.update,
              keyObject: data.parameters,
              controlNameText: data.fileData.updateText
            });
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.updateControlDefinitionCategory(
            {
              parametersObj: data.parameters,
              controlName: data.addData.name,
              updateData: data.updateData,
              keyCommands: data.keyCommands
            });
          controlDefinitionCategories.verifyUpdatedControlDefinitionCategory(data.parameters, data.updateData.name, data.updateData.status);
        });
      });

      it("Edit Control Definition Category with No Changes (Neutral)",
        {
          tags: [
            "@pd42416",
            "@smoke"
          ],
        },
        () => {
        controlDefinitionCategories.editWithNoChanges(data.addData.name, data.parameters, data.keyCommands);
      });

      it("Ensure that Name field can take special characters while editing and save in List.",
        {
          tags: [
            "@pd43987",
            "@smoke"
            ],
        },
        () => {
          controlDefinitionCategories.updateDataInFile(
          {
            filePath: dataFilePath,
            specialCharacters: data.updateData.specialCharacters,
            specialCharactersText: data.fileData.specialCharactersText
          });
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.updateControlNameWithSpecialCharacter(
          data.parameters, data.updateData.name,
          data.updateData.specialCharacters, data.keyCommands);
        controlDefinitionCategories.verifyUpdatedControlNameWithSpecialCharacter(data.parameters, data.updateData.specialCharacters);
        });

      });

      it("Edit Control Definition Category with Empty Name (Negative)",
        {
          tags: [
            "@pd42413",
            "@smoke"
            ],
        },
        () => {
        cy.readFile(dataFilePath).then((data) => {
          controlDefinitionCategories.editWithNoChanges(data.addData.name, data.parameters, data.keyCommands, { emptyName: true });
        });
      });
      
    });
  }
);
