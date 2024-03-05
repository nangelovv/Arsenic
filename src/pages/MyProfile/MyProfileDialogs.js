import React from 'react';
import { handleFileChange } from './myProfileFunctions';

export default function ProfileDialogs({ id, header, inputID, actionButton, buttonFunc, imageSetter, captionDescription, inputPreview }) {
  return (
    <md-dialog id={id}>
      <span className='d-flex justify-content-center' slot='headline'>{header}</span>
      <form id='form' method='dialog' slot='content'>
        <div className='d-flex align-items-center justify-content-between'>
          <md-text-button
            onClick={() => {document.getElementById(inputID).click()}}
            type={'button'}
          >
            Select image
          </md-text-button>
          <md-filled-button onClick={buttonFunc}>{actionButton}</md-filled-button>
        </div>

        <input
          className='d-none'
          type='file'
          accept='.jpg, .jpeg, .png'
          id={inputID}
          onChange={(e) => {handleFileChange(e, imageSetter)}}
        />

        {inputPreview && (
          <div className='text-center my-3'>
            <img
              src={inputPreview}
              style={{maxHeight: '40vh', maxWidth: '100%'}}
              className='img-fluid rounded-4 borders-color'
              alt='Preview'
            />
          </div>
        )}

        <div className='text-center my-3'>
          {captionDescription}
        </div>
      </form>
    </md-dialog>
  );
}