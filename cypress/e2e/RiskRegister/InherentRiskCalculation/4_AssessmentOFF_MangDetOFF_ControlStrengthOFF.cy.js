import InherentRiskCalculation from "../../../support/POM/RiskRegister/InherentRiskCalculation.js";

describe(
  "Risk Management - Inherent Risk Calculations - Customer Space",
  {
    tags: [
      "@pd45601",
      "@risk-management",
      "@customer",
      "@regression",
      "@inherent-risk-calculations",
    ],
  },
  () => {
    const inherentRiskCalculation = new InherentRiskCalculation();
    const dataFilePath = "cypress/fixtures/RiskRegister/inherentRiskCalculation.json";
    let data;

    before(() => {
      cy.readFile(dataFilePath).then((testData) => {
        data = testData;
      });
    });

context("Disable Manage Detail Control, Assessment, Round decimal, Control Strength", () => {
      before(() => {
        Cypress.session.clearAllSavedSessions();
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => win.sessionStorage.clear());
        
        const rmUser = Cypress.env("kxi").none;
        cy.loginWithSession(
        `login with ${rmUser.username}`,
        rmUser.username,
        rmUser.password,
        rmUser.key
        );
        
        cy.visitCustomer();
        inherentRiskCalculation.searchCustomer(data.customerName, data.apply, data.scrollPixels);
        cy.configureSettings({ assessment: false, round: false, manageDetailControl: false, controlStrength: false });
        inherentRiskCalculation.saveCustomerSettings(data.scrollPosition);
    
        // validating the feature toggle.
        const rmUser1 = Cypress.env("kxi").customer.withRM;
        cy.loginWithSession(
          `login with ${rmUser1.username}`,
          rmUser1.username,
          rmUser1.password,
          rmUser1.key
        );

         cy.visitRiskRegister();
         inherentRiskCalculation.searchRisk(data.riskName);
         inherentRiskCalculation.validateRiskDisplayed(data.riskName);
         inherentRiskCalculation.scrollRight(data.scrollPercentage1);

        cy.waitForAssessmentToggle
        ({
            riskName: data.riskName,
            scroll: data.scrollPercentage1,
            isAssessment: false
        });

      });

      beforeEach(() => {
        const rmUser = Cypress.env("kxi").customer.withRM;
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        
         cy.visitRiskRegister();
         inherentRiskCalculation.searchRisk(data.riskName);
         inherentRiskCalculation.validateRiskDisplayed(data.riskName);

      });

      it("Validate the updated risk calculations and also all the values in db",
        {
          tags: [
            "@pd45636"
          ],
        }, 

        () => {

          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          // selecting inherent likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.possible);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.possible, data.color3);

          // selecting inherent impact
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.catastrophic);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.catastrophic, data.color10);

          // risk calculation validation
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.high, data.color8);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRisk2);
          });

          // typing efficiency and implemented and control strength values
          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue2);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue2);

          // selecting residual likelihood
          inherentRiskCalculation.openDropdown(data.residualLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.rare);
          inherentRiskCalculation.validateLabelAndColor(data.residualLikelihoodLocatorText, data.rare, data.color5);

          // selecting residual impact
          inherentRiskCalculation.openDropdown(data.residualImpactLocatorText);
          inherentRiskCalculation.selectValue(data.minor);
          inherentRiskCalculation.validateLabelAndColor(data.residualImpactLocatorText, data.minor, data.color7);

          // validating residual and current risk label and db values
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualRiskRating).to.equal(data.expectedResidualRisk2);
          });

          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.low, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk3);
          });

          // update residual impact to catastrophic and validate calculations changed.
          inherentRiskCalculation.openDropdown(data.residualImpactLocatorText);
          inherentRiskCalculation.selectValue(data.catastrophic);
          inherentRiskCalculation.validateLabelAndColor(data.residualImpactLocatorText, data.catastrophic, data.color10);

           // validating again residual and current risk label and db values
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualRiskRating).to.equal(data.expectedResidualRisk3);
          });

          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk4);
          });

      });

    });    
});