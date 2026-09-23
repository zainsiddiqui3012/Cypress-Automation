import KXIDataEdit from "../../../support/POM/KXIModule/KXIData/KXIDataEdit";
const kxiDataEdit = new KXIDataEdit();

describe(
  "Predict - Edit button Changes on KXI Data Management Screen",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21998",
      "@release5.19",
      "predict",
      "@customer",
    ],
  },
  () => {
    context("EDIT Cases with RM User", { tags: ["@withRM"] }, () => {
      const withRM = Cypress.env("kxi").customer.withRM;

      beforeEach(() => {
          cy.loginWithSession(
            "login - custom fields",
            withRM.username,
            withRM.password,
            withRM.key
          );

          kxiDataEdit.addKXIDefinition_KXIDataEdit(withRM.username);
          kxiDataEdit.addKXIData_KXIDataEdit();
        });

      it(
        "Verify that Edit button is present and visible against each Definition on KXI Data Screen",
        { tags: ["@kxiData", "@withRM"] },
        () => {
          cy.visitkxiData();
          kxiDataEdit.clearNameInput();
          kxiDataEdit.verifyEditBtnAgainstDef();
        }
      );

      it(
        "Verify by clicking Edit button, Edit, Delete and Take Actions buttons gets replaced by Save button",
        { tags: ["@kxiData", "@withRM"] },
        () => {
          cy.visitkxiData();
          kxiDataEdit.clearNameInput();
        }
      );
    });

    context(
      "EDIT Cases without RM User - LUMIFY user",
      { tags: ["@withoutRM"] },
      () => {
        const withoutRM = Cypress.env("kxi").customer.withoutRM;
        beforeEach(() => {
          cy.session(`login - ${withoutRM.username}`, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(withoutRM.username, withoutRM.password, withoutRM.key);

            kxiDataEdit.addKXIDefinition_KXIDataEdit(withoutRM.username);
            kxiDataEdit.addKXIData_KXIDataEdit();
          });
        });

        it(
          "Verify that Edit button is present and visible against each Definition on KXI Data Screen",
          { tags: ["@kxiData", "@withoutRM"] },
          () => {
            cy.visitkxiData();
            kxiDataEdit.clearNameInput();
            kxiDataEdit.verifyEditBtnAgainstDef();
          }
        );
      }
    );
  }
);
