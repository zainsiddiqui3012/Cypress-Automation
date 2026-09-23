import Locations from "../../support/POM/Administration/LocationsBranches.js";
const testData = require("../../fixtures/Administration/LocationsBranches.json");
const dataFile = "cypress/fixtures/Administration/LocationsBranches.json";
import locators from "../../fixtures/locators.json";
import dayjs from "dayjs";
describe(
  "Add Location/Branches From Customer Space",
  {
    tags: [
      "@pd32057",
      "@administration",
      "@locations-branches",
      "@regression",
      "@erm",
    ],
  },
  () => {
    const loc = new Locations();

    context("Location and Sites Screen --- Applicability", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitLocationBranches();
        cy.waitForTopMsgLoaderToDisappear(20000);
      });

      /**
       * @description This test verifies the functionality of adding Location/Branches From Customer Space.
       */
      it(
        "Verify that a new site can be added with valid Name and Process Owner fields",
        {
          tags: ["@smoke", "@pd31103"],
        },
        () => {
          //Add Site with Valid Data
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.add.preName + currentTime;
            loc.openLocationForm();
            loc.inputSiteName(name);
            loc.addLocationSite("add");
            loc.selectProcessOwner();
            loc.clickSaveButton();
            cy.visitLocationBranches();
            loc.verifyAddedLocation(name);
            loc.writeSiteName(name, "add");
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding an error message is displayed when trying to save without entering the Name field Location/Branches From Customer Space.
       */
      it(
        "Verify that an error message is displayed when trying to save without entering the Name field.",
        {
          tags: ["@smoke", "@pd31104"],
        },
        () => {
          cy.readFile(dataFile).then((data) => {
            //Add Site with Missing Name Field
            loc.openLocationForm();
            loc.clickSaveButton();
            cy.verifyToastMessageText(data.toastMsg.mandatoryError, 10000);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches a site can be added without selecting a Process Owner From Customer Space.
       */
      it(
        "Verify that a site can be added without selecting a Process Owner.",
        {
          tags: ["@smoke", "@pd31105"],
        },
        () => {
          //Add Site with Missing Process Owner
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.add.preName + currentTime;
            loc.openLocationForm();
            loc.inputSiteName(name);
            loc.addLocationSite("add");
            loc.clickSaveButton();
            cy.visitLocationBranches();
            loc.verifyAddedLocation(name);
            loc.writeSiteName(name, "add");
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches an error message is displayed when trying to add a site with a duplicate Name value From Customer Space.
       */
      it(
        "Verify that an error message is displayed when trying to add a site with a duplicate Name value.",
        {
          tags: ["@smoke", "@pd31106"],
        },
        () => {
          //Add Site with Duplicate Name
          cy.readFile(dataFile).then((data) => {
            loc.openLocationForm();
            loc.inputSiteName(data.add.locationName);
            loc.addLocationSite("add");
            loc.selectProcessOwner();
            loc.clickSaveButton();
            cy.verifyToastMessageText(data.toastMsg.duplicateError, 10000);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches From Customer Space.
       */
      it(
        "Verify that clicking Cancel on the Add Site form does not save the new site and navigates back to the previous screen..",
        {
          tags: ["@smoke", "@pd32057"],
        },
        () => {
          //Cancel Add Site Operation
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.add.preName + currentTime;
            loc.openLocationForm();
            loc.inputSiteName(name);
            loc.addLocationSite("add");
            loc.cancelSiteScreen();
            cy.reload();
            loc.locationNotExists(name);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches the required field (Name) is highlighted when left blank From Customer Space.
       */
      it(
        "Verify that the required field (Name) is highlighted when left blank.",
        {
          tags: ["@smoke", "@pd31108"],
        },
        () => {
          //Verify Required Fields Highlighted
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.add.preName + currentTime;
            loc.openLocationForm();
            loc.addLocationSite("add");
            loc.clickSaveButton();
            cy.verifyToastMessageText(data.toastMsg.mandatoryError, 10000);
            cy.reload();
            loc.locationNotExists(name);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches the Process Owner dropdown displays valid options and allows selection From Customer Space.
       */
      it(
        "Verify that the Process Owner dropdown displays valid options and allows selection.",
        {
          tags: ["@smoke", "@pd31109"],
        },
        () => {
          //Verify Process Owner Dropdown
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.add.preName + currentTime;
            loc.openLocationForm();
            loc.inputSiteName(name);
            loc.addLocationSite("add");
            loc.selectProcessOwner();
            loc.clickSaveButton();
            cy.visitLocationBranches();
            loc.verifyAddedLocation(name);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches the Name field of an existing site can be updated successfully From Customer Space.
       */
      it(
        "Verify that the Name field of an existing site can be updated successfully..",
        {
          tags: ["@smoke", "@pd31110"],
        },
        () => {
          //Verify Edit Site Name
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.update.preName + currentTime;
            loc.clickExistingSite(data.add.locationName);
            loc.inputSiteName(name);
            loc.clickSaveButton();
            cy.visitLocationBranches();
            loc.verifyAddedLocation(name);
            loc.writeSiteName(name, "update");
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches an error message is displayed when trying to save an existing site with an empty Name field From Customer Space.
       */
      it(
        "Verify that an error message is displayed when trying to save an existing site with an empty Name field. ",
        {
          tags: ["@smoke", "@pd31113"],
        },
        () => {
          //Edit Site with Missing Name Field
          cy.readFile(dataFile).then((data) => {
            loc.clickExistingSite(data.update.locationName);
            cy.get(locators.administration.resellers.itextBox).clear();
            loc.clickSaveButton();
            cy.verifyToastMessageText(data.toastMsg.mandatoryError, 10000);
            cy.visitLocationBranches();
            loc.verifyAddedLocation(data.update.locationName);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches clicking "Cancel" on the Edit Site form does not save any changes and retains the original values From Customer Space.
       */
      it(
        "Verify that clicking Cancel on the Edit Site form does not save any changes and retains the original values.",
        {
          tags: ["@smoke", "@pd32057"],
        },
        () => {
          //Verify Cancel Functionality on Edit Screen
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const name = data.update.preName + currentTime;
            loc.clickExistingSite(data.update.locationName);
            loc.inputSiteName(name);
            loc.addLocationSite("update");
            loc.cancelSiteScreen();
            cy.visitLocationBranches();
            loc.verifyAddedLocation(data.update.locationName);
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches a user can select a single requirement from the dropdown list From Customer Space.
       */
      it(
        "Verify that a user can select a single requirement from the dropdown list..",
        {
          tags: ["@smoke", "@pd31117", "@pd31122", "@pd37308"],
        },
        () => {
          cy.readFile(dataFile).then((data) => {
            loc.clickExistingSite(data.update.locationName);
            cy.get(locators.administration.resellers.singleRequirement).click();
            cy.waitForTopMsgLoaderToDisappear(15000);
            cy.get(locators.administration.resellers.clickCategory).click();
            loc.selectSingleRequirement(data.update.category);
            loc.clickSaveButton();
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches a user can remove a previously selected requirement by clicking the "X" next to it From Customer Space.
       */
      it(
        "Verify that a user can remove a previously selected requirement by clicking the X next to it...",
        {
          tags: ["@smoke", "@pd37311"],
        },
        () => {
          //Select Multiple Requirements
          cy.readFile(dataFile).then((data) => {
            loc.clickExistingSite(data.update.locationName);
            cy.get(locators.administration.resellers.singleRequirement).click();
            cy.waitForTopMsgLoaderToDisappear(15000);
            cy.get(locators.administration.resellers.clickCategory).click();
            loc.clearCategory(1, data.update.category);
            loc.clickSaveButton();
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches that the "Select All" option selects all available requirements in the list. From Customer Space.
       */
      it(
        "Verify that the Select All option selects all available requirements in the list....",
        {
          tags: ["@smoke", "@pd37310"],
        },
        () => {
          //Select All Requirements
          cy.readFile(dataFile).then((data) => {
            loc.clickExistingSite(data.update.locationName);
            loc.selectAllRequirements();
            loc.clickSaveButton();
          });
        }
      );

      /**
       * @description This test verifies the functionality of adding Location/Branches that deselecting the "Select All" option removes all selected requirements From Customer Space.
       */
      it(
        "Verify that deselecting the Select All option removes all selected requirements..",
        {
          tags: ["@smoke", "@pd37309"],
        },
        () => {
          //Deselect All Requirements
          cy.readFile(dataFile).then((data) => {
            loc.clickExistingSite(data.update.locationName);
            loc.unselectAllRequirements();
            loc.clickSaveButton();
            cy.reload();
            cy.get("body").should("not.contain", data.update.requirement);
          });
        }
      );
    });

    context(
      "add and Update Functionalities of BSA SubCategory and verify on Areas DropDown.",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitBSASubCategory();
          cy.waitForTopMsgLoaderToDisappear(50000);
        });
        /**
         * @description This test verifies the functionality of adding Location/Branches  a new sub-category can be added with a valid name and status From Customer Space.
         */
        it(
          "Verify that a new sub-category can be added with a valid name and status.",
          {
            tags: ["@smoke", "@pd38391"],
          },
          () => {
            //Add New Sub-Category
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const bsaCategoryName =
                data.bsaSubCategory.add.preName + currentTime;
              loc.clickBSASubCategoryAddBtn();
              loc.addBSASubCategories(bsaCategoryName);
              cy.waitForElementToVisible(
                locators.administration.toastMsg,
                10000
              );
              cy.reload();
              cy.waitForTopMsgLoaderToDisappear(30000);
              loc.searchBSASubCategory(bsaCategoryName);
              loc.verifyBSASubCategories(bsaCategoryName);
              loc.writeBSASubCategory("add", bsaCategoryName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that sub-categories are displayed in the Areas screen dropdown From Customer Space.
         */
        it(
          "Verify that sub-categories are displayed in the Areas screen dropdown.",
          {
            tags: ["@smoke", "@pd38400"],
          },
          () => {
            //View Sub-Categories in Areas Screen
            cy.visitArea();
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const areaName = data.areas.add.preName + currentTime;
              loc.clickAddAreasBtn();
              loc.typeAreaName(areaName);
              loc.viewSubCategory(data.bsaSubCategory.add.name);
              cy.clickOptionalBooleanFieldCondition(
                data.areas.add.active,
                locators.administration.customers.activeStatus
              );
              loc.clickSaveButton();
              loc.clickTopRightPageBtn();
              cy.contains(areaName);
              loc.writeAreaName("add", areaName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that a newly created sub-category can be selected and saved in an Area From Customer Space.
         */
        it(
          "Verify that a newly created sub-category can be selected and saved in an Area.",
          {
            tags: ["@smoke", "@pd38401"],
          },
          () => {
            //View Sub-Categories in Areas Screen
            cy.visitArea();
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const areaName = data.areas.add.preName + currentTime;
              loc.clickAddAreasBtn();
              loc.typeAreaName(areaName);
              loc.viewSubCategory(data.bsaSubCategory.add.name);
              cy.clickOptionalBooleanFieldCondition(
                data.areas.add.active,
                locators.administration.customers.activeStatus
              );
              loc.clickSaveButton();
              loc.clickTopRightPageBtn();
              cy.contains(areaName);
              loc.writeAreaName("add", areaName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches an existing sub-category can be updated successfully From Customer Space.
         */
        it(
          "Verify that an existing sub-category can be updated successfully.",
          {
            tags: ["@smoke", "@pd38392"],
          },
          () => {
            //Edit Existing Sub-Category
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const updatedCategoryName =
                data.bsaSubCategory.update.preName + currentTime;
              loc.searchBSASubCategory(data.bsaSubCategory.add.name);
              loc.addBSASubCategories(updatedCategoryName);
              cy.waitForElementToVisible(
                locators.administration.toastMsg,
                10000
              );
              cy.reload();
              cy.waitForTopMsgLoaderToDisappear(30000);
              loc.searchBSASubCategory(updatedCategoryName);
              loc.verifyBSASubCategories(updatedCategoryName);
              loc.writeBSASubCategory("update", updatedCategoryName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that updating a sub-category reflects correctly in the related Area From Customer Space.
         */
        it(
          "Verify that updating a sub-category reflects correctly in the related Area.",
          {
            tags: ["@smoke", "@pd38402"],
          },
          () => {
            //Edit Area with Updated Sub-Category
            cy.visitArea();
            cy.readFile(dataFile).then((data) => {
              loc.clickTopRightPageBtn();
              loc.verifyUpdatedBSAInAreas(
                data.areas.add.name,
                data.bsaSubCategory.update.name
              );
            });
          }
        );

        it(
          "Verify that deleting a sub-category used in an Area displays an appropriate warning or prevents deletion.",
          { tags: ["@pd38403"] },
          () => {
            //if BSA SubCategory is added in any Areas it can not be deleted and showing error when manually delete
            cy.readFile(dataFile).then((data) => {
              loc.searchBSASubCategory(data.bsaSubCategory.update.name);
              loc.deleteBSASubCategories();
            });
          }
        );

        //this test is running fine but it is not added in the detailed sheet and we must need to have sub Category in BSA screen.
        it.skip("Verify that deleting a sub-category also removes it from related areas in the Areas screen.", () => {
          //Delete Sub-Category
          cy.readFile(dataFile).then((data) => {
            loc.searchBSASubCategory(data.bsaSubCategory.update.name);
            loc.deleteBSASubCategories();
            cy.verifyToastMessageText(data.toastMsg.subCategoryDeleted, 20000);
          });
        });
      }
    );

    context("add, update and verify Areas.", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("USER").FNBA.USERNAME,
          Cypress.env("USER").FNBA.PASSWORD,
          Cypress.env("USER").FNBA.KEY
        );
        cy.visitArea();
        cy.waitForTopMsgLoaderToDisappear(50000);
      });

      it(
        "Verify that a new area can be added with a valid name, selected sub-categories, and status.",
        { tags: ["@pd38404"] },
        () => {
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const areaName = data.areas.add.preName + currentTime;
            loc.clickAddAreasBtn();
            loc.typeAreaName(areaName);
            loc.viewSubCategory(data.bsaSubCategory.update.name);
            cy.clickOptionalBooleanFieldCondition(
              data.areas.add.active,
              locators.administration.customers.activeStatus
            );
            loc.clickSaveButton();
            loc.clickTopRightPageBtn();
            cy.contains(areaName);
            loc.writeAreaName("add", areaName);
          });
        }
      );

      it(
        "Verify that areas are displayed in the Categories screen dropdown.",
        {
          tags: ["@smoke", "@pd38406", "@pd38407"],
        },
        () => {
          //View Areas in Categories Screen
          cy.visitRegulationsObligations();
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const catName = data.category.add.preName + currentTime;
            loc.clickAddCategoryBtn();
            loc.addUpdateCategory("add", catName);
            loc.searchCategoryFilter(catName);
            cy.contains(catName);
            loc.writeCategoryName("add", catName);
          });
        }
      );

      it(
        "Verify that an existing area can be updated successfully.",
        { tags: "@pd38405" },
        () => {
          cy.readFile(dataFile).then((data) => {
            const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
            const areaUpdatedName = data.areas.update.preName + currentTime;
            loc.clickTopRightPageBtn();
            cy.contains(data.areas.add.name).click();
            loc.typeAreaName(areaUpdatedName);
            cy.clickOptionalBooleanFieldCondition(
              data.areas.update.active,
              locators.administration.customers.activeStatus
            );
            loc.clickSaveButton();
            loc.clickTopRightPageBtn();
            cy.contains(areaUpdatedName);
            loc.writeAreaName("update", areaUpdatedName);
          });
        }
      );

      it(
        "Verify that updating an area reflects correctly in the related Category.",
        {
          tags: ["@smoke", "@pd38408"],
        },
        () => {
          //View Areas in Categories Screen
          cy.visitRegulationsObligations();
          cy.readFile(dataFile).then((data) => {
            loc.searchCategoryFilter(data.category.add.name);
            cy.contains(data.category.add.name).click();
            cy.contains(data.areas.update.name);
          });
        }
      );
    });

    context(
      "add, update agencies and check it is displaying in Category.",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );
          cy.visitAgencies();
          cy.waitForTopMsgLoaderToDisappear(50000);
        });
        /**
         * @description This test verifies the functionality of adding Location/Branches that a new agency can be added with a valid name and status From Customer Space.
         */
        it(
          "Verify that a new agency can be added with a valid name and status.",
          {
            tags: ["@smoke", "@pd38409"],
          },
          () => {
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const agencyName = data.agencies.add.preName + currentTime;
              loc.clickAddAgencyBtn();
              loc.addUpdateAgency(agencyName);
              cy.clickOptionalBooleanFieldCondition(
                data.agencies.add.active,
                locators.administration.customers.activeStatus
              );
              loc.clickSaveButton();
              loc.clickTopRightPageBtn();
              cy.contains(agencyName);
              loc.writeAgencyName("add", agencyName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that agencies are displayed in the Categories screen dropdown From Customer Space.
         */
        it(
          "Verify that agencies are displayed in the Categories screen dropdown.",
          {
            tags: ["@smoke", "@pd38411"],
          },
          () => {
            //View Areas in Categories Screen
            cy.visitRegulationsObligations();
            cy.readFile(dataFile).then((data) => {
              loc.writeAreaName("add", data.areas.update.name);
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const catName = data.category.add.preName + currentTime;
              loc.clickAddCategoryBtn();
              loc.addUpdateCategory("add", catName);
              loc.searchCategoryFilter(catName);
              cy.contains(catName).click();
              cy.contains(data.agencies.add.name);
              loc.writeCategoryName("add", catName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that a newly created agency can be selected and saved in a Category From Customer Space.
         */
        it(
          "Verify that a newly created agency can be selected and saved in a Category.",
          {
            tags: ["@smoke", "@pd38412"],
          },
          () => {
            //View Areas in Categories Screen
            cy.visitRegulationsObligations();
            cy.readFile(dataFile).then((data) => {
              loc.writeAreaName("add", data.areas.update.name);
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const catName = data.category.add.preName + currentTime;
              loc.clickAddCategoryBtn();
              loc.addUpdateCategory("add", catName);
              loc.searchCategoryFilter(catName);
              cy.contains(catName).click();
              cy.contains(data.agencies.add.name);
              loc.writeCategoryName("add", catName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that an existing agency can be updated successfully From Customer Space.
         */
        it(
          "Verify that an existing agency can be updated successfully.",
          {
            tags: ["@smoke", "@pd38410"],
          },
          () => {
            cy.waitForTopMsgLoaderToDisappear(30000);
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const agencyUpdateName =
                data.agencies.update.preName + currentTime;
              loc.clickTopRightPageBtn();
              cy.contains(data.agencies.add.name).click();
              loc.addUpdateAgency(agencyUpdateName);
              cy.clickOptionalBooleanFieldCondition(
                data.agencies.update.active,
                locators.administration.customers.activeStatus
              );
              loc.clickSaveButton();
              loc.clickTopRightPageBtn();
              cy.contains(agencyUpdateName);
              loc.writeAgencyName("update", agencyUpdateName);
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that updating an agency reflects correctly in the related Category From Customer Space.
         */
        it(
          "Verify that updating an agency reflects correctly in the related Category.",
          {
            tags: ["@smoke", "@pd38413"],
          },
          () => {
            //Updated Agency is displayed in the added category
            cy.visitRegulationsObligations();
            cy.readFile(dataFile).then((data) => {
              loc.searchCategoryFilter(data.category.add.name);
              cy.contains(data.category.add.name).click();
              cy.contains(data.agencies.update.name);
            });
          }
        );
      }
    );

    context(
      "add, Update Categories and verify them on Site Applicability",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("USER").FNBA.USERNAME,
            Cypress.env("USER").FNBA.PASSWORD,
            Cypress.env("USER").FNBA.KEY
          );

          cy.visitRegulationsObligations();
          cy.waitForTopMsgLoaderToDisappear(50000);
        });
        /**
         * @description This test verifies the functionality of adding Location/Branches that updating a new category can be added with valid industries, agencies, and area From Customer Space.
         */
        it(
          "Verify that a new category can be added with valid industries, agencies, and areas.",
          {
            tags: ["@smoke", "@pd38414"],
          },
          () => {
            //Add New Category
            cy.readFile(dataFile).then((data) => {
              loc.writeAgencyName("add", data.agencies.update.name);
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const catName = data.category.add.preName + currentTime;
              loc.clickAddCategoryBtn();
              loc.addUpdateCategory("add", catName);
              loc.searchCategoryFilter(catName);
              cy.contains(catName);
              loc.writeCategoryName("add", catName);
            });
          }
        );

        it(
          "Verify that a new site can be added with valid Name and Process Owner fields",
          {
            tags: ["@smoke", "@pd31103"],
          },
          () => {
            //Add Site with Valid Data
            cy.readFile(dataFile).then((data) => {
              cy.visitLocationBranches();
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const name = data.add.preName + currentTime;
              loc.openLocationForm();
              loc.inputSiteName(name);
              loc.addLocationSite("add");
              loc.selectProcessOwner();
              loc.clickSaveButton();
              cy.visitLocationBranches();
              loc.verifyAddedLocation(name);
              loc.writeSiteName(name, "add");
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that categories are displayed in the Edit Site screen dropdown From Customer Space.
         */
        it(
          "Verify that categories are displayed in the Edit Site screen dropdown.",
          {
            tags: ["@smoke", "@pd38416", "@pd3417"],
          },
          () => {
            //View Categories in Edit Site Screen
            cy.readFile(dataFile).then((data) => {
              cy.visitLocationBranches();
              loc.clickExistingSite(data.add.locationName);
              cy.get(
                locators.administration.resellers.singleRequirement
              ).click();
              cy.waitForTopMsgLoaderToDisappear(15000);
              cy.get(locators.administration.resellers.clickCategory).click();
              loc.selectSingleRequirement(data.update.viewCategory);
              loc.clickSaveButton();
            });
          }
        );

        it(
          "Verify that removing an applicable category updates the applicability section successfully.",
          { tags: "@pd38436" },
          () => {
            //Remove Categories in Edit Site Screen
            cy.readFile(dataFile).then((data) => {
              cy.visitLocationBranches();
              loc.clickExistingSite(data.add.locationName);
              cy.get(
                locators.administration.resellers.singleRequirement
              ).click();
              cy.waitForTopMsgLoaderToDisappear(15000);
              cy.get(locators.administration.resellers.clickCategory).click();
              loc.clearCategory(1, data.update.viewCategory);
              loc.clickSaveButton();
            });
          }
        );

        /**
         * @description This test verifies the functionality of adding Location/Branches that updating a new category can be added with valid industries, agencies, and area From Customer Space.
         */
        it(
          "Verify that an existing category can be updated successfully..",
          {
            tags: ["@smoke", "@pd38415"],
          },
          () => {
            //Edit Existing Category
            cy.waitForTopMsgLoaderToDisappear(30000);
            cy.readFile(dataFile).then((data) => {
              const currentTime = dayjs().format("MM/DD/YYYY HH:mm:ss");
              const catUpdateName = data.category.update.preName + currentTime;
              loc.searchCategoryFilter(data.category.add.name);
              cy.contains(data.category.add.name).click();
              loc.addUpdateCategory("update", catUpdateName);
              loc.searchCategoryFilter(catUpdateName);
              cy.contains(catUpdateName);
              loc.writeCategoryName("update", catUpdateName);
            });
          }
        );

        /**
    //  * @description This test verifies the functionality of adding Location/Branches that Verify that applicable categories can be updated successfully From Customer Space.
    //  */
        it(
          "Verify that applicable categories can be updated successfully.",
          {
            tags: ["@smoke", "@pd38418"],
          },
          () => {
            //Edit Applicable Category in Site
            cy.readFile(dataFile).then((data) => {
              cy.visitLocationBranches();
              loc.clickExistingSite(data.add.locationName);
              cy.get(
                locators.administration.resellers.singleRequirement
              ).click();
              cy.waitForTopMsgLoaderToDisappear(15000);
              cy.get(locators.administration.resellers.clickCategory).click();
              loc.selectSingleRequirement(data.update.viewCategory);
              loc.clickSaveButton();
            });
          }
        );
      }
    );
  }
);
