import React, { useContext } from 'react';
import RenderGlimpse from '../../renderComponentParts/RenderGlimpse';
import { getProfile } from '../../common/profileFuncs';
import { StateContext } from '../../mainNav';

export default function ProfileFollows({ id, header, profiles, noFollows, alternativeNoFollows, myProfile }) {
  const {
    fetchingProfile, setFetchingProfile,
    profileData, setProfileData,
    profile, setProfile,
    activeComponent, setActiveComponent
  } = useContext(StateContext)
  
  async function callGetProfile(object) {
    getProfile({
      user_id: object.user_id,
      setFetchingProfile: setFetchingProfile,
      setProfile: setProfile,
      profileData: profileData,
      setProfileData: setProfileData,
      setActiveComponent: setActiveComponent,
      activeComponent: activeComponent
    })
  }

  return (
    <md-dialog id={id} style={{ height: '100%', width: '100%' }}>
      <span className='d-flex justify-content-center' slot='headline'>{header}</span>
      <form slot='content' method='dialog'>
        {profiles.length !== 0 ? 
          profiles?.map((profile, index) => (
            <RenderGlimpse
              key={index}
              onClickFunc={callGetProfile} 
              user_id={profile.user_id}
              username={profile.username}
              profilePicture={profile.profile_picture}
              secondLine = {profile.profile_description}
              time = {null}
              actionButton = {true}
              isFollowing = {profile.is_following}
              object={profile}
            />))
         : 
          <span className='d-flex justify-content-center'>
            {myProfile ? noFollows : alternativeNoFollows}
          </span>
        }
      </form>
    </md-dialog>
  );
}
