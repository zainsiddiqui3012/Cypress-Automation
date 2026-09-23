import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import TakeAction from "../../../support/POM/RegChangeManagementV2-Decisions/TakeAction";

describe(
  "Update Reg Feeds in Regulatory Change on Decision Platform",
  {
    tags: [
      "@regression",
      "@pd21547",
      "@cms",
      "@regchangev2",
      "@feedregister",
      "@release5.21",
      "@decision",
    ],
  },
  () => {
    const takeAction = new TakeAction();
    const menu = new RegChangeV2Menu();
    const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
    context("Update Reg Feeds", { tags: ["@customer", "@pd33669"] }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "Login with Reg Change V2 customer user",
          customerUser.USERNAME,
          customerUser.PASSWORD,
          customerUser.KEY
        );
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
      });
      it(
        "Verify Update functionality in Action Column",
        { tags: ["@pd33633", "@pd33634", "@pd33635", "@pd33636", "@pd33653"] },
        () => {
          takeAction.validateUpdateFunctionality();
        }
      );
    });
  }
);
