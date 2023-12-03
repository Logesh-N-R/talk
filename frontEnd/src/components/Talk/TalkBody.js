import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Apicall from '../Apicall'
import { selectedRoom, updateTalk } from '../../redux/actions/talkActions'
import { useNavigate } from 'react-router'
// SOC KET
import ENV from "../../data/env"
import io from "socket.io-client";
// var socket;
const socket = io.connect(ENV.serverEndPoint)


export default function TalkBody() {
    const navigate = useNavigate()
    const talk = useSelector((state) => state.selectedRoom.room)
    const currentRoom = useSelector((state) => state.currentRoom)
    const user = useSelector((state) => state.user)
    const updatePage = useSelector((state) => state.updateTalk)
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null)


    useEffect(() => {
        // socket = io(ENV.serverEndPoint);
        socket.emit('new_room', currentRoom._id);
        socket.emit('join_room', currentRoom._id)

    }, [])

    useEffect(() => {
        socket.on('messageReceived', (data) => {
            dispatch(updateTalk(true))
        })
        scrollToBottom()
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        fetchRoomData(currentRoom._id)
    }, [updatePage]);
    const fetchRoomData = async (id) => {
        Apicall('getMsg', { roomId: id }).then((res) => {
            if (res?.redirect) {
                navigate(res.redirectTo)
            }
            if (res.status === 'success' && res.data) {
                dispatch(selectedRoom(res.data))
            }
        })
    }
    const talkValEle = (talk?.length > 0) ? talk.map(x => {
        return (
            <div key={x._id} className={(x.messageFrom._id === user._id) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={x.messageFrom.profile} />
                <div className={(x.messageFrom._id === user._id) ? 'ActivePerson' : 'OtherPerson'}>
                    <div className="talkContent userTitileLableSmall">{x.messageFrom.username}</div>
                    <div className="talkContent">{x.message}</div>
                    <div className='talkContentMore'>
                        <div className="talkMoreDetails">{x.createdAt}</div>
                        {/* <div className="tick">{x.tick}</div> */}
                    </div>
                </div>
            </div>
        )
    }) : "start..."
    return (<div className="TalkBodyContainer">
        <div className="TalkBodyContent">
            {talkValEle}
        </div>
        <div ref={messagesEndRef} />

    </div>)
}

