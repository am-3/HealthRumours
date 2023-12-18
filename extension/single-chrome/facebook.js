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
