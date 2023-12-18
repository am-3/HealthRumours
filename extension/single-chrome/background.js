let yourContextMenuExists = false;
chrome.runtime.onInstalled.addListener(() => {
  function createContextMenuItem() {
    chrome.contextMenus.create({
      id: "yourContextMenuId",
      title: "Detect for fake news",
      contexts: ["all"]
    });
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === "createContextMenu") {
      createContextMenuItem();
      // yourContextMenuExists = true;
    }
  }); 
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "yourContextMenuId") {
    chrome.tabs.sendMessage(tab.id, { action: "executeCustomAction" });
  }
});



chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url.includes('web.whatsapp.com') || tab.url.includes('web.telegram.org'))
    {
      if (yourContextMenuExists) {
        chrome.contextMenus.update('yourContextMenuId', { visible: true });
      }
    } 
    else
    {
      if (yourContextMenuExists) {
        chrome.contextMenus.update('yourContextMenuId', { visible: false });
      }
    }
  });
});