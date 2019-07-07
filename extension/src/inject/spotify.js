const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log('Site finished Loading');
    // ----------------------------------------------------------
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      // console.log('Got MSG:', message);

      const cmd = String(message.cmd);
      switch (cmd) {
        case 'Pause':
          Pause();
          break;

        case 'Play':
          Play();
          break;

        case 'Next':
          Next();
          break;

        case 'Prev':
          Prev();
          break;

        case 'GetData': {
          const data = GetData();
          // console.log(data);
          sendResponse(data);
          break;
        }

        default:
          break;
      }
    });
  }
}, 10);

function GetData() {
  const timeElapsed = document.querySelectorAll('.playback-bar__progress-time')[0].innerText;
  // const minElapsed = Math.floor(timeElapsed / 60);
  // const secElapsed = Math.floor(timeElapsed % 60);

  const timeTotal = document.querySelectorAll('.playback-bar__progress-time')[1].innerText;
  // const minTotal = Math.floor(timeTotal / 60);
  // const secTotal = Math.floor(timeTotal % 60);

  let timeElapsedSec = 0;
  const timeElapsedSplit = timeElapsed.split(':');
  for (let index = 0; index < timeElapsedSplit.length; index++) {
    const times = 60 ** (timeElapsedSplit.length - 1 - index);
    if (times > 0) {
      timeElapsedSec += Number(timeElapsedSplit[index]) * times;
    } else {
      timeElapsedSec += Number(timeElapsedSplit[index]);
    }
  }

  let timeTotalSec = 0;
  const timeTotalSplit = timeTotal.split(':');
  for (let index = 0; index < timeTotalSplit.length; index++) {
    const times = 60 ** (timeTotalSplit.length - 1 - index);
    if (times > 0) {
      timeTotalSec += Number(timeTotalSplit[index]) * times;
    } else {
      timeTotalSec += Number(timeTotalSplit[index]);
    }
  }

  const progress = ((timeElapsedSec / timeTotalSec) * 100).toFixed(2);

  const data = {
    title: document.querySelector('.track-info.ellipsis-one-line').innerText.replace('\n', ' - '),
    elapsed: `${timeElapsed}`,
    total: `${timeTotal}`,
    progress,
    playing: document.querySelectorAll('.control-button[title=Pause]').length > 0,
  };

  // console.log('DATA');
  // console.log(data);

  return data;
}

function Pause() {
  document.querySelectorAll('.control-button.spoticon-pause-16')[0].click();
}

function Play() {
  document.querySelectorAll('.control-button.spoticon-play-16')[0].click();
}

function Next() {
  document.querySelectorAll('.control-button.spoticon-skip-forward-16')[0].click();
}

function Prev() {
  document.querySelectorAll('.control-button.spoticon-skip-back-16')[0].click();
}
