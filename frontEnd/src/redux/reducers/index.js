import {combineReducers} from 'redux'
import { roomsReducer,selectedRoomReducer,currentRoomReducer, setUserReducer, updateTalkReducer } from './talkReducer'

export const rootReducer = combineReducers({
    allRooms:roomsReducer,
    selectedRoom:selectedRoomReducer,
    currentRoom:currentRoomReducer,
    user:setUserReducer,
    updateTalk:updateTalkReducer
})