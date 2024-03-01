import React, { useContext } from 'react';
import { StateContext } from '../mainNav';
import { handleThemeSwitch, logOut, changePrivateSetting } from './SettingsFunctions';

export default function Settings() {
  const { 
    darkMode, setDarkMode, 
    isPrivate, setIsPrivate, 
    basicColor, setBasicColor 
  } = useContext(StateContext);

  return (
    <md-dialog id={'settingsDialog'}>
      <form method='dialog' slot='content'>
        <md-icon-button>
          <span>
            <md-icon>arrow_back</md-icon>
          </span>
        </md-icon-button>

        <SettingRow 
          label="Base color"
          control={
            <input 
              type='color' 
              value={basicColor} 
              onChange={(event) => {setBasicColor(event.target.value)}}
            />
          }
        />

        <SettingRow 
          label="Dark theme"
          control={
            <md-switch 
              onClick={() => handleThemeSwitch({ darkMode, setDarkMode })} 
              selected={darkMode}
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

        <div className='py-3 text-center'>
          <md-text-button id='navButtons' onClick={logOut}>Log out</md-text-button>
        </div>
      </form>
    </md-dialog>
  );
}

function SettingRow({ label, control }) {
  return (
    <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
      <div className='d-inline'>
        <span>{label}</span>
      </div>
      <div className='d-inline'>
        {control}
      </div>
    </div>
  );
}
