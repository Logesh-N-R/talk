import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {socket} from '../../socket'

export default function Namepanel() {
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        socket.on('userTyping', () => setIsTyping(true))
        socket.on('userStopTyping', () => setIsTyping(false))
    })
    const currentRoom = useSelector((state) => state.currentRoom);
    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    return (currentRoom.roomName?<div className="NamePanelContainer">
        <div className="ProfilePic"><img src={currentRoom.isGrp ? "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png" : currentRoom.users.filter((user)=>user._id !== userData._id)[0].profile} /></div>
        <div className="NameHolder">
            <div className="NameContent"><span>{currentRoom.isGrp ?currentRoom.roomName:currentRoom && currentRoom.users.filter((user)=>user._id !== userData._id)[0].username}</span> </div>
            <div className={isTyping ? "LastSeen" : "displayNone"}><span className={isTyping ? "typing" : "displayNone"} id="wave">typing
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </span></div>
        </div>
    </div>:"NO DATA")
}