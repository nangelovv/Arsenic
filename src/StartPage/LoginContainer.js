import React, { useState } from 'react';
import { API_URL } from '../config';


export default function LoginContainer() {
  function useInput({ type, placeholder, required }) {
    const [value, setValue] = useState("");
    const input = (
      <input 
        value={value} 
        className='rounded-4 borders-light h5' 
        placeholder={placeholder} 
        onChange={e => setValue(e.target.value)} 
        type={type}
        required={required}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            try_login();
          }
        }}
      />
    );
    return [value, input];
  }

  // const [isChecked, setIsChecked] = useState(false);
  const [username, usernameInput] = useInput({ type: "text", placeholder: "Username", required: true });
  const [password, passwordInput] = useInput({ type: "password", placeholder: "Password", required: true });


  // const handleCheckboxChange = (event) => {setIsChecked(event.target.checked);}
  
  async function try_login() {
    const credentials = username;
    const pass = password;

    if (!credentials || !pass) return

    const response = await fetch(API_URL + "/users/", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_username: credentials,
        password: pass
      })
    })

    const urlWithoutParams = window.location.href.split('?')[0];
    window.history.pushState({}, '', urlWithoutParams);

    if (response.ok) {
      const token = await response.json();
      const date = new Date();
      date.setTime(date.getTime() + 600 * 1000000);
      document.cookie = `token=${JSON.stringify(token)}; expires=${date.toUTCString()}`;
      window.location.reload(false);
    }
    else {
      alert("Invalid login data, please try again.")
    }
  }

  return (
    <div className='text-center d-none col-4 offset-4 p-3 my-6 rounded-5 secondary-light borders-light' id='LoginForm'>
      <form>
          <div className='col-12 my-3'>
              {usernameInput}
          </div>
          <div className='col-12 my-3'>
              {passwordInput}
          </div>
      </form>
      <button className='m-2 p-3 h5 tertiary-light rounded-4 borders-light overButton' type="submit" onClick={try_login}>
        Enter
      </button>
      {/* <div className="d-flex align-items-center  justify-content-center">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value={isChecked} onChange={handleCheckboxChange} id="stayLogged" style={{boxShadow: "none"}}/>
          <label className="form-check-label h6" htmlFor="flexCheckDefault">
            Stay logged in
          </label>
        </div>
      </div> */}
    </div>
  )
}
