import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import Reseller from "./Reseller";
// let assessment = require("../../../fixtures/Administration/Assessments.json");
let assessment;
const resellerData = require("../../../fixtures/Administration/Resellers.json");
const customerData = require("../../../fixtures/Administration/Customers.json");
// let assessmentString = "cypress/fixtures/Administration/Assessments.json";
let assessmentString = "";
const resellerString = "cypress/fixtures/Administration/Resellers.json";
const reseller = new Reseller(); 
class Assessment {
  waits = Cypress.env("waits");
  //********************** */ FOR Creation of the Question Bank********************//

  /**
   * addFramrwork wil be used in the QB, it will add the framework in Question bank summary form
   * @param {String} frameworkName is frameworkName
   * @param {String} frameworkDescription  is framrwork optional description field
   */
  addFrameWork(frameworkName, frameworkDescription) {
    cy.get(locators.administration.frameWork.frameWorkNameField)
      .should("be.visible")
      .and(
        "have.attr",
        "maxlength",
        assessment.questionBank.qbSummaryForm.add.frameworkDetails.maxLengthName
      );
    cy.get(locators.administration.frameWork.frameWorkDescription)
      .should("be.visible")
      .and(
        "have.attr",
        "maxlength",
        assessment.questionBank.qbSummaryForm.add.frameworkDetails
          .maxLengthDescription
      );
    cy.get(locators.administration.QB.qbName)
      .should("be.visible")
      .clear()
      .type(frameworkName);
    this.typeOptionalEmptyFieldCondition(
      frameworkDescription,
      locators.administration.frameWork.frameWorkDescription
    );
    cy.readAndWriteData("qbImport Framework", frameworkName);
    cy.readAndWriteData("templateImport Framework", frameworkName);
  }

  /**
   * sourceAndLibrary will be used when creating content source and content libraries
   * this will be used in both resellers and customers
   * @param {String} name is content source/ content library name
   * @param {String} description is optional content source/ content libary description
   */
  sourceAndLibrary(name, description, duplicate = false) {
    //click on Add Source/ Add Library btn.
    cy.get(locators.administration.contentSource.addContentSource).click();

    //type source/library name in grid.
    cy.get(locators.administration.contentSource.contentSourceName)
      .eq(1)
      .wait(900)
      .dblclick();
    cy.get(
      locators.administration.contentSource.contentSourceDescriptionTextArea
    )
      .type(name)
      .tab()
      .tab();

    //search the content source/ content library in search text box
    cy.get(locators.general.searchTextField)
      .eq(0)
      .dblclick({ force: true })
      .wait(1000)
      .type(name)
      .type("{enter}");

    if (description != "") {
      duplicate
        ? cy
            .get(locators.administration.contentSource.contentSourceDescription)
            .should("have.length", 3)
            .eq(1)
            .dblclick({ force: true })
        : cy
            .get(locators.administration.contentSource.contentSourceDescription)
            .should("have.length", 2)
            .eq(1)
            .dblclick({ force: true });

      cy.get(
        locators.administration.contentSource.contentSourceDescriptionTextArea
      )
        .clear()
        .type(description)
        .tab();
    }
  }

  /**
   * contentSource will be used for creating content source from Administration
   * @param {Object} clibrary is the object from test Data files of (resellers.json, customers.json)
   * @param {Boolean} customer will be true if user is creating content source for customer use it will update the customer test data
   */
  contentSource(clibrary, customer = false) {
    if (clibrary.isRequired) {
      cy.visitContentSource();
      cy.waitForLoaderToDisappear("myGrid", this.waits.mediumWait);
      cy.get(locators.administration.contentSource.contentSourceGrid).should(
        "have.length.greaterThan",
        0
      );
      cy.createRandomString(5).then(($el) => {
        this.sourceAndLibrary(
          "test Source" + " " + $el,
          clibrary.contentSourceDescription
        );
        let customerPath = "cypress/fixtures/Administration/Customers.json";
        if (customer) {
          cy.readFile(customerPath).then((file) => {
            file["customerProfileData"]["contentLibrary"]["contentSourceName"] =
              "test Source" + " " + $el;
            cy.writeFile(customerPath, file);
          });
        } else {
          cy.readFile(assessmentString).then((file) => {
            file["questionBank"]["qbSummaryForm"]["add"]["type"][
              "addContentLibrary"
            ]["contentSourceName"] = "test Source" + " " + $el;
            cy.writeFile(assessmentString, file);
          });

          //add the content source name in Customers.json as content source is created on reseller and the same content source will be assign to its customer
          cy.readFile(customerPath).then((file) => {
            file.customerProfileData.contentLibrary.contentSourceName =
              "test Source" + " " + $el;
            cy.writeFile(customerPath, file);
          });

          //add the content source name in ContentSource.json
          cy.readFile(
            "cypress/fixtures/Administration/ContentSource.json"
          ).then((file) => {
            file.contentSourceName = "test Source" + " " + $el;
            cy.writeFile(
              "cypress/fixtures/Administration/ContentSource.json",
              file
            );
          });
        }
      });
      //verify that content source is added successfully with the toast error msg
      cy.verifyToastMessageText(clibrary.saveSuccessMsg, this.waits.mediumWait);
    }
  }

  // scrollUntillEnd will be used for selecting the newly created content source in content libarary screen
  scrollUntilEnd(selectMultipleContentLibrary = false) {
    cy.get(
      locators.administration.contentSource.contentSourceDropdownElements,
      { timeout: Cypress.env("waits").mediumWait }
    )
      .should("be.visible")
      .last()
      .scrollIntoView()
      .wait(500)
      .then(($lastBefore) => {
        cy.get(
          locators.administration.contentSource.contentSourceDropdownElements
        )
          .last()
          .then(($lastAfter) => {
            if ($lastBefore[0] !== $lastAfter[0]) {
              this.scrollUntilEnd(selectMultipleContentLibrary); // Continue scrolling if a new element appears
            } else {
              if (selectMultipleContentLibrary) {
                cy.wrap($lastAfter).prev().click(); // Click on the second last element
              } else {
                cy.wrap($lastAfter).click(); // Click on the last element
              }
            }
          });
      });
  }

  /**
   * contentLibrary will be used for creating content library from Administration
   * @param {Object} clibrary is the object from test Data files of (resellers.json, customers.json)
   * @param {Boolean} customer will be true if user is creating content library for customer use it will update the customer test data
   * @param {Boolean} duplicate will be true if user wants to check that content library should not be duplicated when creating
   */
  contentLibrary(clibrary, customer = false, duplicate = false) {
    if (clibrary.isRequired) {
      cy.visitContentLibrary();
      cy.waitForLoaderToDisappear("myGrid", this.waits.mediumWait);
      cy.get(locators.administration.contentSource.contentSourceGrid).should(
        "have.length.greaterThan",
        0
      );
      cy.createRandomString(5).then(($el) => {
        // if new content library is required (duplicate === False)
        if (!duplicate) {
          this.sourceAndLibrary(
            "test Library" + " " + $el,
            clibrary.contentLibraryDescription
          );
        }
        // duplicate param === True (add duplicate content library and desciption to check it should not be added successfully)
        else {
          cy.readFile(
            "cypress/fixtures/Administration/ContentLibrary.json"
          ).then((contentLibraryTestData) => {
            this.sourceAndLibrary(
              contentLibraryTestData.contentLibraryName,
              clibrary.contentLibraryDescription,
              true
            );
          });
        }
        if (customer) {
          let customerPath = "cypress/fixtures/Administration/Customers.json";
          cy.readFile(customerPath).then((file) => {
            file["customerProfileData"]["contentLibrary"][
              "contentLibraryName"
            ] = "test Library" + " " + $el;
            let updatedContentLibraryName =
              file["customerProfileData"]["contentLibrary"][
                "contentLibraryName"
              ];
            file["customerProfileData"]["riskTaxanomy"]["contentLibraryName"] =
              updatedContentLibraryName;
            file["customerProfileData"]["controlTaxanomy"][
              "contentLibraryName"
            ] = updatedContentLibraryName;
            cy.writeFile(customerPath, file);
          });
        } else {
          const updateContentLibrary = (file, section) => {
            file["questionBank"]["qbSummaryForm"][section]["type"][
              "addContentLibrary"
            ]["contentLibraryName"] = "test Library" + " " + $el;
            file["questionBank"]["qbSummaryForm"][section]["type"][
              "contentLibrary"
            ] = "test Library" + " " + $el;
            file["template"]["templateSurveyForm"]["type"]["contentLibrary"] =
              "test Library" + " " + $el;
          };

          cy.readFile(assessmentString).then((file) => {
            ["add", "update"].forEach((section) => {
              updateContentLibrary(file, section);
            });
            cy.writeFile(assessmentString, file);
          });

          cy.readFile("cypress/fixtures/Administration/Customers.json").then(
            (customerFile) => {
              let libraryName = "test Library" + " " + $el;
              customerFile["customerProfileData"]["riskTaxanomy"][
                "contentLibraryName"
              ] = libraryName;
              customerFile["customerProfileData"]["controlTaxanomy"][
                "contentLibraryName"
              ] = libraryName;
              customerFile["customerProfileData"]["contentLibrary"][
                "contentLibraryName"
              ] = libraryName;
              cy.writeFile(
                "cypress/fixtures/Administration/Customers.json",
                customerFile
              );
            }
          );
          //add the content Library name in ContentLibrary.json if duplicate === false (write only when new contentLibrary is added)
          if (!duplicate)
            cy.readFile(
              "cypress/fixtures/Administration/ContentLibrary.json"
            ).then((file) => {
              file.contentLibraryName = "test Library" + " " + $el;
              cy.writeFile(
                "cypress/fixtures/Administration/ContentLibrary.json",
                file
              );
            });

          cy.readAndWriteData("BusinessArea", "test Library" + " " + $el);
          cy.readAndWriteData(
            "qbImport ContentLibrary",
            "test Library" + " " + $el
          );
          cy.readAndWriteData(
            "templateImport ContentLibrary",
            "test Library" + " " + $el
          );
        }
      });
      cy.get(
        locators.administration.contentSource.selectContentSourceDropdown
      ).dblclick();
      this.scrollUntilEnd();
      // check the toast msg if content library is duplicate else the toast msg will be changed,
      duplicate
        ? cy.verifyToastMessageText(
            clibrary.duplicateMsg,
            this.waits.mediumWait
          )
        : cy.verifyToastMessageText(
            clibrary.saveSuccessMsg,
            this.waits.mediumWait
          );
    }
  }

  createAddFrameWork(frameWorkRequired, qbSummaryForm, isCustomerSpace=false) {
    if (!frameWorkRequired) return;

    const { frameworkDescription } = qbSummaryForm.frameworkDetails;
    cy.visitFramework();
    cy.get(locators.general.clickAddBtn).click();
    cy.createRandomString(9).then((randomName) => {
      cy.readFile(assessmentString).then((file) => {
        const frameWorkBaseName =
          file.questionBank.qbSummaryForm.add.frameworkDetails.baseName;
        const updatedFrameWorkName =
          frameWorkBaseName + dayjs().format("YYYY-MM-DD HH:mm:ss");
        this.addFrameWork(updatedFrameWorkName, frameworkDescription);
        cy.get(locators.administration.QB.saveBtn).click();
        if(!isCustomerSpace){
        file.questionBank.qbSummaryForm.add.frameworkDetails.frameworkName =
          updatedFrameWorkName;
        file.questionBank.qbSummaryForm.add.framework = updatedFrameWorkName;
        }
        else{
        file.questionBank.qbSummaryForm.add.frameworkDetails.frameworkNameCustomer =
          updatedFrameWorkName;
        file.questionBank.qbSummaryForm.add.frameworkCustomer = updatedFrameWorkName;
        }
        cy.writeFile(assessmentString, file);
      });
    });
  }

  writeQBNameSurveyID(sectionName) {
    cy.createRandomString(15).then((randomString) => {
      cy.readFile(assessmentString).then((file) => {
        let questionBankName =
          file.questionBank.qbSummaryForm[sectionName].baseName +
          `${randomString}`;
        cy.get(locators.administration.QB.qbName)
          .clear({ force: true })
          .type(questionBankName);
        file.questionBank.qbSummaryForm[sectionName].qbName = questionBankName;
        file.questionBank.qbSummaryForm[sectionName].type.surveyQBID =
          randomString;
        cy.writeFile(assessmentString, file);
      });
    });
  }

  /**
   * Adds Question Bank (QB) form data based on the provided parameters.
   *
   * @param {Object} qbSummaryForm - The summary form object containing configuration and options.
   * @param {string} sectionName - The name of the section to which the QB form data will be added.
   * @param {Object} type - The type object containing details about the QB form type.
   * @param {boolean} [isCustomerSpace=false] - Optional flag indicating if the operation is in customer space.
   */
  addQBFormData(qbSummaryForm, sectionName, type, isCustomerSpace=false) {
    this.addTypeQBForm(type, sectionName);

    if (
      qbSummaryForm.add.type.checkCB.withContentLibrary.includes(type.typeName)
    ) {
      this.addSurveyID(sectionName);
      if(!isCustomerSpace)
      this.addContentLibraryQBForm(type);
    }

    if (sectionName != "update") this.addFrameWorkQBForm(sectionName);
  }

  QBFormToggleStatus(qbSummaryForm, sectionName) {
    const statusLocator =
      qbSummaryForm[sectionName].status === "Active"
        ? locators.administration.resellers.activeStatus
        : locators.administration.resellers.inActiveStatus;

    cy.get(statusLocator).click({ force: true });
  }

  addTypeQBForm(type, sectionName) {
    //Select the Type based on the typeName Parameter
    sectionName === "add"
      ? cy.get(locators.administration.QB.typeDropdown).select(type.typeName)
      : cy
          .get("#s2id_questionBankTypeId")
          .should("have.class", "select2-container-disabled");
  }

  addSurveyID(sectionName) {
    cy.readFile(assessmentString).then((file) => {
      cy.get(locators.administration.QB.surveyQBID).type(
        file.questionBank.qbSummaryForm[sectionName].type.surveyQBID
      );
    });
  }

  addContentLibraryQBForm(type) {
    cy.get(locators.administration.QB.selectContentLibrary).parent().click();

    cy.get(locators.administration.QB.selectSearch)
      .eq(1)
      .clear()
      .type(type.contentLibrary, { force: true })
      .type("{enter}");
  }

  addFrameWorkQBForm(sectionName) {
    cy.readFile(assessmentString).then((file) => {
      // cy.get(locators.administration.QB.frameworkDropown).click();
      // cy.get(locators.administration.QB.selectSearch)
      //   .first()
      //   .clear({ force: true })
      //   .type(file.questionBank.qbSummaryForm[sectionName].framework, {
      //     force: true,
      //   })
      //   .type("{enter}");
      cy.get("select#frameworkIds")
      .select(file.questionBank.qbSummaryForm[sectionName].framework,{force:true});
    });
  }

  addQBFormOptionalFields(qbSummaryForm, sectionName) {
    cy.typeOptionalEmptyFieldCondition(
      qbSummaryForm[sectionName].description,
      locators.administration.QB.qbDescription
    );
    if (sectionName != "update") this.addOptionalTags(qbSummaryForm.add);
  }

  addOptionalTags(qbSummaryForm) {
    const tagInput = cy.get(locators.administration.QB.qbTag).first();
    tagInput.click({force:true}).clear({ force: true });

    qbSummaryForm.tags.filter(Boolean).forEach((tag) => {
      tagInput
        .type(` ${tag}`, { force: true, delay: 500 })
        .type("{downarrow}", { force: true, delay: 2000 })
        .type("{enter}", { force: true, delay: 500 });
    });
  }
  /**
   * Adds or updates a Question Bank (QB) summary form based on the provided data.
   *
   * @param {Object} qbSummaryForm - The data object containing QB summary form details.
   * @param {string} sectionName - The section name to determine the operation (e.g., "update" or other).
   * @param {boolean} [isDiscard=false] - If true, discards the form instead of saving it.
   * @param {boolean} [isCustomerSpace=false] - Indicates if the operation is in the customer space context.
   */
  addQBSummaryForm(qbSummaryForm, sectionName, isDiscard = false, isCustomerSpace=false) {
    const frameworkDetails = qbSummaryForm[sectionName].frameworkDetails;
    // const addContentLibrary = qbSummaryForm.type.addContentLibrary;
    const type = qbSummaryForm[sectionName].type;

    //it will create FrameWork and add the new framework name in data field if required true from json data
    if (sectionName != "update") {
      this.createAddFrameWork(
        frameworkDetails.isRequired,
        qbSummaryForm[sectionName],
        isCustomerSpace
      );

      cy.visitMyQuestionBank();
      cy.get(locators.general.clickAddBtn).click();
    }
    this.writeQBNameSurveyID(sectionName);

    this.addQBFormData(qbSummaryForm, sectionName, type, isCustomerSpace);

    // select Active only
    this.QBFormToggleStatus(qbSummaryForm, sectionName);

    //----------------- below are optional Fields that have "" empty - values ------------------
    this.addQBFormOptionalFields(qbSummaryForm, sectionName);

    isDiscard
      ? cy
          .get(locators.general.closeForm)
          .click({ force: true, multiple: true })
      : cy
          .get(locators.administration.QB.saveBtn)
          .click({ force: true, multiple: true });
  }

  /**
   * When QB template is created user needs to add questions in the QB Template
   * for HighRisk, LowRisk operator Values while creating questions
   * below function is used
   * @param {String} riskType
   * @param {String``} selectOperator is the operator of the selected Risk (e.g <)
   * @param {String} riskValue is the value of the operator (e.g < 15)
   * @param {Object} checkCB is the object from test data file assessments.json
   * @param {String} questionAssessmentType is the question Assessment type (e.g Assessments)
   */
  clickRiskValues(
    riskType,
    selectOperator,
    riskValue,
    checkCB,
    questionAssessmentType
  ) {
    const qbRiskType = riskType;
    if (
      (checkCB.includes(questionAssessmentType) ||
        questionAssessmentType === "Vendor Assessment") &&
      selectOperator != "NEVER"
    ) {
      //Enter Risk Analysis (High,Low) Parameter and values
      if (qbRiskType == "highRisk") {
        // cy.get(locators.administration.QB.highRiskLimit).click({ force: true });
        // cy.dropDownSearchAndSelect(
        //   locators.administration.QB.qbTagDropDown,
        //   selectOperator
        // );
        cy.get("select#highRiskSign")
        .select(selectOperator,{force:true});

        cy.get(locators.administration.QB.highRiskValue).type(riskValue);
      } else {
        // cy.get(locators.administration.QB.lowRiskLimit).click({ force: true });
        // cy.dropDownSearchAndSelect(
        //   locators.administration.QB.qbTagDropDown,
        //   selectOperator
        // );
        cy.get("select#lowRiskSign")
        .select(selectOperator,{force:true});
        cy.get(locators.administration.QB.lowRiskValue).type(riskValue);
      }
    }
  }

  /**
   * addQuestionaire will add response and labels in Questions
   * @param {Object} responses is the question responses
   */
  addQuestionaire(responses) {
    // Clicking on "Add" button if the questions are more than 1
    for (let i = 0; i < responses.length - 1; i++) {
      cy.get(locators.administration.QB.addResponse).click();
    }

    // Adding the question label, description, and values
    cy.get(locators.administration.QB.questionResponseSection)
      .first()
      .children()
      .each(($el, index) => {
        if (index < responses.length) {
          const response = responses[index];

          // Use cy.wrap($el).within() to ensure unique scoping for each row
          cy.wrap($el).within(() => {
            cy.get(locators.administration.QB.questionLabel)
              .clear()
              .type(response.label);
            cy.get(locators.administration.QB.questionDescription, {
              timeout: 5000,
            })
              .clear()
              .type(response.description);
            if (
              assessment.questionBank.qbSummaryForm.add.type.typeName !=
              "Simple Exception QB"
            )
              cy.get(locators.administration.QB.responseLevel, {
                timeout: 5000,
              })
                .clear()
                .type(response.score);
          });
        }
      });
  }

  //handler function
  /**
   * clickOptionalBooleanFieldCondition will be used when the test data value is boolean and not mandatory (e.g active, isConsultant)
   * @param {String} fieldName is the field value name from test data
   * @param {String} locator is the field locator
   */
  clickOptionalBooleanFieldCondition(fieldName, locator) {
    if (fieldName === true) cy.get(locator).click({ force: true });
  }

  //handler function
  /**
   * clickOptionalEmptyFieldCondition will be used when the test data value is String and not mandatory (e.g tags, Descriptions)
   * @param {String} fieldName is the field value name from test data
   * @param {String} locator is the field locator
   * it is used for clicking in optional string fields
   */
  clickOptionalEmptyFieldCondition(fieldName, locator) {
    if (fieldName != "") cy.get(locator).click({ force: true });
  }

  //handler function
  /**
   * typeOptionalEmptyFieldCondition will be used when the test data value is String and not mandatory (e.g tags, Descriptions)
   * @param {String} fieldName is the field value name from test data
   * @param {String} locator is the field locator
   * it is used for type in optional string fields
   */
  typeOptionalEmptyFieldCondition(fieldValueText, locator) {
    if (fieldValueText != "") cy.get(locator).clear().type(fieldValueText);
  }

  clickQuestionTab() {
    cy.get(locators.administration.QB.qbTab).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
  }

  clickAddQuestionBtn() {
    cy.get(locators.general.clickAddBtn).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
  }

  verifyMandatoryFieldsError() {
    cy.get(locators.administration.QB.saveBtn).click({
      force: true,
      multiple: true,
    });
    cy.contains(assessment.errorMsg.problemInSave).should("be.visible");
  }
  /**
   * addQBSurvey will add the QB survey Questions in QB created Template
   * @param {Object} qbSummaryForm qbSummaryForm will be the testobject from assessments.json
   * @param {Objecy} qbSurveyForm qbSurveyForm will be the test object for adding the questions from assessments.json
   */
  addQBSurvey(qbSummaryForm, qbSurveyForm, isDiscard = false) {
    const riskValues = qbSurveyForm.riskValues;
    const checkCB = qbSummaryForm.type.checkCB;

    this.clickQuestionTab();
    this.clickAddQuestionBtn();
    this.verifyMandatoryFieldsError();

    //Add Questions Type
    // cy.get(locators.administration.QB.qbTypedropdown).click({ force: true });
    // cy.get(locators.administration.QB.qbTypeSearch,{timeout: this.waits.mediumWait})
    //   .type(qbSurveyForm.questionType,{delay: 150})
    //   .type("{enter}");
    cy.get("#selectquestionType")
    .select(qbSurveyForm.questionType,{force:true});

    //Add Question Text
    cy.get(locators.administration.QB.questionText).should(
      "have.attr",
      "maxlength",
      qbSurveyForm.maxLength
    );
    cy.get(locators.administration.QB.questionText).type(
      qbSurveyForm.questionText
    );

    //input Risk Values
    this.clickRiskValues(
      "highRisk",
      riskValues.highRisk.selectOperator,
      riskValues.highRisk.highRiskValue,
      checkCB.withContentLibrary,
      qbSummaryForm.type.typeName
    );
    this.clickRiskValues(
      "lowRisk",
      riskValues.lowRisk.selectOperator,
      riskValues.lowRisk.lowRiskValue,
      checkCB.withContentLibrary,
      qbSummaryForm.type.typeName
    );

    /**
     * Add Questionaire Responses
     */
    this.addQuestionaire(qbSurveyForm.responses);
    //
    //----------------- below are optional Fields that have "" empty - values ------------------

    //type the tag arrays
    this.addOptionalTags(qbSurveyForm);

    this.clickOptionalEmptyFieldCondition(
      qbSurveyForm.choosingResponseNotes,
      locators.administration.QB.choosingResponseNotes
    );

    if (qbSummaryForm.type.typeName != "Simple Exception QB") {
      this.clickOptionalBooleanFieldCondition(
        qbSurveyForm.fileCheck,
        locators.administration.QB.beAbletoUpload
      );

      this.clickOptionalBooleanFieldCondition(
        qbSurveyForm.mandatory,
        locators.administration.QB.mandatory
      );
    }
    this.clickOptionalBooleanFieldCondition(
      qbSurveyForm.answerRequired,
      locators.administration.QB.responseRequired
    );

    if (
      (qbSurveyForm.questionType != "Date" ||
        qbSurveyForm.questionType != "Comment Essay Box") &&
      qbSurveyForm.commentExplaination === true &&
      qbSummaryForm.type.typeName != "Simple Exception QB"
    )
      cy.get(locators.administration.QB.commentCheckbox).click({ force: true });

    if (qbSummaryForm.type.typeName === "Assessment")
      cy.clickOptionalBooleanFieldCondition(
        qbSurveyForm.commentsRequired,
        locators.administration.QB.commentsRequired
      );

    if (qbSummaryForm.type.typeName === "Simple Exception QB")
      cy.clickOptionalBooleanFieldCondition(
        qbSurveyForm.exceptionRequired,
        locators.administration.QB.exceptionRequired
      );

    //clicking on save Button if not discard
    if (isDiscard) {
      cy.get(locators.general.closeForm).click({ force: true, multiple: true });
    } else {
      cy.get(locators.administration.QB.saveBtn)
        .contains("Save")
        .click({ force: true });
      cy.verifyToastMessageText(
        assessment.saveMsg.QBSaved,
        this.waits.mediumWait
      );
    }
  }

  clickSavedQBLink(sectionName) {
    cy.readFile(assessmentString).then((file) => {
      cy.get(locators.administration.QB.searchResult)
        .should("have.length", 1)
        .contains(file.questionBank.qbSummaryForm[sectionName].qbName)
        .click();
    });
  }

  /**
   * Searches for a Question Bank (QB) by section name and verifies the search result.
   *
   * @param {string} sectionName - The name of the section to search for in the question bank.
   * @param {boolean} [isDeleted=false] - Optional flag to indicate if the search is for a deleted QB. If true, asserts that only one result is returned.
   */
  searchQB(sectionName, isDeleted=false) {
    cy.waitForTopMsgLoaderToDisappear(this.waits.longWait);
    cy.waitForLoaderToDisappear("qb", this.waits.longWait);
    cy.readFile(assessmentString).then((file) => {
      cy.get(locators.administration.QB.questionTemplateSearchCell)
        .eq(1)
        .type(file.questionBank.qbSummaryForm[sectionName].qbName, {
          delay: 300,
        });
      if (!isDeleted) {
        cy.waitForTopMsgLoaderToDisappear(10000)
        cy.waitForLoaderToDisappear("qb", this.waits.longWait);
      cy.get(locators.administration.QB.searchResult,{timeout:this.waits.mediumWait}).should("have.length", 1)};
    });
  }

  //publishQB will publish newly created QB Template
  publishQB(sectionName, isNewVersion = false, fileType, isCustomerSpace = false) {
    cy.visitMyQuestionBank();
    cy.waitForTopMsgLoaderToDisappear(this.waits.longWait);
    cy.waitForLoaderToDisappear("qb", this.waits.longWait);

    cy.readFile(assessmentString).then((file) => {
      const qbName = file.questionBank.qbSummaryForm[sectionName].qbName;

      const searchQB = () => {
        cy.get(locators.administration.QB.questionTemplateSearchCell)
          .eq(1)
          .clear({ force: true })
          .as("templateName");

        cy.get("@templateName").type(qbName, { delay: 300 });
      };

      const searchv2 = () => {
        cy.get(locators.administration.QB.questionTemplateSearchCell)
          .eq(1)
          .clear({ force: true })
          .type(qbName + " v2", { delay: 300 });
      };

      cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
      cy.waitForLoaderToDisappear("qb", 600000);      
      searchQB();

      cy.get(locators.administration.QB.threeelipses,{timeout:50000})
        .should("have.length", 1)
        .click();

      if (isNewVersion) {
        cy.get(locators.administration.QB.selectNewVersion).click();
        cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
        cy.waitForLoaderToDisappear("qb", 600000);
        searchv2();
        cy.get(locators.administration.QB.threeelipses,{timeout: 600000})
          .should("have.length", 1)
          .click();
        cy.get(locators.administration.QB.selectPublish).click();
      } else {
        cy.get(locators.administration.QB.selectPublish).click();
      }
      cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
      isNewVersion ? searchv2() : searchQB();
      cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
      cy.waitForLoaderToDisappear("qb", this.waits.longWait);

      cy.get(locators.administration.QB.publishText, {
        timeout: this.waits.shortWait,
      }).contains("Published");

      if(!isCustomerSpace){
      !isNewVersion
        ? cy.readAndWriteData("Question Bank", qbName, fileType)
        : cy.readAndWriteData("Question Bank", qbName + " v2", fileType);
      }
      else{
      !isNewVersion
        ? cy.readAndWriteData("Question Bank CustomerSpace", qbName, fileType)
        : cy.readAndWriteData("Question Bank CustomerSpace", qbName + " v2", fileType);
      }
    });
  }

  //*************************/ FOR Creation of the Template......********************** */

  /**
   * addTemplate will create Assessment template from Template Screen in Administration
   * @param {Object} templateSurveyForm is summary test object from assessmnets.json in template
   * @param {Boolean} isDiscard is true if user wants to discard the template creation
   * @param {Boolean} isCustomerSpace is true if user is creating template for customer space
   */
  addTemplate(templateSurveyForm, isDiscard = false, isCustomerSpace = false) {
    const withContentLibrary =
      templateSurveyForm.type.checkCB.withContentLibrary;
    const type = templateSurveyForm.type;
    cy.visitTemplate();
    cy.get(locators.general.clickAddBtn).click();
    cy.createRandomString(8).then(($el) => {
      cy.get(locators.administration.template.templateName).type(
        "test template" + " " + $el,
        { delay: 500, force: true }
      );
      cy.readFile(assessmentString).then((file) => {
        file["template"]["templateSurveyForm"]["templateName"] =
          "test template" + " " + $el;
        file["template"]["templateSurveyForm"]["type"]["assessmentID"] = $el;

        cy.writeFile(assessmentString, file);
      });
      if (!withContentLibrary.includes(type.typeName) && !isCustomerSpace) {
        this.fieldsToVisible();
        cy.get(locators.administration.template.assessmentID).type($el, {
          force: true,
        });

        cy.readFile(assessmentString).then((file) => {
          cy.dropDownSearchAndSelect(
            locators.administration.template.templateContentLibrary,
            file.template.templateSurveyForm.type.contentLibrary
          );
        });
        cy.get(locators.administration.template.templateContentLibrary)
          .find("input")
          .type("{esc}", { force: true });
        this.clickOptionalEmptyFieldCondition(
          type.guidance,
          locators.administration.template.guidance
        );
      }
    });

    this.clickOptionalBooleanFieldCondition(
      templateSurveyForm.active,
      locators.administration.resellers.activeStatus
    );

    cy.get(locators.administration.template.selectTemplateType).click({
      force: true,
    });
    cy.dropDownSearchAndSelect(
      locators.administration.QB.qbTagDropDown,
      type.typeName
    );

    //----------------- below are optional Fields that have "" empty - values ------------------
    this.addOptionalTags(templateSurveyForm);
    isDiscard
      ? cy
          .get(locators.general.closeForm)
          .click({ force: true, multiple: true })
      : cy
          .get(locators.administration.template.continueBtn)
          .click({ force: true });
  }

  /**
   * Verifies the visiblity of Content library, guidance, surveyId and library Assessment id field
   * When specific types of assessment is selected in assessment template form
   */
  fieldsToVisible() {
    //Guidance..
    cy.switchToIframe(".cke_wysiwyg_frame ").then(($iframe) => {
      cy.get($iframe).find("p").should("be.visible");
    });
    //Survey Id
    cy.get("#assessmentId").should("be.visible");
    //Library Assessment ID
    cy.get("#libraryAssessmentId").should("be.visible");
  }
  /**
   * addSection will create multiple sections when assessment template is created
   * @param {Object} sections object in tempate from test data file assessments.json
   * @param {Boolean} isDiscard is true if user wants to discard the section creation
   * @param {Boolean} isCustomerSpace is true if user is creating section for customer space
   */
  addSection(sections, isDiscard = false, isCustomerSpace = false) {
    // Clicking on "Add" button if the questions are more than 1
    cy.readFile(assessmentString).then((file) => {
      const updatedSection= !isCustomerSpace
      ? file.template.sections
      : file.template.sectionsCustomerSpace
      updatedSection.forEach((sectionData, index) => {
        cy.get(locators.administration.template.addSection, {
          timeout: this.waits.mediumWait,
        }).click({ force: true, delay: 1000 });
        cy.get(locators.administration.template.templateName, {
          timeout: this.waits.mediumWait,
        })
          .should("be.visible")
          .type(sectionData.sectionName, {
            delay: 200,
            force: true,
            timeout: this.waits.mediumWait,
          });
        if (
          !(
            assessment.template.templateSurveyForm.type.typeName ==
              "Risk Probability Analysis" ||
            assessment.template.templateSurveyForm.type.typeName ==
              "Risk Impact Analysis"
          )
        ) {
          cy.get(locators.administration.template.saveSection);
          cy.get(locators.administration.template.totalQuestionOfHighRisk).type(
            sectionData.totalQuestionHighRisk
          );
          cy.get(
            locators.administration.template.totalQuestionOfMediumRisk
          ).type(sectionData.totalQuestionMediumRisk);
          cy.get(locators.administration.template.sectionForm)
            .contains(sectionData.takeActionFrom)
            .click();
        }

        this.clickOptionalEmptyFieldCondition(
          sectionData.description,
          locators.administration.QB.qbDescription
        );
        cy.get(locators.administration.QB.qbDescription).should(
          "have.attr",
          "maxLength",
          sectionData.maxLength
        );
        if (isDiscard) {
          cy.get(locators.general.closeFilterBtn).as("cancelSection");
          cy.get("@cancelSection").click({ multiple: true, force: true });
          cy.get("@cancelSection").should("not.be.visible");
          return;
        }
        cy.get(locators.administration.QB.saveBtn).first().click();
        cy.get("div#survey_sections_fragment").contains(
          sectionData.sectionName
        );
        cy.get(locators.administration.template.templateCreatedSections)
          .children()
          .eq(index)
          .within(() => {
            cy.get(locators.administration.template.btnAssociateQB)
              .contains("Associate Question Bank")
              .click({ force: true });
          });
        cy.waitForTopMsgLoaderToDisappear(20000);
        cy.get(locators.administration.template.searchQB, {
          timeout: this.waits.mediumWait,
        })
          .type(sectionData.associateQB, { delay: 400 })
          .type("{Enter}");

        cy.get(locators.administration.template.resultSearchedQB,{timeout: Cypress.env("waits").mediumWait}).should(
          "have.length",
          1,
          { timeout: this.waits.mediumWait }
        );
        cy.waitForTopMsgLoaderToDisappear(10000)
        cy.wait(5000)
        cy.get(locators.administration.template.selectQB,{timeout: Cypress.env("waits").mediumWait})
        .should('have.length', 1)
        .click({ delay: 350 });
        cy.get(locators.administration.template.saveQB).click();
        cy.get(locators.administration.toastMsg, {
          timeout: this.waits.mediumWait,
        }).should("be.visible");
      });
    });
    cy.get(locators.administration.template.saveQB,{timeout:20000}).should('not.be.visible')
    cy.get(locators.administration.template.donebtnSection).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
    cy.get(locators.general.saveBtn).click();
    cy.verifyToastMessageText(
      assessment.sectionSavedMsg,
      Cypress.env("waits").mediumWait
    );
  }

  /**
   * Searches for a template using the template name and framework name from the assessment file.
   * This function reads the assessment JSON file and fills in the search fields for template name and framework.
   */
  searchTemplateFramework(isCustomerSpace = false) {
    cy.readFile(assessmentString).then((file) => {
      // Search by template name
      cy.get(locators.administration.template.searchTemplate)
        .eq(1)
        .clear({force: true})
        .type(file.template.templateSurveyForm.templateName, {
          delay: 250,
          timeout: this.waits.longWait,
        });
      // Search by framework name
      // const frameworkName = isCustomerSpace
      //   ? file.questionBank.qbSummaryForm.add.framework
      //   : file.questionBank.qbSummaryForm.add.frameworkCustomer;
      cy.get(locators.administration.template.searchTemplate)
        .eq(0)
        .clear({force: true})
        .type(file.questionBank.qbSummaryForm.add.framework, {
          delay: 250,
          timeout: this.waits.longWait,
        });
    });
  }

  /**
   * clickThreeEllipses will click on the three ellipses in the template screen
   */
  clickThreeEllipses() {
    cy.waitForTopMsgLoaderToDisappear(10000)
    cy.get(locators.administration.QB.threeelipses)
      .wait(1200)
      .should("have.length", 1)
      .click();
  }

  /**
   * clickPublishThreeEllipses will click on the Publish option in the three ellipses menu
   */
  clickPublishThreeEllipses() {
    cy.get("body").then(($body) => {
      // Check if the element exists and is visible before interacting
      if (
        $body.find(locators.administration.QB.selectPublish).length > 0 &&
        Cypress.$(locators.administration.QB.selectPublish).is(":visible")
      ) {
        cy.get(locators.administration.QB.selectPublish, {
          timeout: this.waits.longWait,
        }).then(($el) => {
          if ($el.text().includes("Publish")) {
            cy.wrap($el).click({
              delay: 2000,
              force: true,
              timeout: this.waits.longWait,
            });
          }
        });
      }
    });
  }

  /**publishTemplate will publish the assessment template
   * @param {Boolean} isCustomerSpace is true if the template is for customer space
   * */
  publishTemplate(isCustomerSpace = false) {
    cy.visitTemplate();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
    cy.waitForLoaderToDisappear("template", this.waits.longWait);

    // this.searchTemplateFramework();
    for (let i = 0; i < 2; i++) {
      cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
      cy.waitForLoaderToDisappear("template", this.waits.longWait);
      this.searchTemplateFramework(isCustomerSpace);
      cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
      cy.waitForLoaderToDisappear("template", this.waits.longWait);
      this.clickThreeEllipses();
      this.clickPublishThreeEllipses();
    }

    // cy.readFile(assessmentString).then((file) => {
    //   cy.verifyToastMessageText(
    //     file.templatePublishedMsg,
    //     Cypress.env("waits").longWait
    //   );
    // });
    cy.reload();
    cy.waitForLoaderToDisappear("template", this.waits.longWait);
    for (let i = 0; i < 2; i++) {
      this.searchTemplateFramework(isCustomerSpace);
      cy.get(locators.administration.QB.publishText, {
        timeout: this.waits.mediumWait,
      }).contains("Published");
    }

    /**write the assigned assessment name to the customer test Data assessmentName so
     * that the same assessment will be assigned to Customer
     */
    cy.readFile(assessmentString).then((assessmentDataFile) => {
      cy.readAndWriteData(
        "Assessment",
        assessmentDataFile.template.templateSurveyForm.templateName
      );
    });
  }

  /**
   * addAssessmentReseller will assign the newly published Template in the reseller
   * @param {Object} resellerData will be object from resllers.json
   * @param {Boolean} updated it will be true if the name of the reseller is updated
   */
  addAssessmentReseller(
    resellerData,
    updated = false,
    customer = false,
    assessmentWithContentLibrary = false
  ) {
    cy.reload();
    if (customer) {
      cy.visitCustomer();
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.clickCustomerName(file.addCustomer.name);
        }
      );
    }
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);

    // Click on close button in Assessment tab and open Assessment tab again
    this.openCustomerOptionTabs(2);
    this.closeTabOption(true, customer);
    this.openCustomerOptionTabs(2);

    // Selecting and deselecting all the assessments
    cy.reload();
    const locator = customer
      ? locators.administration.customers.assignedAssessment
      : locators.administration.resellers.checkAssessment;

    // Select and deselect multiple assessments
    if (!customer) {
      this.clickSelectAll(locator, "Select All");
      this.clickDeselectAll(locator, "Select All");
      this.verifyMultipleAssessmentsSelection();
      this.verifyMultipleAssessmentsDeselection();
    }

    // Select the newly created assessment
    const filePath = customer
      ? "cypress/fixtures/Administration/Customers.json"
      : assessmentString;

    //assign newly created assessment to the reseller/customers
    cy.readFile(filePath).then((file) => {
      const templateName = customer
        ? file.customerProfileData.assessment.assessmentName
        : file.template.templateSurveyForm.templateName;
      this.assignToReseller(2, locator, templateName);
    });
  }

  /**
   * addQuestionaireReseller will assign the newly published QB Template in the reseller
   * @param {Object} resellerData will be object from resllers.json
   * @param {Boolean} updated it will be true if the name of the reseller is updated
   * @param {Boolean} customer will be true if assigning to a customer
   */
  addQuestionaireReseller(resellerData, updated = false, customer = false) {
    cy.reload();
    if (customer) {
      cy.visitCustomer();
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.clickCustomerName(file.addCustomer.name);
        }
      );
    }
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);

    // Click on close button in Question Bank tab and open Question Bank tab again
    this.openCustomerOptionTabs(3);
    this.closeTabOption(true, customer);
    this.openCustomerOptionTabs(3);

    // Selecting and deselecting all the Question Banks
    cy.reload();
    const locator = customer
      ? locators.administration.customers.checkQuestionaire
      : locators.administration.resellers.checkQuestionaire;

    this.clickSelectAll(locator, "Select All");
    this.clickDeselectAll(locator, "Select All", true);

    // Select and deselect multiple Question Banks
    this.verifyMultipleQuestionaireSelection(customer);
    this.verifyMultipleQuestionaireDeselection(customer);

    // Select the newly created Question Banks
    const filePath = customer
      ? "cypress/fixtures/Administration/Customers.json"
      : assessmentString;

    //assign newly created question Bank to the reseller/customers
    cy.readFile(filePath).then((file) => {
      const qbName = customer
        ? file.customerProfileData.questionBank.questionBankName
        : file.questionBank.qbSummaryForm.update.qbName;
      this.assignToReseller(3, locator, qbName, true);

      /**write the assigned QB name to the customer test Data questionBankName so
       * that the same Question Bank wil be assign to Customer
       */
      if (!customer) cy.readAndWriteData("Question Bank", qbName);
    });
  }

  /**
   * Generic function to verify if clicking the Select All checkbox selects all items
   * @param {String} locator - locator for the Select All checkbox
   * @param {String} valueName - value name will be 'Select All' for clicking on all checkboxes
   */
  clickSelectAll(locator, valueName) {
    cy.get(locator, { timeout: this.waits.longWait })
      .contains(valueName)
      .click({ force: true });
    cy.get(locator, { timeout: this.waits.longWait })
      .contains(valueName)
      .parent()
      .find("input")
      .should("be.checked");
  }

  /**
   * Generic function to verify if clicking the deSelect All checkbox selects all items
   * @param {String} locator - locator for the Select All checkbox
   * @param {String} valueName - value name will be 'Select All' for clicking on all checkboxes
   */
  clickDeselectAll(locator, valueName, questionaire = false) {
    cy.get(locator).contains(valueName).click({ force: true });
    cy.get(locator)
      .contains(valueName)
      .parent()
      .find("input")
      .should("not.be.checked");
    cy.get(locators.administration.QB.saveBtn).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
    cy.readFile(assessmentString).then((file) => {
      if (!questionaire){
        cy.get(locators.administration.toastMsg).should("be.visible");
        cy.verifyToastMessageText(file.saveSuccessTemplateMsg, this.waits.mediumWait);
      }
    });
  }

  /**
   * Helper function to select or deselect multiple assessments
   * @param {Boolean} select - true to select, false to deselect
   */
  toggleMultipleAssessments(select = true, locator, valueName) {
    const action = select ? "be.checked" : "not.be.checked";

    cy.get(locator).contains(valueName).parent().prev().find("span").click();

    cy.get(locator)
      .contains(valueName)
      .parent()
      .prev()
      .prev()
      .find("span")
      .click();

    cy.get(locators.administration.QB.saveBtn).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.longWait);

    // Assert that the templates we selected/deselected have the correct attribute
    cy.get(locator)
      .contains(valueName)
      .parent()
      .prev()
      .find("input[type='checkbox']")
      .should(action);

    cy.get(locator)
      .contains(valueName)
      .parent()
      .prev()
      .prev()
      .find("input[type='checkbox']")
      .should(action);
  }

  /**
   * Verify if users can select multiple assessments
   */
  verifyMultipleAssessmentsSelection(customer = false) {
    if (!customer) {
      cy.readFile(assessmentString).then((file) => {
        this.toggleMultipleAssessments(
          true,
          locators.administration.resellers.checkAssessment,
          file.template.templateSurveyForm.templateName
        );
      });
    } else {
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.toggleMultipleAssessments(
            true,
            locators.administration.customers.assignedAssessment,
            file.customerProfileData.assessment.assessmentName
          );
        }
      );
    }
  }

  /**
   * Verify if users can select multiple Questionaire
   */
  verifyMultipleQuestionaireSelection(customer = false) {
    if (!customer) {
      cy.readFile(assessmentString).then((file) => {
        this.toggleMultipleAssessments(
          true,
          locators.administration.resellers.checkQuestionaire,
          file.questionBank.qbSummaryForm.update.qbName
        );
      });
    } else {
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.toggleMultipleAssessments(
            true,
            locators.administration.customers.checkQuestionaire,
            file.customerProfileData.questionBank.questionBankName
          );
        }
      );
    }
  }

  /**
   * Verify if users can select multiple Content Libraries
   */
  verifyMultipleContentLibrariesSelection() {
    cy.readFile(assessmentString).then((file) => {
      this.toggleMultipleAssessments(
        true,
        locators.administration.customers.assignContentLibarary,
        file.template.templateSurveyForm.type.contentLibrary
      );
    });
  }

  /**
   * Verify if users can deselect multiple assessments
   */
  verifyMultipleAssessmentsDeselection(customer = false) {
    if (!customer) {
      cy.readFile(assessmentString).then((file) => {
        this.toggleMultipleAssessments(
          false,
          locators.administration.resellers.checkAssessment,
          file.template.templateSurveyForm.templateName
        );
      });
    } else {
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.toggleMultipleAssessments(
            false,
            locators.administration.customers.assignedAssessment,
            file.customerProfileData.assessment.assessmentName
          );
        }
      );
    }
  }

  /**
   * Verify if users can deselect multiple questionaire
   */
  verifyMultipleQuestionaireDeselection(customer) {
    if (!customer) {
      cy.readFile(assessmentString).then((file) => {
        this.toggleMultipleAssessments(
          false,
          locators.administration.resellers.checkQuestionaire,
          file.questionBank.qbSummaryForm.update.qbName
        );
      });
    } else {
      cy.readFile("cypress/fixtures/Administration/Customers.json").then(
        (file) => {
          this.toggleMultipleAssessments(
            false,
            locators.administration.customers.checkQuestionaire,
            file.customerProfileData.questionBank.questionBankName
          );
        }
      );
    }
  }

  /**
   * Verify if users can deselect multiple content libraries
   */
  verifyMultipleContentLibrariesDeselection() {
    cy.readFile(assessmentString).then((file) => {
      this.toggleMultipleAssessments(
        false,
        locators.administration.customers.assignContentLibarary,
        file.template.templateSurveyForm.type.contentLibrary
      );
    });
  }

  /**clickResellerName will click on the reseller name
  *it will can be used when reseller name or details are created or updated
  @resellerName is the reseller Name
  */
  clickResellerName(resellerName) {
    cy.get(locators.administration.resellers.addedReseller)
      .contains(resellerName)
      .click();
  }

  /**
   * clickCustomerName will click on the customer name
   * it will be used when customer name or details are created or updated
   * @param {String} customerName is the customer Name
   */
  clickCustomerName(customerName) {
    cy.get(locators.administration.customers.addedCustomer)
      .contains(customerName)
      .click();
  }

  //assignContentLibraryReseller will assign the content library in reseller profile
  assignContentLibraryReseller(contentLibraryIndex, customer = false) {
    cy.reload();
    cy.get(locators.general.tabs).contains("a", "Content Libraries").click();
    this.closeTabOption(true, customer);
    this.openCustomerOptionTabs(contentLibraryIndex);
    if (customer) this.openCustomerOptionTabs(contentLibraryIndex);

    //selecting and deselecting all the Content Libraries
    cy.reload();
    cy.waitForTopMsgLoaderToDisappear(40000);
    this.clickSelectAll(
      locators.administration.customers.assignContentLibarary,
      "Select All"
    );
    this.clickDeselectAll(
      locators.administration.customers.assignContentLibarary,
      "Select All",
      true
    );

    //select the newly created content Library
    cy.reload();
    cy.readFile(
      customer
        ? "cypress/fixtures/Administration/Customers.json"
        : assessmentString
    ).then((file) => {
      const contentLibraryName = customer
        ? file.customerProfileData.contentLibrary.contentLibraryName
        : file.questionBank.qbSummaryForm.add.type.addContentLibrary
            .contentLibraryName;
      cy.selectExactElementText(
        locators.administration.customers.assignContentLibarary,
        contentLibraryName
      );
    });
    // saving after assigning...
    cy.get(locators.general.formSaveBtn).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
  }

  /**
   * assignToReseller is the common function it will be used when reseller is created
   * and user wants to assign the assessments to the reseller
   * @param {int} tabNumber is the tab option number in reseler profile
   * @param {String} locator is the locator of the published assessment template in reseller Assessment tab
   * @param {String} valueName is the published Assessment name
   */
  assignToReseller(tabNumber, locator, valueName, questionaire = false) {
    this.openCustomerOptionTabs(tabNumber);
    cy.reload();
    cy.get(locator).contains(valueName).parent().find("span").click();
    cy.get(locator)
      .contains(valueName)
      .parent()
      .find("input")
      .should("be.checked");
    cy.get(locators.administration.QB.saveBtn).click();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
    cy.readFile(assessmentString).then((file) => {
      !questionaire
        ? cy.verifyToastMessageText(file.saveSuccessTemplateMsg, this.waits.mediumWait)
        : cy.verifyToastMessageText(
            file.saveSucessQuestionnaireMsg,
            this.waits.mediumWait
          );
      cy.reload();
      cy.get(locator)
        .contains(valueName)
        .parent()
        .find("input")
        .should("be.checked");
    });
  }

  /**
   * Closes the current tab and verifies it is no longer visible.
   * If the `updated` parameter is true, it will click on the updated reseller's name.
   * Otherwise, it will click on the added reseller's name.
   * Finally, it waits for the top message loader to disappear.
   *
   * it will first close the tab and then click on the reseller name
   * @param {boolean} [updated=false] - Indicates whether to click on the updated reseller's name or the added reseller's name.
   */
  closeTabOption(updated = false, customer = false) {
    cy.get(locators.general.closeForm).click({ multiple: true, force: true });
    cy.get(locators.general.closeForm).should("not.be.visible");
    cy.readFile(resellerString).then((resellerDataFile) => {
      if (updated && !customer) {
        reseller.searchWithFilter("updateReseller");
      }
      if (!updated && !customer) {
        reseller.searchWithFilter("addReseller");
      }
    });

    if (customer) {
      cy.readFile(`cypress/fixtures/Administration/Customers.json`).then(
        (dataFile) => {
          cy.reload();
          this.clickCustomerName(dataFile.addCustomer.name);
        }
      );
    }
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);
  }

  /**
   * Clicks on the tab options of the customer profile based on the provided tab number.
   *
   * @param {number} tabNumber - The number of the tab to be clicked.
   *                             Assessment tab = 2, Questionnaire tab = 3.
   */
  openCustomerOptionTabs(tabNumber) {
    cy.reload();
    cy.get(locators.administration.resellers.resellerAssessmentTab)
      .children()
      .eq(tabNumber)
      .click();
  }

  /**
   * assignRegulationsStandardReseller will assign regulations and standards to the reseller
   */
  assignRegulationsStandard(customer = false) {
    this.expandAndSelectCategories(customer);
  }

  /**
   * expandAndSelectCategory will expand and select a specific category based on the index
   * @param {number} index - The index of the category to be expanded and selected
   */
  expandAndSelectCategory(index) {
    cy.get(locators.administration.regulations.standards.allStandards)
      .find(locators.administration.regulations.standards.standardParent)
      .eq(index)
      .within(() => {
        cy.get(
          locators.administration.regulations.standards.expendCategory
        ).click({ multiple: true, force: true });
        cy.get(
          locators.administration.regulations.standards.clickCheckBox
        ).click({ multiple: true, force: true });
      });
  }

  /**
   * expandAndSelectCategories will expand and select multiple categories
   */
  expandAndSelectCategories(customer) {
    this.openCustomerOptionTabs(1);
    this.closeTabOption(true, customer);
    this.openCustomerOptionTabs(1);

    //open Tree standard form to select standards
    cy.get(locators.general.clickAddBtn).click();

    //select and unselect the standards in tree
    for (let i = 0; i < 3; i++) {
      this.selectStandard(-1);
      this.selectStandard(-2);
    }

    // Click the Add button to save the selected standards
    cy.get(
      locators.administration.regulations.standards.addStandardFormBtn
    ).click({ force: true });
  }

  deleteRegulationsStandard() {
    //click on Delete All btn
    cy.get(locators.administration.regulations.deleteAllBtn).click();
    //verify the delete all msg
    cy.get(locators.administration.regulations.emptyGridText)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("No Standards found.");
      });
  }

  saveRegulationsStandard() {
    cy.get(locators.administration.regulations.emptyGridText).should(
      "have.attr",
      "style",
      "display: none;"
    );
    cy.get(locators.general.formSaveBtn).click();
  }

  /**
   * selectStandard will select a standard based on the index
   * @param {number} index - The index of the standard to be selected
   */
  selectStandard(index) {
    this.expandAndSelectCategory(index);
  }

  /************************[ KxI Category / KxI Definition Tabs ]********************* */
  /**
   * Verifies the Content Libraries in Kxi tabs.
   * @param {string} contentLibraryName - The name of the content library to verify.
   */
  verifyCLKxiTabs(contentLibraryName) {
    cy.get(locators.general.verifyClKxiTabs)
      .contains(contentLibraryName)
      .click();
  }

  /**
   * Assigns a Kxi category.
   * @param {string} contentLibraryName - The name of the content library to assign to the Kxi category.
   */
  assignKxiCategory() {
    cy.readFile("cypress/fixtures/Administration/Customers.json").then((fileData) => {
      cy.get(locators.general.tabs).contains("a", "KxI Category").click();
      this.verifyCLKxiTabs(
        fileData.customerProfileData.contentLibrary.contentLibraryName
      );
    });
  }

  /**
   * Assigns a Kxi definition.
   * @param {string} contentLibraryName - The name of the content library to assign to the Kxi definition.
   */
  assignKxiDefinition() {
    cy.readFile("cypress/fixtures/Administration/Customers.json").then((fileData) => {
      cy.get(locators.general.tabs).contains("a", "KxI Definition").click();
      this.verifyCLKxiTabs(
        fileData.customerProfileData.contentLibrary.contentLibraryName
      );
    });
  }

  //***********************Filters*************** */
  applyFilter(
    expectedResult = false,
    dropdown = false,
    fieldName,
    consultantValue = false,
    statusValue = false
  ) {
    if (dropdown) {
      if (fieldName === "Consultant") {
        cy.get(locators.general.filterConsultantField).click();
        cy.dropDownSearchAndSelect(
          locators.general.dropDownSearch,
          consultantValue
        );
      } else if (fieldName === "Status") {
        cy.get(locators.general.filterStatusField).click();
        cy.waitForTopMsgLoaderToDisappear(50000);
        cy.dropDownSearchAndSelect(
          locators.general.dropDownSearch,
          statusValue
        );
      }
    }

    cy.get(locators.general.filterApplyBtn).contains("Apply").click();
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.readFile("cypress/fixtures/Administration/Resellers.json").then(
      (dataFile) => {
        if (expectedResult) {
          cy.get(locators.administration.resellers.addedReseller).should(
            "contain",
            dataFile.updateReseller.name,
            { timeout: this.waits.mediumWait }
          );
        } else {
          cy.waitForTopMsgLoaderToDisappear(40000);
          cy.get(locators.administration.resellers.addedReseller).should(
            "not.contain",
            dataFile.updateReseller.name,
            { timeout: this.waits.mediumWait }
          );
        }
      }
    );
  }

  /**
   * Opens the filter popup
   */
  openFilterPopup() {
    cy.get(locators.general.filterIcon).click({ force: true });
  }

  /**
   * Applies a filter by Name
   * @param {String} name - The name to filter by
   */
  filterByValidName(expectedResult) {
    cy.get(locators.general.filterNameField)
      .clear()
      .type(resellerData.updateReseller.name, { delay: 450 });
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.wait(2000);
    // cy.get(locators.administration.users.filter.userNameResult, {
    //   timeout: this.waits.mediumWait,
    // }).wait(500).click({force:true});
    cy.get(locators.general.filterApplyBtn).contains("Apply").click();
    cy.waitForTopMsgLoaderToDisappear(50000);
  }

  /**
   * Applies a filter by invalid Name
   * @param {String} name - The name to filter by
   */
  filterByInvalidName() {
    cy.createRandomString(8).then(($el) => {
      cy.get(locators.general.filterNameField)
        .clear()
        .type($el, { delay: 250 });
      this.applyFilter(false);
    });
  }

  filterByDate(expectedResult) {
    const date = dayjs().format("MM/DD/YYYY");
    cy.get(locators.general.filterDataField).clear().type(date, { delay: 250 });

    this.applyFilter(expectedResult);
  }

  filterByInvalidDate() {
    const date = dayjs().subtract(5, "day").format("MM/DD/YYYY");
    cy.get(locators.general.filterDataField).clear().type(date, { delay: 250 });

    this.applyFilter(false);
    cy.wait(10000); // Adding wait to ensure elements are fully loaded
    cy.get(locators.administration.resellers.addedReseller, {
      timeout: 30000,
    }).should("not.contain", resellerData.updateReseller.name);
  }

  closeFilter() {
    cy.get(locators.general.closeFilterBtn)
      .click({ delay: 2000, force: true })
      .click();
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.readFile("cypress/fixtures/Administration/Resellers.json").then(
      (dataFile) => {
        cy.get(locators.administration.resellers.addedReseller).should(
          "contain",
          dataFile.updateReseller.name
        );
      }
    );
  }
  resetFilter() {
    cy.get(locators.general.clearBtnFilter).click();
    cy.get(locators.general.filterApplyBtn).contains("Apply").click();
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.readFile("cypress/fixtures/Administration/Resellers.json").then(
      (dataFile) => {
        cy.get(locators.administration.resellers.addedReseller).should(
          "contain",
          dataFile.updateReseller.name
        );
      }
    );
  }

  sortingPaginationReset() {
    cy.visitReseller();
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.get(locators.general.gridTopRightPageBtn).click();
    cy.get(locators.administration.resellers.addedReseller)
      .contains("th", "Name")
      .click();
    cy.get(locators.administration.resellers.addedReseller).should(
      "not.contain",
      resellerData.updateReseller.name
    );
    this.openFilterPopup();
    this.resetFilter();
    cy.get(locators.administration.resellers.addedReseller)
      .contains("th", "Name")
      .click();
    cy.get(locators.administration.resellers.addedReseller).should(
      "not.contain",
      resellerData.updateReseller.name
    );
  }

  /**
   * Verify if filters persist after navigating between pages
   */
  verifyFiltersPersist() {
    // Apply a filter
    this.filterByInvalidDate();

    // Navigate to another page
    cy.visitContentSource();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);

    // Navigate back to the original page
    cy.visitReseller();
    cy.waitForTopMsgLoaderToDisappear(this.waits.mediumWait);

    // Verify the filter is still applied
    cy.readFile("cypress/fixtures/Administration/Resellers.json").then(
      (dataFile) => {
        cy.get(locators.administration.resellers.addedReseller).should(
          "contain",
          dataFile.updateReseller.name
        );
      }
    );
  }

  /**
   * Updates the assessmentString to point to a new JSON file.
   * @param {string} newFileName - The new file name to replace in the assessmentString.
   */
  updateAssessmentFile(newFileName) {
    const basePath = "cypress/fixtures/Administration/";
    const newFilePath = `${basePath}${newFileName}`;
    assessmentString = newFilePath; // Update the global variable
    assessment = require(`../../../fixtures/Administration/${newFileName}`);
    cy.readFile(basePath + newFileName).then((file) => {
      file["headingTextQB"] = "Add Question Bank";
      file["headingTextTemplate"] = "Add Template";
      cy.writeFile(basePath + newFileName, file);
    });
  }
}

export default Assessment;
