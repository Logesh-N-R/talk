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

export const socketData = (data) => {
    return {
        type: ActionTypes.SOCKET_DATA,
        payload: data,
    }
}
export const loaderSetting = (load) => {
    return {
        type: ActionTypes.IS_LOADING,
        status: load,
    }
}
export const appTypeSettings = (data) => {
    return {
        type: ActionTypes.IS_MOBILE,
        payload: data,
    }
}