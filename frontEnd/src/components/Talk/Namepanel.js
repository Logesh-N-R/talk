import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";


export default function Namepanel() {
    const currentRoom = useSelector((state)=>state.currentRoom);
    const dispatch = useDispatch();
    return (<div className="NamePanelContainer">
        <div className="ProfilePic"><img src={currentRoom.isGrp?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":"https://pngset.com/images/the-main-group-group-chat-group-chat-icon-svg-number-symbol-text-silhouette-transparent-png-1188853.png"} /></div>
        <div className="NameHolder">
            <div className="NameContent"><span>{currentRoom.roomName}</span> </div>
            {/* <div className={(currentRoom.roomStatus === 'active') ? "LastSeen" : "displayNone"}>{props.data.profile_other.lastseen}<span className={props.data.profile_other.typing ? "typing" : "displayNone"} id="wave">typing
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </span></div> */}
        </div>
        <div><NavLink to="/home">Back</NavLink></div>
    </div>)
}