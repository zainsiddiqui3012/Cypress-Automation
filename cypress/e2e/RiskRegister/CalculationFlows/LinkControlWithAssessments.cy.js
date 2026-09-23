/// <reference types="cypress" />
import RiskRegister from "../../../support/POM/RiskAndControlRegister/RiskRegister.js";
const testDataFilePath = "cypress/fixtures/RiskRegister/riskDefinitionAndControlDataWithAssessment.json";

describe("Link Controls with Assessment in Risk Register",
   {
    tags: [
      "@pd36714",
      "@risk-management",
      "@customer",
      "@regression",
      "@with-assessment"
    ],
  },

  () => {

    const riskRegister = new RiskRegister();

    context('With Assessments', () => {

      beforeEach(() => {
        const rmUser = Cypress.env("riskManagement").rmUserA;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );

        cy.visitRiskRegister();

      });

      it("Link Control with Risk Definition if no definition is linked already for with assessment customer", 
        {
          tags: [
            "@pd42119",
            "@smoke"
          ],
        },
        
        () => {

        cy.readFile(testDataFilePath)
        .then((allDefinitionsAndControlsData) => {
          allDefinitionsAndControlsData.forEach((data) => {
            riskRegister.enterRiskDefinition(data.riskDefinition);
            riskRegister.expandCategoryIfNotAlready(data.categoryIconLength);
            riskRegister.expandEllipses();
            riskRegister.selectControlsFromEllipsesOption();

            // this function will check if any control is linked with risk definition or not and set the value true/false
            // in '@controlFound' alias which can be used to decide wheather to link the control or not
            riskRegister.checkIfAnyControlIsLinked(data.controlInstanceRecordStatus, data.controlFoundAlias).then(() => {
              cy.get('@controlFound').then((controlFound) => {
                if (!controlFound) {
                  riskRegister.linkControl(data.scrollRight, data.linkControlInstanceText, data.controlType, data.control);
                  riskRegister.verifySuccessMessage(data.successMessage);
                  riskRegister.enterControlDetails(data.scrollRight, data.effectiveness, data.implemented, data.weight, data.controlStrength);
                  riskRegister.closeGrid();
                  riskRegister.validateLinkedControlCalculatedValue(data.controlStrengthCalculated);
                }
              });

            });

            // scrolling left to search for next risk deinition if there is more data in data file
            riskRegister.scrollToLeft(data.scrollLeft);

          });
        
        });
      
      });

    });

  });