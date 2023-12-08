prev = "first";
count = 0;
tc = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
     let paragraphs = request.paragraphs;
     if(paragraphs == null || paragraphs.length == 0) {
     }
     else {
        paragraphs.forEach((paragraph) => {
			if(paragraph.length > 5){
				if(prev === paragraph){
					console.log("Post " + count);
					count += 1;
					tc++;
				}
				else{
					console.log(paragraph);
					tc++;
				}
				prev = paragraph;
			}
        });
     }
})
