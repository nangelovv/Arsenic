import { APINoBody } from '../common/APICalls';
import { MyProfileContext } from '../MainFeed';
import React, { useContext } from 'react';


// This function takes as parameters an event from an input element and function which saves the state 
// of the image after it has been converted to a URL which can be displayed
export async function handleFileChange(event, imagePreviewFunction) {

  // Get file from the element that called the function
  const file = event.target.files[0];

   // Create object URL
  const imageUrl = URL.createObjectURL(file);

  // Call the cropToSquare function
  cropToSquare(imageUrl, imagePreviewFunction);
}


// Location and functionality of this function may change and with that the comments going with it
export async function handleDeletePost(postId) {

  try {

    const response = await APINoBody('/posts/' + postId, 'DELETE')
  
    if (response.ok) {
      window.location.reload(false);
      return alert('Post deleted successfully.');
    }
    else {
      return alert('Failed to delete post.');
    }
  }
  catch(err) {return}
};


// This function is called when one of the 3 dots buttons from any post is pressed, it takes as a parameter 
// the index of the post in the posts variable
export function ToggleMenu(index) {
  const {
    profileData, setProfileData,
    postMenuVisibility, setPostMenuVisibility
  } = useContext(MyProfileContext);

  // The open state of the menu is changed here by accessing its value in the list by the index, 
  // depending on its current state, it will either be null for closed or any other value, 
  // in this case true for open
  setPostMenuVisibility((prevState) => {
    const updatedState = [...prevState];
    if (updatedState[index]) {
      updatedState[index] = null
    }
    else {
      updatedState[index] = true
    }
    return updatedState;
  });
};


// Function to crop the image to a square and return the cropped file
export async function cropToSquare(imageUrl, setImagePreview) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Determine the size of the square (choose the smaller dimension)
      const size = Math.min(img.width, img.height);

      // Center the image in the square canvas
      const xOffset = (img.width - size) / 2;
      const yOffset = (img.height - size) / 2;

      // Set canvas size to the square
      canvas.width = size;
      canvas.height = size;

      // Draw the cropped square image on the canvas
      ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);

      // Convert the canvas image to a Blob
      canvas.toBlob((blob) => {
        // Create a new File object from the Blob
        const croppedFile = new File([blob], "profile_image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        setImagePreview(URL.createObjectURL(blob));

        // Resolve the Promise with the cropped file
        resolve(croppedFile);
      }, "image/jpeg");
    };
    img.onerror = () => {
      reject(new Error("Failed to load the image."));
    };
    img.src = imageUrl;
  });
}
