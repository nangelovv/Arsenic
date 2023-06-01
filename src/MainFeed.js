import React, { useState, useEffect } from 'react';
import NewPost from './MainFeedPages/NewPost';
import Home from './MainFeedPages/Home';
import MyProfile from './MainFeedPages/MyProfile';
import Messages from './MainFeedPages/Messages';



export default function MainFeed() {
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem("activeComponent") || "Home");
  const [profileData, setProfileData] = useState(null);
  const [isRendered, setIsRendered] = useState(null);

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
        return <MyProfile setProfileData={setProfileData} profileData={profileData} setIsRendered={setIsRendered}/>;
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
  
  function replaceClass(elements, classes) {
    const current_theme = !darkMode ? 'dark' : 'light';
    const not_theme = darkMode ? 'dark' : 'light';

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.replace(
        `${classes}-${current_theme}`,
        `${classes}-${not_theme}`
      );
    }
  }
  
  useEffect(() => {
    const current_theme = !darkMode ? 'dark' : 'light';
  
    const classes = ['primary', 'secondary', 'tertiary', 'quaternary', 'font', 'borders', 'hrLines'];
  
    for (let i = 0; i < classes.length; i++) {
      const elements = Array.from(document.getElementsByClassName(`${classes[i]}-${current_theme}`));
      replaceClass(elements, classes[i]);
    }
  }, [darkMode, activeComponent, isRendered]);

  return (
    <>
      <div className='row'>
        <div className="col-2 m-4 rounded-5 text-center secondary-light borders-light text-decoration-none fixed-top">
          <div className="nav h4">
            <div className='mt-1 h1 mx-auto font-light col-12'>
              Arsenic
            </div>
            <hr className="col-10 mx-auto hrLines-light"></hr>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv'>
              <li className="nav-link">
                <span className='font-light' onClick={() => setActiveComponent("Home")}>Home</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv'>
              <li className="nav-link">
                <span className='font-light' onClick={() => setActiveComponent("MyProfile")}>My Profile</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv'>
              <li className="nav-link">
                <span className='font-light' onClick={() => setActiveComponent("NewPost")}>Make new post</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4 overDiv'>
              <li className="nav-link">
                <span className='font-light' onClick={() => setActiveComponent("Messages")}>Messages</span>
              </li>
            </div>
            <div className='my-2 col-12 mx-auto rounded-4'>
              <div className="my-2 overDiv font-light" data-bs-toggle="collapse" data-bs-target="#settingsCollapse" aria-expanded="false" aria-controls="settingsCollapse">
                Settings
              </div>
              <div className="collapse fw-normal h5 tertiary-light borders-light rounded-4 py-2 " id="settingsCollapse" style={{height: "50%"}}>
                <ul className="nav flex-column m-2">
                  <div className="row justify-content-start align-items-center" id="dark-theme-switch-container">
                    <div className="col text-center">
                      <label className="form-check-label font-light" htmlFor="darkThemeSwitch">Dark theme</label>
                    </div>
                    <div className="col text-center">
                      <div className="form-check form-switch d-flex justify-content-center align-items-center">
                        <input className="form-check-input" type="checkbox" id="darkThemeSwitch" checked={darkMode} onChange={handleThemeSwitch}/>
                      </div>
                    </div>
                  </div>
                  <hr className='hrLines-light'></hr>
                  <div className='overDiv rounded-4 py-2 text-center font-light'>
                    Delete profile
                  </div>
                  <hr className='hrLines-light'></hr>
                  <div className='overDiv rounded-4 text-center'>
                    <a href="#logOut" className="nav-link overDiv" onClick={() => {
                      const date = new Date();
                      date.setTime(date.getTime() - 60000 * 99999999);
                      localStorage.setItem("ArsenicExpiration", date);
                      window.location.reload();}}>
                      <span className='font-light'>Log out</span>
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
