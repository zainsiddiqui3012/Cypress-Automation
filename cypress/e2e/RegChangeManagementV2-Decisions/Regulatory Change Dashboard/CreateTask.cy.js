import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/CreateTask.json";
import CreateTask from "../../../support/POM/RegChangeManagementV2-Decisions/CreateTask";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";

describe(
  "Incorporate Task Module in Regulatory Change Management",
  {
    tags: [
      "@regression",
      "@pd21516",
      "@cms",
      "@regchangev2",
      "@regchangedashboard",
      "@release5.21",
      "@decision",
    ],
  },
  () => {
    const createTask = new CreateTask();
    const menu = new RegChangeV2Menu();
    context("Regulatory Change Dashbord", { tags: "@customer"}, () => {
      beforeEach(() => {
        const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
        cy.loginWithSession(
          "Login with Reg Change V2 customer user",
          customerUser.USERNAME,
          customerUser.PASSWORD,
          customerUser.KEY
        );
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.regChangeDashboard
        );
      });
      it(
        "Verify Regulatory change feed should be displayed on Regulatory Change Feed Register",
        { tags: "@pd31273" },
        () => {
          createTask.validateTaskButtonOnDashboard();
          createTask.verifyTaskAndStatusOfTaskDecision();
        }
      );
    });
  }
);
