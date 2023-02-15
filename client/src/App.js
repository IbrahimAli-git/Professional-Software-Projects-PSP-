import './App.css';
import $, { data } from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://10.72.196.155:3001")

function App() {

}

var pane = $('#box'),
  box = $('#characterid'),
  wh = pane.width() - box.width(),
  wv = pane.height() - box.height(),
  d = {},
  x = 10;

function newh(v, a, b) {
  var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
  return n < 0 ? 0 : n > wh ? wh : n;
}

function newv(v, a, b) {
  var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
  return n < 0 ? 0 : n > wv ? wv : n;
}
$(window).keydown(function (e) 
{ 
  d[e.which] = true; 
});

$(window).keyup(function (e) { d[e.which] = false; });

setInterval(function () {
  var vert;
  var hor;
  box.css({
    left: function (i, v) {
      var h = newh(v, 37, 39);
       //socket.emit("send_move", h)
       hor = h;
      return h },
    top: function (i, v) {
      var v = newv(v, 38, 40);
       //socket.emit("send_move", v) 
       vert = v;
      return v  }   
  });
  socket.emit("send_move", {v: vert, h:hor})
}, 20);
socket.on("recieve_move",(data)=> {
  var v = data.v;
  var h = data.h;
  
  console.log("received")
  d[data] = true;
  console.log(data.v, data.h)
  box.css({
    left: h,
    top: v
  });
  d[data] = false;
});

export default App;
