const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Path to your test files (adjust if necessary)
const TEST_FOLDER = "cypress/e2e";

// Get all arguments passed to the script (including tags and options)
const args = process.argv.slice(2); // Exclude 'node' and 'filter-tests.js' from args

console.log("args", args);

// Extract tags from arguments (tags start with '@')
const andTags = args.filter((arg) => arg.includes("+")); // Tags for AND logic (e.g., @login+@feature)
const orTags = args.filter((arg) => !arg.includes("+") && arg.startsWith("@")); // Tags for OR logic (e.g., @login, @checkout)
console.log("andTags", andTags);
console.log("orTags", orTags);

const cypressOptions = args[args.length - 1]; // Options for Cypress run (e.g., --headed, --no-exit)

// If no tags are provided, show an error
if (andTags.length === 0 && orTags.length === 0) {
  console.error(
    "❌ Please provide at least one tag. Example: npm run test:tag @login+@feature"
  );
  process.exit(1);
}

// Function to find test files with AND logic (all tags must be present)
function findTestFilesWithAndTags(andTags) {
  let matchingFiles = [];

  function searchFiles(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        searchFiles(filePath); // Recursive search in subdirectories
      } else if (file.endsWith(".cy.js") || file.endsWith(".cy.ts")) {
        // Adjust file extensions if needed
        const content = fs.readFileSync(filePath, "utf8");
        // Check if the file contains **all** the specified AND tags
        if (andTags.every((tag) => content.includes(tag))) {
          matchingFiles.push(filePath);
        }
      }
    });
  }

  searchFiles(TEST_FOLDER);
  return matchingFiles;
}

// Function to find test files with OR logic (any tag should be present)
function findTestFilesWithOrTags(orTags) {
  let matchingFiles = [];

  function searchFiles(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        searchFiles(filePath); // Recursive search in subdirectories
      } else if (file.endsWith(".cy.js") || file.endsWith(".cy.ts")) {
        // Adjust file extensions if needed
        const content = fs.readFileSync(filePath, "utf8");
        // Check if the file contains **any** of the specified OR tags
        if (orTags.some((tag) => content.includes(tag))) {
          matchingFiles.push(filePath);
        }
      }
    });
  }

  searchFiles(TEST_FOLDER);
  return matchingFiles;
}

// Get test files that contain AND tags
let andSpecFiles = [];
const andTagsArray = andTags.map((tag) => tag.split("+")).flat();
if (andTagsArray.length > 0) {
  andSpecFiles = findTestFilesWithAndTags(andTagsArray);
}

// Get test files that contain OR tags
let orSpecFiles = [];
const orTagsArray = orTags.map((tag) => tag.split(" ")).flat();
if (orTagsArray.length > 0) {
  orSpecFiles = findTestFilesWithOrTags(orTagsArray);
}

// Combine both sets of files (AND + OR)
const specFiles = [...new Set([...andSpecFiles, ...orSpecFiles])];
console.log("Matching test files:");
console.log(specFiles);

// Build the Cypress run command with the filtered test cases and options
let command = `npx cypress run --spec "${specFiles.join(",")}"`;

if (cypressOptions.length > 0) {
  const options = cypressOptions.replace("=", " ").split(",");
  console.log("Cypress options:", options);

  options.forEach((option) => {
    command += ` --${option}`;
  });
}

console.log(`Executing: ${command}`);
execSync(command, { stdio: "inherit" });
