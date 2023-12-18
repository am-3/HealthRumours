let rightClickOccurred = false;
let clickEvent;
chrome.runtime.sendMessage({ action: "createContextMenu" });
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

  fetch("http://localhost:8000/insert-data/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(
        "Received response from backend.\nThe result is",
        data.result
      );
    })
    .catch((error) => {
      console.error("Error sending message to backend:", error);
    });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "executeCustomAction") {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      const isUrl = /^https?:\/\//.test("s");

      if (isUrl) {
        const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(
          selectedText
        )}`;
        fetch(proxyUrl)
          .then((response) => response.text())
          .then((htmlContent) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;

            // Select all div elements
            const divs = tempDiv.querySelectorAll("div");

            let maxContentLength = 0;
            let selectedDivContent = "";

            // Loop through each div to find the one with the most text content
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
      } else {
        const selectedNode = selection.anchorNode;
        if (selectedNode.childNodes[0]) {
          let childblob = selectedNode.nextSibling.childNodes[0];
          const blobURL = childblob.src;
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function () {
            const recoveredBlob = xhr.response;
            const reader = new FileReader();
            reader.onload = function () {
              const dataURL = reader.result;
              sendMessageToBackend(
                selectedText,
                dataURL,
                "whatsapp"
              );
            };
            reader.readAsDataURL(recoveredBlob);
          };
          xhr.open("GET", blobURL);
          xhr.send();
        } else {
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
