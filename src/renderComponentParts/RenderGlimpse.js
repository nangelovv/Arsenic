import React, { useContext, useReducer } from 'react'
import { getProfile } from '../common/profileFuncs';
import { StateContext } from '../MainFeed';
import noUserImage from '../common/noUser.jpg';
import { followUnfollow } from '../common/profileFuncs';


export default function RenderGlimpse({ profiles }) {
  const {
    setProfileData,
    showProfileModal, setShowProfileModal,
    profile, setProfile,
    setFetchingProfile
  } = useContext(StateContext)


  const forceUpdate = useReducer(x => x + 1, 0)[1]

  return (
    profiles.map((currentProfile, index) => (
      <React.Fragment key={index}>
        <section
          className='position-relative rounded-4 p-2' 
          role='button' 
          onClick={() => {getProfile({
            user_id: currentProfile.user_id,
            setFetchingProfile: setFetchingProfile,
            setProfile: setProfile,
            setShowProfileModal: setShowProfileModal,
            showProfileModal: showProfileModal,
            setProfileData: setProfileData
          })}}
        >
          <md-ripple></md-ripple>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col-sm-3 col-4 text-center'>
                  <img
                    style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                    src={currentProfile.profile_picture ? currentProfile.profile_picture : noUserImage}
                    alt='Glimpse profile'
                  />
                </div>

                <span className='col d-flex align-items-center fs-5 text-break'>{currentProfile.username}</span>

              </div>

            <span className='offset-2 my-2'>{currentProfile.profile_description}</span>

            </div>

            <div className='col-sm-3 col-4 d-flex align-items-center justify-content-center'>
              <md-filled-button 
                onClick={() => {
                  currentProfile.followers = currentProfile.is_following ? currentProfile.followers - 1 : currentProfile.followers + 1
                  followUnfollow({ profile, setProfile }).then(() => {
                    forceUpdate()
                  }) 
                }}
                style={currentProfile.is_following ? {'--md-filled-button-container-color': 'gray'} : null}
              >
                {currentProfile.is_following ? 'Unfollow' : 'Follow'}
              </md-filled-button>
            </div>

          </div>
        </section>
        <md-divider inset></md-divider>
        </React.Fragment>
      ))
  )
}
