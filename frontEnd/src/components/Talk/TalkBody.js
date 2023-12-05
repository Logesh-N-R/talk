import React, { useRef, useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
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
    const dateOption = {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
    }
    function randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var color = 'rgb(' + r + ',' + g + ',' + b + ')';
        return(color);
      }
      var allId = []
      var colors = {}

    const talkValEle = (talk?.length > 0) ? talk.map(x => {
        if(!(allId?.includes(x.messageFrom._id))){
            colors[x.messageFrom._id]=randomColor();
            allId.push(x.messageFrom._id)
        }
        console.log(colors)
        let currentDate = x.createdAt && new Date(x.createdAt).toLocaleString('en-IN', dateOption)
        return (
            <div title={currentDate} key={x._id}  className={(x.messageFrom._id === user._id) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={x.messageFrom.profile} alt={x.messageFrom.username} />
                <div className={(x.messageFrom._id === user._id) ? 'ActivePerson' : 'OtherPerson'}>
                    <div className="userTitileLableSmall" style={{color:colors[x.messageFrom._id]}}>{x.messageFrom.username}</div>
                    <div className="talkContent">{x.message}</div>
                    {/* <div className='talkContentMore'>
                        <div className="talkMoreDetails">{currentDate}</div>
                        <div className="tick">{x.tick}</div>
                    </div> */}
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

