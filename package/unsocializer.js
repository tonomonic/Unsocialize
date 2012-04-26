// Copyright 2012 Michael Lawrence, mikeklawrence@gmail.com
//
// Program for inserting an item into a right-click context menu, which removes
// tracking metrics and app install requests from links within facebook.
//
// Right now, it focuses on "social reader" links, where the url of the article
// is incoded in the url parameter "redirect_uri". A future extension would be
// to un-track normal links, which go through http://www.facebook.com/l.php
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// For a copy of the GNU General Public License, see
// <http://www.gnu.org/licenses/>.

var _usMenuItem = {
  "title": "Unsocialize",
  "contexts": [ "link" ],
  // Remove this attribute when developing/debugging.
  "documentUrlPatterns": [ "https://*.facebook.com/*" ],
  "onclick": unsocialize
};

var _usMenuItemId = chrome.contextMenus.create(_usMenuItem, null);

// Takes the linkUrl attribute, unsocializes it, and opens a new tab with the
// unsocialized link.
function unsocialize(info, tab) {
  var url = info.linkUrl;
  if (url.indexOf('redirect_uri=') != -1) {
    url = url.substring(url.indexOf('redirect_uri=')+13, url.length);
  }
  url = replaceCharCodes(url);
  if (url.indexOf('?fb_') != -1) {
    url = url.substr(0, url.indexOf('?fb_'));
  }

  chrome.tabs.create({"url": url}, null);
}

// Replaces URL ascii char codes in hex(e.g. %3F) with the actual chars
// (e.g. '?').
function replaceCharCodes(url) {
  while (url.indexOf('%') != -1) {
    var nextCharCode = url.substr(url.indexOf('%'), 3);
    var integerCode = toInteger(nextCharCode.substring(1));
    url = url.replace(nextCharCode, String.fromCharCode(integerCode));
  }
  return url;
}

// Converts a hex string like "3F" to an integer like 77
function toInteger(hex) {
  var result=0;
  for (var i = 0; i < hex.length; i++) {
    var digit = hex.charCodeAt(hex.length - 1 - i);
    var baseMult = Math.pow(16, i);
    if (digit >= 48 && digit <= 57) {
      // '0' is 48. '9' is 57
      result += baseMult*(digit - 48);
    } else if (digit >= 97 && digit <= 102) {
      // 'a' is 97, 'f' is 102
      result += baseMult*(digit - 97 + 10);
    } else if (digit >= 65 && digit <= 70) {
      // 'A' is 65, 'F' is 70
      result += baseMult*(digit - 65 + 10);
    } else {
      throw "Invalid hex digit \'" + hex.charAt(hex.length - 1 - i) + "\'";
    }
  }
  return result;
}
