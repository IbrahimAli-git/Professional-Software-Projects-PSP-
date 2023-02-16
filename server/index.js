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

var currentv = 200;
var currenth = 300;

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
        socket.broadcast.emit("receive_input", data)
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