import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => (
  <div
    style={{
      background: '#dddddd',
      padding: '6px 8px 4px 8px',
      borderBottom: '2px solid #dedede',
      display: 'flex',
      alignItems: 'center', 
      gap: '8px'
    }}
  >
    <Link to="/" style={{ 
        color: 'purple', 
        textDecoration: 'underline'
    }}>blogs</Link>
    <Link to="/users" style={{ 
        color: 'purple', 
        textDecoration: 'underline' 
    }}>users</Link>
    {user &&
      <>
        <span style={{ color: 'black', marginRight: '6px' }}>
            {user.name} logged in
        </span>
        <button 
        onClick={handleLogout}
        style={{
            background: 'white',
            color: 'black',
            border: 'none', 
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '14px',
          }}
        
        >logout</button>
      </>
    }
  </div>
)

export default Navigation
