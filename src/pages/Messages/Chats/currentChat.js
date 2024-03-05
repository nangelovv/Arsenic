import React, { useContext, useEffect } from 'react'
import noUserImage from '../../../common/noUser.jpg';
import { StateContext } from '../../../mainNav';
import CurrentChatMessages from './currentChatMessages';
import { token } from '../../../common/APICalls';
import { useInput } from '../../../common/hooks';
import { getProfile } from '../../../common/profileFuncs';
const { v4: uuidv4 } = require('uuid');


export default function CurrentChat() {

  const {
    // socket,
    setProfile,
    profileData, setProfileData,
    setFetchingProfile,
    setCurrentChatInfo,
    chatsGlimpse, setChatsGlimpse,
    windowWidth,
    setShowChatModal,
    allChatsMessages, setAllChatsMessages,
    activeComponent, setActiveComponent,
    currentChatInfo
  } = useContext(StateContext)

  const [messageBox, messageBoxInput] = useInput({ type: 'text', label: 'Type a new message...', id: 'messageField', hideIcon: false, activeIcon: 'send', inactiveIcon: 'send', onClickFunc: sendMessage});

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

    // socket.send(JSON.stringify(newMessage));

    document.getElementById('messageField').value = ''
    event.preventDefault();
  }

  
  function handleProfileClick(user_id) {
    getProfile({
      user_id: user_id,
      setFetchingProfile: setFetchingProfile,
      profileData: profileData,
      setProfile: setProfile,
      setProfileData: setProfileData,
      setActiveComponent: setActiveComponent,
      activeComponent: activeComponent
    })
  };

  return (
    <>
      <div
        className={windowWidth > 900
          ? 'col-8 offset-3 d-flex justify-content-center align-items-center fixed-top py-2 standardPriority' 
          : 'col-12 d-flex justify-content-center align-items-center fixed-top py-2 standardPriority'
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
            tabIndex={0}
            alt='Profile'
            className='img-fluid clickable' 
            style={{ width: '60px', height: '60px', borderRadius: '60px' }} 
            src={currentChatInfo.profile_picture ? currentChatInfo.profile_picture : noUserImage}
            onClick={() => {handleProfileClick(currentChatInfo.user_id)}}
          />
        </div>
        
        <div className='row col'>
          <div className='col-sm-10 col-9 d-flex flex-column justify-content-evenly'>
            <div className='row'>
              <span
                tabIndex={0}
                className='clickable'
                onClick={() => {handleProfileClick(currentChatInfo.user_id)}}
              >
                {currentChatInfo.username}
              </span>
            </div>
            <span className={!currentChatInfo.profile_description && 'd-none'}>{currentChatInfo.profile_description}</span>
            </div>
          
          <span className='col-sm-2 col-3 d-flex justify-content-center align-items-center'>
            <md-icon-button disabled><span><md-icon>info</md-icon></span></md-icon-button>
          </span>
        </div>
      </div>
      <md-divider></md-divider>
      <CurrentChatMessages/>

      <div
        className={windowWidth > 900 
        ? 
          'col-8 offset-3 d-flex justify-content-center align-items-center fixed-bottom p-2 standardPriority'
        : 
          'col-12 d-flex justify-content-center align-items-center fixed-bottom p-2 standardPriority'
        }
        style={{background: 'var(--primary-color)'}}
      >
        {messageBoxInput}
      </div>
    </>
  )
}
