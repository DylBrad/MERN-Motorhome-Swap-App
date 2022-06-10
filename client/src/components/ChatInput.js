import axios from 'axios'
import React from 'react'

const ChatInput = (props) => {
  const [ textArea, setTextArea ] = React.useState("")
  const userId = props.user?.user_id
  const clickedUserId = props.clickedUser?.user_id

  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: clickedUserId,
      message: textArea
    }

    try {
      console.log("sent")
      setTextArea("")
      await axios.post('http://localhost:8000/message', {message})
      props.getUsermessages()
      props.getClickedUsermessages()
      console.log("definitely sent")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="chat-input">
      <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)} />
      <button className="secondary-button" onClick={addMessage}>Submit</button>
    </div>
  )
}

export default ChatInput