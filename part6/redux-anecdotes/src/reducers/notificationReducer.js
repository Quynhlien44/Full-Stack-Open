import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId
export const showNotification = (message, seconds) => {
    return dispatch => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        dispatch(setNotification(message))
        timeoutId = setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer