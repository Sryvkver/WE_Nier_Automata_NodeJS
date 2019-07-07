const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval);

    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    console.log('Site finished Loading');
    // ----------------------------------------------------------

    const timeScript = document.createElement('script');
    timeScript.innerHTML = `(${(() => {
      const ele = document.createElement('div');
      ele.style.visibility = 'hidden';
      ele.setAttribute('data-curTime', 0);
      ele.setAttribute('data-totTime', 0);
      ele.setAttribute('id', 'TimeElement');
      document.body.appendChild(ele);

      setInterval(() => {
        try {
          const curTime = document.querySelector('video').getCurrentTime();
          const totTime = document.querySelector('video').getDuration();
          ele.setAttribute('data-curTime', curTime);
          ele.setAttribute('data-totTime', totTime);
        } catch (error) {

        }
      }, 100);
    }).toString()})()`;
    document.body.appendChild(timeScript);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      // console.log('Got MSG:', message);

      const cmd = String(message.cmd);
      switch (cmd) {
        case 'Pause':
          PauseVideo();
          break;

        case 'Play':
          PlayVideo();
          break;

        case 'Next':
          NextVideo();
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
  const timeElapsed = document.querySelector('#TimeElement').getAttribute('data-curTime');
  const minElapsed = Math.floor(timeElapsed / 60);
  const secElapsed = Math.floor(timeElapsed % 60);

  const timeTotal = document.querySelector('#TimeElement').getAttribute('data-totTime');
  const minTotal = Math.floor(timeTotal / 60);
  const secTotal = Math.floor(timeTotal % 60);

  const progress = Math.round((timeElapsed / timeTotal) * 100);

  const data = {
    title: document.querySelector('#container > h1 > yt-formatted-string').innerText,
    elapsed: `${minElapsed < 10 ? `0${minElapsed}` : minElapsed}:${secElapsed < 10 ? `0${secElapsed}` : secElapsed}`,
    total: `${minTotal < 10 ? `0${minTotal}` : minTotal}:${secTotal < 10 ? `0${secTotal}` : secTotal}`,
    progress,
    playing: !document.querySelector('video').paused,
  };

  // console.log('DATA');
  // console.log(data);

  return data;
}

function GetData2() {
  const timeElapsed = document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-current').innerText;
  // const minElapsed = Math.floor(timeElapsed / 60);
  // const secElapsed = Math.floor(timeElapsed % 60);

  const timeTotal = document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-duration').innerText;
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

  const progress = Math.round((timeElapsedSec / timeTotalSec) * 100);

  const data = {
    title: document.querySelector('#container > h1 > yt-formatted-string').innerText,
    elapsed: `${timeElapsed}`,
    total: `${timeTotal}`,
    progress,
    playing: !document.querySelector('video').paused,
  };

  // console.log('DATA');
  // console.log(data);

  return data;
}

function PauseVideo() {
  document.querySelector('video').pause();
}

function PlayVideo() {
  document.querySelector('video').play();
}

function NextVideo() {
  document.querySelector('.ytp-next-button.ytp-button').click();
}
