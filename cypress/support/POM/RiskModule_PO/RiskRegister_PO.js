import dayjs from "dayjs";
import locators from "../../../fixtures/locators.json";

const write_NegativeImpact_Search =
  "cypress/fixtures/RiskModule/Control_Taxonomy/_Write_SearchNegativeImpact.json";
const writefile_inherentR_name =
  "cypress/fixtures/RiskModule/RiskCalculation/write_inherentR_name.txt";
const writefile_residualR_name =
  "cypress/fixtures/RiskModule/RiskCalculation/write_residualR_name.txt";
const writefile_inherentLikeihood_name =
  "cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentLikeihood_SurveyLable.txt";
const writefile_inherentImpact_name =
  "cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentImpact_SurveyLable.txt";
const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";

let getText;

class RiskRegister_PO {
  buFilterRiskRegister(BU) {
    ////BU Filter
    cy.get("#buSelectWrap").click();
    cy.get(
      '[style="font-family: Poppins; font-size: 15.4px; width: 205px; top: 79.0558px; left: 1144.81px; display: block;"] > .pq-select-popup > .pq-select-search-div > .pq-select-search-div1 > .pq-select-search-input'
    )
      .type(BU)
      .type("{enter}");
  }

  ////Select All
  selectAllBu() {
    ////BU Filter
    cy.get("#buSelectWrap").click();
    cy.xpath("/html/body/div[39]/div[1]/label/input").click();
  }

  ////UnSelect All BU
  unSelectAllBu() {
    ////BU Filter
    cy.get("#buSelectWrap").click();
    cy.xpath("/html/body/div[39]/div[1]/label/input").click();
  }

  ///Refersh button Click Risk Register
  refershButtonRiskRegister() {
    cy.get("#syncButton").click();
  }

  ///Wrap text button Click Risk Register
  WrapTextRiskRegister() {
    cy.get("#columnWordWrapBtn").click();
  }

  ///Likelihood/Impact button Click Risk Register
  likeihoodImpactRiskRegister() {
    cy.get("#expand").click();
    ////click on toggle Show
    cy.get("#suppress").click();
  }

  clearRiskFilterName() {
    cy.get(locators.risk.riskRegister.riskSearchTexBoxGrid).eq(0).clear();
  }

  threeEllipsisMenu() {
    cy.waitForToastMessageToDisappear(10000);
    cy.get(locators.risk.riskRegister.ellipsesBtn, { timeout: 300000 })
      .should("exist")
      .click();
  }

  riskTaxonomyclick() {
    cy.get("a#riskTaxonomyBtn").should("be.visible").click();
    cy.wait(20000);
  }
  restoreDefault() {
    cy.get("#restoreLayout").should("be.visible").click();
    cy.wait(3000);
  }
  applicabilityFilter() {
    cy.get("a:contains(Applicability Filter)").click();
    cy.wait(8000);
    cy.get("#select2-chosen-13").click({ force: true });
    cy.get("#s2id_autogen13_search").type("applicable").type("{enter}");
    cy.get("a:contains(Apply)").click();
    cy.wait(8000);
  }
  deferFilter() {
    cy.get("a:contains(Applicability Filter)").click();
    cy.wait(8000);
    cy.get("#select2-chosen-13").click({ force: true });
    cy.get("#s2id_autogen13_search").type("Defer").type("{enter}");
    cy.get("a:contains(Apply)").click();
    cy.wait(8000);
  }
  EmergingFilter() {
    cy.get("a:contains(Applicability Filter)").click();
    cy.wait(8000);
    cy.get("#select2-chosen-13").click({ force: true });
    cy.get("#s2id_autogen13_search").type("Emerging").type("{enter}");
    cy.get("a:contains(Apply)").click();
    cy.wait(8000);
  }
  notApplicabledeferFilter() {
    cy.get("a:contains(Applicability Filter)").click();
    cy.wait(8000);
    cy.get("#select2-chosen-13").click({ force: true });
    cy.get("#s2id_autogen13_search").type("Not Applicable").type("{enter}");
    cy.get("a:contains(Apply)").click();
    cy.wait(8000);
  }

  exportOption() {
    cy.wait(3000);
    // cy.xpath(
    //   "/html/body/div[5]/div[1]/div[10]/div[1]/div/ul[2]/li[7]/div/div/div/div/div/a[13]/span"
    // ).click();
    // cy.wait(5000);
    cy.get("button").contains("Export").click({ force: true });
    cy.wait(10000);
  }

  importOption() {
    //****File Path Download Folder */
    // const filepath = 'Images/test1.xlsx'
    const filepath = "cypress/downloads/ImportTemplate_RiskRegister.xlsx";

    cy.get("#addImportLink").click();
    cy.wait(5000);
    cy.get("#importFile").click();
    ///******This can be use for Fixture file */ // cy.get('input[type="file"]').attachFile(filepath)
    cy.get('input[type="file"]').selectFile(filepath, { action: "drag-drop" });
    cy.get("button").contains("Import").click().wait(5000);
    // cy.get('.toast').contains('Import has started. Summary of import will send as email when it is completed.')
  }

  /////*****Risk Taxonomy Flyer- Marked Applicable*/
  applicableMarked(BU2, riskItemSearch) {
    cy.frameLoaded("#riskTaxonomyApplicabilityFrame");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("#select2-chosen-1")
      .should("be.visible")
      .click();
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("#s2id_autogen1_search")
      .type(BU2)
      .type("{enter}");
    cy.wait(5000);
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Risk Item Filter Input"]')
      .clear({ force: true })
      .type(riskItemSearch)
      .type("{enter}");
    cy.wait(5000);
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Business Area Definitions Filter Input"]')
      .clear({ force: true });
    //***Click ratio button */
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div[aria-rowindex='4'] div[aria-colindex='2'] input+span")
      .wait(4000)
      .click({ force: true });
    cy.wait(5000);
  }
  /////*****Risk Taxonomy Flyer- Marked Defer*/
  deferMarked(BU1, RiskDefinitionSearch) {
    cy.frameLoaded("#riskTaxonomyApplicabilityFrame");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#s2id_buIdsGrmTaxonomy #select2-chosen-1")
      .click();
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#select2-drop #s2id_autogen1_search")
      .type(BU1)
      .type("{enter}");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Risk Item Filter Input"]')
      .clear({ force: true })
      .type(RiskDefinitionSearch)
      .type("{enter}");

    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Business Area Definitions Filter Input"]')
      .clear({ force: true });
    cy.wait(5000);
    //***Click ratio button */
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div[aria-rowindex='4'] div[aria-colindex='3'] input+span")
      .wait(4000)
      .click({ force: true });
    cy.wait(5000);
  }

  /////*****Risk Taxonomy Flyer- Marked not Applicable*/
  notApplicableMarked(BU3, RiskDefinitionSearch) {
    cy.frameLoaded("#riskTaxonomyApplicabilityFrame");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#s2id_buIdsGrmTaxonomy #select2-chosen-1")
      .should("be.visible")
      .click();
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#select2-drop #s2id_autogen1_search")
      .type(BU3)
      .type("{enter}");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Risk Item Filter Input"]')
      .clear({ force: true })
      .wait(2000)
      .type(RiskDefinitionSearch)
      .type("{enter}");

    cy.wait(5000);
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Business Area Definitions Filter Input"]')
      .clear({ force: true });
    //***Click ratio button */
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div[aria-rowindex='4'] div[aria-colindex='4'] input+span")
      .wait(4000)
      .click({ force: true });
    cy.wait(5000);
  }

  /////*****Risk Taxonomy Flyer- Marked Emerging*/
  emergingMarked(BU4, RiskDefinitionSearch) {
    cy.frameLoaded("#riskTaxonomyApplicabilityFrame");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#s2id_buIdsGrmTaxonomy #select2-chosen-1")
      .should("be.visible")
      .click();
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div#select2-drop #s2id_autogen1_search")
      .type(BU4)
      .type("{enter}");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Risk Item Filter Input"]')
      .clear({ force: true })
      .wait(2000)
      .type(RiskDefinitionSearch)
      .type("{enter}");
    cy.wait(5000);
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Business Area Definitions Filter Input"]')
      .clear({ force: true });
    //***Click ratio button */
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("div[aria-rowindex='4'] div[aria-colindex='5'] input+span")
      .wait(4000)
      .click({ force: true });
    cy.wait(5000);
  }

  markRiskTaxonomy(BU, riskItemSearch, markingType) {
    // Click on BU dropdown
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.get(locators.risk.riskRegister.riskApplicabilityBUOptions).select(BU, {
      force: true,
    });
    // Filter by risk item
    cy.get(locators.risk.riskRegister.riskApplicabilityRiskCatSearch)
      .clear({ force: true })
      .type(riskItemSearch)
      .type("{enter}");
    // Load fixture data and determine column index
    cy.fixture("Administration/RiskRegister/RiskRegister.json").then((data) => {
      const applicabilityStatus =
        data.threeElipsesOptions.riskApplicability.applicabilityStatus;
      let columnIndex;

      switch (markingType) {
        case applicabilityStatus.applicable: // "Applicable"
          columnIndex = "2";
          break;
        case applicabilityStatus.defer: // "Defer"
          columnIndex = "3";
          break;
        case applicabilityStatus.notApplicable: // "Not Applicable"
          columnIndex = "4";
          break;
        case applicabilityStatus.emerging: // "Emerging"
          columnIndex = "5";
          break;
        default:
          throw new Error(`Invalid marking type: ${markingType}.`);
      }

      // Click the appropriate radio button
      cy.get(
        `#riskTaxonomy div[aria-rowindex='4'] div[aria-colindex='${columnIndex}'] input+span`,
        { timeout: 30000 }
      )
        .should("exist")
        .scrollIntoView()
        .wait(1000)
        .click({ force: true });
    });
  }

  saveRiskTaxonomy() {
    cy.get(locators.risk.riskRegister.riskTaxonomySaveBtn)
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.get(locators.risk.riskRegister.riskTaxnomyToastSuccess)
      .should("be.visible")
      .click();
    cy.get(locators.administration.toastMsg).contains("Successfully updated");
  }

  verifyRiskCategoryInGrid(riskCategoryName) {
    return cy
      .get(locators.risk.riskRegister.riskRegisterGrid)
      .contains(riskCategoryName)
      .scrollIntoView()
      .should("exist");
  }

  expandRiskCategoryInGrid(riskCategoryName) {
    this.verifyRiskCategoryInGrid(riskCategoryName).then(($el) => {
      cy.wrap($el)
        .closest(locators.risk.riskRegister.expandRiskCategoryClosetRow)
        .find(locators.general.expandIcon)
        .click();
    });
  }

  verifyRiskDefinitionInGrid(riskDefinitionName) {
    cy.get(locators.risk.riskRegister.riskRegisterGrid)
      .contains(riskDefinitionName)
      .scrollIntoView()
      .should("exist");
  }

  searchRiskDefinition(riskDefinitionName) {
    cy.wait(1000); // Small wait to ensure grid stability before searching
    cy.get(locators.risk.riskRegister.riskGridSearchInput, { timeout: 30000 })
      .should("be.visible")
      .click()
      .clear()
      .wait(700)
      .type("{selectall}{backspace}", { delay: 200 }) // Another way to ensure it's cleared
      .invoke("val", "") // Ensure field is completely empty
      .type(riskDefinitionName)
      .should("have.value", riskDefinitionName); // Verify the value is set

    // Wait for the grid to load and show results
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.waitForMyGridLoaderToDisappear(300000);

    // More flexible assertion for three ellipses - wait for at least 1, expect up to 3
    cy.get(locators.general.threeElipses, { timeout: 30000 })
      .should("have.length.at.least", 1)
      .and("have.length.at.most", 3);
  }

  clickSaveBtn() {
    cy.get(locators.general.formSaveBtn, { timeout: 30000 })
      .scrollIntoView()
      .click();
    // cy.waitForElementToVisible(locators.administration.toastMsg, 50000);
  }

  toggleControlStrengthSetting(enableControlStrength) {
    // Get the control strength checkbox
    cy.get(
      locators.risk.riskRegister.calculations.controlStrengthModuleCustomer
    )
      .scrollIntoView()
      .then(($checkbox) => {
        const isCurrentlyChecked = $checkbox.is(":checked");

        if (enableControlStrength === true) {
          // If we want to enable control strength
          if (!isCurrentlyChecked) {
            // If not checked, check it
            cy.wrap($checkbox).check({ force: true });
          }
        } else if (enableControlStrength === false) {
          // If we want to disable control strength
          if (isCurrentlyChecked) {
            // If checked, uncheck it
            cy.wrap($checkbox).uncheck({ force: true });
          }
        }
      });
  }

  filterCustomer(customerName, sameLikeName = true, customerIndex = 1) {
    cy.get(locators.general.threeElipses).click();
    cy.get(locators.general.filterIconDropDown).click();
    cy.searchFilterName(customerName, "All", sameLikeName, customerIndex);
    cy.get(locators.administration.customers.addedCustomer)
      .contains(customerName)
      .click();
    cy.waitForTopMsgLoaderToDisappear(30000);
  }
  scrollToHorizontalRight() {
    // First scroll horizontally to ensure the column is visible
    cy.get(locators.risk.riskRegister.riskRegisterScrollRight).scrollTo(
      "right"
    );
  }
  scrollToHorizontalCenter() {
    // First scroll horizontally to ensure the column is visible
    cy.get(locators.risk.riskRegister.riskRegisterScrollRight).scrollTo(
      "center"
    );
  }
  scrollToHorizontalLeft() {
    // First scroll horizontally to ensure the column is visible
    cy.get(locators.risk.riskRegister.riskRegisterScrollRight).scrollTo("left");
  }
  selectLikelihoodValue(value) {
    cy.get(locators.risk.riskRegister.inherentLikelihood, { timeout: 30000 })
      .scrollIntoView({ duration: 500 })
      .dblclick()
      .then(() => {
        cy.get(locators.risk.riskRegister.selectLikelihoodImpactOptions, {
          timeout: 30000,
        })
          .contains(value)
          .click();
      });
  }

  selectImpactValue(value) {
    cy.get(locators.risk.riskRegister.inherentImpact, { timeout: 30000 })
      .scrollIntoView({ duration: 500 })
      .wait(2000)
      .dblclick({ delay: 300 })
      .then(() => {
        cy.get(locators.risk.riskRegister.selectLikelihoodImpactOptions, {
          timeout: 30000,
        })
          .contains(value)
          .click();
      });
  }

  selectAssessmentValue(value, type = "likelihood") {
    const openedFrame =
      type === "likelihood"
        ? locators.risk.riskRegister.calculations.withAssessment
            .likelihoodAssessmentFrame
        : locators.risk.riskRegister.calculations.withAssessment
            .impactAssessmentFrame;
    cy.switchToIframe(openedFrame, {
      timeout: 30000,
    }).then(($iframe) => {
      // Select the radio button for the likelihood value
      cy.get($iframe)
        .find(
          locators.risk.riskRegister.calculations.withAssessment.surveyForm,
          { timeout: 30000 }
        )
        .contains(`${value}`)
        .click();
    });
  }

  submitAssessment(type = "likelihood") {
    const openedFrame =
      type === "likelihood"
        ? locators.risk.riskRegister.calculations.withAssessment
            .likelihoodAssessmentFrame
        : locators.risk.riskRegister.calculations.withAssessment
            .impactAssessmentFrame;
    cy.switchToIframe(openedFrame, {
      timeout: 30000,
    }).then(($iframe) => {
      cy.get($iframe)
        .find(
          locators.risk.riskRegister.calculations.withAssessment.submitFormBtn,
          { timeout: 30000 }
        )
        .scrollIntoView()
        .should("be.visible")
        .click();
    });
  }

  assessmentNotVisible(type = "likelihood") {
    const openedFrame =
      type === "likelihood"
        ? locators.risk.riskRegister.calculations.withAssessment
            .likelihoodAssessmentFrame
        : locators.risk.riskRegister.calculations.withAssessment
            .impactAssessmentFrame;
    cy.switchToIframe(openedFrame, {
      timeout: 30000,
    }).then(($iframe) => {
      cy.get($iframe).should("not.exist");
    });
  }

  // Assessment Mode Functions
  selectLikelihoodValueViaAssessment(value) {
    // Double-click on likelihood column to open assessment
    //static wait is required here because when we submit Assessment Survey Form DOM Referesh and we have to get from current frame
    cy.wait(1500);
    cy.get(locators.risk.riskRegister.inherentLikelihood, { timeout: 30000 })
      .scrollIntoView({ block: "nearest", inline: "center" })
      .dblclick();

    cy.wait(8000);
    // Switch to assessment iframe
    this.selectAssessmentValue(value, "likelihood");
    // Submit the assessment
    this.submitAssessment("likelihood");
    this.assessmentNotVisible("likelihood");
  }

  openImpactAssessmentForm(){
    cy.wait(3500);
    cy.get(locators.risk.riskRegister.inherentImpact, { timeout: 30000 })
      .scrollIntoView()
      .dblclick({ delay: 300 });
  }
  selectImpactValueViaAssessment(value, type = "impact") {
    // Double-click on impact column to open assessment
    //static wait is required here because when we submit Assessment Survey Form DOM Referesh and we have to get from current frame
    cy.wait(8000);
    // Switch to assessment iframe
    this.selectAssessmentValue(value, type);
    // Submit the assessment
    this.submitAssessment(type);
    this.assessmentNotVisible(type);
  }

  verifyImpactLikelihoodValue(locator, expectedValue) {
    cy.get(locator, { timeout: 30000 })
      .scrollIntoView()
      .contains(expectedValue);
  }

  clearImpactLikelihoodValue(locator) {
    cy.get(locator, { timeout: 30000 })
      .scrollIntoView()
      .dblclick({ delay: 200 })
      .then(($el) => {
        cy.get($el).find("input").clear();
      });
  }

  editImpactLikelihoodValue(locator, editValue) {
    //static wait is required here because when we Edit Impact Likelihood Value DOM Referesh and we have to get from current frame
    cy.wait(2000);
    cy.get("body").then(($body) => {
      // Dismiss any visible toasts
      if ($body.find(locators.general.toast).length > 0) {
        cy.get(locators.general.toast).each(($toast) => {
          //static wait required for Toast msg if it appeared in refereshed DOM State
          cy.wait(2000);
          if ($toast && $toast.length > 0 && $toast.is(":visible")) {
            cy.wrap($toast).click({ force: true });
          }
        });
      }
    });

    // Retry mechanism for entering edit mode
    cy.wrap(null).then(() => {
      let attempts = 0;
      const maxAttempts = 3;

      const attemptEdit = () => {
        cy.get(locator, { timeout: 30000 })
          .scrollIntoView()
          .should("be.visible")
          .dblclick();

        // Check if edit mode was activated
        cy.get(locator).then(($el) => {
          if ($el.hasClass(locators.risk.riskRegister.inlineEditOption)) {
            // Success - proceed with editing
            cy.get(locator)
              .find("input")
              .should("be.visible")
              .clear()
              .type(editValue)
              .type("{enter}");
          } else if (attempts < maxAttempts) {
            // Retry if not in edit mode
            attempts++;
            cy.wait(2000);
            attemptEdit();
          } else {
            // Force edit mode if retries failed
            cy.get(locator)
              .click()
              .click()
              .then(() => {
                cy.get(locator)
                  .find("input")
                  .should("be.visible")
                  .clear()
                  .type(editValue)
                  .type("{enter}");
              });
          }
        });
      };

      attemptEdit();
    });

    // Verify the operation completed
    cy.get(locator)
      .should("not.have.class", "ag-cell-inline-editing")
      .should("contain.text", editValue);

    cy.waitForTopMsgLoaderToDisappear(300000);
  }

  selectControlStrength(value) {
    cy.get(".ag-row-level-1 [col-id='controlStrengthLabel']", {
      timeout: 30000,
    })
      .wait(2000)
      .dblclick({ delay: 300 })
      .then(() => {
        cy.get(".select2-result-label", { timeout: 30000 })
          .contains(value)
          .click({ force: true });
      });
  }

  deselectAssessedOptionControlStrength(controlStrengthValue) {
    cy.get(locators.risk.riskRegister.calculations.withAssessment.controlStrengthOption, {
      timeout: 30000,
    })
      .wait(2000)
      .dblclick({ delay: 300 })
      .then(() => {
        cy.get(locators.risk.riskRegister.calculations.withAssessment.backButton, { timeout: 30000 })
          .click();
        cy.get(locators.risk.riskRegister.calculations.withAssessment.controlStrengthDropDownOptions, { timeout: 30000 })
          .contains(controlStrengthValue)
          .click({ force: true });
      });
  }

  verifyCalculatedRiskLabel(expectedRiskLabel, riskTypeLocator) {
    //static wait is required here because when Assessment Submit Dom Referesh and we have to get from current frame
    cy.wait(1500);
    cy.get(riskTypeLocator, { timeout: 30000 })
      .scrollIntoView()
      .wait(1500)
      .contains(expectedRiskLabel);
  }

  // Function to convert calculated value to display format
  formatRiskValue(calculatedValue) {
    return calculatedValue.toFixed(4); // Converts to string with 4 decimal places
  }

  verifyControlInFlyover(
    controlName,
    removed = false,
    actionPerformed = "Delete"
  ) {
    //static wait is required here because the Control Window becomes white when open and it takes time to load the data
    cy.wait(10000);
    cy.switchToIframe(locators.risk.riskRegister.controlFlyoverFrame).then(
      ($iframe) => {
        if (!removed) {
          cy.get($iframe)
            .find(locators.risk.riskRegister.calculations.controlFlyover, {
              timeout: 40000,
            })
            .should("be.visible")
            .within(() => {
              // More robust approach - find the row containing the control name
              cy.get("tbody tr").each(($row) => {
                cy.wrap($row).within(() => {
                  cy.get("td").then(($cells) => {
                    const rowText = $cells.text();
                    if (rowText.includes(controlName)) {
                      cy.get("a").contains(actionPerformed).click();
                      return false; // Break the loop
                    }
                  });
                });
              });
            });
        } else {
          cy.get($iframe)
            .find(locators.risk.riskRegister.calculations.controlFlyover, {
              timeout: 40000,
            })
            .should("not.exist");
        }
      }
    );
  }

  clickAskDeleteBtn() {
    cy.switchToIframe(locators.risk.riskRegister.controlFlyoverFrame).then(
      ($iframe) => {
        cy.get($iframe)
          .find(locators.risk.riskRegister.calculations.deleteControl, {
            timeout: 40000,
          })
          .should("be.visible")
          .click();
      }
    );
  }

  clickAskUnlinkBtn() {
    cy.switchToIframe(locators.risk.riskRegister.controlFlyoverFrame).then(
      ($iframe) => {
        cy.get($iframe)
          .find(locators.risk.riskRegister.calculations.unlinkControl, {
            timeout: 30000,
          })
          .should("be.visible")
          .click();
      }
    );
  }

  // Most robust approach - using within() for better scoping
  verifyStatsTableValues(calculatedValue) {
    const expectedValue = this.formatRiskValue(calculatedValue);
    //static wait is required here because when we open Control Flyover white screen appears until the data not laoded
    cy.wait(15000);
    cy.switchToIframe(locators.risk.riskRegister.controlFlyoverFrame).then(
      ($iframe) => {
        cy.get($iframe)
          .find(locators.risk.riskRegister.statsRatingControlFlyover, {
            timeout: 30000,
          })
          .should("be.visible")
          .first()
          .within(() => {
            // Inherent Risk Rating (1st column)
            cy.get("td").eq(0).should("contain.text", expectedValue);
            // Control Strength (2nd column) - should be empty
            cy.get("td").eq(1).should("have.text", "0.0000");
            // Residual Risk Rating (3rd column)
            cy.get("td").eq(2).should("contain.text", expectedValue);
            // Current Risk Rating (4th column)
            cy.get("td").eq(3).should("contain.text", expectedValue);
          });
      }
    );
  }

  verifyStatsTableValuesWithControlStrength(
    controlStrength,
    residualRisk,
    currentRisk,
    calInherentRisk="25.0000"
  ) {
    const inherentRisk = calInherentRisk;
    //static wait is required here because when we open Control Flyover white screen appears until the data not laoded
    cy.wait(15000);
    cy.switchToIframe(locators.risk.riskRegister.controlFlyoverFrame).then(
      ($iframe) => {
        cy.get($iframe)
          .find(locators.risk.riskRegister.statsRatingControlFlyover, {
            timeout: 30000,
          })
          .should("be.visible")
          .first()
          .within(() => {
            // Inherent Risk Rating (1st column)
            cy.get("td").eq(0).should("contain.text", inherentRisk);
            // Control Strength (2nd column)
            cy.get("td").eq(1).should("contain.text", controlStrength);
            // Residual Risk Rating (3rd column)
            cy.get("td").eq(2).should("contain.text", residualRisk);
            // Current Risk Rating (4th column)
            cy.get("td").eq(3).should("contain.text", currentRisk);
          });
      }
    );
  }

  clickAddControlBtn() {
    cy.get(".btn.p-1.mr-1", { timeout: 30000 })
      .contains("Add Control Instance")
      .dblclick({ force: true });
  }

  clickLinkControlBtn() {
    cy.get(".btn.p-1", { timeout: 30000 })
      .contains("Link Control Instance")
      .dblclick({ force: true });
  }

  openControlSubGrid() {
    cy.get(locators.risk.riskRegister.calculations.openControlSubgrid, {
      timeout: 30000,
    })
      .scrollIntoView({ block: "center" })
      .should("be.visible")
      .click();
  }

  fillAddControlSubGridForm(controlCategory, controlDefinition) {
    cy.get(".aciTreeEntry", { timeout: 30000 })
      .contains(controlCategory)
      .should("be.visible")
      .dblclick();

    cy.get(".aciTreeItem", { timeout: 30000 })
      .contains(controlDefinition, { timeout: 30000 })
      .should("be.visible")
      .click();
  }

  selectControlFromLinkInstance(controlType, controlDefinition) {
    cy.get(
      locators.risk.riskRegister.calculations.selectPreventativeControl
    ).click();
    cy.dropDownSearchAndSelect(locators.general.dropDownSearch, controlType);
  }

  searchControlInLinkSubGrid(controlDefinition) {
    cy.get(locators.risk.riskRegister.calculations.searchControlSubgrid, {
      timeout: 30000,
    })
      .eq(13)
      .should("be.visible")
      .and("not.be.disabled")
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 300 })
      .type(controlDefinition)
      .type("{enter}");
  }

  selectControlDefinition() {
    cy.get(locators.risk.riskRegister.calculations.selectControl, {
      timeout: 30000,
    })
      .eq(1)
      .should("be.visible")
      .click();
  }

  clickLinkBtn() {
    cy.get(locators.risk.riskRegister.calculations.linkBtn)
      .should("be.visible")
      .click({ force: true });
  }

  addControlSubGridSaveBtn(saveBtnText = "Save") {
    cy.get(locators.risk.riskRegister.calculations.addControlForm).then(
      ($modal) => {
        cy.wrap($modal)
          .contains(saveBtnText)
          .should("be.visible")
          .wait(1500)
          .click();
        cy.wrap($modal)
          .contains(saveBtnText)
          .should("not.be.visible", { timeout: 30000 });
      }
    );
  }

  addControlToRisk(allControlsToAdd, impactEfficacyValue = "50") {
    this.openControlSubGrid();
    allControlsToAdd.forEach(($control) => {
      this.clickAddControlBtn();
      this.fillAddControlSubGridForm("Control Category A", $control);
      ["#efficacy", "#implemented"].forEach(($loc) => {
        cy.get($loc).scrollIntoView().clear().type(impactEfficacyValue);
      });
      this.addControlSubGridSaveBtn();
      this.verifyAddedControl($control);
    });
  }

  linkControlToRisk(allControlsToAdd, controlType = "Corrective") {
    this.openControlSubGrid();
    this.clickLinkControlBtn();
    allControlsToAdd.forEach(($control) => {
      cy.readFile(riskRegisterData).then((data) => {
        if (
          $control !=
          data.calculations.withControlStrength.updatedLikelihoodImpact
            .linkedControlName
        )
          this.selectControlFromLinkInstance(controlType, $control);
        this.searchControlInLinkSubGrid($control);
        cy.wait(2000);
        this.selectControlDefinition();
        if (
          $control ===
          data.calculations.withControlStrength.updatedLikelihoodImpact
            .linkedControlName
        ) {
          this.clickLinkBtn();
          //click Yes Button.
          cy.get(locators.risk.riskRegister.calculations.askLinkYesBtn, {
            timeout: 30000,
          }).click({ force: true });
        }
      });
    });
  }
  clickYesModalBtn() {
    //click Yes Button.
    cy.get(locators.risk.riskRegister.calculations.askLinkYesBtn, {
      timeout: 30000,
    }).click();
  }

  clickYesBtnOnUnlinkControl() {
    cy.get(locators.risk.riskRegister.calculations.askLinkYesBtn, {
      timeout: 30000,
    }).click();
  }

  scrollSubGridToRight() {
    cy.get(locators.risk.riskRegister.riskRegisterGridScroll, {
      timeout: 30000,
    })
      .eq(0)
      .scrollTo("right");
  }

  searchControlInSubGrid(controlName) {
    cy.get(locators.risk.administration.riskTaxonomies.searchRiskDefinition, {
      timeout: 30000,
    })
      .eq(0)
      .should("be.visible")
      .type(controlName, { delay: 250 })
      .type("{enter}");
  }
  addControlWeight(addedControlIndex = 1, weightValue = "100") {
    // Scroll the subgrid horizontally to the right to make the weight column visible
    this.scrollSubGridToRight();

    // Wait for the scroll to complete and the column to be visible
    //static wait is required here when control is added DOM Referesh in the new state
    cy.wait(1500);
    cy.get(locators.risk.riskRegister.calculations.subgridWeight, {
      timeout: 30000,
    })
      .should("have.length", 2)
      .eq(addedControlIndex)
      .scrollIntoView()
      .dblclick({ delay: 3500 })
      .then(() => {
        cy.get(locators.risk.riskRegister.calculations.subgridWeightInput, {
          timeout: 30000,
        })
          .clear()
          .type(`${weightValue}`, { delay: 200 })
          .type("{enter}", { delay: 200 });
      });
  }

  selectSubGridControlStrength(controlStrength) {
    cy.get(locators.risk.riskRegister.calculations.subgridControlStrength, {
      timeout: 30000,
    })
      .eq(1)
      .scrollIntoView()
      .click({ delay: 8000, force: true })
      .then(() => {
        cy.get(
          locators.risk.riskRegister.calculations.subgridControlStrengthSelect,
          { timeout: 30000 }
        )
          .contains(controlStrength)
          .should("be.visible")
          .wait(2000)
          .click({ force: true });
      });
    cy.get(locators.risk.riskRegister.calculations.subgridControlStrength, {
      timeout: 30000,
    })
      .eq(1)
      .contains(controlStrength, { timeout: 30000 });
  }

  verifyGridWeight() {
    cy.get(".ag-row-level-1 [col-id='controlWeight']", { timeout: 30000 })
      .scrollIntoView()
      .should("have.text", "100");
  }

  verifyAddedControl(controlName) {
    cy.get("[role='gridcell'] span")
      .contains(controlName, { timeout: 30000 })
      .scrollIntoView()
      .should("exist");
  }

  openControlFlyover() {
    //static wait is required here because when we open Control Flyover white screen appears until the data not laoded
    cy.wait(5000);
    cy.waitForTopMsgLoaderToDisappear(300000);
    cy.get(locators.general.threeElipses)
      .wait(1000)
      .eq(1)
      .should("be.visible")
      .click()
      .then(() => {
        cy.get(locators.risk.riskRegister.controlBtnThreeElipses)
          .should("be.visible")
          .click();
      });
  }

  closeTheFlyover() {
    cy.get(locators.general.closeFlyover).click({
      multiple: true,
      force: true,
    });
  }

  addRiskCategory(riskName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);
    cy.wait(5000);
    cy.get("#addRootCategoryLink > span").click();

    cy.get("#rootCategoryName").type(riskName);
    cy.get("#rootCategoryName").type(timeStamp);

    cy.get("#rootCategoryDescription").type(description);
    cy.get("#rootCategoryDescription").type(timeStamp);

    ///### Click on save button ###//
    cy.get(
      '[aria-describedby="rootRiskCategory-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
  }

  ///***Three Ellipsis Risk Instance*/
  riskInstanceThreeEllipsis() {
    ///***Scroll Page  */
    cy.wait(2000);
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(4000);
    cy.get(
      ".ag-row-level-0 > .actionsCell > .d-inline-block > .actionDropDWrap > .btn"
    ).click();
  }

  ///***Three Ellipsis Add Risk Category Risk Instance*/
  riskInstanceThreeEllipsisAddRiskCategory(riskName, description) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#addCategoryBtn").click();
    cy.get("#categoryName").type(riskName);
    cy.get("#categoryName").type(timeStamp);

    cy.get("#categoryDescription").type(description);
    cy.get("#categoryDescription").type(timeStamp);

    cy.get(
      '[aria-describedby="riskCategory-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
  }
  ///***Three Ellipsis Add Risk Definition Risk Instance*/
  riskInstanceThreeEllipsisAddRiskDefinition(definitionName, description) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#addRiskDefinitionBtn").click();
    cy.get(".col-md-8 > #riskDefinitionName").type(definitionName);
    cy.get(".col-md-8 > #riskDefinitionName").type(timeStamp);

    cy.switchToIframe("#cke_3_contents > .cke_wysiwyg_frame")
      .type(description)
      .type(timeStamp);
    cy.get(
      '[aria-describedby="addRiskDefinition-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
  }

  ///***Three Ellipsis Add Risk Definition Risk Instance*/
  riskInstanceThreeEllipsisAddRiskItem(
    riskDefinition,
    riskName,
    riskdescription,
    approach,
    BU
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#addRiskItemBtn").click({ force: true });
    cy.get("#select2-chosen-22").click();
    cy.get("#s2id_autogen22_search").type(riskDefinition).type("{enter}");
    cy.get("#riskItemName").type(riskName);
    cy.get("#riskItemName").type(timeStamp);
    cy.get("div#riskItemLevel-modal textarea#riskDescription").type(
      riskdescription
    );
    cy.get("div#riskItemLevel-modal textarea#riskDescription").type(timeStamp);
    //**Enter Approach */
    cy.get("#s2id_approach span[id*='select2']").click();
    cy.get("div#select2-drop input").type(approach).type("{enter}");

    //**Enter BU */

    cy.get("#s2id_buIds span[id*='select2']").click();
    cy.get("div#select2-drop input").type(BU).type("{enter}");

    //**Save */
    cy.get("div#riskItemLevel-modal+div button").eq(0).click();
  }
  ///***Three Ellipsis Add Messaging Risk Instance*/
  riskInstanceThreeEllipsisMessage(Message) {
    cy.get('div.actionDropDWrap.show a[href="javascript:void(0)"]').click();
    cy.wait(3000);
    cy.get(
      "#sendMessageModal > .modal-dialog > .modal-content > .modal-body > .mentions-input-box > #new_msg"
    ).type(Message);
    cy.get(
      "#sendMessageModal > .modal-dialog > .modal-content > .modal-body > .text-right > #sendMessage"
    ).click();
    cy.wait(2000);
    cy.get(
      "#sendMessageModal > .modal-dialog > .modal-content > .modal-header > .close"
    ).click();
  }

  searchRiskInstance(RiskDefinitionSearch) {
    cy.get("input[aria-label='Risk Filter Input']")
      .eq(0)
      .should("be.visible")
      .clear()
      .wait(3000)
      .type(RiskDefinitionSearch);
    cy.wait(4000);
  }

  addResidualColumnInGrid() {
    //clicks on column filter icon
    cy.get("#myGrid span.ag-icon-columns").click({ force: true });
    //type in the filter input to search for the column
    cy.get("#myGrid input[aria-label='Filter Columns Input']")
      .clear()
      .type("Residual");
    cy.wait(2000);
    //checks the checkbox for the column
    cy.get("div[ref='cbSelect'] input").eq(0).check();
    cy.get("div[ref='cbSelect'] input").eq(0).should("be.checked");
    //clicks on column filter icon again to close the column filter
    cy.get("#myGrid span.ag-icon-columns").click({ force: true });
  }

  inherentResidualSelectionGrid(
    Approach,
    InherentLikelihood,
    InherentImpact,
    ResidualLikelihood,
    ResidualImpact
  ) {
    // //clicks on column filter icon

    this.addResidualColumnInGrid();
    ////*******Select Approach Value****/////
    cy.get('.ag-row-last > [col-id="approach"]').dblclick();
    //Value select
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Approach)
      .click();
    cy.wait(5000);
    ////*******Select Likelihood Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentL.name"]').dblclick();
    cy.wait(5000);
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(InherentLikelihood)
      .click();
    cy.wait(2000);
    ////*******Select Impact Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentI.name"]').dblclick();
    cy.wait(2000);
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(InherentImpact)
      .click();
    cy.wait(2000);
    cy.get(".toast").contains(
      "Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically."
    );
    cy.wait(2000);

    ///***Scroll Page  */
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);

    ////*******Select Likelihood Value  - Residual****/////
    cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualLikelihood)
      .click();
    cy.wait(2000);

    ////*******Select Impact Value  - Residual****////
    cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualImpact)
      .click();
    cy.wait(2000);
    cy.get(".toast").contains(
      "Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically."
    );
    //cy.wait(5000);
  }

  inherentRiskCalculateValue() {
    cy.get('.ag-row-last > [col-id="inherentR.name"] span')
      .invoke("text")
      .then((text) => {
        cy.log("===================" + text);
        cy.writeFile(writefile_inherentR_name, text);
        cy.wait(6000);
      });
  }

  inherentRiskCalculateVale() {
    cy.get('.ag-row-last > [col-id="inherentR.name"] span')
      .invoke("text")
      .then((text) => {
        cy.log("===================" + text);
        cy.writeFile(writefile_inherentR_name, text);
        cy.wait(6000);
      });
  }

  residualRiskCalculateVale() {
    cy.get('.ag-row-last > [col-id="residualR.name"] span')
      .invoke("text")
      .then((text) => {
        cy.log("===================" + text);
        cy.writeFile(writefile_residualR_name, text);
        cy.wait(6000);
      });
  }

  inherent_Likeihood_SurveyLable_RiskRegister() {
    cy.get('.ag-row-last > [col-id="inherentL.name"] span')
      .invoke("text")
      .then((text) => {
        cy.log("===================" + text);
        cy.writeFile(writefile_inherentLikeihood_name, text);
        cy.wait(6000);
      });
  }

  inherent_Impact_SurveyLable_RiskRegister() {
    cy.get('.ag-row-last > [col-id="inherentI.name"] span')
      .invoke("text")
      .then((text) => {
        cy.log("===================" + text);
        cy.writeFile(writefile_inherentImpact_name, text);
        cy.wait(6000);
      });
  }

  controlsGridValues(Effectiveness, Implemented) {
    ///*****Control Effectiveness */
    cy.get('.ag-row-last > [col-id="efficacy"]').dblclick();
    cy.wait(1000);
    cy.get('.ag-row-last > [col-id="efficacy"]')
      .clear()
      .type(Effectiveness)
      .type("{enter}");
    cy.wait(1000);
    ///*****Control implemented */
    cy.get('.ag-row-last > [col-id="implemented"]').dblclick();
    cy.wait(1000);
    cy.get('.ag-row-last > [col-id="implemented"]')
      .clear()
      .type(Implemented)
      .type("{enter}");
    cy.wait(3000);
  }

  manageDetailControls(
    Approach,
    Q1InherentLikelihood,
    Q2InherentLikelihood,
    Q1InherentImpact,
    Q2InherentImpact,
    ControlAdd,
    Effectiveness,
    Implemented,
    ControlStrength,
    Q1Assessed,
    Q2Assessed,
    ResidualLikelihood,
    ResidualImpact
  ) {
    ////*******Select Approach Value****/////
    cy.get('.ag-row-last > [col-id="approach"]')
      .should("be.visible")
      .dblclick();
    //Value select
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Approach)
      .should("be.visible")
      .click();
    cy.wait(2000);
    // ////*******Select Likelihood Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentL.name"]')
      .should("be.visible")
      .dblclick();
    cy.wait(2000);
    cy.get("#surveyform")
      .contains(Q1InherentLikelihood)
      .should("be.visible")
      .click();
    cy.get("button").contains("Next").should("be.visible").click();
    cy.get("#surveyform")
      .contains(Q2InherentLikelihood)
      .should("be.visible")
      .click();
    cy.get("button").contains("Submit").should("be.visible").click();
    cy.wait(5000);

    // ////*******Select Impact Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentI.name"]')
      .should("be.visible")
      .dblclick();
    cy.wait(5000);
    cy.get("#surveyform")
      .contains(Q1InherentImpact)
      .should("be.visible")
      .click();
    cy.get("button").contains("Next").should("be.visible").click();
    cy.get("#surveyform")
      .contains(Q2InherentImpact)
      .should("be.visible")
      .click();
    cy.get("button").contains("Submit").should("be.visible").click();
    cy.wait(5000);

    ///*****Control Text Adding */
    cy.get('.ag-row-last > [col-id="controls"]').dblclick();
    cy.wait(5000);
    cy.get("#cke_265_contents > .cke_wysiwyg_frame")
      .type(ControlAdd)
      .type("{enter}");
    cy.wait(2000);

    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);
    ///*****Control Strength */
    cy.get('.ag-row-level-1 > [col-id="controlStrengthLabel"]').dblclick();
    // cy.wait(10000);
    cy.get("#select2-drop").contains(ControlStrength).click();
    cy.wait(5000);
    cy.get("#surveyform").contains(Q1Assessed).click();
    cy.wait(2000);
    cy.get("button").contains("Next").click();
    cy.wait(2000);
    cy.get("#surveyform").contains(Q2Assessed).click();
    cy.wait(2000);
    cy.get("button").contains("Submit").click();
    cy.wait(3000);

    ///***Scroll Page  */
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);
    // ////*******Select Likelihood Value  - Residual****/////
    cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualLikelihood)
      .click();
    cy.wait(2000);
    ////*******Select Impact Value  - Residual****////
    cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualImpact)
      .click();
    cy.wait(5000);
    //cy.reload(true).wait(10000);

    // cy.get('.ag-group-contracted > .ag-icon').click();
    // cy.wait(5000);

    ///*****Control Effectiveness */
    // cy.get('[col-id="efficacy"]').wait(2000).contains(Effectiveness);

    ///Scroll Center ///
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("center"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);

    cy.get('.ag-row-last > [col-id="efficacy')
      .wait(2000)
      .contains(Effectiveness);
    cy.wait(2000);
    ///*****Control implemented */
    // cy.get('[col-id="implemented"]').wait(2000).contains(Implemented);
    cy.get('.ag-row-last > [col-id="implemented"]')
      .wait(2000)
      .contains(Implemented);
    cy.wait(3000);
  }

  useAssessmentstoCalculateInherentRisk_Enabled(
    Approach,
    Q1InherentLikelihood,
    Q2InherentLikelihood,
    Q1InherentImpact,
    Q2InherentImpact,
    Effectiveness,
    Implemented,
    ControlStrength,
    Q1Assessed,
    Q2Assessed,
    ResidualLikelihood,
    ResidualImpact
  ) {
    ////*******Select Approach Value****/////
    cy.get('.ag-row-last > [col-id="approach"]')
      .should("be.visible")
      .dblclick();
    //Value select
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Approach)
      .should("be.visible")
      .click();
    cy.wait(2000);
    // ////*******Select Likelihood Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentL.name"]')
      .should("be.visible")
      .dblclick();
    cy.wait(2000);
    cy.get("#surveyform")
      .contains(Q1InherentLikelihood)
      .should("be.visible")
      .click();
    cy.get("button").contains("Next").should("be.visible").click();
    cy.get("#surveyform")
      .contains(Q2InherentLikelihood)
      .should("be.visible")
      .click();
    cy.get("button").contains("Submit").should("be.visible").click();
    cy.wait(5000);

    // ////*******Select Impact Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentI.name"]')
      .should("be.visible")
      .dblclick();
    cy.wait(5000);
    cy.get("#surveyform")
      .contains(Q1InherentImpact)
      .should("be.visible")
      .click();
    cy.get("button").contains("Next").should("be.visible").click();
    cy.get("#surveyform")
      .contains(Q2InherentImpact)
      .should("be.visible")
      .click();
    cy.get("button").contains("Submit").should("be.visible").click();
    cy.wait(5000);

    ///***Scroll Page  */
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);
    // ////*******Select Likelihood Value  - Residual****/////
    cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualLikelihood)
      .click();
    cy.wait(2000);
    ////*******Select Impact Value  - Residual****////
    cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(ResidualImpact)
      .click();
    cy.wait(5000);
    cy.reload(true).wait(10000);

    cy.get(".ag-group-contracted > .ag-icon").click();
    cy.wait(5000);

    ///*****Control Effectiveness */
    // cy.get('[col-id="efficacy"]').wait(2000).contains(Effectiveness);
    cy.get('.ag-row-no-focus > [aria-colindex="16"]')
      .wait(2000)
      .contains(Effectiveness);
    cy.wait(2000);
    ///*****Control implemented */
    // cy.get('[col-id="implemented"]').wait(2000).contains(Implemented);
    cy.get('.ag-row-no-focus > [aria-colindex="17"]')
      .wait(2000)
      .contains(Implemented);
    cy.wait(3000);
  }

  detailFlyerRiskInstance(
    RiskInstanceDescription,
    PersonsResponsible,
    Frequency,
    TimesPer,
    FrequencyExplanation,
    Outcome,
    OutcomeDescription,
    ManagementComments,
    Context
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#detailModalFlyerOpenr").click();
    cy.wait(3000);
    cy.switchToIframe("#cke_1_contents > .cke_wysiwyg_frame")
      .clear()
      .type(RiskInstanceDescription)
      .type(timeStamp);
    ///*****Risk Events */
    cy.get("div#s2id_riskEventIdsD a").click();
    cy.get("div#select2-drop input").type("{downArrow}").type("{enter}");
    cy.wait(2000);
    ///**** Frequency ***/
    cy.get("#frequencyCountD").clear().type(Frequency);
    ///**** Time Per ***/
    cy.get("div#s2id_frequencyOccurenceD a").click();
    cy.get("div#select2-drop input").type(TimesPer).type("{enter}");
    ///**** Frequency Explanation ***/
    cy.get("#frequencyExplanationD")
      .clear()
      .type(FrequencyExplanation)
      .type(timeStamp);
    ///**** Outcome ***/
    cy.get("#outcomeD").clear().type(Outcome).type(timeStamp);
    ///**** Outcome Description ***/
    cy.get("#cke_3_contents > .cke_wysiwyg_frame")
      .type(OutcomeDescription, { force: true })
      .type(timeStamp);
    ///**** Management Comments ***/
    cy.switchToIframe("#cke_2_contents > .cke_wysiwyg_frame")
      .clear()
      .type(ManagementComments)
      .type(timeStamp);
    ///**** Context ***/
    cy.get("#contextD").clear().type(Context).type(timeStamp);
    cy.wait(2000);
    ///**** Save button click ***/
    cy.get(".m-form__actions > .btn-primary").click();
  }
  ////****Manage Detailed Control - Risk Register grid data Edited  */
  riskRegisterGridEdit(Approach, ControlAdd, Effectiveness, Implemented) {
    ////*******Select Approach Value****/////
    cy.get('.ag-row-last > [col-id="approach"]').dblclick();
    //Value select
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Approach)
      .click();
    cy.wait(4000);
    //*****Edit Control Text */
    cy.get('.ag-row-last > [col-id="controls"]').dblclick();
    cy.wait(2000);
    cy.get("#cke_265_contents > .cke_wysiwyg_frame")
      .type(ControlAdd)
      .type("{enter}");

    cy.wait(1000);
    ///*****Control Effectiveness */
    ///Scroll
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);
    cy.get('.ag-row-last > [col-id="efficacy"]').dblclick();
    cy.wait(1000);
    cy.get('.ag-row-last > [col-id="efficacy"]')
      .clear()
      .type(Effectiveness)
      .type("{enter}");
    cy.wait(1000);
    ///*****Control implemented */
    cy.get('.ag-row-last > [col-id="implemented"]').dblclick();
    cy.wait(1000);
    cy.get('.ag-row-last > [col-id="implemented"]')
      .clear()
      .type(Implemented)
      .type("{enter}");
    cy.wait(3000);
  }

  inherentRiskProbabilityFlyer(Q1InherentLikelihood, Q2InherentLikelihood) {
    cy.get("#riskProbabilityAnalysisModalOpenr").click();
    cy.wait(10000);
    cy.frameLoaded("#iframe-risk-register-prob-modal");
    cy.iframe("#iframe-risk-register-prob-modal")
      .find("#surveyform")
      .contains(Q1InherentLikelihood)
      .click();
    cy.iframe("#iframe-risk-register-prob-modal")
      .find("#surveyform")
      .contains(Q2InherentLikelihood)
      .click();
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-prob-modal")
      .find("button")
      .contains("Submit")
      .click();
    cy.wait(7000);
  }

  inherentRiskImpactFlyer(Q1InherentImpact, Q2InherentImpact) {
    cy.get("#riskImpactAnalysisModalOpenr").click();
    cy.wait(10000);
    cy.frameLoaded("#iframe-risk-register-impact-modal");
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("#surveyform")
      .contains(Q1InherentImpact)
      .click();
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("#surveyform")
      .contains(Q2InherentImpact)
      .click();
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("button")
      .contains("Submit")
      .click();
    cy.wait(7000);
  }

  controlEnvironmenttAssessment(Q1Assessed, Q2Assessed) {
    cy.get("#controlEnvironmentAssessmentModalOpenr").click();
    cy.wait(5000);
    cy.frameLoaded("#iframe-risk-register-impact-modal");
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("#surveyform")
      .contains(Q1Assessed)
      .click();
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("#surveyform")
      .contains(Q2Assessed)
      .click();
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-impact-modal")
      .find("button")
      .contains("Submit")
      .click();
    cy.wait(7000);
  }

  controlFlyerRiskInstance(
    ControlCategoryTreeMapping,
    ControlInstanceID,
    ControlName,
    ControlDescription,
    ControlTypes,
    ControlOwner,
    ControlTester,
    Effectiveness,
    Weight,
    Implemented,
    ControlStrength
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#controlModalOpenr").should("be.visible").click();
    cy.wait(6000);
    cy.frameLoaded("#iframe-risk-register-control-modal");
    cy.iframe("#iframe-risk-register-control-modal")
      .xpath('//a[contains(text(),"Add Control Instance")]')
      .click();
    cy.wait(5000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#riskControlItemsTreeDivForControlInstance")
      .contains(ControlCategoryTreeMapping)
      .type("{enter}");
    cy.wait(3000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        ".aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
      )
      .click();
    cy.wait(5000);
    /////****Control Instance data fill */
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#controlInstId")
      .clear()
      .type(ControlInstanceID)
      .type(timeStamp);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#ControlInstanceName")
      .clear()
      .type(ControlName)
      .type(timeStamp);
    cy.iframe("#iframe-risk-register-control-modal")
      .switchToIframe("#cke_2_contents > .cke_wysiwyg_frame")
      .clear()
      .type(ControlDescription)
      .type(timeStamp);
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#s2id_controlTypes")
      .click();
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#select2-drop > div")
      .type(ControlTypes)
      .type("{enter}");
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#s2id_controlOwner")
      .click();
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#select2-drop > div")
      .type(ControlOwner)
      .type("{enter}");
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#s2id_controlTester")
      .click();
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#select2-drop > div")
      .type(ControlTester)
      .type("{enter}");
    cy.wait(1000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#Efficacy")
      .clear()
      .type(Effectiveness);
    cy.wait(1000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#Weight")
      .clear()
      .type(Weight);
    cy.wait(1000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#Implemented")
      .clear()
      .type(Implemented);
    cy.wait(1000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#s2id_controlStrength")
      .click();
    cy.wait(1000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#select2-drop > div")
      .type(ControlStrength)
      .type("{enter}");
    ////***Save Click */
    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        "#controlInstanceFormModal > div > div > div.modal-footer > button.btn.btn-primary"
      )
      .click();
    cy.wait(10000);
    // cy.iframe('#iframe-risk-register-control-modal').find('.toast-message').contains('Control Instance Sucessfully Saved!');
  }

  linkControlFlyer(ControlTypes) {
    ///**Click on Link Controls - Control Flyer */

    cy.get("#controlModalOpenr").click();
    cy.wait(6000);
    cy.frameLoaded("#iframe-risk-register-control-modal");
    cy.iframe("#iframe-risk-register-control-modal")
      .xpath('//a[contains(text(),"Link Control Instance")]')
      .click();
    cy.wait(5000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#s2id_controlTypeID")
      .click();
    cy.wait(5000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#select2-drop > div")
      .type(ControlTypes)
      .type("{enter}");
    cy.wait(15000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        "#riskRegisterItemsTable > div > div.ag-root-wrapper-body.ag-layout-normal > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-no-focus.ag-row-even.ag-row-level-0.ag-row-position-absolute.ag-row-first > div:nth-child(3) > input[type=checkbox]"
      )
      .check();
    cy.wait(7000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#linkButton")
      .click();
    cy.wait(7000);

    // cy.iframe('#iframe-risk-register-control-modal').xpath('//*[@id="runTimeControlOwnerTable"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[2]').dblclick();
    // cy.iframe('#iframe-risk-register-control-modal').find('#runTimeControlOwnerTable > div > div.ag-theme-balham > div > div > div.ag-rich-select-list > div > div > div > div > span').click();
    // cy.iframe('#iframe-risk-register-control-modal').find('#addControlOwnerButton').click();

    // cy.iframe('#iframe-risk-register-control-modal').find('.toast').contains('Linked Successfully');
  }

  deleteControlFromFlyer() {
    ///**Click on Link Controls - Control Flyer */

    cy.get("#controlModalOpenr", { timeout: 25000 }).click();
    cy.wait(6000);

    cy.switchIframe("#iframe-risk-register-control-modal").within(() => {
      cy.get(
        "tr:nth-child(1) a[onclick*='checkControlInstancesImpact']"
      ).click();
      cy.get("#delete-modal button#deleteControlInstance").click();
      cy.wait(2000);
    });
  }

  auditLogFlyer() {
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-odd.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last.ag-row-focus.ag-row-selected > div.ag-cell.ag-cell-not-inline-editing.ag-cell-auto-height.actionsCell.ag-cell-value.ag-cell-focus > div > div > div > a:nth-child(4)"
    ).click();
    cy.get(
      "#auditTrail-modal > .modal-dialog > .modal-content > .modal-header"
    ).contains("Audit Log");
    cy.wait(7000);
    cy.get(
      "#auditTrail-modal > .modal-dialog > .modal-content > .modal-footer > .btn"
    ).click();
  }

  ////***Risk Register ---- Updete Control Grid values ****/
  controlGrid(ControlName, Effectiveness, Implemented, Weight) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    ///**Control Inline editor click */
    cy.get(
      ".ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted > .ag-icon"
    ).click();
    cy.wait(6000);
    ///**Control Inline Text box  click */
    cy.get('.ag-row-last > [aria-colindex="10"] > span')
      .wait(5000)
      .dblclick({ force: true });
    cy.wait(3000);
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div.ag-theme-balham > div > div.ag-theme-balham.ag-popup > div > div > div"
    )
      .clear()
      .wait(2000)
      .type(ControlName)
      .type(timeStamp)
      .type("{enter}");
    cy.wait(3000);
    cy.get('.ag-row-last > [aria-colindex="12"]')
      .dblclick()
      .clear()
      .wait(1000)
      .type(Effectiveness);
    cy.wait(2000);
    cy.get('.ag-row-last > [aria-colindex="13"]')
      .dblclick()
      .clear()
      .wait(1000)
      .type(Implemented);
    cy.wait(2000);
    cy.get('.ag-row-last > [aria-colindex="14"]')
      .dblclick()
      .clear()
      .wait(1000)
      .type(Weight);
    cy.wait(2000);
    cy.get('.ag-row-last > [aria-colindex="26"]').scrollIntoView().click();
    cy.get('[aria-posinset="3"] > .ag-rich-select-row').click();
    cy.wait(10000);
  }
  editControlValueGrid(Description, ControlType) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    ///**Click on edit button - Control Inline editor */
    cy.get(
      ".ag-row-last > .actionsCell > .d-inline-block > #editControlBtn > .fa"
    )
      .should("be.visible")
      .click();
    cy.wait(5000);
    cy.get("#cke_6_contents > .cke_wysiwyg_frame")
      .type(Description, { force: true })
      .type(timeStamp, { force: true });
    cy.wait(1000);
    cy.get(
      "#s2id_controlTypes > .select2-choice > .select2-search-choice-close"
    ).click();
    cy.get("#s2id_controlTypes").click();
    cy.get("#s2id_autogen4_search").type(ControlType).type("{enter}");
    cy.wait(2000);
    cy.get(
      '[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
    cy.wait(10000);
    ///Cross button Click
    cy.get(".btn-danger").eq(0).click();
  }

  linkControlGrid(ControlTypes) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    ///**Click on Link Controls - Control Inline editor */
    cy.get(
      ".ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted > .ag-icon"
    ).click();
    // cy.get('.ag-center-cols-container > .ag-row-level-1 > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted').click();
    cy.wait(6000);
    cy.get("button").contains("Link Control Instance").click({ force: true });
    cy.wait(5000);
    cy.get("#s2id_controlTypeID").click();
    cy.get("#s2id_autogen12_search").type(ControlTypes).type("{enter}");
    cy.wait(5000);
    //cy.get('.ag-row-first > [aria-colindex="1"] > input').check();
    cy.get('.ag-row-first > [aria-colindex="1"] > input').then(($checkbox) => {
      if ($checkbox.is(":checked")) {
        // If the checkbox is checked, uncheck it first
        cy.wrap($checkbox).uncheck();

        // Re-query the checkbox after the DOM update and then check it again
        cy.get('.ag-row-first > [aria-colindex="1"] > input').check();
      } else {
        // If the checkbox is not checked, simply check it
        cy.wrap($checkbox).check();
      }
    });

    cy.wait(2000);
    cy.get("div #linkButton").click();
    cy.wait(6000);
    ///Cross button Click
    cy.get(".btn-danger").eq(0).wait(2000).click();
    cy.wait(5000);

    // cy.xpath('//*[@id="runTimeControlOwnerTable"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[2]').dblclick();
    // cy.get('#runTimeControlOwnerTable > div > div.ag-theme-balham.ag-popup > div > div > div.ag-rich-select-list > div > div.ag-virtual-list-container.ag-rich-select-virtual-list-container > div > div').click();
    // cy.get('#addControlOwnerButton').click();

    // cy.get('button').contains('Link').click();
  }

  addControlGrid(ControlCategoryTreeMapping) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    ///**Add Control from Inline editor */
    cy.get(
      ".ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted"
    ).click();
    // cy.get('[aria-colindex="15"]').should('be.visible').click();

    cy.wait(10000);
    cy.get("button").contains("Add Control Instance").click();
    cy.wait(7000);

    cy.get("#treeCover > .col-md-9")
      .contains(ControlCategoryTreeMapping)
      .type("{enter}");
    cy.log(ControlCategoryTreeMapping);

    // cy.get('.aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeButton > .aciTreePush').click();
    cy.wait(5000);
    cy.get(
      ".aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(4000);
    //***Control Owner */
    cy.get("#select2-chosen-6").click();
    cy.get("#s2id_autogen6_search").type("Automation user").type("{enter}");
    //***Control Tester */
    cy.get("#s2id_controlTester").click();
    cy.get("#s2id_autogen7_search").type("Automation user").type("{enter}");
    cy.get(
      '[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
    cy.wait(10000);
    ///Cross button Click
    cy.get(".btn-danger").eq(0).click();
  }

  validationControlGrid(ControlCategoryTreeMapping) {
    ///**Add Control from Inline editor */
    cy.get(
      ".ag-center-cols-container > .ag-row-level-1 > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted"
    )
      .wait(1000)
      .click();
    cy.wait(6000);
    cy.get("button").contains("Add Control Instance").click();
    cy.wait(5000);
    ////******Save Button click for validation */
    cy.get(
      '[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
    cy.wait(4000);
    // cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.');
    // cy.wait(2000);
    // cy.get('.toast').contains('Total weight of all instances can not be more than 100%');
    //**Click on Tree option */
    cy.get("#treeCover > .col-md-9")
      .contains(ControlCategoryTreeMapping)
      .type("{enter}");
    cy.wait(3000);
    cy.get(
      ".aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(4000);
    cy.get(
      '[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)'
    ).click();
    cy.get(".toast").contains(
      "Problem(s) in save. Please update the highlighted fields below and try again."
    );
  }

  /////*****Add Negative Impact*/
  negativeImpactAdd(
    nameNegativeImpact,
    Effect,
    ControlCategory_NegativeImpact
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(
      ".ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .dropdown-menu > #controlModalOpenr"
    )
      .should("be.visible")
      .click();
    cy.wait(10000);
    cy.frameLoaded("#iframe-risk-register-control-modal");
    cy.iframe("#iframe-risk-register-control-modal")
      .find("a:contains(Add Negative Impact)")
      .click();
    cy.wait(2000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#negativeImpactName")
      .type(nameNegativeImpact)
      .type(timeStamp);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#effect")
      .type(Effect);
    cy.wait(5000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#riskControlItemsTreeDivForNegativeImpact")
      .wait(3000)
      .contains(ControlCategory_NegativeImpact)
      .type("{enter}");
    cy.wait(5000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        ".aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
      )
      .click();
    ///*****Save button Click */
    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        ".negativeImpactFormModal-body > div:nth-child(3) > button:nth-child(1)"
      )
      .click();
    cy.wait(5000);
    cy.writeFile(
      write_NegativeImpact_Search,
      { Search_NegativeImpact: nameNegativeImpact + timeStamp },
      "utf-8"
    );
    cy.wait(5000);
  }

  /////*****Edit Negative Impact*/
  negativeImpactEdit(
    nameEditNegativeImpact,
    EffectEdit,
    Search_NegativeImpact
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(
      ".ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .dropdown-menu > #controlModalOpenr",
      { timeout: 20000 }
    )
      .should("be.visible")
      .click();
    cy.wait(10000);
    // cy.frameLoaded('#iframe-risk-register-control-modal');
    // cy.iframe('#iframe-risk-register-control-modal').xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[1]/div[2]/div/div[2]/div[2]/div[1]/div/input').type(Search_NegativeImpact);
    // cy.wait(7000);
    //****Click on Edit button */
    cy.iframe("#iframe-risk-register-control-modal")
      .xpath(
        '//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div/div[7]/div/div/a[1]/i'
      )
      .eq(0)
      .click();
    cy.wait(8000);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#negativeImpactName")
      .clear()
      .type(nameEditNegativeImpact)
      .type(timeStamp);
    cy.iframe("#iframe-risk-register-control-modal")
      .find("#effect")
      .clear()
      .type(EffectEdit);

    cy.iframe("#iframe-risk-register-control-modal")
      .find(
        ".negativeImpactFormModal-body > div:nth-child(3) > button:nth-child(1)"
      )
      .click();
    cy.wait(5000);
  }
  /////*****Share Risk Taxonomy Flyer- Marked Applicable*/
  shareApplicableMarked(BU2, RiskDefinitionSearch) {
    cy.frameLoaded("#riskTaxonomyApplicabilityFrame");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("#select2-chosen-1")
      .should("be.visible")
      .click();
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find("#s2id_autogen1_search")
      .type(BU2)
      .type("{enter}");
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find('[aria-label="Risk Item Filter Input"]')
      .clear()
      .type(RiskDefinitionSearch)
      .type("{enter}");
    cy.wait(5000);
    //***Click ratio button */
    cy.iframe("#riskTaxonomyApplicabilityFrame")
      .find(
        "#agGrid-taxonomy > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-no-focus.ag-row-odd.ag-row-level-1.ag-row-position-absolute.ag-row-last > div:nth-child(1) > label > span"
      )
      .wait(4000)
      .click({ force: true });
    cy.wait(5000);
  }

  clickThreeEllpsiseRiskInstance() {
    ///**Three Ellpsise */
    cy.get(
      ".ag-row-odd > .actionsCell > .d-inline-block > .actionDropDWrap > .btn > .la"
    ).click();
    cy.wait(2000);
  }

  clickOnControlFlyer() {
    cy.get("#controlModalOpenr").should("be.visible").click();
    cy.wait(6000);
  }

  shareDefintionThreeEllpsise() {
    ///**Three Ellpsise */
    cy.get(
      ".ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .btn"
    ).click();
    cy.wait(2000);
  }

  shareDefinitionDetailFlyerRiskInstance(
    RiskInstanceDescription,
    Frequency,
    TimesPer,
    FrequencyExplanation,
    Outcome,
    OutcomeDescription,
    ManagementComments,
    Context
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#detailModalFlyerOpenr").click();
    cy.wait(7000);
    cy.switchToIframe("#cke_1_contents > .cke_wysiwyg_frame")
      .clear()
      .type(RiskInstanceDescription)
      .type(timeStamp);

    ///*****Risk Events */
    cy.get("#select2-chosen-25").click();
    cy.get("#s2id_autogen25_search").type("{downArrow}").type("{enter}");

    ///**** Frequency ***/
    cy.get("#frequencyCountD").clear().type(Frequency);
    ///**** Time Per ***/
    cy.get("#select2-chosen-27").click();
    cy.get("#s2id_autogen27_search").type(TimesPer).type("{enter}");
    ///**** Frequency Explanation ***/
    cy.get("#frequencyExplanationD")
      .clear()
      .type(FrequencyExplanation)
      .type(timeStamp);
    ///**** Outcome ***/
    cy.get("#outcomeD").clear().type(Outcome).type(timeStamp);
    ///**** Outcome Description ***/
    cy.get("#outcomeDescriptionD")
      .clear()
      .type(OutcomeDescription)
      .type(timeStamp);
    ///**** Management Comments ***/
    cy.switchToIframe("#cke_2_contents > .cke_wysiwyg_frame")
      .clear()
      .type(ManagementComments)
      .type(timeStamp);
    ///**** Context ***/
    cy.get("#contextD").clear().type(Context).type(timeStamp);
    cy.wait(2000);
    ///**** Save button click ***/
    cy.get(".m-form__actions > .btn-primary").click();
    cy.wait(12000);
  }

  editRiskRegisterGridData(
    RiskName,
    Edit_Approach,
    Edit_InherentLikelihood,
    Edit_InherentImpact,
    Edit_ResidualLikelihood,
    Edit_ResidualImpact
  ) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    ////*******Select Approach Value****/////
    cy.get('.ag-row-last > [col-id="approach"]').dblclick();
    //Value select
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Edit_Approach)
      .click();
    cy.wait(5000);
    ////*******Select Likelihood Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentL.name"]').dblclick();
    cy.wait(5000);
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .wait(1000)
      .contains(Edit_InherentLikelihood)
      .click();
    cy.wait(2000);
    ////*******Select Impact Value - Inherent****/////
    cy.get('.ag-row-last > [col-id="inherentI.name"]').dblclick();
    cy.wait(2000);
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Edit_InherentImpact)
      .click();
    cy.wait(2000);
    cy.get(".toast").contains(
      "Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically."
    );
    cy.wait(2000);
    ///***Scroll Page  */
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight"); // Scroll 'sidebar' to its bottom;
    cy.wait(1000);
    ////*******Select Likelihood Value  - Residual****/////
    cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Edit_ResidualLikelihood)
      .click();
    cy.wait(2000);
    ////*******Select Impact Value  - Residual****////
    cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
    cy.get(".ag-rich-select-list > .ag-virtual-list-viewport")
      .contains(Edit_ResidualImpact)
      .click();
    cy.wait(2000);
    //***Risk Register Name Updated */
    cy.get(".ag-row-odd > .ag-cell-last-left-pinned").dblclick();
    cy.wait(2000);
    cy.get('[aria-label="Input Editor"]')
      .clear()
      .type(RiskName)
      .type(timeStamp)
      .tab();
    cy.wait(5000);
    cy.get(".toast").contains(
      "Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically."
    );
  }
}
export default RiskRegister_PO;
