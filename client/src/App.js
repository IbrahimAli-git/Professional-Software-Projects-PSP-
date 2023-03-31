import './App.css';
import $, { data } from 'jquery'
import io from "socket.io-client"
const socket = io.connect("http://localhost:8080")
// connects clients with server using current local ip address on port 8080
// port 8080 used instead of 3000

function App() {
}

var box = $('#characterid'), //the character
  playernum = 0,
  dot1 = $('#item1'), // 5
  dot2 = $('#item2'), // 5
  dot3 = $('#item3'), // 5
  dot4 = $('#item4'), // 10
  dot5 = $('#item5'), // 15
  timeLeft = 0; // add to score remaining time left


socket.on("receive_index", (num) => { //every client that connects recieves a player number from 0-4 (0 if there are already 4 players)
  playernum = num;
  console.log("playernum: " + playernum)
});

socket.on("current_score", (data) =>{ //recieves the current score from the server
  document.getElementById("score").innerHTML = "Score: " +data.s; //updates the score on screen
});

socket.on("receive_move", (data) => { //recieves new position from the server
  var v = data.v;
  var h = data.h;

  box.css({ //sets the position of the player in the css
    left: h,
    top: v
  });
});


function cssData(dot) { //finds the position of the items within the css
  var th = parseInt(dot.css("left").slice(0,3));
  var tv = parseInt(dot.css("top").slice(0,3));
  var data=[th-25,th+25,tv-25,tv+25, true];

  return data;
}

socket.emit("send_items", {d1:cssData(dot1),d2:cssData(dot2),d3:cssData(dot3),d4:cssData(dot4),d5:cssData(dot5)});
console.log("client sent items");

socket.on("item_state", (data) =>{ //recieves the state of each item from the server
  if(data.i1){
    document.getElementById("item1").style.visibility = "visible"; //sets each item to 'hidden' or ' visibile' accordingly
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
    socket.emit("send_reset") //if keycode 82 ('r') is pressed it will tell the server to reset the game
  }

  if ((e.which === 37 || e.which === 65) && playernum === 1) {
    socket.emit("send_input", (37))
  }
  if ((e.which === 38 || e.which === 87) && playernum === 2) {
    socket.emit("send_input", (38))
  }
  if ((e.which === 39 || e.which === 68) && playernum === 3) {
    socket.emit("send_input", (39))
  }
  if ((e.which === 40 || e.which === 83) && playernum === 4) {
    socket.emit("send_input", (40))
  }
});

// https://stackoverflow.com/questions/4435776/simple-clock-that-counts-down-from-30-seconds-and-executes-a-function-afterward
socket.on("receive_time", (data) => { //recieves remaining time from the server
  timeLeft = data;
  var elem = document.getElementById('time');
  elem.innerHTML = data;
})

export default App;