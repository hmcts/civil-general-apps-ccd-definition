const { testFilesHelper } = require("./e2e/plugins/failedAndNotExecutedTestFilesPlugin");

const functional = process.env.FUNCTIONAL;

const getTests = () => {
  let prevFailedTestFiles = process.env.PREV_FAILED_TEST_FILES;
  let prevNotExecutedTestFiles = process.env.PREV_NOT_EXECUTED_TEST_FILES;

  if (prevFailedTestFiles !== undefined || prevNotExecutedTestFiles !== undefined) {
    prevFailedTestFiles = prevFailedTestFiles ? prevFailedTestFiles.split(',') : [];
    prevNotExecutedTestFiles = prevNotExecutedTestFiles ? prevNotExecutedTestFiles.split(',') : [];
    return [...prevFailedTestFiles, ...prevNotExecutedTestFiles];
  }

  if (process.env.CCD_UI_TESTS === "true")
    return [
      "./e2e/tests/ui_tests/cp_tests/**/*_test.js",
      "./e2e/tests/ui_tests/multiparty-ga-tests/**/*_test.js",
      "./e2e/tests/ui_tests/wa_tests/**/*_test.js",
      "./e2e/tests/ui_tests/*_test.js",
      "./e2e/tests/api*/**/*_test.js",
    ];

  return ["./e2e/tests/ui_tests/*_test.js", "./e2e/tests/api*/**/*_test.js"];
};

exports.config = {
  bootstrapAll: async () => {
    if (functional) {
      await testFilesHelper.createTempFailedTestsFile();
      await testFilesHelper.createTempPassedTestsFile();
      await testFilesHelper.createTempToBeExecutedTestsFile();
    }
  },
  teardownAll: async () => {
    if (functional) {
      await testFilesHelper.createTestFilesReport();
      await testFilesHelper.deleteTempFailedTestsFile();
      await testFilesHelper.deleteTempPassedTestsFile();
      await testFilesHelper.deleteTempToBeExecutedTestFiles();
    }
  },
  tests: getTests(),
  output: process.env.REPORT_DIR || "test-results/functional",
  helpers: {
    Playwright: {
      url: process.env.URL || "http://localhost:3333",
      show: process.env.SHOW_BROWSER_WINDOW === "true" || false,
      waitForAction: 500,
      waitForTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT_MS || 90000),
      windowSize: "1280x960",
      browser: "chromium",
      timeout: 20000,
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    },
    BrowserHelpers: {
      require: "./e2e/helpers/browser_helper.js",
    },
    PlaywrightHelper: {
      require: "./e2e/helpers/PlaywrightHelper.js",
    },
    GenerateReportHelper: {
      require: "./e2e/helpers/generate_report_helper.js",
    },
  },
  include: {
    I: "./e2e/steps_file.js",
    api: "./e2e/api/steps.js",
    api_sdo: "./e2e/api/steps_SDO.js",
    wa: "./e2e/steps_file_WA.js",
  },
  plugins: {
    autoDelay: {
      enabled: true,
      methods: ["click", "fillField", "checkOption", "selectOption", "attachFile"],
    },
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
    tryTo: {
      enabled: true,
    },
    failedAndNotExecutedTestFilesPlugin: {
      enabled: functional,
      require: "./e2e/plugins/failedAndNotExecutedTestFilesPlugin",
    },
  },
  mocha: {
    bail: process.env.PROCEED_ON_FAILURE !== "true",
    reporterOptions: {
      "codeceptjs-cli-reporter": {
        stdout: "-",
        options: {
          steps: false,
        },
      },
      "mocha-junit-reporter": {
        stdout: "-",
        options: {
          mochaFile: process.env.REPORT_FILE || "test-results/functional/result.xml",
        },
      },
      mochawesome: {
        stdout: "-",
        options: {
          reportDir: process.env.REPORT_DIR || "test-results/functional",
          reportFilename: `${process.env.MOCHAWESOME_REPORTFILENAME + "-" + new Date().getTime()}`,
          inlineAssets: true,
          overwrite: false,
          json: false,
        },
      },
    },
  },
};
