import { APINoBody } from "./common/APICalls";


// Changes the state of 'newMode' variable to the opposite of what it was and sets the new darkMode state in the storage
export async function handleThemeSwitch({darkMode, setDarkMode}) {
  const newMode = darkMode ? null : true
  setDarkMode(newMode);

  if (newMode) {
    window.localStorage.setItem('dark_mode', true);
    window.localStorage.removeItem('light_mode');
  } else {
    window.localStorage.setItem('light_mode', true);
    window.localStorage.removeItem('dark_mode');
  }
};

// Deletes the token and date from the localStorage
export async function logOut() {
  const date = new Date();
  date.setTime(date.getTime() - 60000 * 99999999);
  localStorage.setItem('ArsenicExpiration', date);
  window.location.reload();
}

// Will make the profile private once the functionality is added
export async function changePrivateSetting({setIsPrivate}) {
  try {
    const response = await APINoBody('/users/profile_privacy', 'POST')
    const json = await response.json();
    setIsPrivate(json.privacy ? true : null)
  }
  catch(err) {return}
}