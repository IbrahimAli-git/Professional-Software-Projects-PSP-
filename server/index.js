const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
app.use(cors({ origin: "*" }))
const players = [0, 0, 0, 0]

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

var pane = $('#box'), //the game box
  box = $('#characterid'), //the character
  wh = pane.width() - box.width(), //calculates the max distance character can go horizontally
  wv = pane.height() - box.height(), //calculates the max distance character can go vertically
  d = {}, //Stores key presses, the key for the current direction is set to 'true'
  x = 10, //Movement speed
  currentv = 200,
  currenth = 300,
  lastinput = 0;

  function newh(v, a, b) { //calculates new vertical postion, ensures it's within game bounds
    var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
    return n < 0 ? 0 : n > wh ? wh : n;
  }
  
  function newv(v, a, b) { //calculates new horizontal postion, ensures it's within game bounds
    var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
    return n < 0 ? 0 : n > wv ? wv : n;
  }

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
        socket.emit("recieve_move", { v: vert, h: hor })
        currentv = vert;
        currenth = hor;
      } 
    }, 20);

io.on("connection", (socket) => {
    let id = socket.id;
    let playernum=0;

    socket.emit("receive_move", { v: currentv, h: currenth })

    console.log("User connected: " + id)
    
    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0){
        alert("Room is full")
    }
    else{
        for (var i  = 0; i < 4; i++) {
            playernum++
            if (players[i] == 0) {
                if (players[0] == 0 && players[1] == 0 && players[2] == 0 && players[3] == 0){
                    socket.emit("new_host");
                }
                players[i] = id;
                break;
            }
        }
    }
    socket.emit("receive_index", playernum)
    console.log(players)

    socket.on("send_move", (data) => {
        currentv = data.v;
        currenth = data.h;
        socket.broadcast.emit("receive_move", data)
    });

    socket.on("send_input", (data) => {
        d[lastinput] = false;
        d[data] = true;
        lastinput = data;
        //socket.broadcast.emit("receive_input", data)
    });

    socket.on("disconnect", (socket) => {
        console.log("User disconnected: " + id)
        for (var i  = 0; i < 4; i++) {
            if (players[i] == id) {
                players[i] = 0;
                for (var i in players){
                    if (i !== 0){
                        io.to (players[i]).emit('new_host')

                    }
                }
                break;
            }
        }

        
        console.log(players)
    })

})

server.listen(8080, "0.0.0.0", () => {
    console.log("Server running ... ")
})