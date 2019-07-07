import React from 'react';
import logo from './logo.svg';
import './Main.css';
import ws, { isReady } from './websocket';
import { getData, setData, supported } from './global';

class Main extends React.Component {
  constructor(props) {
    super(props);

    const hours = new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours();
    const minutes = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
    this.state = {
      time: `${hours}:${minutes}`,
      launched: {
        id: getData().id,
        data: {
          title: '',
          elapsed: 0,
          total: 0,
          progress: 0,
          playing: false,
        },
      },
    };
  }


  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000,
    );

    this.timerIDData = setInterval(() => this.GetData(), 500);
  }

  tick() {
    const hours = new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours();
    const minutes = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
    this.setState({
      time: `${hours}:${minutes}`,
    });
  }

  GetData() {
    // console.log(getData().id);
    if (!isReady || getData().id === -1) {
      // console.log('MSGDGS');
      this.GetAudibleTab();
      return;
    }

    if (getData().id === undefined) {
      // console.log('sadmOIASNd');
      this.GetAudibleTab();
      return;
    }

    // this.ws.send('GetData');
    ws().onmessage = (function (that) {
      return function (ev) {
        let msg = ev.data;
        // console.log(msg);

        if (msg.startsWith('[Browser]')) {
          msg = msg.replace('[Browser]', '');
          // console.log(msg);
          if (msg == 'undefined') {
            that.GetAudibleTab();
            return;
          }
          const tabData = JSON.parse(msg);

          that.setState({
            launched: {
              id: getData().id,
              data: {
                title: tabData.title,
                elapsed: tabData.elapsed,
                total: tabData.total,
                progress: tabData.progress,
                playing: tabData.playing,
              },
            },
          });
          ws().onmessage = '';
        }
      };
    }(this));

    ws().send(`GetTab ;; ${getData().id}`);
  }

  GetAudibleTab() {
    if (!isReady) { return; }

    // this.ws.send('GetData');
    ws().onmessage = (function (setData2) {
      return function (ev) {
        let msg = ev.data;
        // console.log(msg);

        if (msg.startsWith('[Server]')) {
          msg = msg.replace('[Server]', '');
          const tabs = JSON.parse(msg);

          for (let index = 0; index < tabs.length; index++) {
            const tab = tabs[index];
            const check = supported.filter(x => tab.url.indexOf(x) > -1);
            if (tab.audible && tab.url.indexOf('127.0.0.1') < 0 && check.length > 0) {
              console.log(tab.id);
              setData2({ id: tab.id });
              return;
            }
          }

          setData2({ id: -1 });

          // ws().onmessage = '';
        }
      };
    }(setData));

    ws().send('GetTabs');
  }

  Pause(state) {
    if (state == 'true') {
      ws().send(`Pause ;; ${getData().id}`);
    } else {
      ws().send(`Play ;; ${getData().id}`);
    }
  }

  Next() {
    ws().send(`Next ;; ${getData().id}`);
  }

  Prev() {
    ws().send(`Prev ;; ${getData().id}`);
  }

  GetPlayPauseIcon() {
    if (this.state.launched.data.playing) {
      return (
        <i className="material-icons" style={{ fontSize: '4vh' }} onClick={(() => { this.Pause('true'); })}>
          pause
        </i>
      );
    }
    return (
      <i className="material-icons" style={{ fontSize: '4vh' }} onClick={(() => { this.Pause('false'); })}>
        play_arrow
      </i>
    );
  }

  render() {
    return (
      <div className="App-header">
        <h1 style={{ fontSize: '3em', marginBottom: '5px' }}>{this.state.time}</h1>
        <p style={{ margin: '0', fontSize: 'small' }}>{this.state.launched.data.title}</p>
        <div style={{
          width: '25vw', background: '#bab5a1', height: '1.5vh', textAlign: 'center',
        }}
        >
          <div style={{
            background: '#454138', width: `${this.state.launched.data.progress}%`, color: '#bab5a1', height: '100%', fontSize: '1.5vh', overflow: 'hidden',
          }}
          />
          <p style={{ margin: '0', fontSize: 'small' }}>{`${this.state.launched.data.elapsed} / ${this.state.launched.data.total}`}</p>
        </div>
        <div style={{ display: 'flex', marginTop: '15px' }}>
          <div style={{ cursor: 'pointer' }}>
            <i className="material-icons" style={{ fontSize: '4vh' }} onClick={(() => { this.Prev(); })}>
              skip_previous
            </i>
          </div>
          <div style={{ cursor: 'pointer' }}>
            {this.GetPlayPauseIcon()}
          </div>
          <div style={{ cursor: 'pointer' }}>
            <i className="material-icons" style={{ fontSize: '4vh' }} onClick={(() => { this.Next(); })}>
              skip_next
            </i>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
