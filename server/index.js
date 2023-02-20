const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io") // express server created using cors
app.use(cors({ origin: "*" })) // allows for all connections 

const players = [0, 0, 0, 0] // stores a fixed no of players which are assigned a number

const server = http.createServer(app) // creates http server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})

let  currentv = 200; // current vertical of sprite
let  currenth = 300; // current horizontal of sprite

io.on("connection", (socket) => { // creates socket.io connection
    let id = socket.id; // id of current client
    let playernum=0; // assigns a no to each client

    socket.emit("receive_move", { v: currentv, h: currenth }) // sends current vertical and horizontal to client
    console.log("User connected: " + id) 
    
    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0){
        console.log("Room is full")
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

    socket.on("disconnect", (socket) => { // 
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

server.listen(8080, "0.0.0.0", () => { // server listens for connections on port 8080
    console.log("Server running ... ")
})