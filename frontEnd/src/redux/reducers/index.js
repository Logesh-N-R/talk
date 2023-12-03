import {combineReducers} from 'redux'
import { roomsReducer,selectedRoomReducer,currentRoomReducer } from './talkReducer'

export const rootReducer = combineReducers({
    allRooms:roomsReducer,
    selectedRoom:selectedRoomReducer,
    currentRoom:currentRoomReducer
})