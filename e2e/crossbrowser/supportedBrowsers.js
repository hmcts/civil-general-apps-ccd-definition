const LATEST_WINDOWS = 'Windows 11';

const supportedBrowsers = {
  chrome: {
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: 'macOS 12',
      browserVersion: 'latest',
      name: 'civil-ga-chrome-mac-test',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1,
    },
  },
  edge: {
    edge_win_latest: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      name: 'civil-ga-edge-win-test',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1,
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      name: 'civil-ga-firefox-win-test',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1,
    },
  },
};

module.exports = supportedBrowsers;
