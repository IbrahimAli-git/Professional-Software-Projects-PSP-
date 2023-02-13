const { Socket } = require("dgram")
const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server, {cors: {origin: "*"}})

server.maxConnections = 4

app.set("view engine", "html")

app.get("/home", (req, res) => {
    res.render("home")
})


server.listen(3001, () => {
    console.log("Server running...")
})