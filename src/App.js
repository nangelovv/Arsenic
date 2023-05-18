import React from 'react'
import LoginContainer from './StartPage/LoginContainer';
import RegisterContainer from './StartPage/RegisterContainer';
import StartButtons from './StartPage/StartButtons';
import MainFeed from './MainFeed';


function App() {
  const cookies = document.cookie.split(";"); // Get all cookies
  let token; // Declare variable for token cookie
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("="); // Split cookie into name and value
    if (name.trim() === "token") { // Check if name is "token"
      token = decodeURIComponent(value); // Decode the token value
    }
  });

  if (!token) {
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