import UrlLink from "../../../support/POM/CMSModule_PO/RcsaUrlLinkForm/RcsaUrlLinkForm";
const rcsaLinks = new UrlLink();

describe(
  "Check if the URL is working",
  {
    tags: [
      "@regression",
      "@release5.21",
      "@cms",
      "@rcsaurllinkclikable",
      "@customer",
      "@pd22355",
      "@erm",
      "@customer-space",
    ],
  },

  () => {
    beforeEach(() => {
      const userLogin = Cypress.env("USER").CBBANK;
      cy.loginWithSession(
        "loginwithsession",
        userLogin.username,
        userLogin.password,
        userLogin.key
      );
      cy.visitRcsaForm();
    });

    it(
      "should check if the URL is working and clickable on the rcsa description area",
      {
        tags: [
          "@smoke",
          "@pd33623",
          "@pd33624",
          "@pd33625",
          "@pd33626",
          "@pd33627",
          "@pd33628",
        ],
      },
      () => {
        rcsaLinks.addLinkDescription();
        rcsaLinks.submitBtn();
        rcsaLinks.createRcsaTicket();
        rcsaLinks.selectDateByDatePicker();
        rcsaLinks.saveBtn(Cypress.env("MAIN_URL2"));
        rcsaLinks.openSubTask();
        rcsaLinks.clickDesClick();
      }
    );
  }
);
