// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


// example of using a message handler from the inject scripts

let ws = new WebSocket('ws://127.0.0.1:8080');

function onOpen() {
  if (window.timerID) {
    window.clearInterval(window.timerID);
    window.timerID = 0;
  }
  console.log(ws.readyState);
  ws.send('[Browser]Online');
}

function onMessage(msg) {
  if (msg.data === '[Server]Online') {
    CheckTabs();
  }

  const cmds = msg.data.split(' ;; ');
  cmds.map(s => s.trim());
  switch (cmds[0]) {
    case 'GetTab': {
      if (ws.readyState !== 1) { return; }

      const tabId = Number(cmds[1]);

      chrome.tabs.sendMessage(tabId, { cmd: 'GetData' }, (response) => {
        console.log(response);
        ws.send(`[Browser]${JSON.stringify(response)}`);
      });
      break;
    }

    case 'Mute': {
      const tabId = Number(cmds[1]);
      const state = cmds[2] == 'true';
      console.log('Setting state of', tabId, 'to', state);
      chrome.tabs.update(tabId, { muted: state });
      break;
    }

    case 'Pause': {
      const tabId = Number(cmds[1]);
      chrome.tabs.sendMessage(tabId, { cmd: 'Pause' }, (response) => {
      });
      break;
    }

    case 'Play': {
      const tabId = Number(cmds[1]);
      chrome.tabs.sendMessage(tabId, { cmd: 'Play' }, (response) => {
      });
      break;
    }

    case 'Next': {
      const tabId = Number(cmds[1]);
      chrome.tabs.sendMessage(tabId, { cmd: 'Next' }, (response) => {
      });
      break;
    }

    default:
      break;
  }
}

function onClose() {
  console.log('WEBSOCKET CLOSED!');
  // ws.close();
  ws = null;
  // ws = new WebSocket('ws://127.0.0.1:8080');

  if (!window.timerID) {
    window.timerID = setInterval(() => {
      console.log('Trying to start WS');
      ws = new WebSocket('ws://127.0.0.1:8080');
      ws.onclose = onClose;
      ws.onopen = onOpen;
      ws.onmessage = onMessage;
      ws.onerror = onError;
    }, 5000);
  }
}

function onError() {
  if (window.timerID) {
    window.clearInterval(window.timerID);
    window.timerID = 0;
  }

  ws = null;
  // ws = new WebSocket('ws://127.0.0.1:8080');

  if (!window.timerID) {
    window.timerID = setInterval(() => {
      console.log('Trying to start WS');
      ws = new WebSocket('ws://127.0.0.1:8080');
      ws.onclose = onClose;
      ws.onopen = onOpen;
      ws.onmessage = onMessage;
      ws.onerror = onError;
    }, 5000);
  }
}

ws.onclose = onClose;
ws.onopen = onOpen;
ws.onmessage = onMessage;
ws.onerror = onError;

chrome.extension.onMessage.addListener(
  (request, sender, sendResponse) => {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  },
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text === 'what is my tab_id?') {
    sendResponse({ tab: sender.tab.id });
  }
});

function CheckTabs() {
  if (ws.readyState !== 1) { return; }
  chrome.tabs.query({}, (tabs) => {
    console.log(tabs);
    ws.send(`Data ;; ${JSON.stringify(tabs)}`);
  });
}

chrome.tabs.onCreated.addListener((tab) => {
  if (ws.readyState !== 1) { return; }
  console.log('New tab');
  ws.send(`NewData ;; ${JSON.stringify(tab)}`);
});

chrome.tabs.onRemoved.addListener((tabID) => {
  if (ws.readyState !== 1) { return; }
  console.log('Del tab');
  ws.send(`DelData ;; ${(tabID)}`);
});

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
  if (ws.readyState !== 1) { return; }
  console.log('Edit tab');
  ws.send(`EditData ;; ${tabID} ;; ${JSON.stringify(tab)}`);
});
