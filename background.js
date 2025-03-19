chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "run") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    });
  }
});
