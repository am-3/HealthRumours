chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function () {
      console.clear();
      const selection = window.getSelection();

      if (selection && selection.toString()) {
        const selectedText = selection.toString();

        const isUrl = /^https?:\/\//.test(selectedText);

        if (isUrl) {
          const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(selectedText)}`;
          fetch(proxyUrl)
            .then(response => response.text())
            .then(htmlContent => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = htmlContent;

              // Select all div elements
              const divs = tempDiv.querySelectorAll('div');

              let maxContentLength = 0;
              let selectedDivContent = '';

              // Loop through each div to find the one with the most text content
              divs.forEach(div => {
                const textContent = div.innerText || div.textContent;
                const contentLength = textContent.length;

                if (contentLength > maxContentLength) {
                  maxContentLength = contentLength;
                  selectedDivContent = textContent;
                }
              });

              console.log(selectedDivContent);
            })
            .catch(error => {
              console.error("Error fetching content:", error);
            });

        } else {
          console.log("Selected text is not a valid URL.");
        }
      } else {
        console.log("No text selected.");
      }
    }
  });
});