import { useState, useEffect } from 'react';


// This function is called from the below variables, first its sets the value of the input field as null 
// and then returns both the value and the field element itself
export function useInput({
  label = '',
  id = 'NoID',
  type = 'text',
  supportingText = null,
  required = null,
  minlength = -1,
  maxlength = -1,
  onClickFunc = () => {},
  isToggle = null,
  hideIcon = true,
  activeIcon = 'visibility',
  inactiveIcon = 'visibility_off',
  }) {

  const [value, setValue] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      // 13 is the keyCode for 'Enter' on the keyboard
      if (e.keyCode === 13) {
        e.preventDefault();
        onClickFunc(e);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClickFunc]);

  const input = (
    <md-outlined-text-field
    type={type}
    value={value}
    label={label} 
    id={id}
    minlength={minlength}
    maxlength={maxlength}
    required={required}
    supporting-text={supportingText}
    onInput={e => setValue(e.target.value)}
    >  
      <md-icon-button
      toggle={isToggle}
      slot='trailing-icon'
      class={hideIcon && 'd-none'}
      onClick={(e) => {onClickFunc(e)}}>
        <md-icon>{activeIcon}</md-icon>
        <md-icon slot='selected'>{inactiveIcon}</md-icon>
      </md-icon-button>
    </md-outlined-text-field>
  );

  return [value, input];
}