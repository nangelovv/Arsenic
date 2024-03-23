import React, { useState, useEffect, useRef, createContext } from 'react';
import { argbFromHex, themeFromSourceColor, applyTheme } from '@material/material-color-utilities';
import Home from './pages/Home/home';
import MyProfile from './pages/MyProfile/myProfile';
import Messages from './pages/Messages/messages';
import Discover from './pages/Discover/discover';
import RenderProfile from './renderComponentParts/RenderProfile';
import logo from './common/logo.png'
import { getProfile, getChats } from './common/profileFuncs';
import Settings from './settings/settingsDialog';
import ProfileFollows from './pages/MyProfile/myProfileFollows';
import NavigationButton from './navigationButton';
// import { openSocket } from './pages/Messages/socket';


// WHOLE MAIN FEED WILL BE REWRITTEN ONCE NAVIGATION DRAWER FROM MD3 IS FUNCTIONAL (the whole return statement)


export const StateContext = createContext()

export default function MainFeed() {
  // const [socket, setSocket] = useState(openSocket());

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
  const [isPrivate, setIsPrivate] = useState(null);

  // Get the theme from a hex color
  const theme = themeFromSourceColor(argbFromHex(basicColor), [{
    name: 'custom-1',
    value: argbFromHex('#ff0000'),
    blend: true,
  }]);

  var navBar = useRef()

  // function reconnectSocket() {
  //   if (socket.readyState == 3) {
  //     const newSocket = openSocket();
  //     setSocket(newSocket);
  //   }
  // }

  // socket.onclose = (e) => {setTimeout(reconnectSocket, 2000);};

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
      // socket.close()
    };
  }, []);

  // Set the active component in localStorage whenever it changes
  useEffect(() => {
    if (activeComponent == 'OtherProfile') {return}
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
    else {getProfile({
        user_id: localStorage.getItem('ArsenicUserID'),
        setFetchingProfile: setFetchingProfile,
        setProfile: setProfile,
        profileData: profileData,
        setProfileData: setProfileData,
        activeComponent: activeComponent,
        setActiveComponent: setActiveComponent}
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
        case 'OtherProfile':
          navBar.current.activeIndex = 1
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
      case 'OtherProfile':
        return <RenderProfile renderProfile={profile} />;
      default:
        return <Home/>;
    }
  };

  // Navigation Buttons Configuration
const navigationButtons = [
  { label: 'Home', icon: 'home', onClick: () => removeProfileOverlay('Home') },
  { label: 'Discover', icon: 'search', onClick: () => removeProfileOverlay('Discover') },
  { label: 'My Profile', icon: 'person', onClick: () => removeProfileOverlay('MyProfile') },
  { label: 'Messages', icon: 'message', onClick: () => removeProfileOverlay('Messages') },
  { label: 'Settings', icon: 'settings', onClick: () => document.getElementById('settingsDialog').show() },
];

  return (
    <StateContext.Provider value={{
      // socket, setSocket,
      profile, setProfile,
      followers, setFollowers,
      following, setFollowing,
      likes, setLikes,
      comments, setComments,
      profileData, setProfileData,
      postMenuVisibility, setPostMenuVisibility,
      profiles, setProfiles,
      showChatModal, setShowChatModal,
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
        <div className='row'>
          <nav className={windowWidth > 900 && 'col-3'}>
            {windowWidth > 900 
              ?
              <div className='col-2 fixed-top border-end vh-100'>
                {/* Logo and site name */}
                <div className='my-3 h3 mx-auto col-12 d-flex align-items-center justify-content-evenly'>
                  <img alt='Logo' style={{ width: '50px', height: '50px' }} src={logo} />
                  <span>Arsenic</span>
                </div>

                {/* Navigation buttons */}
                {navigationButtons.map((button, index) => (
                  <NavigationButton key={index} {...button} />
                ))}
              </div>
             :
              <md-navigation-bar ref={navBar} class='fixed-bottom'>
                {/* Navigation tabs */}
                {navigationButtons.map((button, index) => (
                  <md-navigation-tab key={index} label={button.label} onClick={button.onClick}>
                    <md-icon slot='active-icon'>{button.icon}</md-icon>
                    <md-icon slot="inactive-icon">{button.icon}</md-icon>
                  </md-navigation-tab>
                ))}
              </md-navigation-bar>
            }
          </nav>
          <main className={windowWidth > 900 ? 'col-8' : 'col-12 mb-5 pb-3'}>
              {renderComponent()}
          </main>
        </div>

      {/* Settings dialog */}
      <Settings />

      {/* Display profiles dialog */}
      <ProfileFollows
        id='viewLikes'
        header='Likes'
        profiles={likes}
        noFollows='This post has not been seen by anyone yet'
        alternativeNoFollows='This post has not been seen by anyone yet'
        myProfile={false}
      />
    </StateContext.Provider>
  )
}