import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import TakeAction from "../../../support/POM/RegChangeManagementV2-Decisions/TakeAction";

describe(
  "Take-Action: Creating and Linking of Regulatory Change against the New Feeds - Predict",
  {
    tags: [
      "@regression",
      "@pd21546",
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
    context("Take Action", { tags: ["@customer", "@pd32502"] }, () => {
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
        "Verify Action column buttons and status",
        { tags: "@pd32228" },
        () => {
          takeAction.verifyTakeActionbtns(dataFile.statusFilter[0]);
        }
      );
      it(
        "Verify When the Take-Action button is clicked, a dialog window should appear",
        { tags: "@pd32229" },
        () => {
          takeAction.clickTakeActionBtn();
        }
      );

      it(
        "Verify If the user clicks the Cancel button, the dialog window should close without creating or linking the Regulatory Change",
        { tags: "@pd32235" },
        () => {
          takeAction.clickCancelButton();
        }
      );
      it(
        "Verify user should be allowed to Create Regulatory Change on selected Reg Feed",
        { tags: "@pd32230" },
        () => {
          takeAction.createRegChange();
        }
      );
      it("Verify Link Workflow", { tags: ["@pd32233", "@pd32234"] }, () => {
        takeAction.clickLinkButton(
          dataFile.regChangeName,
          dataFile.toastMsg,
          true
        );
        takeAction.validationAfterLinking(customerUser.USERNAME);
      });
      it(
        "Verify clicking on 'Link' button without selecting document gives error message",
        { tags: "@pd33652" },
        () => {
          takeAction.clickLinkButton(
            dataFile.regChangeName,
            dataFile.failedMsg
          );
        }
      );
    });
  }
);
