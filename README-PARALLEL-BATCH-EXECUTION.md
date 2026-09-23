# 🚀 Cypress Parallel Batch Execution

Accelerate Jenkins test execution with parallel batch processing for QA Automation.

---

## 📖 Overview

### What is This?

A **parallel batch orchestration system** that reduces Jenkins test execution time by running multiple test batches simultaneously using controlled concurrency (p-limit).

### Who is This For?

- **QA Automation Engineers** adding new test modules
- **QA Team Members** running regression suites in Jenkins
- **Team Leads** optimizing test execution time

---

## ❗ Problem Statement

### The Challenge: Slow Jenkins Test Execution

```
┌─────────────────────────────────────────────────────────────────┐
│              Before Parallel Batch Execution                    │
│                  (Sequential Execution)                         │
└─────────────────────────────────────────────────────────────────┘

Jenkins Job: Administration Module Tests
Time: 0hr ──────────────────────────────────────────────> 9hr

Spec 1  ████ (10min)
            Spec 2  ████ (10min)
                        Spec 3  ████ (10min)
                                    ... 54 more specs ...

Total: 9 hours ⏰
```

### Pain Points

- ⏰ **Long Jenkins Jobs:** 9 hours for single module
- 🔄 **Slow Feedback:** Cannot run multiple times per day
- 📊 **Resource Waste:** Jenkins agent using only 1 CPU core
- 🚫 **Multiple Modules:** Would take 27+ hours for 3 modules
- 📅 **Regression Delays:** Full suite takes 15+ hours

---

## 💡 The Solution: Parallel Batch Execution

### Results Achieved

```
┌─────────────────────────────────────────────────────────────────┐
│                      Impact Metrics                             │
└─────────────────────────────────────────────────────────────────┘

⚡ Execution Time:     9 hours → 4 hours (55% faster)
🔄 Daily Runs:         1 run → 2-3 runs per day
💪 Resource Usage:     12% CPU → 60%+ CPU
📊 Full Regression:    15 hours → 6-8 hours
🎯 Multiple Modules:   27 hours → 8 hours
```

---

## 🔧 How p-limit Controls Concurrency

### Understanding p-limit

```
┌─────────────────────────────────────────────────────────────────┐
│              p-limit Concurrency Control                        │
└─────────────────────────────────────────────────────────────────┘

Configuration: const limit = pLimit(5);
Means: Maximum 5 batches run simultaneously

Example with 12 batches:
────────────────────────────────────────────────────────────────

Round 1 (0-1hr):
├─ Batch 1  ████████████ ↓
├─ Batch 2  ████████████ ↓  } 5 running
├─ Batch 3  ████████████ ↓  } at the
├─ Batch 4  ████████████ ↓  } same time
└─ Batch 5  ████████████ ↓

Round 2 (1-2hr):
├─ Batch 6  ████████████ ↓
├─ Batch 7  ████████████ ↓  } Automatically
├─ Batch 8  ████████████ ↓  } starts when
├─ Batch 9  ████████████ ↓  } Round 1
└─ Batch 10 ████████████ ↓    completes

Round 3 (2-3hr):
├─ Batch 11 ████████████ ↓
└─ Batch 12 ████████████ ↓  } Only 2 remaining

Total Time: 3 hours (vs 12 hours serial)
```

## 📋 Quick Start
---

## ⚙️ Configuration

### 1. Define Batches (`tag-batch-config.json`)

```json
{
  "@administration": [
    {
      "batchName": "setup_0",
      "specs": ["trigger-none-reseller", "trigger-none-customer"]
    },
    {
      "batchName": "independent_1",
      "specs": [
        "cypress/e2e/Administration/CustomerProfile.cy.js",
        "cypress/e2e/Administration/LocationsBranches.cy.js"
      ]
    }
  ]
}
```

### 2. Add NPM Script (`package.json`)

```json
{
  "scripts": {
    "trigger-admin-parallel": "node --max-old-space-size=32768 orchestrate-batches.js @administration --config-file=environments/stage-config.config.ts --reporter-options overwrite=false,timestamp=mmddyyyy_HHMMss"
  }
}
```

### 3. Adjust Concurrency (`orchestrate-batches.js`)

```javascript
const limit = pLimit(5); // 5 batches run simultaneously
```

**Recommendations:**
- **Jenkins (8GB, 4 cores):** `pLimit(4-5)`
- **Jenkins (16GB, 8 cores):** `pLimit(6-8)`
- **Local (4GB):** `pLimit(2-3)`

---

## 🆕 Adding a New Module

### Quick Guide

```
┌─────────────────────────────────────────────────────────────────┐
│            Add New Module: 4 Simple Steps                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create test files
        cypress/e2e/YourModule/*.cy.js

Step 2: Add to tag-batch-config.json
        "@your-module": [batches...]

Step 3: Add NPM script to package.json
        "trigger-your-module": "node..."

Step 4: Run and verify
        npm run trigger-your-module
```
### STEP: 1
### CREATE CYPRESS TEST CASE FILE IN cypress/e2e/[ModuleName]/FileName.cy.js
    cypress/e2e/YourModule/*.cy.js
    
### STEP: 2
### Example: Incident Management Module

#### 1️⃣ Update `tag-batch-config.json`

```json
{
  "@incident-management": [
    {
      "batchName": "setup_0",
      "specs": [
        "trigger-incident-setup",
        "trigger-incident-categories"
      ]
    },
    {
      "batchName": "independent_1",
      "specs": [
        "cypress/e2e/IncidentManagement/CreateIncident.cy.js",
        "cypress/e2e/IncidentManagement/IncidentDashboard.cy.js"
      ]
    },
    {
      "batchName": "independent_2",
      "specs": [
        "cypress/e2e/IncidentManagement/IncidentReports.cy.js",
        "cypress/e2e/IncidentManagement/IncidentWorkflow.cy.js"
      ]
    }
  ]
}
```
#### STEP: 3
#### 2️⃣ Update `package.json`

```json
{
  "scripts": {
    "trigger-incident-management": "node --max-old-space-size=32768 orchestrate-batches.js @incident-management --config-file=environments/stage-config.config.ts --reporter-options overwrite=false,timestamp=mmddyyyy_HHMMss",
    
    "trigger-incident-smoke": "node orchestrate-batches.js @incident-management @smoke --config-file=environments/stage-config.config.ts",
    
    "trigger-incident-setup": "npx cypress run --config-file environments/stage-config.config.ts --spec cypress/e2e/IncidentManagement/IncidentSetup.cy.js"
  }
}
```
#### STEP: 4
#### 3️⃣ Test Locally

```bash
# Full suite
npm run trigger-incident-management

# Smoke tests only
npm run trigger-incident-smoke
```
### Run Tests in Jenkins


```bash
# Administration module
npm run trigger-admin-parallel

# KXI Management module
npm run trigger-kxi-management

# Risk Management smoke tests
npm run trigger-rm-smoke-tests
```

### Jenkins Job Configuration

```bash
# Build Step: Execute Shell
cd cypress-automation
npm install
npm run trigger-admin-parallel

# Automatic execution:
# - orchestrate-batches.js manages batches
# - p-limit(5) controls concurrency
# - Final report: merged-report.html
```

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                  Execution Flow in Jenkins                      │
└─────────────────────────────────────────────────────────────────┘

Jenkins Job Started
       ↓
npm run trigger-admin-parallel
       ↓
┌─────────────────────────┐
│ orchestrate-batches.js  │
└─────────────────────────┘
       ↓
┌─────────────────────────┐
│ tag-batch-config.json   │ ← Loads batch definitions
└─────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│ Execute with p-limit(5) Concurrency              │
└──────────────────────────────────────────────────┘
       ↓
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Batch 1  │  │ Batch 2  │  │ Batch 3  │  │ Batch 4  │  │ Batch 5  │
│ .json    │  │ .json    │  │ .json    │  │ .json    │  │ .json    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
       ↓            ↓            ↓            ↓            ↓
       └────────────┴────────────┴────────────┴────────────┘
                              ↓
                 ┌─────────────────────────┐
                 │   Merge All Reports     │
                 │  merged-report.json     │
                 └─────────────────────────┘
                              ↓
                 ┌─────────────────────────┐
                 │  Generate HTML Report   │
                 │  merged-report.html ✅  │
                 └─────────────────────────┘
                              ↓
              Jenkins Job Completed
```

**Key Files:**
```
cypress-automation/
├── orchestrate-batches.js          # Parallel execution controller
├── tag-batch-config.json           # Batch definitions
├── package.json                    # NPM scripts
└── cypress/
    └── reports/
        └── html/
            └── merged-report.html  # 📊 Single report
```

### Visual Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                Configuration Relationship                       │
└─────────────────────────────────────────────────────────────────┘

tag-batch-config.json              package.json
┌───────────────────┐              ┌─────────────────────┐
│ "@incident-mgmt"  │ ◄────────────┤ "trigger-incident"  │
│ [                 │  References  │ "node ... @incident"│
│   { batch_1 }     │              │ }                   │
│   { batch_2 }     │              └─────────────────────┘
│ ]                 │
└───────────────────┘
        │
        │ Contains
        ↓
┌───────────────────────────┐
│ Test Specs                │
│ ├─ CreateIncident.cy.js   │
│ ├─ IncidentDashboard.cy.js│
│ └─ IncidentReports.cy.js  │
└───────────────────────────┘
```

### Module Template

```json
// tag-batch-config.json
{
  "@your-module": [
    {
      "batchName": "setup_0",
      "specs": ["trigger-prerequisite-1", "trigger-prerequisite-2"]
    },
    {
      "batchName": "independent_1",
      "specs": [
        "cypress/e2e/YourModule/Feature1.cy.js",
        "cypress/e2e/YourModule/Feature2.cy.js"
      ]
    }
  ]
}
```
### After Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│               With Parallel Batch Execution                     │
│           (5 Batches Running Simultaneously)                    │
└─────────────────────────────────────────────────────────────────┘

Jenkins Job: Administration Module Tests
Time: 0hr ──────────────────────────────────────────────> 4hr

Round 1 (5 batches in parallel):
Batch 1  ████████████████████ (1hr) ↓
Batch 2  ████████████████████ (1hr) ↓
Batch 3  ████████████████████ (1hr) ↓
Batch 4  ████████████████████ (1hr) ↓
Batch 5  ████████████████████ (1hr) ↓

Round 2 (5 batches in parallel):
Batch 6  ████████████████████ (1hr) ↓
Batch 7  ████████████████████ (1hr) ↓
[... more rounds ...]

Total: 4 hours ⚡ (55% faster!)
Time Saved: 5 hours per Jenkins job
```
---
```json
// package.json
{
  "scripts": {
    "trigger-your-module": "node --max-old-space-size=32768 orchestrate-batches.js @your-module --config-file=environments/stage-config.config.ts --reporter-options overwrite=false,timestamp=mmddyyyy_HHMMss"
  }
}
```

### Checklist

```
✅ New Module Checklist
┌────────────────────────────────────────────────────────┐
│ □ Create test files in cypress/e2e/YourModule/        │
│ □ Add "@your-module" to tag-batch-config.json         │
│ □ Define batches (setup_*, independent_*)             │
│ □ Add NPM script to package.json                      │
│ □ Test locally: npm run trigger-your-module           │
│ □ Verify report: merged-report.html                   │
│ □ Update Jenkins job                                  │
│ □ Run in Jenkins and verify time savings!            │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Batch Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    Batch Types Overview                         │
└─────────────────────────────────────────────────────────────────┘

1️⃣ SETUP BATCHES (setup_*)
   Specs run SERIALLY (one after another)
   
   Spec 1 ──> Spec 2 ──> Spec 3
   
   Use when: Tests have dependencies

2️⃣ INDEPENDENT BATCHES (independent_*)
   Specs run IN PARALLEL (all at once)
   
   Spec 1 ↓
   Spec 2 ↓
   Spec 3 ↓
   
   Use when: Tests are isolated

3️⃣ STANDARD BATCHES (any other name)
   Specs run SERIALLY (default safe mode)
   
   Spec 1 ──> Spec 2 ──> Spec 3
   
   Use when: General related tests
```

### Examples

```json
// Setup batch - dependent tests
{
  "batchName": "setup_0",
  "specs": [
    "create-reseller.cy.js",    // Must run first
    "create-customer.cy.js"     // Needs reseller
  ]
}

// Independent batch - isolated tests
{
  "batchName": "independent_1",
  "specs": [
    "test-feature-a.cy.js",  // All run
    "test-feature-b.cy.js",  // at the
    "test-feature-c.cy.js"   // same time
  ]
}

// Standard batch - related tests
{
  "batchName": "spec_ab",
  "specs": [
    "related-test-1.cy.js",  // Run one
    "related-test-2.cy.js"   // by one
  ]
}
```

---

## 🎮 Usage

### Basic Commands

```bash
# Run full suite
npm run trigger-admin-parallel

# Tag filter (smoke tests only)
node orchestrate-batches.js @administration @smoke --config-file=environments/stage-config.config.ts

# Custom environment
node orchestrate-batches.js @administration --config-file=environments/qa-config.config.ts

# More memory
node --max-old-space-size=32768 orchestrate-batches.js @administration --config-file=environments/stage-config.config.ts
```

### Tag Tests

```javascript
// In your spec files
it('login test', { tags: '@smoke' }, () => { /* ... */ });
it('full flow', { tags: '@regression' }, () => { /* ... */ });
```

---

## 📊 Reports

### Structure

```
cypress/reports/html/
├── .jsons/                    # Individual batches
│   ├── batch_1.json
│   ├── batch_2.json
│   └── batch_3.json
│                              ↓
├── merged-report.json         # Combined data
│                              ↓
└── merged-report.html         # 📊 Final report
```

### Report Contents

- ✅ Pass/Fail summary
- ⏱️ Execution times
- ❌ Error messages & stack traces
- 📸 Failure screenshots
- 🔍 Search & filter options

### Timestamped Reports

```bash
# Use timestamp option
--reporter-options timestamp=mmddyyyy_HHMMss

# Result
merged-report.html
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| No batches found | Check tag in `tag-batch-config.json` |
| Config not found | Use: `environments/stage-config.config.ts` |
| Not parallel | Increase `pLimit(5)` in `orchestrate-batches.js` |
| Out of memory | Add `--max-old-space-size=32768` |
| No report | Check `.jsons/` folder has files |

### Quick Fixes

```bash
# Clean start
rm -rf cypress/reports cypress/screenshots
npm run trigger-admin-parallel

# Check p-limit
# Edit orchestrate-batches.js
const limit = pLimit(5);  // Increase if needed
```

---

## 💡 Best Practices

```
✅ DO:
- Group related tests in batches
- Use "setup_*" for dependent tests
- Use "independent_*" for isolated tests
- Balance batch execution times
- Tag tests for filtering

❌ DON'T:
- Mix dependent tests in "independent_*"
- Create overly large batches (50+ specs)
- Use generic batch names like "batch1"
- Mix fast and slow tests unevenly
```

---

## 📝 Quick Reference

### Command Structure

```
node --max-old-space-size=32768 orchestrate-batches.js @tag @filter --config-file=path
  │         │                         │               │    │                │
  │         └─ Memory (optional)      │               │    │                └─ Config file
  │                                   │               │    └─ Filter (optional)
  │                                   │               └─ Main tag
  │                                   └─ Script
  └─ Node.js
```

### Module Naming

```
Tag:    @module-name           (@incident-management)
Script: trigger-module-action  (trigger-incident-parallel)
Batch:  setup_0, independent_1 (setup_incident_data)
```

---

## 🔄 Performance Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│              Serial vs Parallel Execution                       │
└─────────────────────────────────────────────────────────────────┘

SERIAL (Before):
Time: 0hr ──────────────────────────────────────> 9hr

Test 1 ████ Test 2 ████ ... Test 54 ████

Total: 9 hours


PARALLEL (After, p-limit = 5):
Time: 0hr ──────────────────────────> 4hr

Batch 1 ████████ ↓
Batch 2 ████████ ↓  } Round 1
Batch 3 ████████ ↓  } (5 batches)
Batch 4 ████████ ↓
Batch 5 ████████ ↓

[More rounds...]

Total: 4 hours ⚡ (55% faster!)
```

---

**Last Updated:** November 2025  
**Maintained by:** Abbas Khan (QA Automation Engineer)

**Need Help?** Contact QA Automation team or check `merged-report.html` for detailed results.
