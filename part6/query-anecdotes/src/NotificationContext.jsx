import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW':
            return action.payload
        case 'HIDE':
            return null
        default:
            return state
    }
}

export const showNotification = (dispatch, message) => {
    dispatch({ type: 'SHOW', payload: message })
    setTimeout(() => {
        dispatch({ type: 'HIDE' })
    }, 5000)
}


const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, null)
    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
