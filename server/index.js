const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server } = require("socket.io") // express server created using cors
const { cursorTo } = require("readline")
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
    x = 3, //Movement speed
    startv = 65,
    starth = 29,
    currentv = startv,
    currenth = starth,
    lastinput = 0,
    moveV = startv,
    moveH = starth,
    score = 0,
    items = [],
    hasReset = false,
    itemStates = [],
    walls = [[8,50,2,798],[171,224,228,516],[78,368,2,53],[257,313,62,348],[86,141,396,686],[109,289,726,792]];//wall boundaries currently hard coded

    function newh(v, a, b) { //calculates new vertical postion, ensures it's within game bounds
        var newh = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
        if (newh < 0){
            reset();
            return 35;
        }
        else if (newh > wh){
            reset();
            return 35;
        }
        else{
            if (!wallCheckH(newh)){
                return newh;
            }
            else{
                if (newh > currenth){
                    d[lastinput] = false;
                    d[37] = true;
                    lastinput = 37;
                    return currenth;
                }
                else{
                    d[lastinput] = false;
                    d[39] = true;
                    lastinput = 39;
                    return currenth
                };
            }
        }
        
        
    }
        
    function newv(v, a, b) { //calculates new vertical postion, ensures it's within game bounds
        var newv = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
        if (newv < 0){
            reset();
            return 65;
        }
        else if (newv > wv){
            reset();
            return 65;
        }
        else{
            if (!wallCheckV(newv)){
                return newv;
            }
            else{
                if (newv > currentv){
                    d[lastinput] = false;
                    d[38] = true;
                    lastinput = 38;
                    return currentv;
                }
                else{
                    d[lastinput] = false;
                    d[40] = true;
                    lastinput = 40;
                    return currentv;
                }
            }
        }        
    }

function wallCheckH(x){
    return walls.some(i => i[0] < currentv && currentv < i[1] && i[2] < x && x < i[3])
}

function wallCheckV(x){
    return walls.some(i => i[0] < x && x < i[1] && i[2] < currenth && currenth < i[3])
}

function itemCheck(v,h) { // searches through items array for specific item
    for(const item of items){
        if((item[0] <= h && h <= item[1] && item[2] <= v && v <= item[3] && item[4] == true)){
            item[4] = false;
            // console.log(item.indexOf(item) + 2);
            return items.indexOf(item) + 1;
        }
    }
    return 0;
}

function reset(){
    currentv = startv;
    currenth = starth;
    moveh = starth;
    moveV = startv;
    hasReset = true;
}

io.on("connection", (socket) => { // creates socket.io connection
    let id = socket.id; // id of current client
    let playernum = 0; // assigns a no to each client

    socket.emit("receive_move", { v: currentv, h: currenth }) // sends current vertical and horizontal to client
    console.log("User connected: " + id)

    socket.on("send_reset", (data) => {
        reset();
        score = 0;
        for(var item of items){
            item[4] = true;
        }
        itemStates = []
        for(var item of items){
            itemStates.push(item[4]);
        }
        socket.emit("item_state", {i1:itemStates[0], i2:itemStates[1], i3:itemStates[2], i4:itemStates[3], i5:itemStates[4]});
        socket.broadcast.emit("item_state", {i1:itemStates[0], i2:itemStates[1], i3:itemStates[2], i4:itemStates[3], i5:itemStates[4]});
    })

    socket.on("send_items", (data) => {
        if(items.length == 0){
            items.push(data.d1);
            items.push(data.d2);
            items.push(data.d3);
            items.push(data.d4);
            items.push(data.d5);
        }
        itemStates = []
        for(var item of items){
            itemStates.push(item[4]);
        }
        console.log(items);
    })
    
    
    
    
    if (players[0] !== 0 && players[1] !== 0 && players[2] !== 0 && players[3] !== 0) { // checks if room is full
        console.log("Room is full")
    }
    else {
        for (var i = 0; i < 4; i++) {
            playernum++
            if (players[i] == 0) {
                players[i] = id; // stores each clients id in players array
                break;
            }
        }
    }
    
    socket.emit("receive_index", playernum) // sending player number to client, determines move direction
    console.log(players)
    
    socket.on("send_input", (data) => { //recieves key press from client
        d[lastinput] = false;
        d[data] = true;
        lastinput = data;
    });
    
    socket.on("disconnect", (socket) => { // disconnects client and removes them from players array 
        console.log("User disconnected: " + id)
        for (var i = 0; i < 4; i++) {
            if (players[i] == id) {
                players[i] = 0;
                break;
            }
        }
        console.log(players)
    })
    
    setInterval(function () { // updates and sends new position to clients at a set interval
        socket.emit("item_state", {i1:itemStates[0], i2:itemStates[1], i3:itemStates[2], i4:itemStates[3], i5:itemStates[4]});
        socket.broadcast.emit("item_state", {i1:itemStates[0], i2:itemStates[1], i3:itemStates[2], i4:itemStates[3], i5:itemStates[4]});
        socket.emit("current_score", {s: score});

        
        moveV = newv(currentv, 38, 40);
        moveH = newh(currenth, 37, 39);
        
        if(hasReset){
            d[lastinput] = false;
            currenth = starth;
            currentv = startv;
            moveh = starth;
            moveV = startv;
            socket.broadcast.emit("receive_move", { v: currentv, h: currenth })
            socket.emit("receive_move", { v: currentv, h: currenth })
            hasReset = false;
        }

        if (currentv !== moveV || currenth !== moveH) {
            socket.broadcast.emit("receive_move", { v: moveV, h: moveH })
            currentv = moveV;
            currenth = moveH;
        }
        
        var i = itemCheck(moveV, moveH);
        if(i != 0){
            score++;
            console.log("score: " + score);
            itemStates[i-1] = false;
            console.log(items);
        }
    }, 50); // interval 50ms
})

server.listen(8080, "0.0.0.0", () => { // server listens for connections on port 8080
    console.log("Server running ... ")
})