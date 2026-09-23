import Roles from "../../support/POM/Administration/Roles";
import dataFile from "../../fixtures/Administration/Roles.json";

describe(
  "E2E Automation of Roles from None Space",
  {
    tags: [
      "@pd30108",
      "@administration-roles",
      "@roles",
      "@manage-roles",
      "@none-space-roles",
      "@none-space",
      "@administration",
      "@regression"
    ]
  },
  () => {
    const roles = new Roles();

    context(
      "Create all the Roles for Automation",
      { tags: ["@create-roles", "@create-single-module-roles"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitRoles();
        });

        it("Create role for Administration", () => {
          roles.addRole(dataFile.singleRoles.administration);
        });

        it("Create role for Regulations & Obligations", () => {
          roles.addRole(dataFile.singleRoles.regulationsAndObligations);
        });

        it("Create role for Assessments", () => {
          roles.addRole(dataFile.singleRoles.assessments);
        });

        //from None Space process Failure Mode Risk Management is not showing while creating roles
        it.skip("Create role for Process Failure Mode Risk Management", () => {
          roles.addRole(dataFile.singleRoles.processFailureModeRiskManagement);
        });

        it("Create role for Risk Management", () => {
          roles.addRole(dataFile.singleRoles.riskManagement);
        });

        it("Create role for Vendor Risk Management", () => {
          roles.addRole(dataFile.singleRoles.vendorRiskManagement1);
        });

        it("Create role for Issue Management", () => {
          roles.addRole(dataFile.singleRoles.issueManagement);
        });

        // from None Space Regulatory Change Management v2 is not showing while creating roles
        it.skip("Create role for Regulatory Change Management V2", () => {
          roles.addRole(dataFile.singleRoles.regulatoryChangeManagementV2);
        });

        it("Create role for KxI Engine", () => {
          roles.addRole(dataFile.singleRoles.kxIEngine);
        });

        it("Create role for Compliance Management Activities (Global Settings)", () => {
          roles.addRole(
            dataFile.singleRoles.complianceManagementActivities_GlobalSettings
          );
        });

        it("Create role for Audit Management", () => {
          roles.addRole(dataFile.singleRoles.auditManagement);
        });

        it("Create role for Document Management",{tags:"@smoke"}, () => {
          roles.addRole(dataFile.singleRoles.documentManagement);
            cy.readFile("cypress/fixtures/Administration/writeRoles.json").then((data) => {
            cy.readFile("cypress/fixtures/Administration/Users.json").then((usersData) => {
              usersData.addUser = usersData.addUser || {};
              usersData.addUser.role = [data.roles.roleName];
              cy.writeFile("cypress/fixtures/Administration/Users.json", usersData);
            });
            });
        })

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

    context("verify System Roles Exists in role grid", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
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
      "Create a role with the provided reseller,customer and modules data",
      {
        tags: [
          "@create-roles",
          "@create-multi-modules-roles",
          "add",
          "@pd33698"
        ]
      },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it(
          "should display validation errors when saving an empty Role form",
          {
            tags: [
              "@smoke",
              "@pd33675",
              "@pd33676",
              "@pd33679",
              "@pd33680",
              "@pd33689",
              "@pd33711"
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
              "@pd33670",
              "@pd33671",
              "@pd33672",
              "@pd33673",
              "@pd33674",
              "@pd33688",
              "@pd33694"
            ]
          },
          () => {
            roles.addRole(dataFile.addRole, true, { skipModules: true });
          }
        );
        // Audit Logs sometimes takes time to load from database it shows white blank screen and sometimes comes while sometimes not therefore skipping this test
        it.skip(
          "Verify Audit Log for empty records",
          {
            tags: ["@pd33708", "@pd33707", "@pd33704", "@pd33705", "@pd33706"]
          },
          () => {
            roles.verifyAuditLogs("addRole", true);
          }
        );
        it(
          "create new role with multiAdded Modules from Administration with automation",
          {
            tags: [
              "@smoke",
              "@pd30087",
              "@pd33670",
              "@pd33671",
              "@pd33672",
              "@pd33673",
              "@pd33674",
              "@pd33681",
              "@pd33682",
              "@pd33683",
              "@pd33685",
              "@pd33686",
              "@pd33718",
              "@pd33687",
              "@pd33690",
              "@pd33691",
              "@pd33692",
              "@pd33693",
              "@pd33702",
              "@pd33713",
              "@pd33721"
            ]
          },
          () => {
            roles.addRole(dataFile.addRole, true, { isDiscard: true });
            roles.addRole(dataFile.addRole, true);
          }
        );

        it(
          "verify that role is added with the correct Data",
          {
            tags: [
              "@smoke",
              "@pd30088",
              "@pd33696",
              "@pd33697",
              "@pd33703",
              "@pd33710",
              "@pd33713",
              "@pd33717",
              "@pd33720",
              "@pd33723"
            ]
          },
          () => {
            roles.searchWithFilter(dataFile.addRole);
            roles.verifyAddedRole(dataFile.addRole);
          }
        );

        it(
          "Verify Audit Log opens correct details",
          { tags: ["@pd33708", "@pd33704", "@pd33705", "@pd33706"] },
          () => {
            roles.verifyAuditLogs("addRole");
          }
        );
      }
    );

    context(
      "update existing role with the provided reseller, customer and modules data",
      { tags: ["@edit", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it(
          "Validate Cancel button functionality",
          { tags: ["@smoke", "@pd33721"] },
          () => {
            roles.searchWithFilter();
            roles.updateRole(dataFile.updateRole, true, {
              isDiscard: true,
              skipModules: true,
              isUpdated: true
            });
          }
        );
        it(
          "update the existing role from Administration",
          {
            tags: [
              "@smoke",
              "@pd30089",
              "@pd33678",
              "@pd33684",
              "@pd33685",
              "@pd33686",
              "@pd33687",
              "@pd33690",
              "@pd33691",
              "@pd33692",
              "@pd33693",
              "@pd33695"
            ]
          },
          () => {
            roles.searchWithFilter();
            roles.updateRole(dataFile.updateRole, true, { isUpdated: true });
          }
        );

        it(
          "verify that the role is updated with the correct updated added Data",
          {
            tags: [
              "@smoke",
              "@pd30144",
              "@pd33695",
              "@pd33696",
              "@pd33697",
              "@pd33699",
              "@pd33703",
              "@pd33710",
              "@pd33714",
              "@pd33715",
              "@pd33716",
              "@pd33717",
              "@pd33720",
              "@pd33723"
            ]
          },
          () => {
            roles.searchWithFilter(dataFile.updateRole);
            roles.verifyAddedRole(dataFile.updateRole);
          }
        );

        it(
          "Verify role updates are reflected in Audit Log",
          {
            tags: [
              "@pd33722",
              "@pd33709",
              "@pd33708",
              "@pd33704",
              "@pd33705",
              "@pd33706"
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
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitRoles();
          roles.roleGridList();
        });

        it("Verify pagination functionality", { tags: "@pd33700" }, () => {
          roles.verifyPaginationBtn();
        });

        it("Verify Records dropdown behavior", { tags: "@pd33701" }, () => {
          roles.verifyRecordDropDown();
        });
      }
    );
  }
);