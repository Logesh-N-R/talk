import ListTwoToneIcon from '@mui/icons-material/ListTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useRef, useState } from "react"
import Apicall from '../Apicall';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { selectedRoom, setAllRooms, currentRoom, removeSelectedRoom, socketData, setUserData, updateTalk, loaderSetting, appTypeSettings } from '../../redux/actions/talkActions';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

import { socket } from '../../socket'
import Talk from '../Talk/Talk';


export default function Home() {
    const rooms = useSelector((state) => state.allRooms.rooms);
    const curRoom = useSelector((state) => state.currentRoom)
    const userData = useSelector((state) => state.user);
    const updatePage = useSelector((state) => state.updateTalk)
    const { screen, current } = useSelector((state) => state.appType)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(appTypeSettings({ current: "HOME", screen: getWindowDimensions() }))
        dispatch(removeSelectedRoom({}))
        fetchRooms()
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
        socket.on('messageReceived', (data) => {
            dispatch(updateTalk(true))
        })
    })

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
        fetchRooms()
        fetchRoomData(curRoom._id)
    }, [updatePage]);

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const fetchRooms = async (updateCurrentRoom = true) => {
        // dispatch(loaderSetting(true));
        Apicall('getTalks', {}).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res.status === 'success') {
                dispatch(setAllRooms(res.data))
                socket.emit('new_room', res.data[0]._id);
                socket.emit('join_room', res.data[0]._id)
                if (updateCurrentRoom) {
                    fetchRoomData(res.data[0]._id)
                    dispatch(currentRoom(res.data[0]))
                }
                socket.emit('new_room', res.data[0]._id);
                socket.emit('join_room', res.data[0]._id)
            }
        })
    }

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

    const setCurrentRoom = async (val) => {
        allMenuClose();
        dispatch(removeSelectedRoom({}))
        dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
        dispatch(currentRoom(val))
        socket.emit('new_room', val._id);
        socket.emit('join_room', val._id)
        fetchRoomData(val._id)
    }

    // Group creation and start chat
    const [startFlag, setStartFlag] = useState(false);
    const [startTalkFlag, setStartTalkFlag] = useState(false);
    const [smallMenu, setSmallMenu] = useState(false);
    const [inputVal, setInputVal] = useState('');


    function addContact(type) {
        allMenuClose()
        if (type === 'single') {
            setStartFlag(true)
            setStartTalkFlag(true)
        }
        if (type === 'group') {
            setStartFlag(true)
            setStartTalkFlag(false)
        }
        if (type === 'activate') {
            multiSelectRef.current.resetSelectedValues();
            setSmallMenu(!smallMenu)
        }

    }
    // Create group and start chat option 
    // multi select for group creation
    // refer
    // https://www.npmjs.com/package/multiselect-react-dropdown
    const [options, setOptions] = useState([])
    const [choosedOptions, setChoosedOptions] = useState([])
    const multiSelectRef = useRef()
    function searchData(val) {
        if (val.length > 0) {
            Apicall('allUser', { search: val }).then((res) => {
                if (res.status === 'success' && res.data) {
                    console.log(res.data.users)
                    setOptions(res.data.users)
                }
            })
        }
    }
    // const [selectedValue, setSelectedValue] = useState([])
    // function onRemove(selectedList, removedItem) {}
    // function onSelect(selectedList, selectedItem) {}
    function update(selectedList) {
        setChoosedOptions(selectedList)
    }

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
        if (startTalkFlag) {
            if (choosedOptions?.length > 0 && startTalkFlag) {
                let roomInput = {};
                roomInput.userId = choosedOptions[0]._id
                Apicall('startRoomOOO', roomInput).then((res) => {
                    console.log(res)
                    if (res.status == "success") {
                        fetchRooms(false)
                        dispatch(currentRoom(res.data?.roomData[0]))
                        dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
                        dispatch(loaderSetting(false));
                    }
                    allMenuClose();
                })
            } else {
                toast.warn("Empty input found!")
            }
        }
        if (!startTalkFlag) {
            const val = document.getElementById("startMsgInput").value;
            if (val != "" && choosedOptions?.length > 0 && !startTalkFlag) {
                let roomInput = {};
                roomInput.name = val;
                roomInput.users = choosedOptions
                Apicall('startRoomGrp', roomInput).then((res) => {
                    if (res?.status === "success") {
                        console.log(res)
                        fetchRooms(false)
                        dispatch(currentRoom(res.data))
                        dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
                        dispatch(loaderSetting(false));
                    }
                    allMenuClose();
                    setInputVal("");
                })
            } else {
                toast.warn("Empty input found!")
            }
        }

    }


    // more options process rename and add,remove group members
    const [optionFlg, setOptionFlag] = useState({ status: false });
    const [editOptionFlag, setEditOptionFlag] = useState({ status: false });
    // const [renameGrp, setRenameGrp] = useState({ status: true });
    // const [addToGrp, setAddToGrp] = useState({ status: true });
    // const [removeGrpUser, setRemoveGrpUser] = useState({ status: true });

    function optionsMenu(event, id) {
        event.stopPropagation();
        // allMenuClose();
        setOptionFlag({ status: true, id })
    }
    function choosedOption(event, type = "", id, users) {
        event.stopPropagation()
        // allMenuClose()
        if (type != "") {
            setEditOptionFlag({ status: true, type, id, users })
        }
    }
    function editMenu() {
        if (editOptionFlag?.type) {
            switch (editOptionFlag.type) {
                case "Rename Group":
                    const grpName = document.getElementById("optionInput").value;
                    if (grpName != "" && grpName.length > 0) {
                        let roomInput = {};
                        roomInput.name = grpName;
                        roomInput.roomId = editOptionFlag.id
                        Apicall('renameGrp', roomInput).then((res) => {
                            if (res?.status === "success") {
                                fetchRooms(false)
                                dispatch(currentRoom(res.data))
                                dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
                                dispatch(loaderSetting(false));
                            }
                            allMenuClose();
                        })
                    } else {
                        toast.warn("Empty input found!")
                    }
                    return
                case "Add users":
                    if (choosedOptions?.length > 0) {
                        let roomInput = {};
                        roomInput.roomId = editOptionFlag.id;
                        roomInput.userId = choosedOptions
                        Apicall('addUser', roomInput).then((res) => {
                            if (res?.status === "success") {
                                fetchRooms()
                                dispatch(currentRoom(res.data))
                                dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
                                dispatch(loaderSetting(false));
                            }
                            allMenuClose();
                            setInputVal("");
                        })
                    } else {
                        toast.warn("Empty input found!")
                    }
                    return
                case "Remove user":
                    if (choosedOptions?.length > 0) {
                        let roomInput = {};
                        roomInput.roomId = editOptionFlag.id;
                        roomInput.userId = choosedOptions[0]._id
                        console.log(roomInput)

                        Apicall('removeUser', roomInput).then((res) => {
                            if (res?.status === "success") {
                                fetchRooms()
                                dispatch(currentRoom(res.data))
                                dispatch(appTypeSettings({ current: "TALK", screen: getWindowDimensions() }))
                                dispatch(loaderSetting(false));
                            }
                            allMenuClose();
                            setInputVal("");
                        })
                    } else {
                        toast.warn("Empty input found!")
                    }
                    return
            }
        }
    }

    // Extra popup remove function
    function allMenuClose() {
        setSmallMenu(false);
        setStartFlag(false);
        setOptionFlag({ status: false })
        setEditOptionFlag({ status: false })
        multiSelectRef.current?.resetSelectedValues([]);
    }

    // log out
    function logout(){
        Apicall('logOut', {}).then((res) => {
            toast.success(`See you soon ${userData.username}`);
            navigate("/login")
        })
    }

    const userContRen = rooms ? rooms.map((x) => {
        return (
            <div className="UserCont" key={x._id} onClick={() => setCurrentRoom(x)}>
                <div className="UserDP" style={{
                    backgroundImage: `url(${x.isGrp ? "https://as2.ftcdn.net/v2/jpg/03/78/40/51/1000_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg" : "https://as1.ftcdn.net/v2/jpg/05/20/52/44/1000_F_520524442_vYtVIoJJtMjSCUc9CMhiA9xpFfmaLOBH.jpg"})`
                }} >
                </div>
                <div className="UserTitle">
                    <div className='UserName'> {x.isGrp ? x.roomName : x.users.filter((user) => user._id !== userData._id)[0].username}
                    </div>
                    {x.latestMsg &&
                        <div className='UserMsg'>{x.latestMsg.messageFrom.username} : {x.latestMsg.message} on {x.latestMsg.createdAt}
                        </div>
                    }
                </div>
                <div className="UserMsgCount">new</div>
                {x.isGrp &&
                    <div className="UserMsgOptions" onClick={(e) => optionsMenu(e, x._id)}>
                        <TuneTwoToneIcon sx={{ fontSize: 20, color: "black" }} />
                    </div>
                }
                {optionFlg?.status && optionFlg.id == x._id &&
                    <div style={{ top: optionFlg.top, left: optionFlg.left }} className='optionsCont'>
                        <li onClick={(e) => choosedOption(e, "Rename Group", x._id, x.users)}>Rename Group</li>
                        <li onClick={(e) => choosedOption(e, "Add users", x._id, x.users)}>Add users</li>
                        <li onClick={(e) => choosedOption(e, "Remove user", x._id, x.users)}>Remove user</li>
                    </div>
                }
            </div>
        )
    }) : "";


    return (
        <div className={(screen && screen.width < 700) ? "fullSize HomeContTotal" : "HomeContTotal"}>
            <div className={(screen && screen.width < 700 && current == "TALK") ? "displayNone" : "HomeCont"}>
                <div className="HomeTopCont">
                    {/* <div className="options"><ListTwoToneIcon sx={{ fontSize: 40, color: "white" }} /></div> */}
                    <div className="title">{userData.username}'s Messages</div>
                    {/* <div className="search"><SearchIcon sx={{ fontSize: 40, color: "white" }} /></div> */}
                    <div className="search" onClick={logout} title='Log out'><ManageAccountsTwoToneIcon sx={{ fontSize: 40, color: "white" }} /></div>
                </div>
                <div className="HomebodyCont">
                    {userContRen}
                </div>


            </div>
            <div className={(screen && screen.width < 700 && current == "HOME") ? "displayNone" : "TalkContent"}>
                <Talk />
            </div>



            {/* START CHAT AND GROUP CREATION */}
            <div className={current == "TALK"?"displayNone AddUser":"AddUser"} onClick={() => addContact('activate')} title="Add contact">
                <PersonAddAltTwoToneIcon sx={{ fontSize: 20, color: "grey" }} />
            </div>
            {smallMenu &&
                <div className="selectOption">
                    <li onClick={() => addContact('single')}>Start chatting</li>
                    <li onClick={() => addContact('group')}>Create Group</li>
                </div>
            }
            <div className={startFlag ? 'startTalkCont' : 'displayNone'}>
                <div className='title'>Add Contact</div>
                {!startTalkFlag &&
                    <div className='titleContainer'>
                        <label className='selectLable'>{!startTalkFlag && "Group Name"}</label>
                        <input className='addUserInput' id="startMsgInput" placeholder="Enter group name" autoFocus onChange={handleChange} onKeyDownCapture={onKeyDown} type="email" value={inputVal} />
                    </div>
                }
                <div className='titleContainer'>
                    <label className='selectLable'>{startTalkFlag ? "Choose user" : "Select users"}</label>
                    <Multiselect
                        options={options} // Options to display in the dropdown
                        // selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={update} // Function will trigger on select event
                        onRemove={update} // Function will trigger on remove event
                        onSearch={searchData}
                        selectionLimit={!startTalkFlag ? -1 : 1}
                        ref={multiSelectRef}
                        placeholder="Search for users"
                        closeOnSelect
                        showCheckbox
                        displayValue="username" // Property name to display in the dropdown options
                    />
                </div>
                <div className='btnCont'>
                    <div className="UserInputBtn" onClick={startTalk}>{!startTalkFlag ? "Start Group" : "Chat"}</div>
                    <div className="UserInputBtn" onClick={allMenuClose}>Cancel</div>
                </div>
            </div>
            {/* START CHAT AND GROUP CREATION */}

            {/* RENAME, Add users, REMOVE USER */}

            <div className={editOptionFlag?.status ? 'startTalkCont' : 'displayNone'}>
                <div className='title'>{editOptionFlag.type}</div>
                {editOptionFlag?.status && editOptionFlag.type == "Rename Group" &&
                    <div className='titleContainer'>
                        <label className='selectLable'>New name</label>
                        <input className='addUserInput' id="optionInput" placeholder="Enter group name" autoFocus onChange={handleChange} onKeyDownCapture={onKeyDown} type="email" value={inputVal} />
                    </div>
                }
                {editOptionFlag?.status && editOptionFlag.type != "Rename Group" &&
                    <div className='titleContainer'>
                        <label className='selectLable'>{"Select users"}</label>
                        <Multiselect
                            options={(editOptionFlag.type == "Remove user") ? editOptionFlag?.users : options} // Options to display in the dropdown
                            selectedValues={(editOptionFlag.type == "Add users") ? editOptionFlag?.users : ""} // Preselected value to persist in dropdown
                            disablePreSelectedValues={(editOptionFlag.type == "Add users")}
                            onSelect={update} // Function will trigger on select event
                            onRemove={update} // Function will trigger on remove event
                            onSearch={(editOptionFlag.type == "Add users") && searchData}
                            selectionLimit={(editOptionFlag.type != "Add users") ? 1 : -1}
                            ref={multiSelectRef}
                            placeholder="Search for users"
                            showCheckbox
                            closeOnSelect
                            displayValue="username" // Property name to display in the dropdown options
                        />
                    </div>
                }
                <div className='btnCont'>
                    <div className="UserInputBtn" onClick={editMenu}>{editOptionFlag.type}</div>
                    <div className="UserInputBtn" onClick={allMenuClose}>Cancel</div>
                </div>
            </div>
            {/* RENAME, Add users, REMOVE USER */}

        </div>)
}
