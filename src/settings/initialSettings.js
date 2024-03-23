import React, { useContext } from 'react';
import { StateContext } from '../mainNav';
import { handleThemeSwitch, logOut, changePrivateSetting } from './settingsFuncs';
import SettingRow from './settingRow';


export default function InitialSettings({setPreferences}) {
  const { 
    darkMode, setDarkMode, 
    isPrivate, setIsPrivate, 
    basicColor, setBasicColor 
  } = useContext(StateContext);

  return (
    <form method='dialog' slot='content'>
      {/* <SettingRow 
        label='Account preferences'
        control={
          <md-icon-button
            onClick={() => {setPreferences(true)}}
          >
            <span>
              <md-icon>arrow_forward</md-icon>
            </span>
          </md-icon-button>
        }
      /> */}

      <SettingRow 
        label='Dark theme'
        control={
          <md-switch 
            onClick={() => handleThemeSwitch({ darkMode, setDarkMode })} 
            selected={darkMode}
          />
        }
      />

      <SettingRow 
        label='Base color'
        control={
          <input 
            type='color' 
            value={basicColor} 
            onChange={(event) => {setBasicColor(event.target.value)}}
          />
        }
      />

      {/* <SettingRow 
        label="Private mode"
        control={
          <md-switch 
            disabled 
            onInput={() => changePrivateSetting({setIsPrivate})} 
            selected={isPrivate} 
          />
        }
      /> */}

      <div className='py-2 text-center'>
        <md-text-button id='navButtons' onClick={logOut}>Log out</md-text-button>
      </div>
    </form>
  );
}
