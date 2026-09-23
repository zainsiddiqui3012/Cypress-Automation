import locators from "../../../fixtures/locators.json";
import Customer from "./Customer";
import dayjs from "dayjs";
const testDataString = "cypress/fixtures/Administration/UserGroup.json";
const customer = new Customer();

class UserGroup {
  waits = Cypress.env("waits");

  /**
   * This function checks that the userGroup list should be visible and not be empty.
   */
  userGroupListDisplay() {
    cy.get(locators.administration.userGroup.userGroupList).should(
      "have.length.greaterThan",
      0
    );
  }

  /**
   * This function clicks the "Add User Group" button.
   */
  clickAddUserGroupBtn() {
    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.get(locators.general.addBtn).parent().contains("Add User Group").click();
  }

  /**
   * This function closes the form.
   */
  closeForm() {
    cy.get(locators.general.closeForm).click({ multiple: true, force: true });
  }

  /**
   * This function checks for mandatory fields error.
   */
  checkMandatoryFieldsError() {
    cy.readFile(testDataString).then((testData) => {
      cy.get(locators.general.formSaveBtn).click({ force: true });
      cy.verifyToastMessageText(
        testData.mandatoryFieldsError,
        this.waits.shortWait
      );
      this.closeForm();
    });
  }

  /**
   * This function handles dropdown selections for roles, reseller, and customer.
   * @param {Array} roles - Array of roles to select.
   * @param {string|boolean} resellerName - Reseller name to select.
   * @param {string|boolean} customerName - Customer name to select.
   */
  handleDropDown(roles, resellerName = false, customerName = false) {
    //select Reseller and Customers , roles from Dropdown
    const dropdowns = [
      {
        clickLocator: locators.general.resellerDropDownClick,
        value: resellerName,
      },
      {
        clickLocator: locators.general.customerDropDownClick,
        value: customerName,
      },
    ];

    dropdowns.forEach(({ clickLocator, value }) => {
      if (resellerName && customerName)
        customer.selectDropdown(
          clickLocator,
          locators.general.dropDownSearch,
          value
        );
    });

    cy.get(locators.administration.userGroup.selectRoles).select(roles, {
      force: true,
    });
  }

  /**
   * This function submits the user group form.
   * @param {string} sectionName - Section name to determine add or update user group.
   */
  /**
   * Submits a user group form by filling in the required fields and saving the data.
   *
   * @param {string} sectionName - The section name to determine whether to add or update a user group.
   *                               Accepts "addUserGroup" or any other string for updating.
   * @param {boolean} [customerSpace=false] - A flag to determine if customer-specific dropdowns should be handled.
   *                                          Defaults to false.
   */
  submitUserGroup(sectionName, customerSpace = false) {
    const sectionData =
      sectionName === "addUserGroup" ? "addUserGroup" : "updateUserGroup";
    cy.readFile(testDataString).then((fileData) => {
      cy.createRandomString(7).then(($el) => {
        const data = fileData[sectionData];
        const addedName =
          data.baseName + "_" + dayjs().format("YYYY-MM-DD_HH:mm:ss");
        data.name = addedName;

        //type UserGroup Name
        cy.get(locators.administration.userGroup.userGroupName)
          .clear({ force: true })
          .type(addedName, { force: true });

        //type Description if not empty <Optional-field>
        cy.typeOptionalEmptyFieldCondition(
          data.description,
          locators.administration.userGroup.description
        );

        //clicking on badge color
        cy.get(`.${data.badgeColor.selectedBadgeColor}`).click();

        //adding Dropdowns (roles, reseller, customer)
        const reseller = sectionName === "addUserGroup" ? data.reseller : false;
        const customer = sectionName === "addUserGroup" ? data.customer : false;
        customerSpace
          ? this.handleDropDown(data.kxiUserRoles)
          : this.handleDropDown(data.roles, reseller, customer);
        cy.get(locators.general.formSaveBtn).click();
        cy.verifyToastMessageText(fileData.successMsg, 20000);
        cy.writeFile(testDataString, fileData);
      });
    });
  }

  /**
   * This function adds a new user group.
   * @param {boolean} [customerSpace=false] - A flag to determine if customer-specific dropdowns should be handled.
   *                                          Defaults to false.
   */
  addUserGroup(customerSpace = false) {
    this.clickAddUserGroupBtn();
    this.submitUserGroup("addUserGroup", customerSpace);
    if (customerSpace) {
      cy.readFile(testDataString).then((data) => {
        cy.readAndWriteData("UserGroups Customer User", data.addUserGroup.name);
      });
    } else {
      cy.readFile(testDataString).then((data) => {
        cy.readAndWriteData("UserGroups User", data.addUserGroup.name);
      });
    }
  }

  /**
   * This function updates an existing user group.
   * @param {boolean} [customerSpace=false] - A flag to determine if customer-specific dropdowns should be handled.
   *                                          Defaults to false.
   */
  updateUserGroup(customerSpace = false) {
    cy.readFile(testDataString).then((dataFile) => {
      this.searchWithFilterName(dataFile.addUserGroup.name);
      //open UserGroup Detail page
      cy.get(locators.administration.userGroup.userGroupList)
        .contains(dataFile.addUserGroup.name)
        .click();

      this.submitUserGroup("updateUserGroup", customerSpace);
      if (customerSpace) {
        cy.readFile(testDataString).then((data) => {
          cy.readAndWriteData(
            "UserGroups Customer User",
            data.updateUserGroup.name
          );
        });
      } else {
        cy.readFile(testDataString).then((data) => {
          cy.readAndWriteData("UserGroups User", data.updateUserGroup.name);
        });
      }
    });
  }

  /**
   * This function verifies the user group details.
   * @param {string} sectionName - Section name to determine add or update user group.
   * @param {boolean} [customerSpace=false] - A flag to determine if customer-specific dropdowns should be handled.
   *                                          Defaults to false.
   */
  verifyUserGroup(sectionName, customerSpace = false) {
    cy.readFile(testDataString).then((dataFile) => {
      const sectionData =
        sectionName === "addUserGroup" ? "addUserGroup" : "updateUserGroup";
      const data = dataFile[sectionData];
      //search with UserGroup Filter
      this.searchWithFilterName(data.name);

      //open UserGroup Detail page
      cy.waitForTopMsgLoaderToDisappear(30000);
      cy.get(locators.administration.userGroup.userGroupList, {
        timeout: this.waits.mediumWait,
      })
        .contains(data.name, { timeout: this.waits.mediumWait })
        .click();

      //verify the userGroup Name
      cy.get(locators.administration.userGroup.userGroupName).should(
        "have.value",
        data.name
      );

      //verify the description if not empty
      if (data.description != "")
        cy.get(locators.administration.userGroup.description).contains(
          data.description
        );

      //verify reseller, customer and roles
      if (!customerSpace) {
        cy.get(locators.general.resellerDropDownClick).contains(
          dataFile.addUserGroup.reseller
        );

        cy.get(locators.general.customerDropDownClick).contains(
          dataFile.addUserGroup.customer
        );

        data.roles.forEach(($role) => {
          cy.get(locators.administration.userGroup.selectRoles).contains($role);
        });
      }
      else{
        data.kxiUserRoles.forEach(($role) => {
          cy.get(locators.administration.userGroup.selectRoles).contains($role);
        });        
      }
    });
  }

  /**
   * This function searches for a user group by name using filters.
   * @param {string} userGroupName - Name of the user group to search for.
   */
  searchWithFilterName(userGroupName) {
    cy.get(locators.general.filterIcon).click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.get(locators.administration.userGroup.filters.nameField)
      .clear()
      .type(userGroupName, { delay: 450 });
    cy.get(
      locators.administration.userGroup.filters.searchNameSuggestion
    ).click();
    cy.get(locators.administration.userGroup.filters.applyBtn).click();
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.get(locators.administration.userGroup.userGroupList).contains(
      userGroupName
    );
  }

  /**
   * This function handles pagination for the user group list.
   */
  paginatedUserGroup() {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get(locators.general.gridTopDoubleRightPageBtn).click({ force: true });
      this.userGroupListDisplay();
      //check that when the last pagination right most is clicked created usergroup should be visible
      cy.waitForTopMsgLoaderToDisappear(30000);
      cy.get(locators.administration.userGroup.userGroupList, {
        timeout: this.waits.mediumWait,
      })
        .contains(dataFile.addUserGroup.name, {
          timeout: this.waits.mediumWait,
        })
        .should("be.visible")
        .and("not.be.disabled");
    });
  }

  /**
   * This function sorts the user group list by name.
   */
  sortWithName() {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get(locators.administration.userGroup.sortName)
        .contains("Name")
        .click();

      this.userGroupListDisplay();
      cy.waitForTopMsgLoaderToDisappear(30000);
      cy.get(locators.administration.userGroup.userGroupList, {
        timeout: this.waits.mediumWait,
      })
        .contains(dataFile.addUserGroup.name, {
          timeout: this.waits.mediumWait,
        })
        .click();
    });
  }

  /**
   * This function verifies the audit logs for a user group.
   * @param {string} sectionName - Section name to determine add or update user group.
   * @param {Boolean} isCustomerSpace - A flag to determine whether it is in customer space.
   */
  verifyAuditLogs(sectionName, isCustomerSpace=false) {
    cy.readFile(testDataString).then((dataFile) => {
      const data = dataFile[sectionName];
      this.searchWithFilterName(data.name);
      cy.get(locators.general.threeElipses).click();
      //clicking on Audit Log btn
      cy.get(locators.administration.userGroup.auditLogs.auditLogBtn)
        .contains("Audit Log")
        .click();

      //verify the section details in Audit Log modal
      cy.get(locators.administration.userGroup.auditLogs.openModal).contains(
        data.name
      );
      if (data.description != "")
        cy.get(locators.administration.userGroup.auditLogs.openModal).contains(
          data.description
        );
      if(!isCustomerSpace){
      data.roles.forEach(($eachRole) => {
        cy.get(locators.administration.userGroup.auditLogs.openModal).contains(
          $eachRole
        );
      })}
      else{
        data.kxiUserRoles.forEach(($eachRole) => {
          cy.get(locators.administration.userGroup.auditLogs.openModal).contains(
            $eachRole
          );
        })
      }
    });
  }
}
export default UserGroup;
