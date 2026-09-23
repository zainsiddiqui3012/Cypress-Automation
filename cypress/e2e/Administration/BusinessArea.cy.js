import QuestionBank from "../../support/POM/Administration/QuestionBank/QuestionBank";
import BusinessArea from "../../support/POM/Administration/BusinessArea";
import ContentLibrary from "../../support/POM/Administration/ContentLibary";
import Assessment from "../../support/POM/Administration/Assessment";
import assessmentData from "../../fixtures/Administration/Assessments_PAP.json";
import locators from "../../fixtures/locators.json";
const testData = require("../../fixtures/Administration/BusinessArea.json");

const ba = new BusinessArea();
const contentLibrary = new ContentLibrary();
const assessment = new Assessment();
const qbSummaryForm = assessmentData.questionBank.qbSummaryForm;
const questionBank = new QuestionBank();

describe(
  "E2E testcases of Business Areas from None Space",
  {
    tags: [
      "@none-space",
      "@administration",
      "@business-areas",
      "@pd32035",
      "@pd34380",
      "@pd34405",
      "@pd34387",
      "@regression",
      "@erm",
    ],
  },
  () => {
    before(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
      assessment.updateAssessmentFile("Assessments_PAP.json");
      assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
    });

    context("Business Area Category 1", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 50000);
        ba.verifyBAGridlist("Business Area Categories 1");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd34387"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Add Business Area Category 1",
        { tags: ["@smoke", "@pd34381"] },
        () => {
          ba.addBA("addBA", "BAC-1");
        }
      );
      it(
        "update the Business Area Category 1 status Active",
        { tags: ["@smoke", "@pd34392"] },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.toggleStatus("addBA", "BAC-1");
        }
      );
      it(
        "Verify Add Business Area Category 1",
        {
          tags: [
            "@smoke",
            "@pd34382",
            "@pd34381",
            "@pd34389",
            "@pd34391",
            "@pd34392",
          ],
        },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.verifyBARecord("addBA", "BAC-1");
        }
      );
      it(
        "Verify duplicate Name restriction",
        { tags: ["@smoke", "@pd34386"] },
        () => {
          ba.verifyDuplicateRecordError("addBA", "BAC-1", true);
        }
      );
      it(
        "update Business Area Category 1",
        { tags: ["@smoke", "@pd34394"] },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.updateBA("updateBA", "BAC-1");
        }
      );
      it(
        "update Business Area Category 1 status from Active to Inactive",
        { tags: ["@smoke", "@pd34391", "@pd34392"] },
        () => {
          ba.searchBA("updateBA", "BAC-1");
          ba.toggleStatus("updateBA", "BAC-1");
        }
      );
      it(
        "Verify updated Business Area Category 1",
        { tags: ["@smoke", "@pd34394"] },
        () => {
          ba.searchBA("updateBA", "BAC-1");
          ba.verifyBARecord("updateBA", "BAC-1");
        }
      );
      it(
        "Verify sorting and filtering in grid",
        { tags: ["@pd34388", "@pd34389"] },
        () => {
          ba.sortBA("updateBA", "BAC-1");
          ba.searchFilterName("updateBA", "BAC-1", 8);
          ba.searchFilterColumn("updateBA", "BAC-1", 9, "contentLibrary");
        }
      );
    });

    context("Business Area Category 2", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 50000);
        ba.verifyBAGridlist("Business Area Categories 2");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd34387"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Add Business Area Category 2",
        { tags: ["@smoke", "@pd34400"] },
        () => {
          ba.addBA("addBA", "BAC-2");
        }
      );
      it(
        "update the Business Area Category 2 status to Active",
        { tags: ["@smoke", "@pd34409", "@pd34410"] },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.toggleStatus("addBA", "BAC-2");
        }
      );
      it(
        "Verify Add Business Area Category 2",
        { tags: ["@smoke", "@pd34411", "@pd34401", "@pd34408"] },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.verifyBARecord("addBA", "BAC-2");
        }
      );
      it(
        "Verify duplicate Name restriction",
        { tags: ["@smoke", "@pd34404"] },
        () => {
          ba.verifyDuplicateRecordError("addBA", "BAC-2", true);
        }
      );
      it(
        "update Business Area Category 2",
        { tags: ["@smoke", "@pd34411"] },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.updateBA("updateBA", "BAC-2");
        }
      );
      it(
        "update Business Area Category 2 status to from Active to Inactive",
        { tags: ["@smoke", "@pd34409", "@pd34410"] },
        () => {
          ba.searchBA("updateBA", "BAC-2");
          ba.toggleStatus("updateBA", "BAC-2");
        }
      );
      it(
        "Verify updated Business Area Category 2",
        { tags: ["@smoke", "@pd34407", "@pd34411"] },
        () => {
          ba.searchBA("updateBA", "BAC-2");
          ba.verifyBARecord("updateBA", "BAC-2");
        }
      );
      it("Verify sorting and filtering in grid", { tags: ["@pd34406"] }, () => {
        ba.sortBA("updateBA", "BAC-2");
        ba.searchFilterName("updateBA", "BAC-2", 8);
        ba.searchFilterColumn("updateBA", "BAC-2", 9, "contentLibrary");
      });
    });

    context("Business Area Definitions", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 80000);
        ba.verifyBAGridlist("Business Area Definitions");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd35376", "@pd32902"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Verify that Business Area Definition can not be added with inactive Business Area Categories",
        { tags: ["@smoke", "@pd35378", "@pd35379", "@pd32914"] },
        () => {
          ba.clickAddBtn();
          ba.verifyBACSelection("addBA", "Business Definition", true);
        }
      );
      it(
        "update previously 'Inactive' Business Category Status to 'Active'",
        { tags: "@smoke" },
        () => {
          ba.verifyBAGridlist("Business Area Categories 1");
          ba.searchBA("updateBA", "BAC-1");
          ba.toggleStatus("addBA", "BAC-1");
          ba.verifyBAGridlist("Business Area Categories 2");
          ba.searchBA("updateBA", "BAC-2");
          ba.toggleStatus("addBA", "BAC-2");
        }
      );
      it(
        "add Business Area Definition",
        { tags: ["@smoke", "@pd32903", "@pd35402", "@pd35403", "@pd35404"] },
        () => {
          ba.addBADef("addBA", "Business Definition", true);
          ba.toggleStatus("addBA", "Business Definition");
        }
      );
      it(
        "verify created Business Area Definition",
        {
          tags: [
            "@smoke",
            "@pd35380",
            "@pd35381",
            "@pd32898",
            "@pd35405",
            "@pd35406",
            "@pd35408",
            "@pd35396",
          ],
        },
        () => {
          ba.searchBA("addBA", "Business Definition");
          ba.verifyBARecord("addBA", "Business Definition");
        }
      );
      it(
        "update Business Area Definition",
        {
          tags: [
            "@smoke",
            "@pd35400",
            "@pd35403",
            "@pd35404",
            "@pd35391",
            "@pd35392",
            "@pd35393",
            "@pd35394",
            "@pd35395",
          ],
        },
        () => {
          ba.searchBA("addBA", "Business Definition");
          ba.updateBA("updateBA", "Business Definition", true);
          ba.toggleStatus("updateBA", "Business Definition");
        }
      );
      it(
        "verify updated Business Area Definition",
        { tags: ["@smoke", "pd35409", "@pd35396"] },
        () => {
          ba.searchBA("updateBA", "Business Definition");
          ba.verifyBARecord("updateBA", "Business Definition");
        }
      );
      it(
        "verify Sorting of columns in Business Definition",
        {
          tags: [
            "@pd35386",
            "@pd35387",
            "@pd35388",
            "@pd35389",
            "@pd35390",
            "@pd35398",
          ],
        },
        () => {
          ba.sortBA("updateBA", "Business Definition", true);
        }
      );
      it(
        "filter columns names in Business Definition",
        {
          tags: [
            "@pd35382",
            "@pd35383",
            "@pd35384",
            "@pd35385",
            "@pd35399",
            "@pd35407",
          ],
        },
        () => {
          ba.searchFilterName("updateBA", "Business Definition", 11);
          ba.searchFilterColumn(
            "updateBA",
            "Business Definition",
            12,
            "contentLibrary"
          );
          ba.searchFilterColumn("updateBA", "BAC-1", 13, "name");
          ba.searchFilterColumn("updateBA", "BAC-2", 14, "name");
          ba.sortBA("updateBA", "Business Definition", true);
          ba.searchFilterColumn(
            "updateBA",
            "Business Definition",
            19,
            "status"
          );
        }
      );
    });
  }
);

// Describe block for Customer Space
describe(
  "E2E testcases of Business Areas from Customer Space",
  {
    tags: [
      "@customer-space",
      "@administration",
      "@business-areas",
      "@pd32064",
      "@regression",
      "@erm",
    ],
  },
  () => {
    context("Business Area Category 1 from Customer Space", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with FNBA User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 50000);
        ba.verifyBAGridlist("Business Area Categories 1");
      });

      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd32843", "@pd32844"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );

      it("Add Business Area Category 1",{tags:"@smoke"}, () => {
        ba.addBA("addBA", "BAC-1", true);
      });
      it(
        "update the Business Area Category 1 status to Active",
        { tags: ["@smoke", "@pd32850"] },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.toggleStatus("addBA", "BAC-1");
        }
      );
      it(
        "Verify Add Business Area Category 1",
        {
          tags: [
            "@smoke",
            "@pd32481",
            "@pd32842",
            "@pd32486",
            "@pd32849",
            "@pd32850",
            "@pd34392",
          ],
        },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.verifyBARecord("addBA", "BAC-1", true);
        }
      );
      it(
        "Verify duplicate Name restriction",
        { tags: ["@smoke","@pd32845"] },
        () => {
          ba.verifyDuplicateRecordError("addBA", "BAC-1", true, false, true);
        }
      );
      it(
        "update Business Area Category 1",
        { tags: ["@smoke", "@pd32848"] },
        () => {
          ba.searchBA("addBA", "BAC-1");
          ba.updateBA("updateBA", "BAC-1");
        }
      );
      it(
        "update Business Area Category 1 status from Active to Inactive)",
        { tags: ["@smoke", "@pd32848"] },
        () => {
          ba.searchBA("updateBA", "BAC-1");
          ba.toggleStatus("updateBA", "BAC-1");
        }
      );
      it(
        "Verify updated Business Area Category 1",
        { tags: ["@smoke", "@pd32851", "@pd32852"] },
        () => {
          ba.searchBA("updateBA", "BAC-1");
          ba.verifyBARecord("updateBA", "BAC-1", true);
        }
      );
      it("Verify sorting and filtering in grid", { tags: ["@pd32847"] }, () => {
        ba.sortBA("updateBA", "BAC-1");
        ba.searchFilterName("updateBA", "BAC-1", 8);
        ba.searchFilterColumn("updateBA", "BAC-1", 9, "contentLibrary", true);
      });
    });

    context("Business Area Category 2 from Customer Space", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with FNBA User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 50000);
        ba.verifyBAGridlist("Business Area Categories 2");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd32843", "@pd32844"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Add Business Area Category 2",
        { tags: ["@smoke", "@pd32486"] },
        () => {
          ba.addBA("addBA", "BAC-2", true);
        }
      );
      it(
        "update the Business Area Category 2 status to Active",
        { tags: ["@smoke", "@pd32850"] },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.toggleStatus("addBA", "BAC-2");
        }
      );
      it(
        "Verify Add Business Area Category 2",
        {
          tags: [
            "@smoke",
            "@pd32481",
            "@pd32842",
            "@pd32486",
            "@pd32849",
            "@pd32850",
            "@pd34392",
          ],
        },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.verifyBARecord("addBA", "BAC-2", true);
        }
      );
      it(
        "Verify duplicate Name restriction",
        { tags: ["@smoke", "@pd32845"] },
        () => {
          ba.verifyDuplicateRecordError("addBA", "BAC-2", true, false, true);
        }
      );
      it(
        "update Business Area Category 2",
        { tags: ["@smoke", "@pd32848"] },
        () => {
          ba.searchBA("addBA", "BAC-2");
          ba.updateBA("updateBA", "BAC-2");
        }
      );
      it(
        "update Business Area Category 2 status from Active to Inactive",
        { tags: ["@smoke", "@pd32848"] },
        () => {
          ba.searchBA("updateBA", "BAC-2");
          ba.toggleStatus("updateBA", "BAC-2");
        }
      );
      it(
        "Verify updated Business Area Category 2",
        { tags: ["@smoke", "@pd32851", "@pd32852"] },
        () => {
          ba.searchBA("updateBA", "BAC-2");
          ba.verifyBARecord("updateBA", "BAC-2", true);
        }
      );
      it("Verify sorting and filtering in grid", { tags: ["@pd32847"] }, () => {
        ba.sortBA("updateBA", "BAC-2");
        ba.searchFilterName("updateBA", "BAC-2", 8);
        ba.searchFilterColumn("updateBA", "BAC-2", 9, "contentLibrary", true);
      });
    });

    context("Business Area Definitions from Customer Space", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with FNBA User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 80000);
        ba.verifyBAGridlist("Business Area Definitions");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke", "@pd32868"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Verify that Business Area Definition can not be added with inactive Business Area Categories",
        { tags: ["@smoke", "@pd32872", "@pd32873"] },
        () => {
          ba.clickAddBtn();
          ba.verifyBACSelection("addBA", "Business Definition", true, true);
        }
      );
      it(
        "update previously 'Inactive' Business Category Status to 'Active'",
        { tags: "@smoke" },
        () => {
          ba.verifyBAGridlist("Business Area Categories 1");
          ba.searchBA("updateBA", "BAC-1");
          ba.toggleStatus("addBA", "BAC-1");
          ba.verifyBAGridlist("Business Area Categories 2");
          ba.searchBA("updateBA", "BAC-2");
          ba.toggleStatus("addBA", "BAC-2");
        }
      );
      it(
        "add Business Area Definition with Active Status",
        { tags: ["@smoke", "@pd32867"] },
        () => {
          ba.addBADef("addBA", "Business Definition", true, true);
          ba.toggleStatus("addBA", "Business Definition");
        }
      );
      it(
        "verify created Business Area Definition",
        {
          tags: [
            "@smoke",
            "@pd32842",
            "@pd32843",
            "@pd32876",
            "@pd32892",
            "@pd32893",
            "@pd32891",
            "@pd32898",
          ],
        },
        () => {
          ba.searchBA("addBA", "Business Definition");
          ba.verifyBARecord("addBA", "Business Definition", true);
        }
      );
      it(
        "update Business Area Definition with Inactive status",
        {
          tags: ["@smoke"],
        },
        () => {
          ba.searchBA("addBA", "Business Definition");
          ba.updateBA("updateBA", "Business Definition", true, true);
          ba.toggleStatus("updateBA", "Business Definition");
        }
      );
      it(
        "verify updated Business Area Definition",
        {
          tags: [
            "@smoke",
            "@pd32886",
            "@pd32887",
            "@pd32888",
            "@pd32889",
            "@pd32890",
          ],
        },
        () => {
          ba.searchBA("updateBA", "Business Definition");
          ba.verifyBARecord("updateBA", "Business Definition", true);
        }
      );
      it(
        "verify Sorting of columns in Business Definition",
        {
          tags: [
            "@pd32881",
            "@pd32882",
            "@pd32883",
            "@pd32884",
            "@pd32885",
            "@pd32896",
          ],
        },
        () => {
          ba.sortBA("updateBA", "Business Definition", true);
        }
      );
      it(
        "filter columns names in Business Definition",
        {
          tags: ["@pd32877", "@pd32878", "@pd32879", "@pd32880"],
        },
        () => {
          ba.searchFilterName("updateBA", "Business Definition", 11);
          ba.searchFilterColumn(
            "updateBA",
            "Business Definition",
            12,
            "contentLibrary",
            true
          );
          ba.searchFilterColumn("updateBA", "BAC-1", 13, "name");
          ba.searchFilterColumn("updateBA", "BAC-2", 14, "name");
          ba.sortBA("updateBA", "Business Definition", true);
          ba.searchFilterColumn(
            "updateBA",
            "Business Definition",
            19,
            "status",
            true
          );
        }
      );
    });

    context("Business Areas from Customer Space", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with FNBA User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 80000);
        ba.verifyBAGridlist("Business Areas");
      });
      it(
        "Verify error for empty record when adding business area and clicking 'Add' btn multiple times",
        { tags: ["@smoke"] },
        () => {
          ba.verifyEmptyRecordError();
        }
      );
      it(
        "Verify that Business Areas can not be added with inactive Business Area Definitions",
        { tags: ["@smoke", "@pd32902", "@pd32904", "@pd32910", "@pd32914"] },
        () => {
          ba.clickAddBtn();
          ba.verifyBADSelection("addBA", "Business Areas", true, true);
        }
      );
      it(
        "update previously 'Inactive' Business Definition Status to 'Active'",
        { tags: "@smoke" },
        () => {
          ba.verifyBAGridlist("Business Area Definition");
          ba.searchBA("updateBA", "Business Definition");
          ba.toggleStatus("addBA", "Business Definition");
        }
      );
      it(
        "add Business Areas with Active Status",
        { tags: ["@smoke", "@pd32903"] },
        () => {
          ba.clickAddBtn();
          ba.verifyBADSelection("addBA", "Business Areas", false, true);
          ba.toggleStatus("addBA", "Business Areas");
        }
      );
      it(
        "verify created Business Areas",
        {
          tags: ["@smoke", "@pd35402", "@pd32912", "@pd32913"],
        },
        () => {
          ba.searchBA("addBA", "Business Areas");
          ba.verifyBARecord("addBA", "Business Areas", true);
        }
      );
      it(
        "update Business Areas with inActive status",
        {
          tags: ["@smoke"],
        },
        () => {
          ba.searchBA("addBA", "Business Areas");
          ba.clickGridName();
          ba.verifyBADSelection("updateBA", "Business Areas", false, false);
          ba.toggleStatus("updateBA", "Business Definition");
        }
      );
      it(
        "verify updated Business Areas",
        { tags: ["@smoke", "@pd35402", "@pd32912", "@pd32913"] },
        () => {
          ba.searchBA("updateBA", "Business Areas");
          ba.verifyBARecord("updateBA", "Business Areas", true);
        }
      );
      it("verify Sorting of columns in Business Definition", () => {
        ba.sortBA("updateBA", "Business Areas", false, true);
      });
      it(
        "filter columns names in Business Definition",
        {
          tags: ["@pd32915"],
        },
        () => {
          ba.searchFilterName("updateBA", "Business Areas", 12);
          ba.sortBA("updateBA", "Business Areas", false, true);
        }
      );
    });

    //************<<<< import Cases >>>>>>************** */
    context("verify Import Functionality..", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitBusinessArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.waitForLoaderToDisappear("myGrid", 80000);
        ba.verifyBAGridlist("Business Area Definitions");
      });

      it(
        "Verify that the Cancel button closes the modal",
        { tags: ["@import", "@pd32916", "@pd32923"] },
        () => {
          ba.openImportModal(
            locators.administration.businessArea.importModalId
          );
          contentLibrary.closeImportModal();
        }
      );

      it(
        "Verify that the Import modal opens correctly",
        { tags: ["@import", "@pd32916"] },
        () => {
          ba.openImportModal(
            locators.administration.businessArea.importModalId
          );
        }
      );

      it(
        "Validate the Download Sample File link",
        { tags: ["@import", "@pd32918"] },
        () => {
          ba.openImportModal(
            locators.administration.businessArea.importModalId
          );
          ba.checkForDownloadFileLink(
            locators.administration.contentLibrary.SampledownloadFile,
            testData.downloadString,
            testData.downloadedFile
          );
        }
      );

      it(
        "Verify uploading a file with an unsupported format",
        { tags: ["@import", "@pd32920"] },
        () => {
          ba.openImportModal(
            locators.administration.businessArea.importModalId
          );
          ba.uploadFileImportModal(
            testData.invalidFormatFile,
            locators.administration.businessArea.importModalId,
            locators.administration.businessArea.importSubmitBtn,
            testData.invalidUploadedFileColor
          );
        }
      );

      it(
        "Verify if large files (e.g., > 10 MB) are handled correctly during import.",
        {
          tags: ["@import"],
        },
        () => {
          ba.openImportModal(
            locators.administration.businessArea.importModalId
          );
          ba.uploadFileImportModal(
            testData.exceedSizeFileName,
            locators.administration.businessArea.importModalId,
            locators.administration.businessArea.importSubmitBtn,
            testData.invalidUploadedFileColor
          );
          ba.checkForImportStatus(testData.failedExceedSizeFileStatus, 500, 500);
        }
      );

      //this test will fail on qa2 environment there is issue on upload file in qa2 getting exception on file upload
      // this will work fine in stage environment.
      it("Validate uploading a valid Excel file", { tags: ["@import"] }, () => {
        ba.openImportModal(locators.administration.businessArea.importModalId);
        ba.addUsersDataImportJson(true);
        ba.checkForImportStatus(testData.ImportSuccessStatus, 500, 500);
        ba.writeImportNameToDataFile();
        cy.reload();
      });

      //this test will fail on qa2 environment there is issue on upload file in qa2 getting exception on file upload
      // this will work fine in stage environment.
      it(
        "verify that imported Business Area Definition should be added in the grid",
        { tags: "@import" },
        () => {
          cy.reload();
          ba.verifyBAGridlist("Business Area Definitions");
          ba.searchBA("updateBA", "Business Definition");
        }
      );
    });
  }
);
