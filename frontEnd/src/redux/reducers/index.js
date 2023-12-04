import {combineReducers} from 'redux'
import { roomsReducer,selectedRoomReducer,currentRoomReducer, setUserReducer, updateTalkReducer, socketReducer, loadingReducer } from './talkReducer'

export const rootReducer = combineReducers({
    allRooms:roomsReducer,
    selectedRoom:selectedRoomReducer,
    currentRoom:currentRoomReducer,
    user:setUserReducer,
    updateTalk:updateTalkReducer,
    socket:socketReducer,
    isLoading:loadingReducer
})