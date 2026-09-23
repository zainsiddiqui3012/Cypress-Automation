import ControlOperationsNoneSpace from "../../../support/POM/RiskAndControlRegister/Administration/ControlOperationsNoneSpace";

describe(
  "Risk Management - Control Operations - None Space",
  {
    tags: [
      "@pd36716",
      "@risk-management",
      "@none",
      "@regression",
      "@control-operations",
    ],
  },

  () => {
    const controlOperations = new ControlOperationsNoneSpace();
    const dataFilePath = "cypress/fixtures/RiskAndControlRegister/Administration/ControlOperationsNoneSpace.json";
    let data;

    before(() => {
      cy.readFile(dataFilePath).then((testData) => {
        data = testData;
      });
    });

    context("Validation Cases - Control Operations", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlOperations();
      });

      it("Ensure that the list is populated with all the available control operations.",
        {
          tags: [
            "@pd42394",
            "@smoke"
          ],
        }, 

        () => {
        controlOperations.validateHeaders(data.headers);
      });

      it("Toast notification error message when click Add button twice without Control Operations",
        {
          tags: [
            "@pd43955"
          ],
        },
        () => {
        controlOperations.clickAddButton();
        controlOperations.clickAddButton();
        controlOperations.verifyErrorMessage(data.uiConfig.errorMessage);
      });

    });

    context("Add Cases - Control Operations", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlOperations();
      });

      it("Ensure that all the fields are filled correctly and the operation is added to the list.",
        {
          tags: [
            "@pd42398",
            "@smoke"
          ],
        },
        () => {
        
        controlOperations.getLastContentLibrary(data.parameters, data.scrollDirection.bottom, (contentLibrary) => {
          controlOperations.updateDataInFile(
            {
              filePath: dataFilePath,
              key: data.parameters.add,
              keyObject: data.parameters,
              controlNameText: data.fileData.addText,
              contentLibrary: contentLibrary
            });
        });

        cy.readFile(dataFilePath).then((data) => {
          controlOperations.clickAddButton();
          controlOperations.typeName(data.parameters, data.addData.name);
          controlOperations.filterAndSelectLibrary(data.parameters, data.addData.contentLibrary, data.scrollDirection.bottom);
          controlOperations.selectStatus(data.parameters, data.addData.status);
          controlOperations.verifySuccessMessage(data.uiConfig.successMessage);
          controlOperations.verifyControlOperationAdded(data.addData);
        });
      });

      it("Verify that the 'Name' field is mandatory and the error message appears.",
        {
          tags: [
            "@pd42403",
            "@smoke"
          ],
        },
        () => {
          
        controlOperations.verifyRecords();
        cy.readFile(dataFilePath).then((data) => {
          controlOperations.clickAddButton();
          controlOperations.filterAndSelectLibrary(data.parameters, data.addData.contentLibrary, data.scrollDirection.bottom);
          controlOperations.selectStatus(data.parameters, data.addData.status);
          controlOperations.verifyControlNotAdded(data.uiConfig.noOfRecords);
        });
      });

      it("Ensure that the Content Library field is mandatory.",
        {
          tags: [
            "@pd42396",
            "@smoke"
          ],
        },
        () => {
        cy.readFile(dataFilePath).then((data) => {
          controlOperations.verifyRecords();
          controlOperations.clickAddButton();
          controlOperations.typeName(data.parameters, data.addData.name);
          controlOperations.selectStatus(data.parameters, data.addData.status);
          controlOperations.verifyControlNotAdded(data.uiConfig.noOfRecords);
        });
      });
    });

    context("Filter Cases - Control Operations", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlOperations();
      });

      it("Verify that the filter by 'Name' works correctly by showing the relevant results.",
        {
          tags: [
            "@pd42404",
            "@filter"
          ],
        },
        () => {
          cy.readFile(dataFilePath).then((data) => {
            controlOperations.filterByName(data.addData.name);
          });
      });

      it("Ensure the system shows no results for an invalid filter query by 'Name'.",
        {
          tags: [
            "@pd42399",
            "@filter"
          ],
        },
        () => {
        controlOperations.filterByName(data.negativeData.name, { verifyFilteredRecords: false });   // sending false to verifyFilteredRecords to check no records found
      });

      it("Verify that no status result shown when user enters invalid status value in filter",
        {
          tags: [
            "@pd43968",
            "@filter"
          ],
        },
        () => {
        controlOperations.filterByInvalidStatus(data.negativeData.status, data.uiConfig.noOfStatuses);
      });
    });

    context("Edit Cases - Control Operations", () => {
      beforeEach(() => {
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlOperations();
      });

      it("Ensure that the changes are saved and displayed in the list.",
        {
          tags: [
            "@pd42395",
            "@smoke"
          ],
        },
        () => {
          controlOperations.updateDataInFile(
            {
              filePath: dataFilePath,
              key: data.parameters.update,
              keyObject: data.parameters,
              controlNameText: data.fileData.updateText
            });
        cy.readFile(dataFilePath).then((data) => {
          controlOperations.updateControlDefinitionCategory(
            {
              parametersObj: data.parameters,
              controlName: data.addData.name,
              updateData: data.updateData,
              keyCommands: data.keyCommands
            });
          controlOperations.verifyUpdatedControlOperation(data.updateData.name, data.updateData.status);
        });
      });

      it("Ensure that no changes are made when no modifications are done.",
        {
          tags: [
            "@pd42397",
            "@smoke"
          ],
        },
        () => {
        controlOperations.editWithNoChanges(data.addData.name, data.parameters, data.keyCommands);
      });

      it("Ensure that Name field can take special characters while editing and save in List.",
        {
          tags: [
            "@pd44031",
            "@smoke"
            ],
        },
        () => {
          controlOperations.updateDataInFile(
          {
            filePath: dataFilePath,
            specialCharacters: data.updateData.specialCharacters,
            specialCharactersText: data.fileData.specialCharactersText
          });
        cy.readFile(dataFilePath).then((data) => {
          controlOperations.updateControlNameWithSpecialCharacter(
            {
              parametersObj: data.parameters,
              controlName: data.updateData.name,
              updateData: data.updateData.specialCharacters,
              keyCommands: data.keyCommands
            });
        controlOperations.verifyUpdatedControlNameWithSpecialCharacter(data.updateData.specialCharacters);
        });

      });

      it("Ensure that the 'Name' field cannot be left empty while editing Control operation.",
        {
          tags: [
            "@pd42393",
            "@smoke"
            ],
        },
        () => {
        cy.readFile(dataFilePath).then((data) => {
          controlOperations.editWithNoChanges(data.addData.name, data.parameters, data.keyCommands, { emptyName: true });
        });
      });
      
    });
  
  });