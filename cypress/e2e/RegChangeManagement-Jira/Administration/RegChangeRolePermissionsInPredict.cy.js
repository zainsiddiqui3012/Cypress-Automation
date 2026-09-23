import Roles from "../../../support/POM/Administration/Roles";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
import dataFile from "../../../fixtures/Administration/Roles.json";

describe(
  "Verify RegChange Feed Register Menu and Role Permissions in None, Reseller and Customer space in Predict",
  {
    tags: [
      "@regression",
      "@pd34469",
      "@pd34467",
      "@jira",
      "@regchange",
      "@regchange-roles",
      "@regchangefeedregister",
      "@release5.21",
      "@predict",
    ],
  },
  () => {
    const roles = new Roles();
    const regchangeV2Menu = new RegChangeV2Menu();

    context("RegChange menu is present in menu", () => {
      beforeEach(() => {
        const regchangeUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.loginWithSession(
          "RegChange User session",
          regchangeUser.USERNAME,
          regchangeUser.PASSWORD,
          regchangeUser.KEY
        );
      });

      it("Verify that the 'Regulatory Change Feed Register' module present in left menu bar within the Compliance Management", () => {
        cy.visitProfile();
        regchangeV2Menu.clickLeftMenu();
        regchangeV2Menu.verifyMenuItemAndClick(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
      });
    });
    context(
      "RegChange Jira Role Permission functionlaity on the Role screen from None space",
      () => {
        beforeEach(() => {
          const noneUser = Cypress.env("kxi").none;
          cy.clearAllCookies();
          cy.ignoreNetworkLogs();
          cy.loginWithSession(
            "None User session for RegChange",
            noneUser.username,
            noneUser.password,
            noneUser.key
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
          roles.selectReseller(dataFile.regChangeRoles.reseller);
        });
        it("Verify the Regulatory Change Management Role Section for roles should be present and set on the Roles Screen on Predict on none space.", () => {
          roles.validateModuleName(dataFile.regChangeRoles.moduleName);
        });

        it("Verify the Global Regulatory Change Manager with Read permission should be able to view all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks but cannot update, create and delete them.", () => {
          roles.validateReadOnlyAccessForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManager.key
          );
        });
        it("Verify Global Regulatory Change Manager with Create/Update permission should be able to view, create and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });
        it("Verify Global Regulatory Change Manager with deselect Read permission should not be able to view, create and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
          roles.validateDeselectReadDeactivatesCreateRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });
        it("Verify that Global Regulatory Change Management with select delete permission should be able to view, create and update the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });
        it("Verify that Global Regulatory Change Management with uncheck Delete permission should not be able to create, update the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeselectDeleteRoleNotDisablesCreateUpdateRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });

        it("Verify the Pin role should allow users to pin, unpin, and delete pinned filters", () => {
          roles.validateFullAccessRegChange(
            dataFile.regChangeRoles.pinRole.key
          );
        });
      }
    );
    context(
      "Validate Regulatory Change Management module role on reseller space",
      { tags: ["@reseller"] },
      () => {
        beforeEach(() => {
          const resellerUser = Cypress.env("REG_CHANGE_V2").RESELLER;
          cy.loginWithSession(
            "Login with Reg Change reseller user",
            resellerUser.USERNAME,
            resellerUser.PASSWORD,
            resellerUser.KEY
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
          roles.selectCustomer(dataFile.regChangeRoles.customer2);
        });
        it(
          "Verify the Regulatory Change management Section for roles and permissions should be set on the Roles Screen on Predict on reseller space.",
          { tags: ["@pd30540"] },
          () => {
            roles.validateModuleName(dataFile.regChangeRoles.moduleName);
          }
        );
        it("Verify the Global Regulatory Change Manager with Read permission should be able to view all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks but cannot edit or create them.", () => {
          roles.validateReadOnlyAccessForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManager.key
          );
        });

        it("Verify Global Regulatory Change Manager with Create permission should be able to Update/Edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });
        it("Verify Global Regulatory Change Manager with deselect Read permission should not be able to view, create and edit/update all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.", () => {
          roles.validateDeselectReadDeactivatesCreateRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });

        it("Verify that Global Regulatory Change Management with select delete permission should be able to view, create edit/update the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });
        it("Verify that Global Regulatory Change Management with uncheck Delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeselectDeleteRoleNotDisablesCreateUpdateRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });
        it("Verify that Regulatory Change Management with Create/Update permission should be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.regulatoryChangeManagementEdit.key
          );
        });
        it("Verify that Regulatory Change Management with Delete permission should be able to view, create, edit and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.regulatoryChangeManagementFull.key
          );
        });

        it("Verify that Regulatory Change Management with uncheck Delete permission user still should be able to create view, and edit, but not delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.", () => {
          roles.validateDeselectDeleteRoleNotDisablesCreateUpdateRegChange(
            dataFile.regChangeRoles.regulatoryChangeManagementFull.key
          );
        });

        it("Verify the Pin role should allow users to pin, unpin, and delete pinned filters", () => {
          roles.validateFullAccessRegChange(
            dataFile.regChangeRoles.pinRole.key
          );
        });
      }
    );
    context(
      "Validate Reg Chnage role on customer space",
      { tags: ["@customer"] },
      () => {
        beforeEach(() => {
          const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
          cy.loginWithSession(
            "Login with Reg Change customer user",
            customerUser.USERNAME,
            customerUser.PASSWORD,
            customerUser.KEY
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
        });
        it("Verify the Regulatory Change management Section for roles and permissions should be set on the Roles Screen on Predict on customer space", () => {
          roles.validateModuleName(dataFile.regChangeRoles.moduleName);
        });
        it("Verify that the 'Global Regulatory Change Manager' role with only 'Read' permission allows the user to view Regulatory Changes, Action Plans, Evaluate Impact, and Tasks that are assigned to them or created by them", () => {
          roles.validateReadOnlyAccessForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManager.key
          );
        });

        it("Verify that when 'Create' permission is checked for the 'Global Regulatory Change Manager' role, the 'Update/Edit' permission is auto-selected in read-only mode along with 'Read", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });
        it("Verify that when 'Read' permission is de-selected for the 'Global Regulatory Change Manager' role, the 'Create' and 'Update' checkboxes are also de-selected, and the user cannot create or edit any Regulatory Changes, Action Plans, Evaluate Impact, or Tasks regardless of assignment", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
          roles.validateDeselectReadDeactivatesCreateRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerEdit.key
          );
        });

        it("Verify that Global Regulatory Change Management with deselect delete permission should be unchecked Create/Update checkbox and user not be able to Create and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by themVerify that when 'Delete' permission is de-selected for the 'Global Regulatory Change Manager' role, the 'Create/Update' permissions are also unchecked, and the user is not allowed to create or edit Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });
        it("Verify that Global Regulatory Change Management with uncheck Delete permission should be unchecked Create and Update checkbox and user not be able to create and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );

          roles.validateDeselectCreateDisablesDeleteRegChange(
            dataFile.regChangeRoles.globalRegulatoryChangeManagerFull.key
          );
        });
        it("Verify that when the 'Create' checkbox is checked for the 'Regulatory Change Management' role, the 'Update' checkbox is auto-checked in read-only mode, and the user is able to view, create and edit Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateCreateReadOnlyModeForRegChange(
            dataFile.regChangeRoles.regulatoryChangeManagementEdit.key
          );
        });
        it("Verify that when the 'Delete' checkbox is checked for the 'Regulatory Change Management' role, the 'Read' and 'Create/Update' checkboxes are auto-checked, and the user is able to view, create/edit, and delete Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them", () => {
          roles.validateDeleteAutoSelectsRegChange(
            dataFile.regChangeRoles.regulatoryChangeManagementFull.key
          );
        });
        it("Verify that when the 'Create' checkbox is checked for the 'Pin' role, the 'Read', 'Create', 'Update', and 'Delete' checkboxes are auto-checked in read-only mode, and the user is allowed to pin, unpin, and delete pinned filters", () => {
          roles.validateFullAccessRegChange(
            dataFile.regChangeRoles.pinRole.key
          );
        });
      }
    );
  }
);
