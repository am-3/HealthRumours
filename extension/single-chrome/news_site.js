// setTimeout(extractnew, 5000);
// console.clear();
// console.log("injected");
// function countWords(text) {
//   if (text) {
//     let words = text.trim().split(/\s+/);
//     return words.length;
//   }
//   else {
//     return 0;
//   }
// }

// function maxDiv(inputdiv) {
//   let allSectionsAndDivs = inputdiv.querySelectorAll("section, div");
//   let header = inputdiv.querySelector("header");
//   let footer = inputdiv.querySelector("footer");

//   const elementsOutsideHeaderFooter = [];

//   allSectionsAndDivs.forEach((element) => {
//     if ((!header || !header.contains(element)) && (!footer || !footer.contains(element))) {
//       elementsOutsideHeaderFooter.push(element);
//     }
//   });

//   const divs = elementsOutsideHeaderFooter;

//   const htmlheight = parseFloat(window.getComputedStyle(document.body).getPropertyValue("height"));
//   let maxHeight = 0;
//   let req_div;

//   divs.forEach((div) => {
//     const computedHeight = window.getComputedStyle(div).getPropertyValue("height");
//     const height = parseFloat(computedHeight);
//     if (height > maxHeight) {
//       maxHeight = height;
//       req_div = div;
//     }
//   });

//   if (maxHeight > htmlheight - 100) {
//     return maxDiv(req_div);
//   }
//   console.log(maxHeight + " max Heig" + htmlheight);
//   return req_div;
// }

// function extractnew() {
//   let srcURL = window.location.href;
//   let articleTitle_value = "Title of the post";
//   if (document.getElementsByTagName('H1')[0].textContent) {
//     articleTitle_value = document.getElementsByTagName('H1')[0].textContent;
//   }
//   let articleContent_value = "";
//   let imageURL_value = "";

//   let req_div = maxDiv(document);
//   console.log("Req_div:");
//   console.log(req_div);

//   const excludeRegex = /(publish-time|eNGy|_3AAK|_2gai|_15-l|_3R--|_3G-u|trc_related_container|tag-btn|caption|related-topics-list|breadcrumbs|leftNav|rgtAdSection|followHT|about\-authors|author\-news|time\-list|hide-mobile|list|ob\-cards|OUTBRAIN|blogroll|widget\-loaded)/;

//   function traverseChildren(element) {
//     const children = element.children;
//     if (children.length === 0) {
//       // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('leftNav') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
//       const hasExcludedClass = Array.from(element.classList).some(className => excludeRegex.test(className));

//       if (!hasExcludedClass) {
//         if (element.tagName !== "IMG") {
//           if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script"
//             && element.tagName.toLowerCase() !== "style") {
//             let index = element.innerText.toLowerCase().indexOf('also read');
//             if (index !== -1) {
//               let substring = element.innerText.substring(0, index);
//               if (substring) {
//                 console.log(substring.trim());
//                 articleContent_value += substring.trim();
//               }
//             }
//             else {
//               console.log(element.innerText.trim());
//               articleContent_value += element.innerText.trim();
//             }
//           }
//         }
//         else {
//           let url = element.src;
//           console.log(url);
//           imageURL_value += url;
//         }
//       }
//     }

//     tagArray = ["a", "i", "strong", "b", "style"];

//     for (let i = 0; i < children.length; i++) {
//       const hasExcludedClass = Array.from(children[i].classList).some(className => excludeRegex.test(className));
//       if (!hasExcludedClass) {
//         if (!tagArray.includes(children[i].tagName.toLowerCase())) {
//           traverseChildren(children[i]);
//         }
//         else {
//           // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
//           if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script") {
//             let index = element.innerText.toLowerCase().indexOf('also read');
//             if (index !== -1) {
//               let substring = element.innerText.substring(0, index);
//               if (substring) {
//                 console.log(substring.trim());
//                 articleContent_value += substring.trim();
//               }
//             }
//             else {
//               console.log(element.classList.toString());
//               console.log(element.innerText.trim());
//               articleContent_value += element.innerText.trim();
//               return;
//             }
//           }
//         }
//       }

//     }
//   }
//   if (req_div) {
//     const childrenOfReqDiv = req_div.children;
//     for (let i = 0; i < childrenOfReqDiv.length; i++) {
//       const hasExcludedClass = Array.from(childrenOfReqDiv[i].classList).some(className => excludeRegex.test(className));
//       if (!hasExcludedClass) {
//         traverseChildren(childrenOfReqDiv[i]);
//       }
//     }
//   }
//   // console.log("Max height of divs:", maxHeight);
//   const data = {
//     sourceURL: srcURL,
//     articleTitle: articleTitle_value,
//     articleContent: articleContent_value,
//     imageURL: imageURL_value
//   }
//   chrome.runtime.sendMessage({ action: 'getToken' }, output => {
//     const accessToken = output.result;
//     fetch('http://127.0.0.1:8000/insertNews/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Host': 'http://127.0.0.1:8000/insertNews/',
//         'Authorization': `Bearer ${accessToken}`
//       },
//       body: JSON.stringify(data)
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Success:', data.result);
//         var notification = document.createElement('div');
//         notification.className = 'custom-notification';
//         notification.innerText = data.result;
//         document.body.appendChild(notification);
//       })
//       .catch((error) => {
//         console.error('Error: ', error);
//       });
//   });
// }






// // Function to inject a new div element before the first h1 tag
// function injectDivBeforeFirstH1(data) {
//   // Create a new div element
//   var newDiv = document.createElement('div');

//   // Set attributes or styles for the new div if needed
//   newDiv.textContent = data;
//   newDiv.style.backgroundColor = "#f0f0f0";
//   newDiv.style.padding = "10px";

//   // Get all h1 elements
//   let title_tag= document.getElementsByTagName('H1')[0];
//   if(title_tag)
//   {
//     title_tag.parentNode.insertBefore(newDiv,title_tag);
//   }
// }







setTimeout(extractnew, 5000);

function countWords(text) {
  if (text) {
    let words = text.trim().split(/\s+/);
    return words.length;
  }
  else {
    return 0;
  }
}

function maxDiv(inputdiv) {
  let all_sections_and_divs = inputdiv.querySelectorAll("section, div");
  let header = inputdiv.querySelector("header");
  let footer = inputdiv.querySelector("footer");

  const elements_outside_header_footer = [];

  all_sections_and_divs.forEach((element) => {
    if ((!header || !header.contains(element)) && (!footer || !footer.contains(element))) {
      elements_outside_header_footer.push(element);
    }
  });

  const divs = elements_outside_header_footer;

  const html_height = parseFloat(window.getComputedStyle(document.body).getPropertyValue("height"));
  let max_height = 0;
  let req_div;

  divs.forEach((div) => {
    const computed_height = window.getComputedStyle(div).getPropertyValue("height");
    const height = parseFloat(computed_height);
    if (height > max_height) {
      max_height = height;
      req_div = div;
    }
  });

  if (max_height > html_height - 100) {
    return maxDiv(req_div);
  }
  console.log(max_height + " max Heig" + html_height);
  return req_div;
}

function extractnew() {
  let src_URL = window.location.href;
  let article_title_value = "Title of the post";
  if (document.getElementsByTagName('H1')[0].textContent) {
    article_title_value = document.getElementsByTagName('H1')[0].textContent;
  }
  let article_content_value = "";
  let imageURL_value = "";

  let req_div = maxDiv(document);
  console.log("Req_div:");
  console.log(req_div);

  const exclude_regex = /(publish-time|eNGy|_3AAK|_2gai|s-lf-wid|ads_tb-c|t-brd|ft-social|clearfix|ins_keyword_rhs|pst-by_ul|story_footer|_15-l|_3R--|_3G-u|trc_related_container|related_stories_wrap|article_author|tag-btn|caption|related-topics-list|breadcrumbs|leftNav|rgtAdSection|followHT|about\-authors|author\-news|time\-list|hide-mobile|list|ob\-cards|OUTBRAIN|blogroll|jsx-1f5db684a671d6c1|bredcrum|NPrltd_story_Wrp|widget\-loaded)/;

  function traverseChildren(element) {
    const children = element.children;
    if (children.length === 0) {
      // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('leftNav') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
      const has_excluded_class = Array.from(element.classList).some(className => exclude_regex.test(className));

      if (!has_excluded_class) {
        if (element.tagName !== "IMG") {
          if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script"
            && element.tagName.toLowerCase() !== "style") {
            let index = element.innerText.toLowerCase().indexOf('also read');
            if (index !== -1) {
              let substring = element.innerText.substring(0, index);
              if (substring) {
                console.log(substring.trim());
                article_content_value += substring.trim();
              }
            }
            else {
              console.log(element.innerText.trim());
              article_content_value += element.innerText.trim();
            }
          }
        }
        else {
          let url = element.src;
          console.log(url);
          // imageURL_value += url;
          imageURL_value = url;
        }
      }
    }

    let tag_array = ["a", "i", "strong", "b", "style"];

    for (let i = 0; i < children.length; i++) {
      const hasExcludedClass = Array.from(children[i].classList).some(className => exclude_regex.test(className));
      if (!hasExcludedClass) {
        if (!tag_array.includes(children[i].tagName.toLowerCase())) {
          traverseChildren(children[i]);
        }
        else {
          // if (countWords(element.innerText) > 10 && element.tagName.toLowerCase() !== "script" && !element.classList.contains('publish-time') && !element.classList.contains('caption') && !element.classList.contains('related-topics-list') && !element.classList.contains('breadcrumbs')) {
          if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script") {
            let index = element.innerText.toLowerCase().indexOf('also read');
            if (index !== -1) {
              let substring = element.innerText.substring(0, index);
              if (substring) {
                console.log(substring.trim());
                article_content_value += substring.trim();
              }
            }
            else {
              console.log(element.classList.toString());
              console.log(element.innerText.trim());
              article_content_value += element.innerText.trim();
              return;
            }
          }
        }
      }

    }
  }
  if (req_div) {
    const children_of_req_div = req_div.children;
    for (let i = 0; i < children_of_req_div.length; i++) {
      const has_excluded_class = Array.from(children_of_req_div[i].classList).some(className => exclude_regex.test(className));
      if (!has_excluded_class) {
        traverseChildren(children_of_req_div[i]);
      }
    }
  }


  // console.log("Max height of divs:", maxHeight);
  const data = {
    source_url: src_URL,
    article_title: article_title_value,
    article_content: article_content_value,
    image_url: imageURL_value
  }
  chrome.runtime.sendMessage({ action: 'getToken' }, output => {
    const accessToken = output.result;
    fetch('http://127.0.0.1:8000/insertNews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'http://127.0.0.1:8000/insertNews/',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        showResult(data);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  });
}

function showResult(data) {
  let notification = document.createElement('div');
  notification.className = 'custom-notification';
  let result;
  console.log(parseFloat(data.result));
  console.log("yes");
  if (parseFloat(data.result) <= 0.5) {
    result = "Fake News";
    notification.style.backgroundColor = "red";
  }
  else if (parseFloat(data.result) > 0.5) {
    result = "Real News";
    notification.style.backgroundColor = "green";
  }
  else {
    result = "Cannot predict"
    notification.style.backgroundColor = "blue";
  }
  //  result = data.result==='0' ? "Fake News" : "Real News"
  notification.innerText = result;
  let close_button = document.createElement('button');
  close_button.innerText = '✖';
  close_button.className = 'close-button';
  close_button.style.position = 'absolute';
  close_button.style.top = '5px';
  close_button.style.right = '5px';
  close_button.addEventListener('click', function () {
    document.body.removeChild(notification);
  });
  notification.appendChild(close_button);
  document.body.appendChild(notification);
}
