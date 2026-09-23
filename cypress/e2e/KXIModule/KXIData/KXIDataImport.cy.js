import { KXIDataImport } from '../../../support/POM/KXIModule/KXIData/KXIDataImport';
import kxiData from '../../../fixtures/KXIModule/KXIDataFREDImport/KXIDataFREDImport.json';

const kxiImport = new KXIDataImport();

describe('KXI Data Import Functionality', {
  tags: [
    '@kxi-management',
    '@kxi-data',
    '@regression',
    '@import',
    '@customer',
    '@predict',
    '@pd36106'
  ]
}, () => {
  context('KXI Data Import Funitionality Validation Cases with RM User', {
    tags: '@withRM'
    
  }, () => {
    const withRM4 = Cypress.env('kxi').customer.withRM4;

    beforeEach(() => {
      cy.loginWithSession(
        'login - with Risk Management',
        withRM4.username,
        withRM4.password,
        withRM4.key
      );
      cy.visitkxiData();
    });

        /**
     * @TestCase PD-38953
     * @Description Verify that the "Download Sample File" link opens the import modal successfully.
     * @Tags @pd38953
     */
    it('Verify that the "Download Sample File" link works', { tags: '@pd38953' }, () => {
      kxiImport.clickImportBtn();
    });

    /**
     * @TestCase PD-38954
     * @Description Verify that the sample file downloads successfully from the import modal.
     * @Tags @pd38954
     */
    it('Verify that the sample file downloads successfully', { tags: '@pd38954' }, () => {
      kxiImport.clickImportBtn();
      kxiImport.clickDownloadSampleFile();
      kxiImport.verifyDownloadFile();
    });

    /**
     * @TestCase PD-38955
     * @Description Verify that an incomplete file is not processed and no record appears in the grid.
     * @Tags @pd38955
     */
    it('Verify that the system does not allow an incomplete file to be uploaded', { tags: '@pd38955' }, () => {
      const fileName = kxiData.incompleteFile;
      const searchTerm = kxiData.searchText;

      kxiImport.clickImportBtn();
      kxiImport.uploadFileAndIntercept(fileName, kxiData.importFileName);
      kxiImport.verifyToastMessage();
      kxiImport.searchAndVerifyRecordNotPresent(searchTerm, kxiData.timeout.min);
    });

    /**
     * @TestCase PD-38956
     * @Description Verify the error toast appears for an unsupported file format.
     * @Tags @pd38956
     */
    it('Verify the proper error message for an unsupported file type', { tags: '@pd38956' }, () => {
      const fileName = kxiData.invalidFormatFile;

      kxiImport.clickImportBtn();
      kxiImport.uploadFileAndIntercept(fileName, kxiData.importFileName);
      kxiImport.validateInterceptResponse(kxiData.importFileName);
      kxiImport.verifyErrorToastMessage();
    });
  });
});