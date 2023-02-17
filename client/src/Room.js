import React from "react";
import io from "socket.io-client"
import { useState } from "react";
const socket = io.connect("http://localhost:8080")

function Room() {
    var App= require ("./App");
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showApp, setShowApp] = useState(false);
    const [playernum, setPlayernum] = useState("");

    const joinRoom = () => {
        if (username !== "" && room !== ""){
        socket.emit("join_room",room);
        socket.emit("send_index", {})
        socket.on("receive_index", (num) => {
            setPlayernum(num);
            console.log("playernum: " + playernum)
        setShowApp(true);
        })}
    }
    return (
        <div className="Room">
            {!showApp ?(
                <div className="JoinRoom">
                    <h3>Join a Room</h3>
                    <input type="text" placeholder="Name..." onChange={(event) => {setUsername(event.target.value)}}/>
                    <input type="text" placeholder="Room CODE" onChange={(event) => {setRoom(event.target.value)}}/>
                    <button onClick={joinRoom}>Submit</button>
                </div>
            ) : (
                <App socket={socket} username={username} room={room} playernum={playernum}/>
            )}
        </div>
    )
}
export default Room;

