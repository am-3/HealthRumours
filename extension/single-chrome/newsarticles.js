setTimeout(extractnew, 5000);

function extractnew() {

    function countWords(text) {
        if (text) {
            let words = text.trim().split(/\s+/);
            return words.length;
        }
        else {
            return 0;
        }
    }

    const htmlheight = parseFloat(window.getComputedStyle(document.body).getPropertyValue("height"));
    let maxHeight = 0;
    let req_div = null;

    var allSectionsAndDivs = document.querySelectorAll("section, div");
    var header = document.querySelector("header");
    var footer = document.querySelector("footer");

    var elementsOutsideHeaderFooter = [];

    allSectionsAndDivs.forEach((element) => {
        if ((!header || !header.contains(element)) && (!footer || !footer.contains(element))) {
            elementsOutsideHeaderFooter.push(element);
        }
    });

    var divs = elementsOutsideHeaderFooter;


    divs.forEach((div) => {
        const computedHeight = window.getComputedStyle(div).getPropertyValue("height");
        const height = parseFloat(computedHeight);
        if (height > maxHeight) {
            maxHeight = height;
            req_div = div;
        }
    });

    console.log("Req_div:");
    console.log(req_div);

    const excludeRegex = /(publish-time|caption|sec-|related-topics-list|breadcrumbs|mgid_second_mrec_parent|leftNav|rgtAdSection|followHT|about\-authors|trc_rbox_container|author\-news|time\-list|hide-mobile|list|ob\-cards|OUTBRAIN|blogroll|widget\-loaded|custom_ad)/;

    function traverseChildren(element) {
        const children = element.children;
        if (children.length === 0) {
            if (element.tagName !== "IMG") {
                if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script" && element.tagName.toLowerCase() !== "style") {
                    let index = element.innerText.toLowerCase().indexOf('also read');
                    if (index !== -1) {
                        let substring = element.innerText.substring(0, index);
                        if (substring) {
                            console.log(substring.trim());
                        }
                    }
                    else {
                        console.log(element.innerText.trim());
                    }
                }
            }
            else {
                let url = element.src;
                console.log(url);
            }
        }
        else {
            tagArray = ["a", "i", "strong", "b", "style"];
            for (let i = 0; i < children.length; i++) {
                const hasExcludedClass = Array.from(children[i].classList).some(className => excludeRegex.test(className));
                if (!hasExcludedClass) {
                    if (!tagArray.includes(children[i].tagName.toLowerCase())) {
                        traverseChildren(children[i]);
                    }
                    else {
                        if (countWords(element.innerText) > 20 && element.tagName.toLowerCase() !== "script") {
                            let index = element.innerText.toLowerCase().indexOf('also read');
                            if (index !== -1) {
                                let substring = element.innerText.substring(0, index);
                                if (substring) {
                                    console.log(substring.trim());
                                }
                            }
                            else {
                                // console.log(element.classList.toString());
                                console.log(element.innerText.trim());
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    if (req_div) {
        const childrenOfReqDiv = req_div.children;
        for (let i = 0; i < childrenOfReqDiv.length; i++) {
            const hasExcludedClass = Array.from(childrenOfReqDiv[i].classList).some(className => excludeRegex.test(className));
            if (!hasExcludedClass) {
                traverseChildren(childrenOfReqDiv[i]);
            }
        }
    }

    console.log("Max height of divs:", maxHeight);

}