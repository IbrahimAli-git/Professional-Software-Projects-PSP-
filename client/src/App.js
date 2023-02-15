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
  playernum = 0;
  socket.on("receive_index", (num) => {
    playernum = num;
    console.log("playernum: " + playernum)
  });

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

  if (e.which === 37 && playernum === 1){
     d[e.which] = true; 
   }
   if (e.which === 38 && playernum === 2){
    d[e.which] = true; 
  }
  if (e.which === 39 && playernum === 3){
    d[e.which] = true; 
  }
  if (e.which === 40 && playernum === 4){
    d[e.which] = true; 
  }
  });
$(window).keyup(function (e) { d[e.which] = false; });

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
