import imageCompression from 'browser-image-compression';
import React, { useEffect, useState, useContext } from 'react';
import { APIBody } from '../../common/APICalls';
import ProfileDialogs from './myProfileDialogs';
import { cropToSquare } from './myProfileFunctions';
import { useInput } from '../../common/hooks';
import { StateContext } from '../../mainNav';
import RenderProfile from '../../renderComponentParts/RenderProfile';


export default function MyProfile() {
  const {
    profileData, setPostMenuVisibility,
    windowWidth
  } = useContext(StateContext)

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [postImagePreview, setPostImagePreview] = useState(null);

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 7680
  }

  const [newPostCaption, setNewPostCaption] = useInput({
    label: 'Write a caption', 
    id:'postCaption',
    type: 'text'
  });

  const [editProfileDescription, setEditProfileDescription] = useInput({
    label: 'Add or change profile description', 
    id:'profileDescription',
    type: 'text'
  });


  useEffect(() => {
    if (profileData && profileData.posts) {
      setPostMenuVisibility(Array(profileData.posts.length).fill(null));

      if (profileData.profile_description) {
      document.getElementById('profileDescription').value = profileData.profile_description
      }

      setProfileImagePreview(profileData.profile_picture);
    }
  }, [profileData]);

  if (!profileData || !profileData.posts) {
    return <div className='text-center my-5 py-5'><md-circular-progress indeterminate four-color></md-circular-progress></div>;
  }

  async function uploadPost() {
    const imageInput = document.getElementById('filePostInput').files[0];
    if (!imageInput && !newPostCaption) {
      return
    }

    const formData = new FormData();

    var compressedImage = null
    if (imageInput) {
      compressedImage = await imageCompression(imageInput, options);
    }

    formData.append('text', newPostCaption ? newPostCaption : '');
    formData.append('image_one', imageInput && compressedImage ? compressedImage : '');
    formData.append('date', Date.now());

    try {
      const response = await APIBody('/posts/', 'POST', formData)

      if (response.ok) {
        window.location.reload(false);
        return alert('Post uploaded successfully');
      } else {
        return alert('Failed to upload file');
      }
    }
    catch(err) {return}
  }


  async function updateProfile() {
    var textResponse = null
    var imageResponse = null
    
    try {
    if (document.getElementById('profileDescription').value != profileData.profile_description) {   
      
      textResponse = await APIBody('/users/profile_description', 'POST', JSON.stringify({ txt: editProfileDescription }))
    }

    const fileInput = document.getElementById('fileEditInput')

    if (fileInput.files.length > 0) {
      const imageInput = fileInput.files[0];

      let croppedImage = await cropToSquare(URL.createObjectURL(imageInput), setProfileImagePreview)

      const compressedImage = await imageCompression(croppedImage, options);

      const formDataImage = new FormData();
      formDataImage.append('profile_image', compressedImage);
      
      imageResponse = await APIBody('/users/profile_picture', 'POST', formDataImage)
    }
    if (!imageResponse && !textResponse) {return}
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
      <div className={windowWidth > 900 ? 'newPostButton' : 'newPostButtonMobile'}>
        
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
