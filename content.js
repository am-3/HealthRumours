// const allText = document.body.innerText;

// // Log the text content to the console
// console.log("Text extracted from the page:", allText);

// function extractContentByTag(tag) {
//     const elements = document.getElementsByTagName(tag);
//     const contentArray = Array.from(elements).map(element => element.innerText);
//     return contentArray;
//   }


//   function printArrayContentWithNewline(array,tag) {
//     for (let i = 0; i < array.length; i++) {
//       if(array[i]!='')
//       {
//         console.log(tag);
//         console.log(array[i]);
//         if (i !== array.length - 1) {
//           console.log('\n'); 
//         }
//       }
     
//     }
//   }

//   const paragraphs = extractContentByTag('p');
//   const spans = extractContentByTag('span');
//   const h1Items = extractContentByTag('h1');
//   const h2Items = extractContentByTag('h2');
//   const h3Items = extractContentByTag('h3');
//   const h4Items = extractContentByTag('h4');
//   const h5Items = extractContentByTag('h5');
//   const h6Items = extractContentByTag('h6');
//   const aItems = extractContentByTag('a');


 

//   console.log('Paragraphs:');
//   printArrayContentWithNewline(paragraphs,'para');
//   console.log('Spans:');
//   printArrayContentWithNewline(spans,'span');
//   console.log('h1:');
//   printArrayContentWithNewline(h1Items,'h1');
//   console.log('h2:');
//   printArrayContentWithNewline(h2Items,'h2');
//   console.log('h3:');
//   printArrayContentWithNewline(h3Items,'h3');
//   console.log('h4:');
//   printArrayContentWithNewline(h4Items,'h4');
//   console.log('h5:');
//   printArrayContentWithNewline(h5Items,'h5');
//   console.log('h6:');
//   printArrayContentWithNewline(h6Items,'h6');
//   console.log('anchor tags:');
//   printArrayContentWithNewline(aItems,'anchor');



function extractTextFromParagraphs(paragraphs) {
    let text = '';
    
    paragraphs.forEach((p) => {
        // alert('hi')
      text += p.textContent + '\n';
    });

    return text;
  }

  const paragraphs = document.querySelectorAll('p');
  const paragraphText = extractTextFromParagraphs(paragraphs);

  if (paragraphText.trim() !== '') {
    console.clear();
    console.log("Text extracted from the paragraphs on the page:", paragraphText);
  } else {
    console.clear();
    console.log("No paragraph text content found on the page.");
  }


// chrome.action.onClicked.addListener(function (tab) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: function () {
//         function extractTextFromParagraphs(paragraphs) {
//           let text = '';
  
//           paragraphs.forEach((p) => {
//             text += p.textContent + '\n';
//           });
  
//           return text;
//         }
  
//         const paragraphs = document.querySelectorAll('p');
//         const paragraphText = extractTextFromParagraphs(paragraphs);
  
//         if (paragraphText.trim() !== '') {
//           console.log("Text extracted from the paragraphs on the page:", paragraphText);
//         } else {
//           console.log("No paragraph text content found on the page.");
//         }
//       }
//     });
//   });