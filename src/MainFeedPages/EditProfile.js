import imageCompression from 'browser-image-compression';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';


export default function EditProfile({ profileData, removeOverlay }) {
  const [imagePreview, setImagePreview] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
      setNewValue(profileData.profile_description)
      setImagePreview(profileData.profile_image);
      }, 
  [])

  const handleDescriptionChange = (event) => {
    let value = event.target.value;
    setNewValue(value);
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file); // Create object URL
    setImagePreview(imageUrl); // Set image preview
  }

  async function uploadFile() {
    var textResponse = null
    var imageResponse = null

    let token = localStorage.getItem("ArsenicToken");
    var bearer = 'Bearer ' + token;

    const textInput = document.getElementById('caption').value

    if (newValue != profileData.profile_description) {
        textResponse = await fetch(API_URL + '/users/profile_description', {
            method: 'POST',
            body: JSON.stringify({ txt: textInput }),
            headers: {
                Authorization: bearer,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    const fileInput = document.getElementById('fileInput')

    if (fileInput.files && fileInput.files.length > 0) {

      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 7680
      }

      const imageInput = document.getElementById('fileInput').files[0];
      const compressedFile = await imageCompression(imageInput, options);

      const formDataImage = new FormData();
      formDataImage.append('profile_image', compressedFile);
      
      if (imageInput != profileData.profile_image) {
          imageResponse = await fetch(API_URL + '/users/profile_picture', {
            method: 'POST',
            body: formDataImage,
            headers: {
            Authorization: bearer,
            Accept: 'application/json',
            },
          });
      }
    }
    
    if (!imageResponse && !textResponse) {return}

    if ((imageResponse?.ok || false) || (textResponse?.ok || false)) {
      removeOverlay()
      return alert('Profile edited successfully');
    } 
    else {
      return alert('Failed to edit profile');
    }
  }

  return (
    <>
      <section className='profile-editor col-8 my-4 secondary-color rounded-5 borders-color p-3'>
        <button
          className="close-button position-absolute top-0 end-0 m-3 rounded-5 h4 px-3 tertiary-color borders-color overButton py-2"
          onClick={removeOverlay}
          tabIndex="0">
          X
        </button>
        <div className="row rounded-5 mb-3">
          <div className="col-6 d-flex justify-content-start">
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              tabIndex="0"
            />
            <label
              htmlFor="fileInput"
              className="h5 rounded-3 borders-color tertiary-color overButton m-3 p-2 font-color fw-normal"
              tabIndex="0"
            >
              Change profile picture
            </label>
          </div>
          <div className='col-6 d-flex justify-content-end'>
            <button
              className="h5 rounded-3 borders-color tertiary-color overButton m-3 p-2 font-color fw-normal"
              onClick={uploadFile}
              tabIndex="0"
            >
              <span>Upload</span>
            </button>
          </div>
        </div>
        <div className='row'>
          <div className="col-8 rounded-4 d-flex align-items-center">
            {imagePreview && (
              <img
                src={imagePreview}
                className='img-fluid rounded-4 borders-color mx-auto'
                style={{ maxHeight: "300px", maxWidth: "300px" }}
                alt="Profile Preview"
              />
            )}
          </div>
          <div className="col-4 my-auto">
            <textarea
              value={newValue || ""}
              onChange={handleDescriptionChange}
              className="form-control rounded-4 borders-color"
              placeholder='Write profile description'
              rows="24"
              style={{ width: "100%", height: "50vh", resize: "none", boxShadow: "none" }}
              id="caption"
              aria-label="Profile description"
              tabIndex="0"
            ></textarea>
          </div>
        </div>
      </section>
    </>
    );
}
