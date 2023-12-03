import { ActionTypes } from "../constants/actionTypes"
export const setAllRooms = (rooms) => {
    return {
        type: ActionTypes.SET_ALL_ROOMS,
        payload: rooms
    }
}
export const selectedRoom = (room) => {
    return {
        type: ActionTypes.SELECTED_ROOM,
        payload: room,
    }
}

export const removeSelectedRoom = () => {
    return {
        type: ActionTypes.REMOVE_SELECTED_ROOM
    }
}
export const currentRoom = (id) => {
    return {
        type: ActionTypes.CURRENT_ROOM,
        payload: id,
    }
}
export const setUserData = (userInput) => {
    return {
        type: ActionTypes.SET_USER,
        payload: userInput,
    }
}
export const updateTalk = (changeStatus) => {
    return {
        type: ActionTypes.UPDATE_TALK,
        payload: changeStatus,
    }
}