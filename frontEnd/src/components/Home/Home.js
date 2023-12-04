import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useState } from "react"
import Apicall from '../Apicall';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { selectedRoom, setAllRooms, currentRoom, removeSelectedRoom, socketData, setUserData, updateTalk, loaderSetting } from '../../redux/actions/talkActions';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { socket } from '../../socket'
import Talk from '../Talk/Talk';


export default function Home() {
    const rooms = useSelector((state) => state.allRooms.rooms);
    const curRoom = useSelector((state) => state.currentRoom)
    const userData = useSelector((state) => state.user);
    const updatePage = useSelector((state) => state.updateTalk)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    useEffect(() => {
        if (!userData.username) {
            Apicall('auth', {}).then((res) => {
                dispatch(setUserData(res.data))
                if (res?.redirect) {
                    navigate(res.redirectTo)
                }
            })
        }
    }, [rooms])
    useEffect(() => {
        function onConnect() {
            dispatch(socketData({ connected: true }));
        }
        function onDisconnect() {
            dispatch(socketData({ connected: false }));
        }
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);


    useEffect(() => {
        fetchRooms()
        dispatch(removeSelectedRoom({}))
    }, [])
    const fetchRooms = async () => {
        dispatch(loaderSetting(true));
        Apicall('getTalks', {}).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res.status === 'success') {
                dispatch(setAllRooms(res.data))
                fetchRoomData(res.data[0]._id)
                dispatch(currentRoom(res.data[0]))
            }
        })
    }
    const setCurrentRoom = async (val) => {
        dispatch(loaderSetting(true));
        dispatch(removeSelectedRoom({}))
        dispatch(currentRoom(val))
        fetchRoomData(val._id)
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


    useEffect(() => {
        socket.emit('new_room', curRoom._id);
        socket.emit('join_room', curRoom._id)
    }, [])

    useEffect(() => {
        socket.on('messageReceived', (data) => {
            dispatch(updateTalk(true))
        })
    })

    useEffect(() => {
        fetchRooms()
        fetchRoomData(curRoom._id)
    }, [updatePage]);

    const fetchRoomData = async (id) => {
        Apicall('getMsg', { roomId: id }).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res.status === 'success' && res.data) {
                dispatch(selectedRoom(res.data))
                dispatch(loaderSetting(false));
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

    const userContRen = rooms ? rooms.map((x) => {
        return (
            <div className="UserCont" key={x._id} onClick={() => setCurrentRoom(x)}>
                <div className="UserDP" style={{
                    backgroundImage: `url(${x.isGrp ? "https://as2.ftcdn.net/v2/jpg/03/78/40/51/1000_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg" : "https://as1.ftcdn.net/v2/jpg/05/20/52/44/1000_F_520524442_vYtVIoJJtMjSCUc9CMhiA9xpFfmaLOBH.jpg"})`
                }} >
                </div>
                <div className="UserTitle">
                    <div className='UserName'> {x.isGrp ? x.roomName : x.users.filter((user)=>user._id !== userData._id)[0].username}
                    </div>
                    {x.latestMsg &&
                        <div className='UserMsg'>{x.latestMsg.messageFrom.username} : {x.latestMsg.message} on {x.latestMsg.createdAt}
                        </div>
                    }
                </div>
                <div className="UserMsgCount">new</div>
            </div>
        )
    }) : "";
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
        <div className='TalkContent'>
            <Talk />
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