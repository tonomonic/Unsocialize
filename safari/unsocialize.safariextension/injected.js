// This script is injected into each page. It listens for contextmenu events
// (triggered before a context menu is displayed), and attaches the href
// attribute if the context menu target is a child of an <A> element.
function contextMenuHandle(e) {
  // Walks up the DOM tree up to maxDepth levels looking for an <A> element
  var maxDepth = 10;
  var target = e.target;
  for (var i = 0; i < maxDepth && target.nodeName != "A"; i++) {
    target = target.parentElement;
  }
  if (target.nodeName == "A") {
    safari.self.tab.setContextMenuEventUserInfo(e, target.href);
  }
}

document.addEventListener("contextmenu", contextMenuHandle, false);
