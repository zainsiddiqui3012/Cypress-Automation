import Roles from "../../../support/POM/Administration/Roles";
import dataFile from "../../../fixtures/Administration/Roles.json";

describe(
  "Reg Change Management V2 Roles and Permission setup in Predict",
  {
    tags: [
      "@pd21530",
      "@roles",
      "@regchangev2",
      "@release5.21",
      "@predict",
    ],
  },
  () => {
    const roles = new Roles();

    context(
      "Validate Reg Chnage V2 role on reseller space",
      { tags: ["@reseller", "@pd30654"] },
      () => {
        beforeEach(() => {
          const resellerUser = Cypress.env("REG_CHANGE_V2").RESELLER;
          cy.loginWithSession(
            "Login with Reg Change V2 reseller user",
            resellerUser.USERNAME,
            resellerUser.PASSWORD,
            resellerUser.KEY
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
          roles.selectCustomer(dataFile.regChangeV2Roles.customer);
        });
        it(
          "Verify the Regulatory Change management V2 Section for roles and permissions should be set on the Roles Screen on Predict on reseller space.",
          { tags: ["@pd30540"] },
          () => {
            roles.validateModuleName(dataFile.regChangeV2Roles.moduleName);
          }
        );

        it(
          "Verify the Global Regulatory Change Manager with Read permission should be able to view all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks but cannot edit or create them.",
          { tags: ["@pd30546"] },
          () => {
            roles.validateReadOnlyAccess(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManager.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with Create/Update permission should be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30547"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with deselect Read permission should not be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30733"] },
          () => {
            roles.validateDeselectReadDeactivatesCreate(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with deselect delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30547"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with uncheck Delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30548"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Create/Update permission should be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30551"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.regulatoryChangeManagementEdit.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Delete permission should be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30552"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with  uncheck Delete permission should not be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30732"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Administration role should allow users to see the Admin Menu and edit all settings",
          { tags: ["@pd30554"] },
          () => {
            roles.validateFullAccess(
              dataFile.regChangeV2Roles.administration.key
            );
          }
        );

        it(
          "Verify the Pin role should allow users to pin, unpin, and delete pinned filters",
          { tags: ["@pd30553"] },
          () => {
            roles.validateFullAccess(dataFile.regChangeV2Roles.pinRole.key);
          }
        );
      }
    );
    context(
      "Validate Reg Chnage V2 role on customer space",
      { tags: ["@customer", "@pd30654"] },
      () => {
        beforeEach(() => {
          const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
          cy.loginWithSession(
            "Login with Reg Change V2 customer user",
            customerUser.USERNAME,
            customerUser.PASSWORD,
            customerUser.KEY
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
        });
        it(
          "Verify the Regulatory Change management V2 Section for roles and permissions should be set on the Roles Screen on Predict on customer space.",
          { tags: ["@pd30543"] },
          () => {
            roles.validateModuleName(dataFile.regChangeV2Roles.moduleName);
          }
        );

        it(
          "Verify the Global Regulatory Change Manager with Read permission should be able to view all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks but cannot edit or create them.",
          { tags: ["@pd30546"] },
          () => {
            roles.validateReadOnlyAccess(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManager.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with Create/Update permission should be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30547"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with deselect Read permission should not be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30733"] },

          () => {
            roles.validateDeselectReadDeactivatesCreate(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with deselect delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30547"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with uncheck Delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30548"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Create/Update permission should be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30551"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.regulatoryChangeManagementEdit.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Delete permission should be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30552"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with  uncheck Delete permission should not be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30732"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Administration role should allow users to see the Admin Menu and edit all settings",
          { tags: ["@pd30554"] },
          () => {
            roles.validateFullAccess(
              dataFile.regChangeV2Roles.administration.key
            );
          }
        );

        it(
          "Verify the Pin role should allow users to pin, unpin, and delete pinned filters",
          { tags: ["@pd30553"] },
          () => {
            roles.validateFullAccess(dataFile.regChangeV2Roles.pinRole.key);
          }
        );
      }
    );
    context(
      "Validate Reg Chnage V2 role on none space",
      { tags: ["@none", "@pd30654"] },
      () => {
        beforeEach(() => {
          const noneUser = Cypress.env("USER").NONE;
          cy.loginWithSession(
            "Login with none user",
            noneUser.USER_NAME,
            noneUser.PASSWORD,
            noneUser.KEY
          );
          cy.visitRoles();
          roles.clickAddRoleBtn();
          roles.selectReseller(dataFile.regChangeV2Roles.reseller);
          roles.selectCustomer(dataFile.regChangeV2Roles.customer);
        });
        it(
          "Verify the Regulatory Change management V2 Section for roles and permissions should be set on the Roles Screen on Predict on none space.",
          { tags: ["@pd30537"] },
          () => {
            roles.validateModuleName(dataFile.regChangeV2Roles.moduleName);
          }
        );

        it(
          "Verify the Global Regulatory Change Manager with Read permission should be able to view all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks but cannot edit or create them.",
          { tags: ["@pd30546"] },
          () => {
            roles.validateReadOnlyAccess(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManager.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with Create/Update permission should be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30547"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify Global Regulatory Change Manager with deselect Read permission should not be able to view and edit all Regulatory Changes, Action Plans, Evaluate Impact, and Tasks, regardless of assignment.",
          { tags: ["@pd30733"] },
          () => {
            roles.validateDeselectReadDeactivatesCreate(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerEdit.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with deselect delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30547"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Global Regulatory Change Management with uncheck Delete permission should not be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30548"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.globalRegulatoryChangeManagerFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Create/Update permission should be able to view and edit the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them",
          { tags: ["@pd30551"] },
          () => {
            roles.validateCreateReadOnlyMode(
              dataFile.regChangeV2Roles.regulatoryChangeManagementEdit.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with Delete permission should be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30552"] },
          () => {
            roles.validateDeleteAutoSelects(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Regulatory Change Management with  uncheck Delete permission should not be able to view, edit, and delete the Regulatory Changes, Action Plans, Evaluate Impact, and Tasks assigned to them or created by them.",
          { tags: ["@pd30732"] },
          () => {
            roles.validateDeselectCreateDisablesDelete(
              dataFile.regChangeV2Roles.regulatoryChangeManagementFull.key
            );
          }
        );

        it(
          "Verify The Administration role should allow users to see the Admin Menu and edit all settings",
          { tags: ["@pd30554"] },
          () => {
            roles.validateFullAccess(
              dataFile.regChangeV2Roles.administration.key
            );
          }
        );

        it(
          "Verify the Pin role should allow users to pin, unpin, and delete pinned filters",
          { tags: ["@pd30553"] },
          () => {
            roles.validateFullAccess(dataFile.regChangeV2Roles.pinRole.key);
          }
        );
      }
    );
  }
);
