import './App.css';
import $ from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://localhost:8080")
// connects clients with server using current local ip address on port 8080
// port 8080 used instead of 3000

function App() {
}

var box = $('#characterid'), //the character
    playernum = 0;

socket.on("receive_move", (data) => { //recieves new position from the server
  var v = data.v;
  var h = data.h;

  box.css({
    left: h,
    top: v
  });
});

$(window).keydown(function (e) { //when a key is pressed, it checks whether that player is allowed to use that key, then sends it to the server

  if ((e.which === 37 || e.which === 65) /*&& playernum === 1*/) {
    socket.emit("send_input", (37))
  }
  if ((e.which === 38 || e.which === 87) /*&& playernum === 2*/) {
    socket.emit("send_input", (38))
  }
  if ((e.which === 39 || e.which === 68) /*&& playernum === 3*/) {
    socket.emit("send_input", (39))
  }
  if ((e.which === 40 || e.which === 83) /*&& playernum === 4*/) {
    socket.emit("send_input", (40))
  }
});

export default App;