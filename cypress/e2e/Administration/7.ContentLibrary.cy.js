import Assessment from "../../support/POM/Administration/Assessment";
import assessmentData from "../../fixtures/Administration/Assessments_PAP.json";
import ContentLibrary from "../../support/POM/Administration/ContentLibary";
import ContentSource from "../../support/POM/Administration/ContentSource";
import contentLibraryData from "../../fixtures/Administration/ContentLibrary.json";

describe(
  "E2E Automation of Content Library from None Space",
  { tags: ["@none-space", "@administration", "@content-iibrary", "@pd31969","@regression"] },
  () => {
    const assessment = new Assessment();
    const contentLibrary = new ContentLibrary();
    const contentSource = new ContentSource();
    const qbSummaryForm = assessmentData.questionBank.qbSummaryForm;
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
    });

    it(
      "Verify Content Library Modal and Addition of New Content Library",
      { tags: ["@smoke", "@add", "@pd31973", "@pd31974","@pd31981"] },
      () => {
        assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
      }
    );

    it(
      "Verify if adding a content source with duplicate names shows an error message.",
      { tags: ["@pd31977","@pd31978","@pd31979"] },
      () => {
        assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary, false, true)
      }
    );

    it(
      "Verify that users can edit an existing content source.",
      { tags: ["@smoke","@edit", "@pd31982"] },
      () => {
        cy.visitContentLibrary();
        contentLibrary.updateContentLibrary();
      }
    );

    it("Verify if users can change the status of a content library.",
      {tags:["@pd31980"]}, () => {
      cy.visitContentLibrary();
      assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
      contentLibrary.toggleBtns();
    });

    it(
      "Verify if users can filter content Library by name.",
      { tags: ["@pd32256", "@filter"] },
      () => {
        cy.visitContentLibrary();
        contentSource.searchWithFilterName(
          6,
          "ContentLibrary",
          "contentLibraryName"
        );
      }
    );

    it(
      "Verify if users can filter content libraries by description.",
      { tags: ["@filter","@pd32257"] },
      () => {
        cy.visitContentLibrary();
        contentLibrary.searchWithFilterDescription();
      }
    );

    it(
      "Verify if users can filter content libraries by status.",
      { tags: ["@filter","@pd32258","@pd32259"] },
      () => {
        cy.visitContentLibrary()
        assessment.contentLibrary(qbSummaryForm.add.type.addContentLibrary);
        contentLibrary.searchWithFilterStatus();
        contentSource.searchWithFilterName(
            6,
            "ContentLibrary",
            "contentLibraryName"
          );
        contentLibrary.searchWithFilterDescription();
      }
    );

    it("Verify if the Import modal can be closed without performing any action.",
      {tags:["@import","@pd32264"]},()=>{
        cy.visitContentLibrary();
        contentLibrary.openImportModal()
        contentLibrary.closeImportModal()
    })

    it("Verify if the Import option is visible and clickable.",
      {tags:["@import","@pd32260","@pd32261","@pd32265"]},()=>{
        cy.visitContentLibrary()
        contentLibrary.openImportModal()
    })

    it("Verify that the Download File link is displayed and clickable.",
      {tags:["@import","@pd32266","@pd32267"]},()=>{
        cy.visitContentLibrary()
        contentLibrary.openImportModal()
        contentLibrary.checkForDownloadFileLink()
    })

    it("Verify if uploading an invalid file format shows an error message.",
      {tags:["@import","@pd32263","@pd32268","@pd32269"]},()=>{
        cy.visitContentLibrary()
        contentLibrary.openImportModal()
        contentLibrary.uploadFileImportModal(contentLibraryData.invalidFormatFile)
    })

    it("Verify if the system validates the file format upon upload.",
      {tags:["@import","@pd32270","@pd32269","@pd32275"]},()=>{
        cy.visitContentLibrary()
        contentLibrary.openImportModal()
        contentLibrary.uploadFileImportModal(contentLibraryData.validFileName)
    })

    it("Verify if large files (e.g., > 10 MB) are handled correctly during import.",
      {tags:["@import","@pd32274","@pd32270","@pd32275","@pd32276","@pd32277"]},()=>{
        cy.visitContentLibrary()
        contentLibrary.openImportModal()
        contentLibrary.uploadFileImportModal(contentLibraryData.exceedSizeFileName)
    })
  }
);
