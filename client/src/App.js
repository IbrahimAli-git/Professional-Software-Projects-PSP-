import './App.css';
import $ from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://13.40.174.86:3000")
// connects clients with server using current local ip address on port 8080
// port 8080 used instead of 3000

function App() {
}

var pane = $('#box'), //the game box
    box = $('#characterid'), //the character
//   wh = pane.width() - box.width(), //calculates the max distance character can go horizontally
//   wv = pane.height() - box.height(), //calculates the max distance character can go vertically
//   d = {}, //Stores key presses, the key for the current direction is set to 'true'
//   x = 3, //Movement speed
//   currentv = 200,
//   currenth = 300,
     playernum = 0;
//   lastinput = 0,
//   host = false; //if host = true, then that client is the one doing the movement

socket.on("receive_index", (num) => { //every client that connects recieves a player number from 0-4 (0 if there are already 4 players)
  playernum = num;
  console.log("playernum: " + playernum)
});

// function newh(v, a, b) { //calculates new vertical postion, ensures it's within game bounds
//   var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
//   return n < 0 ? 0 : n > wh ? wh : n;
// }

// function newv(v, a, b) { //calculates new horizontal postion, ensures it's within game bounds
//   var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
//   return n < 0 ? 0 : n > wv ? wv : n;
// }

// setInterval(function () { // updates and sends new position to server at a set interval
//   if (host === true) {
//     var vert;
//     var hor;
//     box.css({
//       left: function (i, n) {
//         var h = newh(n, 37, 39);
//         hor = h;
//         return h
//       },
//       top: function (i, n) {
//         var v = newv(n, 38, 40);
//         vert = v;
//         return v
//       }
//     });

//     if (currentv !== vert || currenth !== hor) {
//       socket.emit("send_move", { v: vert, h: hor })
//       currentv = vert;
//       currenth = hor;
//     }
//   }
// }, 20); // interval 20ms
  
socket.on("receive_move", (data) => { //recieves new position from the server
  var v = data.v;
  var h = data.h;

  console.log("received")
  // d[data] = true;
  console.log(data.v, data.h)
  box.css({
    left: h,
    top: v
  });
  // currentv = v;
  // currenth = h;
  // d[data] = false;
});

$(window).keydown(function (e) { //when a key is pressed, it checks whether that player is allowed to use that key, then sends it to the server
  console.log("event: " + e.which)
  console.log("playernum: " + playernum)

  if ((e.which === 37 || e.which === 65) && playernum === 1) {
    // if (37 !== lastinput) {
    //   d[lastinput] = false;
    //   d[37] = true;
    //   lastinput = 37;
    socket.emit("send_input", (37))
    // }
  }
  if ((e.which === 38 || e.which === 87) && playernum === 2) {
    // if (38 !== lastinput) {
    //   d[lastinput] = false;
    //   d[38] = true;
    //   lastinput = 38;
    socket.emit("send_input", (38))
    // }
  }
  if ((e.which === 39 || e.which === 68) && playernum === 3) {
    // if (39 !== lastinput) {
    //   d[lastinput] = false;
    //   d[39] = true;
    //   lastinput = 39;
    socket.emit("send_input", (39))
    // }
  }
  if ((e.which === 40 || e.which === 83) && playernum === 4) {
    // if (40 !== lastinput) {
    //   d[lastinput] = false;
    //   d[40] = true;
    //   lastinput = 40;
    socket.emit("send_input", (40))
    // }
  }
  // console.log(lastinput);
});

// socket.on("receive_input", (data) => { //recieves key press from server
//   d[lastinput] = false;
//   d[data] = true;
//   lastinput = data;
// });

// socket.on("new_host", () => { //server has designated a new 'host'
//   host = true;
//   console.log("host" + host);
// });

export default App;
