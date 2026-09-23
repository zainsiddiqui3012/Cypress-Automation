import UserGroup from "../../support/POM/Administration/UserGroup";

describe(
  "E2E Automation of User Groups From None Space",
  {
    tags: [
      "@pd32036",
      "@administration",
      "@none-space",
      "@user-group",
      "@user-groups",
      "@regression",
      "@erm"
    ],
  },
  () => {
    const userGroup = new UserGroup();
    context("None Space User Group Operations", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitUserGroup();
        cy.waitForTopMsgLoaderToDisappear(50000);
      });

      it("View User Groups", { tags: ["@smoke", "@pd32279"] }, () => {
        userGroup.userGroupListDisplay();
      });

      it(
        "Verify Mandatory Fields",
        { tags: ["@smoke", "@pd32282", "@pd32298"] },
        () => {
          userGroup.clickAddUserGroupBtn();
          userGroup.checkMandatoryFieldsError();
        }
      );

      it(
        "add New User Group",
        {
          tags: [
            "@smoke",
            "@add",
            "@pd32280",
            "@pd32281",
            "@pd32301",
            "@pd32302",
            "@pd32303",
            "@pd32304"
          ],
        },
        () => {
          userGroup.addUserGroup();
        }
      );

      it(
        "verify Added User Group details",
        { tags: ["@smoke", "@pd32294"] },
        () => {
          userGroup.verifyUserGroup("addUserGroup");
        }
      );

      it("Paginate User Groups List", { tags: ["@pd32286"] }, () => {
        userGroup.paginatedUserGroup();
      });

      it("Sort User Group List", () => {
        userGroup.sortWithName();
      });

      it(
        "Verify newly craeted User Group Audit Logs",
        { tags: "@pd32284" },
        () => {
          userGroup.verifyAuditLogs("addUserGroup");
        }
      );

      it(
        "update Existing UserGroup",
        {
          tags: [
            "@smoke",
            "@edit",
            "@pd32299",
            "@pd32295",
            "@pd32296",
            "@pd32297"
          ],
        },
        () => {
          userGroup.updateUserGroup();
        }
      );

      it("verify Updated User Details", { tags: "@smoke" }, () => {
        userGroup.verifyUserGroup("updateUserGroup");
      });

      it("verify updated User Group Audit Logs", () => {
        userGroup.verifyAuditLogs("updateUserGroup");
      });
    });
  }
);

describe(
  "E2E Automation of User Groups From Customer Space",
  {
    tags: [
      "@pd32060",
      "@customer-space",
      "@administration",
      "@user-group",
      "@user-groups",
      "@regression",
      "@erm"
    ],
  },
  () => {
    const userGroup = new UserGroup();
    context("Customer Space User Group Operations", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Customer Space User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitUserGroup();
        cy.waitForTopMsgLoaderToDisappear(50000);
      });

      it(
        "Verify Mandatory Fields",
        { tags: ["@pd31073", "@pd31075", "@pd31091"] },
        () => {
          userGroup.checkMandatoryFieldsError();
        }
      );

      it("View User Groups", { tags: ["@pd31072"] }, () => {
        userGroup.userGroupListDisplay();
      });

      it("Add New User Group", { tags: ["@pd31074", "@pd31092"] }, () => {
        userGroup.addUserGroup(true);
      });

      it(
        "verify Added User Group details",
        { tags: ["@pd31087"] },
        () => {
          userGroup.verifyUserGroup("addUserGroup", true);
        }
      );

      it("Paginate User Groups List", { tags: ["@pd31079"] }, () => {
        userGroup.paginatedUserGroup();
      });

      it("Sort User Group List", () => {
        userGroup.sortWithName();
      });

      it(
        "View Audit Log for newly created User group",
        { tags: ["@pd31077"] },
        () => {
          userGroup.verifyAuditLogs("addUserGroup");
        }
      );

      it(
        "Edit Existing User Group",
        { tags: ["@pd31088", "@pd31089", "@pd31090", "@pd31092"] },
        () => {
          userGroup.updateUserGroup(true);
        }
      );

      it(
        "verify Updated User Details",
        { tags: ["@pd31087"] },
        () => {
          userGroup.verifyUserGroup("updateUserGroup", true);
        }
      );

      it(
        "View Audit Log for Updated User group",
        { tags: ["@pd31077"] },
        () => {
          userGroup.verifyAuditLogs("updateUserGroup", true);
        }
      );
    });
  }
);
