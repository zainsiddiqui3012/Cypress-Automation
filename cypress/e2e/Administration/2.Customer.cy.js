import Customer from "../../support/POM/Administration/Customer";
import Reseller from "../../support/POM/Administration/Reseller";
import Assessment from "../../support/POM/Administration/Assessment";
import customers from "../../fixtures/Administration/Customers.json";

const customer = new Customer();
const reseller = new Reseller();
const assessment = new Assessment();


describe("E2E Automation of Customer screen from None Space",
  {tags:["@28271","@administration-customers","@manage-customer","@customer","@none-space-customer","@none-space","@administration","@regression"]}, () => {
  
context("Create Customer and update its Summary from the Administration Panel",
  {tags:["@smoke","@create-customer","@add","@edit"]}, () => {
  beforeEach(() => {
    cy.loginWithSession(
      "login with Risk Management User",
      Cypress.env("kxi").none.username,
      Cypress.env("kxi").none.password,
      Cypress.env("kxi").none.key
    );
  });

  it("Check for the Mendatory fields in Customer Creation form",
    {tags:["@pd28364","@smoke","@pd31677"]}, () => {
    cy.visitCustomer();
    reseller.checkForDisabledTabs();
    customer.checkForMandatoryFields();
  });

  it(
    "check and verify that new Customers are created in Administration",
    {
      tags: [
        "@pd28363",
        "@smoke",
        "@pd31437",
        "@pd31595",
        "@pd31596",
        "@pd31597",
        "@pd31616",
        "@pd31617",
        "@pd31618",
        "@pd31619",
        "@pd31620",
        "@pd31621",
        "@pd31622",
        "@pd31623",
        "@pd31624",
        "@pd31607",
        "@pd31608",
        "@pd31609",
        "@pd31610",
        "@pd31625",
        "@pd31626",
        "@pd31627",
        "@pd31628",
        "@pd31629",
        "@pd31630",
        "@pd31631",
        "@pd31632",
        "@pd31633",
        "@pd31634",
        "@pd31635",
        "@pd31636",
        "@pd31637",
        "@pd31638",
        "@pd31639",
        "@pd31640",
        "@pd31641",
        "@pd31642",
        "@pd31643",
        "@pd31644",
        "@pd31645",
        "@pd31646",
        "@pd31647",
        "@pd31648",
        "@pd31649",
        "@pd31650",
        "@pd31651",
        "@pd31652",
        "@pd31653",
        "@pd31654",
        "@pd31664",
        "@pd31665",
        "@pd31666",
        "@pd31667",
        "@pd31668",
        "@pd31669",
        "@pd31670",
        "@pd31671"
      ]
    },
    () => {
      cy.visitCustomer();
      customer.addCustomer();
    }
  );
  
  it("verify added customer details",()=>{
    cy.visitCustomer();
    customer.searchWithFilter();
    customer.verifyCustomer("addCustomer");
  })

  it("Check for the Reports tab in created customer",()=>{
    cy.visitCustomer();
    customer.searchWithFilter();
    customer.assignReports();
  })

  it("Verify that User can Update the Summary fields of the Customer Profile",
    {tags:["@smoke","@pd28362"]}, () => {
    customer.editCustomer();
  });

  it("verify updated customer details",()=>{
    cy.visitCustomer();
    customer.searchWithFilter();
    customer.verifyCustomer("updateCustomer");
  })
});

context(
  "on Editing the customer, data can be added in different Sections and assign to the Customer",
  {tags:["@update-customers","@create-assign-risk-taxanomies","@create-assign-control-taxanomies",
    "@create-assign-content-libraries","@assign-assessments"
  ]},
  () => {
    before(()=>{
      assessment.updateAssessmentFile("Assessments_PAP.json")
    })

    const customerProfileData = customers.customerProfileData;
    if (!customerProfileData.isRequired) return;

    beforeEach(() => {
      cy.loginWithSession(
        "login with Risk Management User",
        Cypress.env("kxi").none.username,
        Cypress.env("kxi").none.password,
        Cypress.env("kxi").none.key
      );
    });

    it("Add new Content Source, Content Library from Customer Administration",
      {tags:["@pd30332","@content-source","@content-libraries"]}, () => {
      if (!customerProfileData.contentLibrary.isRequired) return;
      assessment.contentSource(customers.customerProfileData.contentLibrary, true);
      assessment.contentLibrary(customers.customerProfileData.contentLibrary, true);
    });

    it("Add Risk Taxanomy with Content Library from Administration",
      {tags:["@pd28361","@risk-taxanomies"]}, () => {
      if (!customerProfileData.riskTaxanomy.isRequired) return;
      customer.addRiskTaxonomy();
    });

    it("Add control Taxanomy with Content Library from Administration",
      {tags:["@pd28360","@control-taxanomies"]}, () => {
      if (!customerProfileData.controlTaxanomy.isRequired) return;
      customer.addControlTaxonomy();
    });

    it("Verification of Assigned Content Library to the Customer",
      {tags:["@pd28359",
        "@pd31279",
        "@pd31280",
        "@pd31281",
        "@pd31282",
        "@pd31283",
        "@pd31284",
        "@pd31285",
        "@pd31286",
        "@pd31287",
        "@pd31288",
        "@pd31289",
        "@pd31290",
        "@pd31291",
        "@pd31292",
        "@pd31676"
      ]
      }, () => {
      //assigning content Library to the customer
      customer.assignContentLibrary();
    });

    it("Verify if the user is able to see the assigned content Library on KXI Category Tab",{tags:"@pd32517"}, ()=>{
      //param Kxi Category is the tabName keyword not data so it will not be changed
      customer.assignToCustomer("KxI Category");
    })

    it("Verify if the user is able to see the assigned content Library on KXI Definition tab",{tags:"@pd32518"}, ()=>{
      //param KxI Definition is the tabName keyword not data so it will not be changed
      customer.assignToCustomer("KxI Definition");
    })

    it("Verification of Assigned Risk Taxanomy to the Customer",
      {tags:["@pd28639",
        "@pd31396",
        "@pd31407",
        "@pd31408",
        "@pd31409",
        "@pd31410",
        "@pd31401",
        "@pd31403",
        "@pd31404",
        "@pd31405"

      ]}, () => {
      if (!customerProfileData.riskTaxanomy.isRequired) return;
      customer.assignRiskTaxonomy();
    });

    it("Verification of Assigned Control Taxanomy to the Customer",
      {tags:["@pd28640",
        "@pd31406",
        "@pd31418",
        "@pd31419",
        "@pd31420",
        "@pd31421",
        "@pd31411",
        "@pd31412",
        "@pd31413",
        "@pd31414",
        "@pd31415"]
      }, () => {
      if (!customerProfileData.controlTaxanomy.isRequired) return;
      customer.assignControlTaxonomy();
    });

    it("Assign Assessment to the Customer",
      {tags:["@pd28641",
        "@pd31417",
        "@pd31397",
        "@pd31398",
        "@pd31399",
        "@pd31400",
        "@pd31422",
        "@pd31423",
        "@pd31424",
        "@pd31425",
        "@pd31426",
        "@pd31427",
        "@pd31674"
      ]}, () => {
      if (!customerProfileData.assessment.isRequired) return;
      customer.assignAssessment(true);
    });

    // this test will be failed because of front end issues on Regulation/standards.
    it("Assign Regulations to the customer",
      {tags:[
        "@pd31234",
        "@pd31233",
        "@pd31232",
        "@pd31231",
        "@pd31230",
        "@pd31229",
        "@pd31228",
        "@pd31225",
        "@pd31227",
        "@pd31226",
        "@pd31249",
        "@pd31673"
      ]},
      ()=>{
      customer.verifyAddedCustomer(customers,"updateCustomer")
      assessment.assignRegulationsStandard(true)
      assessment.saveRegulationsStandard()
    })

    it("Assign Questionaire to the customer",
      {tags:[
        "@pd31259",
        "@pd31258",
        "@pd31257",
        "@pd31256",
        "@pd31255",
        "@pd31254",
        "@pd31253",
        "@pd31252",
        "@pd31251",
        "@pd31260",
      ]}
      ,()=>{
      if (!customerProfileData.questionBank.isRequired) return;
      assessment.addQuestionaireReseller(customers, true, true)
    })
  }
)
});
