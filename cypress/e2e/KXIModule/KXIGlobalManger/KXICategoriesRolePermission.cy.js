import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";

describe(
  "KXI Engine Administration Section Role",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@role",
      "@kxi-engine",
      "@pd20899",
      "@release5.17",
      "@predict",
    ],
  },
  () => {
    context(
      "KXI Engine Administration Section Role on None Space",
      { tags: ["@none"] },
      () => {
        const kxiData = new KXI_POM();
        const predictMenu_PO = new PredictMenu_PO();
        const withoutRM = Cypress.env("kxi").none;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM.username}`,
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );
        });

        it("Verify Categories Role permission on none space", () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          kxiData.lumifyAdmin();
          kxiData.selectRoles();
          kxiData.addRolebtn();
          kxiData.verifyCategories();
        });
      }
    );

    context(
      "KXI Engine Administration Section Role on Reseller Space",
      { tags: ["@reseller"] },
      () => {
        const kxiData = new KXI_POM();
        const predictMenu_PO = new PredictMenu_PO();
        const withoutRM_PEER = Cypress.env("kxi").reseller;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
        it("Verify Categories Role permission on Reseller space", () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          kxiData.lumifyAdmin();
          kxiData.selectRoles();
          kxiData.addRolebtn();
          kxiData.selectCustomerFromRole();
          cy.waitForTopMsgLoaderToDisappear(80000);
          kxiData.verifyCategories();
        });
      }
    );
    context(
      "KXI Engine Administration Section Role on Customer Space",
      { tags: ["@customer"] },
      () => {
        const kxiData = new KXI_POM();
        const predictMenu_PO = new PredictMenu_PO();
        const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });

        it("Verify Categories Role permission on Customer space", () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          kxiData.lumifyAdmin();
          kxiData.selectRoles();
          kxiData.addRolebtn();
          kxiData.verifyCategories();
        });
      }
    );
  }
);
