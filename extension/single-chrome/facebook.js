<<<<<<< HEAD
prev = "first";
count = 0;

function scrapeContentFromPage() {
 
    let para = document.querySelectorAll('div, img'); // Adjust for other elements containing paragraphs

    let paragraphTexts = Array.from(para).map(p => {
		if(p.tagName === 'DIV'){
			return p.innerText;
		}
		else{
			return p.src;
		}
	});
	let flag = true;
	let finalArray = [];
	paragraphTexts.forEach(element => {
		if(flag){
			if(element === 'Terms of Service'){
				flag = false;
			}
			else if( typeof element === 'string' ){
				if (element.length > 5){
					if(prev === element){
						finalArray.push("Post " + count);
						count += 1;
					}
					else{
						finalArray.push(element);
					}
				}
			}
		}
		else{
			if(element == 'Following'){
				flag = true;
			}
		}
		prev = element;
	});

    chrome.runtime.sendMessage({paragraphs: finalArray});
}

setTimeout(scrapeContentFromPage, 5000);
=======
function scrapeContentFromPage() {
    console.clear();
 
    let posts=document.querySelector('div[role="feed"]').querySelector('div').children;

    for(let i=0;i<posts.length - 1;i++)
    {
        let user=posts[i].querySelector('span > a span');
        if(user !== null)
        {
            console.log(user.innerText);
        }


        let x=posts[i].querySelectorAll('div[dir="auto"]'); //post content

        let paragraphs=Array.from(x).map(p=> {
            return p.innerText;
        });

        prev="first";

        if(paragraphs !== null && paragraphs.length !== 0) {
                 paragraphs.forEach((paragraph) => {
                    if(paragraph.length > 1){
                        if(prev!==paragraph)
                        {
                            console.log(paragraph);
                        }
                        prev=paragraph;
                    }
                });
             }
        

        let img=posts[i].querySelector('div > img');
        if(img !== null)
        {
            console.log(img.src);
            console.log("POST\n");
        }
        
    }
}
setTimeout(scrapeContentFromPage, 5000);
window.addEventListener('scroll', scrapeContentFromPage);
>>>>>>> 0f7b6e900c805d8de35eb3d0e069af570be41d9f
