chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
	let text = request.text;
	let display = document.getElementById('displayText');
	display.innerHTML = text;
})

getContent.addEventListener("click", async() => {
   	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
 	chrome.scripting.executeScript({
   	    target: {tabId: tab.id},
   	    func: logger,
   	});
});

function logger (){
        let selectedText = '';
        const selection = window.getSelection();


        if (selection && selection.toString()) {
        	selectedText = selection.toString();
        	console.log("Selected text:", selectedText);
        } else {
        	console.log("No text selected.");
			selectedText = 'No text selected.';
        }
    	chrome.runtime.sendMessage({text: selectedText});
}

chrome.action.onClicked.addListener(function (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: logger,
      })
});
