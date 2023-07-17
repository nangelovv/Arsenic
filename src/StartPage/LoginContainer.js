import React, { useState } from 'react';
import { API_URL } from '../config';


export default function LoginContainer({setShowRegister}) {

  function useInput({ type, placeholder, required}) {

    const [value, setValue] = useState("");

    const input = (
      <md-outlined-text-field 
        value={value}
        label={placeholder} 
        onInput={e => setValue(e.target.value)} 
        type={type}
        required={required}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            tryLogin();
          }
        }}></md-outlined-text-field>
    );

    return [value, input];
  }

  const [username, usernameInput] = useInput({ type: "text", placeholder: "Username or email", required: true});
  const [password, passwordInput] = useInput({ type: "password", placeholder: "Password", required: true});
  
  async function tryLogin() {

    if (!username || !password) return

    const response = await fetch(API_URL + "/users/", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_username: username,
        password: password
      })
    })

    const urlWithoutParams = window.location.href.split('?')[0];
    window.history.pushState({}, '', urlWithoutParams);

    if (response.ok) {
      const token = await response.json();
      const date = new Date();
      date.setTime(date.getTime() + 600 * 1000000);
      localStorage.setItem("ArsenicToken", token);
      localStorage.setItem("ArsenicExpiration", date);
      window.location.reload(false);
    }
    else {
      alert("Invalid login data, please try again.")
    }
  }

  return (
    <div className='text-center col-sm-4 container py-3 rounded-3 borders-color centerLoginRegister'>
      <img
        style={{ width: '60px', height: '60px' }}
        src={"./logo.png"}
      />
      <form>
        <div className='col-sm-10 mx-auto my-3'>
        {usernameInput}
        </div>
        <div className='col-sm-10 mx-auto my-3'>
        {passwordInput}
        </div>
      </form>
      <md-text-button
      onClick={e => {setShowRegister(true)}}
      >
        Don't have an account?
      </md-text-button>
      <md-filled-button
        type="submit"
        onClick={tryLogin}
      >
        Enter
      </md-filled-button>
    </div>
  )
}
