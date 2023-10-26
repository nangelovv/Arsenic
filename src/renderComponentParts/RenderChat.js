import React, { useContext, useEffect } from 'react'
import noUserImage from '../common/noUser.jpg';
import { StateContext } from '../MainFeed';
import RenderMessages from './RenderMessages';
import { token } from '../common/APICalls';
import { getProfile } from '../common/profileFuncs';
const { v4: uuidv4 } = require('uuid');


export default function RenderChat() {

  const {
    socket,
    setProfile,
    setProfileData,
    setFetchingProfile,
    setCurrentChatInfo,
    chatsGlimpse, setChatsGlimpse,
    windowWidth,
    setShowChatModal,
    showProfileModal, setShowProfileModal,
    allChatsMessages, setAllChatsMessages,
    currentChatInfo
  } = useContext(StateContext)

  function sendMessage(event) {
    // if (socket.readyState != 1) {
    //   socket = new WebSocket('ws://localhost:8000/' + token)
    // }

    var message = document.getElementById('messageField').value;
    
    if (!message) {return}

    const messageID = uuidv4()

    const newMessage = { 
      receiver_id: currentChatInfo.user_id,
      sender_id: localStorage.getItem('ArsenicUserID'),
      message: message,
      message_id: messageID,
      token: token, 
      chat_id: currentChatInfo.chat_id, 
      timestamp: Math.round(Date.now())
    }

    if (newMessage.chat_id in allChatsMessages) {
      const updatedState = { ...allChatsMessages };
      updatedState[newMessage.chat_id].push(newMessage)
      setAllChatsMessages(updatedState)
    }
    else {
      const newChat = {[newMessage.chat_id]: [newMessage]};
      const updatedState = { ...allChatsMessages, ...newChat };
      setAllChatsMessages(updatedState)
    }
    
    const newChatInfo = { ...currentChatInfo}
    newChatInfo.last_message = newMessage.message
    newChatInfo.last_updated = newMessage.timestamp
    setCurrentChatInfo(newChatInfo)

    if (!(newMessage.chat_id in chatsGlimpse)) {
      const newChat = {[newChatInfo.chat_id]: newChatInfo};

      const mergedChatsGlimpse = { ...newChat, ...chatsGlimpse };

      // Update the state with the merged object
      setChatsGlimpse(mergedChatsGlimpse);
    }
    else {
      const updatedChats = { ...chatsGlimpse };
      const updatedDict = updatedChats[newMessage.chat_id];
      delete updatedChats[newMessage.chat_id];
      updatedDict.last_message = newMessage.message
      updatedDict.last_updated = newMessage.timestamp
      const updatedChat = {[newChatInfo.chat_id]: newChatInfo};
      const mergedChatsGlimpse = { ...updatedChat, ...updatedChats };
      // Update the state with the merged object
      setChatsGlimpse(mergedChatsGlimpse);

    }

    socket.send(JSON.stringify(newMessage));

    document.getElementById('messageField').value = ''
    event.preventDefault();
  }

    // Adds the listener for the keydown event and listens for that event if any of the values in the textfields change
    useEffect(() => {
      function handleKeyDown(e) {
  
        // #13 is the keyCode for 'Enter' on the keyboard
        if (e.keyCode === 13) {
          e.preventDefault();
          sendMessage(e);
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

  return (
    <>
      <div
        className={windowWidth > 900
          ? 'col-8 offset-3 d-flex justify-content-center align-items-center fixed-top py-2' 
          : 'col-12 d-flex justify-content-center align-items-center fixed-top py-2'
        }
        style={{background: 'var(--primary-color)'}}
      >
        <div className='col-sm-2 col-3 d-flex align-items-center me-2'>
          <md-icon-button onClick={() => {setShowChatModal(false)}}>
            <span>
              <md-icon>arrow_back</md-icon>
            </span>
          </md-icon-button>
          <img
            alt='Profile'
            className='img-fluid clickable' 
            style={{ width: '60px', height: '60px', borderRadius: '60px' }} 
            src={currentChatInfo.profile_picture ? currentChatInfo.profile_picture : noUserImage}
            onClick={() => {getProfile({
              user_id: currentChatInfo.user_id,
              setFetchingProfile: setFetchingProfile,
              setProfile: setProfile,
              setShowProfileModal: setShowProfileModal,
              showProfileModal: showProfileModal,
              setProfileData: setProfileData}
            )}}
          />
        </div>
        
        <div className='row col'>
          <div className='col-sm-10 col-9'>
            <div>
              <span
                className='clickable'
                onClick={() => {getProfile({
                  user_id: currentChatInfo.user_id,
                  setFetchingProfile: setFetchingProfile,
                  setProfile: setProfile,
                  setShowProfileModal: setShowProfileModal,
                  showProfileModal: showProfileModal,
                  setProfileData: setProfileData}
                )}}
              >
                {currentChatInfo.username}
              </span>
            </div>
            <span>{currentChatInfo.profile_description}</span>
          </div>
          
          <span className='col-sm-2 col-3 d-flex justify-content-center align-items-center'>
            <md-icon-button disabled><span><md-icon>info</md-icon></span></md-icon-button>
          </span>
        </div>
      </div>
      <md-divider></md-divider>
      <RenderMessages/>

      <div
        className={windowWidth > 900 
        ? 
          'col-8 offset-3 d-flex justify-content-center align-items-center fixed-bottom p-2'
        : 
          'col-12 d-flex justify-content-center align-items-center fixed-bottom p-2'
        }
        style={{background: 'var(--primary-color)'}}
      >
        <md-outlined-text-field
          type='text'
          label='Type a new message...'
          id='messageField'
        >
          <md-icon-button slot='trailing-icon' onClick={(e) => {sendMessage(e)}}>
            <md-icon>send</md-icon>
          </md-icon-button>
        </md-outlined-text-field>
      </div>
    </>
  )
}
