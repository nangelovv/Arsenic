import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';


function useInput({ type, id, placeholder, required }) {
  const [value, setValue] = useState('');
  const input = (
    <md-outlined-text-field 
      className='rounded-4 borders-color h5'
      type={type}
      label={placeholder}
      minLength={8}
      name={id}
      id={id}
      value={value}
      required={required}
      onInput={e => setValue(e.target.value)}
    ></md-outlined-text-field>
  );
  return [value, input];
}

export default function RegisterContainer({setShowRegister, showRegister}) {
  const [email, emailInput] = useInput({ type: 'email', id: 'email_box', placeholder: 'E-mail', required: true });
  const [username, usernameInput] = useInput({ type: 'text', id: 'username_box', placeholder: 'Username', required: true });
  const [firstName, firstNameInput] = useInput({ type: 'text', id: 'first_name_box', placeholder: 'First name', required: true });
  const [lastName, lastNameInput] = useInput({ type: 'text', id: 'last_name_box', placeholder: 'Last name', required: true });
  const [password1, password1Input] = useInput({ type: 'password', id: 'password_box1', placeholder: 'Password', required: true });
  const [password2, password2Input] = useInput({ type: 'password', id: 'password_box2', placeholder: 'Repeat password', required: true });

  async function tryRegister() {
    if (password1 !== password2) {
      alert('Passwords do not match.');
      return;
    }

    const response = await fetch(API_URL + '/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password1,
        username: username,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const urlWithoutParams = window.location.href.split('?')[0];
    window.history.pushState({}, '', urlWithoutParams);

    if (response.ok) {
      console.log("Here", showRegister)
      setShowRegister(false)
    } else {
      alert('Invalid register data, please try again.');
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 13) { // enter key
        e.preventDefault();
        tryRegister();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, username, firstName, lastName, password1, password2]);

  return (
    <div className='text-center col-sm-4 container py-3 rounded-3 borders-color centerLoginRegister'>
      <img
        style={{ width: '60px', height: '60px' }}
        src={"./logo.png"}
      />
      <form>
        <div className='col-sm-10 mx-auto my-3'>{emailInput}</div>
        <div className='col-sm-10 mx-auto my-3'>{usernameInput}</div>
        <div className='col-sm-10 mx-auto my-3'>{firstNameInput}</div>
        <div className='col-sm-10 mx-auto my-3'>{lastNameInput}</div>
        <div className='col-sm-10 mx-auto my-3'>{password1Input}</div>
        <div className='col-sm-10 mx-auto my-3'>{password2Input}</div>
      </form>
      <md-text-button
        onClick={e => {setShowRegister(false)}}
      >
        Already have an account?
      </md-text-button>
      <md-filled-button
        type="submit"
        onClick={tryRegister}
      >
        Submit
      </md-filled-button>
    </div>
  );
}

