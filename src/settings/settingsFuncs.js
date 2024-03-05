import { APINoBody } from "../common/APICalls";


// Toggles the 'darkMode' state and updates the corresponding setting in localStorage
export async function handleThemeSwitch({ darkMode, setDarkMode }) {
  const newMode = !darkMode;
  setDarkMode(newMode);

  const modeKey = newMode ? 'dark_mode' : 'light_mode';
  window.localStorage.setItem(modeKey, true);
  window.localStorage.removeItem(newMode ? 'light_mode' : 'dark_mode');
}

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