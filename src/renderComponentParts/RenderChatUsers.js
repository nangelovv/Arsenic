import React, { useContext } from 'react'
import { StateContext } from '../mainNav';
import noUserImage from '../common/noUser.jpg';
const { v4: uuidv4 } = require('uuid');


export default function RenderChatUsers({ profiles = [] }) {
  const { 
    setCurrentChatInfo,
    showProfileModal, setShowProfileModal,
     setFetchingProfile
  } = useContext(StateContext)


  return (
    profiles.map((profile, index) => (
      <React.Fragment key={index}>
        <section
          className='position-relative rounded-4 p-2' 
          role='button'
          onClick={() => {
            document.getElementById('newChat').close();
            setShowProfileModal(true);
            setCurrentChatInfo({...profile, chat_id: uuidv4(), })

          }}
        >
          <md-ripple></md-ripple>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col-sm-2 col-4 text-center'>
                  <img
                    style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                    src={profile.profile_picture ? profile.profile_picture : noUserImage}
                    alt='Glimpse profile'
                  />
                </div>

                <span className='col d-flex align-items-center fs-5 text-break'>{profile.username}</span>

              </div>

            <span className='offset-2 my-2'>{profile.profile_description}</span>

            </div>
          </div>
        </section>
        <md-divider inset></md-divider>
        </React.Fragment>
      ))
  )
}
