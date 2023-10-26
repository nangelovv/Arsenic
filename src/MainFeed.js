import React, { useState, useEffect, useRef, createContext } from 'react';
import { argbFromHex, themeFromSourceColor, applyTheme } from '@material/material-color-utilities';
import Home from './Home/Home';
import MyProfile from './MyProfile/MyProfile';
import Messages from './Messages/Messages';
import Discover from './Discover/Discover';
import logo from './common/logo.png'
import { getProfile, getChats } from './common/profileFuncs';
import { API_URL } from './config';
import { token } from './common/APICalls';
import Settings from './Settings';
import { displayProfilesDialog } from './MyProfile/MyProfileFollows';


const afterProtocol = API_URL.split("://")[1];
function openSocket() {
  return new WebSocket('ws://' + afterProtocol + '/' + token);
}


// WHOLE MAIN FEED WILL BE REWRITTEN ONCE NAVIGATION DRAWER FROM MD3 IS FUNCTIONAL (the whole return statement)


export const StateContext = createContext()

export default function MainFeed() {
  const [socket, setSocket] = useState(openSocket());

  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [postMenuVisibility, setPostMenuVisibility] = useState([]);

  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [comments, setComments] = useState([]);

  const [followingPosts, setFollowingPosts] = useState([]);
  const [followingNoPosts, setFollowingNoPosts] = useState(500);

  const [messageIDs, setMessageIDs] = useState([]);
  const [chatsGlimpse, setChatsGlimpse] = useState({});
  const [allChatsMessages, setAllChatsMessages] = useState({});
  const [currentChatInfo, setCurrentChatInfo] = useState({});

  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [recommendedNoPosts, setRecommendedNoPosts] = useState(500);

  const [profileData, setProfileData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likes, setLikes] = useState([]);
  
  const [basicColor, setBasicColor] = useState(localStorage.getItem('basicColor') || '#F6F7FB')
  const [activeComponent, setActiveComponent] = useState(localStorage.getItem('activeComponent') || 'Home');
  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('dark_mode') === 'true' || null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(null);

  // Get the theme from a hex color
  const theme = themeFromSourceColor(argbFromHex(basicColor), [{
    name: 'custom-1',
    value: argbFromHex('#ff0000'),
    blend: true,
  }]);

  var navBar = useRef()

  function reconnectSocket() {
    if (socket.readyState == 3) {
      const newSocket = openSocket();
      setSocket(newSocket);
    }
  }

  socket.onclose = (e) => {setTimeout(reconnectSocket, 2000);};

  // Sets the listener for the 'resize' event
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      handleActiveTab()
    };

    window.addEventListener('resize', handleResize);
    handleActiveTab()

    const lastActiveComponent = localStorage.getItem('activeComponent');
    const lastBasicColor = localStorage.getItem('basicColor');

    if (lastActiveComponent) {
      setActiveComponent(lastActiveComponent);
    }
    if (lastBasicColor) {
      setBasicColor(lastBasicColor);
    }
    if (chatsGlimpse.length == 0 || chatsGlimpse.length == undefined) {
      getChats({setChatsGlimpse: setChatsGlimpse, chatsGlimpse: chatsGlimpse})
    }

    return () => {
      handleActiveTab()
      window.removeEventListener('resize', handleResize);
      socket.close()
    };
  }, []);

  // Set the active component in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeComponent', activeComponent);
    handleActiveTab()
  }, [activeComponent]);

  // Set the basic color in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('basicColor', basicColor);
    applyTheme(theme, {target: document.body, dark: darkMode ? true : false});
  }, [basicColor]);

  useEffect(() => {

    if (profileData) {
      setIsPrivate(profileData.privacy ? true : null)
    }
    // If no profile data is present in the profileData variable, the getProfile function is called
    else {
      getProfile({
        user_id: localStorage.getItem('ArsenicUserID'),
        setFetchingProfile: setFetchingProfile,
        setProfile: setProfile,
        setShowProfileModal: setShowProfileModal,
        showProfileModal: showProfileModal,
        profileData: profileData,
        setProfileData: setProfileData,
        activeComponent: activeComponent,
        useEffectCall: true}
      )
    }
  }, [profileData]);

  // Adds or removed the light or dark theme files
  useEffect(() => {
    applyTheme(theme, {target: document.body, dark: darkMode ? true : false});
    if (darkMode) {
      // Add dark theme CSS file
      const darkThemeLink = document.createElement('link');
      darkThemeLink.rel = 'stylesheet';
      darkThemeLink.href = './styles/dark_theme.css';
      document.head.appendChild(darkThemeLink);

      // Remove light theme CSS file if it exists
      const lightThemeLink = document.querySelector("link[href='./styles/light_theme.css']");
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
      const darkThemeLink = document.querySelector("link[href='./styles/dark_theme.css']");
      if (darkThemeLink) {
        darkThemeLink.remove();
      }
    }
  }, [darkMode]);

  function removeProfileOverlay(component) {
    setActiveComponent(component);
    setShowProfileModal(false);
    setFetchingProfile(false);
  }

  // Changes the active index of the tabs to the one set in 'activeComponent'
  function handleActiveTab() {
    if (navBar.current) {
      switch (activeComponent) {
        case 'Home':
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

  return (
    <StateContext.Provider value={{
      socket, setSocket,
      profile, setProfile,
      followers, setFollowers,
      following, setFollowing,
      likes, setLikes,
      comments, setComments,
      profileData, setProfileData,
      postMenuVisibility, setPostMenuVisibility,
      profiles, setProfiles,
      showChatModal, setShowChatModal,
      showProfileModal, setShowProfileModal,
      recommendedPosts, setRecommendedPosts,
      recommendedNoPosts, setRecommendedNoPosts,
      followingPosts, setFollowingPosts,
      followingNoPosts, setFollowingNoPosts,
      windowWidth, setWindowWidth,
      isPrivate, setIsPrivate,
      basicColor, setBasicColor,
      darkMode, setDarkMode,
      activeComponent, setActiveComponent,
      fetchingProfile, setFetchingProfile,
      messageIDs, setMessageIDs,
      chatsGlimpse, setChatsGlimpse,
      allChatsMessages, setAllChatsMessages,
      currentChatInfo, setCurrentChatInfo
      }}>
      {/* In a future version, there would only be a Nav Drawer for the site, once the element in MD3 is functional */}
      {/* Based on the size of the screen the page is being viewed on, either the Nav Drawer shows up or the Nav Bar */}
      {windowWidth > 900 ?
      <nav className='row'>

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
            <md-text-button id='navButtons' onClick={() => {document.getElementById('settingsDialog').show()}}>
              <md-icon slot='icon'>settings</md-icon>
              Settings
            </md-text-button>
          </div>
        </div>
      </nav>
      :
        // Keeps the navBar always at the bottom of the page
        <nav className='fixed-bottom'>
          <md-navigation-bar ref={navBar} className='navBar'>

            {/* Each of the below navigation-tabs renders the component its connected to, except for 'Settings', 
            which opens the settings dialog. The divs keep all of the buttons centered and equally spaced */}
            <md-navigation-tab label={'Home'} onClick={() => removeProfileOverlay('Home')}>
              <md-icon slot='activeIcon'>home</md-icon>
              <md-icon slot='inactiveIcon'>home</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Discover'} onClick={() => removeProfileOverlay('Discover')}>
              <md-icon slot='activeIcon'>search</md-icon>
              <md-icon slot='inactiveIcon'>search</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'My Profile'} onClick={() => removeProfileOverlay('MyProfile')}>
              <md-icon slot='activeIcon'>person</md-icon>
              <md-icon slot='inactiveIcon'>person</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Messages'} onClick={() => removeProfileOverlay('Messages')}>
              <md-icon slot='activeIcon'>message</md-icon>
              <md-icon slot='inactiveIcon'>message</md-icon>
            </md-navigation-tab>

            <md-navigation-tab label={'Settings'} onClick={() => {document.getElementById('settingsDialog').show()}}>
              <md-icon slot='activeIcon'>settings</md-icon>
              <md-icon slot='inactiveIcon'>settings</md-icon>
            </md-navigation-tab>

          </md-navigation-bar>
        </nav>
      }

      <Settings/>

      {/* Depending on the whether the navBar or navDrawer is currently shown the other component will be 
      either 'fullscreen' or only partial */}
      <main className={windowWidth > 900 ? 'col-8 offset-3' : 'col-12 mb-5 pb-3'}>{renderComponent()}</main>

      {displayProfilesDialog(
        'viewLikes',
        'Likes',
        likes,
        'This post has not been seen by anyone yet',
        'This post has not been seen by anyone yet',
        false
      )}
    </StateContext.Provider>
  )
}
