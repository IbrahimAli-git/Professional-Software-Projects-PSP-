import './App.css';
import $ from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://10.72.196.155:8080")

function App() {
}

var pane = $('#box'),
  box = $('#characterid'),
  wh = pane.width() - box.width(),
  wv = pane.height() - box.height(),
  d = {},
  x = 10,
  currentv = 200,
  currenth = 300,
  playernum = 0,
  extramoves = [0,0,0];
socket.on("receive_index", (num) => {
  playernum = num;
  console.log("playernum: " + playernum)
});

socket.on("extra_movement", (data) => {
  for (var i  = 0; i < 3; i++) {
    if (data[i] === i+1) {
        extramoves[i] = data[i];
    }
}

})

function newh(v, a, b) {
  var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
  return n < 0 ? 0 : n > wh ? wh : n;
}

function newv(v, a, b) {
  var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
  return n < 0 ? 0 : n > wv ? wv : n;
}

$(window).keydown(function (e) {
  console.log("event: " + e.which)
  console.log("playernum: " + playernum)

  if ((e.which === 37 || e.which === 65) && (playernum === 1 ||  extramoves.includes(1))) {
    d[37] = true;
  }
  if ((e.which === 38 || e.which === 87) && (playernum === 2 ||  extramoves.includes(2))) {
    d[38] = true;
  }
  if ((e.which === 39 || e.which === 68) && (playernum === 3 ||  extramoves.includes(3))) {
    d[39] = true;
  }
  if ((e.which === 40 || e.which === 83) && (playernum === 4 ||  extramoves.includes(4))) {
    d[40] = true;
  }
});

$(window).keyup(function (e) {
  if (e.which === 37 || e.which === 65) {
    d[37] = false;
  }
  if (e.which === 38 || e.which === 87) {
    d[38] = false;
  }
  if (e.which === 39 || e.which === 68) {
    d[39] = false;
  }
  if (e.which === 40 || e.which === 83) {
    d[40] = false;
  }
});

setInterval(function () {
  var vert;
  var hor;
  box.css({
    left: function (i, n) {
      var h = newh(n, 37, 39);
      hor = h;
      return h
    },
    top: function (i, n) {
      var v = newv(n, 38, 40);
      vert = v;
      return v
    }
  });
  if (currentv !== vert || currenth !== hor) {
    socket.emit("send_move", { v: vert, h: hor })
    currentv = vert;
    currenth = hor;
  }

}, 20);
socket.on("receive_move", (data) => {
  var v = data.v;
  var h = data.h;

  console.log("received")
  d[data] = true;
  console.log(data.v, data.h)
  box.css({
    left: h,
    top: v
  });
  currentv = v;
  currenth = h;
  d[data] = false;
});


export default App;
