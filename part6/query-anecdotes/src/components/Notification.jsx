import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const [notification] = useContext(NotificationContext)
  if (!notification) return null
  return <div style={{ border: '1px solid black', padding: 10 }}>{notification}</div>
}

export default Notification
