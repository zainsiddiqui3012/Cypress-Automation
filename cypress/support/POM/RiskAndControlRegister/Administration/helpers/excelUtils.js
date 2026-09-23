const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Helper to resolve paths from project root
 * @param {string} relativePath - Path relative to project root
 * @returns {string} Absolute path
 */
function resolveFromProjectRoot(relativePath) {
  // Go up from helpers folder to project root
  // Current: .../cypress/support/POM/RiskAndControlRegister/Administration/helpers
  // Need to go up 6 levels to reach project root
  const projectRoot = path.resolve(__dirname, '../../../../../../');
  console.log(`Project root resolved to: ${projectRoot}`);
  const fullPath = path.resolve(projectRoot, relativePath);
  console.log(`Full path resolved to: ${fullPath}`);
  return fullPath;
}

/**
 * Updates Risk Taxonomy name in Excel file
 * @param {Object} params - Parameters object
 * @param {string} params.sampleFilePath - Path to sample Excel file
 * @param {string} params.outputPath - Path for output Excel file
 * @param {string} params.newTaxonomyName - New taxonomy name to set
 * @param {string} params.contentLibraryName - Content library name to set
 * @returns {Object} Result object with success/error status
 */
function updateRiskTaxonomyNameInExcel({ sampleFilePath, outputPath, newTaxonomyName, contentLibraryName }) {
  try {
    // Resolve paths from project root if they start with cypress/
    let resolvedSamplePath = sampleFilePath;
    let resolvedOutputPath = outputPath;
    
    if (sampleFilePath.startsWith('cypress/')) {
      resolvedSamplePath = resolveFromProjectRoot(sampleFilePath);
    }
    
    if (outputPath.startsWith('cypress/')) {
      resolvedOutputPath = resolveFromProjectRoot(outputPath);
    }

    console.log(`Updating Excel file:`);
    console.log(`- Original sample file: ${sampleFilePath}`);
    console.log(`- Resolved sample file: ${resolvedSamplePath}`);
    console.log(`- Original output file: ${outputPath}`);
    console.log(`- Resolved output file: ${resolvedOutputPath}`);
    console.log(`- New taxonomy name: ${newTaxonomyName}`);
    console.log(`- Content library name: ${contentLibraryName}`);

    // Check if sample file exists
    if (!fs.existsSync(resolvedSamplePath)) {
      throw new Error(`Sample file not found: ${resolvedSamplePath}`);
    }

    // Read the sample Excel file
    const workbook = XLSX.readFile(resolvedSamplePath);
    console.log(`Workbook loaded. Sheets: ${Object.keys(workbook.Sheets).join(', ')}`);
    
    // Update only the Risk Taxonomy sheet - only the Name field
    if (workbook.Sheets['Risk Taxonomy']) {
      const taxonomySheet = workbook.Sheets['Risk Taxonomy'];
      console.log(`Found Risk Taxonomy sheet`);
      
      // Update B2 cell with new taxonomy name
      if (taxonomySheet['B2']) {
        console.log(`Current B2 value: ${taxonomySheet['B2'].v}`);
        taxonomySheet['B2'].v = newTaxonomyName;
        console.log(`Updated B2 value to: ${newTaxonomyName}`);
      } else {
        console.log(`B2 cell not found, creating new cell`);
        taxonomySheet['B2'] = { v: newTaxonomyName, t: 's' };
      }

      // Update D2 cell with content library name if provided
      if (contentLibraryName) {
        if (taxonomySheet['D2']) {
          console.log(`Current D2 value: ${taxonomySheet['D2'].v}`);
          taxonomySheet['D2'].v = contentLibraryName;
          console.log(`Updated D2 value to: ${contentLibraryName}`);
        } else {
          console.log(`D2 cell not found, creating new cell`);
          taxonomySheet['D2'] = { v: contentLibraryName, t: 's' };
        }
      }
    } else {
      throw new Error(`Risk Taxonomy sheet not found in workbook. Available sheets: ${Object.keys(workbook.Sheets).join(', ')}`);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(resolvedOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the updated workbook to new location
    XLSX.writeFile(workbook, resolvedOutputPath);
    console.log(`Excel file written to: ${resolvedOutputPath}`);
    
    // Verify the file was created
    if (fs.existsSync(resolvedOutputPath)) {
      console.log(`File successfully created at: ${resolvedOutputPath}`);
      return { 
        success: true, 
        message: `Excel file updated with taxonomy name: ${newTaxonomyName}`,
        outputPath: resolvedOutputPath
      };
    } else {
      throw new Error(`File was not created at: ${resolvedOutputPath}`);
    }
    
  } catch (error) {
    console.error(`Error updating Excel file: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    return { success: false, error: error.message };
  }
}

/**
 * Checks if file exists
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists
 */
function fileExists(filePath) {
  try {
    // Resolve path from project root if it starts with cypress/
    let resolvedPath = filePath;
    if (filePath.startsWith('cypress/')) {
      resolvedPath = resolveFromProjectRoot(filePath);
    }
    
    const exists = fs.existsSync(resolvedPath);
    console.log(`Checking file existence:`);
    console.log(`- Original path: ${filePath}`);
    console.log(`- Resolved path: ${resolvedPath}`);
    console.log(`- Exists: ${exists}`);
    return exists;
  } catch (error) {
    console.log(`Error checking file existence: ${error.message}`);
    return false;
  }
}

/**
 * Checks if any file exists in a folder starting with a given prefix
 * @param {string} folderPath - Path to the folder
 * @param {string} filePrefix - Prefix to match file names
 * @returns {boolean} True if at least one matching file exists
 */
function fileExistsWithPrefix(folderPath, filePrefix) {
  try {
    let resolvedPath = folderPath;
    if (folderPath.startsWith('cypress/')) {
      resolvedPath = resolveFromProjectRoot(folderPath);
    }
    
    console.log(`Checking for files with prefix:`);
    console.log(`- Folder: ${resolvedPath}`);
    console.log(`- Prefix: ${filePrefix}`);
    
    if (!fs.existsSync(resolvedPath)) {
      console.log(`- Folder does not exist`);
      return false;
    }
    
    const files = fs.readdirSync(resolvedPath);
    const matchingFiles = files.filter(file => file.startsWith(filePrefix));
    
    console.log(`- Total files: ${files.length}`);
    console.log(`- Matching files: ${matchingFiles.length}`);
    if (matchingFiles.length > 0) {
      console.log(`- Found: ${matchingFiles.join(', ')}`);
    }
    
    return matchingFiles.length > 0;
  } catch (error) {
    console.log(`Error checking files with prefix: ${error.message}`);
    return false;
  }
}

module.exports = {
  updateRiskTaxonomyNameInExcel,
  fileExists,
  fileExistsWithPrefix,
  resolveFromProjectRoot
};