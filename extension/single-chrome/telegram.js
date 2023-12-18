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
          console.log(selectedText);
        }
      }
      rightClickOccurred = false;
    }
  });