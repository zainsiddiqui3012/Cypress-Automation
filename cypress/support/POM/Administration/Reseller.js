import locators from "../../../fixtures/locators.json";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
const resellerData = "cypress/fixtures/Administration/Resellers.json";

class Reseller {
  /**
   * checkForMandatoryFields will Check for mandatory fields when a user opens the reseller form and display errors if the form
   *  is saved empty.
   */
  checkForMandatoryFields() {
    cy.readFile(resellerData).then((file) => {
      cy.get(locators.administration.resellers.resellerEmail).type(
        file.addReseller.invalidEmail
      );
      cy.get(locators.administration.users.userFormSavebtn)
        .scrollIntoView()
        .wait(1000)
        .click();
      file.mendatoryFieldErrors.forEach((value) => {
        cy.get(locators.administration.resellers.resellerFormField).should(
          "contain.text",
          value
        );
      });
      cy.verifyToastMessageText(file.mandatoryFieldToastErrrMsg, 30000);
    });
  }

  /**
   * checkForDisabledTabs function will be used in the reseller and customers creation, whenever user create
   * customer or reseller summary form opens and all the other tabs are disabled, this function will work for the verification
   * of all the disabled tabs
   */
  checkForDisabledTabs() {
    //Checking for the disabled tabs
    this.clickAddUserBtn();
    cy.get(locators.administration.resellers.disabledTabs)
      .children()
      .each(($el, index) => {
        if (index > 0 && index < 5) {
          cy.wrap($el).find(".disabled").should("exist");
        }
      });
  }

  checkForEnabledTabs() {
    //Checking for the enabled tabs
    cy.get(locators.administration.resellers.disabledTabs)
      .children()
      .each(($el, index) => {
        if (index > 0 && index < 5) {
          cy.wrap($el)
            .should("not.have.class", "disabled")
            .and("not.have.attr", "disabled");
        }
      });
  }
  /**
   * clickAddUserBtn() function opens the reseller or customer creation form and
   *  facilitates the creation of a reseller or customer.
   */
  clickAddUserBtn() {
    cy.get(locators.administration.users.addUserBtn, {
      timeout: 40000,
    }).click({ force: true });
  }

  /**
   * addReseller() function opens the reseller form and adds the summary data to create a reseller
   */
  addReseller() {
    cy.readFile(resellerData).then((file) => {
      this.clickAddUserBtn();

      this.submitResellerForm(file.addReseller, "addReseller", false, true);
      this.submitResellerForm(
        file.addReseller,
        "addReseller",
        "invalidFormatFile"
      );
      this.submitResellerForm(
        file.addReseller,
        "addReseller",
        "exceedSizeFile"
      );
      this.submitResellerForm(file.addReseller, "addReseller");
    });
  }

  /**
   * editResellerSummary() function will update the details of the newly created reseller summary
   */
  editResellerSummary() {
    cy.readFile(resellerData).then((file) => {
      this.searchWithFilter("addReseller");
      this.submitResellerForm(file.updateReseller, "updateReseller");
    });
  }

  writeToOtherFiles() {
    cy.readFile(resellerData).then((file) => {
      cy.readAndWriteData("Reseller", file.updateReseller.name);
      cy.readAndWriteData("UserGroup Reseller", file.updateReseller.name);
    });
  }

  /**
   * submitResellerForm will input the field values while creating and updating the reseller
   * @param {Object} data can be used for {updateReseller, addReseller} from test data files resellers.json
   * @param {String} section  will be section name that will be given from the test data file resellers.json
   * section can be (addReseller, updateReseller)
   */
  submitResellerForm(data, section, fileType = false, invalidKey = false) {
    cy.get(locators.administration.resellers.resellerFormField).within(() => {
      this.addRandomNameKey(
        locators.administration.resellers.resellerName,
        locators.administration.resellers.resellerKey,
        resellerData,
        section,
        invalidKey
      );

      cy.get(locators.administration.resellers.resellerEmail)
        .clear()
        .type(data.email);

      //adding optional fields contactName,phoneNumber,address,street,city
      let optionalFields = [
        {
          name: "contactName",
          locators: locators.administration.resellers.contactName,
        },
        {
          name: "phoneNumber",
          locators: locators.administration.resellers.phoneNumber,
        },
        {
          name: "address",
          locators: locators.administration.resellers.address,
        },
        { name: "street", locators: locators.administration.resellers.street },
        { name: "city", locators: locators.administration.resellers.city },
        { name: "zip", locators: locators.administration.resellers.zip },
        {
          name: "country",
          locators: locators.administration.resellers.country,
        },
      ];
      optionalFields.forEach(({ name, locators }) => {
        cy.readFile(resellerData).then((file) => {
          cy.createRandomAlphaNumeric(5).then((alphaNumericValues) => {
            file[section][name] = "test data" + " " + alphaNumericValues;
            cy.typeOptionalEmptyFieldCondition(file[section][name], locators);
            cy.writeFile(resellerData, file);
          });
        });
      });
      data.active === true
        ? cy
            .get(locators.administration.resellers.activeStatus)
            .click({ force: true })
        : cy
            .get(locators.administration.resellers.inActiveStatus)
            .click({ force: true });

      if (data.isConsultant === true)
        cy.get(locators.administration.resellers.isConsultant).click({
          force: true,
        });

      // submitting different files (valid, invalidFormat, exceedSize) with the fileTypeConditions
      this.uploadLogo(data, fileType);

      //Clicking on Parent Modules
      data.modules.forEach((moduleNames) => {
        this.addModules(moduleNames);
      });
      //clicking on sub Modules
      if (data.subModule.isSubModule === true) {
        data.subModule.subModuleNames.forEach((names) => {
          this.addModules(names);
        });
      }
    });
    //saving reseller
    cy.get(locators.administration.users.userFormSavebtn).click({
      force: true,
    });

    this.writeToOtherFiles();
    cy.readFile(resellerData).then(($el) => {
      //check that error should appear if key is already exists
      if (invalidKey) {
        cy.verifyToastMessageText($el.invalidKeyError, 20000);
        cy.visitReseller();
        this.clickAddUserBtn();
      } else {
        //check that error should appear if logoFile is invalid or exceeded in size
        if (fileType === "invalidFormatFile") {
          cy.verifyToastMessageText($el.mandatoryFieldToastErrrMsg, 20000);
          cy.visitReseller();
          this.clickAddUserBtn();
        } else if (fileType === "exceedSizeFile") {
          cy.verifyToastMessageText($el.fileExceedSizeError, 20000);
          cy.visitReseller();
          this.clickAddUserBtn();
        } else {
          cy.log("no value passed");
        }
      }
    });
  }

  /**
   * verifyResellerFieldValues will verify the saved field values in the reseller summary.
   * this function is using under verifyAddedReseller() function
   * @param {Object} resellerData is the Json data file from resellers.json
   */
  verifyResellerFieldValues(data, regulations = false) {
    cy.get(locators.administration.resellers.resellerName).should(
      "have.value",
      data.name
    );
    if (!regulations)
      cy.readFile(resellerData).then((file) => {
        cy.get(locators.administration.resellers.resellerKey).should(
          "have.value",
          file.addReseller.key
        );
      });
    cy.get(locators.administration.resellers.resellerEmail).should(
      "have.value",
      data.email
    );
    cy.get(locators.administration.resellers.contactName).should(
      "have.value",
      data.contactName
    );
    cy.get(locators.administration.resellers.phoneNumber).should(
      "have.value",
      data.phoneNumber
    );
    cy.get(locators.administration.resellers.address).should(
      "have.value",
      data.address
    );
    cy.get(locators.administration.resellers.street).should(
      "have.value",
      data.street
    );
    cy.get(locators.administration.resellers.city).should(
      "have.value",
      data.city
    );
    cy.get(locators.administration.resellers.zip).should(
      "have.value",
      data.zip
    );
    cy.get(locators.administration.resellers.country).should(
      "have.value",
      data.country
    );
    data.modules.forEach((mainModuleNames) => {
      this.verifyModulesSubModules(mainModuleNames, true);
    });
    if (data.subModule.isSubModule === true) {
      data.subModule.subModuleNames.forEach((subModuleNames) => {
        this.verifyModulesSubModules(subModuleNames);
      });
    }
  }

  /**
   * verifyModulesSubModules function will verify that the required modules and submodules are added during the
   * creation and updating of a reseller.
   * It checks that the reseller’s modules and submodules are correctly marked as per the test data JSON file.
   * @param {Object} moduleNames
   */
  verifyModulesSubModules(moduleNames, verifyDisabledMainModules = false) {
    //verifying that the main modules can not be edited but they will be disabled
    const exactText = new RegExp(`^\\s*${moduleNames}\\s*$`);

    //verify Selected Modules, which are selected or checked by the user (main already selected modules can not be updated they will be disabled)
    cy.get(locators.administration.resellers.resellerModules)
      .contains("label", exactText) // Find the label containing the module name
      .find(locators.administration.resellers.verifyModules) // Ensure this points to the <input>
      .then(($input) => {
        cy.wrap($input).should("exist"); // Ensure the input exists
        verifyDisabledMainModules
          ? cy.wrap($input).should("be.disabled").and("be.checked")
          : cy.wrap($input).should("be.checked");
      });
  }

  searchWithFilter(sectionName) {
    cy.readFile(resellerData).then((file) => {
      cy.reload();
      cy.visitReseller();
      cy.get(locators.general.filterIcon).parent().click();
      cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
      cy.searchFilterName(file[sectionName].name, "All");
      cy.get(locators.administration.resellers.addedReseller)
        .contains(file[sectionName].name)
        .click();
      cy.waitForTopMsgLoaderToDisappear(20000);
    });
  }

  /**
   * verifyAddedReseller function can be used for reseller creation and updation.
   * It will verify the details of the reseller creation and updation summary.
   * @param {Object} resellerData is the Json data file from resellers.json
   * @example param can be addReseller, updateReseller
   */
  verifyAddedReseller(sectionName, regulations = false) {
    this.searchWithFilter(sectionName);

    cy.readFile(resellerData).then((file) => {
      // Verifying the default modules that will be displayed when reseller form is opened
      file.allAvailableModules.forEach((availableModuleNames) => {
        cy.get(locators.administration.resellers.resellerModules).contains(
          availableModuleNames
        );
      });
      this.verifyResellerFieldValues(file[sectionName], regulations);
    });
  }

  /**
   * addModules will add modules and submodules during the creation and updating of a reseller
   * @param {String} moduleName is reseller module names
   */
  addModules(moduleName) {
    const exactText = new RegExp(`^\\s*${moduleName}\\s*$`);
    cy.get(locators.administration.resellers.resellerModules)
      .contains(exactText)
      .click();
  }

  /**
   * addRandomKey will update the reseller or creation names and keys with random key of 8 digits
   * this function is using for reseller creation,updation and customer creation
   * @param {String} nameLocator is name (reseller, customer) field locator
   * @param {String} keyLocator is (reseller, customer) key locator
   * @param {String} dataFilePath will be the string path (resellers.json, customers.json)
   * @param {Object} section is the test data ection name {for resellers.json= addReseller, updateReseller}
   * for {customers.json= addCustomer, updateCustomer}
   */
  addRandomNameKey(
    nameLocator,
    keyLocator,
    dataFilePath,
    section,
    invalidKey = false
  ) {
    cy.createRandomString("8").then(($el) => {
      cy.readFile(dataFilePath).then((file) => {
        let baseName = file[section]["baseName"];
        // Clear the existing "name" and "key" values in the JSON file
        file[section]["name"] = baseName; // Set the base name

        // Append the random string to the name
        let newName = `${file[section]["name"]} ${$el}`;

        // Update the name in the JSON file
        file[section]["name"] = newName; // Ensure this line is correct

        // Interact with the DOM to clear and type new name
        cy.get(nameLocator).clear({ force: true }).type(newName);

        // Check for the invalid Key
        if (invalidKey) {
          cy.get(keyLocator)
            .clear()
            .type(file[section].existKey, { force: true });
        } else {
          file[section]["key"] = ""; // Clear the key value
          file[section]["key"] = `${$el}`; // Set the key to the random string
          cy.get(keyLocator).type($el, { force: true });
        }
        cy.log("added new name", file[section]["name"]);
        // Write the updated file back to the JSON
        cy.writeFile(dataFilePath, file);
      });
    });
  }

  /**
   * uploadLogo will upload the wrong format logo files it also upload the file which has more than 150KB
   * for these kinds of files seperate toast errors will be populated on saving reseller form
   * @param {Object} data is the object it can be the object of (addReseller, updateReseller)
   * @param {String} fileType it is the conditional string and it will upload the logo based on the string values
   */
  uploadLogo(data, fileType) {
    if (fileType === "invalidFormatFile") {
      cy.uploadFile(data.logo.invalidFormatLogo);
    } else if (fileType === "exceedSizeFile") {
      cy.uploadFile(data.logo.sizeExceedFile);
    } else cy.uploadFile(data.logo.validLogo);
  }

  clickResellerFormCloseBtn() {
    this.clickAddUserBtn();
    cy.get(locators.general.closeForm)
      .click({ multiple: true, force: true })
      .should("not.be.visible");
  }
  /*
    This function clicks on the first reseller name in the reseller list.

    1. Selects the first element that matches the reseller name locator.
    2. Performs a forced click to ensure interaction even if the element is not interactable by default.
    3. Waits for the top message loader to disappear before moving to the next step.
       The wait timeout is set to 20 seconds.
  */
  clicksOnFirstReseller() {
    cy.get(locators.administration.resellers.listResellerName)
      .first()
      .click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(20000);
  }

  /*
    This function clicks on the "Compliance Management System" module under the reseller's modules.

    1. Locates the list of modules associated with a reseller.
    2. Searches for the module with the label matching "Compliance Management System".
    3. Scrolls the element into view to ensure it's visible.
    4. Verifies the module exists.
    5. Clicks on the module to activate or open it.
  */
  clicksOnComplianceManagementModule() {
    cy.get(locators.administration.resellers.resellerModules)
      .contains(
        regChangeMenu.regulatoryChangeManagement.complianceManagementSystem.name
      )
      .scrollIntoView()
      .should("exist")
      .click();
  }

  /*
    This function verifies the visibility of the "Feed Register" module under Regulatory Change Management.

    1. Targets the checkbox area for CMS modules.
    2. Searches for the label matching "Feed Register".
    3. Verifies that the label exists and is visible to confirm the module is enabled/present.
  */
  verifyRegulatoryChangeFeedRegisterModuel() {
    cy.get(locators.administration.resellers.cmsCheckBox)
      .contains(
        "label",
        regChangeMenu.regulatoryChangeManagement.feedRegister.name
      )
      .should("exist")
      .and("be.visible");
  }

  // Helper function for customer search
  searchResellerName(resellerName) {
    // Reload and visit the customer section
    cy.reload();
    cy.visitReseller();

    // Perform the search
    cy.get(locators.general.searchIcon).click();
    cy.get(locators.general.searchTextBox)
      .clear()
      .type(resellerName)
      .type("{enter}");

    // Wait for loader to disappear
    cy.waitForTopMsgLoaderToDisappear(150000);
  }
  /**
   * Ensures a module is checked, and verifies that its related sub-module is not visible.
   *
   * @param {string} moduleName - Exact label text of the module to check (e.g., "Compliance Management").
   * @param {string} subModuleName - Text of the sub-module to confirm is hidden (e.g., "Regulatory Change Management").
   */
  verifyRegulatoryChangeManagementNotVisible(moduleName, subModuleName) {
    cy.get("label.m-checkbox")
      .contains(moduleName)
      .find('input[type="checkbox"]')
      .then(($checkbox) => {
        if (!$checkbox.is(":checked")) {
          cy.wrap($checkbox).click({ force: true });
        }
      });
    cy.contains(
      locators.administration.customers.regChangeSubModule,
      subModuleName
    ).should("not.exist");
  }
  /*
    This function clicks on the first reseller name in the list.
    
    1. It targets the first element that matches the reseller name locator.
    2. Performs a forced click to ensure it interacts even if obscured.
    3. Waits for the top message loader to disappear before proceeding.
       The wait timeout is set to 20 seconds to allow for any async loading.
  */
  clicksOnFirstResellerName() {
    cy.get(locators.administration.resellers.listResellerName)
      .first()
      .click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(20000);
  }
}
export default Reseller;
