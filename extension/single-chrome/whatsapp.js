let right_click_occurred = false;
console.log('whatsapp injected');
let click_event;
chrome.runtime.sendMessage({ action: "createContextMenu" });
document.addEventListener("contextmenu", (event) => {
  right_click_occurred = true;
  console.log('yes');
  click_event = event;
});

function sendMessageToBackend(text, image_src, social_media,is_url) {
  const data = {
    text_content: text,
    image_src: image_src,
    social_media: social_media,
    is_url:is_url
  };
  console.log("data: ",data);
  chrome.runtime.sendMessage({ action: "getToken" }, (output) => {
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
        showResult(data)
  //       let notification = document.createElement('div');
  // notification.className = 'custom-notification';
  // let result;
  // console.log(parseFloat(data.result));
  // console.log("yes");
  // if (parseFloat(data.result)<=0.5) {
  //   result = "Fake News";
  //   notification.style.backgroundColor = "red";
  // }
  // else if(parseFloat(data.result)>0.5){
  //   result = "Real News";
  //   notification.style.backgroundColor = "green";
  // }
  // else{
  //   result = "Cannot predict"
  //   notification.style.backgroundColor = "blue";
  // }
  // //  result = data.result==='0' ? "Fake News" : "Real News"
  // notification.innerText = result;
  // let close_button = document.createElement('button');
  // close_button.innerText = '✖'; 
  // close_button.className = 'close-button';
  // close_button.style.position = 'absolute';
  // close_button.style.top = '5px'; 
  // close_button.style.right = '5px'; 
  // close_button.addEventListener('click', function() {
  //   document.body.removeChild(notification);
  // });
  // notification.appendChild(close_button);
  // document.body.appendChild(notification);
      })
      .catch((error) => {
        console.error("Error sending message to backend: ", error);
      });
  });
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "executeCustomAction") {
    const selection = window.getSelection();
    if (selection) {
      const selected_text = selection.toString();
      const is_url = /^https?:\/\//.test(selected_text);
      console.log("inside selection")
      if (is_url) {
        console.log("inside url")
        let news_article_list = [
          "https://www.hindustantimes.com/*/*",
          "https://www.thehindu.com/*/*",
          "https://timesofindia.indiatimes.com/*/*",
          "https://www.deccanchronicle.com/*/*",
          "https://www.foxnews.com/*/*",
          "https://www.washingtonexaminer.com/*/*",
          "https://www.tmz.com/*/*",
          "https://www.latimes.com/*/*",
          "https://www.theguardian.com/*/*",
          "https://www.scotsman.com/*/*",
          "https://indianexpress.com/*/*",
          "https://www.indiatoday.in/*/*",
          "https://www.ndtv.com/*/*",
          "https://www.news18.com/*/*/"
  
        ];
        // const regex = new RegExp("^" + "https://www.thehindu.com/*/*".replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*") + "$");
        let is_matching = false;
        for (const news_site of news_article_list)
        {
          const regex = new RegExp("^" + news_site.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*") + "$");
          is_matching = regex.test(selected_text)
          if(is_matching){
            console.log("matching")
            sendMessageToBackend(selected_text, null, "news_site",true);
            break;
          }

        }
        if(!is_matching)
        {
          console.log("not matching")
          showResult({result:"Our Extension doesnt support this URL currently"});
        }
      } else {
        const selected_node = selection.anchorNode;
        if (selected_node.childNodes[0]) {
          let childblob = selected_node.nextSibling.childNodes[0];
          const blob_url = childblob.src;
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function () {
            const recovered_blob = xhr.response;
            const reader = new FileReader();
            reader.onload = function () {
              const data_url = reader.result;
              sendMessageToBackend(selected_text, data_url, "whatsapp",false);
            };
            reader.readAsDataURL(recovered_blob);
          };
          xhr.open("GET", blob_url);
          xhr.send();
        } else {
          sendMessageToBackend(selected_text, undefined, "whatsapp",false);
        }
      }
    } else {
      alert(
        "No text selected! Please select the text to use this extension in WhatsApp"
      );
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