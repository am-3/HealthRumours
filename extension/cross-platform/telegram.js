let rightClickOccurred = false;
let clickEvent;
console.log("telegram injected");
browser.runtime.sendMessage({ action: "createContextMenu" });

document.addEventListener("contextmenu", (event) => {
  rightClickOccurred = true;
  clickEvent = event;
});

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "executeCustomAction" && rightClickOccurred) {
      if (clickEvent && clickEvent.target.tagName === "IMG") {
        console.log("enter into image");
        let selectedcontent = clickEvent.target.parentElement.nextSibling;
        if(selectedcontent != null)
        {
          selectedcontent = selectedcontent.nextSibling.childNodes[0].textContent;
          console.log("The content of image is : ",selectedcontent);
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
            console.log("Converted Data URL:", dataURL);
          };
          reader.readAsDataURL(recoveredBlob);
        };
        xhr.open("GET", blobURL);
        xhr.send();
      } else if(clickEvent){
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString();
          console.log("selected text is ", selectedText);
        }
        else{
            console.log("Nothing is selected")
        }
      }
      rightClickOccurred = false;
    }
  });