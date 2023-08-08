import React, { useState} from 'react';


// This function is called from the below variables, first its sets the value of the input field as null 
// and then returns both the value and the field element itself
export function useInput({ placeholder = '', id = 'NoID', type = 'text', supportingText = null, required = null, func = () => {} }) {

const [value, setValue] = useState(null);

const input = (
    <md-outlined-text-field
    type={type}
    dialog-focus
    value={value}
    label={placeholder} 
    id={id}
    required={required}
    supporting-text={supportingText}
    onKeyPress={() => {func()}}
    onInput={e => setValue(e.target.value)}
    ></md-outlined-text-field>
);

return [value, input];
}