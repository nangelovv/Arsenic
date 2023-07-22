import TestComponent from './LoginRegisterComponent';
import MainFeed from './MainFeed';


function App() {

  // Access the token and date value from the localStorage
  const token = localStorage.getItem('ArsenicToken');
  const date = new Date(localStorage.getItem('ArsenicExpiration'));

  let ExpiredToken = true

  // If a token and date are present in the localStorage, the current date and the token date are compared, 
  // if it is expired, nothing happens, if the current date is smaller than the token date, the variable 
  // 'ExpiredToken' is set to false, so that the user can log in down below
  if (token) {
    if (date) {
      const currentDate = new Date();
      if (currentDate < date) {
        ExpiredToken = false;
      }
    }
  }

  // If the date in the localStorage token is expired, the Login/Register container is shown, 
  // else the MainFeed pages are rendered
  if (ExpiredToken) {
    return (
      <TestComponent/>
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