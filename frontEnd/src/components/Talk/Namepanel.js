import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
// SOC KET
import ENV from "../../data/env"
import io from "socket.io-client";
import { useEffect, useState } from "react";
// var socket;
const socket = io.connect(ENV.serverEndPoint)


export default function Namepanel() {
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // socket = io(ENV.serverEndPoint);
        socket.emit('join_room', currentRoom._id)
        socket.on('userTyping', () => setIsTyping(true))
        socket.on('userStopTyping', () => setIsTyping(false))
        // socket.removeAllListeners();
    })
    const currentRoom = useSelector((state) => state.currentRoom);
    const dispatch = useDispatch();
    return (<div className="NamePanelContainer">
        <div className="ProfilePic"><img src={currentRoom.isGrp ? "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png" : "https://pngset.com/images/the-main-group-group-chat-group-chat-icon-svg-number-symbol-text-silhouette-transparent-png-1188853.png"} /></div>
        <div className="NameHolder">
            <div className="NameContent"><span>{currentRoom.roomName}</span> </div>
            <div className={isTyping ? "LastSeen" : "displayNone"}><span className={isTyping ? "typing" : "displayNone"} id="wave">typing
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </span></div>
        </div>
        <div><NavLink to="/home">Back</NavLink></div>
    </div>)
}