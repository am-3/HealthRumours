// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(cors());

// // for every incoming HTTP request, 
// // the CORS middleware will be applied before reaching the specific route handler.
// app.get('/proxy', async (req, res) => {
//   const url = req.query.url;

//   if (!url) {
//     return res.status(400).json({ error: 'Missing URL parameter' });
//   }

//   try {
//     const response = await axios.get(url);
//     res.send(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching content' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Proxy server listening at http://localhost:${port}`);
// });


const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;
let server;

app.use(cors());

app.get('/proxy', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching content' });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "startServer") {
        // Start the server
        server = app.listen(port, () => {
            console.log(`Proxy server listening at http://localhost:${port}`);
            sendResponse({ success: true });
        });
    } else if (request.action === "stopServer") {
        // Stop the server
        if (server) {
            server.close(() => {
                console.log('Proxy server stopped');
                sendResponse({ success: true });
            });
        } else {
            sendResponse({ success: true }); // Already stopped
        }
    }

    return true;
});
