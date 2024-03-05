import React, { useContext, useReducer } from 'react';
import { StateContext } from '../mainNav';
import RenderPosts from '../posts/posts';
import noUserImage from '../common/noUser.jpg';
import { followUnfollow, getFollows } from '../common/profileFuncs';
import ProfileFollows from '../pages/MyProfile/myProfileFollows';


export default function RenderProfile({ renderProfile }) {
  const { 
    profile, setProfile,
    followers, setFollowers,
    following, setFollowing,
    setProfileData,
    windowWidth,
    activeComponent, setActiveComponent
  } = useContext(StateContext)

  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const myProfile = renderProfile.user_id == localStorage.getItem('ArsenicUserID');

  if (renderProfile.user_id == localStorage.getItem('ArsenicUserID') && activeComponent != 'MyProfile') {
    setProfileData(renderProfile);
    setActiveComponent('MyProfile');
    return
  }

  return (
    <>
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
              <span tabIndex={0}>{renderProfile.username}</span>
            </div>

            {/* When pressed, the 'editProfile' dialog is opened */}
            <div className='col-4 d-flex align-items-center text-center mt-3'>
              {(myProfile) ?
                <md-filled-button onClick={() => {document.getElementById('editProfile').show()}}>
                Edit Profile
                </md-filled-button>
              :
                <md-filled-button onClick={() => {
                  renderProfile.followers = renderProfile.is_following ? renderProfile.followers - 1 : renderProfile.followers + 1
                  followUnfollow(profile.is_following, profile.user_id).then(() => {
                    profile.is_following = !profile.is_following
                    setProfile(profile)
                    forceUpdate()
                  }) 
                }}
                style={renderProfile.is_following ? {'--md-filled-button-container-color': '#A9A9A9'} : null}
                >
                  {renderProfile.is_following ? 'Unfollow' : 'Follow'}
                </md-filled-button>
              }
            </div>
          </div>
          <div className='row'>
            <span
              className='col-6 d-flex justify-content-center align-items-center text-center mt-3 followTextSize'
            >
              <span
                tabIndex={0}
                className='clickable'
                onClick={() => {
                  getFollows({following, setFollowing, followers, setFollowers, profile_id: renderProfile.user_id});
                  document.getElementById('viewFollowing').show();
                }}
              >
              {renderProfile.following ? renderProfile.following : 0}<br/>
                Following
              </span>
            </span>
            <span
              className='col-6 d-flex align-items-center text-center mt-3 followTextSize'
            >
              <span
                tabIndex={0}
                className='clickable'
                onClick={() => {
                  getFollows({following, setFollowing, followers, setFollowers, profile_id: renderProfile.user_id});
                  document.getElementById('viewFollowers').show();
                }}
              >
                {renderProfile.followers ? renderProfile.followers : 0}<br/>
                Followers
              </span>
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

      {renderProfile.privacy == 0 || myProfile || renderProfile.is_following ? 
      
          renderProfile.posts.length == 0 ?
            <div className='row'>
              <span className='text-center my-5 py-5'>
                Posts will show up here
              </span>
            </div>
          :
            <RenderPosts posts={renderProfile.posts} myProfile={myProfile}/>
      :
        <div className='row'>
          <span className='text-center my-5 py-5'>
            This account is private
          </span>
        </div>
      }

      <ProfileFollows
        id='viewFollowing'
        header='Following'
        profiles={following}
        noFollows='You are not following anyone yet'
        alternativeNoFollows='This profile is not following anyone yet'
        myProfile={myProfile ? true : false}
      />

      <ProfileFollows
        id='viewFollowers'
        header='Followers'
        profiles={followers}
        noFollows='You have no followers yet'
        alternativeNoFollows='This profile does not have any followers yet'
        myProfile={myProfile ? true : false}
      />
    </>
  );
}
