import PredictMenu_PO from "../Menu_PO/PredictMenu_PO";
import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import LumifyInsight from "../../../support/POM/KXIModule/Insight/LumifyInsight";
import dataFile from "../../../fixtures/KXIModule/Insight/InsightToleranceFilter.json";
import data from "../../../fixtures/KXIModule/CustomFieldArray.json";
import KXI_POM from "./KxI_POM";
const taskFilePath = "cypress/fixtures/KXIModule/customFieldWrite.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
export default class CustomField {
  menu = new PredictMenu_PO();
  kxi = new KXI_POM();
  lumifyInsight = new LumifyInsight();

  /*Navigate to Custom Fields Screen which lies in side menu under Administration Section */

  customFieldMenu() {
    cy.visitProfile();
    this.menu.menuClick();
    cy.get(locators.menu.administration).click();
    cy.get(locators.menu.customFields).should("be.visible").click();
  }

  /**
   * Method for adding Custom Fields for KXI Data and KXI Definition
   * @param {string} screen Select from "For" dropdown
   * @param {string}  field  Select from "Type" dropdown
   *  @param {boolean}  required  Check Required checkbox
   *   @param {boolean}  optionalField  Enter data in option Label for Radiobutton and Checkbox Custom Fields
   * @param {boolean}  moreOptionFields  Enter data in option Label for 'Multi-List' and 'Single-List' Custom Fields
   * @param {string}  customField  Custom Field Name
   */
  addCustomField(
    screen,
    field,
    required,
    optionalField,
    moreOptionFields,
    customField = null,
    onlySave
  ) {
    this.customFieldMenu();
    cy.get(locators.administration.customFields.addBtn).click();
    cy.createRandomString(3).then((randomString) => {
      const fullName = screen + "for" + field + randomString;
      cy.get(locators.administration.customFields.name, {
        timeout: 10000,
      }).type(fullName);

      cy.readFile(taskFilePath).then((file) => {
        file.customName = fullName;
        cy.writeFile(taskFilePath, file);
      });
    });
    /*Click to Check 'Required' checkbox */
    if (required === true) {
      cy.get(locators.administration.customFields.requiredCheckbox).click();
    }

    /*Enter option for Single List and Multi List Custom Fields */
    this.selectFromDropdowns(screen, field);
    /*Enter option name for Radio button and checkboxes */
    if (optionalField === true) {
      cy.get(locators.administration.customFields.optionInput).type(
        "Radio Button"
      );
    }
    if (moreOptionFields === true) {
      this.moreOptionFields();
    }

    /*Click Save button to save Custom fields */
    this.clickSave();

    if (onlySave === true) {
      if (screen === "KxI Definition" && customField !== null) {
        /*Verify added custom fields on KXI Definition */
        this.verification(customField);
      } else {
        /*Verify added custom fields on KXI Data */
        this.verifyOnKxiDataAddForm();
      }
    }
  }

  /**Enter option for Single List and Multi List Custom Fields  with
   * @param {string} screen Select from "For" dropdown
   * @param {string}  field  Select from "Type" dropdown
   */
  selectFromDropdowns(screen, field) {
    cy.get(locators.administration.customFields.forDropdown).click();
    cy.get(locators.administration.customFields.searchInput)
      .type(screen)
      .type("{Enter}");
    cy.get(locators.administration.customFields.fieldTypeDropdown).click();
    cy.get(locators.administration.customFields.searchInput)
      .eq(1)
      .type(field)
      .type("{Enter}");
  }
  /*Click Save button to save Custom fields  on Custom Field flyout and verify success toastr msg */
  clickSave() {
    cy.get(locators.administration.customFields.saveBtn).click();
    cy.verifyToastMessageText("Custom Field saved successfully.", 3000);
  }
  /**Verify KXI Data and Definition in For dropdown on "Add" flyout by clicking add btn on custom Field Screen 
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule 
 
  */
  verifykxiDefinionInForDropdown(text) {
    cy.get(locators.administration.customFields.addBtn).click();
    cy.get(locators.administration.customFields.forDropdown).click();

    cy.get(locators.administration.customFields.labelOption).contains(text);
  }

  /*Click delete button and then confirmation modal;s button to delete Custom fields on Custom Filed Screen  */
  clickDelete() {
    cy.get(locators.administration.customFields.deleteBtn).first().click();
    cy.get(locators.administration.customFields.modalDelete).click();
  }
  /**Verify added custom Fields on kxi Definiton Add form 
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule 
  
   */
  verifyOnKxiDefAddForm(text) {
    cy.visitkxiDef();
    this.kxi.addkxi();
    this.verifyHeadingAndFields(text);
  }
  /**Verify Custom Field heading added custom Fields on kxi Definiton screen by clicking "Add" button 
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule 
 
  */
  verifyHeadingAndFields(text) {
    cy.get(locators.kxi.kxiDefinition.customField.headingText, {
      timeout: 30000,
    }).should("have.text", text);
    cy.readFile(taskFilePath).then((file) => {
      cy.get(locators.kxi.kxiDefinition.customField.labelText).contains(
        file.customName
      );
    });
  }
  /**Verify added custom Fields on kxi Definiton Screen by clicking Edit button 
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule 
 
   */
  verifyOnKxiDefEditForm(text) {
    cy.visitkxiDef();
    this.kxi.editKxi();
    this.verifyHeadingAndFields(text);
  }
  /**Verifying Custom Fields on add, edit kxi Definition  and Insight Screen
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule
   */
  verification(text) {
    this.verifyOnKxiDefAddForm(text);
    this.verifyOnKxiDefEditForm(text);
    this.verifyOnInsightScreen(text);
  }

  /**Verify added custom Fields on Insight Screen 
   * @param {string} text custom Field Name from Write file 'customFieldWrite.json' under fixtures > KXIModule 
 
  */
  verifyOnInsightScreen(text) {
    cy.visitkxiRiskInsight();
    this.lumifyInsight.selectToleranceFilter(dataFile.toleranceFilter.all);
    cy.get(locators.kxi.insight.kXIArrow).eq(0).click();
    cy.get(locators.kxi.insight.createKRI).click();
    this.verifyHeadingAndFields(text);
  }

  /*Enter option values for Dropdown List ('Single List' or 'Multi List') in "Add" flyout on Custom Field Screen*/
  moreOptionFields() {
    cy.get(locators.administration.customFields.optionInput)
      .eq(0)
      .type("Option 1");
    cy.get(locators.administration.customFields.moreBtn).click();
    cy.get(locators.administration.customFields.optionInput)
      .eq(1)
      .type("Option 2");
    cy.get(locators.administration.customFields.moreBtn).click();
    cy.get(locators.administration.customFields.optionInput)
      .eq(2)
      .type("Option 3");
  }

  /*Delete spcific Custom Field that will be fetch from Write file 'customFieldWrite.json' under fixtures > KXIModule */
  deleteCustomField() {
    this.customFieldMenu();
    cy.readFile(taskFilePath).then((file) => {
      cy.contains("a", file.customName)
        .parents("tr")
        .within(() => {
          cy.get(locators.administration.customFields.deleteBtn).click();
        });
    });
    /*Delete button of confimation modal after clicking Delete button on Custom Fields*/
    cy.get(locators.administration.customFields.modalDelete).click();
  }
  verifyOnKxiDataAddForm() {
    cy.visitkxiData();

    cy.get(locators.kxi.kxiData.threeElepsis).click();
    cy.get(locators.kxi.kxiData.clickAdd).click();
    cy.readFile(taskFilePath).then((file) => {
      cy.get(locators.kxi.kxiDefinition.customField.labelText).should(
        "contain",
        file.customName
      );
    });
  }
  /**Caling method to verify Custom Field on kxi Data popup by fetching kxiName from Write file
   * @param {string} user the login username for entering owner while adding kxi Definition
     Validate in DataGrid after choosing from Column picker
   */
  verifyCustomFieldsONKxiData(user) {
    this.verifyOnKxiDataAddForm();
    cy.readFile(writeDataFilePath).then((file) => {
      this.kxi.addKxiDataAndDefinition(file.kxiName, user);
      this.kxi.searchAndValidateCustomFieldInGrid(file.kxiName);
    });
  }

  /**Caling method to verify Date Custom Field on kxi Data popup by fetching kxiName from Write file 
   * @param {string} user the login username for entering owner while adding kxi Definition
     Validate in DataGrid after choosing from Column picker
   */
  verifyDateCustomFieldsONKxiData(user) {
    this.verifyOnKxiDataAddForm();
    cy.readFile(writeDataFilePath).then((file) => {
      this.kxi.addKxiDataAndDefinition(file.kxiName, user);
      this.kxi.searchAndValidateDateCustomFieldInGrid(file.kxiName);
    });
  }
  /**Caling method to verify custom Field name and Value in Audit log
   * @param {string} user the login username for entering owner while adding kxi Definition
     Validate in DataGrid after choosing from Column picker
   */
  verifyAddedCustomFieldonAuditLog(user) {
    this.verifyOnKxiDataAddForm();
    cy.readFile(writeDataFilePath).then((file) => {
      this.kxi.addKxiDataAndDefinition(file.kxiName, user);
      this.kxi.ValidateDataCustomFieldInAuditLog(file.kxiName);
    });
  }
  /**Caling method to verify File Custom Field on kxi Data popup by fetching kxiName from Write file
   * @param {string} user the login username for entering owner while adding kxi Definition
   */
  verifyFileCustomFieldsONKxiData() {
    cy.visitkxiData();
    cy.get(locators.kxi.kxiData.threeElepsis).click();
    cy.get(locators.kxi.kxiData.clickAdd).click();
    cy.readFile(taskFilePath).then((file) => {
      cy.get(locators.kxi.kxiDefinition.customField.labelText).should(
        "contain",
        file.customName
      );
    });
  }
  /**Validate deleted custom Field should not display on kxi Data popup */
  verifyDeletedCustomFieldsONKxiData() {
    cy.visitkxiData();
    cy.get(locators.kxi.kxiData.threeElepsis).click();
    cy.get(locators.kxi.kxiData.clickAdd).click();
    cy.get(locators.kxi.kxiDefinition.customField.labelText).should(
      "not.exist"
    );
  }
  // Helper function to add/edit custom fields and validate audit log

  verifyAuditLogForCustomField(
    screenName,
    fieldType,
    required,
    optionfield,
    operation,
    userName,
    editText,
    checkAllLogs = false
  ) {
    if (operation === "add") {
      this.customFieldMenu();
      this.addCustomField(screenName, fieldType, required, optionfield);
      this.kxi.addKxiDefinitionForAuditLog(userName, false, checkAllLogs);
    } else if (operation === "edit") {
      cy.visitProfile();
      this.kxi.validatedEditCustomFieldAuditLogs(editText, checkAllLogs);
    }
  }
}
