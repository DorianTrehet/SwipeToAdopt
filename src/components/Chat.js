// Chat.js
import React, { useState } from 'react';

const Chat = () => {
  // State to store the list of messages
  const [messages, setMessages] = useState([]);
  // State to store the current message input
  const [input, setInput] = useState('');

  // Function to handle sending a message
  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, id: messages.length }]);
      setInput(''); // Clear the input after sending
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      
      {/* Display the list of messages */}
      <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      
      {/* Input field to type new messages */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '80%', padding: '10px', marginRight: '10px' }}
      />
      
      {/* Button to send message */}
      <button onClick={sendMessage} style={{ padding: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
