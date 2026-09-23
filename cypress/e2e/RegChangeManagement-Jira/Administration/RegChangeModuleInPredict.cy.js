import Reseller from "../../../support/POM/Administration/Reseller";
import Customer from "../../../support/POM/Administration/Customer";
import regAdministration from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeAdminstration.json";

describe(
  "Verify RegChange Feed Register Module Present in Reseller and Customer screen in Predict",
  {
    tags: [
      "@regression",
      "@pd34468",
      "@jira",
      "@regchange",
      "@regchangefeedregister",
      "@release5.21",
      "@predict",
    ],
  },
  () => {
    const reseller = new Reseller();
    const customer = new Customer();
    context("RegChange Module in Predict with none space", () => {
      beforeEach(() => {
        const noneUser = Cypress.env("kxi").none;
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.loginWithSession(
          "None User session",
          noneUser.username,
          noneUser.password,
          noneUser.key
        );
      });

      it("Verify that the 'Regulatory Change Feed Register' module appears on the Add Reseller screen after selecting the 'Compliance Management System' module on None Space", () => {
        cy.visitReseller();
        reseller.clickAddUserBtn();
        reseller.clicksOnComplianceManagementModule();
        reseller.verifyRegulatoryChangeFeedRegisterModuel();
      });

      it("Verify that the 'Regulatory Change Feed Register' module appears on the Edit Reseller screen after selecting the 'Compliance Management System' module on None Space", () => {
        cy.visitReseller();
        reseller.clicksOnFirstReseller();
        reseller.clicksOnComplianceManagementModule();
        reseller.verifyRegulatoryChangeFeedRegisterModuel();
      });

      it("Verify that the 'Regulatory Change Feed Register' module appears on the Add Customer screen on None Space", () => {
        cy.visitCustomer();
        reseller.clickAddUserBtn();
        customer.selectReseller(regAdministration.resellerName);
        reseller.clicksOnComplianceManagementModule();
        reseller.verifyRegulatoryChangeFeedRegisterModuel();
      });
    });
    context("RegChange Module in Predict with Reseller space", () => {
      beforeEach(() => {
        const regchangeReseller = Cypress.env("REG_CHANGE_V2").RESELLER;
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.loginWithSession(
          "Reseller User of Regulatroy Change",
          regchangeReseller.USERNAME,
          regchangeReseller.PASSWORD,
          regchangeReseller.KEY
        );
      });
      it("Verify that the 'Regulatory Change Feed Register' module appears on the Add Customer screen after selecting the 'Compliance Management System' module on Reseller Space", () => {
        cy.visitCustomer();
        reseller.clickAddUserBtn();
        reseller.clicksOnComplianceManagementModule();
        reseller.verifyRegulatoryChangeFeedRegisterModuel();
      });

      it("Verify that the 'Regulatory Change Feed Register' module appears on the Edit Customer screen after selecting the 'Compliance Management System' module on Reseller Space", () => {
        cy.visitCustomer();
        customer.clicksOnFirstCustomerName();
        reseller.clicksOnComplianceManagementModule();
        reseller.verifyRegulatoryChangeFeedRegisterModuel();
      });
    });
  }
);
