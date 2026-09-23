import locators from '../../../fixtures/locators.json';
import dataFile from '../../../fixtures/RiskModule/RiskItem/DataFile.json';
import { KriMyTaxonomy } from '../../../support/POM/RiskModule_PO/KriMyTaxonomy';

const kri = new KriMyTaxonomy();

/**
 * Represents the Risk Register page.
 * @class
 */
class RiskRegisterPage {
  /**
   * Clicks the Add Risk Item button.
   * @function clickAddButton
   */
  clickAddButton() {
    cy.waitForMyGridLoaderToDisappear(30000);
    cy.get(locators.risk.riskRegister.riskSearchTexBoxGrid).eq(0).clear();
    cy.get(locators.risk.riskRegister.addRiskItemButton)
      .first()
      .click();
  }

  /**
   * Enters the risk item name from the data file.
   * @function enterRiskItemName
   */
  enterRiskItemName() {
    cy.get(locators.risk.riskRegister.riskItemNameField).type(dataFile.riskItemName);
  }

  /**
   * Selects a random risk item level from the dropdown.
   * @function selectRiskItemLevel
   */
  selectRiskItemLevel() {
    cy.get(locators.risk.riskRegister.riskItemLevelDropdown).click({ multiple: true });
    cy.get(locators.risk.riskRegister.riskItemLevelOptions).then(($options) => {
      const randomIndex = Math.floor(Math.random() * $options.length);
      cy.wrap($options[randomIndex]).click();
    });
  }

  /**
   * Tests the numeric input field for various invalid inputs.
   * @function testNumericField
   */
  testNumericField() {
    const numericField = cy.get(locators.risk.riskRegister.numericCustomField);

  // Test 1: Try entering alphabetic characters (should remain empty)
  numericField.clear().type(dataFile.numericTestInputs.test1.input, { force: true });
  numericField.should('have.value', dataFile.numericTestInputs.test1.expected);

  // Test 2: Try entering alphanumeric characters (only numbers should be allowed)
  numericField.clear().type(dataFile.numericTestInputs.test2.input, { force: true });
  numericField.should('have.value', dataFile.numericTestInputs.test2.expected);

  // Test 3: Try entering special characters (should remain empty)
  numericField.clear().type(dataFile.numericTestInputs.test3.input, { force: true });
  numericField.should('have.value', dataFile.numericTestInputs.test3.expected);

  // Test 4: Copy-paste alphanumeric text (should paste only numbers)
  cy.window().then((win) => {
    win.navigator.clipboard.writeText(dataFile.numericTestInputs.test4.input);
  });

  numericField.focus().type('{ctrl}v', { force: true });
  numericField.should('have.value', dataFile.numericTestInputs.test4.expected);
}
  /**
   * Clicks the Save button.
   * @function clickSaveButton
   */
  clickSaveButton() {
    cy.get(locators.risk.riskRegister.saveButton).click({ delay: 1000, force: true });
  }

  /**
   * Hides the validation message.
   * @function hideValidationMessage
   */
  hideValidationMessage() {
    cy.get(locators.risk.riskRegister.toastMessage).click();
  }

  /**
   * Enters a valid number from the data file into the numeric input field.
   * @function enterValidNumber
   */
  enterValidNumber() {
    cy.get(locators.risk.riskRegister.numericCustomField).clear().type(dataFile.validNumber, { delay: 200 });
  }

  /**
   * Searches and verifies if the Risk Item exists in the grid.
   * @function searchAndVerifyRiskItem
   */
  searchAndVerifyRiskItem() {
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .trigger('mouseover');
    cy.get(locators.risk.riskRegister.riskColumnHeader)
      .first()
      .find(locators.risk.riskRegister.columnMenuIcon)
      .click();

    cy.get(locators.risk.riskRegister.expandAllOption).should('be.visible').click();

    cy.get(locators.risk.riskRegister.riskFilterInput)
      .first()
      .clear()
      .type(dataFile.riskItemName);

    cy.get(locators.risk.riskRegister.gridContainer)
      .should('contain', dataFile.riskItemName)
      .and('contain', dataFile.validNumber);
  }

  /**
   * Opens the Risk Applicability Flyer and verifies if the Risk Item is not present.
   * @function openRiskApplicabilityFlyer
   */
  openRiskApplicabilityFlyer() {
    kri.addRiskApplicablity(dataFile.riskItemName, true);

    cy.get(locators.risk.riskRegister.riskApplicabilityGrid).should('have.length', 0);
  }
}

export default RiskRegisterPage;
