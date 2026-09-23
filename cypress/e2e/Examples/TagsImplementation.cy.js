// import KXIMenu from "../../support/POM/KXIModule/KXIMenu";

describe.skip(
  "Example test suite for Tags implementation",
  {
    tags: ["@regression", "@kxi", "@kriDefinition", "@pd22186", "@release5.17"],
  },
  () => {
    // const kXIMenu = new KXIMenu();
    // beforeEach(() => {
    //   cy.session("login - without Risk Management", () => {
    //     const withoutRM = Cypress.env("kxi").customer.withoutRM;
    //     cy.visit(Cypress.config("baseUrl"));
    //     cy.login(withoutRM.username, withoutRM.password, withoutRM.key);
    //   });
    // });

    it(
      "Sample test case for Tags implementation - Verify Data will be shown in menu options",
      {
        tags: [
          "@smoke",
          "@regression",
          "@kxi",
          "@kriDefinition",
          "@pd22186",
          "@ap2066",
          "@release5.17",
        ],
      },
      () => {
        expect(true).to.equal(true);
        // cy.visitProfile();

        // kXIMenu.clickLeftMenu();
        // kXIMenu.clickAdministration();
        // kXIMenu.verifyMenuItemAndLink("data");
      }
    );

    it(
      "Verify KxI Task Dashboard will be shown in menu options",
      { tags: ["@kxi", "@regression"] },
      () => {
        expect(true).to.equal(true);
        // cy.visitProfile();

        // kXIMenu.clickLeftMenu();
        // kXIMenu.clickAdministration();
        // kXIMenu.verifyMenuItemAndLink("kxiTaskDashboard");
        // kXIMenu.verifyPrevSibling("kxiTaskDashboard", "sbo");
      }
    );
  }
);
