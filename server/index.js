const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")
app.use(cors({ origin: "*" }))

const server = http.createServer(app)

const io = new Server (server, {
    cors: {
       // origin: "http://10.72.196.155:3000",
        origin: "*",
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
        socket.broadcast.emit("receive_move", data)
    });
})

server.listen(8080, "0.0.0.0", () => {
    console.log("Server running ... ")
})