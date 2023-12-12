// For Whatsapp/Messaging Scraping
  chrome.action.onClicked.addListener(function (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: function () {
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
    });
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
