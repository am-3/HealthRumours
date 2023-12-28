
let yourContextMenuExists = false;
console.log('inside background');
browser.runtime.onInstalled.addListener(() => {
  function createContextMenuItem() {
    browser.contextMenus.create({
      id: "yourContextMenuId",
      title: "Detect for fake news",
      contexts: ["all"]
    });
  }
  
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === "createContextMenu") {
      createContextMenuItem();
      yourContextMenuExists = true;
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

browser.tabs.onActivated.addListener(function (activeInfo) {
  browser.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url.includes('web.whatsapp.com') || tab.url.includes('web.telegram.org'))
    {
      console.log('not hiding');
      browser.contextMenus.update('yourContextMenuId', { visible: true });
    } 
    else
    {
      console.log('hiding');
      browser.contextMenus.update('yourContextMenuId', { visible: false });
    }
  });
});

function sendMessageToBackend(text, imageSrc, socialMediaName) {
  const data = {
    textContent: text,
    imageSrc: imageSrc,
    socialMedia: socialMediaName,
  };
  browser.storage.local.get('accessToken', output=> {
    const accessToken = output.accessToken;
    fetch('http://127.0.0.1:8000/insertDataWhatsapp/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'host':'http://127.0.0.1:8000/insertDataWhatsapp/',
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response from backend.\nThe result is",data.result);
      })
      .catch((error) => {
        console.error("Error sending message to backend: ", error);
      });
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.socialMediaName) {
    const receivedText = message.text;
    const receivedImageSrc = message.imageSrc;
    const receivedSocialMediaName = message.socialMediaName;

    console.log("Received Text:", receivedText);
    console.log("Received Image Source:", receivedImageSrc);
    console.log("Received Social Media Name:", receivedSocialMediaName);
    sendMessageToBackend(receivedText,receivedImageSrc,receivedSocialMediaName);
  } else {
    console.log("Invalid message received from content script");
  }
});


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === 'getToken'){
    browser.storage.local.get('accessToken', data=> {
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

// browserAction.onClicked.addListener(function (tab) {
//     browser.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: logger,
//       })
// })

function loginUser() {
  fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username: "rooot", password: "temporaryuser"}),
  })
  .then (response => response.json())
  .then (data => {
    const accessToken = data.access;
    browser.storage.local.set({'accessToken': accessToken}, () => {
      console.log('Access token stored:', accessToken);
    });
  })
  .catch(error => {
    console.error("Login error:", error);
  });
}

loginUser();

