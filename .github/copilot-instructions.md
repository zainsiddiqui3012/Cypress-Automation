# Copilot Instructions for This Repository

## Priority Rules (Run These First)
- Always apply the following rules BEFORE generating any suggestions, reviews, completions, or code:

### 1. File Naming Convention
- File names must follow `[ScreenName_SubScreen]` format.
- Example: `Risk_Calculation`, `User_Profile`.
- Avoid special characters or spaces.
- Keep names concise but descriptive of the module and submodule.

### 2. Method Naming & Comments
- Method names must start with lowercase and follow `action + FieldName` format.
- Example: `typeBACategory`, `clickButton`.
- Include clear comments above each method explaining:
  - Purpose of the method.
  - Expected input/output.
  - Any side effects or dependencies.
- Avoid ambiguous or generic names like `doAction()` or `handleData()`.

### 3. Locator Usage (Cypress)
- Use **CSS selectors only**.  
- Avoid using XPath in Cypress tests.  
- Prefer unique IDs or classes when possible.  
- Example: `#username` or `.submit-btn` instead of complex CSS chains.  
- Do not hardcode index-based selectors (like `:nth-child`) unless necessary.

### 4. Locator Usage (Selenium)
- XPath is allowed but must be readable and maintainable.  
- Avoid complex conditional logic inside locators.  
- Prefer absolute paths only when no other option exists.  
- Example of acceptable XPath: `//button[@id='submitBtn']`.

### 5. Commit Messages
- Write **clear and self-explanatory commit messages**.  
- Include **Test Case Summary or Title** if applicable.  
- Use imperative mood (e.g., `Add login test for Risk module`).  
- Avoid vague messages like `Fixed stuff` or `Update code`.

### 6. Code Push Frequency
- Push changes to the remote branch **at the end of each day**.  
- Avoid large batches; commit logically grouped changes.  
- Use feature branches and meaningful branch names: `feature/login-module`.

### 7. Test Data Management
- Store test data in `/fixtures` folder in JSON format.  
- Create **one JSON file per module**.  
- Name JSON files clearly: `riskModuleData.json`, `userProfileData.json`.  
- Avoid hardcoding data inside test files; always reference fixtures.
### 8. Code Reuse & Optimization
- Reuse existing methods whenever possible; avoid duplicating code.  
- Pass **locator and value** as parameters to generic methods.  
- Example: `fillInputField(locator, value)` instead of writing separate methods per field.  
- Refactor repetitive code blocks into reusable functions.  

### 9. Project Folder Structure
- Maintain a clean, logical structure: `Main Module > Sub Module`.  
- Each module folder should contain:
  - `specs/` for test files  
  - `fixtures/` for test data  
- Maintain consistency across files, methods, and locators.

  - `support/` for reusable commands/helpers  
- Avoid clutter at the root level; keep only essential configuration files.
- Include examples where possible to help Copilot suggest **correct patterns automatically**.  

- These rules must be evaluated before any other suggestion logic or code generation steps.  
- If any rule is violated, Copilot must stop normal suggestion flow and notify the user of the violation **before doing anything else**.  
### 10. Test Case Size
- Limit **8–10 `it()` blocks per spec file**.  
- Avoid duplicating existing commands or writing similar logic from scratch.  
- If you need to extend a command, wrap it rather than modify the original.

## Behavior Requirements

### 11. Reuse Existing Cypress Commands
- If a command already exists (e.g., `locators.administration.QB.qbTagDropDown`), **use it directly**.  
- Each `it()` should test **a single behavior or scenario**.  
- Use descriptive titles for `it()` blocks.  
- Split large test cases into multiple smaller ones for readability.

