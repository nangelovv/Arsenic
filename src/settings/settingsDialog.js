import React, { useContext, useState } from 'react';
import { StateContext } from '../mainNav';
import { handleThemeSwitch, logOut, changePrivateSetting } from './settingsFuncs';
import InitialSettings from './initialSettings';


export default function Settings() {
  const { 
    darkMode, setDarkMode, 
    isPrivate, setIsPrivate, 
    basicColor, setBasicColor 
  } = useContext(StateContext);

  const [preferences, setPreferences] = useState(false);

  return (
    <md-dialog id={'settingsDialog'}>
      {!preferences && <InitialSettings setPreferences={setPreferences}/>}
    </md-dialog>
  );
}
