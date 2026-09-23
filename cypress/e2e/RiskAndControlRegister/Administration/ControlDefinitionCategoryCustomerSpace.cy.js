import ControlDefinitionCategory from "../../../support/POM/RiskAndControlRegister/Administration/ControlDefinitionCategoryCustomerSpace.js";

const ControlDefinition = new ControlDefinitionCategory();

describe(
  "Control Definition Categories - Customer Space",
  {
    tags: [
      "@risk-management",
      "@risk-definition-category",
      "@regression",
      "@customer",
      "@predict",
      "@pd36720",
    ],
  },
  () => {
    const userLogin = Cypress.env("kxi").customer;

    context("Add Control Definition Categories", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitContolDefCat();
        cy.waitForTopMsgLoaderToDisappear(20000);
        ControlDefinition.clickOnAddControlBtn();
      });

      it(
        "Add Control Definition with Empty Name",
        { tags: ["@smoke", "@pd42098"] },
        () => {
          ControlDefinition.clickOnAddControlBtn();
          ControlDefinition.verifyEmptyRecordMessage();
        }
      
      );

      it(
        "Add Control Definition with inactive status",
        { tags: ["@smoke", "@pd42106"] },
        () => {
          ControlDefinition.enterNamewithInactiveStatus();
          ControlDefinition.writeEnteredName();
          ControlDefinition.verifySuccessControlDefinition();
          ControlDefinition.verifyRecordExists();
        }
      );

      it(
        "Add Control Definition with Valid Data with/without special characters",
        { tags: ["@smoke", "@pd42102", "@pd42107", "@pd42104"] },
        () => {
          ControlDefinition.enterCategoryName();
          ControlDefinition.writeEnteredName();
          ControlDefinition.verifySuccessControlDefinition();
          ControlDefinition.verifyRecordExists();
        }
      );
    });

    context("Edit Control Definition Categories", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login - with Risk Management",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitContolDefCat();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });
      it(
        "Edit Control Definition with No Changes",
        { tags: ["@pd42100"] },
        () => {
          ControlDefinition.editWithoutChange();
          ControlDefinition.verifyRecordExists();
        }
      );

      it("Edit Control Definition", { tags: ["@smoke", "@pd42103"] }, () => {
        ControlDefinition.editCategoryName();
        ControlDefinition.verifyRecordExists();
      });

      it(
        "Edit Control Definition Status to Inactive Status",
        { tags: ["@pd42107"] },
        () => {
          ControlDefinition.applyFilterByName();
          ControlDefinition.editCategoryStatusToInactive();
          ControlDefinition.verifySuccessControlDefinition();
          ControlDefinition.verifyRecordExists();
        }
      );
    });

    context("Filter Control Definition Categories", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitContolDefCat();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      it(
        "Filter Control Definition Categories by Name",
        { tags: ["@pd42097"] },
        () => {
          ControlDefinition.applyFilterByName();
        }
      );

      it(
        "Filter Control Definition Categories by Invalid Name",
        { tags: ["@pd42105"] },
        () => {
          const invalidName = "Invalid Category";
          ControlDefinition.applyFilterByName(invalidName);
          ControlDefinition.verifyNoRecordsFound();
        }
      );
    });

    context("View Control Definition Categories", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitContolDefCat();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      it(
        "View Control Definition Categories List",
        { tags: ["@smoke", "@pd42096"] },
        () => {
          ControlDefinition.verifyControlDefCategoryList();
        }
      );


    });

    context("Other Functional Cases of Control Definition Categories", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitContolDefCat();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      //The issue exist here regarding the library from NONE and RESELLER space.Its bug ticket is PD-44679, PD-44681
      it("Control Definition from None/Reseller space should not be editable. Only None/Reseller space Control Definition have Content Library ",{ tags: ["@pd44341"] },
        () => {
          ControlDefinition.verifyControlDefinitionExists();
          ControlDefinition.verifyContentLibraryIsNotEmpty();
          ControlDefinition.verifyNameFieldIsNonEditable();
          ControlDefinition.verifyContentLibraryFieldIsNonEditable();
          ControlDefinition.verifyContentLibraryHasValue();
        }
      );
    });
  });