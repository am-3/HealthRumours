let scrapeContent = document.getElementById('scrapeContent');
let list = document.getElementById('contentList');

prev = "first"
count = 0

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
     let paragraphs = request.paragraphs;
     if(paragraphs == null || paragraphs.length == 0) {
        let li = document.createElement("li");
        li.innerText = "No paragraphs found";
        list.appendChild(li);
     }
     else {
        paragraphs.forEach((paragraph) => {
            let li = document.createElement("li");
            li.innerText = paragraph;
			if(paragraph.length > 5){
				if(prev === paragraph){
					console.log("Post " + count);
					count += 1;
				}
				else{
					console.log(paragraph);
				}
				prev = paragraph;
			}
            list.appendChild(li);
        });
     }
})

scrapeContent.addEventListener("click", async() => {
   	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
 	chrome.scripting.executeScript({
   	    target: {tabId: tab.id},
   	    func: scrapeContentFromPage,
   	});
});

function scrapeContentFromPage() {
 
    let para = document.querySelectorAll('span, img'); // Adjust for other elements containing paragraphs

    let paragraphTexts = Array.from(para).map(p => {
		if(p.tagName === 'SPAN'){
			return p.innerText;
		}
		else{
			return p.src;
		}
	});
    chrome.runtime.sendMessage({paragraphs: paragraphTexts});
}
