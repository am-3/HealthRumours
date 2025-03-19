// Polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
    var browser = chrome;
}


function sendMessageToBackend(article_title,article_content,image_url,src_url) {
    const data = {
        source_url: src_url,
        article_title: article_title,
        article_content: article_content,
        image_url: image_url
      }
      chrome.runtime.sendMessage({ action: 'getToken' }, output => {
        const accessToken = output.result;
        fetch('http://127.0.0.1:8000/insertNews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Host': 'http://127.0.0.1:8000/insertNews/',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            showResult(data);
          })
          .catch((error) => {
            console.error('Error: ', error);
          });
      });
}
console.clear();
console.log("injected");
setTimeout(extractContent,3000)
function extractContent(){
    console.log("function injected");

    let src_url = window.location.href;
    let article_title = "Title";
    document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-1.sc-157agsr-2.bDcOAo.ivPAJA > div.sc-9tztzq-3.jaiIvZ > header > h1")
    if (document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-1.sc-157agsr-2.bDcOAo.ivPAJA > div.sc-9tztzq-3.jaiIvZ > header > h1").textContent) {

        article_title = document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-1.sc-157agsr-2.bDcOAo.ivPAJA > div.sc-9tztzq-3.jaiIvZ > header > h1").textContent;
      }
    let article_content = "";
    let image_url = "";
    if(document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-0.kQaSNa > main > div > div > div.sc-xs32fe-0.dRLCjE.js_post-content > div > p").textContent){
        article_content = document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-0.kQaSNa > main > div > div > div.sc-xs32fe-0.dRLCjE.js_post-content > div > p").textContent;
    }
    if(document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-0.kQaSNa > main > div > div > div.sc-xs32fe-0.dRLCjE.js_post-content > figure > div > span > div.sc-1eow4w5-3.hGpdBg > picture > img"))
    {
        image_url = document.querySelector("body > div:nth-child(3) > div.sc-101yw2y-8 > div.sc-157agsr-0.kQaSNa > main > div > div > div.sc-xs32fe-0.dRLCjE.js_post-content > figure > div > span > div.sc-1eow4w5-3.hGpdBg > picture > img").src;
    }
    console.log("title: ", article_title);
    console.log("content: ", article_content);
    console.log("url: ", image_url);
    sendMessageToBackend(article_title,article_content,image_url,src_url);
}
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