import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function TalkBody() {
    const talk = useSelector((state)=>state.selectedRoom.room)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        console.log(messagesEndRef)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [talk]);

    const user_id = "656b34c92fbe54cfdb9c3fd4";
    const talkValEle =(talk?.length>0) ?  talk.map(x => {
        return (
            <div key={x._id} className={(x.messageFrom._id == user_id) ? 'ActivePersonCont' : 'OtherPersonCont'}>
                <img className='talkImage' src={x.messageFrom.profile} />
                <div className={(x.messageFrom._id == user_id) ? 'ActivePerson' : 'OtherPerson'}>
                    <div className="talkContent userTitileLableSmall">{x.messageFrom.username}</div>
                    <div className="talkContent">{x.message}</div>
                    <div className='talkContentMore'>
                        <div className="talkMoreDetails">{x.createdAt}</div>
                        {/* <div className="tick">{x.tick}</div> */}
                    </div>
                </div>
            </div>
        )
    }):"NO CHAT YET"
    return (<div className="TalkBodyContainer">
        <div className="TalkBodyContent">
            {talkValEle}
        </div>
        <div ref={messagesEndRef} />

    </div>)
}

