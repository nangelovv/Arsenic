import { useInput } from '../../common/hooks';
import { APINoAuth } from '../../common/APICalls';
import React, { useState, useEffect, useRef } from 'react';
import logo from '../../common/logo.png'
import { jwtDecode } from "jwt-decode";

const changePasswordType = (e) => {
  e.target.parentNode.type = e.target.selected ? 'text' : 'password';
  e.preventDefault()
}


export default function LoginRegisterComponent() {
  const [showRegister, setShowRegister] = useState(false)

  // The below variables call the above function 'useInput' where the each of these text fields is initiated
  const [email, emailInput] = useInput({ type: 'email', label: 'E-mail', supportingText: null, required: true, id: 'emailField' });
  const [username, usernameInput] = useInput({ type: 'text', label: 'Username', supportingText: 'Must be at least 4 characters', required: true, minlength: 4, maxlength: 30, id: 'usernameField', onClickFunc: sendData });
  const [firstName, firstNameInput] = useInput({ type: 'text', label: 'First name', supportingText: null, required: true, id: 'firstNameField' });
  const [lastName, lastNameInput] = useInput({ type: 'text', label: 'Last name', supportingText: null, required: true, id: 'lastNameField' });
  const [password, passwordInput] = useInput({ type: 'password', label: 'Password', supportingText: 'Must be at least 8 characters', required: true, minlength: 8, maxlength: 30, id: 'passwordField', isToggle: true, hideIcon: false, onClickFunc: changePasswordType });
  const [password1, password1Input] = useInput({ type: 'password', label: 'Repeat password', required: true, id: 'password2Field', isToggle: true, hideIcon: false });

  async function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // Convert the hash bytes to a hexadecimal string
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  async function googleData(credentials) {
    // Prepare the data that will be sent to the server
    const body = JSON.stringify({
      email: credentials.email,
      password: 'GooglePassword',
      username: credentials.given_name[0].toLowerCase() + credentials.family_name.toLowerCase() + Math.floor(Math.random() * 1000),
      first_name: credentials.given_name,
      last_name: credentials.family_name,
      profile_picture: credentials.picture,
      google_id: credentials.sub,
    })

    const response = await APINoAuth('/users/google', 'POST', body)

    // If the response from the server is successful (200), the login fields are shown, else an alert message is shown
    if (response.ok) {
      login(response)
    } else {
      alert('Something went wrong. Please try again.');
    }
  }

  // This function makes the call to the server with the necessary login or register data
  async function sendData(event) {
    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try{
      const password = document.getElementById('passwordField').value
      
      const hashedPassword = await sha256(password);
      // Checks if the extra register fields were shown, if not a login API request is send instead of register
      if (showRegister){

        // Checks if the password in both fields match
        if (password !== password1) {
          alert('Passwords do not match.');
          return;
        }

        // Prepare the data that will be sent to the server
        const body = JSON.stringify({
          email: email,
          password: hashedPassword,
          username: username,
          first_name: firstName,
          last_name: lastName,
        })

        const response = await APINoAuth('/users/register', 'POST', body)
      
        // If the response from the server is successful (200), the login fields are shown, else an alert message is shown
        if (response.ok) {
          setShowRegister(false)
          event.preventDefault()
        } else {
          alert('Invalid register data, please try again.');
        }
      }
        
      else {

        // Checks if either the username or password fields are empty
        if (!username || !password) {return}

        // Prepare the data that will be sent to the server
        const body = JSON.stringify({
          email_username: username,
          password: hashedPassword
        })
      
        const response = await APINoAuth('/users/', 'POST', body)
      
        login(response)
      }
      // Clears the URL of any parameters
      const urlWithoutParams = window.location.href.split('?')[0];
      window.history.pushState({}, '', urlWithoutParams);
      }
    catch(err) {return}
  }

  const divRef = useRef(null);

  async function login(response) {
    // If the response from the server is successful (200), the user token along with the current date 
    // are saved in the localStorage and the page is reloaded to display the Feed, else an alert message is shown
    if (response.ok) {
      const json = await response.json();
      const data = JSON.parse(json);
      const date = new Date();
      date.setTime(date.getTime() + 600 * 1000000);
      localStorage.setItem('ArsenicToken', data.token);
      localStorage.setItem('ArsenicUserID', data.user_id);
      localStorage.setItem('ArsenicExpiration', date);
      window.location.reload(false);
    }
    else {
      alert('Invalid login data, please try again.')
    }
  }

  useEffect(() => {
    if (divRef.current) {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "680698515796-krtnls2ihucno01tqaf00jkqvb6e3hsm.apps.googleusercontent.com",
          callback: (res, error) => {
            googleData(jwtDecode(res.credential))
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: 'outlined',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          shape: 'pill',
          locale: 'en-GB',
          logo_alignment: 'left',
        });
      }
    }
  }, [divRef.current]);

  return (
    <div className='text-center col-lg-4 container py-3 rounded-3 borders-color centerLoginRegister'>
      <img
        className='mt-3'
        style={{ width: '60px', height: '60px' }}
        src={logo}
      />
      <form>

        {/* Each div keeps the textfield centered in the container and equally spaced to the other fields */}
        <div className='col-sm-10 mx-auto my-3'>{usernameInput}</div>

        {/* Checks if the showRegister variable is set to 'true', if so the below text field show up on the page,
        if not nothing is rendered. Same applies for the 'password1Input' text field*/}
        {showRegister ? 
            <>
            <div className='col-sm-10 mx-auto my-3'>{emailInput}</div>
            <div className='col-sm-10 mx-auto my-3'>{firstNameInput}</div>
            <div className='col-sm-10 mx-auto my-3'>{lastNameInput}</div>
            </> 
        : 
            null
        }
        <div className='col-sm-10 mx-auto my-3'>{passwordInput}</div>
        
        {showRegister ? 
            <div className='col-sm-10 mx-auto my-3'>{password1Input}</div>
        :
            null
        }
      </form>

      {/* When the button is pressed, either the Login or Register fields are shown */}

      <div className='d-flex align-items-center justify-content-evenly my-2'>

        <md-text-button onClick={() => {setShowRegister(!showRegister)}}>
          {showRegister ? 'Already have an account?' : "Don't have an account?"}
        </md-text-button>

      {/* When the button is pressed a call to the server is made if the data is correct */}
      <md-filled-button onClick={() => {sendData()}}>
        {showRegister ? 'Submit' : 'Enter'}
      </md-filled-button>
      </div>

      <div ref={divRef} className='d-flex align-items-center justify-content-evenly my-2'/>

      <div className={true ? 'd-none' : 'd-flex align-items-center justify-content-evenly'}>
        <md-text-button>Forgotten password?</md-text-button>
      </div>
    </div>
  );
}

