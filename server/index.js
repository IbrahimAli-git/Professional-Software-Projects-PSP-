const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
app.use(cors())
const players = [0, 0, 0, 0]

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://2a7e-143-52-64-137.eu.ngrok.io",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    let id = socket.id;
    let playernum=0;
    let extramoves=0


    console.log("User connected: " + id)
    
    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0 && players[0] !== players[1] && players[2] !== players[3]){
        console.log("Room is full")
    }
    else{
        for (var i  = 0; i < 4; i++) {
            playernum++
            if (playernum==4){
                players[1]=id;
                break;
            }
            if (playernum==3){
                players[3]=id;
                break;
            }
            if (playernum==2){
                players[2]=id;
                players[3]=id;
                break;
            }
            if (playernum==1) {
                for (var i  = 0; i < 4; i++) {
                    if (players[i] == 0) {
                        players[i] = id;
                    }
                }
            }
        }
    }
    socket.emit("receive_index", playernum)
    console.log(players)


    socket.on("send_move", (data) => {
        socket.broadcast.emit("receive_move", data)
    });

    socket.on("disconnect", (socket) => {
        console.log("User disconnected: " + id)
        for (var i  = 0; i < 4; i++) {
            if (players[i] == id) {
                players[i] = 0;
            }
        }
        console.log(players)
    })

})

server.listen(8080, "0.0.0.0", () => {
    console.log("Server running ... ")
})