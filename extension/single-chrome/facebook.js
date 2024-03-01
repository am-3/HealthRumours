function scrapeContentFromPage() {
    console.clear();

    let posts = document.querySelector('div[role="feed"]').querySelector('div').children;

    if (posts) {
        for (let i = 0; i < posts.length - 1; i++) {
            let srcurl = null;
            let content = null;
            let imgurl = null;

            let user = posts[i].querySelector('span > a span');
            if (user) {
                srcurl = user.innerText;
                // console.log(user.innerText);
            }


            let x = posts[i].querySelector('div[dir="auto"]'); //post content

            if (x && x.innerText !== '') {
                content = x.innerText;
                // console.log(x.innerText);
            }



            let img = posts[i].querySelector('div > img');
            if (img && img.getAttribute("role") === null) {
                imgurl = img.src;
                // console.log(img.src);
            }

            if (srcurl!==null || content !== null || img != null) {
                sendData(srcurl, content, imgurl);
                // console.log("POST\n");
            }
        }
    }

}

function sendData(srcURL, articleContent_value, imageURL_value) {
    const data = {
        sourceURL: srcURL,
        articleContent: articleContent_value,
        imageURL: imageURL_value,
        platformName: "Twitter"
    }
    chrome.runtime.sendMessage({ action: 'getToken' }, output => {
        const accessToken = output.result;
        fetch('http://127.0.0.1:8000/insertSocial/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Host': 'http://127.0.0.1:8000/insertSocial/',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    });

}
setTimeout(scrapeContentFromPage, 5000);
window.addEventListener('scroll', scrapeContentFromPage);
