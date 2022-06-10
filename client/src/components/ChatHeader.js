import { useCookies } from 'react-cookie'

const ChatHeader = (props) => {
  
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

  const logout = () => {
    removeCookie('UserId', cookies.UserId)
    removeCookie('AuthToken', cookies.AuthToken)
    window.location.reload()
  }

  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="image-container">
          <img src={props.user.url} alt="profile"></img>
        </div>
        <h3>{props.user.user_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout}>⌫</i>
    </div>
  )
}

export default ChatHeader