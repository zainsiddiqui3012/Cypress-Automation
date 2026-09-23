import Users from "../../support/POM/Administration/Users";
import userData from "../../fixtures/Administration/Users.json";

const users = new Users();

describe(
  "E2E Automation of Users from Customer Space",
  {
    tags: [
      "@pd32061",
      "@administration-users",
      "@users",
      "@customer-space-users",
      "@administration",
      "@customer-space",
      "@regression"
    ]
  },
  () => {
    context(
      "User Creation",
      { tags: ["@smoke","@pd32406", "@user-creation", "@manage-user", "@add", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitUsers();
          users.viewUserList();
        });

        it(
          "should display validation errors when saving an empty user form",
          { tags: ["@smoke", "@pd32418", "@pd32407", "@pd32688"] },
          () => {
            users.checkForMandatoryError();
          }
        );

        it(
          "check length and format Validation",
          { tags: ["@smoke","@pd32678", "@pd32689"] },
          () => {
            users.checkLengthFormatValidation();
          }
        );

        it(
          "should successfully create a user from the Administration panel",
          {
            tags: [
              "@smoke",
              "@pd30793",
              "@pd30795",
              "@pd30796",
              "@pd30797",
              "@pd30798",
              "@pd30799",
              "@pd30800",
              "@pd30801",
              "@pd30802",
              "@pd30803",
              "@pd32677",
              "@pd32685"
            ]
          },
          () => {
            users.addUser(userData.addUser, true);
          }
        );

        it(
          "should verify that the created user matches the input data",
          {
            tags: [
              "@smoke"
            ]
          },
          () => {
            users.verifyAddedUser(userData.addUser, true);
          }
        );
      }
    );

    context(
      "User Updation",
      { tags: ["@smoke","@user-updation","@manage-user", "@edit", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitUsers();
          users.viewUserList();
        });

        it(
          "should update an existing user's details in the Administration panel",
          { tags: ["@smoke","@pd32673","@pd32675","@pd32676","@pd32677"] },
          () => {
            users.searchWithFilter(userData.addUser);
            users.updateUser(userData.updateUser, true, true);
            // cy.visitUsers();
            users.searchWithFilter(userData.addUser);
            users.updateUser(userData.updateUser, false, true);
          }
        );

        it(
          "should confirm that the user's details have been updated correctly",
          {
            tags: [
              "@smoke",
              "@pd31635",
              "@pd32680",
              "@pd32681",
              "@pd32682",
              "@pd32683",
              "@pd32684",
              "@pd32685",
              "@pd32691"
            ]
          },
          () => {
            users.verifyAddedUser(userData.updateUser, true);
          }
        );
      }
    );

    context("AuditLogs and Access Logs", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("verify access Log screen", { tags: ["@pd30807", "@pd30808"] }, () => {
        users.verifyAccessLogsScreen(userData.updateUser, true);
      });

      it("verify Audit logs", { tags: "@pd30809" }, () => {
        users.verifyAccessLogsScreen(userData.updateUser, false, true, true);
      });
    });

    context("import", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("Import Users",{tags:"@pd30813"}, () => {
        users.addUsersDataImportJson(true,true);
      });

      it("Validate Import Errors",{tags:"@pd30814"},()=>{
        users.addUsersDataImportJson(false,false);
      })
    });

    context("search, sort and pagination",()=>{
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("Sort Users by Column",{tags:"@pd30804"},()=>{
        users.sortByColumns();
      })

      it("Paginate User List",{tags:"@pd30811"},()=>{
        users.clickPagination();
      })
    })

    context(
      "User Verification & Password Management",
      { tags: ["@user-account-verification","@manage-user"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitUsers();
        });

        it(
          "should allow the user to change their password",
          { tags: ["@pd32687"] },
          () => {
            users.searchWithFilter(userData.updateUser);
            users.changePassword();
          }
        );

        it(
          "should verify that the user account is accessible",
          { tags: ["@pd30269"] },
          () => {
            cy.clearAllSessionStorage();
            users.verifyUserAccount(true);
            Cypress.session.clearAllSavedSessions();
          }
        );
      }
    );
  }
);