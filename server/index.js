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
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    let id = socket.id;
    let playernum=0;


    console.log("User connected: " + id)
    
    socket.on("join_room", (data)=> {
        socket.join(data);
        console.log("User " + id + "joined room: " + data)
    })

    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0){
        alert("Room is full")
    }
    else{
        for (var i  = 0; i < 4; i++) {
            playernum++
            if (players[i] == 0) {
                players[i] = id;
                break;
            }
        }
    }
    socket.emit("receive_index", playernum)
    console.log(players)


    socket.on("send_move", (data) => {
        io.to(data.r).emit("receive_move", data);
    });

    socket.on("disconnect", (socket) => {
        console.log("User disconnected: " + id)
        for (var i  = 0; i < 4; i++) {
            if (players[i] == id) {
                players[i] = 0;
                break;
            }
        }
        console.log(players)
    })

})

server.listen(8080, "0.0.0.0", () => {
    console.log("Server running ... ")
})