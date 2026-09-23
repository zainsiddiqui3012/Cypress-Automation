import ControlOperation from "../../../support/POM/RiskAndControlRegister/Administration/ControlOperationCustomerSpace.js";

const ControlOps = new ControlOperation();

describe(
  "Control Operation - Customer Space",
  {
    tags: [
      "@risk-management",
      "@control-operation",
      "@regression",
      "@customer",
      "@predict",
      "@pd36721",
    ],
  },
  () => {
    const userLogin = Cypress.env("kxi").customer;
    context("Add Control Operation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitControlOperationCustomerSpace();
        cy.waitForTopMsgLoaderToDisappear(20000);
        ControlOps.clickOnAddControlBtn();
      });
      it(
        "Add Control Operation with Valid Name",
        { tags: ["@smoke", "@pd42091"] },
        () => {
          const catName=ControlOps.enterCategoryName();
          ControlOps.writeEnteredName(catName);
          ControlOps.verifySuccessControlOperation();
          ControlOps.verifyRecordExists();
        }
      );
      it(
        "Add Control Operation with Empty Name",
        { tags: ["@smoke", "@pd42089"] },
        () => {
          ControlOps.clickOnAddControlBtn();
          ControlOps.verifyEmptyRecordMessage();
        }
      );
      
      it(
        "Add Control Operation with inactive status",
        { tags: ["@smoke", "@pd42083"] },
        () => {
          const catName=ControlOps.enterNamewithInactiveStatus();
          ControlOps.writeEnteredName(catName);
          ControlOps.verifySuccessControlOperation();
          ControlOps.verifyRecordExists();
        }
      );

      it(
        "Add Control Operation with Empty Library",
        { tags: ["@smoke", "@pd42085"] },
        () => {
          const catName=ControlOps.enterCategoryName();
          ControlOps.writeEnteredName(catName);
          ControlOps.verifySuccessControlOperation();
          ControlOps.verifyRecordExists();
        }
      );
    });

    context("Edit Control Operation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );

        cy.visitControlOperationCustomerSpace();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      it(
        "Edit Control Operation with No Changes",
        { tags: ["@pd42087"] },
        () => {
          ControlOps.editWithoutChange();
          ControlOps.verifyRecordExists();
        }
      );

      it("Edit Control Operation", { tags: ["@smoke", "@pd42090"] }, () => {
        ControlOps.editCategoryName();
        ControlOps.verifyRecordExists();

      });

      it(
        "Edit Control Operation Status to Inactive Status",
        { tags: ["@pd42094"] },
        () => {
          ControlOps.applyFilterByName();
          ControlOps.editCategoryStatusToInactive();
          ControlOps.verifySuccessControlOperation();
          ControlOps.verifyRecordExists();
        }
      );

      it(
        "Edit Control Operation Status to Invalid Name",
        { tags: ["@pd42088"] },
        () => {
          ControlOps.editCategoryName();
          ControlOps.verifyRecordExists();
        }
      );
    });

    context("Filter Control Operation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlOperationCustomerSpace();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      it("Filter Control Operation Categories by Name",{ tags: ["@pd42084"] },
        () => {
          ControlOps.applyFilterByName();
        }
      );

      it("Filter Control Operation Categories by Invalid Name",{ tags: ["@pd42086"] },
        () => {
         
          ControlOps.applyFilterByInvalidName();
          ControlOps.verifyNoRecordsFound();
        }
      );
    });

    context("View Control Operation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlOperationCustomerSpace();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

       it("View Control Operation List",{ tags: ["@smoke", "@pd42092"] },
        () => {
          ControlOps.verifyControlOperationList();
        }
      );



    });

   context("Other Functional Cases of Control Operation", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlOperationCustomerSpace();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });


      //The issue exist here regarding the library from NONE and RESELLER space.Its bug ticket is PD-44679, PD-44681
      it("Control Operations from None/Reseller space should not be editable. Only None/Reseller space Control operations have Content Library ",{ tags: ["@pd44340"] },
        () => {
         
          ControlOps.verifyControlOperationExists();
          ControlOps.verifyContentLibraryIsNotEmpty();
          ControlOps.verifyNameFieldIsNonEditable();
          ControlOps.verifyContentLibraryFieldIsNonEditable();
          ControlOps.verifyContentLibraryHasValue();
        }
      );

});







  }
);