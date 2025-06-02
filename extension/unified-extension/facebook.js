// Polyfill for cross-browser compatibility
if (typeof browser === 'undefined') {
    var browser = chrome;
}
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

            if (srcurl!==null && ( content !== null || img != null)) {
                sendData(srcurl, content, imgurl)
                .then(result => {
                    console.log("Result is: " + result.result);
                    posts[i].style.border="solid green";
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    }

}

function sendData(srcURL, articleContent_value, imageURL_value) {
    return new Promise((resolve, reject) => {
        const data = {
            sourceURL: srcURL,
            articleContent: articleContent_value,
            imageURL: imageURL_value,
            platformName: "Facebook"
        }

        chrome.runtime.sendMessage({ action: 'getToken' }, output => {
            const accessToken = output.result;
            fetch('http://mn127.iiitt.ac.in/insertFacebook/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Host': 'http://mn127.iiitt.ac.in/insertFacebook/',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    resolve(data); // Resolve the promise with the data
                })
                .catch((error) => {
                    console.error('Error: ', error);
                    reject(error); // Reject the promise with the error
                });
        });
    });
}
setTimeout(scrapeContentFromPage, 5000);
window.addEventListener('scroll', scrapeContentFromPage);
