const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const os = require('os-utils');

const app = express();
const port = 8081;

const wss = new WebSocket.Server({ port: 8080 });

const Data = {
  tabs: [],
  system: {},
};

const seperator = ' ;; ';

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    ProcessData(message, ws);
  });

  ws.send('[Server]Online');
});

/**
 * @param {WebSocket} ws - The date
 * @param {string} msg - The string
 */
function ProcessData(msg, ws) {
  const msgSplit = msg.split(seperator);
  msgSplit.map(s => s.trim());
  switch (msgSplit[0]) {
    case 'DelData': {
      const tabId = Number(msgSplit[1]);

      // Data.tabs.push(msgData);

      // console.log(Data.tabs);
      // console.log(tabId);
      const index = Data.tabs.findIndex(x => x.id === tabId);
      // console.log(index);
      // console.log('Deleting:', Data.tabs[index]);
      Data.tabs.splice(index, 1);
      break;
    }

    case 'EditData': {
      const tabId = Number(msgSplit[1]);
      const msgData = JSON.parse(msgSplit[2]);
      const index = Data.tabs.findIndex(x => x.id === tabId);
      Data.tabs[index] = msgData;
      break;
    }

    case 'NewData': {
      const msgData = JSON.parse(msgSplit[1]);

      Data.tabs.push(msgData);
      break;
    }

    case 'Data': {
      const msgData = JSON.parse(msgSplit[1]);

      Data.tabs = msgData;
      break;
    }

    case 'GetTabs': {
      ws.send(`[Server]${JSON.stringify(Data.tabs)}`);
      // console.log('Send Data Back!');
      break;
    }

    case 'GetSystem': {
      ws.send(`[Server]${JSON.stringify(Data.system)}`);
      // console.log('Send Data Back!');
      break;
    }

    case '[Browser]Online':
      console.log('Browser is back Online');
      ws.send('[Server]Online');
      break;

    default:
      break;
  }
}

function UpdateSystemData() {
  os.cpuUsage((usage) => {
    const usagePercantage = (usage * 100).toFixed(2);
    // console.log(usagePercantage);
    Data.system.cpuUsage = usagePercantage;
  });

  Data.system.freeMemPercentage = (os.freememPercentage() * 100).toFixed(2);
  Data.system.totalMemory = (os.totalmem() / 1024).toFixed(2);
  Data.system.usedMemory = (os.totalmem() / 1024 - os.freemem() / 1024).toFixed(2);
}

setInterval(() => {
  UpdateSystemData();
}, 1000);


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
