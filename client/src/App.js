import './App.css';
import $, { data } from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://localhost:8080")
// connects clients with server using current local ip address on port 8080
// port 8080 used instead of 3000

function App() {
}

var box = $('#characterid'); //the character
var playernum = 0;
var dot1 = $('#item1'); // 5
var dot2 = $('#item2'); // 5
var dot3 = $('#item3'); // 5
var dot4 = $('#item4'); // 10
var dot5 = $('#item5'); // 15
var timeLeft = 0; // add to score remaining time left


socket.on("receive_index", (num) => { //every client that connects recieves a player number from 0-4 (0 if there are already 4 players)
  playernum = num;
  console.log("playernum: " + playernum)
});

socket.on("current_score", (data) =>{
  document.getElementById("score").innerHTML = "Score: " +data.s;
});

socket.on("receive_move", (data) => { //recieves new position from the server
  var v = data.v;
  var h = data.h;

  box.css({
    left: h,
    top: v
  });
});


function cssData(dot) {
  var th = parseInt(dot.css("left").slice(0,3));
  var tv = parseInt(dot.css("top").slice(0,3));
  var data=[th-30,th+30,tv-30,tv+30, true];
  return data;
}

socket.emit("send_items", {d1:cssData(dot1),d2:cssData(dot2),d3:cssData(dot3),d4:cssData(dot4),d5:cssData(dot5)});
console.log("client sent items");


socket.on("item_state", (data) =>{
  console.log(data.i1 + "........" + data.i2)
  if(data.i1){
    document.getElementById("item1").style.visibility = "visible";   
  }
  else {
    document.getElementById("item1").style.visibility = "hidden";
  }
  if(data.i2){
    document.getElementById("item2").style.visibility = "visible";   
  }
  else {
    document.getElementById("item2").style.visibility = "hidden";
  }
  if(data.i3){
    document.getElementById("item3").style.visibility = "visible";   
  }
  else {
    document.getElementById("item3").style.visibility = "hidden";
  }
  if(data.i4){
    document.getElementById("item4").style.visibility = "visible";   
  }
  else {
    document.getElementById("item4").style.visibility = "hidden";
  }
  if(data.i5){
    document.getElementById("item5").style.visibility = "visible";   
  }
  else {
    document.getElementById("item5").style.visibility = "hidden";
  }
});

$(window).keydown(function (e) { //when a key is pressed, it checks whether that player is allowed to use that key, then sends it to the server
  if ((e.which === 82)) {
    socket.emit("send_reset")
  }
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
// https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward
socket.on("receive_time", (data) => {
  timeLeft = data;
  var elem = document.getElementById('time');
  elem.innerHTML = data;

})

export default App;