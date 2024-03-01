browser.runtime.onInstalled.addListener(() => {
  function createContextMenuItem() {
    browser.contextMenus.create({
      id: "yourContextMenuId",
      title: "Your Context Menu Option",
      contexts: ["all"]
    });
  }
  
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === "createContextMenu") {
      createContextMenuItem();
    }
  }); 
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  console.log("user clicked");
  if (info.menuItemId === "yourContextMenuId") {
    console.log("before sending message retrieveCursorPosition");
    browser.tabs.sendMessage(tab.id, { action: "executeCustomAction" });
    console.log("after sending message retrieveCursorPosition");
  }
});