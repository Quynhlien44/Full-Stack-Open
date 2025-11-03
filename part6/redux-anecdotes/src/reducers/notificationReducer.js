import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        set(state, action) {
            return action.payload
        },
        clear(state, action) {
            return ''
        }
    }
})

let timeoutID
export const setNotification = (message, seconds = 5) => {
    return dispatch => {
        dispatch(set(message))
        if (timeoutID) {
            clearTimeout(timeoutID)
        }
        timeoutID = setTimeout(() => {
            dispatch(clear())
        }, seconds * 1000)
    }
}

export const { set, clear } = notificationSlice.actions
export default notificationSlice.reducer
