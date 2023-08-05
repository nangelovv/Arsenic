import React, { useContext } from 'react';
import { MainFeedContext } from '../MainFeed';


export default function Messages() {
  const { 
    profileData, setProfileData,
    windowWidth, setWindowWidth,
    activeComponent, setActiveComponent,
    showModal, setShowModal } = useContext(MainFeedContext);

  return (
    <div>
      <span>The Messages component is not yet ready. Sorry for the inconvenience.</span>
    </div>
  );
};
