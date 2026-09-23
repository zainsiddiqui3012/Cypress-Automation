import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import TakeAction from "../../../support/POM/RegChangeManagementV2-Decisions/TakeAction";

describe(
  "View from Reg Feed Title, Regulatory Change and Child form Column on Reg Feed Register - Predict",
  {
    tags: [
      "@regression",
      "@pd21548",
      "@cms",
      "@regchangev2",
      "@feedregister",
      "@release5.21",
      "@predict",
    ],
  },
  () => {
    const takeAction = new TakeAction();
    const menu = new RegChangeV2Menu();
    const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
    context("Update Reg Feeds", { tags: ["@customer", "@pd34370"] }, () => {
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
        "Verify The Title Column in the Regulatory Change Feed Register should display the title of the Reg Feed",
        { tags: ["@pd33810", "@pd33812"] },
        () => {
          takeAction.clickTitle();
        }
      );
      it(
        "Verify on clicking View Regulatory Change link should open the Regulatory Change in the decision platform.",
        { tags: ["@pd33813", "@pd34281"] },
        () => {
          takeAction.clickRegChangeView();
        }
      );
    });
  }
);
