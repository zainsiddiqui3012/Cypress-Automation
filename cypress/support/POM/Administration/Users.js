import locators from "../../../fixtures/locators.json";
import users from "../../../fixtures/Administration/Users.json";
import Customer from "../../../support/POM/Administration/Customer";
import Reseller from "../../../support/POM/Administration/Reseller";
import Assessment from "../../../support/POM/Administration/Assessment";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import { read, readFile } from "fs";
const writeDataFile = "cypress/fixtures/Administration/UserCredentials.json";

class Users {
  usersLocator = locators.administration.users;
  customer = new Customer();
  reseller = new Reseller();
  assessment = new Assessment();
  kxiPom = new KXI_POM();

  /********************************** handler functions**************************************/

  /**
   * Clicks on the element found by the given locator.
   *
   * @param {string} locator - The CSS selector or locator of the element to be clicked.
   */
  clickMethods(locator) {
    cy.get(locator, { timeout: Cypress.env("waits").mediumWait }).click({force: true});
  }

  /**
   * Selects an option from a dropdown element.
   *
   * @param {string} locator - The CSS selector of the dropdown element.
   * @param {string|Array} dataValues - The Array value(s) to be selected from the dropdown.
   */
  selectMethod(locator, dataValues) {
    cy.get(locator).select(dataValues, { force: true });
  }

  //used Strategic Pattern to avoiding the flag approach..
  //all flag works are in function and wrapped in single obj, toggleBtns, but we can not call toggleBtns directly without param
  togglesBtns = {
    isActive: (data, section) => {
      if (data)
        this.assessment.clickOptionalBooleanFieldCondition(
          section.status.isActive,
          this.usersLocator.activeRadioButton
        );
    },
    isInActive: (data, section) => {
      if (data)
        this.assessment.clickOptionalBooleanFieldCondition(
          section.status.isInActive,
          this.usersLocator.inactiveRadioButton
        );
    },
    isDisabled: (data, section) => {
      if (data)
        this.assessment.clickOptionalBooleanFieldCondition(
          section.status.isDisabled,
          this.usersLocator.disabledButton
        );
    },
  };

  clickToggleStatusBtn(data, section, toggleBtns) {
    if (typeof toggleBtns != "function")
      throw new Error("toggleBtns is not function anymore..");

    toggleBtns(data, section);
  }

  //handleOptionalPhoneField
  typeOptionalPhone(locator, data) {
    this.assessment.typeOptionalEmptyFieldCondition(data, locator);
  }

  //checkForMandatoryError will click on save btn with empty fields to check that mandatory fields toast msg appears or not
  checkForMandatoryError() {
    this.reseller.clickAddUserBtn();
    this.cancelFormBtn();
    this.reseller.clickAddUserBtn();
    this.clickMethods(locators.general.formSaveBtn);
    cy.verifyToastMessageText(users.mandatoryErrorMsg, 20000);
  }

  /*************************************** Create Users ********************************** */

  /**
   * Validates the length format of user input fields by generating a random string of 51 characters
   * and attempting to input it into the first name, last name, and phone fields.
   */
  checkLengthFormatValidation() {
    cy.createRandomString(51).then(($el) => {
      this.reseller.clickAddUserBtn();
      cy.get(this.usersLocator.firstName).clear().type($el);
      cy.get(this.usersLocator.lastName).clear().type($el);
      cy.get(this.usersLocator.phone).clear().type(users.addUser.invalidPhone);
      this.clickMethods(locators.general.formSaveBtn);
      cy.verifyToastMessageText(users.mandatoryErrorMsg, 20000);
    });
  }
  /**
   * Selects an organizational hierarchy based on the provided data value.
   *
   * @param {string} dataValue - The value of the organizational hierarchy to select.
   * @param {Boolean} isUpdated - if not updated it should expend the hierarchy
   * @param {Boolean} isDiscard - if user need to click on save btn for saving the userform hierarchy will not be expended
   */
  selectOrganizationalHierarchy(dataValue, isUpdated, isDiscard) {
    if (!isUpdated) {
      if (isDiscard)
        cy.get(this.usersLocator.expandOrgHierarchy)
          .should("be.visible")
          .click();
    }

    cy.waitForTopMsgLoaderToDisappear(15000);

    cy.get(this.usersLocator.selectOrgHierarchy)
      .contains(dataValue)
      .as("selectedOrgHierarchy");

    cy.get("@selectedOrgHierarchy").click();
  }
  /**
   * Closes the user form by clicking the "Cancel" button.
   */
  cancelFormBtn() {
    cy.get(this.usersLocator.cancelFormBtn).click();
    cy.get(this.usersLocator.cancelFormBtn).should("not.be.visible");
  }
  /**
   * submitUserForm will be used when creating and updating the users
   * @param {Object} userData is the test data from addUser, updateUser
   * @param {Boolean} isUpdated will be false when need to create the user
   * @param {Boolean} isDiscard will be true when need to discard the form
   * @param {Boolean} customerSpace will be true when user is creating the user from customer space
   */
  submitUserForm(
    userData,
    options = { isUpdated: false, isDiscard: false, customerSpace: false }
  ) {
    cy.waitForTopMsgLoaderToDisappear(20000);
    const { isUpdated, isDiscard, customerSpace } = options;

    const dataTypeValues = ["firstName", "lastName"];

    // Type all fields values of First Name, Last Name, and Username
    cy.createRandomString(15).then(($el) => {
      dataTypeValues.forEach((typeDataField) => {
        this.customer.typeInField(
          this.usersLocator[typeDataField],
          userData[typeDataField] + $el
        );

        // Type username
        cy.get(this.usersLocator.userName)
          .type("{selectall}{backspace}", { force: true })
          .type(userData.userName + $el, { force: true });

        // Add userName in userCreatedCredentials.json
        cy.readFile(writeDataFile).then((file) => {
          file.userName, file.firstName, file.lastName, (file.email = "");
          if (!isDiscard) {
            file.userName = (userData.userName + $el).toLowerCase();
            file.firstName = userData.firstName + $el;
            file.lastName = userData.lastName + $el;
            file.email = userData.email;
            cy.writeFile(writeDataFile, file);
          }
        });
      });

      // Type Email
      this.customer.typeInField(this.usersLocator.email, userData.email);

      // Type Optional Phone
      this.typeOptionalPhone(this.usersLocator.phone, userData.phone);

      // Handle Reseller and Customer fields for None Space only
      if (!customerSpace && !isUpdated) {
        const dropdowns = [
          {
            clickLocator: locators.general.resellerDropDownClick,
            value: userData.reseller,
          },
          {
            clickLocator: locators.general.customerDropDownClick,
            value: userData.customer,
          },
        ];

        dropdowns.forEach(({ clickLocator, value }) => {
          this.customer.selectDropdown(
            clickLocator,
            locators.general.dropDownSearch,
            value
          );
        });
      } else if (!customerSpace && isUpdated) {
        [
          this.usersLocator.disabledReseller,
          this.usersLocator.disabledCustomer,
        ].forEach((locator) => {
          cy.get(locator)
            .closest("div")
            .should("have.class", "select2-container-disabled");
        });
      }

      // Select Roles
      customerSpace
      ? this.selectMethod(this.usersLocator.roleSelect, userData.kxiUserRoles)
      : this.selectMethod(this.usersLocator.roleSelect, userData.role);

      // Select UserGroups
      customerSpace
      ? this.selectMethod(this.usersLocator.selectUserGroup, userData.kxiCustomerUserGroup)
      : this.selectMethod(this.usersLocator.selectUserGroup, userData.userGroup);
      
      // Select landing Url
      this.selectMethod(this.usersLocator.landingUrl, userData.landingUrl);

      /**
       * i am commenting this code we are creating new resellers, customer everytime and organizational hierarchy will be changed everytime
       * for every new reseller or customer however, the code is written user need to add the organizational hierarchy name in users.json
       * for Manual run
       */

      //select Organizational Hierarchy
      // this.selectOrganizationalHierarchy(
      //   userData.organizationalHierarchy,
      //   isUpdated,
      //   discardForm
      // );

      // Click Toggle Status button
      Object.keys(userData.status).forEach((statusKey) => {
        const toggleFunction = this.togglesBtns[statusKey];
        this.clickToggleStatusBtn(
          userData.status[statusKey],
          userData,
          toggleFunction
        );
      });

      // Cancel the user creation form if discardForm === true, else save the form
      if (isDiscard) {
        this.cancelFormBtn();
      } else {
        // cy.get(locators.general.saveBtn, { timeout: Cypress.env("waits").mediumWait }).click({force: true}).click({delay:1000, force:true})
        cy.get(locators.general.saveBtn, { timeout: Cypress.env("waits").mediumWait }).click({delay:1000, force:true})
        .then(()=>{
          cy.get(locators.administration.toastMsg, { timeout: 1000000, multiple: true }).should("be.visible").click({force:true});
        })
        // cy.verifyToastMessageText(users.saveUserSuccessMsg, 520000);
        
      }
    });
  }

  /**** Adding User ****/

  /**
   * addUser will create the user from Administration
   * @param {Object} userData is the test data of addUser from Users.json
   */
  addUser(userData, isCustomerSpace = false) {
    this.reseller.clickAddUserBtn();
    this.submitUserForm(userData, {
      isUpdated: false,
      isDiscard: true,
      customerSpace: isCustomerSpace,
    });
    this.reseller.clickAddUserBtn();
    this.submitUserForm(userData, {
      isUpdated: false,
      isDiscard: false,
      customerSpace: isCustomerSpace,
    });
  }

  /**
   * Retrieves the list of added users and asserts that the list is not empty.
   */
  viewUserList() {
    cy.get(locators.administration.users.addedUserList)
      .its("length")
      .should("be.greaterThan", 0);
  }

  searchWithFilter(data) {
    cy.get(locators.general.threeElipses).eq(0).click();
    // cy.get(locators.general.filterIconDropDown).click();
    this.clickMethods(locators.general.filterIconDropDown);
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.readFile(writeDataFile).then((file) => {
      cy.waitForTopMsgLoaderToDisappear(30000);
      this.filterUsers(file, data);
    });
  }
  /**
   * verifyAddedUser will verify that user is craeted and updated correctly
   * @param {Object} data is the object from addUser, updateUser in Users.json
   */
  verifyAddedUser(data, isCustomerSpace = false) {
    this.searchWithFilter(data);
    cy.readFile(writeDataFile).then((file) => {
      this.verifyUserFieldValues(data, file, isCustomerSpace);
    });
  }

  /**
   * verifyUserFieldValues will verify all field values of created user and updated user
   * @param {Object} data can be object of addUser, updateUser from Users.json
   * @param {Object} file is the object from userCreatedCredentials.json
   */
  verifyUserFieldValues(data, file, isCustomerSpace = false) {
    //verify the changed fields
    const fieldAssertions = ["firstName", "lastName", "email", "userName"];

    fieldAssertions.forEach((field) => {
      cy.get(this.usersLocator[field]).should("have.value", file[field]);
    });

    if (!isCustomerSpace) {
      //these can not be updated
      cy.get(locators.general.verifyReseller).should(
        "have.text",
        users.addUser.reseller
      );
      cy.get(locators.general.instanceTypeText).should(
        "have.text",
        users.addUser.customer
      );
    }

    //verifying roles
    if (!isCustomerSpace) {
      data.role.forEach(($role) => {
        cy.get(this.usersLocator.roleDropdown).contains($role);
      });
    } else {
      data.kxiUserRoles.forEach(($role) => {
        cy.get(this.usersLocator.roleDropdown).contains($role);
      });
    }

    //verifying UserGroups
    if (!isCustomerSpace) {
      data.userGroup.forEach(($userGroup) => {
        cy.get(this.usersLocator.selectUserGroup).contains($userGroup);
      });
    } else {
      data.kxiCustomerUserGroup.forEach(($userGroup) => {
        cy.get(this.usersLocator.selectUserGroup).contains($userGroup);
      });
    }

    /**
     * i am commenting this code we are creating new resellers, customer everytime and organizational hierarchy will be changed everytime
     * for every new reseller or customer however, the code is written user need to add the organizational hierarchy name in users.json
     * for Manual run
     */

    //verifying organizational hierarchy
    // cy.get(this.usersLocator.selectOrgHierarchy)
    //   .contains(data.organizationalHierarchy)
    //   .closest("li")
    //   .should("have.class", "aciTreeChecked");

    //verifying landingUrl
    cy.get(this.usersLocator.landingUrl).contains(data.landingUrl);
  }

  /**
   * filterUsers will filter the users in user screen based on userName and selecting the status 'All' from the filter
   * @param {Object} file will be the testData file
   */
  filterUsers(file, userData, openUserProfile = false) {
    cy.get(locators.administration.users.filter.userNameField)
      .clear()
      .type(file.userName, { delay: 450 });
    cy.wait(2000)
    cy.get(locators.administration.users.filter.userNameResult, {timeout: Cypress.env("waits").mediumWait})
    .should('have.length', 1);
    this.clickMethods(locators.administration.users.filter.userNameResult);
    cy.get(locators.administration.users.filter.statusField)
      .scrollIntoView()
      .click();
    cy.dropDownSearchAndSelect(locators.general.dropDownSearch, "All");
    cy.get(locators.general.filterApplyBtn).contains("Apply").click();
    // Wait for loader to disappear
    cy.waitForTopMsgLoaderToDisappear(150000);
    //verify the status of the filtered user, (Active, Inactive, Disabled)
    const statusKeys = {
      isActive: "Active",
      isInActive: "Inactive",
      isDisabled: "Disabled",
    };

    Object.keys(statusKeys).forEach((key) => {
      if (typeof userData.status[key] === "boolean" && userData.status[key]) {
        cy.get(this.usersLocator.userListStatus).contains(statusKeys[key]);
      }
    });
    if (!openUserProfile)
      cy.get(this.usersLocator.addedUserList).contains(file.userName).click();
    cy.waitForTopMsgLoaderToDisappear(20000);
  }

  /**
   * updateUser will update the existing user details
   * @param {Object} userData it will updateUser from Users.json
   */
  updateUser(userData, discardForm=false, isCustomerSpace = false) {
    this.submitUserForm(userData, {
      isUpdated: true,
      isDiscard: discardForm,
      customerSpace: isCustomerSpace,
    });
  }

  /**
   * newPassword will create the password for the new User
   * @param {Object} data is the object from userCreatedCredentials.json file
   */
  newPassword(data) {
    this.clickMethods(this.usersLocator.changePassword);
    this.customer.typeInField(this.usersLocator.newPassword, data.password);
    this.customer.typeInField(this.usersLocator.confirmPassword, data.password);
    this.clickMethods(this.usersLocator.submitPassword);
    cy.waitForTopMsgLoaderToDisappear(500000);
    cy.waitForElementToVisible(locators.administration.toastMsg, 600000);

  }

  /**
   * it will reset the user password also after reseting the password the account will be disabled
   * @param {Object} data is the object from userCreatedCredentials.json file
   */
  resetPassword(data) {
    this.clickMethods(this.usersLocator.resetPassword, {
      timeout: Cypress.env("waits").shortWait,
    });
    //clicking on reset Password btn
    this.clickMethods(this.usersLocator.resetPasswordBtn);
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.verifyToastMessageText(users.passwordResetMsg, 20000);
  }

  /**
   * changePassowrd is common function used to create and reset the password
   * @param {Boolean} resetPassword have boolean condition if user want to reset the password it should be {true}
   */
  changePassword(resetPassword = false) {
    cy.readFile(writeDataFile).then((file) => {
      !resetPassword ? this.newPassword(file) : this.resetPassword(file);
    });
  }

  //after creating the user Account it will login and verify that the account is login with the correct credentials
  verifyUserAccount(isCustomerSpace=false) {
    cy.readFile(writeDataFile).then((file) => {
      cy.visit(Cypress.config("baseUrl"));
      isCustomerSpace
      ? cy.login(file.userName, file.password, file.existCustomerKey)
      : cy.login(file.userName, file.password, file.key);
    });
  }

  /***************************************** [ import Section ] ******************************************** */
  /**
   * Opens the import modal and selects a file for import.
   *
   * @param {boolean} validFormatFile - Flag to indicate if the file format is valid.
   */
  openImportModal(validFormatFile = false) {
    cy.get(locators.general.threeElipses).eq(0).click();
    cy.get(locators.general.importBtn)
      .parent()
      .contains("span", "Import")
      .click();

    const filePath = validFormatFile
      ? "cypress/downloads/importFile.csv"
      : "cypress/downloads/importFile.xlsx";
    cy.get(locators.general.importChooseFile).selectFile(filePath);

    if (validFormatFile) {
      cy.get(this.usersLocator.importSubmitBtn).click({ force: true });
      cy.verifyToastMessageText(users.importSuccessMsg, 60000);
    } else {
      cy.get(this.usersLocator.importSubmitBtn).should("not.be.visible");
    }
  }

  /**
   * Adds user data from an import JSON file and converts it to the required format.
   */
  addUsersDataImportJson(validFormatFile, csv) {
    cy.readFile("cypress/fixtures/Examples/usersImport.json")
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          $json["Predict_user_bulk_import_templa"][0]["User Name"] = $el;
          cy.writeFile("cypress/fixtures/Examples/usersImport.json", $json);
        });
      })
      .then(() => {
        cy.readFile("cypress/fixtures/Examples/usersImport.json").then(
          ($json) => {
            this.kxiPom.convertXlsxtoJson($json, csv);
            this.openImportModal(validFormatFile);
          }
        );
      });
  }

  /********************[  Audit Logs and Access Logs Section ] ********************/
  /**
   * Verifies the access logs screen by applying filters and checking the visibility of access or audit logs.
   *
   * @param {Object} data - The data used to filter users.
   * @param {boolean} [accessLog=false] - Flag to indicate whether to check for access logs.
   * @param {boolean} [auditLog=false] - Flag to indicate whether to check for audit logs.
   * @param {boolean} [isCustomerSpace=false] - Flag to indicate if the user is in a customer space.
   */
  verifyAccessLogsScreen(data, accessLog = false, auditLog = false, isCustomerSpace = false) {
    cy.get(locators.general.threeElipses).eq(0).click();
    this.clickMethods(locators.general.filterIconDropDown);
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.readFile(writeDataFile).then((file) => {
      this.filterUsers(file, data, true);
      cy.get(locators.general.threeElipses).eq(1).click();
      if (accessLog) {
        cy.get(this.usersLocator.accessLogBtn).contains("Access Log").click();
        cy.get(this.usersLocator.accessLogModal).should("be.visible");
      }
      if (auditLog) {
        cy.get(this.usersLocator.accessLogBtn).contains("Audit Log").click();

        this.verifyAuditLogs(data, isCustomerSpace);
      }
    });
  }

  /**
   * Verifies the audit logs by checking if the specified data fields are present in the audit log modal.
   *
   * @param {Object} data - The data object containing user information to verify in the audit logs.
   * @param {boolean} [isCustomerSpace=false] - Flag to indicate if the user is in a customer space.
   */
  verifyAuditLogs(data, isCustomerSpace = false) {
    cy.readFile(writeDataFile).then((file) => {
      let fieldsToCheck = [];
      fieldsToCheck = !isCustomerSpace
      ? [
        file.userName,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        ...data.role,
        ...data.userGroup
      ]
      : [
        file.userName,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        ...data.kxiUserRoles,
        ...data.kxiCustomerUserGroup
      ];

      fieldsToCheck.forEach((field) => {
        cy.get(locators.general.auditLogModal).contains(field);
      });
    });
  }

  /**********************************[  Search - Sort - Pagination Section] *************************************/
  /**
   * Sorts the user list by clicking on the "Username" column.
   * Waits for the top message loader to disappear before proceeding.
   */
  sortByColumns() {
    //click on all Columns for sorting
    cy.get(this.usersLocator.addedUserList).contains("Username").click();
    cy.waitForTopMsgLoaderToDisappear(20000);
    this.viewUserList();
  }

  /**
   * Clicks the pagination button to navigate to the next page of the user list.
   * Waits for the top message loader to disappear before viewing the updated user list.
   */
  clickPagination() {
    cy.get(locators.general.gridTopDoubleRightPageBtn).click();
    cy.waitForTopMsgLoaderToDisappear(20000);
    this.viewUserList();
  }
}

export default Users;
