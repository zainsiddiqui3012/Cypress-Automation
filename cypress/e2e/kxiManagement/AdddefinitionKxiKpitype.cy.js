import kxiManagements from "../../support/POM/kxiManagement_PO/AdddefinitionKxiKpitype.js";
const data = require("../../fixtures/kxiManagement/AdddefinitionKxiKpitype.json");
describe(
  "Kxi mangement Add Definition Kxi Kpi type",
  {
    tags: [
      "@release5.21",
      "@pd25240",
      "@KxiManagement",
      "@addDefinition",
      "@Kxi",
      "@Kpi",
      "@regression",
      "@erm",
    ],
  },
  () => {
    const kxi = new kxiManagements();
    // const kxiManagements = new kxiManagements();
    beforeEach(() => {
      cy.loginWithSession(
        "login with KXI Management User",
        Cypress.env("USER").Kxi_Customer.USERNAME,
        Cypress.env("USER").Kxi_Customer.PASSWORD,
        Cypress.env("USER").Kxi_Customer.KEY
      );
    });
    it(
      "Performs Notification Settings Operations",
      {
        tags: ["@smoke"],
      },
      () => {
        //Step1: Add KXi Definition
        cy.visitkxiDef();
        //Edit Kxi Definition
        kxi.clickonNameColoumnKri1();
        kxi.editDef();
        //Add kri Sibling
        kxi.addKrichild();
        //Add kri Sibling
        kxi.addKriSibling();
        //Save Kri Definition
        kxi.SaveKriDef();
        // Visit Kxi Definition page
        cy.visitkxiDef();
        //Reload Kxi definition page
        kxi.reloadPage();
        //Edit Kxi Definition
        kxi.clickonNameColoumnKri2();
        kxi.editDef();
        //Add kri child
        kxi.addKrichild1();
        //Add kri Siblin
        kxi.addKriSibling1();
        //Save Kri Definition
        kxi.SaveKriDef();
        //Error sholud popup because of wrong child and sibling
        kxi.cancelMessage();
        //Cancel button and case successful
        kxi.cancelButton();
        //Reload Kxi definition page
        kxi.reloadPage();
        //Edit Kxi Definition
        kxi.clickonNameColoumnKpi1();
        kxi.editDef();
        //Edit kpi Child
        kxi.addKpichild1();
        //Edit kpi Sibling
        kxi.addKpiSibling1();
        //Save Kri Definition
        kxi.SaveKriDef();
        //reload Kxi definition page
        kxi.reloadPage();
        //Edit kpi Definition
        kxi.clickonNameColoumnKpi2();
        kxi.editDef();
        //Add kpi child
        kxi.addKpichild2();
        //Add kpi Sibling
        kxi.addKpiSibling2();
        //Save Kri Definition
        kxi.SaveKriDef();
        //Error sholud popup because of wrong child and sibling
        kxi.cancelMessage();
        //Cancel button and case successful
        kxi.cancelButton();
        //Reload Kxi definition page
        kxi.reloadPage();
      }
    );
  }
);