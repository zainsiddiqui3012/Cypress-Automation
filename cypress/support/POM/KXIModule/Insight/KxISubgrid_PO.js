import locators from '../../../../fixtures/locators.json';
import testData from '../../../../fixtures/KXIModule/insight/KxiGridData.json';

/**
 * Page Object Model class for KXI Grid interactions.
 * Includes methods to interact with KXI grids, forms, and data verification.
 */
export class KxiGridPage {
  /**
   * Stores the dynamically generated KXI name for use in later verifications.
   * @type {string}
   */
  kxiName = '';

  /**
   * Expands the KXI sub-grid for Risk Category.
   * This is typically the top-level sub-grid expansion.
   */
  expandKxiSubGrid() {
    cy.get(locators.kxiSubGrid.expandSubGridIcon).first().click({ force: true });
  }

  /**
   * Validates that the KXI sub-grid shows an empty state
   * when no KXIs are present.
   */
  verifyEmptySubGrid() {
    cy.get(locators.kxiSubGrid.emptyDataContainer).should(
      'contain.text',
      testData.messages.noRowsText
    );
  }

  /**
   * Clicks the 'Create KXI' button and verifies that the modal form
   * appears with the correct title.
   */
  openCreateKXIForm() {
    cy.get(locators.kxiSubGrid.createKXIButton).first().click({ force: true });
    cy.get(locators.kxiSubGrid.addKXIModalTitle).should(
      'contain.text',
      testData.messages.modalTitle
    );
  }

  /**
   * Fills the Create KXI form:
   * - Generates a dynamic name.
   * - Selects dropdown values.
   * - Enters left and right trigger levels (randomly generated, valid values).
   * - Sets target value and trigger directions.
   */
  fillKxiForm() {
    const timestamp = Date.now();
    this.kxiName = `AutoKXI-${timestamp}`;

    const rightLevel1 = Math.floor(Math.random() * 10) + 79;
    const rightLevel2 = rightLevel1 + Math.floor(Math.random() * 5) + 5;
    const rightLevel3 = rightLevel2 + Math.floor(Math.random() * 5) + 5;

    const leftLevel1 = Math.floor(Math.random() * 5) + 60;
    const leftLevel2 = leftLevel1 - Math.floor(Math.random() * 5) - 5;
    const leftLevel3 = leftLevel2 - Math.floor(Math.random() * 10) - 5;

    cy.get(locators.kxiSubGrid.nameInput).type(this.kxiName);

    cy.get(locators.kxiSubGrid.dropdownActivator).click();
    cy.get(locators.kxiSubGrid.dropdownOption)
      .contains(testData.dropdownValue)
      .click();

    cy.get(locators.kxiSubGrid.dropdownActivator2).click();
    cy.get(locators.kxiSubGrid.dropdownOption)
      .contains(Cypress.env('kxi').customer.withRM.username)
      .click();

    cy.get(locators.kxiSubGrid.targetInput).type(testData.targetValue.toString());

    cy.get(locators.kxiSubGrid.leftTriggerNegativeRadio).check({ force: true });
    cy.get(locators.kxiSubGrid.rightTriggerNegativeRadio).check({ force: true });

    cy.get(locators.kxiSubGrid.leftTriggerLevel1).type(leftLevel1.toString());
    cy.get(locators.kxiSubGrid.leftTriggerLevel2).type(leftLevel2.toString());
    cy.get(locators.kxiSubGrid.leftTriggerLevel3).type(leftLevel3.toString());

    cy.get(locators.kxiSubGrid.rightTriggerLevel1).type(rightLevel1.toString());
    cy.get(locators.kxiSubGrid.rightTriggerLevel2).type(rightLevel2.toString());
    cy.get(locators.kxiSubGrid.rightTriggerLevel3).type(rightLevel3.toString());
  }

  /**
   * Clicks the Save button on the KXI form
   * and verifies that the success toast is displayed.
   */
  submitKxiForm() {
    cy.get(locators.kxiSubGrid.saveButton).click();
    cy.get(locators.kxiSubGrid.toastMessage).should(
      'contain.text',
      testData.messages.toastSuccess
    );
  }

  /**
   * Expands the KXI sub-grid and validates that
   * the newly created KXI name appears in the list.
   */
  verifyKxiInGrid() {
    this.expandKxiSubGrid();
    cy.get(locators.kxiSubGrid.subGrid).should('contain.text', this.kxiName);
  }

  /**
   * Expands the Definition-level KXI sub-grid and verifies
   * the newly created KXI is listed in the Definition grid.
   */
  verifyDefKxiInGrid() {
    cy.get(locators.kxiSubGrid.instanceSubgrid)
      .eq(1)
      .should('be.visible')
      .click({ force: true });

    cy.get(locators.kxiSubGrid.defSubGrid).should('contain.text', this.kxiName);
  }

  /**
   * Expands the KXI grid under a Risk Definition
   * and opens the modal to create a new KXI from there.
   */
  expandInstanceKxiGrid() {
    cy.get(locators.kxiSubGrid.instanceSubgrid)
      .last()
      .should('be.visible')
      .click({ force: true });

    cy.get(locators.kxiSubGrid.createKxiBtn)
      .contains(testData.messages.createDefKxiBtn)
      .should('be.visible')
      .click();
  }

  /**
   * Opens the KXI creation form under the Risk Instance sub-grid.
   * This allows testing KXI creation specifically for a Risk Instance.
   */
  kxiForRiskInstance() {
    cy.get(locators.kxiSubGrid.instanceSubgrid)
      .last()
      .should('be.visible')
      .click({ force: true });

    cy.get(locators.kxiSubGrid.createKxiBtn)
      .contains(testData.messages.createInstanceKxiBtn)
      .should('be.visible')
      .click();
  }
}
