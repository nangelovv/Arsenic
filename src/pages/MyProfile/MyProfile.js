import imageCompression from 'browser-image-compression';
import React, { useEffect, useState, useContext } from 'react';
import { APIBody } from '../../common/APICalls';
import ProfileDialogs from './MyProfileDialogs';
import { cropToSquare } from './MyProfileFunctions';
import { useInput } from '../../common/elemFuncs';
import { StateContext } from '../../mainNav';
import RenderProfile from '../../renderComponentParts/RenderProfile';


export default function MyProfile() {
  const {
    profileData, setPostMenuVisibility,
    windowWidth
  } = useContext(StateContext)


  // This variable holds the preview url of the profile picture
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // This variable holds the preview url of the post image
  const [postImagePreview, setPostImagePreview] = useState(null);

  // There are the limits an image can have after being compressed
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 7680
  }

  // The below 2 variables call the 'useInput' function and initiate the EditProfile and NewPost dialogs, 
  // the only neccesary parameters are the id which will be given to the field and the label which will always 
  // be shown inside of it, the first variable hold the current value of the textfield and the other variable 
  // is the one its being initiated by
  const [newPostCaption, setNewPostCaption] = useInput({
    placeholder: 'Write a caption', 
    id:'postCaption',
    type: 'text'
  });

  const [editProfileDescription, setEditProfileDescription] = useInput({
    placeholder: 'Add or change profile description', 
    id:'profileDescription',
    type: 'text'
  });


  // The useEffect hook is called when the status of profileData is changed
  useEffect(() => {

    // Check if there is actually any data in the variable, if some, it fills the useState 
    // 'setPostMenuVisibility' list with null which represent the open state of each of the menus for each post
    if (profileData && profileData.posts) {
      setPostMenuVisibility(Array(profileData.posts.length).fill(null));

      // Checks if the profile has toHaveDescription, if some, it is set as a value in the input field for EditProfile
      if (profileData.profile_description) {
      document.getElementById('profileDescription').value = profileData.profile_description
      }

      // The profile image is set to the one received from the API call 
      setProfileImagePreview(profileData.profile_picture);
    }
  }, [profileData]);

  // If neither the user profile has been retrieved and there are no posts, a circular progress element will show
  if (!profileData || !profileData.posts) {
    return <div className='text-center my-5 py-5'><md-circular-progress indeterminate four-color></md-circular-progress></div>;
  }

  // This function is called when the 'Post' button from the EditProfile dialog is called.
  async function uploadPost() {
    const imageInput = document.getElementById('filePostInput').files[0];

    // If neither an image is uploaded or a caption is written, the function returns null
    if (!imageInput && !newPostCaption) {
      return
    }

    const formData = new FormData();

    // if an image is selected, it is compressed to a smaller size
    var compressedImage = null
    if (imageInput) {
      compressedImage = await imageCompression(imageInput, options);
    }

    // Depending on whether the new post has a caption and/or image, they are added to the formData which is then
    // sent to the back-end server as the body of the request
    formData.append('text', newPostCaption ? newPostCaption : '');
    formData.append('image_one', imageInput && compressedImage ? compressedImage : '');
    formData.append('date', Date.now());

    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {
      const response = await APIBody('/posts/', 'POST', formData)

      // If the response from the call was successful (200), the page is refreshed and an alert 
      // stating that the post has successfully been uploaded is shown, else an alert stating the opposite is shown
      if (response.ok) {
        window.location.reload(false);
        return alert('Post uploaded successfully');
      } else {
        return alert('Failed to upload file');
      }
    }
    catch(err) {return}
  }

  // This function is called when the 'Save' button from the EditProfile dialog is called.
  async function updateProfile() {
    var textResponse = null
    var imageResponse = null

    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {
      
    // Checks if the profile description that is currently in the text field is different from the one that
    // the profile already has, if its not, a request to the back-end is not send
    if (document.getElementById('profileDescription').value != profileData.profile_description) {   
      
      textResponse = await APIBody('/users/profile_description', 'POST', JSON.stringify({ txt: editProfileDescription }))
    }

    const fileInput = document.getElementById('fileEditInput')

    // Checks if a file has actually been selected
    if (fileInput.files.length > 0) {
      const imageInput = fileInput.files[0];

      let croppedImage = await cropToSquare(URL.createObjectURL(imageInput), setProfileImagePreview)

      // The image is being compressed to a smaller size and added to the formData which will later be send
      // as the body in the request

      const compressedImage = await imageCompression(croppedImage, options);

      const formDataImage = new FormData();
      formDataImage.append('profile_image', compressedImage);
      
      imageResponse = await APIBody('/users/profile_picture', 'POST', formDataImage)
    }

    // If neither one of the requests has been send to the back-end server, the function returns null
    if (!imageResponse && !textResponse) {return}

    // If either the image request or text request has been successful, an alert stating so is rendered, else
    // an alert stating the opposite is shown
    if ((imageResponse?.ok || false) || (textResponse?.ok || false)) {
      window.location.reload(false);
      return alert('Profile edited successfully');
    } 
    else {
      return alert('Failed to edit profile');
    }
    }
    catch(err) {return}
  }

  return (
    <>
      {<RenderProfile renderProfile={profileData}/>}
      {/* If there are no posts yet, the floanting button is not shown, 
      additionally, the position of the FAB button is dependant on what device the page is being viewed */}
      <div className={windowWidth > 900 ? 'newPostButton' : 'newPostButtonMobile'}>
        
        {/* When pressed, the newPost dialog is opened */}
        <md-branded-fab
          size='small'
          aria-label='New post'
          label='New post'
          onClick={() => {document.getElementById('newPost').show()}}
        >
          <md-icon slot='icon'>add</md-icon>
        </md-branded-fab>
      </div>

      <ProfileDialogs
        id='newPost'
        header='Make new post'
        inputID='filePostInput'
        actionButton='Post'
        buttonFunc={uploadPost}
        imageSetter={setPostImagePreview}
        captionDescription={setNewPostCaption}
        inputPreview={postImagePreview}
      />

      <ProfileDialogs
        id='editProfile'
        header='Edit profile'
        inputID='fileEditInput'
        actionButton='Save'
        buttonFunc={updateProfile}
        imageSetter={setProfileImagePreview}
        captionDescription={setEditProfileDescription}
        inputPreview={profileImagePreview}
      />
    </>
  );
}
