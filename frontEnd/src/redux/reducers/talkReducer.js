import { ActionTypes } from "../constants/actionTypes"

const initialState = {
}
export const roomsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_ALL_ROOMS:
            return { ...state, rooms: payload }
        default:
            return state
    }

}
export const currentRoomReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.CURRENT_ROOM:
            return { ...state, ...payload }
        default:
            return state
    }

}

export const selectedRoomReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SELECTED_ROOM:
            return { ...state, room: payload }
        case ActionTypes.REMOVE_SELECTED_ROOM:
            return { ...state, room: [] }
        default:
            return state
    }

}

export const setUserReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_USER:
            return { ...state, ...payload }
        default:
            return state
    }

}


export const updateTalkReducer = (state = false, { type, payload }) => {
    switch (type) {
        case ActionTypes.UPDATE_TALK:
            return { ...state, ...payload }
        default:
            return state
    }

}

export const socketReducer = (state = false, { type, payload }) => {
    switch (type) {
        case ActionTypes.SOCKET_DATA:
            return { ...state, ...payload }
        default:
            return state
    }

}

export const loadingReducer = (state = false, { type, status }) => {
    switch (type) {
        case ActionTypes.IS_LOADING:
            return { status }
        default:
            return state
    }

}
export const appTypeReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case ActionTypes.IS_MOBILE:
            return {...payload }
        default:
            return state
    }

}