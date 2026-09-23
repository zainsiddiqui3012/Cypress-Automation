/**
 * Orchestrate Cypress batches in parallel with controlled concurrency.
 * 
 * Requires: npm install p-limit
 * 
 * Run: node orchestrate-batches.js @administration --config-file=environments/stage-config.config.ts
 * Run with tag filter: node orchestrate-batches.js @administration @smoke --config-file=environments/stage-config.config.ts
 * Run with custom baseUrl: node orchestrate-batches.js @administration --config-file=environments/stage-config.config.ts --config baseUrl=http://172.16.249.51:8081/predict360/login.do
 */

// Clean reports/screenshots ONCE before parallel runs
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const pLimit = require('p-limit').default;
const limit = pLimit(4); // Adjust concurrency here (e.g. 3 parallel batches at a time)

// 1️⃣ Read args
const args = process.argv.slice(2);

console.log('🔍 All arguments:', args);

// Find all @ tags
const allTags = args.filter(a => a.startsWith('@'));

// First @ tag is the main batch tag
const tag = allTags[0];

// Second @ tag (if exists) is the filter tag
const filterTag = allTags[1];

// ✅ Added validation for required tag argument
if (!tag) {
  console.error('❌ Tag argument (e.g. @administration) is required.');
  process.exit(1);
}

const configFileArg = args.find(a => a.startsWith('config-file=') || a.startsWith('--config-file=')) || '';

// ✅ Added validation for required config-file argument
if (!configFileArg) {
  console.error('❌ Config file argument (e.g. --config-file=environments/stage-config.config.ts) is required.');
  process.exit(1);
}

const configFile = configFileArg.split('=')[1];

// ✅ Added check to ensure config file exists
if (!fs.existsSync(configFile)) {
  console.error(`❌ Config file not found: ${configFile}`);
  process.exit(1);
}

// 🆕 Extract custom baseUrl from --config parameter
const configIndex = args.findIndex(a => a === '--config');
let customBaseUrl = null;

if (configIndex !== -1 && args[configIndex + 1]) {
  const baseUrlArg = args[configIndex + 1];
  
  if (baseUrlArg.startsWith('baseUrl=')) {
    customBaseUrl = baseUrlArg.split('baseUrl=')[1];
    console.log(`🔧 Custom baseUrl detected: ${customBaseUrl}`);
  } else {
    console.warn(`⚠️ --config found but next argument doesn't start with baseUrl=: ${baseUrlArg}`);
  }
} else {
  console.log('ℹ️ No custom baseUrl provided, using default from config file');
}

// 2️⃣ Load JSON config
const batchesConfigPath = path.join(__dirname, 'tag-batch-config.json');
const batchesConfig = JSON.parse(fs.readFileSync(batchesConfigPath, 'utf-8'));
const batches = batchesConfig[tag];

const packageJson = require(path.resolve('package.json'));

// Only clean up if CYPRESS_SKIP_CLEANUP is not 'true'
if (process.env.CYPRESS_SKIP_CLEANUP !== 'true') {
  const reportDir = path.resolve(__dirname, './cypress/reports/html');
  const screenshotsDir = path.resolve(__dirname, './cypress/screenshots');

  function removeDirIfExists(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`🧹 Removed output folder ${dirPath}`);
    } else {
      console.log(`ℹ️ Output folder not found (no need to delete): ${dirPath}`);
    }
  }

  removeDirIfExists(reportDir);
  removeDirIfExists(screenshotsDir);
}


if (!batches || batches.length === 0) {
  console.error(`❌ No batches found for tag: ${tag}`);
  process.exit(1);
}

// 🔍 Log filter information
if (filterTag) {
  console.log(`🔵 Running ${batches.length} batches for tag: ${tag} with filter: ${filterTag}`);
} else {
  console.log(`🔵 Running ${batches.length} batches for tag: ${tag} (all tests)`);
}
console.log(`🔵 Concurrency limit: ${limit.concurrency}`);

const children = [];
process.on('SIGINT', () => children.forEach(child => child.kill()));
process.on('SIGTERM', () => children.forEach(child => child.kill()));

const runSpec = (batchName, spec) => {
  return new Promise((resolve, reject) => {
    const isTrigger = packageJson.scripts[spec] !== undefined;
    
    // 🆕 Build command with optional tag filter and custom baseUrl
    let command;
    if (isTrigger) {
      command = `npm run ${spec}`;
      
      // Build additional arguments
      let additionalArgs = '';
      
      if (filterTag || customBaseUrl) {
        additionalArgs = ' --';
        
        if (filterTag) {
          additionalArgs += ` --env grepTags=${filterTag}`;
        }
        
        // 🆕 Use --config for triggers to properly override baseUrl
        if (customBaseUrl) {
          additionalArgs += ` --config baseUrl=${customBaseUrl}`;
        }
      }
      
      command += additionalArgs;
    } else {
      command = `npx cypress run --browser electron --spec "${spec}" --config-file ${configFile}`;
      
      // 🆕 Add grep tags if filterTag is provided (works with any tag)
      if (filterTag) {
        command += ` --env grepTags=${filterTag}`;
      }
      
      // 🆕 Add custom baseUrl override if provided - NO QUOTES
      if (customBaseUrl) {
        command += ` --config baseUrl=${customBaseUrl}`;
      }
    }

    
    // Clone the current environment and add CYPRESS_SKIP_CLEANUP
    const env = { ...process.env, CYPRESS_SKIP_CLEANUP: 'true' };

    console.log(`🚀 Running [${batchName}] -> ${spec}`);
    console.log(`📝 Command: ${command}`);

    const child = exec(command, { env }, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        console.error(`❌ Spec ${spec} in batch ${batchName} failed with exit code ${error.code}`);
        reject(error);
      } else {
        console.log(`✅ Spec ${spec} in batch ${batchName} passed`);
        resolve();
      }
    });

    children.push(child); // Track the child process
  });
};

// Function to run each batch serially
const runBatchSerially = async (batchName, specs) => {
  const failedSpecs = [];

  for (const spec of specs) {
    try {
      await runSpec(batchName, spec);
    } catch (error) {
      console.error(`⚠️ Continuing despite failure in ${spec}`);
      failedSpecs.push(spec);
    }
  }

  if (failedSpecs.length > 0) {
    throw new Error(`Batch ${batchName} had failed specs: ${failedSpecs.join(', ')}`);
  }
};


// Function to run batch in parallel (for independent batches)
const runBatchInParallel = async (batchName, specs) => {
  const specPromises = specs.map(spec => runSpec(batchName, spec)); // Run specs concurrently
  await Promise.all(specPromises); // Wait for all specs to finish
};

/******************************************************************************************************************** */
/************  Below section is for Executing the Logics &  Merged-Report Creation from Jsons Files **********I******/
/******************************************************************************************************************** */

const mochawesomeJsonsDir = path.resolve(__dirname, './cypress/reports/html/.jsons');
const mergedJson = path.resolve(__dirname, './cypress/reports/html/merged-report.json');
const reportDir = path.resolve(__dirname, './cypress/reports/html');

// Ensure directories exist before merging/generating reports
if (!fs.existsSync(mochawesomeJsonsDir)) fs.mkdirSync(mochawesomeJsonsDir, { recursive: true });
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

(async () => {
  // 3️⃣ Run all batches with concurrency limit for batch-level parallelism
  const results = await Promise.allSettled(
    batches.map(batch => limit(async () => {
      console.log(`\n🚀 Starting Batch: ${batch.batchName}`);
      if (batch.batchName.startsWith('setup_')) {
        // For "setup_" batches, run specs serially (inside the batch)
        await runBatchSerially(batch.batchName, batch.specs);
      } else if (batch.batchName.startsWith('independent_')) {
        // For "independent_" batches, run specs in parallel (inside the batch)
        await runBatchInParallel(batch.batchName, batch.specs);
      } else {
        // Default case: run serially if not "setup_" or "independent_"
        await runBatchSerially(batch.batchName, batch.specs);
      }
      console.log(`✅ Completed Batch: ${batch.batchName}`);
    }))
  );

  // 2️⃣ Show batch results
  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    console.error(`❌ ${failed.length} batch(es) failed.`);
  } else {
    console.log('\n✅ All batches completed successfully.');
  }

  // 3️⃣ Merge and generate report (always runs, even if some batches failed)
  console.log('\n🔄 Merging mochawesome JSONs...');
  try {
    if (fs.existsSync(mergedJson)) fs.rmSync(mergedJson);
    // Check for JSON files before merging
    const jsonFiles = fs.readdirSync(mochawesomeJsonsDir).filter(f => f.endsWith('.json'));
    if (jsonFiles.length === 0) {
      console.error('❌ No mochawesome JSON files found to merge.');
      process.exit(1);
    }
    await new Promise((resolve, reject) => {
      exec(
        `npx mochawesome-merge "${mochawesomeJsonsDir}/*.json" > "${mergedJson}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Failed to merge mochawesome JSONs:', stderr);
            reject(error);
          } else {
            console.log('✅ Merged mochawesome JSONs.');
            resolve();
          }
        }
      );
    });
    // Generate HTML report
    console.log('\n📝 Generating HTML report...');
    await new Promise((resolve, reject) => {
      exec(
        `npx mochawesome-report-generator "${mergedJson}" --reportDir="${reportDir}" --inlineAssets`,
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Failed to generate HTML report:', stderr);
            reject(error);
          } else {
            console.log('✅ HTML report generated.');
            resolve();
          }
        }
      );
    });
  } catch (err) {
    console.error('❌ Error during report merging/generation:', err);
    process.exit(1);
  }

  // 4️⃣ Exit with error if any batch failed
  if (failed.length > 0) {
    process.exit(1);
  }
})();