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

    context("Disable Assessment, Manage Detail Control, Enable Control Strength", () => {

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
        cy.configureSettings({ assessment: false, round: false, manageDetailControl: false, controlStrength: true });
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

      it("Verify on clicking inherent likehood column/cell on risk register the drop down should show the dimensions listed on risk analysis dimension > likelihood tab",
        {
          tags: [
            "@pd45621",
            "@pd45623"
          ],
        }, 

        () => {
          
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.validateOptionsInDropdown(data.inherentLikelihoodOptionsExpectedValues);

      });

       it("Verify on selecting dimension on inherent likehood column/cell on risk register, the listed label with the color should display for that instance",
        {
          tags: [
            "@pd45622",
            "@pd45625"
          ],
        }, 

        () => {

          inherentRiskCalculation.scrollRight(data.scrollPercentage1);       
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentLikelihood).to.equal(data.unlikelyVal);
          });

      });
         
        it("Inherent Impact must contain the same options which are defined in the Impact dimension value in Risk Analysis Dimension page",
        {
          tags: [
            "@pd45624"
          ],
        }, 

        () => {

          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.validateOptionsInDropdown(data.inherentImpactOptionsExpectedValues);

      });

      it("Select inherent impact value against the risk instance on UI and same inherent impact value must be dropped in db.",
        {
          tags: [
            "@pd45626"
          ],
        }, 

        () => {
  
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentImpact).to.equal(data.moderateVal);
          });
      });

      it("Validate the calculation on inherent risk column on UI and db",
        {
          tags: [
            "@pd45627",
            "@smoke"
          ],
        }, 

        () => {
          
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
         
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRisk);
          });

      });

      it("Select Residual liklihood value against the risk instance on UI and same Residual liklihood value must be dropped in db.",
        {
          tags: [
            "@pd45628"
          ],
        }, 

        () => {

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
          inherentRiskCalculation.openDropdown(data.residualLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.residualLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualLikelihood).to.equal(data.unlikelyVal);
          });

        });

        it("Select Residual impact value against the risk instance on UI and same Residual impact value must be dropped in db.",
        {
          tags: [
            "@pd45629"
          ],
        }, 

        () => {
         
            inherentRiskCalculation.scrollRight(data.scrollPercentage2);
            inherentRiskCalculation.openDropdown(data.residualImpactLocatorText);
            inherentRiskCalculation.selectValue(data.minor);
            inherentRiskCalculation.validateLabelAndColor(data.residualImpactLocatorText, data.minor, data.color7);

            inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
            .then((result) => {
            expect(result.residualImpact).to.equal(data.minorVal);
          });

        });

        it("Validate the calculation on Residual risk column on UI and db",
        {
          tags: [
            "@pd45630",
            "@smoke"
          ],
        }, 

        () => {
        
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
          inherentRiskCalculation.openDropdown(data.controlStrengthLabelLocatorText);
          inherentRiskCalculation.typeControlStrengthValue(data.medium);
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualRiskRating).to.equal(data.expectedResidualRisk);
          });

      });

      it("Validate the calculation on Current risk column and db.",
        {
          tags: [
            "@pd45631",
            "@smoke"
          ],
        }, 

        () => {
        
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
         
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
                   
          // typing efficiency and implemented and control strength values
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue1);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue1);

          inherentRiskCalculation.openDropdown(data.controlStrengthLabelLocatorText);
          inherentRiskCalculation.typeControlStrengthValue(data.medium);
          
          // validating residual and current risk calculations
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);
          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk);
          });

      });
      
      it("Update the inherent liklihood value from UI and validate the value in db",
        {
          tags: [
            "@pd45633",
          ],
        }, 

        () => {
          
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
       
          // selecting likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.rare);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.rare, data.color5);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentLikelihood).to.equal(data.rareVal);
          });

          // modifying the likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentLikelihood).to.equal(data.unlikelyVal);
          });

      });

      it("Validate the updated risk calculations and also all the values in db",
        {
          tags: [
            "@pd45634"
          ],
        }, 

        () => {
          
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          // selecting inherent likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          // selecting inherent impact

          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);

          // risk calculation validation
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRisk);
          });

          // updating the inherent likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.certain);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.certain, data.color1);

          // risk calculation validation again
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.high, data.color8);
          
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.updatedExpectedInherentRisk);
          });

      });

      it("Update the residual impact value from UI and validate the value in db",
        {
          tags: [
            "@pd45635"
          ],
        }, 

        () => {
          
          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
       
          // selecting residual impact
          inherentRiskCalculation.openDropdown(data.residualImpactLocatorText);
          inherentRiskCalculation.selectValue(data.insignificant);
          inherentRiskCalculation.validateLabelAndColor(data.residualImpactLocatorText, data.insignificant, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualImpact).to.equal(data.insignificantVal);
          });
          
          // updating residual impact
          inherentRiskCalculation.openDropdown(data.residualImpactLocatorText);
          inherentRiskCalculation.selectValue(data.minor);
          inherentRiskCalculation.validateLabelAndColor(data.residualImpactLocatorText, data.minor, data.color7);
          
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualImpact).to.equal(data.minorVal);
          });

      });

      it("Update the current risk from UI and validate the value in db",
        {
          tags: [
            "@pd45637"
          ],
        }, 

        () => {
         
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
         
          // selecting inherent likelihood and validating
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);
          
          // selecting inherent impact and validating
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);

          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);

          // typing efficiency and implemented and control strength values
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue1);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue1);

          // opening control strength dropdown and selecting value
          inherentRiskCalculation.openDropdown(data.controlStrengthLabelLocatorText);
          inherentRiskCalculation.typeControlStrengthValue(data.high);

          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk2);
          });

          // changing efficacy and implemented values
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue2);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue2);

          // validating current risk calculation again after updating efficacy and implemented values
          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.low, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.updatedExpectedCurrentRisk2);
          });

      });
      
      it("Update the Risk analysis dimension value and check the calculations on UI and DB",
        {
          tags: [
            "@pd45644"
          ],
        }, 

        () => {
 
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          // Selecting inherent likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          // Selecting inherent impact
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);

          // validating inherent risk calculation
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);
          
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRisk);
          });

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
          
          // typing efficiency and implemented and control strength values
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue1);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue1);
          
          inherentRiskCalculation.openDropdown(data.controlStrengthLabelLocatorText);
          inherentRiskCalculation.typeControlStrengthValue(data.medium);
          
          // validating residual and current risk calculations
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);
          
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.residualRiskRating).to.equal(data.expectedResidualRisk);
          });

          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk);
          });

          // changing of low from 4 to 6 in Risk Analysis Dimension
          cy.visitRiskAnalysisDimensions();
          inherentRiskCalculation.clickRiskAnalysisDimensionsTab(data.riskAnalysisDimensionText);
          inherentRiskCalculation.updateRiskAnalysisDimension(data.updatedInherentValue1,data.updatedInherentValue2);
          inherentRiskCalculation.clickSaveButton(data.riskAnalysisDimensionSavedText);

          // again visiting Risk register after updating Risk Analysis Dimension
          cy.visitRiskRegister();
          inherentRiskCalculation.searchRisk(data.riskName);

          // validating after updating dimension value
          inherentRiskCalculation.scrollRight(data.scrollPercentage1);
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText,data.low, data.color4);
          
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.inherentRiskRating).to.equal(data.expectedInherentRisk);
          });

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);
          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          
          .then((result) => {
            expect(result.residualRiskRating).to.equal(data.expectedResidualRisk);
          });

          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.low, data.color4);

          inherentRiskCalculation.getRiskFromDB(data.customerId, data.riskId)
          .then((result) => {
            expect(result.currentRiskRating).to.equal(data.expectedCurrentRisk);
          });

          // resetting value of low back to original (6) in Risk Analysis Dimension
          cy.visitRiskAnalysisDimensions();
          inherentRiskCalculation.clickRiskAnalysisDimensionsTab(data.riskAnalysisDimensionText);
          inherentRiskCalculation.updateRiskAnalysisDimension(data.updatedInherentValue2, data.updatedInherentValue1);
          inherentRiskCalculation.clickSaveButton(data.riskAnalysisDimensionSavedText);
          
      });

      it("If the values lies in between, upper dimension label should show",
        {
          tags: [
            "@pd45645",
            "@smoke"
          ],
        }, 

        () => {

          inherentRiskCalculation.scrollRight(data.scrollPercentage1);

          // Selecting inherent likelihood
          inherentRiskCalculation.openDropdown(data.inherentLikelihoodLocatorText);
          inherentRiskCalculation.selectValue(data.unlikely);
          inherentRiskCalculation.validateLabelAndColor(data.inherentLikelihoodLocatorText, data.unlikely, data.color4);

          // Selecting inherent impact
          inherentRiskCalculation.openDropdown(data.inherentImpactLocatorText);
          inherentRiskCalculation.selectValue(data.moderate);
          inherentRiskCalculation.validateLabelAndColor(data.inherentImpactLocatorText, data.moderate, data.color8);

          // validating inherent risk calculation and that it takes upper dimension label
          inherentRiskCalculation.validateLabelAndColor(data.inherentRiskLocatorText, data.medium, data.color6);

          inherentRiskCalculation.scrollRight(data.scrollPercentage2);

          inherentRiskCalculation.openDropdown(data.controlStrengthLabelLocatorText);
          inherentRiskCalculation.typeControlStrengthValue(data.medium);
          
          // typing efficiency and implemented and control strength values
          inherentRiskCalculation.typeEfficacyImplementedValue(data.efficacyValueLocatorText, data.efficacyValue1);
          inherentRiskCalculation.typeEfficacyImplementedValue(data.implementedValueLocatorText, data.implementedValue1);

          // validating residual and current risk calculations and that they take upper dimension label
          inherentRiskCalculation.validateLabelAndColor(data.residualRiskLocatorText, data.low, data.color4);
          inherentRiskCalculation.validateLabelAndColor(data.currentRiskLocatorText, data.medium, data.color6);
      });

    });

});
