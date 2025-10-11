const Notification = ({ notification }) => {
    if (!notification) return null
    const className =
        notification.type === 'error'
            ? 'notification-error'
            : 'notification-success'
    return <div className={className}>{notification.message}</div>
}
export default Notification
