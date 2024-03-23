import React, { useContext, useReducer } from 'react'
import { StateContext } from '../mainNav';
import noUserImage from '../common/noUser.jpg';
import { followUnfollow } from '../common/profileFuncs';
import { transformTime } from '../common/commonFuncs';


export default function RenderGlimpse({ 
  onClickFunc,
  user_id,
  username,
  profilePicture,
  secondLine = null,
  time = null,
  actionButton = false,
  isFollowing = false,
  object
 }) {

  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const currentUserID = localStorage.getItem('ArsenicUserID')

  function handleFollowButton({currentProfile}) {
    // currentProfile.followers = currentProfile.is_following ? currentProfile.followers - 1 : currentProfile.followers + 1
    // profileData.following = currentProfile.is_following ? profileData.following - 1 : profileData.followers + 1
    followUnfollow(currentProfile.is_following, currentProfile.user_id).then(() => {
    forceUpdate()
    }) 
  }

  return (
    <>
      <section 
        className='position-relative rounded-4 py-3 clickable'
        onClick={(e) => {e.currentTarget.parentNode.parentNode.open = null}}
      >
        <md-ripple></md-ripple>
        <div className='row'>
          <div className='col'
            onClick={() => {onClickFunc(object)}}
          >
            <div className='row'>
              <div className='col-sm-3 col-4 text-center'>
                <img
                  style={{ width: '60px', height: '60px', borderRadius: '150px' }}
                  src={profilePicture ? profilePicture : noUserImage}
                  alt='Glimpse profile'
                />
              </div>
              <div className='col d-flex flex-column justify-content-evenly'>
                <div className='row'>
                  <span className='d-flex align-items-center fs-5 text-break'>{username}</span>
                </div>
                
                {/* These classes should remain as they fix the alignment of the second line, 
                if there is no second line the username is centered, else they are left aligned */}
                <span className={secondLine ? '' : 'd-none'}>
                  {(secondLine && time && <>{secondLine.substring(0, 50)} &#9702; {transformTime(time)}</> 
                  || 
                  (secondLine && secondLine.substring(0, 50)))
                  }
                </span>
              </div>
            </div>
          </div>
          <div className={actionButton ? 'col-sm-3 col-4 d-flex align-items-center justify-content-center' : 'd-none'}>
            <md-filled-button
              disabled={currentUserID == user_id ? true : null}
              onClick={() => {handleFollowButton({object})}}
              style={isFollowing ? {'--md-filled-button-container-color': 'gray'} : null}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </md-filled-button>
          </div>
        </div>
      </section>
      <md-divider inset></md-divider>
    </>
  )
}
