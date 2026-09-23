/// <reference types="cypress" />
import locators from "../../../fixtures/locators.json";
import dataFile from "../../../fixtures/Administration/Roles.json";
const writeRoles = "cypress/fixtures/Administration/writeRoles.json";
const rolesLoc = locators.administration.roles;
const addRoleForm = rolesLoc.addRoleForm;
const roleRegChange = addRoleForm.regChangeV2;
const roleRegChangeJIRA = addRoleForm.regChangeJira;

export default class Roles {
  /**
   * selectAll method will click on all customer available modules provided from test data file roles.json
   * @param {String} moduleName is test module name
   */
  selectAll(moduleName) {
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.contains(addRoleForm.selectAll, moduleName, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .should("include.text", moduleName)
      .find("input", { timeout: Cypress.env("waits").shortWait })
      .scrollIntoView()
      .click({ force: true });
  }

  //allModules will click on all access permission in all Modules
  //this type of all access usually created without reseller and customer
  allModules() {
    cy.get(addRoleForm.selectAll).each((element, index, list) => {
      cy.wrap(element).find("input").check({ force: true });
    });
    cy.get(locators.general.saveBtn).click({ delay: 7000 });
    cy.waitForTopMsgLoaderToDisappear(30000);
  }

  //checkForMandatoryErrorMsg will check that Error is appearing when User clickson save btn with empty mandatory fields
  checkForMandatoryErrorMsg() {
    this.clickAddRoleBtn();
    cy.get(locators.general.saveBtn).scrollIntoView().click({ delay: 3000 });
    cy.verifyToastMessageText(dataFile.mandatoryFieldsErrorText, 10000);
  }

  /**
   * multiModuleRole will be used when user needs to create one role with multiple modules
   * all the module names will be added in allModules array so the function will click on all these modules
   * @param {Object} roleData is the object from allRole in roles.json
   */
  multiModulesRole(roleData) {
    [...roleData.allModules, ...roleData.deselectAllModules].forEach(
      (moduleToCheck) => {
        if (moduleToCheck && moduleToCheck.length !== 0) {
          this.selectAll(moduleToCheck);
        }
      }
    );
    this.clickAndCheckPermission(roleData);
  }
  /**
   * addRole will add the role from the role form with provided test data roles.json
   * @param {Object} roleData it will be the test object from "dataFile.addRole"
   * @param {Boolean} multiRole condition to handle multiple modules
   * @param {Object} options an object containing additional flags (e.g., { isDiscard: true, skipModules: true })
   */
  addRole(roleData, multiRole = false, options) {
    this.clickAddRoleBtn();
    this.submitRoleForm(roleData, multiRole, options);
  }

  /**
   * Submits the role form with the provided role data and options.
   * @param {Object} roleData is the object it can be (addRole, updateRole)
   * @param {Boolean} multiRole is condition if true it will click on submodules and on false it will click on selectall of complete module
   * @param {Object} options an object containing additional flags (e.g., { isDiscard: true, skipModules: true, isUpdated: true })
   */
  submitRoleForm(roleData, multiRole = false, options = {}) {
    const {
      isDiscard = false,
      skipModules = false,
      isUpdated = false,
      isCustomerSpace = false
    } = options; // Destructure options with default values

    cy.waitForTopMsgLoaderToDisappear(30000);
    this.typeRoleName(roleData.name, isDiscard, isCustomerSpace);
    this.typeOptionalEmptyFieldCondition(
      roleData.description,
      locators.general.description
    );

    if (!isCustomerSpace && !isUpdated) {
      this.selectReseller(dataFile["addRole"]["reseller"]);
      this.selectCustomer(dataFile["addRole"]["customer"]);
    }
    if (!isCustomerSpace && isUpdated) {
      cy.get(addRoleForm.reseller).should("be.disabled");
      cy.get(addRoleForm.customer).should("be.disabled"); 
    }

    if (!skipModules) {
      multiRole
        ? this.multiModulesRole(roleData)
        : this.selectAll(roleData.name);
    }
    this.saveDiscardForm(isDiscard);

    cy.waitForTopMsgLoaderToDisappear(30000);
  }

  /**
   * Handles the save or discard action on a form based on the provided parameter.
   *
   * @param {boolean} isDiscard - Determines the action to perform.
   *                               If true, the discard (cancel) button is clicked.
   *                               If false, the save button is clicked.
   */
  saveDiscardForm(isDiscard) {
    if (isDiscard) {
      cy.get(locators.general.closeForm).click({ multiple: true, force: true });
    } else {
      cy.get(locators.general.saveBtn).click(); // Click on the save button
    }
  }

  /**
   * updateRole will update the existing role and updated modules based on test data from updateRole in roles.json
   * @param {Object} roleData is the object it can be (addRole, updateRole)
   * @param {Boolean} multiRole is condition if true it will click on submodules and on false it will click on selectall of complete module
   * @param {Object} options an object containing additional flags (e.g., { isDiscard: true, skipModules: true, isUpdated: true })
   */
  updateRole(roleData, multiRole = false, options) {
    this.submitRoleForm(roleData, multiRole, options);
  }

  searchWithFilter() {
    cy.readFile(writeRoles).then((file) => {
      cy.get(locators.general.filterIcon).click({ force: true });
      cy.searchFilterNameWithoutStatus(
        file.roles.roleName,
        addRoleForm.filterRoleName
      );
      cy.get(addRoleForm.addedRole).contains(file.roles.roleName).click();
    });
  }

  /**verifyAddedRole will verify that new role we have added is created successfully as per our test provided data from roles.json
   * @param {Object} roleData is the object from allRole in roles.json
   * @param {Boolean} verifySubModulePermission is the condition to check the permission is checked or unchecked.
   * @param {Boolean} isCustomerSpace is the condition to check the permission is checked or unchecked.
   */
  verifyAddedRole(roleData, isCustomerSpace = false) {
    // cy.readFile(writeRoles).then((file) => {
    //   cy.get(locators.general.filterIcon).click({ force: true });
    //   cy.searchFilterNameWithoutStatus(
    //     file.roles.roleName,
    //     addRoleForm.filterRoleName
    //   );
    //   cy.get(addRoleForm.addedRole).contains(file.roles.roleName).click();

    cy.readFile(writeRoles).then((file) => {
      //verify Role Name
      cy.get(addRoleForm.roleName).should("have.value", file.roles.roleName);
      if(!isCustomerSpace) {
      //verify Reseller
      cy.get(addRoleForm.verifyReseller).should(
        "have.text",
        dataFile.addRole.reseller
      );
      //verify Customer
      cy.get(addRoleForm.verifyCustomer).should(
        "have.text",
        dataFile.addRole.customer
      );
      }
      // Verify selected and unselected modules in roles
      [...roleData.allModules, ...roleData.deselectAllModules].forEach(
        (moduleName) => {
          if (moduleName) {
            const unSelectModule =
              roleData.deselectAllModules.includes(moduleName);
            this.verifyModules(moduleName, unSelectModule);
          }
        }
      );

      //verify submodules permissions
      this.clickAndCheckPermission(roleData, true);
    });
  }

  /**
   * verifyModules will check that after creation of roles correct modules are checked as the data roles.json
   * @param {Strings} moduleName checked module names
   * @param {Boolean} unSelectModule is the condition to check the permission is checked or unchecked
   */
  verifyModules(moduleName, unSelectModule) {
    cy.contains(addRoleForm.selectAll, moduleName)
      .should("include.text", moduleName)
      .find("input", { timeout: 20000 })
      .scrollIntoView()
      .as("module");

    unSelectModule
      ? cy.get("@module").should("not.be.checked")
      : cy.get("@module").should("be.checked");
  }

  /**
   * typeRoleName will be used for typing the random strings role name in role form
   * @param {String} name is the test data provided name (e.g Administration role) from test data
   * @param {Boolean} isDiscard is the condition to check the permission is checked or unchecked
   * @param {Boolean} isCustomerSpace is the condition to check the permission is checked or unchecked
   * @example the updated name from the function will type in the field as e.g Administration role eCwTwQ
   */
  typeRoleName(name, isDiscard, isCustomerSpace=false) {
    cy.createRandomString(6).then(($el) => {
      cy.get(addRoleForm.roleName)
        .clear({ force: true })
        .type(name + " " + $el);
      cy.readFile(writeRoles).then((file) => {
        file.roles.roleName = name + " " + $el;
        if (!isDiscard && !isCustomerSpace) {
          cy.writeFile(writeRoles, file);
          cy.readAndWriteData("Role", file.roles.roleName);
          cy.readAndWriteData("UserGroup Roles", file.roles.roleName);
        }
        if(!isDiscard && isCustomerSpace){
          cy.writeFile(writeRoles, file);
          cy.readAndWriteData("Role KXI User", file.roles.roleName);
          cy.readAndWriteData("UserGroup KXI User Roles", file.roles.roleName);
        }
      });
    });
  }

  //will select the reseller from reseller dropdown in roles form
  selectReseller(reseller) {
    cy.get(addRoleForm.reseller).select(reseller, { force: true });
  }

  //will select the customer from customer dropdown in roles form
  selectCustomer(customer) {
    cy.get(addRoleForm.customer).select(customer, { force: true });
  }

  //clickAddRole Btn will open the role form in role screen.
  clickAddRoleBtn() {
    cy.get(rolesLoc.addRoleBtn).click();
    cy.contains("h3", dataFile.addRoleForm.headingText).should("be.visible");
  }

  /**
   * Checks or unchecks a specific permission in the roles administration module.
   *
   * @param {string} moduleTableId - The ID of the module table containing the permission.
   * @param {string} rowDataName - The name of the row data to locate the permission.
   * @param {string} permissionName - The name of the permission to be checked or unchecked.
   * @param {boolean} verifySubModulePermission - If true, ensures the permission is checked.
   */
  checkPermission(
    moduleTableId,
    rowDataName,
    permissionName,
    verifySubModulePermission
  ) {
    cy.get(
      `${addRoleForm.permissions} [id='${moduleTableId}'] [data-name='${rowDataName}'] .${permissionName}`,
      { timeout: Cypress.env("waits").mediumWait }
    )
      .scrollIntoView()
      .as("permission");

    verifySubModulePermission
      ? cy.get("@permission").should("be.checked")
      : cy
          .get("@permission")
          .click({ force: true, delay: 600 })
          .should("be.checked");
  }

  /**clickAndCheckPermission will check for the partial access permission of submodules
  @param {Object} roleData is the object from allRole in roles.json
  @param {Boolean} verifySubModulePermission is the condition to check the permission is checked or unchecked
  */
  clickAndCheckPermission(roleData, verifySubModulePermission = false) {
    cy.waitForTopMsgLoaderToDisappear(30000);
    roleData.selectiveModules.forEach((moduleName) => {
      moduleName.subModulesCheck.forEach((subModule) => {
        // Loop through all possible permissions: 'read', 'create', 'update', 'delete'
        ["read", "create", "update", "delete"].forEach((permission) => {
          if (subModule[permission]) {
            this.checkPermission(
              moduleName.name,
              subModule.name,
              permission,
              verifySubModulePermission
            );
          }
        });
      });
    });
  }

  //handler function, it can be used for string optional fields from test data file roles.json e.g description
  typeOptionalEmptyFieldCondition(fieldValueText, locator) {
    if (fieldValueText != "") cy.get(locator).clear().type(fieldValueText);
  }

  /**
   * Verifies that the role grid list contains more than one element.
   * This ensures that the roles grid is populated with data.
   */
  roleGridList() {
    cy.get(locators.administration.roles.roleGridList).should(
      "have.length.greaterThan",
      1
    );
  }
  /***
   * *****************<<<<  Below Section is for Regulatory Change Management V2  >>>>*****************
   */
  /**
   *
   * check Read permission for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */
  validateReadOnlyAccess(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.readCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true })
      .should("be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox)
      .should("not.be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.updateCheckbox)
      .should("not.be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.deleteCheckbox)
      .should("not.be.checked");
  }
  /**
   * check Create/Update permission for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */

  validateCreateReadOnlyMode(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.updateCheckbox, { timeout: 20000 })
      .should("be.checked")
      .and("be.disabled");
  }

  /**
   * check deselect read permission for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */
  validateDeselectReadDeactivatesCreate(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.readCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .uncheck({ force: true });
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox,{ timeout: 20000 })
      .should("not.be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.updateCheckbox)
      .should("not.be.checked");
  }

  /**
   * check delete permission  automatically check Create/Read/Update
   * for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */
  validateDeleteAutoSelects(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.deleteCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.readCheckbox)
      .should("be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox)
      .should("be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.updateCheckbox)
      .should("be.checked");
  }
  /**
   * check  on unchecking delete permission  automatically
   * uncheck Create/Read/Update permission
   * for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */
  validateDeselectCreateDisablesDelete(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .uncheck({ force: true });
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.deleteCheckbox)
      .should("not.be.checked");
  }
  /**
   * check All permission
   * for Regulatory Change Management V2
   * @param {String} role subrole ID name from locators.json
   */
  validateFullAccess(role) {
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.deleteCheckbox)
      .should("be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.updateCheckbox)
      .should("be.checked");
    cy.get(roleRegChange[`${role}Row`])
      .find(roleRegChange.readCheckbox)
      .should("be.checked");
  }
  /**
   * Check title of Role
   * for Regulatory Change Management V2
   * @param {String} moduleName The name of module
   */
  validateModuleName(moduleName) {
    cy.get(roleRegChange.regChangeManagementV2Heading).should(
      "contain",
      moduleName
    );
  }

  /*************************<<<<< Pagination and Record DropDown >>>>>>>>>************************* */
  /************************************************************************************************ */

  /**
   * Verifies the functionality of pagination buttons.
   * This method performs the following actions:
   * - Clicks the right pagination button.
   * - Clicks the double-right pagination button.
   */
  verifyPaginationBtn() {
    cy.clickRightPaginationBtn();
    cy.clickDoubleRightPaginationBtn();
  }

  /**
   * Verifies the functionality of the record dropdown.
   * This method selects a specific number of records per page from the dropdown
   * and ensures that the grid list displays the correct number of records.
   */
  verifyRecordDropDown() {
    cy.get("#pageSize").select(dataFile.pageRecordCount);
    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.get(locators.administration.roles.roleGridList).should(
      "have.length",
      dataFile.pageRecordCount
    );
  }

  /********************************<<<<<< Audit Logs >>>>>>>>>>************************************* */

  /**
   * Filters the roles grid using the provided role name.
   * @param {String} roleName - The name of the role to filter by.
   */
  filterWithRoleName(roleName) {
    cy.get(locators.general.filterIcon).click({ force: true });
    cy.searchFilterNameWithoutStatus(roleName, addRoleForm.filterRoleName);
    cy.waitForTopMsgLoaderToDisappear(30000);
  }

  /**
   * Verifies that a system role with the given name exists in the roles grid.
   * @param {String} systemRoleName - The name of the system role to verify.
   */
  verifySystemRoles(systemRoleName) {
    this.filterWithRoleName(systemRoleName);
    cy.get(addRoleForm.addedRole).contains(systemRoleName);
  }

  /**
   * Verifies the audit logs for a specific section and role.
   * @param {String} sectionName - The name of the section to verify in the audit logs.
   * @param {Boolean} noModuleSavedRole - Indicates whether the role has no modules saved (default: false).
   * @param {Boolean} isCustomerSpace - Indicates whether the role is in a customer space (default: false).
   */
  verifyAuditLogs(sectionName, noModuleSavedRole = false, isCustomerSpace = false) {
    cy.readFile(writeRoles).then((file) => {
      this.filterWithRoleName(file.roles.roleName);
      cy.get(locators.general.threeElipses).should("be.visible").click();

      cy.get("#page_fragment").contains("Audit Log").click();

      cy.readFile(writeRoles).then((writeFile)=>{
        noModuleSavedRole
          ? isCustomerSpace
          ? cy.get(locators.general.auditLogTrailModal)
             .contains(writeFile.roles.roleName)
          : cy.get(locators.general.auditLogTrailModal)
             .contains(dataFile.emptyAuditLog)
          : this.savedModuleRole(file.roles.roleName, sectionName);
      })
      cy.get(locators.general.closeForm)
        .click({ multiple: true, force: true })
        .should("not.be.visible");
    });
  }

  /**
   * Verifies the saved modules and role details in the audit logs.
   * @param {String} roleName - The name of the role to verify in the audit logs.
   * @param {String} sectionName - The name of the section to verify in the audit logs.
   */
  savedModuleRole(roleName, sectionName) {
    // verify role Name
    cy.get(locators.general.auditLogTrailModal).contains(roleName);

    if (dataFile[sectionName].description != "") {
      cy.get(locators.general.auditLogTrailModal).contains(
        dataFile[sectionName].description
      );
    }

    //verify the modules
    dataFile[sectionName].allModules.forEach((module) => {
      cy.get(locators.general.auditLogTrailModal).contains(module);
    });
  }
  /***
   * *****************<<<<  Below Section is for Regulatory Change Management JIRA >>>>*****************
   */
  /**
   *
   * check Read permission for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateReadOnlyAccessForRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.readCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true })
      .should("be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.createCheckbox)
      .should("not.be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.updateCheckbox)
      .should("not.be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.deleteCheckbox)
      .should("not.be.checked");
  }
  /**
   * check Create/Update permission for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */

  validateCreateReadOnlyModeForRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.updateCheckbox, { timeout: 20000 })
      .should("be.checked")
      .and("be.disabled");
  }

  /**
   * check deselect read permission for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateDeselectReadDeactivatesCreateRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.readCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .uncheck({ force: true });
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.createCheckbox,{ timeout: 20000 })
      .should("not.be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.updateCheckbox)
      .should("not.be.checked");
  }

  /**
   * check delete permission  automatically check Create/Read/Update
   * for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateDeleteAutoSelectsRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.deleteCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.readCheckbox)
      .should("be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.createCheckbox)
      .should("be.checked");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.updateCheckbox)
      .should("be.checked");
  }
  /**
   * check  on unchecking create permission  automatically
   * uncheck update and delete permission
   * for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateDeselectCreateDisablesDeleteRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .uncheck({ force: true });
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChange.deleteCheckbox)
      .should("not.be.checked");
  }

  /**
   * check  on unchecking delete permission not
   * uncheck create and update permission
   * for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateDeselectDeleteRoleNotDisablesCreateUpdateRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.deleteCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true })
      .should("be.checked");

    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.deleteCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .uncheck({ force: true });

    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.createCheckbox)
      .should("be.checked");
      cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.updateCheckbox)
      .should("be.checked");

  }  
  
  /**
   * check All permission
   * for Regulatory Change Management JIRA
   * @param {String} role subrole ID name from locators.json
   */
  validateFullAccessRegChange(role) {
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.createCheckbox, { timeout: 20000 })
      .scrollIntoView()
      .check({ force: true });
      
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.deleteCheckbox)
      .should("be.checked")
      .and("be.disabled");
      
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.updateCheckbox)
      .should("be.checked")
      .and("be.disabled");
    cy.get(roleRegChangeJIRA[`${role}Row`])
      .find(roleRegChangeJIRA.readCheckbox)
      .should("be.checked")
      .and("be.disabled");
  }
  /**
   * Check title of Role
   * for Regulatory Change Management JIRA
   * @param {String} moduleName The name of module
   */
  validateModuleName(moduleName) {
    cy.get(roleRegChange.regChangeManagementV2Heading).should(
      "contain",
      moduleName
    );
  }


}
