import React, { useEffect, useState, useContext } from 'react';
import { StateContext } from '../../mainNav';
import ChatsGlimpse from './Chats/chatsGlimpse';
import CurrentChat from './Chats/currentChat';
import { getChatSuggestions, getChat } from '../../common/profileFuncs';
const { v4: uuidv4 } = require('uuid');


export default function Messages() {
  const {
    // socket,
    profile,
    windowWidth,
    showChatModal, setShowChatModal,
    chatsGlimpse,
    currentChatInfo, setCurrentChatInfo,
    allChatsMessages, setAllChatsMessages,
    messageIDs, setMessageIDs
  } = useContext(StateContext)

  const [newMessage, setNewMessage] = useState({})
  const [chatSuggestion, setChatSuggestion] = useState([])

  function chatGlimpse(chat) {
    setCurrentChatInfo(chat);
    setShowChatModal(true);
    getChat({
      chatID: chat.chat_id,
      allChatsMessages: allChatsMessages,
      setAllChatsMessages: setAllChatsMessages,
      messageIDs: messageIDs,
      setMessageIDs: setMessageIDs
    })
  }

  function chatSuggestionsGlimpse(chat) {
    document.getElementById('newChat').close();
    setCurrentChatInfo({...chat, chat_id: uuidv4() })
    setShowChatModal(true);
  }

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

  // useEffect(() => {
  //   // Listen for messages
  //   socket.addEventListener("message", (event) => {
  //     setNewMessage(JSON.parse(event.data))
  //   });
  // }, []);
  
  return (
    <>
      {!showChatModal 
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
            <ChatsGlimpse
              profiles={Object.values(chatsGlimpse).sort((a, b) => parseInt(b.last_updated) - parseInt(a.last_updated))}
              onClickFunc={chatGlimpse}
              defaultSecondLine={false}
            />
          }
          
          <div className={windowWidth > 900 ? 'newPostButton' : 'newPostButtonMobile'}>

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
              <md-icon slot='icon'>add</md-icon>
            </md-branded-fab>
          </div>
        </>
      :
        <CurrentChat chatInfo={currentChatInfo}/>
      }

      <md-dialog id={'newChat'} style={{height: '100%', width: '100%'}}>
        <form method='dialog' slot='content'>

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

          <ChatsGlimpse
            profiles={chatSuggestion}
            onClickFunc={chatSuggestionsGlimpse}
          />
        </form>
      </md-dialog>
    </>
  );
}