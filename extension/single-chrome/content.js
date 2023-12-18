// console.log("Yess");
// ,
// 		{
// 			"matches": ["<all_urls>"],
// 			"exclude_matches": ["https://twitter.com/*", "https://www.facebook.com/*"],
// 			"js": ["content.js"],
// 			"run_at": "document_idle"
// 		}
function calling() {
    console.clear();
    // console.log("hello");
    const selection = window.getSelection();

    if (selection && selection.toString()) {
        const selectedText = selection.toString();

        const isUrl = /^https?:\/\//.test(selectedText);

        if (isUrl) {
            const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedText)}`;
            
            // chrome.runtime.sendMessage({ action: "fetchUrl", url: selectedText }, function (htmlContent) {
            chrome.runtime.sendMessage({ action: "fetchUrl", url: proxyUrl }, function (htmlContent) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;

                // Select all div elements
                const divs = tempDiv.querySelectorAll('div');

                let maxContentLength = 0;
                let selectedDivContent = '';

                // Loop through each div to find the one with the most text content
                divs.forEach(div => {
                    const textContent = div.innerText || div.textContent;
                    const contentLength = textContent.length;

                    if (contentLength > maxContentLength) {
                        maxContentLength = contentLength;
                        selectedDivContent = textContent;
                    }
                });

                console.log(selectedDivContent);

                // newsarticles.js
                // chrome.scripting.registerContentScript({
                //     target: { tabId: activeTab.id },
                //     files: ["facebook.js"]
                //   });

                //na

                // function countWords(text) {
                //     if (text) {
                //         let words = text.trim().split(/\s+/);
                //         return words.length;
                //     }
                //     else {
                //         return 0;
                //     }
                // }
                // const tempDiv = document.createElement('div');
                // tempDiv.innerHTML = htmlContent;

                // const htmlheight = parseFloat(window.getComputedStyle(tempDiv.body).getPropertyValue("height"));
                // let maxHeight = 0;
                // let req_div = null;
            
                // var allSectionsAndDivs = tempDiv.querySelectorAll("section, div");
                // var header = tempDiv.querySelector("header");
                // var footer = tempDiv.querySelector("footer");
            
                // var elementsOutsideHeaderFooter = [];
            
                // allSectionsAndDivs.forEach((element) => {
                //     if ((!header || !header.contains(element)) && (!footer || !footer.contains(element))) {
                //         elementsOutsideHeaderFooter.push(element);
                //     }
                // });
            
                // var divs = elementsOutsideHeaderFooter;
            
            
                // divs.forEach((div) => {
                //     const computedHeight = window.getComputedStyle(div).getPropertyValue("height");
                //     const height = parseFloat(computedHeight);
                //     if (height > maxHeight) {
                //         maxHeight = height;
                //         req_div = div;
                //     }
                // });
            
                // console.log("Req_div:");
                // console.log(req_div);
            
                // const excludeRegex = /(publish-time|caption|sec-|related-topics-list|breadcrumbs|mgid_second_mrec_parent|leftNav|rgtAdSection|followHT|about\-authors|trc_rbox_container|author\-news|time\-list|hide-mobile|list|ob\-cards|OUTBRAIN|blogroll|widget\-loaded|custom_ad)/;
            
                // function traverseChildren(element) {
                //     const children = element.children;
                //     if (children.length === 0) {
                //         if (element.tagName !== "IMG") {
                //             if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script" && element.tagName.toLowerCase() !== "style") {
                //                 let index = element.innerText.toLowerCase().indexOf('also read');
                //                 if (index !== -1) {
                //                     let substring = element.innerText.substring(0, index);
                //                     if (substring) {
                //                         console.log(substring.trim());
                //                     }
                //                 }
                //                 else {
                //                     console.log(element.innerText.trim());
                //                 }
                //             }
                //         }
                //         else {
                //             let url = element.src;
                //             console.log(url);
                //         }
                //     }
                //     else {
                //         tagArray = ["a", "i", "strong", "b", "style"];
                //         for (let i = 0; i < children.length; i++) {
                //             const hasExcludedClass = Array.from(children[i].classList).some(className => excludeRegex.test(className));
                //             if (!hasExcludedClass) {
                //                 if (!tagArray.includes(children[i].tagName.toLowerCase())) {
                //                     traverseChildren(children[i]);
                //                 }
                //                 else {
                //                     if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script") {
                //                         let index = element.innerText.toLowerCase().indexOf('also read');
                //                         if (index !== -1) {
                //                             let substring = element.innerText.substring(0, index);
                //                             if (substring) {
                //                                 console.log(substring.trim());
                //                             }
                //                         }
                //                         else {
                //                             // console.log(element.classList.toString());
                //                             console.log(element.innerText.trim());
                //                             return;
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
            
                // if (req_div) {
                //     const childrenOfReqDiv = req_div.children;
                //     for (let i = 0; i < childrenOfReqDiv.length; i++) {
                //         const hasExcludedClass = Array.from(childrenOfReqDiv[i].classList).some(className => excludeRegex.test(className));
                //         if (!hasExcludedClass) {
                //             traverseChildren(childrenOfReqDiv[i]);
                //         }
                //     }
                // }
            
                // console.log("Max height of divs:", maxHeight);

            });
        } else {
            console.log("Selected text is:", selectedText);
        }
    } else {
        // console.log("No text selected.");
        alert("No text selected! Please select the text to use this extension in WhatsApp");
    }
}

setTimeout(calling,1000);