exports.config = {
  tests: process.env.CCD_UI_TESTS =='true' 
    ? ['./e2e/tests/ui_tests/cp_tests/**/*_test.js',
        './e2e/tests/ui_tests/multiparty-ga-tests/**/*_test.js',
        './e2e/tests/ui_tests/wa_tests/**/*_test.js',
        './e2e/tests/ui_tests/*_test.js',
        './e2e/tests/api*/**/*_test.js'] 
    : [ './e2e/tests/ui_tests/*_test.js',
        './e2e/tests/api*/**/*_test.js'],
  output: process.env.REPORT_DIR || 'test-results/functional',
  helpers: {
    Playwright: {
      url: process.env.URL || 'http://localhost:3333',
      show: process.env.SHOW_BROWSER_WINDOW === 'true' || false,
      waitForAction: 500,
      waitForTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT_MS || 90000),
      windowSize: '1280x960',
      browser: 'chromium',
      timeout: 20000,
      bypassCSP: true,
      ignoreHTTPSErrors: true,
    },
    BrowserHelpers: {
      require: './e2e/helpers/browser_helper.js',
    },
    PlaywrightHelper: {
      require: './e2e/helpers/PlaywrightHelper.js',
    },
    GenerateReportHelper: {
      require: './e2e/helpers/generate_report_helper.js',
    },
  },
  include: {
    I: './e2e/steps_file.js',
    api: './e2e/api/steps.js',
    api_sdo: './e2e/api/steps_SDO.js',
    wa: './e2e/steps_file_WA.js',
  },
  plugins: {
    autoDelay: {
      enabled: true,
      methods: [
        'click',
        'fillField',
        'checkOption',
        'selectOption',
        'attachFile',
      ],
    },
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
    tryTo: {
      enabled: true
    },
  },
  mocha: {
    bail: process.env.PROCEED_ON_FAILURE === true || false,
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: false,
        },
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: {
          mochaFile: process.env.REPORT_FILE || 'test-results/functional/result.xml',
        },
      },
      'mochawesome': {
        stdout: '-',
        options: {
          reportDir: process.env.REPORT_DIR || 'test-results/functional',
          reportFilename: `${process.env.MOCHAWESOME_REPORTFILENAME + '-' + new Date().getTime()}`,
          inlineAssets: true,
          overwrite: false,
          json: false,
        },
      },
    }
  }
};
