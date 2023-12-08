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
setTimeout(scrapeContentFromPage, 5000);
