import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import Apicall from "../Apicall";
import { useDispatch, useSelector } from "react-redux";
import { loaderSetting, removeUpdatedChats, selectedRoom, setAllRooms, updateTalk } from "../../redux/actions/talkActions";
import {socket} from '../../socket'
import { useNavigate } from "react-router";

export default function TypePanel() {
    const [typing,setTyping]= useState(false);
    const [inputVal, setInputVal] = useState('');
    const updatedChat = useSelector((state) => state.updatedChat);
    const currentRoom = useSelector((state)=>state.currentRoom)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    function onKeyDown(e){
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            sendmessage()
        }else{
            document.getElementById("sendMsgInput").focus();
        }
    }
    const sendMessageCall = async (val)=>{
        Apicall('sendTalk', {
            roomId:currentRoom._id,
            content:val
        }).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res?.status === 'success') {
                fetchRoomData()
                dispatch(updateTalk(true))
                socket.emit('new_msg',res.data)
            }
            console.log(res);
        })
    }
    function sendmessage(){
        socket.emit('stopTyping',currentRoom._id)
        const val = document.getElementById("sendMsgInput").value;
        if(val != ""){
            sendMessageCall(val)
            setInputVal("")
        }else{
            toast.warn("Can't send empty message!")
        }
    }
    function handleChange(e) {
        const val = e.target.value;
        setInputVal(val);
        if(!typing){
            setTyping(true);
            socket.emit('typing',currentRoom._id)
        }
        let lastTyped = new Date().getTime();
        var timer = 2000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTyped;
            if(timeDiff>=timer && typing){
                socket.emit('stopTyping',currentRoom._id)
                setTyping(false)
            }
        },timer)
            
    }
    const fetchRoomData = async () => {
        Apicall('getMsg', { roomId: currentRoom._id }).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res.status === 'success' && res.data) {
                let removeUpdated = updatedChat.filter(item => item !== currentRoom._id)
                dispatch(removeUpdatedChats(removeUpdated))
                dispatch(selectedRoom(res.data))
                dispatch(loaderSetting(false));
            }
        })
    }
    
    return (<div className="TypePanelContainer">
        <input className="TypePanelContent " id="sendMsgInput" placeholder="Type your message here..." autoFocus onChange={handleChange} onKeyDownCapture={onKeyDown} type="text" value={inputVal} />
        <div className="UserInputBtn" onClick={sendmessage}>Send</div>
    </div>)
}