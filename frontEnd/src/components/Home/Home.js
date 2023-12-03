import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useState } from "react"
import logo from "../../images/backForForm.jpg"
import Apicall from '../Apicall';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { selectedRoom, setAllRooms,currentRoom, removeSelectedRoom } from '../../redux/actions/talkActions';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function Home() {
    const rooms = useSelector((state)=>state.allRooms.rooms);
    const userData = useSelector((state)=>state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    useEffect(() => {
        fetchRooms()
        dispatch(removeSelectedRoom({}))
    }, [])
    const fetchRooms = async ()=>{
        Apicall('getTalks', {}).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if(res.status === 'success'){
                dispatch(setAllRooms(res.data))
            }
            console.log(res);
        })
    }
    const setCurrentRoom = async (val)=>{
        dispatch(currentRoom(val))
    }
    

    const [startTalkFlag, setStartTalkFlag] = useState(false);
    const [inputVal, setInputVal] = useState('');
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
                if (res.data.status === "succss") {
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

    const userContRen = rooms? rooms.map((x) => {
        return (
            <Link key={x._id} to='/talk'>
             <div  className="UserCont" onClick={()=>setCurrentRoom(x)}>
                <div className="UserDP">
                    <img src={logo} alt={x.roomName} />
                </div>
                <div className="UserTitle">
                    <div className='UserName'> {x.roomType === 'private' ? x.users[0].username : x.roomName}
                    </div>
                    {x.latestMsg &&
                    <div className='UserMsg'>{x.latestMsg.messageFrom.username} : {x.latestMsg.message} on {x.latestMsg.createdAt}
                    </div>
                    }
                </div>
                <div className="UserMsgCount">1000</div>
            </div>
            </Link>
           
        )
    }):"Loading...";
    return <div className="HomeContTotal">
        <div className="HomeCont">
            <div className="HomeTopCont">
                <div className="options"><ListTwoToneIcon sx={{ fontSize: 40, color: "white" }} /></div>
                <div className="title">{userData.username}'s Messages</div>
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