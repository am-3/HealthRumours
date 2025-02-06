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
    text_content: text,
    image_src: imageSrc,
    social_media: socialMediaName
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

////////
browser.runtime.onMessage.addListener(function (message) {
  if (message.action === "showResult") {
    const result = message.result;
    showResult(result); // Call your function to display the result
    // console.log("Data from backend:",result)
  }
});
////////

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  

    if (request.action === "executeCustomAction" && rightClickOccurred) {
      const selection = window.getSelection();
      console.log(clickEvent.target.tagName)
      if (selection) 
      {
        const selectedText = selection.toString();
        const isUrl = /^https?:\/\//.test(selectedText);
          console.log("inside selection1")
          if (isUrl) {
            console.log("inside url");
            const ismatched = /^https:\/\/(www\.)?(hindustantimes\.com|thehindu\.com|timesofindia\.indiatimes\.com|deccanchronicle\.com|foxnews\.com|washingtonexaminer\.com|tmz\.com|latimes\.com|theguardian\.com|scotsman\.com|indianexpress\.com|indiatoday\.in|ndtv\.com|news18\.com)\/.*\/.*$/.test(selectedText)
          if(ismatched)
          {
              console.log("matching")
              // sendMessageToBackend(selected_text, null, "news_site",true);
              const dataToSend = {
                text_content:selectedText,
                image_src:undefined,
                social_media:"telegram",
                is_url:true
              };
              console.log('sending news url to backend',dataToSend);
              browser.runtime.sendMessage(dataToSend);
          }
          else
          {
            console.log("not matching")
            showResult({result:"Our Extension doesnt support this URL currently"});
          }
        }
      // }

      else if (clickEvent && clickEvent.target.tagName === "IMG") {
        console.log("enter into image");

        // let selectedcontent = clickEvent.target.parentElement.nextSibling;
        let selectedcontent = clickEvent.target.parentElement.parentElement.parentElement.nextSibling;

        // console.log(clickEvent.target.parentElement.parentElement.parentElement.nextSibling.children[0].textContent)
        let image_text;
        if(selectedcontent != null)
        {
          image_text = selectedcontent.children[0].textContent;
          console.log("The content of image is : ",image_text);
         // console.log("Inside selected content if");
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
              // text:image_text,
              // imageSrc:dataURL,
              // socialMediaName:"telegram"
              text_content:image_text,
              image_src:dataURL,
              social_media:"telegram",
              is_url:false
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
        console.log("just selected text if condition")
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString();
          // console.log("selected text is ", selectedText);
          // sendMessageToBackend(selectedText,undefined,'telegram');
          const dataToSend = {
            text_content:selectedText,
            image_src:undefined,
            social_media:"telegram",
            is_url:false
          };
          console.log('sending message of text',dataToSend);
          browser.runtime.sendMessage(dataToSend);
        }
      }
      rightClickOccurred = false;
    }
  }
  });


  ////////
function showResult(data){
  let notification = document.createElement('div');
  notification.className = 'custom-notification';
  let result;
  // console.log(parseFloat(data));
  console.log(data);
  data=parseFloat(data)
  console.log("yes");
  if(data===0) {
    result = "Health Related News";
    notification.style.backgroundColor = "blue";
  } 
  else if(data===2) {
    result = "Satirical News";
    notification.style.backgroundColor = "blue";
  }
  else if(data<=0.5) {
    result = "Fake News";
    notification.style.backgroundColor = "red";
  }
  else if(data>0.5){
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
////////