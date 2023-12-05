import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from '../../socket'
import { appTypeSettings } from "../../redux/actions/talkActions";
import KeyboardBackspaceTwoToneIcon from '@mui/icons-material/KeyboardBackspaceTwoTone';

export default function Namepanel() {
    const [isTyping, setIsTyping] = useState(false);
    const { screen, current } = useSelector((state) => state.appType)
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
    function backToHome() {
        dispatch(appTypeSettings({ current: "HOME", screen: getWindowDimensions() }))
    }

    useEffect(() => {
        socket.on('userTyping', () => setIsTyping(true))
        socket.on('userStopTyping', () => setIsTyping(false))
    })
    const currentRoom = useSelector((state) => state.currentRoom);
    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    return (currentRoom.roomName ?
        <div className="NamePanelContainer">
            <div className="profileDetails">
                <div className="ProfilePic"><img src={currentRoom.isGrp ? "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png" : currentRoom.users.filter((user) => user._id !== userData._id)[0].profile} /></div>
                <div className="NameHolder">
                    <div className="NameContent"><span>{currentRoom.isGrp ? currentRoom.roomName : currentRoom && currentRoom.users.filter((user) => user._id !== userData._id)[0].username}</span> </div>
                    <div className={isTyping ? "LastSeen" : "displayNone"}><span className={isTyping ? "typing" : "displayNone"} id="wave">typing
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </span></div>
                </div>
            </div>
            {
                (screen && screen.width < 700) ?
                <div onClick={() => backToHome()} className="back"><KeyboardBackspaceTwoToneIcon sx={{ fontSize: 20, color: "white" }} /></div>:""
            }
        </div> : "")
}