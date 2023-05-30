import React from 'react'
import LoginContainer from './StartPage/LoginContainer';
import RegisterContainer from './StartPage/RegisterContainer';
import StartButtons from './StartPage/StartButtons';
import MainFeed from './MainFeed';


function App() {
  const token = localStorage.getItem("ArsenicToken");
  const date = new Date(localStorage.getItem("ArsenicExpiration"));

  let ExpiredToken = true
  if (token && date) {
    const currentDate = new Date();
    if (currentDate < date) {
      ExpiredToken = false;
    }
  }

  if (ExpiredToken) {
    return (
    <>
      <StartButtons/>
      <LoginContainer/>
      <RegisterContainer/>
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