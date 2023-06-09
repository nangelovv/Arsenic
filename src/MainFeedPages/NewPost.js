import imageCompression from 'browser-image-compression';
import React, { useState } from 'react';
import { API_URL } from '../config';


export default function NewPost() {
  const [imagePreview, setImagePreview] = useState('');

  function resetImage() {
    setImagePreview(null)
    document.getElementById('caption').value = null
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
      return
    }

    let token = localStorage.getItem("ArsenicToken");

    var bearer = 'Bearer ' + token;

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 7680
    }

    var compressedFile = null
    if (imageInput) {
      compressedFile = await imageCompression(imageInput, options);
    }

    const formData = new FormData();
    formData.append('text', textInput ? textInput : "");
    formData.append('image_one', imageInput && compressedFile ? compressedFile : "");
    formData.append('date', Date.now());


    const response = await fetch(API_URL + '/posts/', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      resetImage()
      return alert('Post uploaded successfully');
    } else {
      return alert('Failed to upload file');
    }
  }

  return (
    <>
      <div className='col-8 offset-3 my-4'>
        <div className="row secondary-color borders-color rounded-5 mb-3">
          <div className="col-4">
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
              Choose an image
            </label>
          </div>
          <div className='col-4 d-flex justify-content-center'>
            <button
              className="h5 rounded-3 borders-color tertiary-color overButton m-3 p-2 font-color fw-normal"
              onClick={resetImage}
              tabIndex="0"
            >
              Reset
            </button>
          </div>
          <div className='col-4 d-flex justify-content-end'>
            <button
              className="h5 rounded-3 borders-color tertiary-color overButton m-3 p-2 font-color fw-normal"
              onClick={uploadFile}
              tabIndex="0"
            >
              Upload
            </button>
          </div>
        </div>
        <div className='row'>
          <div className="col-8 rounded-4 d-flex align-items-center">
            {imagePreview && (
              <img
                src={imagePreview}
                className='img-fluid rounded-4 borders-color'
                alt="Preview"
              />
            )}
          </div>
          <div className="col-4 my-auto">
            <textarea
              className="form-control rounded-4 borders-color"
              placeholder='Write a caption'
              rows="24"
              style={{ width: "100%", height: "42vh", resize: "none", boxShadow: "none" }}
              id="caption"
              tabIndex="0"
            ></textarea>
          </div>
        </div>
      </div>
    </>

  );
}
