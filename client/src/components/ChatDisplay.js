import axios from 'axios'
import Chat from './Chat.js'
import ChatInput from './ChatInput.js'
import React, { useEffect } from 'react'

const ChatDisplay = (props) => {

  const [ userMessages, setUserMessages ] = React.useState(null)
  const [ clickedUserMessages, setClickedUserMessages ] = React.useState(null)

  const userId = props.user?.user_id
  const clickedUserId = props.clickedUser?.user_id

  const getUserMessages = async () => {

    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: userId, matchedUserId: clickedUserId}
      })
      setUserMessages(response.data)
    } 
      catch (error) {
      console.log(error)
    }
  } 

  const getClickedUserMessages = async () => {

    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: clickedUserId, matchedUserId: userId}
      })
      setClickedUserMessages(response.data)
    } 
      catch (error) {
      console.log(error)
    }
  } 

  useEffect(() => {
    getUserMessages()
    getClickedUserMessages()
  }, [userMessages, clickedUserMessages])

  const messages = []

  userMessages?.forEach((message) => {
    const formattedMessage = {}
    formattedMessage['name'] = props.user?.user_name
    formattedMessage['img'] = props.user?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
    messages.push(formattedMessage)
  })
  clickedUserMessages?.forEach((message) => {
    const formattedMessage = {}
    formattedMessage['name'] = props.clickedUser?.user_name
    formattedMessage['img'] = props.clickedUser?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
    messages.push(formattedMessage)
  })

  const sortedMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  return (
    <div>
      <Chat sortedMessages={sortedMessages} />
      <ChatInput 
        user={props.user} 
        clickedUser={props.clickedUser} 
        getUserMessages={getUserMessages} 
        getClickedUserMessages={getClickedUserMessages}
      />
    </div>
  )
}

export default ChatDisplay