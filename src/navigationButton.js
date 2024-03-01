import React from 'react';

export default function NavigationButton({ label, icon, onClick }) {
  return (
    <div className='text-center my-3'>
      <md-text-button id='navButtons' onClick={onClick}>
        <md-icon slot='icon'>{icon}</md-icon>
        {label}
      </md-text-button>
    </div>
  );
}