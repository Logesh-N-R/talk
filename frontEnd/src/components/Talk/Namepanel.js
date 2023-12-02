export default function Namepanel(props) {
    return (<div className="NamePanelContainer">
        <div className="ProfilePic"><img src={props.data.profile_other.user_profile} /></div>
        <div className="NameHolder">
            <div className="NameContent"><span>{props.data.profile_other.user_name}</span> </div>
            <div className={(props.data.profile_other.status == 'offline') ? "LastSeen" : "displayNone"}>{props.data.profile_other.lastseen}<span className={props.data.profile_other.typing ? "typing" : "displayNone"} id="wave">typing
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </span></div>
        </div>
    </div>)
}