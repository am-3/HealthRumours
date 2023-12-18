function sendMessageToBackend(text, imageSrc, socialMediaName) {
  const data = {
    textContent: text,
    imageSrc: imageSrc,
    socialMedia: socialMediaName
  };
  fetch('http://localhost:8000/insert-data/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Received response from backend.\nThe result is', data.result);
    })
    .catch(error => {
      console.error('Error sending message to backend:', error);
    });
}

let rightClickOccurred = false;
let clickEvent;
document.addEventListener("contextmenu", (event) => {
  rightClickOccurred = true;
  clickEvent = event;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "executeCustomAction" && rightClickOccurred) {
      if (clickEvent && clickEvent.target.tagName === "IMG") {
        let selectedcontent = clickEvent.target.parentElement.parentElement.parentElement.nextSibling.childNodes[0].textContent;
        const blobURL = clickEvent.target.src;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function () {
          const recoveredBlob = xhr.response;
          const reader = new FileReader();
          reader.onload = function () {
            const dataURL = reader.result;
            sendMessageToBackend(selectedcontent, dataURL,'telegram');
            console.log(selectedcontent, dataURL);
          };
          reader.readAsDataURL(recoveredBlob);
        };
        xhr.open("GET", blobURL);
        xhr.send();
      } else if(clickEvent){
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString();
          sendMessageToBackend(selectedText,undefined,'telegram');
          console.log(selectedText);
        }
      }
      rightClickOccurred = false;
    }
  });