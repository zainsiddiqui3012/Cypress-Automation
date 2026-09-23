import KXIMenu from "../../support/POM/KXIModule/KXIMenu";

describe(
  "Menu Changes for KxI (Lumify) without Risk Management",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@pd22186",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context(
      "Menu Changes for KxI (Lumify) without Risk Management",
      { tags: ["@withoutRM"] },
      () => {
        const kXIMenu = new KXIMenu();
        const withoutRM = Cypress.env("kxi").customer.withoutRM;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM.username}`,
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );
        });

        it("Verify Data will be shown in menu options", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("data");
        });

        it("Verify KxI Task Dashboard will be shown in menu options", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("kxiTaskDashboard");
          kXIMenu.verifyPrevSibling("kxiTaskDashboard", "sbo");
        });

        it("Verify Insights will be shown in menu options below Kxi Task Dashboard.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("insights");
          kXIMenu.verifyPrevSibling("insights", "kxiTaskDashboard");
        });

        it("Verify Power BI will be shown in menu options below the Insights.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("powerBIReporting");
          kXIMenu.verifyPrevSibling("powerBIReporting", "insights");
        });

        it("Verfiy Administration option will be shown in menu options below the Power BI.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("administration");
          kXIMenu.verifyPrevSibling("administration", "powerBIReporting");
        });

        it("Verify Organization Hierarchy will be shown under Administration in menu options.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("orgHierarchy");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Roles will be shown under Administration in menu options below Organization Hierarchy.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("roles");
          kXIMenu.verifyPrevSibling("roles", "orgHierarchy");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify User Groups will be shown under Administration in menu options below the Roles", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("userGroups");
          kXIMenu.verifyPrevSibling("userGroups", "roles");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Users will be shown under Administration in menu options below the user groups.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("users");
          kXIMenu.verifyPrevSibling("users", "userGroups");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Customer Profile will be shown under Administration in menu options below Users.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("customerProfile");
          kXIMenu.verifyPrevSibling("customerProfile", "users");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify KxI Categories will be shown under Administration in menu options below customer profile.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("kxICategories");
          kXIMenu.verifyPrevSibling("kxICategories", "customerProfile");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Risk Appetite will be shown under Administration in menu options below KxI Categories.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("riskAppetite");
          kXIMenu.verifyPrevSibling("riskAppetite", "kxICategories");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Define KxIs  will be shown under Administration in menu options below Risk Appetite.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("defineKxIs");
          kXIMenu.verifyPrevSibling("defineKxIs", "riskAppetite");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });

        it("Verify Peer Banks will be shown under Administration in menu options below the Define KxIs.", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyMenuItemAndLink("peerBanks");
          kXIMenu.verifyPrevSibling("peerBanks", "defineKxIs");
          kXIMenu.verifyPrentAdministration("orgHierarchy");
        });
      }
    );

    context(
      "Menu Changes for KxI (Lumify) without Risk Management and Peer Banks",
      { tags: ["@withRM"] },
      () => {
        const kXIMenu = new KXIMenu();
        const withoutRM_PEER = Cypress.env("kxi").customer.withoutRM_PEER;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });

        it("Verify Data will be shown in menu options", () => {
          cy.visitProfile();

          kXIMenu.clickLeftMenu();
          kXIMenu.clickAdministration();
          kXIMenu.verifyPeerBankNotPresent();
        });
      }
    );
  }
);
