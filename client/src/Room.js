import React from "react";
import io from "socket.io-client"
import { useState } from "react";
const socket = io.connect("http://10.72.196.155:8080")

function Room() {
    var App= require ("./App");
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const joinRoom = () => {
        if (username !== "" && room !== ""){
        socket.emit("join_room",room);
        }
    }
    return (
        <div class="main">
            <h3>Join a Room</h3>
            <input type="text" placeholder="Name..." onChange={(event) => {setUsername(event.target.value)}}/>
            <input type="text" placeholder="Room CODE" onChange={(event) => {setRoom(event.target.value)}}/>
            <button onClick={joinRoom}>Submit</button>
            <App socket={socket} username={username} room={room}/>
        </div>
    )
}
export default Room;

