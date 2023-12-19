/*
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
*/
// For full-site text
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getToken'){
    chrome.storage.local.get('accessToken', data=> {
      sendResponse({result: data.accessToken});
    });
    return true;
  }
  else{
     let paragraphs = request.paragraphs;
     if(paragraphs == null || paragraphs.length == 0) {
     }
     else {
        paragraphs.forEach((paragraph) => {
			console.log(paragraph);
        });
     }
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
})

function loginUser() {
  fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username: "rooot", password: "rooot"}),
  })
  .then (response => response.json())
  .then (data => {
    const accessToken = data.access;
    chrome.storage.local.set({'accessToken': accessToken}, () => {
      console.log('Access token stored:', accessToken);
    });
  })
  .catch(error => {
    console.error("Login error:", error);
  });
}

loginUser();

