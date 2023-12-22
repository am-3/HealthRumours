console.log('whatsapp injected');
let rightClickOccurred = false;
let clickEvent;
browser.runtime.sendMessage({ action: "createContextMenu" });
document.addEventListener("contextmenu", (event) => {
  rightClickOccurred = true;
  clickEvent = event;
});

function sendMessageToBackend(text, imageSrc, socialMediaName) {
  const data = {
    textContent: text,
    imageSrc: imageSrc,
    socialMedia: socialMediaName,
  };
  browser.runtime.sendMessage({ action: "getToken" }, (output) => {
    const accessToken = output.result;
    fetch("http://localhost:8000/insertDataWhatsapp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'host':"http://localhost:8000/insertDataWhatsapp/",
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response from backend.\nThe result is",data.result);
      })
      .catch((error) => {
        console.error("Error sending message to backend: ", error);
      });
  });
}



browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "executeCustomAction") {  
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      const isUrl = /^https?:\/\//.test('s');
      if (isUrl) {
        const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedText)}`;
        fetch(proxyUrl)
          .then((response) => response.text())
          .then((htmlContent) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;
            const divs = tempDiv.querySelectorAll("div");
            let maxContentLength = 0;
            let selectedDivContent = "";
            divs.forEach((div) => {
              const textContent = div.innerText || div.textContent;
              const contentLength = textContent.length;
              if (contentLength > maxContentLength) {
                maxContentLength = contentLength;
                selectedDivContent = textContent;
              }
            });
            console.log(selectedDivContent);
          })
          .catch((error) => {
            console.error("Error fetching content:", error);
          });
      } 
      else 
      {
        const selectedNode = selection.anchorNode;
        const number = selectedNode.parentElement.parentElement;
        let image_text;
        if(number.childElementCount === 3)
        {
          image_text = selectedNode.parentElement.nextSibling.childNodes[0].childNodes[0].textContent;
          // console.log("Selected text is :",text );
        }
        if (selectedNode.childNodes[1]) {
          let child = selectedNode.childNodes[0];
          if (child.nodeName === "IMG") {
            console.log("url is ", child.src);
          }
          let childblob = selectedNode.childNodes[1].childNodes[0];
          const blobURL = childblob.src;
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function () {
            const recoveredBlob = xhr.response;
            const reader = new FileReader();
            reader.onload = function () {
              const dataURL = reader.result;
              sendMessageToBackend(image_text, dataURL, "whatsapp");
              // console.log("Converted Data URL:", dataURL);
            };
            reader.readAsDataURL(recoveredBlob);
          };
          xhr.open("GET", blobURL);
          xhr.send();
        }
        else
        {
          // console.log("Selected text is :", selectedText);
          sendMessageToBackend(selectedText, undefined, "whatsapp");
        }        
      }
    } else {
      alert(
        "No text selected! Please select the text to use this extension in WhatsApp"
      );
    }
    rightClickOccurred = false;
  }
});