// URL of the Saver app
const APP_URL = 'https://incepter.github.io/saver/'; // Change this to your deployed app URL in production

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Open the Saver app in a new tab
  chrome.tabs.create({ url: APP_URL });
});
