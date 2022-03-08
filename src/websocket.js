'use strict';

const fs = require('fs');
const WebSocket = require('ws');
const https = require('https');

const privateKey = fs.readFileSync('/root/back_end/letsencrypt/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/root/back_end/letsencrypt/cert.pem', 'utf8');
const ca = fs.readFileSync('/root/back_end/letsencrypt/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

const server = https.createServer(credentials);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws, req, client) => {
  console.log('New connection in WS');

  ws.on('message', (msg) => {
    console.log(
      `Received Message ${msg}. \n From ${JSON.stringify(
        req.headers['deviceid']
      )}`
    );
    const time = new Date().toISOString();
    fs.appendFile('./logs/messageLogs.txt', `${time} ->  ${msg} \n`, (err) => {
      if (err) {
        console.error(`Websocket 'on message' Error: ${err.message || err}`);
        throw err;
      }
    });
  });

  ws.on('data', (data) => {
    console.log('Received data ' + data.toString);
    const time = new Date().toISOString();
    fs.appendFile('./logs/dataLogs.txt', `${time} ->  ${msg} \n`, (err) => {
      if (err) {
        console.error(`Websocket 'on data' Error: ${err.message || err}`);
        throw err;
      }
    });
  });
});

server.listen(1337, () => {
	console.log('HTTPS Server running on port 1337');
});
