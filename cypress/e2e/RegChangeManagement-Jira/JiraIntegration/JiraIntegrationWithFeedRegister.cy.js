import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import TakeAction from "../../../support/POM/RegChangeManagementV2-Decisions/TakeAction";

describe(
  "Regulatory Change Feed Register Predict Integration with JIRA",
  {
    tags: [
      "@regression",
      "@pd34470",
      "@pd35410",
      "@jira",
      "@regchange",
      "@regchangefeedregister",
      "@release5.21",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const takeAction = new TakeAction();
    const menu = new RegChangeV2Menu();
    const feedRegister = new FeedRegister();
    const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
    context("Take Action", () => {
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
          takeAction.verifyTakeActionbtns(
            dataFile.statusFilter[0],
            dataFile.title[1]
          );
        }
      );
      it(
        "Verify When the Take-Action button is clicked, a dialog window should appear",
        { tags: "@pd32229" },
        () => {
          takeAction.clickTakeActionBtn(dataFile.title[1]);
        }
      );

      it(
        "Verify user should be allowed to Create Regulatory Change on selected Reg Feed",
        { tags: "@pd32230" },
        () => {
          takeAction.createRegChange(dataFile.title[1]);
        }
      );
// The remaining tests are skipped because they are not ready yet and will be implemented in future sprints.
      it.skip("Verify 'New' Status on Feed Register", () => {
        feedRegister.verifyGeneralFilters(dataFile.generalFilters[1]);
        feedRegister.searchTitleInGrid(dataFile.title[1])
        takeAction.verifyStatus(dataFile.statusFilter[1]);
        takeAction.verifyAssignee(dataFile)

      });
      it.skip(
        "Verify Link Workflow",
        { tags: ["@pd32233", "@pd32234"] },
        () => {
          takeAction.clickLinkButton(
            dataFile.regChangeName,
            dataFile.toastMsg,
            true
          );
          takeAction.validationAfterLinking(customerUser.USERNAME);
        }
      );
      it.skip(
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
