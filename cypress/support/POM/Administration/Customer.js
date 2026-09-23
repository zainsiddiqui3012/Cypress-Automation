import locators from "../../../fixtures/locators.json";
import Reseller from "../../../support/POM/Administration/Reseller";
import Assessment from "../../../support/POM/Administration/Assessment";
const customerData = require("../../../fixtures/Administration/Customers.json");
const reseller = new Reseller();
const assessment = new Assessment();
const customerDataString = "cypress/fixtures/Administration/Customers.json";

class Customer {
  /**
   * checkForMandatoryFields will Check for mandatory fields when a user opens the Customer form and display errors if the form
   *  is saved empty.
   */
  checkForMandatoryFields() {
    cy.get(locators.general.emailField).type(
      customerData.addCustomer.invalidEmail
    );
    cy.get(locators.general.formSaveBtn).scrollIntoView().wait(1000).click();
    customerData.mendatoryFieldErrors.forEach((value) => {
      cy.get(locators.administration.customers.customerFormField).should(
        "contain.text",
        value
      );
    });
  }

  /**
   * addCustomer is calling function from testCase, this function is used in testCase file,
   * in this function new Customer will be created and verified as per the new customer testData
   */
  addCustomer() {
    reseller.clickAddUserBtn();
    //verify that when Add customer form is opened Active status should be checked bydefault
    cy.get(locators.administration.customers.activeStatus).should("be.checked");

    //verify that form is closing when click on 'Cancel' btn in add customer form
    cy.get(locators.general.closeForm).click({ multiple: true, force: true });
    cy.get(locators.general.closeForm).should("not.be.visible");

    reseller.clickAddUserBtn();
    cy.readFile(customerDataString).then((file) => {
      //checking for the already exist key
      this.addCustomerSummary(file.addCustomer, true)

      //verify that toast msg should be appear when no module is selected when adding customer
      this.addCustomerSummary(file.addCustomer, false, true)

      //verify that when invalid Format file is uploaded it should show the error in customer form
      this.addCustomerSummary(
        file.addCustomer,
        false,
        false,
        "invalidFormatFile"
      );

      //verify that when exceed size file is uploaded it should show the toast error on saving the customer
      this.addCustomerSummary(file.addCustomer, false, false, "exceedSizeFile");

      //verify that customer is created with the valid Data values
      this.addCustomerSummary(file.addCustomer);
      cy.readFile(customerDataString).then((file)=>{
        cy.readAndWriteData("Customer", file.addCustomer.name);
        cy.readAndWriteData("Key", file.addCustomer.key);
        cy.readAndWriteData("UserGroup Customer", file.addCustomer.name);
      })
      // this.verifyAddedCustomer(file.addCustomer, "addCustomer");
    });
  }

  verifyCustomer(sectionName){
    cy.readFile(customerDataString).then((file) => {
      this.verifyAddedCustomer(file[sectionName], sectionName);
    })
  }

  /**
   * editCustomer is calling function from testCase, this function is used in testCase file,
   * in this function Existing Customer will be updated and verified as per the updated customer testData
   */
  editCustomer() {
    cy.readFile(customerDataString).then((file) => {
      // this.verifyAddedCustomer(file.addCustomer, "addCustomer");
      this.searchWithFilter()
      reseller.checkForEnabledTabs();
      this.editCustomerSummary(file.updateCustomer);
      // this.verifyAddedCustomer(file.updateCustomer, "updateCustomer");
    });
  }

  /**
   * addEditInstanceType is used to reduce the redundency while adding/updating the customer instance type Field dropdown,
   * @param {String} data is the JSON object it can be (customerData.addCustomer/customerData.updateCustomer)
   */
  addEditInstanceType(data) {
    cy.get(locators.administration.customers.industriesDropDown).click({
      force: true
    });
    cy.get(locators.administration.customers.industriesDropDownSearch)
      .find("input")
      .type(data, { delay: 700, force: true })
      .type("{enter}",{force:true})
      .clear({ force: true });
  }

  /***********************************<<<<< Add/Edit Customer Data Functions Sections >>>>>>>>>>>>>>>>>>>>>>>>>>>> */

  // << Below are Helper Functions that will be used in Adding and Editing the Customers >>>

  /**
   * Method to handle dropdown selection
   *  @param {String} locator is the field locator when click dropdown open
   * @param {String} searchLocator is the search box text in dropdown
   * @param {String} value will be the searched name
   *  */
  selectDropdown(locators, searchLocator, value) {
    cy.get(locators).click({force:true});
    cy.dropDownSearchAndSelect(searchLocator, value);
  }

  // Method to handle Typing in Field
  typeInField(locator, value) {
    cy.get(locator).clear({ force: true }).type(value,{delay:100});
  }

  // Method to handle active/inactive status toggling
  toggleStatus(status, locators, key, externalAuthValue, data = false) {
    switch (key) {
      case "Status":
        const statusLocator = status
          ? locators.administration.customers.activeStatus
          : locators.administration.customers.inActiveStatus;
        cy.get(statusLocator).click({ force: true });
        break;

      case "Authentication Type":
        const authStatus = status ? "[value='internal']" : "[value='external']";
        cy.get(authStatus).click({ force: true });
        if (!status) {
          cy.get(locators.general.formSaveBtn).click();
          cy.verifyToastMessageText(customerData.saveError, 40000);
          cy.get("#s2id_externalAuthType").click();
          cy.dropDownSearchAndSelect(
            locators.general.dropDownSearch,
            externalAuthValue
          );

          if (externalAuthValue === "AD Federation Services") {
            this.handleExternalProvider(data.externalProvider);
          }
        }
        break;

      default:
        throw new Error(`Invalid key: ${key}`);
    }
  }

  handleExternalProvider(externalProvider) {
    cy.get(locators.administration.toastMsg).click();
    cy.get(locators.general.formSaveBtn).scrollIntoView().click({ fore: true });
    cy.verifyToastMessageText(customerData.saveError, 40000);
    cy.get(locators.administration.toastMsg).click();
    cy.get("#externalAuthIDP").type(externalProvider);
    this.selectExternalPredictSSO();
    this.handleSwitchToInternal();
  }

  handleSwitchToInternal() {
    cy.get("[value='internal']").click({ force: true });
  }

  selectExternalPredictSSO() {
    cy.get("#s2id_externalAuthType").click();
    cy.dropDownSearchAndSelect(locators.general.dropDownSearch, "Predict SSO");
  }

  // Method to handle module/submodule addition
  addModulesAndSubmodules(modules, submoduleData) {
    modules.forEach((module) => {
      reseller.addModules(module);
    });

    if (submoduleData.isSubModule === true) {
      submoduleData.subModuleNames.forEach((name) => {
        reseller.addModules(name);
      });
    }
  }

  // Method to handle optional fields
  /**
   * handleOptionalFields will be the optional fields from test data e.g (description, tags etc) from customers.json
   * @param {Object} data is the test data object from customer.json
   * @param {String} locators is the locator
   */
  handleOptionalFields(data, locators) {
    //handle optional custom category field and values
    assessment.typeOptionalEmptyFieldCondition(
      data.customerCategory,
      locators.administration.customers.customerCategory
    );

    // handle optional template checkbox value
    assessment.clickOptionalBooleanFieldCondition(
      data.isTemplate,
      locators.administration.customers.isTemplate
    );

    // handle optional enble password expiry check and days field,values
    assessment.clickOptionalBooleanFieldCondition(
      data.passwordExpiration.enablePasswordExpiration,
      locators.administration.customers.enablePasswordExpiration
    );

    // if pasword expiration checkbox is checked and enabled add the days for password expiration settings
    if (data.passwordExpiration.enablePasswordExpiration) {
      cy.get(locators.administration.customers.enablePasswordExpiration).should(
        "be.checked"
      );
      cy.get(locators.administration.customers.passwordExpirationDays)
        .clear()
        .type(data.passwordExpiration.days);
    }
  }

  //----------------------------{Add-Customer-Summary-Form}-----------------------------------
  // Add a new customer

  /**
   * addCustomerSummary will create new Customer and input the fields data as per the test data files from customerData.addCustomer
   * @param {string} data is test data object from (customerData.addCustomer)
   */
  addCustomerSummary(
    data,
    existKey = false,
    noModuleSelect = false,
    fileType = false
  ) {
    // Mandatory Fields
    this.selectDropdown(
      locators.administration.customers.customerDropDown,
      locators.general.dropDownSearch,
      data.resellerName
    );
    this.selectDropdown(
      locators.administration.customers.instanceDropDown,
      locators.general.dropDownSearch,
      data.instanceType
    );

    reseller.addRandomNameKey(
      locators.general.nameField,
      locators.administration.customers.customerKey,
      customerDataString,
      "addCustomer",
      existKey
    );

    //add industries in instance.
    data.industries.forEach(($industry) => {
      this.addEditInstanceType($industry); // Assuming this is defined elsewhere
    });
    // this.addEditInstanceType(data.industries); // Assuming this is defined elsewhere
    this.typeInField(locators.general.emailField, data.email);

    // Adding Modules and Submodules
    if (!noModuleSelect)
      this.addModulesAndSubmodules(data.modules, data.subModule);

    // submitting different files (valid, invalidFormat, exceedSize) with the fileTypeConditions
    reseller.uploadLogo(data, fileType);

    this.toggleStatus(data.active, locators, "Status", data.externalAuthValue);
    this.toggleStatus(
      data.internal,
      locators,
      "Authentication Type",
      data.externalAuthValue,
      data
    );

    // Optional Fields
    this.handleOptionalFields(data, locators);

    //add custom Predict 360 URL value,
    cy.typeOptionalEmptyFieldCondition(
      data.customPredict360URL,
      "#customAppUrl"
    );

    // Save Customer
    cy.get(locators.administration.users.userFormSavebtn).click({
      force: true
    });

    cy.readFile(customerDataString).then(($el) => {
      //check that error should appear if key is already exists
      if (existKey) {
        cy.verifyToastMessageText($el.existKeyError, 20000);
        cy.visitCustomer();
        reseller.clickAddUserBtn();
      }

      if (noModuleSelect) {
        cy.verifyToastMessageText($el.noModuleSelectError, 30000);
        cy.visitCustomer();
        reseller.clickAddUserBtn();
      }

      if (fileType === "invalidFormatFile") {
        cy.verifyToastMessageText($el.saveError, 20000);
        cy.visitCustomer();
        reseller.clickAddUserBtn();
      } else if (fileType === "exceedSizeFile") {
        cy.visitCustomer();
        reseller.clickAddUserBtn();
      }
    });
  }

  //----------------------------{Edit/Update-Customer-Summary-Form}-----------------------------------
  // Edit existing customer
  /**
   * editCustomerSummary will be used for updating the already created new customer that we created before
   * @param {String} data will be test object from (customerData.updateCustomer)
   */
  editCustomerSummary(data, fileType = false) {
    // Dropdown Fields
    this.selectDropdown(
      locators.general.instanceTypeText,
      locators.general.dropDownSearch,
      data.instanceType
    );

    // Type Fields
    //edit the industries when updating the customers
    data.industries.forEach(($industry) => {
      this.addEditInstanceType($industry);
    });

    //type email
    this.typeInField(locators.general.emailField, data.email);

    // Edit Modules and Submodules
    this.addModulesAndSubmodules(data.modules, data.subModule);

    // Optional Fields
    this.handleOptionalFields(data, locators);

    // Active Status and Logo upload
    this.toggleStatus(data.active, locators, "Status", data.externalAuthValue);
    //update Authentication type statuses
    this.toggleStatus(
      data.internal,
      locators,
      "Authentication Type",
      data.externalAuthValue
    );
    reseller.uploadLogo(data, fileType);

    // Save Updated Customer Profile
    cy.get(locators.administration.users.userFormSavebtn).click({
      force: true
    });
  }

  /***********************************<<<<< Data Verification Functions Sections>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

  // This Section is using for the verification of Created/Updated Customers.

  /**
   * verifyCustomerFieldValues will verify all the related fields of the customer Form,
   * this function is using in one more function called, verifyAddedCustomer
   * @param {String} data is the testData object, it can be (customerData.addCustomer/customerData.updateCustomer)
   */
  verifyCustomerFieldValues(data, section) {
    cy.get(locators.general.nameField).should(
      "have.value",
      data.addCustomer.name
    );
    cy.get(locators.general.emailField).should(
      "have.value",
      data[section].email
    );
    let key = data.addCustomer.key.toUpperCase();
    cy.get(locators.administration.customers.customerKey).should(
      "have.value",
      key
    );
    data[section].industries.forEach(($industry) => {
      cy.get(locators.administration.customers.industriesDropDown).contains(
        $industry
      );
    });

    if (data[section].subModule.isSubModule === true) {
      data[section].subModule.subModuleNames.forEach((subModuleNames) => {
        reseller.verifyModulesSubModules(subModuleNames);
      });
    }
  }

  searchWithFilter(){
    cy.reload();
    cy.visitCustomer();
    cy.get(locators.general.threeElipses).click();
    cy.get(locators.general.filterIconDropDown).click();
    cy.readFile(customerDataString).then((file) => {
      cy.waitForTopMsgLoaderToDisappear(80000)
      cy.searchFilterName(file.addCustomer.name, "All");
      cy.get(locators.administration.customers.addedCustomer)
        .contains(file.addCustomer.name)
        .click();
      cy.waitForTopMsgLoaderToDisappear(20000);
  })
}
  /**
   * verifyAddedCustomer is the main function we are using for verification of created and updated customer ,
   * after creating and updating the customer this function will be called everytime for the change verifications
   * @param {String} data can be test object from (customerData.addCustomer/customerData.updateCustomer)
   */
  verifyAddedCustomer(data, section) {
    this.searchWithFilter();
    cy.readFile(customerDataString).then((file) => {
      this.verifyCustomerFieldValues(file, section);
    });
  }

  // Helper function for customer search
  searchCustomerName(customerName) {
    // Reload and visit the customer section
    cy.reload();
    cy.visitCustomer();

    // Perform the search
    cy.get(locators.general.searchIcon).click();
    cy.get(locators.general.searchTextBox)
      .clear()
      .type(customerName)
      .type("{enter}");

    // Wait for loader to disappear
    cy.waitForTopMsgLoaderToDisappear(150000);
  }

  /*******************************<<<< Customer- Tabs-Sections >>>>>>>***************** */
  //this section will cover the tabs When Editing the customer (Content Library, Risk Taxanomy, Control Taxanomy, Assessments)

  //For Adding Risk Taxonomy And Description

  //helperFunction
  /**
   * handleContentLibraryDropDown will scroll the content library till the last element for selecting the content newly created
   * content source
   * @param {String} locator is the locator of the content library cell in risk and control taxanomies screen
   * @param {String} searchLocator is the search locator
   * @param {String} libraryName is content library name associated with the taxanomies
   */
  handleContentLibraryDropdown(locator, searchLocator, libraryName) {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForToastMessageToDisappear(60000);
    cy.get(locator).dblclick();

    cy.get(searchLocator)
      .find("input")
      .clear()
      .type("{backspace}{backspace}")
      .type(libraryName, { delay: 300 })
      .should("have.value", libraryName)
      .tab();
  }

  /**
   * riskControlTaxonomy will add contentLibraries in risk And Control taxnomy
   * @param {String} taxonomyName is the taxanomy name
   * @param {String} taxonomyDescription is taxanomy description, description is optional field
   */
  riskControlTaxanomy(taxonomyName, taxonomyDescription, duplicate=false) {
    assessment.sourceAndLibrary(taxonomyName, taxonomyDescription, duplicate);
  }

  // addRiskTaxonomy will add risk Taxonomy with content library
  addRiskTaxonomy(existingName, duplicate=false) {
    cy.visitRiskTaxonomy();
    cy.createRandomString(8).then((randString) => {
      cy.readFile(customerDataString).then((customerData) => {
        const riskTaxonomyName = existingName
          ? existingName
          : "test Risk Taxonomy" + " " + randString;
        this.riskControlTaxanomy(
          riskTaxonomyName,
          customerData.customerProfileData.riskTaxanomy.riskTaxanomyDescription,
          duplicate
        );
        customerData.customerProfileData.riskTaxanomy.riskTaxanomyName = "";
        customerData.customerProfileData.riskTaxanomy.riskTaxanomyName =
          riskTaxonomyName;
        cy.writeFile(customerDataString, customerData);
      });
    });

    if(!duplicate)
    cy.readFile(customerDataString).then((file) => {
      //handle function will be used in Risk Taxanomy/ COntrol Taxonomy content library dropdown
      this.handleContentLibraryDropdown(
        locators.administration.customers.contentLibraryDropDown,
        locators.administration.customers.contentLibraryDropDownSearchText,
        file.customerProfileData.riskTaxanomy.contentLibraryName
      );
    });
    cy.reload();
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForToastMessageToDisappear(20000);
  }

  // addControlTaxonomy will add new control Taxonomy with content library
  addControlTaxonomy(existingName, duplicate=false) {
    cy.visitControlTaxonomy();
    cy.createRandomString(8).then((randString) => {
      cy.readFile(customerDataString).then((customerData) => {
        const controlTaxonomyName = existingName
          ? existingName
          : "test Control Taxonomy" + " " + randString;
        this.riskControlTaxanomy(
          controlTaxonomyName,
          customerData.customerProfileData.controlTaxanomy
            .controlTaxanomyDescription
        );
        customerData.customerProfileData.controlTaxanomy.controlTaxanomyName =
          "";
        customerData.customerProfileData.controlTaxanomy.controlTaxanomyName =
          controlTaxonomyName;
        cy.writeFile(customerDataString, customerData);
      });
    });

    if(!duplicate)
    cy.readFile(customerDataString).then((file) => {
      //handle function will be used in Control Taxonomy content library dropdown
      this.handleContentLibraryDropdown(
        locators.administration.customers.contentLibraryDropDown,
        locators.administration.customers.contentLibraryDropDownSearchText,
        file.customerProfileData.controlTaxanomy.contentLibraryName
      );
    });
    cy.reload();
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForToastMessageToDisappear(20000);
  }

  //common function will be used in all the assign tabs of customers
  /**
   * assignToCustomer will be used when user needs to verify the newly created risk taxnomies, control taxanomies and other
   * related tabs data which needs to assign to the customer
   * this function have conditions based on the tabs names
   * @param {String} tabName is customer tabs names (Content Library, Risk Taxanomies, Control Taxanomies, Assessments)
   * @param {String} tabLocator is the newly created taxanomies, library names locator that will be listing with check box in tabs
   * @param {String} valueName is the newly created taxanomies, library names
   */
  assignToCustomer(tabName, tabLocator = false, valueName = false) {
    cy.readFile(customerDataString).then((file) => {
      // this.verifyAddedCustomer(file.updateCustomer, "updateCustomer");
      this.searchWithFilter();
      cy.reload();

      if (tabName === "Content Libraries")
        assessment.assignContentLibraryReseller(9, true);

      if (tabName === "Risk Taxonomies") {
        cy.get(locators.general.tabs).contains("a", "Risk Taxonomies").click();
        this.verifyRiskControlTaxanomy(
          locators.administration.customers.riskTaxanomyHierarchy,
          file.customerProfileData.contentLibrary.contentSourceName,
          file.customerProfileData.riskTaxanomy.contentLibraryName,
          file.customerProfileData.riskTaxanomy.riskTaxanomyName
        );
      }

      if (tabName === "Control Taxonomies") {
        cy.get(locators.general.tabs)
          .contains("a", "Control Taxonomies")
          .click();
        this.verifyRiskControlTaxanomy(
          locators.administration.customers.controlTaxonomyHierarchy,
          file.customerProfileData.contentLibrary.contentSourceName,
          file.customerProfileData.controlTaxanomy.contentLibraryName,
          file.customerProfileData.controlTaxanomy.controlTaxanomyName
        );
      }

      if(tabName === "KxI Category"){
        assessment.assignKxiCategory()
      }

      if(tabName === "KxI Definition"){
        assessment.assignKxiDefinition()
      }
      
      if (tabName === "Assessment Library") {
        cy.get(locators.general.tabs)
          .contains("a", "Assessment Library")
          .click();
        this.verifyRiskControlTaxanomy(
          locators.administration.customers.assessmentLibraryTree,
          file.customerProfileData.contentLibrary.contentSourceName,
          file.customerProfileData.contentLibrary.contentLibraryName,
          file.customerProfileData.assessment.assessmentName
        );
        this.clickRiskControlDef(
          locators.administration.customers.assessmentLibraryTree,
          file.customerProfileData.contentLibrary.contentLibraryName
        );
        for (let i = 0; i < 3; i++) {
          cy.readFile("cypress/fixtures/Administration/Assessments_PAP.json").then(
            (file) => {
              this.clickRiskControlDef(
                locators.administration.customers.assessmentLibraryTree,
                file.template.templateSurveyForm.templateName
              );
              this.clickRiskControlDef(
                locators.administration.customers.assessmentLibraryTree,
                file.template.sections[0].sectionName
              );
              cy.get(locators.administration.customers.assessmentLibraryTree).contains(
                file.template.sections[0].associateQB
              );
            }
          );
        }
      }
    });
  }

  assignReports(){
    cy.get(locators.general.tabs).contains("a", "Reports").click();
    for (let i = 0; i < 3; i++) {
      customerData.addCustomer.modules.forEach(($module) => {
        cy.get(locators.administration.customers.reportsModules)
          .contains($module)
          .click({ force: true })
      });
    }
    customerData.addCustomer.modules.forEach(($module)=>{
      cy.get(locators.administration.customers.reportsModules)
      .contains($module)
      .parent()
      .find("input")
      .should('be.checked')
    })
    cy.get(locators.general.formSaveBtn).click()
  }

  //assign ContentLibrary will open content library tab from the customer and assign the created content source,library to the customer
  assignContentLibrary() {
    cy.readFile(customerDataString).then((file) => {
      this.assignToCustomer(
        "Content Libraries",
        locators.administration.customers.assignContentLibarary,
        file.customerProfileData.contentLibrary.contentLibraryName
      );
    });
  }

  /**
   * VerifyRiskControlTaxnomy will confirm that newly added risk and control taxanomies are assigned to the customers
   * @param {String} locator is the locator of the content source hierarchy in risk and control tabs screen in customer
   * @param {String} sourceName is the source name
   * @param {String} contentLibraryName is the content libary name
   * @param {String} defName is the risk and control taxanomies name
   */
  verifyRiskControlTaxanomy(locator, sourceName, contentLibraryName, defName) {
    for (let i = 0; i < 3; i++) {
      this.clickRiskControlDef(locator, sourceName);
      this.clickRiskControlDef(locator, contentLibraryName);
    }
    cy.get(locator).contains(defName);
  }

  //common function will be used to open the hierarchy in Risk and control taxonomy customer tab
  /**
   * clickRiskControlDef will used for the verification of risk and control taxanomies that are assigned to the customer
   * it will click on the sourceName in risk and control taxanomies customer tabs
   * @param {String} locator will be provided locator of the added hierarchy
   * @param {String} sourceName will be the source name
   */
  clickRiskControlDef(locator, sourceName) {
    cy.get(locator)
      .contains(sourceName)
      .parent()
      .prev()
      .should("have.class", "aciTreeButton")
      .click({ force: true });
  }

  //assignRiskTaxanomy will verify the risk Defination name
  assignRiskTaxonomy() {
    this.assignToCustomer("Risk Taxonomies");
  }

  //assignControlTaxnomy will verify the control taxnomy name
  assignControlTaxonomy() {
    this.assignToCustomer("Control Taxonomies");
  }

  //assignAssessment will asssign the assessment to the customer if it is already added from the reselller
  assignAssessment(assessmentWithContentLibrary = false) {
    cy.reload();
    cy.visitCustomer();
    cy.readFile(customerDataString).then((file) => {
      assessment.clickCustomerName(file.addCustomer.name);
    });
    cy.waitForTopMsgLoaderToDisappear(50000);
    if (!assessmentWithContentLibrary)
      assessment.addAssessmentReseller(customerDataString, true, true);

    /**  Verify if the assessment from none-space is created with a content library and assigned to the customer.
     *   It should be added to the customer's Assessment Library tab.
     */
    if (assessmentWithContentLibrary) {
      this.assignToCustomer("Assessment Library");
    }
  }
  /*
    This function selects a reseller from a dropdown list.
    
    1. It first opens the reseller dropdown using a forced click.
    2. Then it types the provided `resellerName` into the search field.
    3. It completes the selection by simulating the Enter keypress.
  */
  selectReseller(resellerName){
    cy.get(locators.general.resellerDropDownClick).click({force:true});
    cy.get(locators.administration.customers.resellerDropdownSearch).type(resellerName).type("{enter}");
  }

  /**
 * Verifies that the "Kaia for Compliance" module is visible in the UI.
 */
verifyKaiaForComplianceModuleVisible() {
  cy.get(locators.administration.customers.kaiaParentModule)
    .click({ force: true })
 cy.get(locators.administration.customers.kaiaForCompliance)
  .eq(0)
  .parent()
  .scrollIntoView()
  .should("be.visible");
}

/**
 * Ensures the "Kaia for Compliance" checkbox matches the desired state.
 * Toggles the checkbox and clicks save if its current state differs.
 *
 * @param {boolean} shouldBeChecked - `true` to check, `false` to uncheck.
 */

verifyKaiaForComplianceChecked(shouldBeChecked) {
  cy.get(locators.administration.customers.kaiaForCompliance)
  .eq(0)
    .scrollIntoView()
    .then(($checkbox) => {
      const isChecked = $checkbox.prop('checked');

      if (isChecked !== shouldBeChecked) {
        // Toggle the checkbox if it's not in the desired state
        cy.wrap($checkbox).click({ force: true });
        //cy.wrap($checkbox).should('not.be.checked');
        // Click the Save button after change
        cy.get(locators.general.formSaveBtn)
          .scrollIntoView()
          .click({ force: true });
      }
    });
}

    /**
 * Clicks the first customer name in the list and waits for the loader to disappear.
 */
  clicksOnFirstCustomerName(){
    cy.get(locators.administration.customers.listCustomerName).first().click({force:true});
    cy.waitForTopMsgLoaderToDisappear(20000); 
  }
}

export default Customer;
