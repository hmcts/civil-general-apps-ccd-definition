exports.config = {
  tests: './e2e/tests/**/*_test.js',
  output: process.env.REPORT_DIR || 'test-results/functional',
  helpers: {
    Puppeteer: {
      restart: false,
      keepCookies: true,
      show: process.env.SHOW_BROWSER_WINDOW === 'true' || false,
      windowSize: '1200x900',
      waitForTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT_MS || 50000),
      getPageTimeout: 120000,
      chrome: {
        ignoreHTTPSErrors: true
      },
    },
    BrowserHelpers: {
      require: './e2e/helpers/browser_helper.js',
    },
    GenerateReportHelper: {
      require: './e2e/helpers/generate_report_helper.js'
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
    bail: process.env.PROCEED_ON_FAILURE == true || false,
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
          reportFilename: `${process.env.MOCHAWESOME_REPORTFILENAME+'-'+new Date().getTime()}`,
          inlineAssets: true,
          overwrite: false,
          json: false,
        },
      },
    }
  }
};
