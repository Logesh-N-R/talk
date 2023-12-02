import Namepanel from "./Namepanel"
import TalkBody from "./TalkBody"
import TypePanel from "./TypePanel"
import Apicall from "../Apicall";
// import axios from "axios";
import { useEffect, useState } from "react"
import ENV from "../../data/env"
import io from "socket.io-client";
const socket = io.connect(ENV.serverEndPoint)
export default function Talk(props) {
  // getMessage()
  var apiData = {
    profile_active: {
      user_id: 1,
      user_name: 'Logesh',
      user_mail: 'Logesh@mail.com',
      user_pw: 'password',
      user_profile: '',
      last_seen: "2023-10-15T17:13:20.000Z",
      status: 'online'
    },
    profile_other: {
      user_id: 2,
      user_name: 'Rokki',
      user_mail: 'Rokki@mail.com',
      user_pw: 'password',
      user_profile: '',
      last_seen: "2023-10-15T17:13:26.000Z",
      status: 'typing'
    },
    talk: []
  };

  const [talk, setTalk] = useState(apiData);
  const [user, setUser] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    getMessage()
    // socket.on('room_msg_received', (data) => {
    //   getMessage()
    // })
  }, [])

  function getMessage() {
    Apicall('getMsg', {}).then((res)=>{
      if(res?.redirect){
        props.redirect(res.redirectTo)
    }
    })
  }
  function sendBtnClick(val) {
    let newval = { messageFrom:"fromeperson",messageTo:"toperson",messageType:"private",room:"room1", message: val};
    console.log(newval);
    setTalk(pre => ({ ...pre, 'talk': [newval, ...pre.talk] }));
    Apicall('sendMsg', newval).then((res)=>{
      console.log(res)
    })
    // socket.emit("join_room", room);
    // socket.emit("room_msg_send", { msg: val, room: room });
  }
  function userOneSet(e) {
    setUser(e.target.value);
    console.log('user:', user)
  }

  function userTwoSet(e) {
    setOtherUser(e.target.value);
    console.log('other user:', otherUser)
  }

  function roomId(e) {
    setRoom(e.target.value);
    console.log('other user:', otherUser)
  }
  if (!talk) return "No post!"

  return (<div className="allContainter">
    {/* <input type="text" onChange={userOneSet} value={user} />
    <input type="text" onChange={userTwoSet} value={otherUser} />
    <input type="text" onChange={roomId} value={room} /> */}
    <Namepanel data={talk} />
    <TalkBody user={user} otherUser={otherUser} room={room} data={talk} />
    <TypePanel handleSendBtn={sendBtnClick} />
  </div>)
}