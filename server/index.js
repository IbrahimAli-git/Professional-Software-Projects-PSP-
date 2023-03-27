const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server } = require("socket.io") // express server created using cors
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

let paneW = 800,
    paneV = 400, //the game box
    boxW = 20,
    boxV = 20, //the character
    wh = paneW - boxW, //calculates the max distance character can go horizontally
    wv = paneV - boxV, //calculates the max distance character can go vertically
    d = {}, //Stores key presses, the key for the current direction is set to 'true'
    x = 2, //Movement speed
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

io.on("connection", (socket) => { // creates socket.io connection
    let id = socket.id; // id of current client
    let playernum = 0; // assigns a no to each client
    
    socket.emit("receive_move", { v: currentv, h: currenth }) // sends current vertical and horizontal to client
    console.log("User connected: " + id)

    
    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0) { // checks if room is full
        console.log("Room is full")
    }
    else {
        for (var i = 0; i < 4; i++) {
            playernum++
            if (players[i] == 0) {
                // if (players[0] == 0 && players[1] == 0 && players[2] == 0 && players[3] == 0){ // assigns a host to the first client available
                //     socket.emit("new_host");
                // }
                players[i] = id; // stores each clients id in players array
                break;
            }
        }
    }
    
    socket.emit("receive_index", playernum) // sending player number to client, determines move direction
    console.log(players)
    
    // socket.on("send_move", (data) => { // receives position from client 
    //     currentv = data.v;
    //     currenth = data.h;
    //     socket.broadcast.emit("receive_move", data) // sends new position to other clients
    // });
    
    // socket.on("send_input", (data) => {  // sends key pressed to other clients
    //     socket.broadcast.emit("receive_input", data)
    // });
    
    socket.on("send_input", (data) => { //recieves key press from server
        d[lastinput] = false;
        d[data] = true;
        lastinput = data;
    });
    
    socket.on("disconnect", (socket) => { // disconnects client and removes them from players array 
        console.log("User disconnected: " + id)
        for (var i = 0; i < 4; i++) {
            if (players[i] == id) {
                players[i] = 0;
                // for (var i in players){
                    //     if (i !== 0){
                        //         io.to (players[i]).emit('new_host') // assigns 
                        //     }
                        // }
                break;
            }
        }
        console.log(players)
    })
    
    setInterval(function () { // updates and sends new position to server at a set interval
    
        var h = newh(currenth, 37, 39);
    
        var v = newv(currentv, 38, 40);
    
        if (currentv !== v || currenth !== h) {
            socket.broadcast.emit("receive_move", { v: v, h: h })
            currentv = v;
            currenth = h;
        }
    }, 50); // interval 20msawwadawd
})

server.listen(8080, "0.0.0.0", () => { // server listens for connections on port 8080
    console.log("Server running ... ")
})