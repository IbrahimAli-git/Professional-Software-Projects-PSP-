const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")
app.use(cors())

const server = http.createServer(app)

const io = new Server (server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    let id = socket.id;
    console.log("User connected: " + id)

    socket.on("disconnect", (socket) => {
        console.log("User disconnected: " + id)
    })
    socket.on("send_move",(data)=>{
        console.log("Server: "  + server)
        socket.broadcast.emit("recieve_move",data)
    });
})

server.listen(3001, () => {
    console.log("Server running ... ")
})