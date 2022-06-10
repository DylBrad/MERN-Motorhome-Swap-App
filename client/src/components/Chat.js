const Chat = (props) => {
  return (
    <div className="chat-display">
      {props.sortedMessages.map((message, _index) => (
        <div key={_index}>
          <div className="chat-message-header">
            <div className="image-container">
              <img src={message.img} alt={message.name} />
            </div>
            <p>{message.name}</p>
          </div>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Chat