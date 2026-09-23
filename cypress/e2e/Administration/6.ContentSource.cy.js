import Assessment from "../../support/POM/Administration/Assessment";
import assessmentData from "../../fixtures/Administration/Assessments_PAP.json";
import ContentSource from "../../support/POM/Administration/ContentSource";
import contentSourceData from "../../fixtures/Administration/ContentSource.json";

describe("E2E Automation of Content Source from None Space",
    {tags:["@none-space","@administration","@content-source","@pd31781","@regression"]}, () => {
  const assessment = new Assessment();
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

  it("Verify Content Source Modal and Addition of New Content Source",
    {tags:["@smoke","@add","@pd31948","@pd31949","@pd31952","@pd31954","@pd31957"]}, () => {
    assessment.contentSource(qbSummaryForm.add.type.addContentLibrary);
  });

  it("Verify that users can edit an existing content source.",
    {tags:["@edit","@pd31954","@pd31955","@pd31957"]},()=>{
    cy.visitContentSource()
    contentSource.updateContentSource("ContentSource")
  })

  it("Verify if adding a content source with duplicate names shows an error message.",
    {tags:"@pd31950"}, () => {
    contentSource.checkForDuplicateName(
      qbSummaryForm.add.type.addContentLibrary.contentSourceName,
      qbSummaryForm.add.type.addContentLibrary.contentSourceDescription
    );

  });

  it("Verify that users can select the Active or Inactive status.",
    {tags:["@pd31951","@pd31959"]}, () => {
    cy.visitContentSource()
    contentSource.updateContentSource("ContentSource")
    contentSource.toggleBtns();
  });

  it("Verify if users can filter content sources by name.",
    {tags:["@pd31953","@filter"]}, () => {
    cy.visitContentSource();
    contentSource.searchWithFilterName(
      -3,
      "ContentSource",
      "contentSourceName"
    );
  });

  it("Verify if the status filter works correctly.",
    {tags:["@pd31958","@filter"]}, () => {
    contentSource.searchWithFilterStatus(-1, "ContentSource", "Inactive");
  });
});
