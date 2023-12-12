prev = "first";
count = 0;

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
	let flag = false;
	let finalArray = [];
	paragraphTexts.forEach(element => {
		if(flag){
			if(element === 'Terms of Service'){
				flag = false;
			}
			else if( typeof element === 'string' ){
				if (element.length > 5){
					if(prev === element){
						finalArray.push("Post " + count);
						count += 1;
					}
					else{
						finalArray.push(element);
					}
				}
			}
		}
		else{
			if(element == 'Following'){
				flag = true;
			}
		}
		prev = element;
	});

	let paragraphs = finalArray;
     if(paragraphs == null || paragraphs.length == 0) {
     }
     else {
        paragraphs.forEach((paragraph) => {
			console.log(paragraph);
        });
     }
}
setTimeout(scrapeContentFromPage, 5000);
window.addEventListener('scroll', scrapeContentFromPage);
