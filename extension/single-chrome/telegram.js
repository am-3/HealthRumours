function sendMessageToBackend(text, image_src, social_media_name) {
  const data = {
    text_content: text,
    image_src: image_src,
    social_media: social_media_name
  };
  chrome.runtime.sendMessage({ action: "getToken" }, (output) => {
    const accessToken = output.result;
    fetch("http://localhost:8000/insertDataTelegram/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'host':"http://localhost:8000/insertDataTelegram/",
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response from backend.\nThe result is",data.result);
        showResult(data);
      })
      .catch((error) => {
        console.error("Error sending message to backend: ", error);
      });
  });
}
console.log("telegram injected")
let right_click_occurred = false;
let click_event;
document.addEventListener("contextmenu", (event) => {
  right_click_occurred = true;
  click_event = event;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "executeCustomAction" && right_click_occurred) {
      if (click_event && click_event.target.tagName === "IMG") {
        let selected_content = click_event.target.parentElement.parentElement.parentElement.nextSibling.childNodes[0].textContent;
        const blob_url = click_event.target.src;
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function () {
          const recovered_blob = xhr.response;
          const reader = new FileReader();
          reader.onload = function () {
            const data_url = reader.result;
            sendMessageToBackend(selected_content, data_url,'telegram');
            console.log(selected_content, data_url);
          };
          reader.readAsDataURL(recovered_blob);
        };
        xhr.open("GET", blob_url);
        xhr.send();
      } else if(click_event){
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString();
          sendMessageToBackend(selectedText,undefined,'telegram');
          console.log(selectedText);
        }
      }
      right_click_occurred = false;
    }
  });

  function showResult(data){
    let notification = document.createElement('div');
    notification.className = 'custom-notification';
    let result;
    console.log(parseFloat(data.result));
    console.log("yes");
    if (parseFloat(data.result)<=0.5) {
      result = "Fake News";
      notification.style.backgroundColor = "red";
    }
    else if(parseFloat(data.result)>0.5){
      result = "Real News";
      notification.style.backgroundColor = "green";
    }
    else{
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
    close_button.addEventListener('click', function() {
      document.body.removeChild(notification);
    });
    notification.appendChild(close_button);
    document.body.appendChild(notification);
  }
