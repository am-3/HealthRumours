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

async function getCurrentTabUrl(){
	const tabs = await chrome.tabs.query({active: true})
	return tabs[0].url
}

submitButton.addEventListener("click", function() {
	let text = document.getElementById('displayText');
	let slider = document.getElementById('confidence');
	let srcURL = getCurrentTabUrl();
	let proofURL_box = document.getElementById('proofURL');
	let reasons = document.getElementById("reasons");
	const data = {
		selectedContent: text.innerHTML,
		confidence: slider.value,
		imageURL: ' ',
		sourceURL: srcURL,
		proofURL: proofURL_box.value,
		userFeedback: reasons.value
	};
	const url = 'http://mn127.iiitt.ac.in/insertUser/';
	chrome.storage.local.get(['accessToken'], result => {
		const accessToken = result.accessToken;
		console.log(result.accessToken);
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Host': url,
				'Authorization': `Bearer ${accessToken}`,
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
	});
	const justContent = {
		selectedContent: text.innerHTML
	}
	special_url = new URL ('http://mn127.iiitt.ac.in/check/')
	Object.keys(justContent).forEach(key => special_url.searchParams.append(key, justContent[key]));
	chrome.storage.local.get(['accessToken'], result => {
		const accessToken = result.accessToken;
		console.log(accessToken);
		fetch(special_url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Host': 'http://mn127.iiitt.ac.in/check/',
				'Authorization': `Bearer ${accessToken}`,
			},
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
});
