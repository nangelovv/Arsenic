import React, { useState } from 'react';
import LoginContainer from './StartPage/LoginContainer';
import RegisterContainer from './StartPage/RegisterContainer';
import MainFeed from './MainFeed';


function App() {
  const [showRegister, setShowRegister] = useState(false);
  const token = localStorage.getItem("ArsenicToken");
  const date = new Date(localStorage.getItem("ArsenicExpiration"));

  let ExpiredToken = true

  if (token) {
    if (date) {
      const currentDate = new Date();
      if (currentDate < date) {
        ExpiredToken = false;
      }
    }
  }

  if (ExpiredToken) {
    return (
      <>
        {showRegister ? <RegisterContainer showRegister={showRegister} setShowRegister={setShowRegister} /> : <LoginContainer setShowRegister={setShowRegister} />}
      </>
    );
  }
  else {
    return (
      <>
      <MainFeed/>
      </>
    )
  }
}


export default App;