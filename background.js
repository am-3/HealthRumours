// chrome.action.onClicked.addListener(function (tab) {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: function () {
//       const allText = document.body.innerHTML;
//       alert('hi inside on click')
//       console.log("Text extracted from the page:", allText);
//     }
//   });
// });

chrome.action.onClicked.addListener(function(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function() {
      // Function to extract content between specific tags and return as an array
      function extractContentByTag(tag) {
        const elements = document.getElementsByTagName(tag);
        const contentArray = Array.from(elements).map(element => element.innerText);
        return contentArray;
      }

      // Extract content by tags (modify/add tags as needed)
      const paragraphs = extractContentByTag('p');
      const h1Items = extractContentByTag('h1');
      const h2Items = extractContentByTag('h2');
      const h3Items = extractContentByTag('h3');
      const h4Items = extractContentByTag('h4');
      const h5Items = extractContentByTag('h5');
      const h6Items = extractContentByTag('h6');
      const aItems = extractContentByTag('a');
      // const anchorItems = extractContentByTag('a');

      // Function to print array content separately with a newline after each element
      function printArrayContentWithNewline(array) {
        for (let i = 0; i < array.length; i++) {
          if(array[i]!='')
          {
            console.log(array[i]);
            if (i !== array.length - 1) {
              console.log('\n'); // Print newline after each element except the last one
            }
          }
         
        }
      }

      // Print content of paragraphs and list items separately with newlines
      console.log('Paragraphs:');
      printArrayContentWithNewline(paragraphs);
      console.log('h1:');
      printArrayContentWithNewline(h1Items);
      console.log('h2:');
      printArrayContentWithNewline(h2Items);
      console.log('h3:');
      printArrayContentWithNewline(h3Items);
      console.log('h4:');
      printArrayContentWithNewline(h4Items);
      console.log('h5:');
      printArrayContentWithNewline(h5Items);
      console.log('h6:');
      printArrayContentWithNewline(h6Items);
      console.log('anchor tags:');
      printArrayContentWithNewline(aItems);

      // console.log('List Items:');
      // printArrayContentWithNewline(listItems);
      // console.log('anchor Items:');
      // printArrayContentWithNewline(anchorItems);
      // Add more similar lines to print content by other tags if needed
    }
  });
});




chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function () {
      function extractTextFromParagraphs(paragraphs) {
        let text = '';

        paragraphs.forEach((p) => {
          text += p.textContent + '\n';
        });

        return text;
      }

      const paragraphs = document.querySelectorAll('p');
      const paragraphText = extractTextFromParagraphs(paragraphs);

      if (paragraphText.trim() !== '') {
        console.log("Text extracted from the paragraphs on the page:", paragraphText);
      } else {
        console.log("No paragraph text content found on the page.");
      }
    }
  });
});



