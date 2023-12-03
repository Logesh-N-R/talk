import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Apicall from '../Apicall'
import { selectedRoom } from '../../redux/actions/talkActions'
import { useNavigate } from 'react-router'

export default function TalkBody() {
    const navigate = useNavigate()
    const talk = useSelector((state)=>state.selectedRoom.room)
    const currentRoom = useSelector((state)=>state.currentRoom)
    const updateTalk = useSelector((state)=>state.updateTalk)
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        console.log(messagesEndRef)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        fetchRoomData(currentRoom._id)
        scrollToBottom()
    }, [updateTalk]);
    const fetchRoomData = async (id)=>{
        Apicall('getMsg', {roomId:id}).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if(res.status === 'success' && res.data){
                dispatch(selectedRoom(res.data))
            }
        })
    }
    const user_id = "656b34c92fbe54cfdb9c3fd4";
    const talkValEle =(talk?.length>0) ?  talk.map(x => {
        return (
            <div key={x._id} className={(x.messageFrom._id === user_id) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={x.messageFrom.profile} />
                <div className={(x.messageFrom._id === user_id) ? 'ActivePerson' : 'OtherPerson'}>
                    <div className="talkContent userTitileLableSmall">{x.messageFrom.username}</div>
                    <div className="talkContent">{x.message}</div>
                    <div className='talkContentMore'>
                        <div className="talkMoreDetails">{x.createdAt}</div>
                        {/* <div className="tick">{x.tick}</div> */}
                    </div>
                </div>
            </div>
        )
    }):"start..."
    return (<div className="TalkBodyContainer">
        <div className="TalkBodyContent">
            {talkValEle}
        </div>
        <div ref={messagesEndRef} />

    </div>)
}

