  setTimeout(extractnew,5000);
  
  function extractnew() {
    const allSectionsAndDivs = document.querySelectorAll("section, div");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
  
    const elementsOutsideHeaderFooter = [];
  
    allSectionsAndDivs.forEach((element) => {
      if (header && !header.contains(element) && footer && !footer.contains(element)) {
        elementsOutsideHeaderFooter.push(element);
      }
    });
  
    const divs = elementsOutsideHeaderFooter;
  
    let maxHeight = 0;
    let req_div;
    divs.forEach((div) => {
      const computedHeight = window
        .getComputedStyle(div)
        .getPropertyValue("height");
      const height = parseFloat(computedHeight);
      if (height > maxHeight ) {
        maxHeight = height;
        req_div = div;
      }
    });
  
    function traverseChildren(element) {
      const children = element.children;
  
      if (children.length === 0) 
      {
        if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) 
        {
          let index = element.innerText.toLowerCase().indexOf('also read');
          if (index !== -1)
          {
            let substring = element.innerText.substring(0, index);
            if(substring) console.log(substring.trim());
          }
          else
          {
            console.log(element.innerText.trim());
          }
        }
      }
  
      for (let i = 0; i < children.length; i++) {
        if ( children[i].tagName.toLowerCase() !== "a" && children[i].tagName.toLowerCase() !== "i" && children[i].tagName.toLowerCase() !== "strong" && children[i].tagName.toLowerCase() !== "b") 
        {
          traverseChildren(children[i]); 
        } 
        else 
        {
          if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) 
          {
            let index = element.innerText.toLowerCase().indexOf('also read');
            if (index !== -1)
            {
              let substring = element.innerText.substring(0, index);
              if(substring) console.log(substring.trim());
            }
            else
            {
              console.log(element.innerText.trim());
              return;
            }
          }
        }
      }
    }
  
    if (req_div) 
    {
      const childrenOfReqDiv = req_div.children;
      for (let i = 0; i < childrenOfReqDiv.length; i++) 
      {
        traverseChildren(childrenOfReqDiv[i]);
      }
    }
  
    console.log("Max height of divs:",maxHeight);
    
  }
  