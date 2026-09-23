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

    context("Disable Manage Detail Control, Enable Assessment, Round decimal, Control Strength", () => {
      
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
        cy.configureSettings({ assessment: true, round: true, manageDetailControl: false, controlStrength: true });
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
            isAssessment: true
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

      it("When Assessment is ON, Round Decimal Value Flag on",
        {
          tags: [
            "@pd45647",
            "@smoke"
          ],
        }, 

        () => {

          
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          
          inherentRiskCalculation.selectQuestion(data.ques1, data.label40, data.likelihoodFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques2, data.label40, data.likelihoodFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques3, data.label20, data.likelihoodFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques4, data.label40, data.likelihoodFrame, data.frames);
          inherentRiskCalculation.submitSurveyForm(data.likelihoodFrame, data.refreshGridText, data.frames);

          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.likely, data.color2);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentLikelihood).to.equal(data.expectedInherentLikelihoodRoundOn);
          });

          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);

          inherentRiskCalculation.selectQuestion(data.ques1, data.label40, data.impactFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques2, data.label40, data.impactFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques3, data.label30, data.impactFrame, data.frames);
          inherentRiskCalculation.selectQuestion(data.ques4, data.label40, data.impactFrame, data.frames);
          inherentRiskCalculation.submitSurveyForm(data.impactFrame, data.refreshGridText, data.frames);

          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText,data.catastrophic, data.color10);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentImpact).to.equal(data.expectedInherentImpactRoundOn);
          });

          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.high, data.color8);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRiskRoundOn);
          });
          
      });
    }); 

});
