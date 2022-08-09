/* eslint-disable no-console */

const supportedBrowsers = require('./e2e/crossbrowser/supportedBrowsers.js');
const testConfig = require('./e2e/config');

const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT_MS) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const defaultSauceOptions = {
  username: 'madhan0809',
  accessKey: 'b9065979-87f7-40ad-b12f-ea3d23f32011',
  tunnelIdentifier: '615943a6b4844088950ed78aec7fa746',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['Civil'],
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options']
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities,
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  tests: './e2e/tests/**/*_test.js',
  output: `${process.cwd()}/${testConfig.TestOutputDir}`,
  helpers: {
    WebDriver: {
      url: testConfig.url.manageCase,
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {},
    },
    BrowserHelpers: {
      require: './e2e/helpers/browser_helper.js',
    },
    GenerateReportHelper: {
      require: './e2e/helpers/generate_report_helper.js'
    },
    SauceLabsReportingHelper: {
      require: './e2e/helpers/sauce_labs_reporting_helper.js',
    },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    autoDelay: {
      enabled: true,
      methods: [
        'click',
        'fillField',
        'checkOption',
        'selectOption',
        'attachFile',
      ],
      delayAfter: 2000,
    },
  },
  include: {
    I: './e2e/steps_file.js',
    api: './e2e/api/steps.js'
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        },
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: {mochaFile: `${testConfig.TestOutputDir}/result.xml`},
      },
      mochawesome: {
        stdout: testConfig.TestOutputDir + '/console.log',
        options: {
          reportDir: testConfig.TestOutputDir,
          reportName: 'index',
          reportTitle: 'GA Cross browser results',
          inlineAssets: true,
        },
      },
    },
  },
  multiple: {
    microsoft: {
      browsers: getBrowserConfig('microsoft'),
    },
    chrome: {
      browsers: getBrowserConfig('chrome'),
    },
    firefox: {
      browsers: getBrowserConfig('firefox'),
    },
    safari: {
      browsers: getBrowserConfig('safari'),
    },
  },
  name: 'Civil FrontEnd Cross-Browser Tests',
};

exports.config = setupConfig;
