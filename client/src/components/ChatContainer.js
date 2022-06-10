import ChatHeader from "./ChatHeader"
import ChatDisplay from "./ChatDisplay"
import MatchesDisplay from "./MatchesDisplay"
import React from 'react'

const ChatContainer = (props) => {

  const [ clickedUser, setClickedUser ] = React.useState(null)

  return (
    <div className="chat-container">
      <ChatHeader user={props.user} />
      
      <div>
        <button className="option" onClick={() => setClickedUser(null)}>Matches</button>
        <button className="option" disabled={!clickedUser}>Chats</button>
      </div>

      {!clickedUser && <MatchesDisplay matches={props.user.matches} setClickedUser={setClickedUser} />}
      
      {clickedUser && <ChatDisplay user={props.user} clickedUser={clickedUser} />}
    </div>
  )
}

export default ChatContainer