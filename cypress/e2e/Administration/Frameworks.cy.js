import Frameworks from "../../support/POM/Administration/Frameworks.js";
import Assessment from "../../support/POM/Administration/Assessment.js";
import testData from "../../fixtures/Administration/Frameworks.json";
const framework = new Frameworks();
const assessment = new Assessment();
describe(
  "E2E Automation of Frameworks from None Space",
  {
    tags: [
      "@none-space",
      "@administration",
      "@frameworks",
      "@pd32037",
      "@pd33509",
      "@regression",
      "@erm"
    ]
  },
  () => {
    before(()=>{
      assessment.updateAssessmentFile("Assessments_PAP.json")
    })
    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
      cy.visitFramework();
      framework.verifyFrameWorkList();
    });

    it(
      "check for Mandatory Field error",
      { tags: ["@smoke", "@pd33503"] },
      () => {
        framework.checkMandatoryFieldsError();
      }
    );
    it(
      "create new Framework",
      {
        tags: [
          "@smoke",
          "@pd33512",
          "@pd33513",
          "@pd33507",
          "@pd33506",
          "@pd33504",
          "@add"
        ]
      },
      () => {
        //cancel the form after adding details
        framework.createFrameWork("addFrameWork", true);
        //create the framework
        framework.createFrameWork("addFrameWork");
      }
    );

    it(
      "verify newly created Framework Details",
      { tags: ["@smoke", "@pd33510", "@pd33508", "@filter"] },
      () => {
        framework.verifyFrameWork("addFrameWork");
      }
    );

    it(
      "update Existing framework details",
      {
        tags: [
          "@smoke",
          "@pd33512",
          "@pd33507",
          "@pd33506",
          "@pd33504",
          "@edit"
        ]
      },
      () => {
        framework.frameworkFilter("addFrameWork");
        framework.updateFrameWork(true);
        framework.frameworkFilter("addFrameWork");
        framework.updateFrameWork();
      }
    );

    it(
      "verify Updated Framework Details",
      { tags: ["@smoke", "@pd33510", "@pd33508", "@filter"] },
      () => {
        framework.verifyFrameWork("updateFrameWork");
      }
    );

    it(
      "Validate the sorting behavior of the Created and Updated columns.",
      { tags: ["@pd33515", "@list"] },
      () => {
        framework.sortFrameWorkList("Created");
        framework.sortFrameWorkList("Updated");
      }
    );

    it(
      "Validate pagination for navigating through multiple frameworks.",
      { tags: ["@pd33511", "@list"] },
      () => {
        framework.verifyPagination();
      }
    );
  }
);

describe(
  "E2E Automation of Frameworks from Customer Space",
  {
    tags: [
      "@customer-space",
      "@administration",
      "@frameworks",
      "@regression",
      "@erm",
      "@pd32056"
    ]
  },
  () => {
    before(()=>{
      assessment.updateAssessmentFile("Assessments_PAP.json")
    })
    beforeEach(() => {
      cy.loginWithSession(
        "login with Customer User",
        Cypress.env("kxi").customer.withRM.username,
        Cypress.env("kxi").customer.withRM.password,
        Cypress.env("kxi").customer.withRM.key
      );
      cy.visitFramework();
      framework.verifyFrameWorkList();
    });

    it("Validate that the 'Name' field is mandatory",
      {tags:["@smoke","@pd33376"]}, () => {
      framework.checkMandatoryFieldsError();
    });

    it("Validate that the table displays all frameworks with correct details",
      {tags:["@smoke","@list","@pd33382"]}, () => {
      framework.verifyFrameWorkList();
    });

    it("Ensure that clicking 'Cancel' clears the form without saving changes",
      {tags:["@smoke","@add","@pd33380"]}, () => {
      framework.createFrameWork("addFrameWork", true);
    });

    it("Verify that clicking 'Save' stores the framework details",
      {tags:["@smoke","@add","@pd33379","@pd33385","@pd33377"]}, () => {
      framework.createFrameWork("addFrameWork");
    });

    it(
      "verify newly created Framework Details",
      { tags: ["@smoke","@filter","@add", "@pd33379","@pd33377"] },
      () => {
        framework.verifyFrameWork("addFrameWork");
      }
    );

    it(
      "update Existing framework details",
      {
        tags: [
          "@smoke",
          "@edit",
          "@filter",
          "@pd33377"
        ]
      },
      () => {
        framework.frameworkFilter("addFrameWork");
        framework.updateFrameWork(true);
        framework.frameworkFilter("addFrameWork");
        framework.updateFrameWork();
      }
    );

    it(
      "verify Updated Framework Details",
      { tags: ["@smoke", "@edit","@filter","@pd33377"] },
      () => {
        framework.verifyFrameWork("updateFrameWork");
      }
    );

    it("Test the 'Filter' functionality to search for frameworks",
      {tags:["@filter","@pd33383"]}, () => {
      framework.frameworkFilter("updateFrameWork");
    });

    it("Validate pagination for navigating through multiple frameworks",
      {tags:["@pd33384"]}, () => {
      framework.verifyPagination();
    });

    it("Ensure that the list refreshes after adding a new framework",
      {tags:["@list","@pd33386"]}, () => {
      framework.createFrameWork("addFrameWork");
      framework.verifyFrameWorkList();
    });

    it("Validate the sorting behavior of the 'Created' and 'Updated' columns",
      {tags:["@pd33387"]}, () => {
      framework.sortFrameWorkList("Created");
      framework.sortFrameWorkList("Updated");
    });
  }
);