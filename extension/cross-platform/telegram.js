let rightClickOccurred = false;
let clickEvent;
console.log("telegram injected");
browser.runtime.sendMessage({ action: "createContextMenu" });

document.addEventListener("contextmenu", (event) => {
  rightClickOccurred = true;
  clickEvent = event;
});

function sendMessageToBackend(text, imageSrc, socialMediaName) {
  const data = {
    textContent: text,
    imageSrc: imageSrc,
    socialMedia: socialMediaName
  };
  browser.runtime.sendMessage({ action: "getToken" }, (output) => {
    const accessToken = output.result;
    fetch("http://127.0.0.1:8000/insertDataTelegram/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'host':"127.0.0.1:8000",
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response from backend.\nThe result is",data.result);
      })
      .catch((error) => {
        console.error("Error in sending a message to backend: ", error);
      });
  });
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "executeCustomAction" && rightClickOccurred) {
      if (clickEvent && clickEvent.target.tagName === "IMG") {
        console.log("enter into image");
        let selectedcontent = clickEvent.target.parentElement.nextSibling;
        let image_text;
        if(selectedcontent != null)
        {
          image_text = selectedcontent.nextSibling.childNodes[0].textContent;
          // console.log("The content of image is : ",selectedcontent);
        }
        const blobURL = clickEvent.target.src;
        console.log("IMAGE URL:", blobURL);
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function () {
          const recoveredBlob = xhr.response;
          const reader = new FileReader();
          reader.onload = function () {
            const dataURL = reader.result;
            const dataToSend = {
              text:image_text,
              imageSrc:dataURL,
              socialMediaName:"telegram"
            };
            console.log('sending message of text',dataToSend);
            browser.runtime.sendMessage(dataToSend);
            // sendMessageToBackend(image_text, dataURL,'telegram');
            // console.log("Converted Data URL:", dataURL);
          };
          reader.readAsDataURL(recoveredBlob);
        };
        xhr.open("GET", blobURL);
        xhr.send();
      } else if(clickEvent){
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString();
          // console.log("selected text is ", selectedText);
          // sendMessageToBackend(selectedText,undefined,'telegram');
          const dataToSend = {
            text:selectedText,
            imageSrc:undefined,
            socialMediaName:"telegram"
          };
          console.log('sending message of text',dataToSend);
          browser.runtime.sendMessage(dataToSend);
        }
      }
      rightClickOccurred = false;
    }
  });