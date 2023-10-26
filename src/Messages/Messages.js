import React, { useEffect, useState, useContext } from 'react';
import { StateContext } from '../MainFeed';
import RenderChats from '../renderComponentParts/RenderChats';
import RenderChat from '../renderComponentParts/RenderChat';
import RenderChatUsers from '../renderComponentParts/RenderChatUsers';
import { getChatSuggestions } from '../common/profileFuncs';
import RenderProfile from '../renderComponentParts/RenderProfile';


export default function Messages() {
  const {
    socket,
    profile,
    windowWidth,
    showProfileModal,
    showChatModal, setShowChatModal,
    chatsGlimpse,
    currentChatInfo, setCurrentChatInfo,
    allChatsMessages, setAllChatsMessages,
    messageIDs, setMessageIDs
  } = useContext(StateContext)

  const [newMessage, setNewMessage] = useState({})
  const [chatSuggestion, setChatSuggestion] = useState([])

  useEffect(() => {
    if (newMessage.chat_id in allChatsMessages && !(newMessage.message_id in messageIDs)) {
      const updatedState = { ...allChatsMessages };
      updatedState[newMessage.chat_id].push(newMessage)
      setAllChatsMessages(updatedState)
      setMessageIDs((prev) => [...prev, newMessage.message_id])
      // const newChatInfo = { ...currentChatInfo}
      // newChatInfo.last_message = newMessage.message
      // newChatInfo.last_updated = newMessage.timestamp
      // setCurrentChatInfo(newChatInfo)
    }
  }, [newMessage])

  useEffect(() => {
    // Listen for messages
    socket.addEventListener("message", (event) => {
      setNewMessage(JSON.parse(event.data))
    });
  }, []);
  
  return (
    <>
      {!showProfileModal ?
      (!showChatModal 
      ? 
        <>
          <span className='fs-2 d-flex justify-content-center my-3'>Messages</span>
          {Object.keys(chatsGlimpse).length === 0
          ?
            <div className='col-12 text-center my-5 py-5'>
              <span>
                Chats will show up here
              </span>
            </div>
          :
            <RenderChats/>
          }
          
          <div className={windowWidth > 900 ? 'newPostButton' : 'newPostButtonMobile'}>

            {/* When pressed, the newPost dialog is opened */}
            <md-branded-fab
              size='small'
              aria-label='Chat'
              label='New chat'
              onClick={() => {
                getChatSuggestions({
                  chatSuggestion: chatSuggestion, 
                  setChatSuggestion: setChatSuggestion
                });
                document.getElementById('newChat').show()
              }}
            >
              <md-icon slot='icon'>search</md-icon>
            </md-branded-fab>
          </div>
        </>
      :
        <RenderChat chatInfo={currentChatInfo}/>
      )
      :
      <RenderProfile renderProfile={profile}/>
      }

      <md-dialog id={'newChat'} style={{height: '100%', width: '100%'}}>
        <form method='dialog' slot='content'>
                  
          {/* This button closes the dialog */}
          <md-icon-button>
            <span>
              <md-icon>arrow_back</md-icon>
            </span>
          </md-icon-button>

          <div className='col-12 text-center my-3'>
            <md-outlined-text-field
            disabled
            type={'search'}
            id={'textFieldMessages'}
            label={'Search by username'}
            onInput={() => {var zero}}
            ></md-outlined-text-field>
          </div>

          <div className='col-12 d-flex justify-content-center my-3'>
            <md-chip-set type='filter' single-select>
              <md-filter-chip label='Profiles' selected disabled></md-filter-chip>
              <md-filter-chip label='Groups' disabled></md-filter-chip>
              <md-filter-chip label='Messages' disabled></md-filter-chip>
            </md-chip-set>
          </div>

          <RenderChatUsers profiles={chatSuggestion}/>

        </form>
      </md-dialog>
    </>
  );
}