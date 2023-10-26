import React, { useContext } from 'react'
import { StateContext } from './MainFeed';
import {handleThemeSwitch, logOut, changePrivateSetting} from './SettingsFunctions'

export default function Settings() {
  const {
    darkMode, setDarkMode,
    isPrivate, setIsPrivate,
    basicColor, setBasicColor
  } = useContext(StateContext)
  
  return (
    <md-dialog id={'settingsDialog'}>
      <form method='dialog' slot='content'>
                
        {/* This button closes the dialog */}
          <md-icon-button>
            <span>
              <md-icon>arrow_back</md-icon>
            </span>
          </md-icon-button>

          <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
          <span>Base color</span>
          </div>
          <div className='d-inline'>
            <div className='color-picker'>
              <input type='color' id='colorInput' value={basicColor} onChange={() => {setBasicColor(document.getElementById('colorInput').value)}}/>
              <div className='color-preview' value={basicColor}></div>
            </div>
          </div>
        </div>

        <md-divider></md-divider>

        {/* This div holds the dark theme switch and label on the same row, equally spaced. 
        When the switch is pressed, it changes its states and calls 'handleThemeSwitch' which 
        changes the theme of the page */}
        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
            <span>Dark theme</span>
          </div>
          <div className='d-inline' >
          <md-switch onClick={() => {handleThemeSwitch({darkMode, setDarkMode})}} selected={darkMode}></md-switch>
            
          </div>
        </div>

        <md-divider></md-divider>

        {/* This div holds the private mode switch and label on the same row, equally spaced. 
        When the switch is pressed, it changes its states and calls 'makePrivate' which 
        changes the theme of the page */}
        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between d-none'>
          <div className='d-inline'>
            <span>Private mode</span>
          </div>
          <div className='d-inline'>
            <md-switch disabled onInput={() => {changePrivateSetting({setIsPrivate})}} selected={isPrivate}></md-switch>
          </div>
        </div>

        <md-divider></md-divider>
        <div className='py-3 text-center d-none'>
          <md-text-button id='navButtons' disabled>Delete profile</md-text-button>
        </div>

        {/* When pressed, the 'logOut' function is called, which deleted the token and date from the 
        localStorage and thus logging out the user */}
        <md-divider></md-divider>
        <div className='py-3 text-center'>
          <md-text-button id='navButtons' onClick={() => {logOut()}}>Log out</md-text-button>
        </div>
      </form>
    </md-dialog>
  )
}
