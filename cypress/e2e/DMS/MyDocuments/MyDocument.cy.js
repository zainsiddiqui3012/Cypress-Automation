import MyDocumentsPage from "../../../support/POM/DMS/MYDocuments/MyDocumentsPage";
import MyDocumentsHelpers from "../../../support/POM/DMS/helpers/MyDocumentsHelper";
import data from "../../../fixtures/DMS/MyDocuments/MyDocuments.json";
import dayjs from "dayjs";

const myDocumentsPage = new MyDocumentsPage();
const myDocumentsHelpers = new MyDocumentsHelpers();

describe("My Documents Test Suite", { tags: ["@regression", "@dms", "@my-documents","@pd45973","@pd42963"] }, () => {
  const rootFolderFilePath = "cypress/attachment/";
  let timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
  const testFolder = `ZZTest_Folder_${timestamp}`;
  const renamedFolder = `ZZTest_Folder_Renamed_${timestamp}`;
  const renamedFile = `aRenamedFile_${timestamp}`;
  const subfolderName = `ZZSubfolder_${timestamp}`;

  const session = () => {
    const dmUser1 = Cypress.env("documentManagement").dmUser;
    cy.loginWithSession(
      "login with Document Management User",
      dmUser1.username,
      dmUser1.password,
      dmUser1.key
    );
    cy.visitMyDocument();
  };

  context("Folder Operations", { tags: "@folder-operations" }, () => {
    beforeEach(() => {
      session();
      myDocumentsHelpers.switchToIframe();
    });
    it(
      "Ensure that the user can Bookmark a folder within an existing folder using the three-dot button.",
      { tags: ["@pd45988","@smoke"] },
      () => {
        // First create a folder
        myDocumentsPage.testCreateFolder(testFolder);

        // Then bookmark it
        myDocumentsPage.testBookmarkFolder(testFolder);
      }
    );

    it(
      "Ensure that the user can rename a folder name using the three-dot button.",
      { tags: ["@pd45977","@smoke"] },
      () => {
        // First create a folder
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const testFolder = `ZZTest_Folder_${timestamp}`;
        myDocumentsPage.testCreateFolder(testFolder);

        // Then rename it
        myDocumentsPage.testRenameFolder(testFolder, renamedFolder);
      }
    );

    it(
      "Ensure that the user can delete a folder, subfolder and files using the three-dot button.",
      { tags: ["@pd45985","@smoke"] },
      () => {
        // First create a folder
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const testFolder = `ZZTest_Folder_${timestamp}`;
        myDocumentsPage.testCreateFolder(testFolder);

        // Then delete it
        myDocumentsPage.testDeleteItem(testFolder);
      }
    );

    it(
      "Ensure that the user can create a subfolder within an existing folder using the three-dot button.",
      { tags: ["@pd45987","@smoke"] },
      () => {
        // First create parent folder
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const testFolder = `ZZTest_Folder_${timestamp}`;
        myDocumentsPage.testCreateFolder(testFolder);

        // Then create subfolder
        myDocumentsPage.testCreateSubfolder(testFolder, subfolderName);
      }
    );

    it(
      "Ensure that the user can Move folder using the three-dot button.",
      { tags: ["@pd45979"] },
      () => {
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const folderToMove = `ZZTest_Folder_${timestamp}`;

        // Create folders
        myDocumentsPage.testCreateFolder(folderToMove);

        // Move folder
        myDocumentsPage.testMoveFolder(folderToMove, testFolder);
      }
    );

    it(
      "Validate that user must be able to create Folder via three dot button.",
      { tags: ["@pd45983","@smoke"] },
      () => {
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const testFolder = `ZZTest_Folder_${timestamp}`;
        myDocumentsPage.testCreateFolder(testFolder);
      }
    );
  });

  context("File Operations", { tags: "@file-operations" }, () => {
    beforeEach(() => {
      session();
      myDocumentsHelpers.switchToIframe();
    });

    it(
      "Validate that the user must be able to Tag the uploaded file via the three-dot button",
      { tags: "@pd45986" },
      () => {
        const tags = ["1x_tag", "2y_tag"];
        //create new Folder
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const testFolder = `ZZTest_Folder_${timestamp}`;
        myDocumentsPage.testCreateFolder(testFolder);

        // Tag file
        myDocumentsPage.testTagFile(testFolder, data.files.tagFile, tags);
      }
    );

    it(
      "Validate that the user must be able to delete the uploaded file via the three-dot button.",
      { tags: ["@pd45980","@smoke"] },
      () => {
        // Upload file
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          data.uploadFilepaths.deleteFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Delete file
        myDocumentsPage.testDeleteFile(data.files.deleteFile);
      }
    );

    it(
      "Validate that the user must be able to rename the uploaded file via the three-dot button.",
      { tags: "@pd45976" },
      () => {
        // Upload file
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          data.uploadFilepaths.deleteFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Rename file
        myDocumentsPage.testRenameFile(data.files.deleteFile, renamedFile);
      }
    );

    it(
      "Validate that the user must be able to upload the files via Add button when creating a folder.",
      { tags: ["@pd45982","@smoke"] },
      () => {
        const filePaths = [
          `${rootFolderFilePath}importFile.csv`,
          `${rootFolderFilePath}KRI_Data_Template.xlsx`,
        ];
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const fileNames = ["importFile", "KRI_Data_Template"];
        const parentFolder = `testUploadFilesFolder_${timestamp}`;
        myDocumentsPage.testUploadFilesInNewFolder(
          parentFolder,
          filePaths,
          fileNames
        );
      }
    );

    it(
      "Validate that the user must be able to set expiration on uploaded file via the three-dot button",
      { tags: "@pd45989" },
      () => {
        const expirationDate = "2025-12-31";

        // Upload file
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          data.uploadFilepaths.expirationFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Set expiration
        myDocumentsPage.testSetFileExpiration(
          data.files.expirationFile,
          expirationDate
        );
      }
    );

    it(
      "Validate that the user must be able to bookmark the upload file via the three-dot button.",
      { tags: "@pd45978" },
      () => {
        // Upload file
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          data.uploadFilepaths.expirationFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Bookmark file
        myDocumentsPage.testBookmarkFile(data.files.expirationFile);
      }
    );

    it(
      "Validate that the user must be able to Unbookmark the upload file via the three-dot button.",
      () => {
        // Unbookmark file
        myDocumentsPage.testUnBookmarkFile(data.files.expirationFile);
      }
    );

    it(
      "Validate that the user must be able to Pin the uploaded file via the three-dot button.",
      { tags: ["@pd45981","@smoke"] },
      () => {
        // Upload file
        myDocumentsHelpers.clickAddButton();
        myDocumentsHelpers.uploadFile(
          data.uploadFilepaths.testFilePath
        );
        myDocumentsHelpers.closeUploadModal();

        // Pin file
        myDocumentsPage.testPinFile(data.files.testFile);
      }
    );

    it(
      "Validate that the user must be able to UnPin the uploaded file via the three-dot button.",
      { tags: "@smoke" },
      () => {
        // UnPin file
        myDocumentsPage.testUnpinFile(data.files.testFile);
      }
    );

    it(
      "Validate that the user must be able to move document via the three-dot button.",
      { tags: ["@pd45975"] },
      () => {
        // Create destination folder
        timestamp = dayjs().format("YYYY_MM_DD_HH_mm_ss_SSS");
        const movedFolderName = `Test_Move_Destination_${timestamp}`;
        myDocumentsPage.testCreateFolder(movedFolderName);
        //create Another Folder
        const testFolder2 = `Test_Expand_Folder_${timestamp}`;
        cy.reload(true);
        myDocumentsHelpers.switchToIframe();
        myDocumentsHelpers.gridFullyLoaded();
        myDocumentsPage.testCreateFolder(testFolder2);

        // Move document
        myDocumentsPage.testMoveDocument(
          data.files.moveFile,
          movedFolderName,
          testFolder2
        );
      }
    );
  });
});
