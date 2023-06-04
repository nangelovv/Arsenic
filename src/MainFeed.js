import React, { useState, useEffect } from 'react';
import NewPost from './MainFeedPages/NewPost';
import Home from './MainFeedPages/Home';
import MyProfile from './MainFeedPages/MyProfile';
import Messages from './MainFeedPages/Messages';



export default function MainFeed() {
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem("activeComponent") || "Home");
  const [profileData, setProfileData] = useState(null);

// Get the last active component from localStorage
useEffect(() => {
  const lastActiveComponent = localStorage.getItem("activeComponent");
  if (lastActiveComponent) {
    setActiveComponent(lastActiveComponent);
  }
}, []);

// Set the active component in localStorage whenever it changes
useEffect(() => {
  localStorage.setItem("activeComponent", activeComponent);
}, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home/>;
      case "MyProfile":
        return <MyProfile setProfileData={setProfileData} profileData={profileData}/>;
      case "NewPost":
        return <NewPost/>;
      case "Messages":
        return <Messages/>;
      default:
        return <Home/>;
    }
  };

  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('dark_mode') === 'true');

  const handleThemeSwitch = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      window.localStorage.setItem('dark_mode', true);
      window.localStorage.removeItem('light_mode');
    } else {
      window.localStorage.setItem('light_mode', true);
      window.localStorage.removeItem('dark_mode');
    }
  };
  
  
  useEffect(() => {
    if (darkMode) {
      // Add dark theme CSS file
      const darkThemeLink = document.createElement('link');
      darkThemeLink.rel = 'stylesheet';
      darkThemeLink.href = './styles/dark_theme.css';
      document.head.appendChild(darkThemeLink);

      // Remove light theme CSS file if it exists
      const lightThemeLink = document.querySelector('link[href="./styles/light_theme.css"]');
      if (lightThemeLink) {
        lightThemeLink.remove();
      }
    } else {
      // Add light theme CSS file
      const lightThemeLink = document.createElement('link');
      lightThemeLink.rel = 'stylesheet';
      lightThemeLink.href = './styles/light_theme.css';
      document.head.appendChild(lightThemeLink);

      // Remove dark theme CSS file if it exists
      const darkThemeLink = document.querySelector('link[href="./styles/dark_theme.css"]');
      if (darkThemeLink) {
        darkThemeLink.remove();
      }
    }
  }, [darkMode]);

  return (
    <>
      <div className='row'>
        <div className="col-2 m-4 rounded-5 text-center secondary-color borders-color text-decoration-none fixed-top">
          <div className="nav h4">
            <div className='mt-1 h1 mx-auto font-color col-12'>
              Arsenic
            </div>
            <hr className="col-10 mx-auto hrLines-color"></hr>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv' onClick={() => setActiveComponent("Home")}>
              <li className="nav-link">
                <span className='font-color'>Home</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv' onClick={() => setActiveComponent("MyProfile")}>
              <li className="nav-link">
                <span className='font-color'>My Profile</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv' onClick={() => setActiveComponent("NewPost")}>
              <li className="nav-link">
                <span className='font-color'>Make new post</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv' onClick={() => setActiveComponent("Messages")}>
              <li className="nav-link">
                <span className='font-color'>Messages</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4'>
              <div className="my-2 overDiv font-color" data-bs-toggle="collapse" data-bs-target="#settingsCollapse" aria-expanded="false" aria-controls="settingsCollapse">
                Settings
              </div>
              <div className="collapse fw-normal h5 tertiary-color borders-color rounded-4 py-2 " id="settingsCollapse" style={{height: "50%"}}>
                <ul className="nav flex-column m-2">
                  <div className="row justify-content-start align-items-center" id="dark-theme-switch-container">
                    <div className="col text-center">
                      <label className="form-check-label font-color" htmlFor="darkThemeSwitch">Dark theme</label>
                    </div>
                    <div className="col text-center">
                      <div className="form-check form-switch d-flex justify-content-center align-items-center">
                        <input className="form-check-input" type="checkbox" id="darkThemeSwitch" checked={darkMode} onChange={handleThemeSwitch}/>
                      </div>
                    </div>
                  </div>
                  <hr className='hrLines-color'></hr>
                  <div className='overDiv rounded-4 py-2 text-center font-color'>
                    Delete profile
                  </div>
                  <hr className='hrLines-color'></hr>
                  <div className='overDiv rounded-4 text-center'>
                    <a href="#logOut" className="nav-link overDiv" onClick={() => {
                      const date = new Date();
                      date.setTime(date.getTime() - 60000 * 99999999);
                      localStorage.setItem("ArsenicExpiration", date);
                      window.location.reload();}}>
                      <span className='font-color'>Log out</span>
                    </a>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>{renderComponent()}</div>
      </div>
    </>
  )
}
