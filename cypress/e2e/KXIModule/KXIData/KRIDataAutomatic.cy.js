/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";
import negativeApiKxi from "../../../fixtures/KXIModule/KXIData/apiAddData.json";

describe(
  "KRI Automatic Functionality",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd25230",
      "@release5.20",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("KRI Automatic Functionality on KXI Data", () => {
      const kxiData = new KXI_POM();
      const predictMenu_PO = new PredictMenu_PO();
      const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
      const loginUser = Cypress.env("kxi").customer.withRM;
      const addDataUrl = Cypress.env("ADD_KXI_DATA_API");
      const nveAddkxiData = negativeApiKxi.addDataNagativeCase;
      beforeEach(() => {
        cy.loginWithSession(
          "login - custom fields",
          loginUser.username,
          loginUser.password,
          loginUser.key
        );

        cy.visitkxiDef();
        kxiData.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3,
          loginUser.username,
          null,
          true
        );
      });

      it(
        "Verify Data of Automatic kxi Definition should not be added from Add modal",
        { tags: ["@pd25313"] },
        () => {
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.addKxiData(file.kxiName, kxiDef.kxiValue, null, true);
          });
        }
      );

      it(
        " Verify Data of Automatic kxi Definition should not be added from Data Entry mode",
        { tags: ["@pd25314"] },
        () => {
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.verifyAutomaticKriOnGrid(file.kxiName);
          });
        }
      );
      it(
        " Verify Data of Automatic kxi Definition should  be added from Import",
        { tags: ["@pd25315"] },
        () => {
          cy.visitkxiData();
          kxiData.addkxiImportJSON(kxiDef.kxiData, kxiDef.operations);
          kxiData.uploadImportFileData();
        }
      );

      it(
        " Verify Data of Automatic kxi Definition should  be added from API",
        { tags: ["@pd25317"] },
        () => {
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.addKXIDataFromAPI(loginUser.username, loginUser.key);
            kxiData.validateAddedDataOnUI(file.kxiName);
            kxiData.verifyEditFields();
          });
        }
      );
      nveAddkxiData.forEach((apiCall) => {
        it(apiCall.name, () => {
          kxiData.generateToken().then((token) => {
            cy.request({
              method: apiCall.request.method,
              url: addDataUrl,
              body: apiCall.request.requestBody,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              failOnStatusCode: apiCall.request.failOnStatusCode,
            }).then((response) => {
              expect(response).to.not.empty;
              expect(response.status).to.eq(apiCall.response.statusCode);
              expect(response.body.apierror.message).to.deep.eq(
                apiCall.response.body.apierror.message
              );
              expect(response.body.apierror.debug_message).to.deep.eq(
                apiCall.response.body.apierror.debug_message
              );
              expect(response.body.apierror.status).to.deep.eq(
                apiCall.response.body.apierror.status
              );
            });
          });
        });
      });
    });
  }
);
