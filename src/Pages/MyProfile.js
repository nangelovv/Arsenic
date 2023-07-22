import imageCompression from 'browser-image-compression';
import React, { useEffect, useState} from 'react';
import noUserImage from './noUser.jpg';
import { APIBody, APINoBody } from './APICalls';
import { transformTime, handleDeletePost } from './profileFunctions';
import { displayProfileDialogs } from './profileDialogs';


export default function MyProfile({ profileData, setProfileData, windowWidth }) {

  // This variable holds the preview url of the profile picture
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // This variable holds all of the states of the menus for each post (either open/true or closed/null)
  const [postMenuVisibility, setPostMenuVisibility] = useState([]);

  // This variable holds the preview url of the post image
  const [postImagePreview, setPostImagePreview] = useState(null);

  // There are the limits an image can have after being compressed
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 7680
  }

  // This function is called from the below variables, first its sets the value of the input field as null 
  // and then returns both the value and the field element itself
  function useInput({placeholder, id}) {

    const [value, setValue] = useState(null);

    const input = (
      <md-outlined-text-field
        type={'textarea'}
        dialog-focus
        value={value}
        label={placeholder} 
        id={id}
        onInput={e => setValue(e.target.value)}
      ></md-outlined-text-field>
    );

    return [value, input];
  }

  // The below 2 variables are the ones that call the above function and initiate the
  // EditProfile and NewPost dialogs, the only neccesary parameters are the id which will be given to the field 
  // and the label which will always be shown inside of it, the first variable hold the current value of the textfield
  // and the other variable is the one its being initiated by
  const [newPostCaption, setNewPostCaption] = useInput({
    placeholder: 'Write a caption', 
    id:'postCaption'
  });

  const [editProfileDescription, setEditProfileDescription] = useInput({
    placeholder: 'Add or change profile description', 
    id:'profileDescription'
  });

  // This function is called when one of the 3 dots buttons from any post is pressed, it takes as a parameter 
  // the index of the post in the posts variable
  const toggleMenu = (index) => {

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

  // This function is called from the useEffect hook when profileData is first initiated 
  // if profileData is already present, the function returns null
  async function getProfile() {
    if (profileData) {return}

    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {

      const response = await APINoBody('/users/is_profile', 'GET')
  
      if (response.ok) {
  
        const json = await response.json();
        const data = JSON.parse(json);
  
        // Sort the list based on the 'date' attribute
        data.posts.sort((a, b) => b.date - a.date);
  
        // Set a default profile image if user has no profile picture
        if (!data.profile_image) {
          data.profile_image = noUserImage
        }
        setProfileData(data);
      }
    }
    catch(err) {return}
  }

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
      setProfileImagePreview(profileData.profile_image);
    }

    // If no profile data is present in the profileData variable, the getProfile function is called
    getProfile();
  }, [profileData]);

  // If neither the user profile has been retrieved and there are no posts, a circular progress element will show
  if (!profileData || !profileData.posts) {
    return <div className='text-center my-5 py-5'><md-circular-progress indeterminate four-color></md-circular-progress></div>;
  }

  // The user profile properties are unpacked into their own seperate values here, which are then used in the return statement
  const { username, profile_image, profile_description, posts } = profileData;

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
    if (editProfileDescription != profileData.profile_description) {
        
      textResponse = await APIBody('/users/profile_description', 'POST', JSON.stringify({ txt: editProfileDescription }))
    }

    const fileInput = document.getElementById('fileEditInput')

    // Checks if a file has actually been selected
    if (fileInput.files.length > 0) {
      const imageInput = document.getElementById('fileEditInput').files[0];

      // The image is being compressed to a smaller size and added to the formData which will later be send
      // as the body in the request
      const compressedImage = await imageCompression(imageInput, options);

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
      {/* Shows the container in different dimensions depending on how big the screen of the user is */}
      <div>

        {/* Holds the profile picture and username so that they are displayed on the same row */}
        <div className='row'>
          <div className='col-4 justify-content-center align-items-center text-center mt-3'>

            {/* The profile image is shown in different dimensions depending on the size of the device its being viewed on */}
            <img
              alt='Profile'
              className='img-fluid col-12' 
              style={windowWidth > 600 ? { width: '150px', height: '150px', borderRadius: '150px' } : { width: '80px', height: '80px', borderRadius: '80px' }} 
              src={profile_image} 
            />
          </div>

          {/* The containers holds the username, if the username is too long, breaks the text on the next line */}
          <div className='col-4 d-flex align-items-center mt-3 h3 text-break'>
            <span>{username}</span>
          </div>

          {/* When pressed, the 'editProfile' dialog is opened */}
          <div className='col-4 d-flex align-items-center text-center mt-3'>
            <md-filled-button onClick={() => {document.getElementById('editProfile').show()}}>
              Edit Profile
            </md-filled-button>
          </div>
        </div>

        {/* The container holds the profile description which it display on a seperate row from the
         username and profile picture */}
        <div className='text-center my-2'>
          <span>{profile_description}</span>
        </div>
        <md-divider></md-divider>

        {/* The container holds all posts, if there are none, shows a texting stating so */}
        <div className='row'>
          {posts.length === 0 ? 
          ( 
            <>
              <span className='text-center my-5 py-5'>
                No posts
              </span>

              {/* When pressed, the newPost dialog is opened */}
              <a href='javascript:void(0);' 
                className='text-decoration-none text-center'
                onClick={() => {document.getElementById('newPost').show()}}
              >
                Make a new post
              </a>
            </>
          )

          :

          (

          // Iterate through all of the the profile posts (if there are any) that have been received 
          // and render each one in its own container
            posts.map((post, index) => (
              // Shows the container in different dimensions depending on how big the screen of the user is          
              <div className={windowWidth > 900 ? 'col-10 mx-auto my-3 py-3 rounded-4 border' : 'col-12 py-3 border-bottom'} key={post.id}>
                
                {/* Use float-end bootstrap 5 so that the 3 dot menu floats at the top right corner of the container */}
                <div className='float-end'>

                  {/* Use position relative css style so when the menu is opened, 
                  it stays on the appropriate position next the to the anchor button */}
                  <div style={{position: 'relative'}}>

                    {/* The button to which the below 3 dot menu is anchored, when pressed, 
                    makes it the active anchor for the menu, and calls function 'toggleMenu'
                    with the 'index' parameter, where it updates the open state of the menu 
                    the ID of the button and menu below are important as this is how they get anchored
                    and thus the state of the menu gets updated*/}
                    <md-standard-icon-button id={post.date} onClick={() => {document.getElementById(post.id).anchor = document.getElementById(post.date); toggleMenu(index)}}>
                      <md-icon>more_vert</md-icon>
                    </md-standard-icon-button>

                    {/* The open state of the menu depends on the 'postMenuVisibility' index 
                    to which this post/menu correspond */}
                    <md-menu id={post.id} open={postMenuVisibility[index]} menu-corner='START_END'>

                      {/* The below options, except for the last one, are currently inactive and have no functionality */}
                      <md-menu-item disabled
                        headline={'Edit caption'}>
                      </md-menu-item>
                      <md-menu-item disabled
                        headline={'Hide comments'}>
                      </md-menu-item>
                      <md-menu-item disabled
                        headline={'Hide like count'}>
                      </md-menu-item>

                      {/* When pressed/the mouseUp event is triggered, the 'handleDeletePost' function is called
                      with the only required parameter (post.id) where it sends an API call to the back-end 
                      to delete the post and all of it related information */}
                      <md-menu-item
                        onMouseUp={() => {handleDeletePost(post.id)}}
                        headline={'Delete post'}>
                      </md-menu-item>
                    </md-menu>
                  </div>
                </div>

                {/* Contains the post details like username, date and profile image which were retrieved 
                in the back-end API call */}
                <div className='row'>

                  {/* The container holds the profile image which is displayed as a small rounded circle */}
                  <div className='col-2 text-end'>
                    <img
                      className='rounded-5'
                      style={{ width: '60px', height: '60px' }}
                      src={profile_image}
                      alt='Profile'
                    />
                  </div>

                  {/* Holds both username and date div so that they are on one row */}
                  <div className='row col-8 mx-1 d-flex align-items-center'>

                    {/* The container holds the username*/}
                    <div className='container h5'>
                      <span>{username}</span>
                    </div>

                    {/* First the 'transformTime' function is being called so that the time is transformed 
                    into human readable time as the provided one from the call is in milliseconds */}
                    <div className='container h6 fw-normal'>
                      <span>{transformTime(post.date)}</span>
                    </div>
                  </div>

                  {/* Checks is the post has a caption to render, if not, nothing is rendered */}
                  <div className='col-10 offset-1 mx-auto my-2 h6 fw-normal'>
                    <span>{post.caption ? (post.caption) : (null)}</span>
                  </div>
                </div>

                {/* Checks if the post has an image to render, if not, nothing is rendered*/}
                <div className='col-10 mx-auto'>
                  {post.image_one ? 
                  (
                    <img
                      alt='Post profile'
                      className='img-fluid col-12 rounded-3 border'
                      src={post.image_one}
                    />
                  ) : 
                  (
                    null
                  )}
                </div>

              {/* End of div which holds each post seperately, starts new iteration (new post) if there is one */}
              </div>
              
            ))
          )}
        </div>
      </div>
      
      {/* If there are no posts yet, the floating button is not shown, 
      additionally, the position of the FAB button is dependant on what device the page is being viewed */}
      <div
        className={posts.length === 0 ? 'd-none' : windowWidth > 900 ? 'col-md-2 offset-md-9 col-lg-2 offset-lg-10' : 'float-end'}
        style={windowWidth > 900 ? { bottom: '10px', left: '20px', position: 'sticky' } : { bottom: '100px', right: '20px', position: 'sticky' }}
      >
        
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

      {/* This calls a function which returns the newPost dialog as an element if the FAB button is pressed */}
      {displayProfileDialogs(
        'newPost',
        'Make new post',
        'filePostInput',
        'Post',
        uploadPost,
        setPostImagePreview,
        setNewPostCaption,
        postImagePreview
      )}

      {/* This calls a function which returns the editProfile dialog as an element if the Edit button is pressed */}
      {displayProfileDialogs(
        'editProfile',
        'Edit profile',
        'fileEditInput',
        'Save',
        updateProfile,
        setProfileImagePreview,
        setEditProfileDescription,
        profileImagePreview
      )}
    </>

  );
}
