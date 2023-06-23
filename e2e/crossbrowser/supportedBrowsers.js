const LATEST_WINDOWS = 'Windows 11';

const supportedBrowsers = {
  chrome: {
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: 'macOS 12',
      browserVersion: 'latest',
      'sauce:options': {
        name: 'civil-ga-chrome-mac-test',
      },
    },
  },
  edge: {
    edge_win_latest: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'civil-ga-edge-win-test',
      },
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'civil-ga-firefox-win-test',
      },
    },
  },
};

module.exports = supportedBrowsers;
