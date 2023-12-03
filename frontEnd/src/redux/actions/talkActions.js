import { ActionTypes } from "../constants/actionTypes"
export const setAllRooms = (rooms)=>{
    return{
        type:ActionTypes.SET_ALL_ROOMS,
        payload:rooms
    }
}
export const selectedRoom = (room)=>{
    return{
        type:ActionTypes.SELECTED_ROOM,
        payload:room,
    }
}

export const currentRoom = (id)=>{
    return{
        type:ActionTypes.CURRENT_ROOM,
        payload:id,
    }
}