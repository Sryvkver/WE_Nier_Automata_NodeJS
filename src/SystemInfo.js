import React from 'react';
import logo from './logo.svg';
import ws, { isReady } from './websocket';


import './SystemInfo.css';

class SystemInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      systeminfo: {
        cpuUsage: 0,
        freeMemPercentage: 0,
        totalMemory: 0,
        usedMemory: 0,
      },
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.getSystemInfo(),
      1000,
    );
  }

  async getSystemInfo() {
    if (!isReady) { return; }
    // this.ws.send('GetData');
    ws().onmessage = (function (that) {
      return function (ev) {
        let msg = ev.data;
        // console.log(msg);

        if (msg.startsWith('[Server]')) {
          msg = msg.replace('[Server]', '');
          const systeminfo = JSON.parse(msg);

          that.setState({
            systeminfo,
          });
          // ws().onmessage = '';
        }
      };
    }(this));

    ws().send('GetSystem');
  }

  render() {
    return (
      <figure className="ContainerSys">
        <figcaption className="DragInputSys" draggable>
          System Info
        </figcaption>
        <div className="Item">
          <p style={{ float: 'left' }}>CPU Usage</p>
          <p style={{ float: 'right' }}>
            {this.state.systeminfo.cpuUsage}
            %
          </p>
        </div>
        <hr />
        <div className="Item">
          <p style={{ float: 'left' }}>Memory Usage</p>
          <p style={{ float: 'right' }}>
            {this.state.systeminfo.usedMemory}
            GB
            /
            {this.state.systeminfo.totalMemory}
            GB
          </p>
        </div>
        <div className="MemProgressBar">
          <div className="MemProgressBarInner" style={{ width: (`${100 - Math.floor(this.state.systeminfo.freeMemPercentage)}%`) }}>
            {(100 - this.state.systeminfo.freeMemPercentage).toFixed(2)}
            %
          </div>
        </div>
        <hr />
      </figure>
    );
  }
}

export default SystemInfo;
