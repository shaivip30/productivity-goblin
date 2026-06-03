let activeTab = null;
let startTime = Date.now();

const ignoredPrefixes = [
  "chrome://",
  "chrome-extension://",
  "edge://",
  "about:",
];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    trackTime();

    activeTab = tab.url;
    startTime = Date.now();
  } catch (err) {
    console.log(err);
  }
});

setInterval(() => {
  trackTime();
  startTime = Date.now();
}, 5000);

function trackTime() {
  if (!activeTab) return;

  if (
    ignoredPrefixes.some((prefix) =>
      activeTab.startsWith(prefix)
    )
  ) {
    return;
  }

  const domain = getDomain(activeTab);

  if (!domain) return;

  const timeSpent = Date.now() - startTime;

  chrome.storage.local.get(["trackingData"], (result) => {
    const data = result.trackingData || {};

    if (!data[domain]) {
      data[domain] = 0;
    }

    data[domain] += timeSpent;

    chrome.storage.local.set({
      trackingData: data,
    });

    console.log("Tracked:", domain, timeSpent);
  });
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}