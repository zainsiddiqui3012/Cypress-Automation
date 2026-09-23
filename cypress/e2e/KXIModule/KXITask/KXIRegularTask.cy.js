import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import KXIMenu from "../../../support/POM/KXIModule/KXIMenu";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import KxIDefinition from "../../../support/POM/KXIModule/KxIDefinition";
import KXIDefinition from "../../../fixtures/KXIModule/KXIDefinition.json";
import KXIData from "../../../fixtures/KXIModule/KXIData.json";
import KXIRegularTasks from "../../../fixtures/KXIModule/KXIRegularTasks.json";
import KxiData from "../../../support/POM/KXIModule/KxIData";
import KXIRegularTask from "../../../support/POM/KXIModule/KXITask/KXIRegularTask";
import KXIRegularTaskSummary from "../../../support/POM/KXIModule/KXITask/KXIRegularTaskSummary";
describe(
  "Verify the Regular Task Feature",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21995",
      "@release5.19",
      "@decision",
      "@customer",
    ],
  },
  () => {
    const loginDetails_PO = new LoginDetails_PO();
    const kxiMenu = new KXIMenu();
    const kxiPom = new KXI_POM();
    const KxiDefinition = new KxIDefinition();
    const kxiData = new KxiData();
    const kxiRegularTask = new KXIRegularTask();
    const kxiRegularTaskSummary = new KXIRegularTaskSummary();
    const withoutRM = Cypress.env("kxi").customer.decision;

    beforeEach(() => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withoutRM.username, withoutRM.password, withoutRM.key);

      kxiMenu.clickLeftMenu();
      kxiPom.kxiManagement();
      kxiPom.defineKxi();
      kxiPom.addkxi();

      KxiDefinition.selectDataEntryType(KXIDefinition.dataEntryType);
      const kxiDefinitionNameWithTimestamp = KxiDefinition.addKxIDefinitionInfo(
        KXIDefinition.kxiDefinitionId,
        KXIDefinition.kxiDefinitionName,
        KXIDefinition.kxiDescription
      );
      Cypress.env("kxiDefinitionName", kxiDefinitionNameWithTimestamp);
      KxiDefinition.selectOwner(withoutRM.username);
      // kxiPom.chooseIconLibrary();
      KxiDefinition.setTriggerComparer(
        KXIDefinition.targetValue,
        KXIDefinition.leftTriggerLvl1,
        KXIDefinition.leftTriggerLvl2,
        KXIDefinition.leftTriggerLvl3,
        KXIDefinition.rightTriggerLvl1,
        KXIDefinition.rightTriggerLvl2,
        KXIDefinition.rightTriggerLvl3
      );
      kxiPom.searchKxiDefinitionOnGrid(Cypress.env("kxiDefinitionName"));
      kxiPom.verifyKXIDefinitionOnGrid();
    });
    KXIData.forEach((test) => {
      it("Should create and verify Regular Task existence and status on Decision platform", () => {
        kxiPom.leftMenuKxiManagement();
        kxiPom.kxiDataMenu();

        kxiData.createKXIData(
          Cypress.env("kxiDefinitionName"),
          test.kriValue,
          test.comments,
          test.dateValueCurrent
        );
        kxiData.searchFilterName(Cypress.env("kxiDefinitionName"));
        kxiData.clickActionButton(Cypress.env("MAIN_URL"));

        kxiRegularTask.createRegularTaskForm(
          KXIRegularTasks.summary,
          KXIRegularTasks.assigneeUser
        );
        kxiRegularTaskSummary.verifyTaskAndStatusOfRegularTaskDecision();
      });

      it("Should verify the Linked-KXI Definition and its linked back concept on Data Management", () => {
        kxiMenu.clickLeftMenu();
        kxiPom.kxiManagement();
        kxiPom.kxiDataMenu();

        kxiData.createKXIData(
          Cypress.env("kxiDefinitionName"),
          test.kriValue,
          test.comments,
          test.dateValueCurrent
        );

        kxiData.createKXIData(
          Cypress.env("kxiDefinitionName"),
          test.kriValue,
          test.comments,
          test.dateValuePrevious
        );

        kxiData.setRestoreDefaults();
        kxiData.searchFilterName(Cypress.env("kxiDefinitionName"));
        kxiData.clickActionButton(Cypress.env("MAIN_URL"));

        kxiRegularTask.createRegularTaskForm(
          KXIRegularTasks.summary,
          KXIRegularTasks.assigneeUser
        );
        kxiRegularTaskSummary.waitForTaskSummaryPageToAppear();

        kxiRegularTaskSummary.shouldVerifyLinkedKXIDefinition(
          Cypress.env("kxiDefinitionName")
        );
        kxiRegularTaskSummary.shouldClicksOnKxiDefinitionLink();
        kxiData.clickCheckbox();
        kxiData.shouldVerifyShowAllData();
      });
    });
  }
);
