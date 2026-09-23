import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";

describe(
  "Scope Missing | Audit log isn't showing for KRI data for FRED series which is added through scheduler service.",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd22308",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const fredDefinition = "Real Gross Domestic Product";
    context(
      "Verify KXI data Audit Log for KxI (Lumify) without Risk Management with Peer Banks",
      { tags: ["@withoutRM"] },
      () => {
        const kxiData = new KXI_POM();
        const predictMenu_PO = new PredictMenu_PO();
        const withoutRM = Cypress.env("kxi").customer.withoutRM;
        beforeEach(() => {
           cy.loginWithSession(
             "login - decisions",
             withoutRM.username,
             withoutRM.password,
             withoutRM.key
           );
        });

        it("Verify Audit logs are showing for Fred KXI Data on Lumify", () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          kxiData.kxiDataMenu();
          kxiData.auditLogBtn(fredDefinition);
        });
      }
    );

    context("KXI data Audit Logs for RM", { tags: ["@withRM"] }, () => {
      const kxiData = new KXI_POM();
      const predictMenu_PO = new PredictMenu_PO();
      beforeEach(() => {
        cy.session("login - without Risk Management and Peer Banks", () => {
          const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
          cy.visit(Cypress.config("baseUrl"));
          cy.login(
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
      });
      it("Verify Audit logs are showing for Fred KXI Data on ERM", () => {
        cy.visitProfile();

        predictMenu_PO.menuClick();
        kxiData.kxiManagement();
        kxiData.kxiDataMenu();
        kxiData.auditLogBtn(fredDefinition);
      });
    });
  }
);
