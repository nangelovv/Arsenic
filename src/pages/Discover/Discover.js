import { APINoBody } from '../../common/APICalls';
import React, { useRef, useContext } from 'react';
import { debounce } from 'lodash';
import { StateContext } from '../../mainNav';
import RenderGlimpse from '../../renderComponentParts/RenderGlimpse'
import { getProfile } from '../../common/profileFuncs';


export default function Discover() {
  const {
    profiles, setProfiles,
    fetchingProfile, setFetchingProfile,
    profileData, setProfileData,
    profile, setProfile,
    activeComponent, setActiveComponent
  } = useContext(StateContext)

  const searchField = useRef()

  // Debounce the glimpseProfile function with 600 milliseconds
  const debouncedGlimpseProfile = useRef(debounce(glimpseProfile, 600)).current;

  async function glimpseProfile() {
    if (searchField.current.value) {
      setFetchingProfile(true)
      try {
        const response = await APINoBody('/users/profiles_glimpse/' + searchField.current.value, 'GET');
        const data = await response.json();
        setProfiles(Object.values(data));
      } 
      catch (err) { setFetchingProfile(false) }
    }
    setFetchingProfile(false)
  }

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
    <>
      <div className='col-12 text-center my-3'>
        <md-outlined-text-field
        ref={searchField}
        type={'search'}
        id={'textFieldDiscover'}
        label={'Search by username'}
        onInput={() => {debouncedGlimpseProfile()}}
        ></md-outlined-text-field>
      </div>
      <div className='col-12 d-flex justify-content-center my-3'>
        <md-chip-set type='filter' single-select>
          <md-filter-chip label='Profiles' selected disabled></md-filter-chip>
          <md-filter-chip label='Hashtags' disabled></md-filter-chip>
          <md-filter-chip label='Captions' disabled></md-filter-chip>
        </md-chip-set>
      </div>
      {fetchingProfile
      ?
        <div className='text-center my-5 py-5'>
          <md-circular-progress indeterminate four-color></md-circular-progress>
        </div>
      :
        profiles.length == 0
        ?
          <div className='col-12 text-center my-5 py-5'>
            <span onClick={() => {searchField.current.focused = true}}>
              Search for a profile
            </span>
          </div>
        :
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
      }
    </>
  )
}
