import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import SoxPre from "../../../fixtures/SoxReview/PreRequisites.json";

export default class PreRequisites_PO {
  // Navigates to the Organizational Hierarchy page via the left menu.
  OHMenu() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.menu.organizationalHierarchy).click();
  }
  // Adds a new parent Business Unit (BU).
  addBUParent(
    ParentName,
    CEOProcesOwner = null,
    PresidentprocessOwner = null,
    flag = false,
    duplicate = false
  ) {
    const timeStamp = dayjs().format("MM-DD-YYYY h:mm:ss A");
    const finalName = ParentName + timeStamp;
    cy.get(locators.administration.organizationalHierarchy.addBtn).click();
    cy.get(locators.administration.organizationalHierarchy.nameInput).type(
      SoxPre.nameTypeText
    );
    cy.get(locators.administration.organizationalHierarchy.nameInput).type(
      finalName
    );

    cy.get(locators.administration.organizationalHierarchy.saveBtn).click();
    if (duplicate === false) {
      cy.get(locators.administration.organizationalHierarchy.buSpan, {
        timeout: 50000,
      }).should("contain", finalName);
    }
    if (flag === false) {
      cy.waitForElementToVisible(
        locators.administration.organizationalHierarchy.ceoDropdown,
        10000
      );
      cy.get(
        locators.administration.organizationalHierarchy.ceoDropdown
      ).click();
      cy.get(locators.administration.organizationalHierarchy.ceoDropdownsearch)
        .type(CEOProcesOwner)
        .type("{enter}");
      cy.get(
        locators.administration.organizationalHierarchy.presidentdropdown
      ).click();
      cy.get(
        locators.administration.organizationalHierarchy.presidentdropdownsearch
      )
        .type(PresidentprocessOwner)
        .type("{enter}");

      cy.get(locators.administration.organizationalHierarchy.saveBtn).click();
    }
  }
  // Adds a new child Business Unit under an existing parent.
  addChildBU(childBUSingle) {
    cy.get(locators.administration.organizationalHierarchy.addBtn).click();
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const finalName = childBUSingle + timeStamp;
    cy.get(locators.administration.organizationalHierarchy.nameInput)
      .clear()
      .type(finalName);

    cy.get(locators.administration.organizationalHierarchy.expandFormEdit, {
      timeout: 10000,
    })
      .first()
      .should("be.visible")
      .click({ force: true });

    //need to add static wait until all childs does not comesup Dynamic loader were not working here
    cy.wait(5000);
    cy.get(locators.administration.organizationalHierarchy.selectParent, {
      timeout: 10000,
    })
      .last()
      .click();

    cy.get(locators.administration.organizationalHierarchy.saveBtn).click();
    cy.get(locators.administration.organizationalHierarchy.closebutton).click();
    cy.get(locators.administration.organizationalHierarchy.buSpan, {
      timeout: 50000,
    }).should("contain", finalName);
  }

  // Edits the name and parent of an existing child Business Unit.
  editChildBU() {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const finalName = `${SoxPre.childName} ${timeStamp}`;
    cy.get(locators.administration.organizationalHierarchy.nameInput, {
      timeout: 10000,
    })
      .clear()
      .type(finalName);

    cy.get(locators.administration.organizationalHierarchy.expandFormEdit, {
      timeout: 30000,
    })
      .wait(3000)
      .eq(0)
      .should("be.visible")

      .click();

    cy.get(locators.administration.organizationalHierarchy.childOpen)
      .last()
      .scrollIntoView()
      .should("be.visible")
      .click();

    cy.get(locators.administration.organizationalHierarchy.saveBtn)
      .first()
      .click();
    cy.get(locators.administration.organizationalHierarchy.buSpan, {
      timeout: 50000,
    }).should("contain", finalName);
  }
  // Clicks on the "Expand All" button to expand the BU hierarchy tree.
  clickExpandAllBtn() {
    cy.contains("div", SoxPre.expandAll)
      .should("be.visible")
      .click({ force: true });
    cy.wait(2000);
  }
  // Opens the edit screen for a child BU under the expanded parent.
  updateChildBU() {
    cy.get(locators.administration.organizationalHierarchy.ExpandAll).click();
    cy.get(locators.administration.organizationalHierarchy.parentExpand)
      .first()
      .click({force:true});

    cy.get(locators.administration.organizationalHierarchy.editChildBU, {
      timeout: 20000,
    })
      .first()
      .click({force:true});
  }
  // Adds a new Question Bank (QB) with one question and associated risk values.
  AddQB(QBName, QuestionText) {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.administration.Assessment).click();
    cy.get(locators.administration.QuestionBanks).click();
    cy.get(locators.administration.MyQuestionBanks).click();
    cy.get(locators.administration.QB.qbAdd).click();
    cy.get(locators.administration.QB.qbName).type(QBName);
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);
    cy.get(locators.administration.QB.qbName).type(timeStamp);
    const qbName = QBName + timeStamp;

    cy.get(locators.administration.QB.frameworkDropown).click();
    cy.get(locators.administration.QB.frameWorkValue).click();
    cy.get(locators.administration.QB.saveBtn).click();
    cy.get(locators.administration.QB.qbTab).click();
    cy.get(locators.administration.QB.addQuestion).click();
    cy.get(locators.administration.QB.questionText).type(QuestionText);
    cy.get(locators.administration.QB.beAbletoUpload).click({ multiple: true });
    cy.get(locators.administration.QB.mandatory).click();
    cy.get(locators.administration.QB.responseRequired).click();
    cy.get(locators.administration.QB.commentCheckbox).click();
    cy.get(locators.administration.QB.highRiskLimit).click();
    cy.get(locators.administration.QB.highRiskLimitSearch).type("{enter}");
    cy.get(locators.administration.QB.highRiskValue).type(SoxPre.highRiskValue);

    cy.get(locators.administration.QB.lowRiskLimit).click();
    cy.get(locators.administration.QB.lowRiskLimitSearch)
      .type(SoxPre.lowRiskOperator)
      .type("{enter}");
    cy.get(locators.administration.QB.lowRiskValue).type(SoxPre.lowRiskValue);

    cy.get(locators.administration.QB.addResponse).click();
    cy.get(locators.administration.QB.addResponse).click();

    cy.get(locators.administration.QB.highRiskDesc).type(
      SoxPre.highRiskDescription
    );
    cy.get(locators.administration.QB.highRiskRValue).type(
      SoxPre.highRiskResponse
    );

    cy.get(locators.administration.QB.mediumRiskDesc).type(
      SoxPre.mediumRiskDescription
    );
    cy.get(locators.administration.QB.mediumRiskRValue).type(
      SoxPre.mediumRiskResponse
    );

    cy.get(locators.administration.QB.lowRiskDesc).type(
      SoxPre.lowRiskDescription
    );
    cy.get(locators.administration.QB.lowRiskRValue).type(
      SoxPre.lowRiskResponse
    );

    cy.get(locators.administration.QB.resonseSave).click();
    cy.get(locators.administration.organizationalHierarchy.toastMsg, {
      timeout: 5000,
    }).should("be.visible");

    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (file) => {
        file.QBname = qbName;
        cy.writeFile("cypress/fixtures/SoxReview/savedQBTemplate.json", file);
      }
    );
  }

  // Publishes the previously added Question Bank.
  PublishQB() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.administration.Assessment).click();
    cy.get(locators.administration.QuestionBanks).click();
    cy.get(locators.administration.MyQuestionBanks).click();

    cy.waitForTopMsgLoaderToDisappear(70000);
    cy.waitForMyGridLoaderToDisappearForQB(60000);
    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (fileRead) => {
        cy.get(locators.administration.QB.searchQuestionBankFramework)
          .find(locators.administration.organizationalHierarchy.headerName)
          .eq(1)
          .find(locators.administration.organizationalHierarchy.headerCell)
          .eq(2)
          .should("exist")
          .within(() => {
            cy.get(
              locators.administration.organizationalHierarchy.inputFloating
            )
              .should("exist")
              .clear()
              .type(fileRead[SoxPre.qbName], { delay: 250 })
              .wait(700)
              .type("{enter}");
          });
      }
    );

    cy.get(locators.administration.QB.threeelipses).click();

    cy.get(locators.administration.QB.selectPublish).click();

    cy.wait(50000);
  }
  // Adds a new assessment template and associates it with a Question Bank.
  AddTemplate(TemplateName, SectionName, QBName = false) {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.administration.Assessment).click();
    cy.get(locators.administration.Template).click();
    cy.get(locators.administration.template.addBtn).click();

    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);
    const fullName = TemplateName + timeStamp;
    cy.get(locators.administration.template.templateName).type(fullName);
    cy.get(locators.administration.template.continueBtn).click();
    cy.wait(4000);
    cy.get(locators.administration.template.addSection).click();
    cy.wait(4000);
    cy.get(locators.administration.template.templateName).type(SectionName);
    cy.get(locators.administration.template.totalQuestionOfHighRisk).type(
      SoxPre.typeOne
    );
    cy.get(locators.administration.template.totalQuestionOfMediumRisk).type(
      SoxPre.typeOne
    );

    cy.get(locators.administration.template.saveSection).click();
    cy.get(locators.administration.template.associateQB).click();

    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (fileRead) => {
        cy.get(locators.administration.template.searchQB)
          .click()
          .clear()
          .type(fileRead.QBname, { force: true })
          .type("{enter}")
          .wait(3000);
      }
    );

    cy.waitForTopMsgLoaderToDisappear(30000);
    cy.get(
      locators.administration.organizationalHierarchy.frameworkListing
    ).should("have.length", 1);
    cy.get(locators.administration.template.selectQB).click();
    cy.get(locators.administration.template.saveQB).click();
    cy.wait(3000);
    cy.get(locators.administration.organizationalHierarchy.toastMsg).should(
      "be.visible"
    );

    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (fileRead) => {
        fileRead[SoxPre.templateName] = fullName;
        cy.writeFile(
          "cypress/fixtures/SoxReview/savedQBTemplate.json",
          fileRead
        );
      }
    );
  }
  // Selects and saves a template for SOX Review Questionnaire.
  SelectTemplate() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.ComplianceManagement).click();
    cy.get(locators.menu.administrationRisk).click();
    cy.get(locators.cms.administration.SOXReviewQuestionnaire).click();
    cy.get(locators.cms.administration.SoxReview.AssessmentTemplate).click();
    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (fileRead) => {
        cy.get(locators.cms.administration.SoxReview.TemplateSearch)
          .type(fileRead.templateName)
          .wait(1500)
          .type("{enter}");
      }
    );
    cy.get(locators.cms.administration.SoxReview.SaveTemplate).click({
      force: true,
    });
    cy.wait(3000);
    cy.get(locators.administration.organizationalHierarchy.toastMsg).should(
      "be.visible"
    );
  }
  // Publishes a previously created and saved template.
  PublishTemplate() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.administration).click();
    cy.get(locators.administration.Assessment).click();
    cy.get(locators.administration.Template).click();

    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.waitForMyGridLoaderToDisappearForQB(60000);
    cy.readFile("cypress/fixtures/SoxReview/savedQBTemplate.json").then(
      (fileRead) => {
        cy.get(locators.administration.template.searchedFrameWork)
          .children()
          .eq(1) // Select the first child
          .within(() => {
            cy.get(locators.administration.organizationalHierarchy.filterInput)
              .should("exist")
              .type(fileRead.templateName, { delay: 200 })
              .wait(1000)
              .type("{enter}");
          });
      }
    );

    cy.get(locators.administration.template.templateThreeElipses).click();
    cy.get(locators.administration.template.publishTemplate).click();
    cy.wait(5000);
  }
  // Adds a process owner to a Business Unit.
  addProcessOwner(ParentName) {
    const timeStamp = dayjs().format("MM-DD-YYYY h:mm:ss A");
    const finalName = ParentName + timeStamp;

    cy.get(locators.administration.organizationalHierarchy.addBtn).click();

    cy.get(locators.administration.organizationalHierarchy.nameInput).type(
      `${SoxPre.nameTypeText}`
    );
    cy.get(locators.administration.organizationalHierarchy.nameInput).type(
      finalName
    );

    cy.get(
      locators.administration.organizationalHierarchy.processOwnerClick
    ).click();
    cy.get(locators.administration.organizationalHierarchy.processOwnerOption)
      .clear()
      .type(`${Cypress.env("USER").ONE_FINANCE.username}{enter}`);
  }
  // Updates or edits an existing process owner for a BU.
  addProcessOwnerEditing() {
    cy.get(
      locators.administration.organizationalHierarchy.processOwnerClick
    ).click();
    cy.get(
      locators.administration.organizationalHierarchy.processOwnerOption
    ).type(`${Cypress.env("USER").ONE_FINANCE.username}{enter}`);
  }
}
