import AccessSettings from "../../../../support/POM/DMS/CompanyDocument/AccessSettings";
import CompanyDocument from "../../../../support/POM/DMS/CompanyDocument/CompanyDocument";
import MyDocumentsHelpers from "../../../../support/POM/DMS/helpers/MyDocumentsHelper";
import AccessSettingsData from "../../../../fixtures/DMS/CompanyDocument/AccessSettings.json";
import locators from "../../../../fixtures/locators.json";

describe(
  "Verify Access Settings with View & Edit Permissions from Organizational Group",
  { tags: ["@pd46102", "@dms", "@access-settings"] },
  () => {
    const accessSettings = new AccessSettings();
    const myDocumentsHelpers = new MyDocumentsHelpers();
    const companyDocument = new CompanyDocument();
    const helpers = new MyDocumentsHelpers();
    const testData = AccessSettingsData.testData;
    const newUser= Cypress.env("USER").NEW_FNBA_USER

    beforeEach(() => {
      cy.loginWithSession(
        "Login with FNBA User",
        Cypress.env("USER").FNBA.USERNAME,
        Cypress.env("USER").FNBA.PASSWORD,
        Cypress.env("USER").FNBA.KEY
      );
      // Navigate to Company Documents
      cy.visitMyCompanyDocument();
      helpers.switchToIframe();
    });

    context(
      "[Organizational Group] - Assign Org Group Field Value and verify Edit Access",
      { tags: ["@pd46111", "@pd46106", "@pd46110", "@pd46104"] },
      () => {
        AccessSettingsData.testData.fileNames.forEach((fileName) => {
          it(
            `${fileName} Verify that clicking on 'Access Settings' opens the settings flyer with required fields for ${fileName}`,
            { tags: ["@pd46109"] },
            () => {
              myDocumentsHelpers.scrollGridToBottom(fileName);
              accessSettings.clickAccessSettingsFromThreeDots();
              accessSettings.selectAccessFields(
                testData.fieldNames.user,
                testData.incorrectData.user,
                false
              );
              accessSettings.selectAccessFields(
                testData.fieldNames.userGroup,
                testData.incorrectData.userGroup,
                false
              );
              accessSettings.selectAccessFields(
                testData.fieldNames.orgGroup,
                testData.correctData.orgGroup,
                true
              );
              accessSettings.clickAccessSettingsSaveButton();
            }
          );

          it("Verify that enabling 'Edit' access allows a user to edit the document", () => {
            const uniqueDescription = `${"login with New FNBA User-"}-${Date.now()}`;
            cy.loginWithSession(
              uniqueDescription,
              newUser.USERNAME,
              newUser.PASSWORD,
              newUser.KEY
            );
            // Navigate to Company Documents
            cy.visitMyCompanyDocument();
            helpers.switchToIframe();
            myDocumentsHelpers.scrollGridToBottom(fileName);
            companyDocument.clickThreeEllipses(1);
            accessSettings.verifyOptionVisible(testData.option.edit);
            accessSettings.verifyOptionNotVisible(testData.option.accessSettings);
          });
        });
      }
    );

    context(
      "[Organizational Group] - Assign Org Group Field Value and verify only View Access",
      { tags: ["@pd46111", "@pd46106", "@pd46110", "@pd46104"] },
      () => {
        AccessSettingsData.testData.fileNames.forEach((fileName) => {
          it(
            `${fileName} Verify that clicking on 'Access Settings' opens the settings flyer with required fields for ${fileName}`,
            { tags: ["@pd46109"] },
            () => {
              myDocumentsHelpers.scrollGridToBottom(fileName);
              accessSettings.clickAccessSettingsFromThreeDots();
              accessSettings.selectAccessFields(
                testData.fieldNames.user,
                testData.incorrectData.user,
                true
              );
              accessSettings.selectAccessFields(
                testData.fieldNames.userGroup,
                testData.incorrectData.userGroup,
                false
              );
              accessSettings.selectAccessFields(
                testData.fieldNames.orgGroup,
                testData.correctData.orgGroup,
                false
              );
              accessSettings.clickAccessSettingsSaveButton();
            }
          );

          it("Verify that a user with only 'View' access cannot edit the document", () => {
            const uniqueDescription = `${"login with New FNBA User-"}-${Date.now()}`;
            cy.loginWithSession(
              uniqueDescription,
              newUser.USERNAME,
              newUser.PASSWORD,
              newUser.KEY
            );
            // Navigate to Company Documents
            cy.visitMyCompanyDocument();
            helpers.switchToIframe();
            myDocumentsHelpers.scrollGridToBottom(fileName);
            companyDocument.clickThreeEllipses(1);
            accessSettings.verifyOptionNotVisible(testData.option.edit);
            accessSettings.verifyOptionNotVisible(testData.option.accessSettings);
          });
        });
      }
    );
  }
);
