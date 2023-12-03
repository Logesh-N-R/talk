import { useState } from "react"
import { toast } from "react-toastify";
import Apicall from "../Apicall";
import { useDispatch } from "react-redux";

export default function TypePanel() {
    const [inputVal, setInputVal] = useState('');
    const dispatch = useDispatch();
    function onKeyDown(e){
        console.log(e)
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
            "roomId":"656b549dab3e51c175f4e606",
            "content":val
          }).then((res) => {
            console.log(res);
        })
    }
    function sendmessage(){
        const val = document.getElementById("sendMsgInput").value;
        if(val != ""){
            sendMessageCall(val)
            // props.handleSendBtn(val);
            setInputVal("")
        }else{
            toast.warn("Can't send empty message!")
        }
    }
    function handleChange(e) {
        const val = e.target.value;
        setInputVal(val);
    }
    
    return (<div className="TypePanelContainer">
        <input className="TypePanelContent " id="sendMsgInput" placeholder="Type your message here..." autoFocus onChange={handleChange} onKeyDownCapture={onKeyDown} type="text" value={inputVal} />
        <div className="UserInputBtn" onClick={sendmessage}>Send</div>
    </div>)
}