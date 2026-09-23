import Roles from "../../support/POM/Administration/Roles";
import dataFile from "../../fixtures/Administration/Roles.json";

describe(
  "E2E Automation of Roles from Customer Space",
  {
    tags: [
      "@pd32059",
      "@administration-roles",
      "@roles",
      "@manage-roles",
      "@customer-space-roles",
      "@customer-space",
      "@administration",
      "@regression",
      "@e2e"
    ]
  },
  () => {
    const roles = new Roles();

    context(
      "Create all the Roles for Automation in Customer Space",
      { tags: ["@create-roles", "@create-single-module-roles"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitRoles();
        });

        it("Create role for Administration", () => {
          roles.addRole(
            dataFile.singleRoles.administration,
            false,
            { 
              isCustomerSpace: true
            }
          );
        });

        it("Create role for Regulations & Obligations", () => {
          roles.addRole(dataFile.singleRoles.regulationsAndObligations,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for Assessments", () => {
          roles.addRole(dataFile.singleRoles.assessments,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for Risk Management", () => {
          roles.addRole(dataFile.singleRoles.riskManagement,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for Issue Management", () => {
          roles.addRole(dataFile.singleRoles.issueManagement,
            false,
            { 
              isCustomerSpace: true
            });
        });

        // for KXI Customer Regulatory change management v2 is not added on reseller/Customer for this user.
        it.skip("Create role for Regulatory Change Management V2", () => {
          roles.addRole(dataFile.singleRoles.regulatoryChangeManagementV2,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for KxI Engine", () => {
          roles.addRole(dataFile.singleRoles.kxIEngine,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for Compliance Management Activities (Global Settings)", () => {
          roles.addRole(
            dataFile.singleRoles.complianceManagementActivities_GlobalSettings,
            false,
            { 
              isCustomerSpace: true
            }
          );
        });

        it("Create role for Audit Management", () => {
          roles.addRole(dataFile.singleRoles.auditManagement,
            false,
            { 
              isCustomerSpace: true
            });
        });

        it("Create role for Document Management",{tags:"@smoke"}, () => {
          roles.addRole(dataFile.singleRoles.documentManagement,
            false,
            { 
              isCustomerSpace: true
            });
            cy.readFile("cypress/fixtures/Administration/writeRoles.json").then((data) => {
            cy.readFile("cypress/fixtures/Administration/Users.json").then((usersData) => {
              usersData.addUser = usersData.addUser || {};
              usersData.addUser.role = [data.roles.roleName];
              cy.writeFile("cypress/fixtures/Administration/Users.json", usersData);
            });
            });
        });

        /**
         * from None space it is not possible to create All access roles without selecting reseller and customer
         * https://360factors.atlassian.net/browse/PD-30143
         */
        it("Create All Access Role", () => {
          roles.clickAddRoleBtn();
          roles.typeRoleName(
            dataFile.singleRoles.allAccess.name,
            dataFile.singleRoles.allAccess.key
          );
          roles.allModules();
        });
      }
    );

    context("verify System Roles Exists in role grid of Customer Space", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitRoles();
        roles.roleGridList();
      });

      it("verify System Roles", () => {
        dataFile.systemRoles.forEach((roleName) => {
          roles.verifySystemRoles(roleName);
        });
      });
    });
    context(
      "Create a role with the provided modules data in Customer Space",
      {
        tags: [
          "@smoke",
          "@create-roles",
          "@create-multi-modules-roles",
          "add"
        ]
      },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it(
          "should display validation errors when saving an empty Role form",
          {
            tags: [
              "@smoke",
              "@pd32784",
              "@pd32747" ,
              "@pd32759",
              "@pd32791"
            ]
          },
          () => {
            roles.checkForMandatoryErrorMsg();
          }
        );
        it(
          "Verify saving a role without any permissions selected",
          {
            tags: [
              "@smoke",
              "@pd32758"
            ]
          },
          () => {
            roles.addRole(dataFile.addRole, false, { skipModules: true, isCustomerSpace: true });
          }
        );
        //skip this test because it takes sometimes to load on the audit log screen from DB otherwise shows white blank screen.
        it.skip(
          "Verify Audit Log for empty records",
          {
            tags: ["@pd32787", "@pd32788"]
          },
          () => {
            roles.verifyAuditLogs("addRole", true, true);
          }
        );
        it(
          "create new role with multiAdded Modules from Administration with automation",
          {
            tags: [
              "@smoke"
            ]
          },
          () => {
            roles.addRole(dataFile.addRole, true, { isDiscard: true, isCustomerSpace: true });
            roles.addRole(dataFile.addRole, true, {isCustomerSpace: true});
          }
        );

        it(
          "verify that role is added with the correct Data",
          {
            tags: [
              "@smoke",
              "@pd32749",
              "@pd32750",
              "@pd32751",
              "@pd32752",
              "@pd32753",
              "@pd32754",
              "@pd32755",
              "@pd32756",
              "@pd32757",
              "@pd32782"
            ]
          },
          () => {
            roles.searchWithFilter(dataFile.addRole);
            roles.verifyAddedRole(dataFile.addRole, true);
          }
        );

        it(
          "Verify Audit Log opens correct details",
          { tags: ["@pd32785", "@pd32786", "@pd32783"] },
          () => {
            roles.verifyAuditLogs("addRole");
          }
        );
      }
    );

    context(
      "update existing role with the provided modules data in Customer Space",
      { tags: ["@smoke", "@edit", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it(
          "Validate Cancel button functionality",
          { tags: ["@smoke", "@pd32800"] },
          () => {
            roles.searchWithFilter();
            roles.updateRole(dataFile.updateRole, true, {
              isDiscard: true,
              skipModules: true,
              isUpdated: true,
              isCustomerSpace: true
            });
          }
        );
        it(
          "update the existing role from Administration",
          {
            tags: [
              "@smoke"
            ]
          },
          () => {
            roles.searchWithFilter();
            roles.updateRole(dataFile.updateRole, true, { isUpdated: true, isCustomerSpace: true });
          }
        );

        it(
          "verify that the role is updated with the correct updated added Data",
          {
            tags: [
              "@smoke",
              "@pd32792",
              "@pd32793",
              "@pd32794",
              "@pd32795",
              "@pd32796",
              "@pd32797",
              "@pd32798",
              "@pd32799",
              "@PD32802",
              "@PD32760",
              "@pd32761",
              "@pd32762",
              "@pd32763",
              "@pd32764",
              "@pd32765",
              "@pd32766",
              "@pd32769",
              "@pd32773",
              "@pd32777"
            ]
          },
          () => {
            roles.searchWithFilter(dataFile.updateRole);
            roles.verifyAddedRole(dataFile.updateRole, true);
          }
        );

        it(
          "Verify role updates are reflected in Audit Log",
          {
            tags: [
              "@pd32789",
              "@pd32790",
              "@pd32801"
            ]
          },
          () => {
            roles.verifyAuditLogs("updateRole");
          }
        );
      }
    );

    context(
      "verify Pagination and Record DropDown",
      { tags: "@pagination" },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it("Verify pagination functionality", { tags: "@pd32778" }, () => {
          roles.verifyPaginationBtn();
        });

        it("Verify Records dropdown behavior", { tags: "@pd32779" }, () => {
          roles.verifyRecordDropDown();
        });
      }
    );
  }
);