var EXPORTED_SYMBOLS = [ "unsocialize" ];

/** Returns an 'unsocialized' url.
 * If url has a 'redirect_uri' parameter, it is extracted and returned.
 * Otherwise the original URL is returned.
 */
function unsocialize(url) {
  if (url.indexOf('redirect_uri=') != -1) {
    // For the webpage 
    // https://www.facebook.com/connect/uiserver.php
    // The URL containing the desired content is in the 'redirect_uri'
    // parameter.
    url = url.substring(url.indexOf('redirect_uri=')+13, url.length);
    url = url.substr(0, url.indexOf('&'));
  } else if (url.indexOf('u=http') != -1) {
    // For the webpage http://www.facebook.com/l.php,
    // the URL containing the desired content is in the 'u' parameter.
    url = url.substring(url.indexOf('u=http')+2, url.length);
    url = url.substr(0, url.indexOf('&'));
  }

  // Now we have the full URL, but still need to replace hex codes with chars,
  // e.g. %2F -> '/'
  url = replaceCharCodes(url);

  // The resulting URL may still have trailing parameters related to facebook
  // stuff that the destination domain receives. Let's get rid of those as well.
  if (url.indexOf('?fb') != -1) {
    url = url.substr(0, url.indexOf('?fb'));
  }

  return url;
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
