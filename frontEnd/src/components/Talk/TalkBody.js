import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Apicall from '../Apicall'
import { selectedRoom, updateTalk } from '../../redux/actions/talkActions'
import { useNavigate } from 'react-router'
import {socket} from '../../socket'

export default function TalkBody() {
    const talk = useSelector((state) => state.selectedRoom.room)
    const user = useSelector((state) => state.user)
    const messagesEndRef = useRef(null)
    useEffect(() => {
        scrollToBottom()
    }, [talk])
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    
    const talkValEle = (talk?.length > 0) ? talk.map(x => {
        return (
            <div key={x._id} className={(x.messageFrom._id === user._id) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={x.messageFrom.profile} alt={x.messageFrom.username}/>
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
    }) : ""
    return (<div className="TalkBodyContainer">
        <div className="TalkBodyContent">
            {talkValEle}
        </div>
        <div ref={messagesEndRef} />

    </div>)
}

