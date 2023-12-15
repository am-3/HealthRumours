setTimeout(extractnew, 5000);

function countWords(text) {
	if(text){
  		let words = text.trim().split(/\s+/);
  		return words.length;
	}
	else{
		return 0;
	}
}

function extractnew() {
  let srcURL = window.location.href;
  let articleTitle_value = "Title of the post";
    if(document.getElementsByTagName('H1')[0].textContent){
      articleTitle_value = document.getElementsByTagName('H1')[0].textContent;
    }
  let articleContent_value = "";
  let imageURL_value = "";

  const allSectionsAndDivs = document.querySelectorAll("section, div");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  const elementsOutsideHeaderFooter = [];

  allSectionsAndDivs.forEach((element) => {
    if ((!header || !header.contains(element)) && (!footer || !footer.contains(element))) {
      elementsOutsideHeaderFooter.push(element);
    }
  });

  const divs = elementsOutsideHeaderFooter;

  let maxHeight = 0;
  let req_div;

  divs.forEach((div) => {
    const computedHeight = window.getComputedStyle(div).getPropertyValue("height");
    const height = parseFloat(computedHeight);
    if (height > maxHeight) {
      maxHeight = height;
      req_div = div;
    }
  });
	console.log("Req_div:");
	console.log(req_div);

  const excludeRegex = /(publish-time|caption|related-topics-list|breadcrumbs|leftNav|rgtAdSection|followHT|about\-authors|author\-news|time\-list|hide-mobile|list|ob\-cards|OUTBRAIN|blogroll|widget\-loaded)/;
  
  function traverseChildren(element) {
    const children = element.children;
    const hasExcludedClass = Array.from(element.classList).some(className => excludeRegex.test(className));
    if (children.length === 0) {
      // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('leftNav') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
	    if(element.tagName !== "IMG"){
         if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script" && !hasExcludedClass
         && element.tagName.toLowerCase() !== "style") {
           let index = element.innerText.toLowerCase().indexOf('also read');
           if (index !== -1) {
             	let substring = element.innerText.substring(0, index);
               if (substring){
	    	  	      console.log(substring.trim());
                  articleContent_value += substring.trim();
	    		      }
             }
           else {
              console.log(element.innerText.trim());
              articleContent_value += element.innerText.trim();
           }
         }
       }
	    	else{
	    	  let url = element.src;
	    		console.log(url);
          imageURL_value += url;
	    	}
	  }
	  tagArray = ["a", "i", "strong", "b", "style"];
    for (let i = 0; i < children.length; i++) {
      if (!tagArray.includes(children[i].tagName.toLowerCase())) {
        traverseChildren(children[i]);
      }
      else {
        // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
        if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script" && !hasExcludedClass) {
          let index = element.innerText.toLowerCase().indexOf('also read');
          if (index !== -1) {
            let substring = element.innerText.substring(0, index);
            if (substring){
				        console.log(substring.trim());
                articleContent_value += substring.trim();
			      }
          }
          else {
            console.log(element.classList.toString());
            console.log(element.innerText.trim());
            articleContent_value += element.innerText.trim();
            return;
          }
        }
      }
    }
  }
  if (req_div) {
    const childrenOfReqDiv = req_div.children;
    for (let i = 0; i < childrenOfReqDiv.length; i++) {
      const hasExcludedClass = Array.from(childrenOfReqDiv[i].classList).some(className => excludeRegex.test(className));
      if (!hasExcludedClass)
      {
        traverseChildren(childrenOfReqDiv[i]);
      }
    }
  }
  console.log("Max height of divs:", maxHeight);
  const data = {
    sourceURL: srcURL,
    articleTitle: articleTitle_value,
    articleContent: articleContent_value,
    imageURL: imageURL_value
  }
	fetch('http://127.0.0.1:8000/insertNews/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Host': 'http://127.0.0.1:8000/insertNews/'
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
