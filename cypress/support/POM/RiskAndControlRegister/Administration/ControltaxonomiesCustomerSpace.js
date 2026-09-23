const writeFile =
  "cypress/fixtures/RiskAndControlRegister/Administration/writeControlTaxonomiesCustomerSpace.json";
import data from "../../../../fixtures/RiskAndControlRegister/Administration/controlTaxonomiesCustomerSpace.json";
import dayjs from "dayjs";
import locators from "../../../../fixtures/locators.json";
import ImportHelper from "../Administration/helpers/ImportHelper";
import DateHelper from "../Administration/helpers/DateHelper";
import FileHelper from "../Administration/helpers/FileHelper";

const invalidPath = "cypress/attachment/testing.txt";
const sampleFileName = "ImportTemplate_ControlTaxonomy_Customer.xlsx";
const qbImport = "cypress/fixtures/Examples/controlTaxonomyImportCustomer.json";

class ControlTaxonomies {
  /**
   * Clicks the Save button for Control Category form.
   * @returns {void}
   */
  clickSaveButton() {
    cy.get(locators.risk.controlTaxonomies.saveButton)
      .contains(data.add.controlCategory.saveText)
      .scrollIntoView()
      .click();
  }

  /**
   * Clicks the Cancel button for Control Category form.
   * @returns {void}
   */
  clickCancelButton() {
    cy.get(locators.risk.controlTaxonomies.cancelButton)
      .contains(data.add.controlCategory.cancelText)
      .scrollIntoView()

      .click({ force: true });
  }

  /**
   * Opens the Control Category form by clicking the Add button.
   * Also asserts that the form becomes visible.
   * @returns {void}
   */
  clickControlCategoryButton() {
    cy.get(locators.risk.controlTaxonomies.addControlCategoryButton).click({
      force: true,
    });
    // Assertion: Verify that the form with id 'addRiskControlItemItem' is visible
    cy.get(locators.risk.controlTaxonomies.addControlCategoryForm, {
      timeout: 10000,
    }).should("be.visible");
  }

  /**
   * Verifies all mandatory Control Category form fields are visible.
   * @returns {void}
   */
  verifyAllFieldsVisible() {
    cy.get(locators.risk.controlTaxonomies.controlIdField).should("be.visible");
    cy.get(locators.risk.controlTaxonomies.controlNameField).should(
      "be.visible"
    );
    cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
      timeout: 10000,
    })
      .scrollIntoView()
      .should("exist"); // Avoid using "be.visible" for hidden elements
  }

  /**
   * Generates a unique name using prefix and timestamp.
   * @param {string} prefix - A text prefix (e.g. category name)
   * @returns {string} Unique generated name
   */
  addName(prefix) {
    return `${prefix}-${dayjs().format("MM-DD-YYYY_HH-mm-ss-SSS")}`;
  }

  /**
   * Types a new unique category name in the Name field
   * and stores it in class property for later reuse.
   * @param {string} sectionName - Section in JSON data to fetch prefix
   * @returns {void}
   */
  typeNewCatInControlName(sectionName) {
    this.generatedCategoryName = this.addName(
      data[sectionName].controlCategory.catName
    );
    cy.get(locators.risk.controlTaxonomies.controlNameField)
      .clear()
      .type(this.generatedCategoryName);
  }

  /**
   * Persists generated category name into fixture JSON file.
   * @returns {void}
   */
  writeCategoryNameToFile() {
    cy.readFile(writeFile).then((file) => {
      file.categoryName = this.generatedCategoryName;
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Asserts that saved category exists in category tree.
   * @returns {void}
   */
  verifyCategoryInTree() {
    cy.readFile(writeFile).then((savedName) => {
      cy.get(locators.risk.controlTaxonomies.categoryTreeField)
        .find(locators.risk.controlTaxonomies.selectTreeText)
        .contains(savedName.categoryName)
        .should("be.visible");
    });
  }

  /**
   * Asserts that saved subcategory exists in category tree.
   * @returns {void}
   */
  verifySubcategoryInTree() {
    cy.readFile(writeFile).then((savedName) => {
      const subCategoryName = savedName.subCategoryName;

      cy.get(locators.risk.controlTaxonomies.categoryTreeField)
        .find(locators.risk.controlTaxonomies.treeTextLabel)
        .contains(subCategoryName, { timeout: 10000 }) // will now be a string
        .should("be.visible");
    });
  }

  /**
   * Expands subcategory node in tree by double-clicking its name.
   * @returns {void}
   */
  expandSubCategory() {
    cy.readFile(writeFile).then((file) => {
      const subCategoryName = file.subCategoryName;
      cy.contains(
        locators.risk.controlTaxonomies.treeTextLabel,
        subCategoryName,
        { timeout: 10000 }
      )
        .should("be.visible")
        .dblclick({ force: true });
    });
  }

  /**
   * Asserts that a saved nested category is visible under parent.
   * @returns {void}
   */
  verifyNestedCategoryVisible() {
    cy.readFile(writeFile).then((file) => {
      const nestedCategoryName = file.nestedCategoryName;
      cy.contains(
        locators.risk.controlTaxonomies.treeTextLabel,
        nestedCategoryName,
        { timeout: 10000 }
      ).should("be.visible");
    });
  }

  /**
   * Types a new unique sub-category name.
   * @returns {void}
   */
  typeNewSubCatInControlName() {
    this.generatedSubCategoryName = this.addName(
      data.add.controlCategory.subCatName || data.add.controlCategory.subCatName
    );

    cy.get(locators.risk.controlTaxonomies.controlNameField).type(
      this.generatedSubCategoryName
    );
  }
  /**
   * Writes generated sub-category name to fixture JSON file.
   * @returns {void}
   */
  writeSubCategoryNameToFile() {
    cy.readFile(writeFile).then((file) => {
      file.subCategoryName = this.generatedSubCategoryName;
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Writes generated nested category name to fixture JSON file.
   * @returns {void}
   */
  writeNestedCategoryNameToFile() {
    cy.readFile(writeFile).then((file) => {
      file.nestedCategoryName = this.generatedSubCategoryName;
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Types existing sub-category name from fixture into input field.
   * @returns {void}
   */
  typeExistingSubCategoryName() {
    cy.readFile(writeFile).then((file) => {
      const savedSubCatName = file.subCategoryName;

      cy.get(locators.risk.controlTaxonomies.controlNameField).type(
        savedSubCatName
      );
    });
  }

  /**
   * Clicks saved category name from fixture inside category tree.
   * @returns {void}
   */
  clickSavedControlCategoryName() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName;

      cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
        timeout: 10000,
      })
        .contains(storedName)

        .scrollIntoView()
        .should("be.visible")
        .click();
    });
  }
  /**
   * Clicks a different parent category node.
   * @returns {void}
   */
  clickDifferentParentCategory() {
    cy.get(locators.risk.controlTaxonomies.definitionTreeAdded, {
      timeout: 10000,
    })

      .eq(1)
      .find(locators.risk.controlTaxonomies.checkTree)
      .click();
  }

  /**
   * Verifies that the subcategory is saved under the second parent node
   * and is visible in the tree.
   * @returns {void}
   */
  verifySubCatInDiffParent() {
    cy.readFile(writeFile).then((file) => {
      const subCategoryName = file.subCategoryName;

      // Expand the 2nd parent category
      cy.get(locators.risk.controlTaxonomies.definitionTreeAdded, {
        timeout: 10000,
      })
        .eq(1) // second parent
        .within(() => {
          cy.get(locators.risk.controlTaxonomies.expandButton)
            .first()
            .click({ force: true });
        });

      // Assert that the subcategory is visible under this parent
      cy.get(locators.risk.controlTaxonomies.definitionTreeAdded)
        .eq(1)
        .within(() => {
          cy.contains(
            locators.risk.controlTaxonomies.treeTextLabel,
            subCategoryName,
            { timeout: 10000 }
          ).should("be.visible");
        });
    });
  }

  /**
   * Selects another parent definition from the category tree.
   * @returns {void}
   */
  selectOtherParentDef() {
    cy.get(locators.risk.controlTaxonomies.clickCategoryChild, {
      timeout: 10000,
    })

      .eq(3)
      .find(locators.risk.controlTaxonomies.checkTree)
      .click();
  }
  /**
   * Inputs a long invalid string to test name validation (>255 chars).
   * @returns {void}
   */
  typeLongNameInControlName() {
    const longName = data.add.controlCategory.addText.repeat(256);
    cy.get(locators.risk.controlTaxonomies.controlNameField).type(longName);

    cy.get(locators.risk.controlTaxonomies.controlNameField)
      .parent()
      .find(locators.risk.controlTaxonomies.fieldText)
      .should("contain.text", data.mandatoryFieldErrors.errorLongText);
  }

  /**
   * Clicks stored category name in tree.
   * @returns {void}
   */
  clickSavedControlCategory() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName;

      cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
        timeout: 10000,
      })
        .contains(storedName)

        .scrollIntoView()
        .should("be.visible")
        .click();
    });
  }

  /**
   * Clicks stored control category node to open definition form.
   * @returns {void}
   */
  clickControlDefinitionNode() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName;

      cy.get(locators.risk.controlTaxonomies.clickTreeDefinition, {
        timeout: 10000,
      })
        .scrollIntoView()
        .contains(storedName)

        .should("exist")
        .click();
    });
  }

  /**
   * Expands stored control category node in tree.
   * @returns {void}
   */
  expandSavedControlCategoryName() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName;

      cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
        timeout: 10000,
      })
        .contains(locators.risk.controlTaxonomies.spanAdded, storedName)
        .scrollIntoView()
        .should("be.visible")
        .parents(locators.risk.controlTaxonomies.parentAdded)
        .within(() => {
          // now only target the expand button inside this specific node
          cy.get(locators.risk.controlTaxonomies.expandButton).click({
            force: true,
          });
        });
    });
  }

  /**
   * Expands category node by its saved name.
   * @returns {void}
   */
  expandCategoryByName() {
    cy.readFile(writeFile).then((file) => {
      const categoryName = file.categoryName;
      cy.get(locators.risk.controlTaxonomies.riskItem, { timeout: 20000 })
        .contains(locators.risk.controlTaxonomies.treeTextLabel, categoryName)
        .should("exist") // element exists in DOM
        .closest(locators.risk.controlTaxonomies.treeListItem) // get the parent li
        .within(() => {
          cy.get(locators.risk.controlTaxonomies.expandButton)
            .first()
            .click({ force: true });
        });
    });
  }
  /**
   * Verifies a control definition exists under a category.
   * @param {string} controlDefName - Control definition to check
   */
  verifyControlDefUnderCategory() {
    cy.readFile(writeFile).then((file) => {
      const controlDefName = file.definitionName;
      cy.get(locators.risk.controlTaxonomies.riskItem, { timeout: 20000 })
        .contains(locators.risk.controlTaxonomies.treeTextLabel, controlDefName)
        .scrollIntoView({ block: "center" })
        .should("exist");
    });
  }

  /**
   * Asserts control definition was deleted (not visible).
   * @returns {void}
   */
  verifyControlDefDelete() {
    cy.readFile(writeFile).then((file) => {
      const controlDefName = file.definitionName;

      cy.get(locators.risk.controlTaxonomies.riskItem, {
        timeout: 20000,
      }).within(() => {
        cy.get(locators.risk.controlTaxonomies.treeTextLabel)
          .contains(controlDefName)
          .should("not.exist"); // safer: searches inside parent
      });
    });
  }
  /**
   * Clicks a previously stored nested control category name.
   * @returns {void}
   */
  clickNestedControlCategoryName() {
    cy.readFile(writeFile).then((file) => {
      const subCategoryName = file.subCategoryName;

      cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
        timeout: 10000,
      })
        .contains(subCategoryName)
        .scrollIntoView()
        .should("be.visible")
        .click();
    });
  }

  /**
   * Types the previously saved duplicate control name into the Name field.
   * @returns {void}
   */
  typeDuplicateControlName() {
    cy.readFile(writeFile).then((file) => {
      const existingName = file.categoryName;
      cy.get(locators.risk.controlTaxonomies.controlNameField).type(
        existingName
      );
    });
  }
  /**
   * Clicks the stored control name (sub-category) from the tree structure.
   * Reads name from writecontrolTaxonomies.json and selects it in the UI.
   * @returns {void}
   */

  clickStoredControlName() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName.trim();

      cy.contains(
        locators.risk.controlTaxonomies.selectCategoryNameTree,
        storedName,
        { timeout: 10000 }
      )

        .scrollIntoView({ block: "center", inline: "center" })

        .click({ force: true }); // force click even if clipped or not visible
    });
  }

  /**
   * Clicks on a subcategory by its name inside the Control Taxonomies tree.
   * @param {string} subCategoryName - The name of the subcategory to click.
   */

  clickSubCategoryName() {
    cy.readFile(writeFile).then((file) => {
      const name = String(file.subCategoryName).trim();

      cy.get(locators.risk.controlTaxonomies.riskItem, { timeout: 10000 })
        .find(locators.risk.controlTaxonomies.treeTextLabel)
        .contains(name)
        .scrollIntoView({ block: "center", inline: "center" }) // center me scroll karwao
        .click({ force: true }); // force se click karo (visible na ho tab bhi)
    });
  }

  /**
   * Simulates control selection and verifies radio button behavior.
   * @returns {void}
   */

  changeParent() {
    cy.get(locators.risk.controlTaxonomies.innerTreeData).should("exist");

    // Click second checkbox and verify it's checked using `should` retry
    cy.get(locators.risk.controlTaxonomies.checkTree)
      .eq(2)
      .click({ force: true });

    // First checkbox should now be unchecked
    cy.get(locators.risk.controlTaxonomies.checkTree)
      .eq(0)
      .should("not.be.checked");
  }

  /**
   * Verifies the Control Name input field is blank.
   * @returns {void}
   */
  verifyControlNameFieldIsBlank() {
    cy.get(locators.risk.controlTaxonomies.controlNameField).should("be.empty");
  }

  /**
   * Clicks Add Control Definition button and asserts form is visible.
   * @returns {void}
   */
  clickAddDefBtn() {
    cy.get(locators.risk.controlTaxonomies.addControlDefinitionButton).click();

    // Assertion: Verify that the form is visible
    cy.get(locators.risk.controlTaxonomies.controlDefFormId, {
      timeout: 10000,
    }).should("be.visible");
  }

  /**
   * Generates a unique name for Control Definition using current timestamp.
   * @returns {string} Unique control definition name
   */
  addControlDefName(prefix) {
    return `${prefix}-${dayjs().format("MM-DD-YYYY_HH-mm-ss-SSS")}`;
  }

  /**
   * Types a unique Control Definition name and stores it in a fixture file.
   * @returns {void}
   */
  typeControlDefinitionName(sectionName) {
    this.defName = this.addControlDefName(
      data[sectionName].ControlDefintion.defName
    );
    cy.get(locators.risk.controlTaxonomies.controlDefinitionNameField)
      .clear()
      .type(this.defName);
  }

  /**
   * Writes the generated definition name into the controlTaxonomies.json file.
   * @param {string} defName - The definition name to save into the fixture file.
   */

  writeDefName() {
    cy.readFile(writeFile).then((file) => {
      file.definitionName = this.defName;
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Types a duplicate definition name into the definition input field.
   * @param {string} defName - The duplicate definition name to type.
   */

  typeDuplicateDefName() {
    cy.readFile(writeFile).then((file) => {
      const savedDefName = file.definitionName;

      cy.get(locators.risk.controlTaxonomies.controlDefinitionNameField)
        .should("be.visible")
        .type(savedDefName);
    });
  }

  /**
   * Selects a control type from the control type dropdown.
   * @param {string} controlType - The control type option to select.
   */
  selectControlTypes() {
    cy.get(locators.risk.controlTaxonomies.clickControlTypeDropdown).click();
    cy.get(locators.risk.controlTaxonomies.typeControlTypeInput).type(
      data.add.ControlDefintion.controlType + "{enter}"
    );
  }

  /**
   * Clicks the Save button for the Control Definition form.
   * @returns {void}
   */
  clickSaveControlDef() {
    cy.get(locators.risk.controlTaxonomies.saveControlNameButton)
      .contains(data.add.controlCategory.saveText)
      .scrollIntoView()
      .click();
  }

  /**
   * Fills in the Control Definition ID field with predefined data.
   * @returns {void}
   */
  fillControlDefId() {
    cy.get(locators.risk.controlTaxonomies.controlDefId).type(
      data.add.ControlDefintion.controlDefId
    );
  }

  /**
   * Types a comment into the Control Definition comment field.
   * @returns {void}
   */
  commentAdd() {
    cy.get(locators.risk.controlTaxonomies.commentField).type(
      data.add.ControlDefintion.comments
    );
  }

  /**
   * Types a description into a WYSIWYG editor iframe for Control Definition.
   * @returns {void}
   */
  typeDescription() {
    const text = data.add.ControlDefintion.description;
    cy.get(locators.risk.controlTaxonomies.descriptionField).then(($iframe) => {
      cy.wrap($iframe.contents().find("body"))
        .click()
        .type(text, { force: true });
    });
  }

  /**
   * Selects "Yes" for Primary Control radio button.
   * @returns {void}
   */
  selectPrimaryControl() {
    cy.get(locators.risk.controlTaxonomies.primaryControlField)
      .contains(data.add.ControlDefintion.optionYes)
      .click({ force: true });
  }

  /**
   * Selects "Yes" for Prevents Fraud radio button.
   * @returns {void}
   */
  selectPreventsFraudYes() {
    cy.get(locators.risk.controlTaxonomies.primaryControlField)
      .contains(data.add.ControlDefintion.optionYes)
      .click({ force: true });
  }

  /**
   * Adds multiple tags using different key delimiters like comma and enter.
   * Verifies each tag is rendered correctly.
   * @returns {void}
   */
  addMultipleTags() {
    cy.get(locators.risk.controlTaxonomies.tagInput).type(
      `${data.add.ControlDefintion.tag1},{enter}`,
      { force: true }
    );

    cy.get(locators.risk.controlTaxonomies.tagList)
      .contains(data.add.ControlDefintion.tag1)
      .should("exist");

    cy.get(locators.risk.controlTaxonomies.tagInput).type(
      `${data.add.ControlDefintion.tag2},`,
      { force: true }
    );

    cy.get(locators.risk.controlTaxonomies.tagList)
      .contains(data.add.ControlDefintion.tag2)
      .should("exist");
  }

  /**
   * Selects a control frequency from dropdown.
   * @returns {void}
   */
  selectControlOperations() {
    cy.get(locators.risk.controlTaxonomies.selectControlOperation).click();
    cy.get(locators.risk.controlTaxonomies.dropdownSearch).type(
      data.add.ControlDefintion.automate + "{enter}"
    );

    // Assert selected value appears in the dropdown
    cy.get(locators.risk.controlTaxonomies.selectControlOperation).should(
      "contain.text",
      data.add.ControlDefintion.automate
    );
  }

  /**
   * Selects a control frequency from the dropdown and confirms with Enter.
   * @returns {void}
   */
  selectControlFrequency() {
    cy.get(locators.risk.controlTaxonomies.selectControlFrequency).click();
    cy.get(locators.risk.controlTaxonomies.dropdownSearch).type(
      data.add.ControlDefintion.controlFrequency + "{enter}"
    );

    // Assert selected value appears in the dropdown
    cy.get(locators.risk.controlTaxonomies.selectControlFrequency).should(
      "contain.text",
      data.add.ControlDefintion.controlFrequency
    );
  }

  /**
   * Selects a design assessment from dropdown.
   * @returns {void}
   */
  selectDesignAssessment() {
    cy.get(locators.risk.controlTaxonomies.selectDesignAssessment).click();
    cy.get(locators.risk.controlTaxonomies.dropdownSearch).type(
      data.add.ControlDefintion.designAssessment + "{enter}"
    );

    // Assert selected value appears in the dropdown
    cy.get(locators.risk.controlTaxonomies.selectDesignAssessment).should(
      "contain.text",
      data.add.ControlDefintion.designAssessment
    );
  }

  /**
   * Selects Operating Effectiveness Assessment.
   * @returns {void}
   */
  selectOperatingEffectivenessAssessment() {
    cy.get(
      locators.risk.controlTaxonomies.selectOperatingEffectiveness
    ).click();
    cy.get(locators.risk.controlTaxonomies.dropdownSearch).type(
      data.add.ControlDefintion.operatingEffectivenessAssessment + "{enter}"
    );

    // Assert selected value appears in the dropdown
    cy.get(locators.risk.controlTaxonomies.selectOperatingEffectiveness).should(
      "contain.text",
      data.add.ControlDefintion.operatingEffectivenessAssessment
    );
  }

  /**
   * Selects the control execution assessment from dropdown.
   * @returns {void}
   */
  selectControlExecutionsAssessment() {
    cy.get(locators.risk.controlTaxonomies.selectControlExecution).click();
    cy.get(locators.risk.controlTaxonomies.dropdownSearch).type(
      data.add.ControlDefintion.controlExecution + "{enter}"
    );

    // Assert selected value appears in the dropdown
    cy.get(locators.risk.controlTaxonomies.selectControlExecution).should(
      "contain.text",
      data.add.ControlDefintion.controlExecution
    );
  }

  /**
   * Inputs a previously stored duplicate control definition name.
   * @returns {void}
   */
  typeDuplicateControlDef() {
    cy.readFile(writeFile).then((file) => {
      const existingName = file.definitionName;
      cy.get(locators.risk.controlTaxonomies.controlDefinitionNameField).type(
        existingName
      );
    });
  }
  /**
   * Clicks Audit Log button for stored control category name.
   * @returns {void}
   */
  clickAuditLogButton() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName.trim();

      cy.contains(locators.risk.controlTaxonomies.selectTreeText, storedName)
        .should("exist")
        .parents(locators.risk.controlTaxonomies.selectTreeEntry)
        .find(locators.risk.controlTaxonomies.auditLogButton)
        .click();
      // Assertion: Verify the modal opens
      cy.get(locators.risk.controlTaxonomies.openedModal, { timeout: 10000 }) // adjust selector if needed
        .should("exist")
        .and("contain.text", data.add.controlCategory.auditLogModal); // assuming modal header has "Audit Trail"
    });
  }

  /**
   * Expands the saved control category parent node in the tree.
   * @returns {void}
   */
  expandSavedControlCategoryParent() {
    cy.readFile(writeFile).then((file) => {
      const storedName = file.categoryName;

      cy.get(locators.risk.controlTaxonomies.riskItem, {
        timeout: 10000,
      })
        .contains(locators.risk.controlTaxonomies.spanAdded, storedName)
        .scrollIntoView()

        .parents(locators.risk.controlTaxonomies.parentAdded)
        .within(() => {
          // now only target the expand button inside this specific node
          cy.get(locators.risk.controlTaxonomies.expandButton).click({
            force: true,
          });
        });
    });
  }

  /**
   * Clicks Delete on a stored control definition and confirms modal.
   * @returns {void}
   */
  clickDeleteOnStoredDefinition() {
    cy.readFile(writeFile).then((file) => {
      const definitionName = file.definitionName;

      cy.contains(
        locators.risk.controlTaxonomies.selectTreeText,
        definitionName
      )
        .should("exist")
        .parents(locators.risk.controlTaxonomies.selectTreeEntry)
        .find(locators.risk.controlTaxonomies.auditDeleteButton)
        .click();

      //Assertion added that popup opend
      cy.get(locators.risk.controlTaxonomies.openedModal, { timeout: 10000 })
        .should("exist")
        .and("contain.text", data.add.ControlDefintion.deleteCatDef);
      cy.get(locators.risk.controlTaxonomies.clickDeleteButton)
        .contains(data.add.ControlDefintion.deleteCatDef)
        .click();
    });
  }

  /**
   * Expands and then collapses a control category node in the tree view.
   * @returns {void}
   */
  expandCollapseNode() {
    cy.readFile(writeFile).then(({ categoryName }) => {
      cy.contains(locators.risk.controlTaxonomies.treeTextLabel, categoryName)
        .should("exist")
        .parents(locators.risk.controlTaxonomies.treeListItem)
        .as("parentNode");

      cy.get("@parentNode")
        .find(locators.risk.controlTaxonomies.expandCollapseButton)
        .first()
        .as("expandBtn");

      // Toggle expand
      cy.get("@expandBtn").click({ force: true });
      cy.get("@parentNode")
        .find(locators.risk.controlTaxonomies.treeItemRole)
        .should("have.attr", "aria-expanded", "true");

      // Toggle collapse
      cy.get("@expandBtn").click({ force: true });
      cy.get("@parentNode")
        .find(locators.risk.controlTaxonomies.treeItemRole)
        .should("have.attr", "aria-expanded", "false");
    });
  }

  /**
   * Verifies the toast message text and ensures it is visible.
   * @param {string} message - The expected toast message text.
   * @param {number} timeout - Time to wait for the toast to appear.
   */
  verifyToastMessage(message, timeout = 10000) {
    cy.verifyToastMessageText(message, timeout).should("be.visible");
  }

  /**
   * Write control taxonomy name to file
   * @param {boolean} updated - Whether the name is being updated
   * @param {string} updatedName - The new name to write
   * @returns {Cypress.Chainable} - Chainable after updating file
   */
  writeControlTaxonomiesCustomerSpace(updated = false, updatedName) {
    return cy.readFile(writeFile).then((jsonData) => {
      if (!jsonData.import) {
        jsonData.import = {};
      }

      // Update import name
      jsonData.import.importName = updated
        ? updatedName
        : data.import.nameDefault;

      // Write back to file
      return cy.writeFile(writeFile, jsonData).then(() => {});
    });
  }
  /**
   * Verifies name input field has maxlength attribute of 1000.
   * @returns {void}
   */
  verifyNameMaxLengthAttribute() {
    cy.get(locators.risk.controlTaxonomies.defName).should(
      "have.attr",
      "maxlength",
      data.add.ControlDefintion.maxLengthValue
    );
  }
}

class ImportOperations {
  /**
   * Opens the Import Modal and verifies it is displayed.
   * @param {string} importModalSelector - CSS selector for the import modal.
   * @param {string} importBtnElipses - CSS selector for the Import button.
   * @param {string} modalText - Expected modal title text.
   * @returns {void}
   */
  openImportModal(importModalSelector, importBtnElipses, modalText) {
    ImportHelper.openImportModal(
      importModalSelector,
      importBtnElipses,
      modalText
    );
  }

  /**
   * Downloads the sample import file and verifies it is successfully downloaded.
   * @returns {void}
   */
  downloadSampleFile() {
    ImportHelper.downloadSampleFile(sampleFileName);
  }

  /**
   * Attempts to import an invalid file format and verifies validation.
   * @returns {void}
   */
  importInvalidFileFormat() {
    ImportHelper.performInvalidImport(
      invalidPath,
      locators.risk.administration.importOperations.submitImportControl
    );
  }

  /**
   * Cancels the current import operation.
   * @returns {void}
   */
  cancelImport() {
    ImportHelper.cancelImport();
  }

  /**
   * Updates the Control Taxonomy import JSON file with a unique name,
   * converts it to XLSX, and stores the updated name for later validation.
   * @returns {void}
   */
  updateControlTaxonomyImportJSON() {
    // const libraryAdded = "test Library jsyco";
    const uniqueImportName = DateHelper.generateUniqueNameWithTimestamp(
      data.import.importName
    );

    // Update tmhe JSON file
    FileHelper.updateImportJSONFileSections(
      qbImport,
      data.import.nameControlCategory,
      0,
      {
        "Name*": uniqueImportName,
      }
    ).then(() => {
      // Read the updated file and convert to XLSX
      cy.readFile(qbImport).then((updatedJsonData) => {
        cy.convertXlsxtoJson(updatedJsonData, false, true);
        // Use the writeControl categoru Name method from Control categoru class
        const controlTaxonomyCustomer = new ControlTaxonomies();
        controlTaxonomyCustomer.writeControlTaxonomiesCustomerSpace(
          true,
          uniqueImportName
        );
      });
    });
  }
  /**
   * Uploads a valid file for import and submits the import form.
   * @param {boolean} validFormatFile - Whether to use xlsx or csv format.
   * @param {string} fileName - Default file name (without extension).
   * @param {string} submitBtnLoc - Locator for submit button.
   * @param {string} uploadFilePath - Base folder path.
   * @param {string|null} customFilePath - Full custom file path (optional).
   */
  uploadValidConvertedFile(customFilePath = null) {
    ImportHelper.uploadAndSubmitLargeImportFile(
      true,
      data.import.importFileName,
      locators.risk.administration.importOperations.submitImportControl,
      data.import.importDownload,
      customFilePath
    );
  }
  /**
   * Search for a control taxonomy in the grid
   * @param {string} updatedName - Optional updated name to search for
   * @returns {Cypress.Chainable} - Cypress chainable with search operation
   */
  searchControlTaxonomy(updatedName) {
    return FileHelper.readJsonFile(writeFile).then((fileData) => {
      const controlTaxonomyName = updatedName
        ? updatedName
        : fileData.import.importName;

      // Search in grid by text and check visibility
      cy.get(locators.risk.controlTaxonomies.categoryTreeField, {
        timeout: 3000,
      })

        .find(locators.risk.controlTaxonomies.selectTreeText, { timeout: 3000 })

        .contains(controlTaxonomyName);
    });
  }
}

export { ControlTaxonomies, ImportOperations };
