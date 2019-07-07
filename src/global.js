let Data = {
  id: -1,
};

const supported = ['youtube.com', 'open.spotify.com'];

function setData(data) {
  Data = data;
}

function getData() {
  return Data;
}

export { getData, setData, supported };
