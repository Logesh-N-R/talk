import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useState } from "react"
import logo from "../../images/backForForm.jpg"
import Apicall from '../Apicall';
import { toast } from "react-toastify";


export default function Home(props) {
    const [startTalkFlag, setStartTalkFlag] = useState(false);
    const [inputVal, setInputVal] = useState('');
    console.log(props)
    function onKeyDown(e) {
        console.log(e)
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            startTalk()
        } else {
            document.getElementById("startMsgInput").focus();
        }
    }

    useEffect(() => {
        getHomeData()
    }, [])
    const [homePageData, setHomePageData] = useState([])
    function getHomeData() {
        Apicall('getHomeData', { room: "room1" }).then((res) => {
            console.log(res);
            if (res?.redirect) {
                props.redirect(res.redirectTo)
            }
            if (res?.data?.roomData) {
                setHomePageData(res?.data?.roomData)
                console.log(res?.data?.roomData)
            }
        })
    }
    function handleChange(e) {
        const val = e.target.value;
        setInputVal(val);
    }
    function startTalk() {
        const val = document.getElementById("startMsgInput").value;
        if (val != "") {
            const roomInput = {};
            roomInput.email = val;
            Apicall('startRoom', roomInput).then((res) => {
                if (res.data.status == "succss") {
                    console.log(res.data)
                }
                setStartTalkFlag(false);
                setInputVal("");

            })
        } else {
            toast.warn("Empty input found!")
        }
    }

    function addContact() {
        setStartTalkFlag(true)
    }
    function closePopup() {
        setStartTalkFlag(false)
    }

    const userContRen = homePageData.map((x,index) => {
        return (
            <div className="UserCont" data-eleClicked={x._id} onClick={(e)=>props.talk(e)}>
                <div className="UserDP">
                    <img src={logo} alt='dp' />
                </div>
                <div className="UserTitle">
                    <div className='UserName'> {x.roomType == 'private' ? x.members[1] : x.roomName}
                    </div>
                    <div className='UserMsg'>{x.roomId}
                    </div>
                </div>
                <div className="UserMsgCount">1000</div>
            </div>
        )
    });
    return <div className="HomeContTotal">
        <div className="HomeCont">
            <div className="HomeTopCont">
                <div className="options"><ListTwoToneIcon sx={{ fontSize: 40, color: "white" }} /></div>
                <div className="title">{props?.user?.username}'s Messages</div>
                <div className="search"><SearchIcon sx={{ fontSize: 40, color: "white" }} /></div>
            </div>
            <div className="HomebodyCont">
                {userContRen}
            </div>
            <div className="AddUser" onClick={addContact} title="Add contact">
                <AddCardIcon sx={{ fontSize: 35, color: "grey" }} />
            </div>
        </div>
        {startTalkFlag ? <div className='startTalkCont'>
            <div className='title'>Add Contact</div>
            <input className="TypePanelContent " id="startMsgInput" placeholder="Type the other person's email..." autoFocus onChange={handleChange} onKeyDownCapture={onKeyDown} type="email" value={inputVal} />
            <div className='btnCont'>
                <div className="UserInputBtn" onClick={startTalk}>Start</div>
                <div className="UserInputBtn" onClick={closePopup}>Cancel</div>
            </div>
        </div> : ""}
    </div>
}