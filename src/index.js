import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { async } from 'q';
import Main from './Main';
import ActiveTabs from './Active_Tabs';
import SystemInfo from './SystemInfo';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Main />, document.getElementById('root'));
ReactDOM.render(<ActiveTabs />, document.getElementById('active_tabs_root'));
ReactDOM.render(<SystemInfo />, document.getElementById('system_info_root'));

const scriptEle = document.createElement('script');
scriptEle.innerHTML = `(${(async () => {
  await (new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 1000);
  }));
  const dragItemSys = document.querySelector('.ContainerSys');
  const dragItemTabs = document.querySelector('.ContainerTabs');
  const containerSys = document.querySelector('.DragInputSys');
  const containerTabs = document.querySelector('.DragInputTabs');

  let activeSys = false;
  let activeTabs = false;
  let curXSys;
  let curXTabs;
  let curYSys;
  let curYTabs;
  let iniXSys;
  let iniXTabs;
  let iniYSys;
  let iniYTabs;
  let xOffsetSys = 100;
  let xOffsetTabs = containerTabs.getBoundingClientRect().left;
  let yOffsetSys = 100;
  let yOffsetTabs = 100;

  containerSys.addEventListener('mousedown', dragStart, false);
  containerTabs.addEventListener('mousedown', dragStart, false);
  containerSys.addEventListener('mouseup', dragEnd, false);
  containerSys.addEventListener('mouseleave', mouseLeft, false);
  containerTabs.addEventListener('mouseup', dragEnd, false);
  containerTabs.addEventListener('mouseleave', mouseLeft, false);
  containerSys.addEventListener('mousemove', drag, false);
  containerTabs.addEventListener('mousemove', drag, false);

  function mouseLeft(e) {
    if (e.target === containerSys) {
      activeSys = false;
    }
  }

  function dragStart(e) {
    // console.log('Drag Start');
    if (e.target === containerSys) {
      iniXSys = e.clientX - xOffsetSys;
      iniYSys = e.clientY - yOffsetSys;
      activeSys = true;
    }
    if (e.target === containerTabs) {
      iniXTabs = e.clientX - xOffsetTabs;
      iniYTabs = e.clientY - yOffsetTabs;
      activeTabs = true;
    }
  }

  function dragEnd(e) {
    // console.log('Drag End');
    if (e.target === containerSys) {
      iniXSys = curXSys;
      iniYSys = curYSys;
      activeSys = false;
    }

    if (e.target === containerTabs) {
      iniXTabs = curXTabs;
      iniYTabs = curYTabs;
      activeTabs = false;
    }
  }

  function drag(e) {
    // console.log('Drag');
    if (activeSys) {
      e.preventDefault();

      curXSys = e.clientX - iniXSys;
      curYSys = e.clientY - iniYSys;

      xOffsetSys = curXSys;
      yOffsetSys = curYSys;

      dragItemSys.style.left = `${curXSys}px`;
      dragItemSys.style.top = `${curYSys}px`;
    }

    if (activeTabs) {
      e.preventDefault();

      curXTabs = e.clientX - iniXTabs;
      curYTabs = e.clientY - iniYTabs;

      xOffsetTabs = curXTabs;
      yOffsetTabs = curYTabs;

      dragItemTabs.style.left = `${curXTabs}px`;
      dragItemTabs.style.top = `${curYTabs}px`;
    }
  }
}).toString()})()`;
document.body.appendChild(scriptEle);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
