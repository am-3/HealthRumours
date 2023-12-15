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
	    		      }
             }
           else {
               console.log(element.innerText.trim());
           }
         }
       }
	    	else{
	    	  let url = element.src;
	    		console.log(url);
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
			      }
          }
          else {
            console.log(element.classList.toString());
            console.log(element.innerText.trim());
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

}
