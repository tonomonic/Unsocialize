var _usMenuItem = {
  "title": "Unsocialize",
  "contexts": [ "link" ],
  // Remove this attribute when developing/debugging.
  "documentUrlPatterns": [ "https://*.facebook.com/*" ],
  "onclick": unsocializeClicked
};

var _usMenuItemId = chrome.contextMenus.create(_usMenuItem, null);

// Takes the linkUrl attribute, unsocializes it, and opens a new tab with the
// unsocialized link.
function unsocializeClicked(info, tab) {
  chrome.tabs.create({"url": unsocialize(info.linkUrl)}, null);
}
