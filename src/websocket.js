let ws = new WebSocket('ws://127.0.0.1:8080');
let isReady = false;

function onOpen() {
  if (window.timerID) {
    window.clearInterval(window.timerID);
    window.timerID = 0;
  }
  console.log(ws.readyState);
  isReady = true;
}

function onClose() {
  isReady = false;
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
    }, 5000);
  }
}

function getWs() {
  return ws;
}

ws.onclose = onClose;
ws.onopen = onOpen;


export default getWs;
export { isReady };
