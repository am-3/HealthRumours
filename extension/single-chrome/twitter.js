prev = "first";
count = 0;

function sendData(srcURL, articleContent_value, imageURL_value){
  const data = {
    sourceURL: srcURL,
    articleContent: articleContent_value,
    imageURL: imageURL_value,
	platformName: "Twitter"
  }
	fetch('http://127.0.0.1:8000/insertSocial/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Host': 'http://127.0.0.1:8000/insertSocial/'
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

}

function scrapeContentFromPage() {
 
    let divs = document.querySelectorAll('div, article'); // Adjust for other elements containing paragraphs
	tweets = []
	for(let div of divs){
		if(div.getAttribute("data-testid") == "tweet"){
			tweets.push(div);
		}
	}
	srcURLs = []
	for(let tweet of tweets){
		let aTags = tweet.getElementsByTagName("A");
		for(let aTag of aTags){
			let href = aTag.getAttribute("href")
			if(href.includes("/status/")){
				srcURLs.push(href);
			}
		}
	}
	cur = []
	index = 0;
	for(let div of divs){
		if(div.getAttribute("data-testid") == "tweetText"){
			cur[0] = div.textContent;
		}
		else if(div.getAttribute("data-testid") == "tweetPhoto"){
			cur_div = div;
			imgElements = cur_div.getElementsByTagName("IMG");
			if(imgElements.length > 0){
				cur[1] = imgElements[0].src;
				sendData(srcURLs[index], cur[0], cur[1]);
				index += 1;
			}
		}
		else if(div.getAttribute("data-testid") == "videoComponent"){
			cur_div = div;
			cur[1] = 'videoLink';
			sendData(srcURLs[index], cur[0], cur[1]);
			index += 1;
		}
	}
}
setTimeout(scrapeContentFromPage, 5000);
