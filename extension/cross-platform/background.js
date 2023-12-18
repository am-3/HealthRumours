chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function () {
      const allText = document.body.innerText;
      console.log("Text extracted from the page:", allText);
    }
  });
});