import React, { useContext, useReducer } from 'react'
import { getProfile } from '../common/profileFuncs';
import { StateContext } from '../mainNav';
import noUserImage from '../common/noUser.jpg';
import { followUnfollow } from '../common/profileFuncs';


export default function RenderGlimpse({ profiles }) {
  const {
    profileData, setProfileData,
    profile, setProfile,
    setFetchingProfile,
    activeComponent, setActiveComponent
  } = useContext(StateContext)

  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const currentUserID = localStorage.getItem('ArsenicUserID')

  function handleFollowButton({currentProfile}) {
    currentProfile.followers = currentProfile.is_following ? currentProfile.followers - 1 : currentProfile.followers + 1
    profileData.following = currentProfile.is_following ? profileData.following - 1 : profileData.followers + 1
    followUnfollow(currentProfile.is_following, currentProfile.user_id).then(() => {
    forceUpdate()
    }) 
  }

  return (
    profiles.map((currentProfile, index) => (
      <React.Fragment key={index}>
        <section
          className='position-relative rounded-4 py-3'
          onClick={(e) => {e.currentTarget.parentNode.parentNode.open = null}}
        >
          <md-ripple></md-ripple>
          <div className='row'>
            <div className='col'
              onClick={() => {getProfile({
                user_id: currentProfile.user_id,
                setFetchingProfile: setFetchingProfile,
                setProfile: setProfile,
                profileData: profileData,
                setProfileData: setProfileData,
                setActiveComponent: setActiveComponent,
                activeComponent: activeComponent
              })}}
            >
              <div className='row'>
                <div className='col-sm-3 col-4 text-center'>
                  <img
                    style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                    src={currentProfile.profile_picture ? currentProfile.profile_picture : noUserImage}
                    alt='Glimpse profile'
                  />
                </div>
                <div className='col d-flex flex-column justify-content-evenly'>
                  <div className='row'>
                    <span className='d-flex align-items-center fs-5 text-break'>{currentProfile.username}</span>
                  </div>
                  <span>{currentProfile.profile_description}</span>
                </div>
              </div>
            </div>
            <div className={'col-sm-3 col-4 d-flex align-items-center justify-content-center'}>
              <md-filled-button
                disabled={currentUserID == currentProfile.user_id ? true : null}
                onClick={() => {handleFollowButton({currentProfile})}}
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
