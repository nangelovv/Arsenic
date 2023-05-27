import React, { useState } from 'react';
import { API_URL } from '../config';


export default function NewPost() {
  const [imagePreview, setImagePreview] = useState('');

  function resetImage() {
    setImagePreview(null)
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file); // Create object URL
    setImagePreview(imageUrl); // Set image preview
  }

  async function uploadFile() {
    const imageInput = document.getElementById('fileInput').files[0];
    const textInput = document.getElementById('caption').value

    if (!imageInput && !textInput) {
      return alert('No content to upload.')
    }

    const cookies = document.cookie.split(';');
    let token; // Declare variable for token cookie
    cookies.forEach(cookie => {
      const [name, value] = cookie.split('='); // Split cookie into name and value
      if (name.trim() === 'token') {
        // Check if name is "token"
        token = decodeURIComponent(value); // Decode the token value
        token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token string
      }
    });

    var bearer = 'Bearer ' + token;

    const formData = new FormData();
    formData.append('text', textInput);
    formData.append('image_one', imageInput);


    const response = await fetch(API_URL + '/posts/', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      return alert('File uploaded successfully');
    } else {
      return alert('Failed to upload file');
    }
  }

  return (
    <>
      <div className='col-8 offset-3 my-4'>
        <div className="row secondary-light borders-light rounded-5 mb-3">
          <div className="col-4">
              <input type="file" id="fileInput" onChange={handleFileChange} />
              <label htmlFor="fileInput" className="h5 rounded-3 borders-light tertiary-light overButton m-3 p-2 font-light fw-normal">
                  Choose an image
              </label>
          </div>
          <div className='col-4 d-flex justify-content-center'>
            <div className="h5 rounded-3 borders-light tertiary-light overButton m-3 p-2 font-light fw-normal">
              <span onClick={resetImage}>Reset</span>
            </div>
          </div>
          <div className='col-4 d-flex justify-content-end'>
            <div className="h5 rounded-3 borders-light tertiary-light overButton m-3 p-2 font-light fw-normal">
              <span onClick={uploadFile}>Upload</span>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className="col-8 rounded-4 d-flex align-items-center">
            {imagePreview && <img src={imagePreview} className='img-fluid rounded-4 borders-light' alt="Preview"/>}
          </div>
          <div className="col-4 my-auto">
            <textarea className="form-control rounded-4 borders-light" placeholder='Write a caption' rows="24" style={{width: "100%", height: "42vh", resize: "none", boxShadow: "none"}} id="caption"></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
