import React, { useEffect, useState, useContext } from 'react';
import { StateContext } from '../../mainNav';
import Following from './following';
import Recommended from './recommended';


export default function Home() {
  const { fetchingProfile } = useContext(StateContext)

  // Gets the last active side from the localStorage and sets it as the current one, if there is nothing 
  // in Storage, its set as '0'/'Recommended'
  const [activeSide, setActiveSide] = useState(localStorage.getItem('activeSide') || 1)

  // Sets the active side in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSide', parseInt(activeSide));
  }, [activeSide]);


  return (
      <>
        {/* Places the 2 buttons in the middle of the page, with equal spacing on both sides */}
        <div className='col-10 my-3 offset-1'>

          {/* Holds the 2 buttons, the selected one depends on which one has been last active, if neither has, its Recommended */}
          <md-outlined-segmented-button-set>
            <md-outlined-segmented-button selected={parseInt(activeSide) == 0 ? true : null} no-checkmark label='Following' onClick={() => {setActiveSide(0)}}></md-outlined-segmented-button>
            <md-outlined-segmented-button selected={parseInt(activeSide) == 1 ? true : null} no-checkmark label='Recommended' onClick={() => {setActiveSide(1)}}></md-outlined-segmented-button>
          </md-outlined-segmented-button-set>
        </div>
        <md-divider></md-divider>

        {fetchingProfile
        ?
          <div className='text-center my-5 py-5'><md-circular-progress indeterminate four-color></md-circular-progress></div>
        :
          parseInt(activeSide) == 0
          ?
            <Following/>
          :
            <Recommended/>
        }
      </>
  );
};

