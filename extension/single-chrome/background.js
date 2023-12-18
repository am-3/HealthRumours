// For Whatsapp/Messaging Scraping
  // chrome.action.onClicked.addListener(function (tab) {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     func: function () {
  //       console.clear();
  //       let selectedText = '';
  //       const selection = window.getSelection();
  
  //       if (selection && selection.toString()) {
  //         selectedText = selection.toString();
  //         console.log("Selected text:", selectedText);
  //       } else {
  //         console.log("No text selected.");
  //       }
  //     }
  //   });
  // });

  // in chrome
//   chrome.action.onClicked.addListener(function (tab) {
//     const whatsappUrlPattern = /^https:\/\/web\.whatsapp\.com\//;
//     const telegramUrlPattern = /^https:\/\/web\.telegram\.org\//;
  
//     if (whatsappUrlPattern.test(tab.url) || telegramUrlPattern.test(tab.url)) {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: function () {
//           console.clear();
//           const selection = window.getSelection();
  
//           if (selection && selection.toString()) {
//             const selectedText = selection.toString();
  
//             const isUrl = /^https?:\/\//.test(selectedText);
  
//             if (isUrl) {
//               const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedText)}`;
//               fetch(proxyUrl)
//                 .then(response => response.text())
//                 .then(htmlContent => {
//                   const tempDiv = document.createElement('div');
//                   tempDiv.innerHTML = htmlContent;
  
//                   // Select all div elements
//                   const divs = tempDiv.querySelectorAll('div');
  
//                   let maxContentLength = 0;
//                   let selectedDivContent = '';
  
//                   // Loop through each div to find the one with the most text content
//                   divs.forEach(div => {
//                     const textContent = div.innerText || div.textContent;
//                     const contentLength = textContent.length;
  
//                     if (contentLength > maxContentLength) {
//                       maxContentLength = contentLength;
//                       selectedDivContent = textContent;
//                     }
//                   });
  
//                   console.log(selectedDivContent);
//                 })
//                 .catch(error => {
//                   console.error("Error fetching content:", error);
//                 });
  
//             } else {
//               console.log("Selected text is :", selectedText);
//             }
//           } else {
//             // console.log("No text selected.");
//             alert("No text selected! Please select the text to use this extension in WhatsApp");
//           }
//         }
//       });
//     }
//   });

  
  // workig for firefox and content.js
//   chrome.action.onClicked.addListener(function (tab) {
//     const whatsappUrlPattern = /^https:\/\/web\.whatsapp\.com\//;
//     const telegramUrlPattern = /^https:\/\/web\.telegram\.org\//;
//     // const newsUrl = "https://www.thehindu.com/news/national/devanand-jha-father-of-lalit-jha-parliament-security-breach/article67645385.ece";
//     // console.log("Snigdha")
    
//     if (whatsappUrlPattern.test(tab.url) || telegramUrlPattern.test(tab.url)) {
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             func:function(){
//                 console.clear();
//                 const selection = window.getSelection();

//                 if (selection && selection.toString()) {
//                     const selectedText = selection.toString();

//                     const isUrl = /^https?:\/\//.test(selectedText);

//                     if (isUrl) {
//                       const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedText)}`;
                        
//                         // chrome.runtime.sendMessage({ action: "fetchUrl", url: selectedText }, function (htmlContent) {
//                           chrome.runtime.sendMessage({ action: "fetchUrl", url: proxyUrl }, function (htmlContent) {
//                             const tempDiv = document.createElement('div');
//                             tempDiv.innerHTML = htmlContent;

//                             // Select all div elements
//                             const divs = tempDiv.querySelectorAll('div');

//                             let maxContentLength = 0;
//                             let selectedDivContent = '';

//                             // Loop through each div to find the one with the most text content
//                             divs.forEach(div => {
//                                 const textContent = div.innerText || div.textContent;
//                                 const contentLength = textContent.length;

//                                 if (contentLength > maxContentLength) {
//                                     maxContentLength = contentLength;
//                                     selectedDivContent = textContent;
//                                 }
//                             });

//                             console.log(selectedDivContent);
//                         });
//                     } else {
//                         console.log("Selected text is:", selectedText);
//                     }
//                 } else {
//                     // console.log("No text selected.");
//                     alert("No text selected! Please select the text to use this extension in WhatsApp");
//                 }
//             }
//         });
//     }
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action === "fetchUrl") {
//         fetch(request.url)
//             .then(response => response.text())
//             .then(htmlContent => {
//                 sendResponse(htmlContent);
//             })
//             .catch(error => {
//                 console.error("Error fetching content:", error);
//                 sendResponse("<empty string>");
//             });
//         return true;
//     }
// });

  // files: ["content.js"] 


// For full-site text
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//      let paragraphs = request.paragraphs;
//      if(paragraphs == null || paragraphs.length == 0) {
//      }
//      else {
//         paragraphs.forEach((paragraph) => {
// 			console.log(paragraph);
//         });
//      }
// })


let server;

chrome.action.onClicked.addListener(function (tab) {
    const whatsappUrlPattern = /^https:\/\/web\.whatsapp\.com\//;
    const telegramUrlPattern = /^https:\/\/web\.telegram\.org\//;

    if (whatsappUrlPattern.test(tab.url) || telegramUrlPattern.test(tab.url)) {
        // Start the server only if it's not already running
        if (!server) {
            startServer();
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: function () {
                    console.clear();
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
                            });
                        } else {
                            console.log("Selected text is:", selectedText);
                        }
                    } else {
                        // console.log("No text selected.");
                        alert("No text selected! Please select the text to use this extension in WhatsApp");
                    }
                }
        });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "fetchUrl") {
        fetch(request.url)
            .then(response => response.text())
            .then(htmlContent => {
                // Stop the server after processing the request
                stopServer();
                sendResponse(htmlContent);
            })
            .catch(error => {
                console.error("Error fetching content:", error);
                // Stop the server in case of an error
                stopServer();
                sendResponse("<empty string>");
            });
        return true;
    }
});

function startServer() {
    // Send a message to the server script to start the server
    chrome.runtime.sendMessage({ action: "startServer" }, function (response) {
        if (response.success) {
            console.log("Proxy server started successfully");
        } else {
            console.error("Error starting proxy server:", response.error);
        }
    });
}

function stopServer() {
    // Send a message to the server script to stop the server
    chrome.runtime.sendMessage({ action: "stopServer" }, function (response) {
        if (response.success) {
            console.log("Proxy server stopped successfully");
        } else {
            console.error("Error stopping proxy server:", response.error);
        }
    });
}


