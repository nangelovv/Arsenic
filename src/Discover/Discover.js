import { APINoBody } from '../common/APICalls';
import React, { useRef, useContext } from 'react';
import noUserImage from '../common/noUser.jpg';
import RenderProfile from '../renderComponentParts/RenderProfile';
import { debounce } from 'lodash';
import { RenderProfileContext, DiscoverContext, MainFeedContext, MyProfileContext } from '../MainFeed';
import { getProfile } from '../common/profileFuncs';


export default function Discover() {
  const { profile, setProfile } = useContext(RenderProfileContext)

  const { 
    profileData, setProfileData,
    postMenuVisibility, setPostMenuVisibility
  } = useContext(MyProfileContext)

  const {
    profiles, setProfiles,
    showModal, setShowModal
  } = useContext(DiscoverContext)

  const { 
    windowWidth, setWindowWidth,
    activeComponent, setActiveComponent,
    fetchingProfile, setFetchingProfile
  } = useContext(MainFeedContext)

  const searchField = useRef()

  // Debounce the glimpseProfile function with 600 milliseconds
  const debouncedGlimpseProfile = useRef(debounce(glimpseProfile, 600)).current;

  async function glimpseProfile() {
    if (searchField.current.value) {
      try {
        const response = await APINoBody('/users/profile_glimpse/' + searchField.current.value, 'GET');
        const data = await response.json();
        setProfiles(Object.values(data));
      } 
      catch (err) { return }
    }
  }
  
  return (
    <>
    {!showModal
      ? 
        fetchingProfile
        ?
          <div className='text-center my-5 py-5'>
            <md-circular-progress indeterminate four-color></md-circular-progress>
          </div>
        :
          <>
            <div className='col-12 text-center my-3'>
              <md-outlined-text-field
              ref={searchField}
              type={'search'}
              id={'textFieldDiscover'}
              label={"Search for a username"}
              onInput={() => {debouncedGlimpseProfile()}}
              ></md-outlined-text-field>
            </div>
            {profiles.length == 0
            ?
              <div className='col-12 text-center my-5 py-5'>
                <span onClick={() => {document.getElementById('textFieldDiscover').focused = true}}>
                  Search for a profile
                </span>
              </div>
            :
              profiles.map((profile, index) => (
              <div key={index}>
                <div
                  className='position-relative rounded-4' 
                  role='button' 
                  key={index}
                  onClick={() => {getProfile({
                    user_id: profile.user_id,
                    setFetchingProfile: setFetchingProfile,
                    setProfile: setProfile,
                    setShowModal: setShowModal,
                    showModal: showModal,
                    setProfileData: setProfileData}
                  )}}
                >
                  <md-ripple></md-ripple>
                  <div className='row'>
                    <div className='col-2 text-center mt-3'>
                      <img
                        style={{ width: '60px', height: '60px', borderRadius: '150px'  }}
                        src={profile.profile_picture ? profile.profile_picture : noUserImage}
                        alt='Glimpse profile'
                      />
                    </div>

                    <div className='col-10 d-flex align-items-center -start mt-3 h5 text-break'>
                      <span>{profile.username}</span>
                    </div>

                  </div>

                  <div className='offset-2 my-2'>
                    <span>{profile.description}</span>
                  </div>
                <md-divider></md-divider>
                </div>
              </div>
              ))
            }
          </>
      : 
        <RenderProfile renderProfile={profile}/>
      }
    </>
  )
}
