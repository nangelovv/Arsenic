import React, { useContext, useReducer } from 'react';
import { MainFeedContext, MyProfileContext, RenderProfileContext } from '../MainFeed';
import RenderPosts from './RenderPosts';
import noUserImage from '../common/noUser.jpg';
import { followUnfollow } from '../common/profileFuncs';


export default function RenderProfile({ renderProfile }) {
  const { profile, setProfile } = useContext(RenderProfileContext)

  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const { 
    profileData, setProfileData
  } = useContext(MyProfileContext)

  const {
    windowWidth, setWindowWidth,
    activeComponent, setActiveComponent
  } = useContext(MainFeedContext)

  const myProfile = renderProfile.user_id == localStorage.getItem('ArsenicUserID');

  if (renderProfile.user_id == localStorage.getItem('ArsenicUserID') && activeComponent != 'MyProfile') {
    setProfileData(renderProfile);
    setActiveComponent('MyProfile');
    return
  }

  return (
    // Shows the container in different dimensions depending on how big the screen of the user is
    <div>

      {/* Holds the profile picture and username so that they are displayed on the same row */}
      <div className='row'>
        <div className='col-4 justify-content-center align-items-center text-center mt-3'>

          {/* The profile image is shown in different dimensions depending on the size of the device its being viewed on */}
          <img
            alt='Profile'
            className='img-fluid col-12' 
            style={windowWidth > 600 
              ? { width: '150px', height: '150px', borderRadius: '150px' } 
              : { width: '80px', height: '80px', borderRadius: '80px' }
            } 
            src={renderProfile.profile_picture ? renderProfile.profile_picture : noUserImage} 
          />
        </div>
        
        <div className='row col-8'>
          <div className='row'>
            {/* The containers holds the username, if the username is too long, breaks the text on the next line */}
            <div className='col-8 d-flex align-items-center mt-3 h3 text-break'>
              <span>{renderProfile.username}</span>
            </div>

            {/* When pressed, the 'editProfile' dialog is opened */}
            <div className='col-4 d-flex align-items-center text-center mt-3'>
              {(myProfile) ?
                <md-filled-button onClick={() => {document.getElementById('editProfile').show()}}>
                Edit Profile
                </md-filled-button>
              :
                <md-filled-button onClick={() => {
                  followUnfollow({ profile, setProfile }).then(() => {
                    forceUpdate()
                  }) 
                }}
                >
                    {renderProfile.follows ? "Unfollow" : "Follow"}
                </md-filled-button>
              }
            </div>
          </div>
          <div className='row'>
            <span
            className='col-6 d-flex justify-content-center align-items-center text-center mt-3 followTextSize clickable'
            >
              {renderProfile.following ? renderProfile.following : 0}<br/>
              Following
            </span>
            <span
            className='col-6 d-flex align-items-center text-center mt-3 followTextSize clickable'
            >
            {renderProfile.followers ? renderProfile.followers : 0}<br/>
              Followers
            </span>
          </div>
        </div>
      </div>

      {/* The container holds the profile description which it display on a seperate row from the
      username and profile picture */}
      <div>
        <span className='d-flex justify-content-center text-center my-2'>{renderProfile.profile_description}</span>
      </div>
      <md-divider inset></md-divider>
      
      {renderProfile.privacy == 0 || myProfile || renderProfile.follows ? 
        // The container holds all posts, if there are none, shows a texting stating so
        <div className='row'>
          {renderProfile.posts.length == 0 ? 
          ( 
            <>
              <span className='text-center my-5 py-5'>
                No posts
              </span>

              {/* When pressed, the newPost dialog is opened */}
              {(myProfile) ? 
                <a href='javascript:void(0);' 
                  className='text-decoration-none text-center'
                  onClick={() => {document.getElementById('newPost').show()}}
                >
                  Make a new post
                </a>
              :
                null
              }
            </>
          )

          :

          (

          // Iterate through all of the the profile posts (if there are any) that have been received 
          // and render each one in its own container
            <RenderPosts posts={renderProfile.posts} myProfile={myProfile}/>
          )}
        </div>
      :
        <div className='row'>
          <span className='text-center my-5 py-5'>
            This account is private
          </span>
        </div>
      }
    </div>

  );
}
