import React, { useState, useRef, useEffect } from 'react'
import logo from "../../images/logo.svg"

export default function TalkBody(props) {
    console.log("total user:", props)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        console.log(messagesEndRef)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [props.data.talk]);

    const talkValEle = props.data.talk.map(x => {
        return (
            <div key={x.msg_id} className={(x.user_id == props.user) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={logo} />
                <div className={(x.user_id == props.user) ? 'ActivePerson' : 'OtherPerson'}>
                    <div className="talkContent">{x.msg}</div>
                    <div className='talkContentMore'>
                        <div className="talkMoreDetails">{x.datetime}</div>
                        {/* <div className="tick">{x.tick}</div> */}
                    </div>
                </div>
            </div>
        )
    })
    return (<div className="TalkBodyContainer">
        <div className="TalkBodyContent">
            {talkValEle}
            <h1>user:{props.user}</h1>
            <h1>other user:{props.otherUser}</h1>
            <h1>room:{props.room}</h1>
        </div>
        <div ref={messagesEndRef} />

    </div>)
}

