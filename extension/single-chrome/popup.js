let scrapeContent = document.getElementById('scrapeContent');
let list = document.getElementById('contentList');

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
})

function scrapeContentFromPage() {
 
    let para = document.querySelectorAll('p, div, section'); // Adjust for other elements containing paragraphs

    let paragraphTexts = Array.from(para).map(p => p.innerText);


    chrome.runtime.sendMessage({paragraphs: paragraphTexts});
}