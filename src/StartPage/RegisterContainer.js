import React, { useEffect } from 'react';
import { API_URL } from '../config';


function useInput({ type, id, placeholder, required }) {
  const [value, setValue] = React.useState('');
  const input = (
    <input
      className='rounded-4 borders-color h5'
      type={type}
      placeholder={placeholder}
      name={id}
      id={id}
      value={value}
      required={required}
      onChange={e => setValue(e.target.value)}
    />
  );
  return [value, input];
}

export default function RegisterContainer() {
  const [email, emailInput] = useInput({ type: 'email', id: 'email_box', placeholder: 'E-mail', required: true });
  const [username, usernameInput] = useInput({ type: 'text', id: 'username_box', placeholder: 'Username', required: true });
  const [firstName, firstNameInput] = useInput({ type: 'text', id: 'first_name_box', placeholder: 'First name', required: true });
  const [lastName, lastNameInput] = useInput({ type: 'text', id: 'last_name_box', placeholder: 'Last name', required: true });
  const [password1, password1Input] = useInput({ type: 'password', id: 'password_box1', placeholder: 'Password', required: true });
  const [password2, password2Input] = useInput({ type: 'password', id: 'password_box2', placeholder: 'Repeat password', required: true });

  async function try_register() {
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
      document.getElementById('RegisterForm').classList.add('d-none');
      document.getElementById('LoginForm').classList.remove('d-none');
    } else {
      alert('Invalid register data, please try again.');
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 13) { // enter key
        e.preventDefault();
        try_register();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, username, firstName, lastName, password1, password2]);

  return (
    <div className='text-center d-none col-4 offset-4 p-3 my-6 rounded-5 secondary-color borders-color' id='RegisterForm'>
      <form>
        <div className='col-12 my-3'>{emailInput}</div>
        <div className='col-12 my-3'>{usernameInput}</div>
        <div className='col-12 my-3'>{firstNameInput}</div>
        <div className='col-12 my-3'>{lastNameInput}</div>
        <div className='col-12 my-3'>{password1Input}</div>
        <div className='col-12 my-3'>{password2Input}</div>
      </form>
      <button className='m-2 p-3 h5 tertiary-color rounded-4 borders-color overButton' type='submit' onClick={() => try_register()}>
        Submit
      </button>
    </div>
  );
}

