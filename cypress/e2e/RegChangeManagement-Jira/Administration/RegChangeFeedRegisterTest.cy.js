import Reseller from "../../../support/POM/Administration/Reseller";
import Customer from "../../../support/POM/Administration/Customer";
import regAdministration from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeAdminstration.json";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
describe(
  "Verify RegChange Feed Register screen TestCases",
  {
    tags: [
      "@pd36238",
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
    const menu = new RegChangeV2Menu();
    const feedRegister = new FeedRegister();
    const feedRegistersUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
    const feedRegisterReseller = Cypress.env("REG_CHANGE_V2").RESELLER;
    const noneUser = Cypress.env("kxi").none;
    context("Verify Kaia for Compliance Module", () => {
      beforeEach(() => {
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.visit(Cypress.config("baseUrl"));
      });

      it(
        "Verify that Kaia for Compliance module is unchecked",
        { tags: ["@none"] },
        () => {
          cy.login(noneUser.username, noneUser.password, noneUser.key);
          cy.visitCustomer();
          cy.visit(regAdministration.fnbaURL);
          customer.verifyKaiaForComplianceChecked(false);
        }
      );

      it(
        "Verify that Kaia for Compliance module is checked",
        { tags: ["@none"] },
        () => {
          cy.login(noneUser.username, noneUser.password, noneUser.key);
          cy.visitCustomer();
          cy.visit(regAdministration.fnbaURL);
          customer.verifyKaiaForComplianceChecked(true);
        }
      );
      it("Verify that Kaia column should be showing on Feed Register screen", () => {
        cy.login(
          feedRegistersUser.USERNAME,
          feedRegistersUser.PASSWORD,
          feedRegistersUser.KEY
        );
        cy.visitProfile();
        menu.clickLeftMenu();
        menu.verifyMenuItemAndClick(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
        cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").longWait);
        cy.waitForLoaderToDisappear(
          "agGrid-RegChange",
          Cypress.env("waits").longWait
        );
        feedRegister.isKaiaColumnVisible();
      });
    });

    context(
      "Verify that 'Regulatory Change Management' is hidden and 'Kaia for Compliance' is present from none user",
      { tags: ["@none"] },
      () => {
        beforeEach(() => {
          cy.clearAllCookies();
          cy.ignoreNetworkLogs();
          cy.loginWithSession(
            "None User session for RegChange-v2 Jira",
            noneUser.username,
            noneUser.password,
            noneUser.key
          );
        });
        it("Should verify Regulatory Change Mangeement is not visible when user selects the Compliance Management module on Edit Reseller screen", () => {
          reseller.searchResellerName(regAdministration.resellerName);
          reseller.clicksOnFirstResellerName();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName
          );
        });

        it("Should verify Regulatory Change Mangeement is not visible when user selects the Compliance Management module on Add Reseller screen", () => {
          cy.visitReseller();
          reseller.clickAddUserBtn();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName
          );
        });

        it("Should verify Regulatory Change Mangeement is not visible when user selects the Compliance Management module on Edit Customer screen", () => {
          customer.searchCustomerName(
            regAdministration.customerNameForRegChange
          );
          customer.clicksOnFirstCustomerName();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName,
            true
          );
        });

        it("Should verify Regulatory Change Mangeement is not visible when user selects the Compliance Management module on Add Customer screen", () => {
          cy.visitCustomer();
          reseller.clickAddUserBtn();
          customer.selectReseller(regAdministration.resellerName);
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName,
            true
          );
        });

        it("Should verify Regulatory Change Mangeement is not visible when user selects the Compliance Management module on Edit Customer screen", () => {
          customer.searchCustomerName(
            regAdministration.customerNameForRegChange
          );
          customer.clicksOnFirstCustomerName();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName,
            true
          );
        });
      }
    );
    context(
      "Verify that 'Regulatory Change Management' is hidden and 'Kaia for Compliance' is present from reseller space",
      { tags: ["@reseller"] },
      () => {
        beforeEach(() => {
          cy.clearAllCookies();
          cy.ignoreNetworkLogs();
          cy.loginWithSession(
            "Reseller User session for RegChange-v2 Jira",
            feedRegisterReseller.USERNAME,
            feedRegisterReseller.PASSWORD,
            feedRegisterReseller.KEY
          );
          cy.visitCustomer();
        });
        it("Verify that 'Regulatory Change Management' is not visible and 'Kaia for Compliance' is present on the Edit Customer screen", () => {
          customer.clicksOnFirstCustomerName();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName,
            true
          );
          customer.verifyKaiaForComplianceChecked(true);
        });
        it("Verify that 'Regulatory Change Management' is not visible and 'Kaia for Compliance' is present on the Add Customer screen", () => {
          reseller.clickAddUserBtn();
          reseller.verifyRegulatoryChangeManagementNotVisible(
            regAdministration.parentModuleName,
            regAdministration.subModuleName,
            true
          );
          customer.verifyKaiaForComplianceModuleVisible();
        });
      }
    );
  }
);
