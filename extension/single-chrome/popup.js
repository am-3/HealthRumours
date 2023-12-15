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

let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", function() {
	let text = document.getElementById('displayText');
	console.log("Selection: " + text.innerHTML);
	let reasons = document.getElementById("reasons");
	console.log("Reasons for being fake: " + reasons.value);
	const data = {
		selectedContent: text.innerHTML,
		userFeedback: reasons.value
	};
	const url = 'http://127.0.0.1:8000/insert/'
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Host': url
 		},
		body: JSON.stringify(data)
	})
	.then(response => response.json())
	.then(data => {
		console.log('Success:', data);
	})
	.catch((error) => {
		console.error('Error: ', error);
	});
	const justContent = {
		selectedContent: text.innerHTML
	}
	special_url = new URL ('http://127.0.0.1:8000/check/')
	Object.keys(justContent).forEach(key => special_url.searchParams.append(key, justContent[key]));
	fetch(special_url.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Host': url
		}
	})
	.then(response => response.json())
	.then(data => {
		console.log('Result:', data);
		let resDisplay = document.getElementById('resultDisplay');
		resDisplay.textContent = data.result;
	})
	.catch((error) => {
		console.error('Error: ', error);
	});
});
