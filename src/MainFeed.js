import React, { useState, useEffect, useRef } from 'react';
import Home from './MainFeedPages/Home';
import MyProfile from './MainFeedPages/MyProfile';
import Messages from './MainFeedPages/Messages';
import Discover from './MainFeedPages/Discover';


export default function MainFeed() {
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem("activeComponent") || "Home");
  const [profileData, setProfileData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  var dialogRef = useRef();
  var navBar = useRef()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      handleActivetab()
    };

    window.addEventListener("resize", handleResize);
    handleActivetab()

    // Clean up the event listener when the component is unmounted
    return () => {
      handleActivetab()
      window.removeEventListener("resize", handleResize);
    };
  }, []);

// Get the last active component from localStorage
  useEffect(() => {
    const lastActiveComponent = localStorage.getItem("activeComponent");
    if (lastActiveComponent) {
      setActiveComponent(lastActiveComponent);
    }
    handleActivetab()
  }, []);

// Set the active component in localStorage whenever it changes
useEffect(() => {
  localStorage.setItem("activeComponent", activeComponent);
  handleActivetab()
}, [activeComponent]);

function handleActivetab() {
  if (navBar.current) {
    switch (activeComponent) {
      case "Home":
        navBar.current.activeIndex = 0
        break
      case "Discover":
        navBar.current.activeIndex = 1
        break
      case "MyProfile":
        navBar.current.activeIndex = 2
        break
      case "Messages":
        navBar.current.activeIndex = 3
        break
      default:
        navBar.current.activeIndex = 0
    }

  }
}

  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home  windowWidth={windowWidth}/>;
      case "Discover":
        return <Discover  windowWidth={windowWidth}/>;
      case "MyProfile":
        return <MyProfile profileData={profileData} setProfileData={setProfileData} windowWidth={windowWidth}/>;
      case "Messages":
        return <Messages profileData={profileData} setProfileData={setProfileData} windowWidth={windowWidth}/>;
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
  
  function logOut() {
    const date = new Date();
    date.setTime(date.getTime() - 60000 * 99999999);
    localStorage.setItem("ArsenicExpiration", date);
    window.location.reload();
  }

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

  function settingsDialog() {
    return (
      <md-dialog ref={dialogRef} fullscreen fullscreen-breakpoint={"(max-width: 10000px), (max-height: 400px)"}>
        
        <md-standard-icon-button dialog-action>
          <md-icon>arrow_back</md-icon>
        </md-standard-icon-button>

        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
            <span>Dark theme</span>
          </div>
          <div className='d-inline'>
            <md-switch onClick={handleThemeSwitch} selected={darkMode ? true : null}></md-switch>
          </div>
        </div>

        <md-divider></md-divider>
        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
            <span>Private mode</span>
          </div>
          <div className='d-inline'>
            <md-switch onClick={null} selected={null}></md-switch>
          </div>
        </div>

        <md-divider></md-divider>
        <div className='py-3 text-center'>
          <md-text-button id="navButtons">Delete profile</md-text-button>
        </div>

        <md-divider></md-divider>
        <div className='py-3 text-center'>
          <md-text-button id="navButtons" dialog-action onClick={() => {logOut()}}>Log out</md-text-button>
        </div>

      </md-dialog>
    )
  }

  return (
    windowWidth > 900 ?
    <div className='row'>
      <div className="col-2 fixed-top border-end vh-100">
        <div>
          <div className='my-3 h3 mx-auto col-12 d-flex align-items-center justify-content-evenly'>
            <img
              alt='Logo'
              style={{ width: '50px', height: '50px' }}
              src={"./logo.png"}
            />
            <span>Arsenic</span>
          </div>
          <div className='text-center col-12 my-3'>
            <md-text-button id="navButtons" onClick={() => setActiveComponent("Home")}>
            <md-icon slot="icon">home</md-icon>
              Home
            </md-text-button>
          </div>
          <div className='text-center col-12 my-3'>
            <md-text-button id="navButtons" onClick={() => setActiveComponent("Discover")}>
              <md-icon slot="icon">search</md-icon>
              Discover
            </md-text-button>
          </div>
          <div className='text-center col-12 my-3'>
            <md-text-button id="navButtons" onClick={() => setActiveComponent("MyProfile")}>
              <md-icon slot="icon">person</md-icon>
              My Profile
            </md-text-button>
          </div>
          <div className='text-center col-12 my-3'>
            <md-text-button id="navButtons" onClick={() => setActiveComponent("Messages")}>
              <md-icon slot="icon">message</md-icon>
              Messages
            </md-text-button>
          </div>
          <div className='text-center col-12 my-3'>
            <md-text-button id="navButtons" onClick={() => {dialogRef.current.show()}}>
              <md-icon slot="icon">settings</md-icon>
              Settings
            </md-text-button>
          </div>
        </div>
      </div>
      {settingsDialog()}
      {renderComponent()}
    </div>
    :
    <div>
      <div className='fixed-bottom'>
        <md-navigation-bar ref={navBar}>

          <md-navigation-tab label={"Home"} onClick={() => setActiveComponent("Home")}>
            <md-icon slot="activeIcon">home</md-icon>
            <md-icon slot="inactiveIcon">home</md-icon>
          </md-navigation-tab>

          <md-navigation-tab label={"My Profile"} onClick={() => setActiveComponent("MyProfile")}>
            <md-icon slot="activeIcon">person</md-icon>
            <md-icon slot="inactiveIcon">person</md-icon>
          </md-navigation-tab>

          <md-navigation-tab label={"Messages"} onClick={() => setActiveComponent("Messages")}>
            <md-icon slot="activeIcon">message</md-icon>
            <md-icon slot="inactiveIcon">message</md-icon>
          </md-navigation-tab>

          <md-navigation-tab label={"Settings"} onClick={() => {dialogRef.current.show()}}>
            <md-icon slot="activeIcon">settings</md-icon>
            <md-icon slot="inactiveIcon">settings</md-icon>
          </md-navigation-tab>

        </md-navigation-bar>
      </div>
      {settingsDialog()}
      {renderComponent()}
    </div>
  )
}
