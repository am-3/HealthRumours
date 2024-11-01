console.log('whatsapp injected');
let rightClickOccurred = false;
let clickEvent;
browser.runtime.sendMessage({ action: "createContextMenu" });
document.addEventListener("contextmenu", (event) => {
  rightClickOccurred = true;
  clickEvent = event;
});

function sendMessageToBackend(text, image_src, social_media) {
  const data = {
    text_content: text,
    image_src: image_src,
    social_media: social_media
  };
  browser.runtime.sendMessage({ action: "getToken" }, (output) => {
    const accessToken = output.result;
    fetch("http://127.0.0.1:8000/insertDataWhatsapp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'host':'http://127.0.0.1:8000/insertDataWhatsapp/',
        'Authorization':`Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received response from backend.\nThe result is",data.result);
        showResult(data)
      })
      .catch((error) => {
        console.error("Error sending message to backend: ", error);
      });
  });
}

////////
browser.runtime.onMessage.addListener(function (message) {
  if (message.action === "showResult") {
    const result = message.result;
    showResult(result); 
    // console.log("Data from backend:",result)
  }
});
////////

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "executeCustomAction") {  
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      if(selectedText===undefined){
        selectedText="";
      }
      const isUrl = /^https?:\/\//.test(selectedText);
      console.log("inside selection:",selectedText)
      if (isUrl) {
        console.log("inside url");

        // let news_article_list = [
        //   "https://www.hindustantimes.com/*/*",
        //   "https://www.thehindu.com/*/*",
        //   "https://timesofindia.indiatimes.com/*/*",
        //   "https://www.deccanchronicle.com/*/*",
        //   "https://www.foxnews.com/*/*",
        //   "https://www.washingtonexaminer.com/*/*",
        //   "https://www.tmz.com/*/*",
        //   "https://www.latimes.com/*/*",
        //   "https://www.theguardian.com/*/*",
        //   "https://www.scotsman.com/*/*",
        //   "https://indianexpress.com/*/*",
        //   "https://www.indiatoday.in/*/*",
        //   "https://www.ndtv.com/*/*",
        //   "https://www.news18.com/*/*/"
  
        // ];
        // // const regex = new RegExp("^" + "https://www.thehindu.com/*/*".replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*") + "$");
        // let is_matching = false;
        // for (const news_site of news_article_list)
        // {
        //   const regex = new RegExp("^" + news_site.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*") + "$");
        //   is_matching = regex.test(selected_text)
        //   if(is_matching){
        //     console.log("matching")
        //     sendMessageToBackend(selected_text, null, "news_site");
        //     break;
        //   }

        // }
        // if(!is_matching)
        // {
        //   console.log("not matching")
        //   showResult({result:"Our Extension doesnt support this URL currently"});
        // }
        const ismatched = /^https:\/\/(www\.)?(hindustantimes\.com|thehindu\.com|timesofindia\.indiatimes\.com|deccanchronicle\.com|foxnews\.com|washingtonexaminer\.com|tmz\.com|latimes\.com|theguardian\.com|scotsman\.com|indianexpress\.com|indiatoday\.in|ndtv\.com|news18\.com)\/.*\/.*$/.test(selectedText)
        if(ismatched)
        {
            console.log("matching")
            // sendMessageToBackend(selected_text, null, "news_site",true);
            const dataToSend = {
              text_content:selectedText,
              image_src:undefined,
              social_media:"whatsapp",
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
      else 
      {
        console.log("not inside url")
        // if(children)
        const selectedNode = selection.anchorNode;
        console.log("Selected node is:", selectedNode);
        const number = selectedNode.parentElement.parentElement;
        let image_text="";
        console.log(number.childElementCount)
        if(selectedNode.childNodes[1] && number.childElementCount === 3) // hits for img with text
        {
          console.log("first if")
          image_text = selectedNode.parentElement.nextSibling.childNodes[0].childNodes[0].textContent;
          // console.log("Selected text is :",text);
        }  /////////////////////////////   changed here
        // if(selectedNode.childNodes[0].nodeName!=="SPAN")   
        // {
          if (selectedNode.childNodes[1]) { 
            console.log("second if")
            // console.log("safffs:",selectedNode.childNodes[1])
            let child = selectedNode.childNodes[0];
            // console.log(number)
            if (child.nodeName === "IMG") {
              console.log("third if") // doesnot hit for firefox
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
                const dataToSend = {
                  text_content:image_text,
                  image_src:dataURL,
                  social_media:"whatsapp",
                  is_url:false
                };
                console.log('sending message of image',dataToSend);
                browser.runtime.sendMessage(dataToSend);
                // sendMessageToBackend(image_text, dataURL, "whatsapp");
                // console.log("Converted Data URL:", dataURL);
              };
              reader.readAsDataURL(recoveredBlob);
            };
            xhr.open("GET", blobURL);
            xhr.send();
          }
        // }
        // }
        // else if(selectedNode.childNodes[0].nodeName==="SPAN")
        else
        {
          // console.log("Selected text is :", selectedText);
          console.log("last else needed")
          // sendMessageToBackend(selectedText, undefined, "whatsapp");
          const dataToSend = {
            text_content:selectedText,
            image_src:undefined,
            social_media:"whatsapp",
            is_url:false
          };
          console.log('sending message of text',dataToSend);
          browser.runtime.sendMessage(dataToSend);
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


////////
function showResult(data){
  let notification = document.createElement('div');
  notification.className = 'custom-notification';
  let result;
  // console.log(parseFloat(data));
  console.log(data);
  // console.log(typeof data);
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