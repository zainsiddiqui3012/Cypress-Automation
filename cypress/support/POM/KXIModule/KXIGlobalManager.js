import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import KXI_POM from "./KxI_POM";
import PredictMenu_PO from "../Menu_PO/PredictMenu_PO";
import userdata from "../../../fixtures/Administration/Users.json"

const writeDataFilePath = "cypress/fixtures/KXIModule/KXIWrite.json";

export default class KXIGlobalManager {
  kxi = new KXI_POM();
  menu = new PredictMenu_PO();

  usersMenu() {
    cy.get(locators.menu.users).click();
  }

  verifyKXIGlobalManager() {
    cy.get(locators.administration.roles.kxiglobalManager)
      .scrollIntoView()
      .should("be.visible");
  }

  verifyCreatePermission() {
    cy.get(locators.administration.roles.createCheckbox).click();
    cy.get(locators.administration.roles.readInput).should("be.checked");
    cy.get(locators.administration.roles.updateDisabled).should("be.checked");
  }

  roleMenu() {
    this.menu.menuClick();
    this.kxi.lumifyAdmin();
    this.kxi.selectRoles();
    this.kxi.addRolebtn();
  }
  userMenu() {
    this.menu.menuClick();
    this.kxi.lumifyAdmin();
    this.usersMenu();
  }
  navigatetoRole() {
    cy.visitProfile();
    this.roleMenu();
  }

  verifyReadPermission() {
    cy.get(locators.administration.roles.readCheckbox).click();
    cy.get(locators.administration.roles.createInput).should("not.be.checked");
    cy.get(locators.administration.roles.updateDisabled).should(
      "not.be.checked"
    );
    cy.get(locators.administration.roles.readCheckbox).click();
    cy.get(locators.administration.roles.createInput).should("not.be.checked");
    cy.get(locators.administration.roles.updateDisabled).should(
      "not.be.checked"
    );
  }

  verifyDeletePermission() {
    cy.get(locators.administration.roles.deleteCheckbox).click();
    cy.get(locators.administration.roles.createInput).should("be.checked");
    cy.get(locators.administration.roles.updateDisabled).should("be.checked");
    cy.get(locators.administration.roles.readInput).should("be.checked");
  }
  verifyDeleteonUncheckingCreate() {
    cy.get(locators.administration.roles.createCheckbox).click();
    cy.get(locators.administration.roles.deleteInput).should("not.be.checked");
  }
  verifyUpdateDisabled() {
    cy.get(locators.administration.roles.createCheckbox).click();
    cy.get(locators.administration.roles.updateDisabled).should("be.disabled");
  }
  verifyUpdateUncheck() {
    cy.get(locators.administration.roles.createCheckbox).click();
    cy.get(locators.administration.roles.updateDisabled).should(
      "not.be.checked"
    );
  }

  verifyKXIDefinitionManagement() {
    cy.get(locators.administration.roles.kxiDefinitionManagement).should(
      "not.contain",
      "KxI Definition Management"
    );
  }

  createRole() {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");

    const roleName = "Role for KXI Global";
    const RoleNameValue = roleName + timeStamp;

    cy.get(locators.administration.roles.roleName).type(RoleNameValue);

    cy.readFile(writeDataFilePath).then((file) => {
      file.roleName = RoleNameValue;
      cy.writeFile(writeDataFilePath, file);
    });

    return RoleNameValue;
  }

  AddLocator(locator) {
    cy.get(locator)
    .scrollIntoView()
    .should('be.visible').click();
    //Remove Duplicate line
    cy.get(locators.administration.roles.saveBtn, { timeout: 5000 }).click();
  }

  createUsers(roleName) {
    cy.get(locators.administration.users.addUserBtn).click();
    cy.get(locators.administration.users.firstName).type(userdata.addUser.firstName);
    cy.get(locators.administration.users.lastName).type(
      "KXI Global Manager Role"
    );

    cy.get(locators.administration.users.userEmailAddress).type(
      userdata.addUser.email
    );

    cy.get(locators.administration.users.roleDropdown).click();

    cy.readFile(writeDataFilePath).then((file) => {
      roleName
      ? cy.get(locators.administration.users.selectRoles)
        .select(roleName,{force:true})
      : cy.get(locators.administration.users.selectRoles).select(
          file.roleName,
          { force: true }
        );
    })
  }

  addUsername(password) {
    cy.createRandomString(5).then((userName) => {
      cy.get(locators.administration.users.userName).type(userName);
      const userNameValue = userName;

      cy.readFile(writeDataFilePath).then((file) => {
        file.userName = userNameValue;
        cy.writeFile(writeDataFilePath, file);
      });
    });
    cy.get(locators.administration.users.userFormSavebtn).click();

    cy.get(locators.administration.users.changePassword).click();

    cy.wait(3000);

    cy.get(locators.administration.users.newPassword, { timeout: 5000 })
      .should("be.visible")
      .type(password, { delay: 300 });
    cy.wait(3000);
    cy.get(locators.administration.users.confirmPassword, { timeout: 5000 })
      .should("be.visible")
      .type(password, { delay: 300 });
    cy.screenshot();
    cy.get(locators.administration.users.submitPassword).click();
    cy.screenshot();

    // cy.waitForElementToVisible(locators.administration.users.saveButton,50000);

    cy.waitForElementToVisible(locators.administration.users.toastMsg, 50000);
    cy.get(locators.administration.users.activeRadioButton, {
      timeout: 5000,
    }).click();

    cy.screenshot();
    cy.get(locators.administration.users.saveButton).click({ force: true });

    cy.waitForElementToVisible(locators.administration.users.toastMsg, 20000);
    cy.get(locators.administration.users.toastMsg).should("be.visible");
    cy.screenshot();
  }

  verifyKxiDefinitionViewOnly() {
    cy.visitkxiDef();

    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 }).should(
      "not.exist"
    );
    cy.get(locators.kxi.kxiDefinition.ellipsesBtn).should("not.exist");
  }

  verifyweightNotChangedonInsight() {
    cy.visitkxiInsight();

    cy.get(locators.kxi.insight.toleranceFilter, { timeout: 50000 })
      .should("be.visible")
      .select("positive");
    cy.get(locators.kxi.insight.kXIArrow).click({ multiple: true });
    cy.get(locators.kxi.insight.editWeight).should("not.exist");
  }

  /**Removed addKxiDefinition method because that method is available in KXI_POM class */

  editKxiDefinition() {
    cy.visitkxiDef();

    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 100000 })
      .eq(0)
      .click();

    const kxiName = "Kxi definition Edited";

    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const finalName = kxiName + timeStamp;
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.name)
      .clear()
      .type(finalName)
      .type(timeStamp);

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveButton).click();
  }

  /**Removed addKxiData method  because that method is available in KXI_POM class */
  deleteCustomField() {
    cy.visitkxiDef();

    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 })
      .eq(0)
      .click();
    cy.get(locators.kxi.kxiDefinition.statusDropdown).click();
    cy.get(locators.kxi.kxiDefinition.statusDropdownSearch)
      .type("Inactive")
      .type("{Enter}");
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveButton).click();

    cy.get(locators.kxi.kxiDefinition.deleteBtn, { timeout: 50000 })
      .should("be.visible")
      .eq(0)
      .click({ force: true });
    cy.waitForElementToVisible(locators.administration.users.toastMsg, 50000);
  }

  deleteKxiData() {
    /**Calling addkxiData from KXI_POM class on test file */
    cy.get(locators.kxi.kxiData.gridDeleteIcon, { timeout: 50000 })
      .first()
      .click();
    cy.get(locators.kxi.kxiData.deleteModal.deleteBtn, {
      timeout: 50000,
    }).click();

    cy.get(locators.administration.users.toastMsg).contains(
      "KRI Data has been deleted successfully."
    );
  }
}
