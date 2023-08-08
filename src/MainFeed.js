import React, { useState, useEffect, useRef, createContext } from 'react';
import Home from './Home/Home';
import MyProfile from './MyProfile/MyProfile';
import Messages from './Messages/Messages';
import Discover from './Discover/Discover';
import logo from './common/logo.png'


// WHOLE MAIN FEED WILL BE REDESIGNED VISUALLY ONCE NAVIGATION DRAWER FROM MD3 IS FUNCTIONAL (the whole return statement)


export const RenderProfileContext = createContext();
export const MyProfileContext = createContext();
export const DiscoverContext = createContext();
export const MainFeedContext = createContext();
export const HomeContext = createContext();


export default function MainFeed() {

  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [postMenuVisibility, setPostMenuVisibility] = useState([]);
  const [profile, setProfile] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [noPosts, setNoPosts] = useState(500)
  const [posts, setPosts] = useState([]);
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem('activeComponent') || 'Home');
  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('dark_mode') === 'true');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [profileData, setProfileData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Menu and Menu;s button ref hooks
  var dialogRef = useRef();
  var navBar = useRef()

  // Sets the listener for the 'resize' event
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      handleActivetab()
    };

    window.addEventListener('resize', handleResize);
    handleActivetab()

    // Cleans up the event listener when the component is unmounted
    return () => {
      handleActivetab()
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get the last active component from localStorage
  useEffect(() => {
    const lastActiveComponent = localStorage.getItem('activeComponent');
    if (lastActiveComponent) {
      setActiveComponent(lastActiveComponent);
    }
    handleActivetab()
  }, []);

  // Set the active component in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeComponent', activeComponent);
    handleActivetab()
  }, [activeComponent]);

  // Changes the active index of the tabs to the one set in 'activeComponent'
  function handleActivetab() {
    if (navBar.current) {
      switch (activeComponent) {
        case 'Home':
          navBar.current.activeIndex = 0
          break
        case 'Discover':
          navBar.current.activeIndex = 1
          break
        case 'MyProfile':
          navBar.current.activeIndex = 2
          break
        case 'Messages':
          navBar.current.activeIndex = 3
          break
        default:
          navBar.current.activeIndex = 0
      }
    }
  }

  // Renders the correct component depending on which one is set in 'activeComponent'
  function renderComponent() {
    switch (activeComponent) {
      case 'Home':
        return <Home/>;
      case 'Discover':
        return <Discover/>;
      case 'MyProfile':
        return <MyProfile/>;
      case 'Messages':
        return <Messages/>;
      default:
        return <Home/>;
    }
  };

  // Changes the state of 'newMode' variable to the opposite of what it was and sets the new darkMode state in the storage
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
  
  // Deletes the token and date from the localStorage
  async function logOut() {
    const date = new Date();
    date.setTime(date.getTime() - 60000 * 99999999);
    localStorage.setItem('ArsenicExpiration', date);
    window.location.reload();
  }

  // Will make the profile private once the functionality is added
  async function makePrivate() {
    return null
  }

  // Adds or removed the light or dark theme files
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

  function removeProfileOverlay(component) {
    setActiveComponent(component);
    setShowModal(false);
    setFetchingProfile(false);
  }

  return (
    <RenderProfileContext.Provider value={{profile, setProfile}}>
    <MyProfileContext.Provider value={{
      profileData, setProfileData,
      postMenuVisibility, setPostMenuVisibility
      }}>
    <DiscoverContext.Provider value={{
      profiles, setProfiles,
      showModal, setShowModal
    }}>
    <HomeContext.Provider value={{
      posts, setPosts,
      noPosts, setNoPosts
    }}>
    <MainFeedContext.Provider value={{
      windowWidth, setWindowWidth,
      activeComponent, setActiveComponent,
      fetchingProfile, setFetchingProfile
    }}>
      {/* In a future version, there would only be a Nav Drawer for the site, once the element in MD3 is functional */}
      {/* Based on the size of the screen the page is being viewed on, either the Nav Drawer shows up or the Nav Bar */}
      {windowWidth > 900 ?
      <div className='row'>

        {/* Makes the NavDrawer only 2 columns of the whole screen, span to the bottom of the page and be always fixed on it */}
        <div className='col-2 fixed-top border-end vh-100'>

          {/* Holds the name and logo of the site centered, but equally spaced */}
          <div className='my-3 h3 mx-auto col-12 d-flex align-items-center justify-content-evenly'>
            <img
              alt='Logo'
              style={{ width: '50px', height: '50px' }}
              src={logo}
            />
            <span>Arsenic</span>
          </div>

          {/* Each of the below divs hold a button for a component, which when pressed renders that component, 
          except for 'Settings', which opens the settings dialog. The divs keep all of the buttons centered 
          and equally spaced */}
          <div className='text-center my-3'>
            <md-text-button id='navButtons' onClick={() => removeProfileOverlay('Home')}>
            <md-icon slot='icon'>home</md-icon>
              Home
            </md-text-button>
          </div>
          <div className='text-center my-3'>
            <md-text-button id='navButtons' onClick={() => removeProfileOverlay('Discover')}>
              <md-icon slot='icon'>search</md-icon>
              Discover
            </md-text-button>
          </div>
          <div className='text-center my-3'>
            <md-text-button id='navButtons' onClick={() => removeProfileOverlay('MyProfile')}>
              <md-icon slot='icon'>person</md-icon>
              My Profile
            </md-text-button>
          </div>
          <div className='text-center my-3'>
            <md-text-button id='navButtons' onClick={() => removeProfileOverlay('Messages')}>
              <md-icon slot='icon'>message</md-icon>
              Messages
            </md-text-button>
          </div>
          <div className='text-center my-3'>
            <md-text-button id='navButtons' onClick={() => {dialogRef.current.show()}}>
              <md-icon slot='icon'>settings</md-icon>
              Settings
            </md-text-button>
          </div>
        </div>
      </div>
      :
      <>

        {/* Keeps the navBar always at the bottom of the page */}
        <div className='fixed-bottom'>
          <md-navigation-bar ref={navBar} className='navBar'>

            {/* Each of the below navigation-tabs renders the component its connected to, except for 'Settings', 
            which opens the settings dialog. The divs keep all of the buttons centered and equally spaced */}
            <md-navigation-tab label={'Home'} onClick={() => setActiveComponent('Home')}>
              <md-icon slot='activeIcon'>home</md-icon>
              <md-icon slot='inactiveIcon'>home</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Discover'} onClick={() => {setActiveComponent('Discover'); setShowModal(false)}}>
              <md-icon slot='activeIcon'>search</md-icon>
              <md-icon slot='inactiveIcon'>search</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'My Profile'} onClick={() => setActiveComponent('MyProfile')}>
              <md-icon slot='activeIcon'>person</md-icon>
              <md-icon slot='inactiveIcon'>person</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Messages'} onClick={() => setActiveComponent('Messages')}>
              <md-icon slot='activeIcon'>message</md-icon>
              <md-icon slot='inactiveIcon'>message</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Settings'} onClick={() => {dialogRef.current.show()}}>
              <md-icon slot='activeIcon'>settings</md-icon>
              <md-icon slot='inactiveIcon'>settings</md-icon>
            </md-navigation-tab>

          </md-navigation-bar>
        </div>

      </>
      }

      {/* Holds all of the settings that are currently and will be added eventually, will always open in 'fulscreen' */}
      <md-dialog ref={dialogRef} fullscreen fullscreen-breakpoint={'(max-width: 10000px), (max-height: 400px)'}>
        
        {/* This button closes the dialog */}
        <md-standard-icon-button dialog-action>
          <md-icon>arrow_back</md-icon>
        </md-standard-icon-button>

        {/* This div holds the dark theme switch and label on the same row, equally spaced. 
        When the switch is pressed, it changes its states and calls 'handleThemeSwitch' which 
        changes the theme of the page */}
        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
            <span>Dark theme</span>
          </div>
          <div className='d-inline'>
            <md-switch onClick={handleThemeSwitch} selected={darkMode ? true : null}></md-switch>
          </div>
        </div>

        <md-divider></md-divider>

        {/* This div holds the private mode switch and label on the same row, equally spaced. 
        When the switch is pressed, it changes its states and calls 'makePrivate' which 
        changes the theme of the page */}
        <div className='d-inline col-12 py-3 d-flex align-items-center justify-content-between'>
          <div className='d-inline'>
            <span>Private mode</span>
          </div>
          <div className='d-inline'>
            <md-switch onClick={makePrivate} disabled></md-switch>
          </div>
        </div>

        <md-divider></md-divider>
        <div className='py-3 text-center'>
          <md-text-button id='navButtons' disabled>Delete profile</md-text-button>
        </div>

        {/* When pressed, the 'logOut' function is called, which deleted the token and date from the 
        localStorage and thus logging out the user */}
        <md-divider></md-divider>
        <div className='py-3 text-center'>
          <md-text-button id='navButtons' dialog-action onClick={() => {logOut()}}>Log out</md-text-button>
        </div>
      </md-dialog>

      {/* Depending on the whether the navBar or navDrawer is currently shown the other component will be 
      either 'fullscreen' or only partial */}
      <div className={windowWidth > 900 ? 'col-8 offset-3' : 'col-12 mb-5 pb-3'}>{renderComponent()}</div>
    </MainFeedContext.Provider>
    </HomeContext.Provider>
    </DiscoverContext.Provider>
    </MyProfileContext.Provider>
    </RenderProfileContext.Provider>
  )
}
