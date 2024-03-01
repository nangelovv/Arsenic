import React, { useContext, useEffect } from 'react'
import { StateContext } from '../mainNav';


export default function RenderMessages() {
  const {
    allChatsMessages,
    currentChatInfo,
  } = useContext(StateContext)

  // Use useEffect to scroll to the bottom after rendering
  useEffect(() => {
    const len = allChatsMessages[currentChatInfo.chat_id]?.length
    if (len) {
      const element = document.getElementById(allChatsMessages[currentChatInfo.chat_id][len - 1].message_id)
      // Scroll to the bottom when the component is first rendered
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [allChatsMessages]);

  return (
    <section style={{marginBottom: '70px', marginTop: '70px'}}>
      {allChatsMessages[currentChatInfo.chat_id]?.map((message, index) => (
        <div className='row' key={index} id={message.message_id}>
          <div className='col-12'>
            <div
              style={message.sender_id != currentChatInfo.user_id
                ? {background: 'var(--md-sys-color-secondary-container)'}
                : {background: 'var(--md-sys-color-tertiary-container)'}
              }
              className={message.sender_id == currentChatInfo.user_id
                ? 'm-1 p-3 rounded-5 col float-start max-width-7-columns'
                : 'm-1 p-3 rounded-5 col float-end max-width-7-columns'
              }
            >
              <span>{message.message}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
