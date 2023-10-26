import { APINoBody } from '../common/APICalls';
import React, { useRef, useContext } from 'react';
import RenderProfile from '../renderComponentParts/RenderProfile';
import { debounce } from 'lodash';
import { StateContext } from '../MainFeed';
import RenderGlimpse from '../renderComponentParts/RenderGlimpse';


export default function Discover() {
  const {
    profile,
    profiles, setProfiles,
    showProfileModal, fetchingProfile
  } = useContext(StateContext)

  const searchField = useRef()

  // Debounce the glimpseProfile function with 600 milliseconds
  const debouncedGlimpseProfile = useRef(debounce(glimpseProfile, 600)).current;

  async function glimpseProfile() {
    if (searchField.current.value) {
      try {
        const response = await APINoBody('/users/profiles_glimpse/' + searchField.current.value, 'GET');
        const data = await response.json();
        setProfiles(Object.values(data));
      } 
      catch (err) { return }
    }
  }
  
  return (
    <>
    {!showProfileModal
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
            {profiles.length == 0
            ?
              <div className='col-12 text-center my-5 py-5'>
                <span onClick={() => {searchField.current.focused = true}}>
                  Search for a profile
                </span>
              </div>
            :
            <RenderGlimpse profiles={profiles}/>
            }
          </>
      : 
        <RenderProfile renderProfile={profile}/>
      }
    </>
  )
}
