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
    }
  }); 
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "yourContextMenuId") {
    chrome.tabs.sendMessage(tab.id, { action: "executeCustomAction" });
  }
});


// For full-site text
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
     let paragraphs = request.paragraphs;
     if(paragraphs == null || paragraphs.length == 0) {
     }
     else {
        paragraphs.forEach((paragraph) => {
			console.log(paragraph);
        });
     }
})

function logger (){
        console.clear();
        let selectedText = '';
        const selection = window.getSelection();

        if (selection && selection.toString()) {
          selectedText = selection.toString();
          console.log("Selected text:", selectedText);
        } else {
          console.log("No text selected.");
        }
}

chrome.action.onClicked.addListener(function (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: logger,
      })
});