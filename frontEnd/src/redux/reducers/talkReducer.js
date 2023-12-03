import { ActionTypes } from "../constants/actionTypes"

const initialState = {
}
export const roomsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_ALL_ROOMS:
            return { ...state,rooms:payload }
        default:
            return state
    }

}
export const currentRoomReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SELECTED_ROOM:
            return { ...state,currentRoom:(state.allRooms.filter((x)=>x._id==payload)) }
        default:
            return state
    }

}

export const selectedRoomReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SELECTED_ROOM:
            return { ...state, room:payload }
        default:
            return state
    }

}
