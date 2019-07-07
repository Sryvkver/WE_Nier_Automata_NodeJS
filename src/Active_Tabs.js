import React from 'react';
import logo from './logo.svg';
import ws, { isReady } from './websocket';
import { getData, setData, supported } from './global';

import './Active_Tabs.css';

class ActiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{}],
      launched: {},
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.getTabs(),
      500,
    );
  }

  async getTabs() {
    if (!isReady) { return; }

    // this.ws.send('GetData');
    ws().onmessage = (function (that) {
      return function (ev) {
        let msg = ev.data;
        // console.log(msg);

        if (msg.startsWith('[Server]')) {
          msg = msg.replace('[Server]', '');
          const tabs = JSON.parse(msg);

          that.setState({
            tabs,
          });
          // ws().onmessage = '';
        }
      };
    }(this));

    ws().send('GetTabs');
  }

  SetAudible(id, state) {
    ws().send(`Mute ;; ${id} ;; ${state}`);
  }

  GetAudible(val) {
    if (!val.audible) { return null; }

    if (!val.mutedInfo.muted) {
      return (
        <i className="material-icons ControlItem" onClick={() => { this.SetAudible(val.id, 'true'); }}>
          volume_up
        </i>
      );
    }
    return (
      <i className="material-icons ControlItem" onClick={() => { this.SetAudible(val.id, 'false'); }}>
          volume_off
      </i>
    );
  }

  SetLaunched(id) {
    setData({ id });
    console.log('Set:', id);
  }

  GetLaunchabe(val) {
    if (!val.url) { return null; }

    const check = supported.filter(x => val.url.indexOf(x) > -1);

    if (check.length > 0) {
      return (
        <i className="material-icons ControlItem" onClick={(() => { this.SetLaunched(val.id); })}>
          launch
        </i>
      );
    }
    return null;
  }

  GetTabControlDiv(val) {
    return (
      <div style={{ fontSize: 'small' }}>
        {this.GetAudible(val)}
        {this.GetLaunchabe(val)}
      </div>
    );
  }

  render() {
    return (
      <figure className="ContainerTabs">
        <figcaption className="DragInputTabs" draggable>
          Active Tabs
        </figcaption>
        <section style={{
          overflow: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '5px',
        }}
        >
          {this.state.tabs.map((val, index) => (
            <React.Fragment key={val.id}>
              <div style={{ fontSize: 'small' }}>
                <p style={{ float: 'left' }}>{val.id}</p>
                <p style={{
                  float: 'right', maxWidth: '85%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
                }}
                >
                  { val.title }
                </p>
              </div>
              {this.GetTabControlDiv(val)}
              <hr />
            </React.Fragment>
          ))}
        </section>
      </figure>
    );
  }
}

export default ActiveTabs;
