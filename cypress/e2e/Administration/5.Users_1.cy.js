import Users from "../../support/POM/Administration/Users";
import userData from "../../fixtures/Administration/Users.json";

const users = new Users();

describe(
  "E2E Automation of Users from None Space",
  {
    tags: [
      "@pd30145",
      "@administration-users",
      "@users",
      "@none-space-users",
      "@administration",
      "@none-space",
      "@regression"
    ]
  },
  () => {
    context(
      "User Creation",
      { tags: ["@smoke","@pd32405", "@user-creation", "@manage-user", "@add", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitUsers();
          users.viewUserList();
        });

        it(
          "should display validation errors when saving an empty user form",
          { tags: ["@smoke", "@pd30146", "@pd32407", "@pd32418", "@pd32688"] },
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
              "@pd30147",
              "@pd32406",
              "@pd32415",
              "@pd32410",
              "@pd32408",
              "@pd32413",
              "@pd32546",
              "@pd32544",
              "@pd32545",
              "@pd32547",
              "@pd32677",
              "@pd32685"
            ]
          },
          () => {
            users.addUser(userData.addUser);
          }
        );

        it(
          "should verify that the created user matches the input data",
          {
            tags: [
              "@smoke",
              "@pd30149",
              "@pd32411",
              "@pd32414",
              "@pd32667",
              "@pd32668",
              "@pd32926",
              "@pd32673",
              "@pd32675",
              "@pd32691",
              "@pd33391"
            ]
          },
          () => {
            users.verifyAddedUser(userData.addUser);
          }
        );
      }
    );

    context(
      "User Updation",
      { tags: ["@user-updation","@manage-user", "@edit", "@listing"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitUsers();
          users.viewUserList();
        });

        it(
          "should update an existing user's details in the Administration panel",
          { tags: ["@pd30266", "@pd32684", "@pd32685"] },
          () => {
            users.searchWithFilter(userData.addUser)
            users.updateUser(userData.updateUser, true);
            // cy.visitUsers();
            users.searchWithFilter(userData.addUser);
            users.updateUser(userData.updateUser);
          }
        );

        it(
          "should confirm that the user's details have been updated correctly",
          {
            tags: [
              "@pd30267",
              "@pd32676",
              "@pd32679",
              "@pd32680",
              "@pd32681",
              "@pd32682",
              "@pd32683",
              "@pd32691",
              "@pd33391"
            ]
          },
          () => {
            users.verifyAddedUser(userData.updateUser);
          }
        );
      }
    );

    context("AuditLogs and Access Logs", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("verify access Log screen", { tags: ["@pd33465", "@pd33466"] }, () => {
        users.verifyAccessLogsScreen(userData.updateUser, true);
      });

      it("verify Audit logs", { tags: "@pd33467" }, () => {
        users.verifyAccessLogsScreen(userData.updateUser, false, true);
      });
    });

    context("import", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("Import Users", {tags:"@pd33468"}, () => {
        users.addUsersDataImportJson(true,true);
      });

      it("Validate Import Errors",{tags:"@pd33469"},()=>{
        users.addUsersDataImportJson(false,false);
      })
    });

    context("search, sort and pagination",()=>{
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitUsers();
        users.viewUserList();
      });

      it("Sort Users by Column",{tags:"@pd33472"},()=>{
        users.sortByColumns();
      })

      it("Paginate User List",{tags:"@pd33473"},()=>{
        users.clickPagination();
      })
    })

    context(
      "User Verification & Password Management",
      { tags: ["@user-account-verification","@manage-user"] },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
          cy.visitUsers();
        });

        it(
          "should allow the user to change their password",
          { tags: ["@pd30268", "@pd32687"] },
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
            users.verifyUserAccount();
            Cypress.session.clearAllSavedSessions();
          }
        );
      }
    );
  }
);