import React, { useContext } from 'react'
import { StateContext } from '../MainFeed';
import noUserImage from '../common/noUser.jpg';
import { transformTime } from '../common/postFuncs';
import { getChat } from '../common/profileFuncs';


export default function RenderChats() {
  const {
    setShowProfileModal,
    showChatModal, setShowChatModal,
    messageIDs, setMessageIDs,
    chatsGlimpse,
    allChatsMessages, setAllChatsMessages,
    setCurrentChatInfo
  } = useContext(StateContext)

  return (
    Object.values(chatsGlimpse).sort((a, b) => parseInt(b.last_updated) - parseInt(a.last_updated))?.map((chat, index) => (
      <React.Fragment key={index}>
        <section
          className='position-relative rounded-4 py-2' 
          role='button'
          onClick={() => {
            setCurrentChatInfo(chat);
            setShowChatModal(true);
            getChat({
              chatID: chat.chat_id,
              allChatsMessages: allChatsMessages,
              setAllChatsMessages: setAllChatsMessages,
              messageIDs: messageIDs,
              setMessageIDs: setMessageIDs
            })
            
          }}
        >
          <md-ripple></md-ripple>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col-sm-2 col-4 text-center'>
                  <img
                    style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                    src={chat.profile_picture ? chat.profile_picture : noUserImage}
                    alt='Glimpse profile'
                  />
                </div>

                <span className='col d-flex align-items-center fs-5 text-break'>{chat.username}</span>

              </div>

            <span className='offset-2 my-2'>{chat.last_message.substring(0, 50)} &#9702; {transformTime(chat.last_updated)}</span>

            </div>
          </div>
        </section>
        <md-divider inset></md-divider>
        </React.Fragment>
      ))
  )
}
