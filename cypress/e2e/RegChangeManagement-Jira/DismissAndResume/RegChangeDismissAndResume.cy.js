import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import FeedRegister from "../../../support/POM/RegChangeManagementV2-Decisions/FeedRegister";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Jira/RegChangeMenu.json";
import feed from "../../../fixtures/RegChangeManagementV2-Decisions/FeedRegister.json";

describe(
  "Option to Dismiss all the new Feeds, Resume the dismissed Feed.",
  {
    tags: [
      "@regression",
      "@pd21549",
      "@jira",
      "@regchange",
      "@regchangefeedregister",
      "@release5.21",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const regchangeV2Menu = new RegChangeV2Menu();
    const feedRegister = new FeedRegister();
    context("RegChange Feed Register", () => {
      beforeEach(() => {
        const regchangeUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
        cy.clearAllCookies();
        cy.ignoreNetworkLogs();
        cy.loginWithSession(
          "Reg Change Feed Register User session",
          regchangeUser.USERNAME,
          regchangeUser.PASSWORD,
          regchangeUser.KEY
        );
        regchangeV2Menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.feedRegister
        );
      });

      it(
        "Verify The 'Dismiss All Selected' option should allow users to dismiss multiple items at once by selecting checkboxes",
        { tags: ["@pd36055", "@pd36056", "@pd36057", "@pd36058", "@pd36063"] },
        () => {
          feedRegister.verifyDismissResumeButtons();
          feedRegister.dismissFeed();
          feedRegister.enterReason(
            feed.dismissReason,
            feed.dismissSuccessMessage
          );
        }
      );

      it(
        "Verify The 'Resume' button should be enabled for dismissed feeds to allow restoration",
        { tags: ["@pd36059", "@pd36060", "@pd36062", "@pd36063"] },
        () => {
          feedRegister.selectDismissFromGeneralFilter();
          feedRegister.enterResumeReason(
            feed.resumeReason,
            feed.resumeSuccessMessage
          );
        }
      );
    });
  }
);
