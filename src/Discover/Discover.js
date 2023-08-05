import { APINoBody } from '../common/APICalls';
import React, { useRef, useContext } from 'react';
import noUserImage from '../common/noUser.jpg';
import RenderProfile from '../renderComponentParts/RenderProfile';
import { debounce } from 'lodash';
import { OpenProfileContext, DiscoverContext, MyProfileContext, MainFeedContext } from '../MainFeed';


export default function Discover() {
  const { profile, setProfile } = useContext(OpenProfileContext)

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
    activeComponent, setActiveComponent
  } = useContext(MainFeedContext)

  const searchField = useRef()

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  // This function is called from the useEffect hook when profileData is first initiated 
  // if profileData is already present, the function returns null
  async function getProfile(user_id) {

    // If an internal server error (500) occurs (the server is down), the try-catch block catches it
    try {

      const response = await APINoBody('/users/profile/' + user_id, 'GET')

      if (response.ok) {

        const json = await response.json();
        const data = JSON.parse(json);

        // Sort the list based on the 'date' attribute
        data.posts.sort((a, b) => b.date - a.date);

        // Set a default profile image if user has no profile picture
        if (!data.profile_image) {
          data.profile_image = noUserImage
        }
        setProfile(data);

        handleModalToggle()
      }
    }
    catch(err) {return}
  }

  // Debounce the glimpseProfile function with 600 milliseconds
  const debouncedGlimpseProfile = useRef(debounce(glimpseProfile, 600)).current;

  async function glimpseProfile() {
    if (searchField.current.value) {
      try {
        const response = await APINoBody('/users/profile_glimpse/' + searchField.current.value, 'GET');
        const data = await response.json();
        setProfiles(Object.values(data));
      } catch (err) {
        return;
      }
    }
  }
  

  return (
    <>
    {!showModal ?
      <>
        <div className='col-12 text-center my-3'>
          <md-outlined-text-field
          ref={searchField}
          type={'text'}
          id={'textFieldDiscover'}
          label={"Search for a username"}
          onInput={() => {debouncedGlimpseProfile()}}
          ></md-outlined-text-field>
        </div>
        {profiles.length == 0 ?
          <div className='col-12 text-center my-5 py-5'>
            <span onClick={() => {document.getElementById('textFieldDiscover').focused = true}}>Search for a profile</span>
          </div>
        :
          profiles.map((profile, index) => (
          <div key={index}>
            <div
              className='position-relative rounded-4' 
              role='button' 
              key={index}
              onClick={() => {getProfile(profile.user_id)}}
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
        ))}
      </>
      : 
        profile.user_id == localStorage.getItem('ArsenicUserID') ?
          (
            setActiveComponent('MyProfile'),
            setProfileData(profile)
          )
        :
          <RenderProfile renderProfile={profile}/>
      }
    </>
  )
}
