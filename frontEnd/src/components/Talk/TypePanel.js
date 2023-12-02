import { useState } from "react"
import { toast } from "react-toastify";

export default function TypePanel(props) {
    const [inputVal, setInputVal] = useState('');
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
    function sendmessage(){
        const val = document.getElementById("sendMsgInput").value;
        if(val != ""){
            props.handleSendBtn(val);
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