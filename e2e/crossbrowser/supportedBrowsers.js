const LATEST_WINDOWS = 'Windows 11';

const supportedBrowsers = {
  chrome: {
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: 'macOS 12',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Civil GA E2E Tests: MAC_CHROME_LATEST',
        screenResolution: '2360x1770'
      },
    },
  },
  edge: {
    edge_win_latest: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Civil GA E2E Tests: WIN_EDGE_LATEST',
        screenResolution: '2560x1600'
      },
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Civil GA E2E Tests: WIN_FF_LATEST',
        screenResolution: '2560x1600'
      },
    },
  },
  safari: {
    safari_mac: {
      browserName: 'safari',
      platformName: 'macOS 10.14',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Civil GA E2E Tests: MAC_SAFARI',
        seleniumVersion: '3.141.59',
        screenResolution: '2360x1770'
      }
    }
  },
};

module.exports = supportedBrowsers;
