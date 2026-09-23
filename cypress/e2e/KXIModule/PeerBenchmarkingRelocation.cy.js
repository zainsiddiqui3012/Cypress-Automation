import locators from "../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import bench from "../../fixtures/KXIModule/PeerBenchMarking.json";
import KXI_POM from "../../support/POM/KXIModule/KxI_POM";

describe(
  "Peer Benchmarking relocation on Customer/Reseller screen on None/Reseller space - PD-19376",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@peer-banks",
      "@pd22249",
      "@release5.17",
      "@predict",
    ],
  },
  () => {
    const predictMenu_PO = new PredictMenu_PO();
    const KXI = new KXI_POM();

    bench.forEach((test) => {
      it(test.ResellerScreen, { tags: ["@none"] }, () => {
        cy.visit(Cypress.config("baseUrl"));
        const config = Cypress.env("kxi").none;
        cy.login(config.username, config.password, config.key);

        predictMenu_PO.menuClick();
        cy.get(locators.menu.administration).click();
        cy.get(locators.menu.Reseller).click();
        cy.get(locators.administration.organizationalHierarchy.addBtn).click();

        KXI.CheckPeerBranching();
      });

      it(test.ResellerEditScreen, { tags: ["@none"] }, () => {
        cy.visit(Cypress.config("baseUrl"));
        const config = Cypress.env("kxi").none;
        cy.login(config.username, config.password, config.key);

        predictMenu_PO.menuClick();
        cy.get(locators.menu.administration).click();
        cy.get(locators.menu.Reseller).click();

        KXI.SelectReseller();

        cy.get(locators.administration.resellers.Submodule).should(
          "not.contain",
          "Peer Benchmarking"
        );
        cy.get(locators.administration.resellers.KxiSubmodule).should(
          "contain",
          "Peer Benchmarking"
        );
      });

      it(test.CustomerScreen, { tags: ["@none"] }, () => {
        cy.visit(Cypress.config("baseUrl"));
        const config = Cypress.env("kxi").none;
        cy.login(config.username, config.password, config.key);

        predictMenu_PO.menuClick();
        cy.get(locators.menu.administration).click();
        cy.get(locators.menu.Customer).click();
        cy.get(locators.administration.organizationalHierarchy.addBtn).click();

        KXI.SelectResellerFromCustomer();
        KXI.CheckPeerBranching();
      });

      it(test.ExistingCustomer, { tags: ["@none"] }, () => {
        cy.visit(Cypress.config("baseUrl"));
        const config = Cypress.env("kxi").none;
        cy.login(config.username, config.password, config.key);

        predictMenu_PO.menuClick();
        cy.get(locators.menu.administration).click();
        cy.get(locators.menu.Customer).click();

        KXI.SelectCustomer();

        cy.get(locators.administration.resellers.Submodule).should(
          "not.contain",
          "Peer Benchmarking"
        );
        cy.get(locators.administration.resellers.KxiSubmodule).should(
          "contain",
          "Peer Benchmarking"
        );
      });

      it(test.ResellerSpace, { tags: ["@reseller"] }, () => {
        cy.visit(Cypress.config("baseUrl"));
        const config = Cypress.env("kxi").reseller;
        cy.login(config.username, config.password, config.key);

        predictMenu_PO.menuClick();
        cy.get(locators.menu.administration).click();
        cy.get(locators.menu.Customer).click();
        cy.get(locators.administration.organizationalHierarchy.addBtn).click();

        // KXI.SelectResellerFromCustomer();
        KXI.CheckPeerBranching();
      });
    });
  }
);
