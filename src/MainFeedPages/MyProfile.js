import imageCompression from 'browser-image-compression';
import React, { useEffect, useState} from 'react';
import noUserImage from './noUser.jpg';
import { API_URL } from '../config';


export default function MyProfile({ profileData, setProfileData, windowWidth }) {
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [postMenuVisibility, setPostMenuVisibility] = useState([]);
  const [postImagePreview, setPostImagePreview] = useState(null);

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 7680
  }

  function useInput({placeholder, id}) {

    const [value, setValue] = useState(null);

    const input = (
      <md-outlined-text-field
        dialog-focus
        value={value}
        label={placeholder} 
        id={id}
        onInput={e => setValue(e.target.value)}
      ></md-outlined-text-field>
    );

    return [value, input];
  }

  const [newPostCaption, setNewPostCaption] = useInput({placeholder: "Write a caption", id:"postCaption"});
  const [editProfileDescription, setEditProfileDescription] = useInput({placeholder: "Add or change profile description", id:"profileDescription"});

  function handleFileChange(event, imagePreviewFunction) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file); // Create object URL
    imagePreviewFunction(imageUrl); // Set image preview
  }

  const toggleMenu = (index) => {
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

  async function handleDeletePost(postId) {

    let token = localStorage.getItem("ArsenicToken");

    var bearer = 'Bearer ' + token;

    const response = await fetch(API_URL + '/posts/' + postId, {
      method: 'DELETE',
      headers: {
        Authorization: bearer,
        Accept: 'application/json'
      },
    });

    if (response.ok) {
      window.location.reload(false);
      return alert('Post deleted successfully.');
    }
    else {
      return alert('Failed to delete post.');
    }
  };

  async function getProfile() {

    if (profileData) { return }

    let token = localStorage.getItem("ArsenicToken");

    var bearer = 'Bearer ' + token;


    const response = await fetch(API_URL + '/users/is_profile', {
      method: 'GET',
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
      },
    });

    const json = await response.json();
    const data = JSON.parse(json);

    // Sort the list based on the "date" attribute
    data.posts.sort((a, b) => b.date - a.date);

    // Set a default profile image if user has no profile picture
    if (!data.profile_image) {
      data.profile_image = noUserImage
    }
    setProfileData(data);
  }

  useEffect(() => {
    if (profileData && profileData.posts) {
      setPostMenuVisibility(Array(profileData.posts.length).fill(null));
      if (profileData.profile_description) {
      document.getElementById("profileDescription").value = profileData.profile_description
      }
      setProfileImagePreview(profileData.profile_image);
    }
    getProfile();
  }, [profileData]);

  if (!profileData || !profileData.posts) {
    return <div className='text-center my-5 py-5'><md-circular-progress indeterminate four-color></md-circular-progress></div>;
  }

  const { username, profile_image, profile_description, posts } = profileData;

  function transformTime(milliseconds) {
    const date = new Date(parseInt(milliseconds, 10));

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // January is month 0
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  async function uploadPost() {
    const imageInput = document.getElementById('filePostInput').files[0];

    if (!imageInput && !newPostCaption) {
      return
    }

    let token = localStorage.getItem("ArsenicToken");

    var bearer = 'Bearer ' + token;

    const formData = new FormData();

    var compressedImage = null
    if (imageInput) {
      compressedImage = await imageCompression(imageInput, options);
    }

    formData.append('text', newPostCaption ? newPostCaption : "");
    formData.append('image_one', imageInput && compressedImage ? compressedImage : "");
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
      window.location.reload(false);
      return alert('Post uploaded successfully');
    } else {
      return alert('Failed to upload file');
    }
  }

  async function updateProfile() {
    var textResponse = null
    var imageResponse = null

    let token = localStorage.getItem("ArsenicToken");
    var bearer = 'Bearer ' + token;

    if (editProfileDescription != profileData.profile_description) {
        textResponse = await fetch(API_URL + '/users/profile_description', {
            method: 'POST',
            body: JSON.stringify({ txt: editProfileDescription }),
            headers: {
                Authorization: bearer,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    const fileInput = document.getElementById('fileEditInput')

    if (fileInput.files.length > 0) {
      const imageInput = document.getElementById('fileEditInput').files[0];

      const compressedImage = await imageCompression(imageInput, options);

      const formDataImage = new FormData();
      formDataImage.append('profile_image', compressedImage);
      
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
      window.location.reload(false);
      return alert('Profile edited successfully');
    } 
    else {
      return alert('Failed to edit profile');
    }
  }

  return (
    <>
      <div className={windowWidth > 900 ? 'col-8 offset-3' : 'col-12'}>
        <div className='row'>
          <div className='col-4 justify-content-center align-items-center text-center mt-3'>
            <img
              alt='Profile'
              className='img-fluid col-12' 
              style={windowWidth > 600 ? { width: "150px", height: "150px", borderRadius: "150px" } : { width: "80px", height: "80px", borderRadius: "80px" }} 
              src={profile_image} 
            />
          </div>
          <div className='col-4 d-flex align-items-center mt-3 h3 text-break'>
            <span>{username}</span>
          </div>
          <div className='col-4 d-flex align-items-center text-center mt-3'>
            <md-filled-button onClick={() => {document.getElementById("editProfile").show()}}>
              Edit Profile
            </md-filled-button>
          </div>
        </div>
        <div className='text-center my-2'>
          <span>{profile_description}</span>
        </div>
        <md-divider></md-divider>
        <div className='row'>
          {posts.length === 0 ? 
          ( 
            <>
              <span className='text-center my-5 py-5'>
                No posts
              </span>
              <a href="javascript:void(0);" 
                className='text-decoration-none text-center'
                onClick={() => {document.getElementById("newPost").show()}}
              >
                Make a new post
              </a>
            </>
          ) : 
          (
            posts.map((post, index) => (
              
              <div className={windowWidth > 900 ? 'col-10 mx-auto my-3 py-3 rounded-4 border' : 'col-12 py-3 border-bottom'} key={post.id}>
                <div className='float-end'>
                  <div style={{position: "relative"}}>
                    <md-standard-icon-button id={post.date} onClick={() => {document.getElementById(post.id).anchor = document.getElementById(post.date); toggleMenu(index)}}>
                      <md-icon>more_vert</md-icon>
                    </md-standard-icon-button>

                    <md-menu id={post.id} open={postMenuVisibility[index]} menu-corner="START_END">
                      <md-menu-item
                        headline={"Edit caption"}>
                      </md-menu-item>
                      <md-menu-item
                        headline={"Hide comments"}>
                      </md-menu-item>
                      <md-menu-item
                        headline={"Hide like count"}>
                      </md-menu-item>
                      <md-menu-item
                        onMouseUp={() => {handleDeletePost(post.id)}}
                        headline={"Delete post"}>
                      </md-menu-item>
                    </md-menu>
                  </div>
                </div>

                {/* Contains the post details like username, date, profile image so they are on the same container */}
                <div className='row'>

                  {/* Profile image div for each post*/}
                  <div className='col-2 text-end'>
                    <img
                      className='rounded-5'
                      style={{ width: '60px', height: '60px' }}
                      src={profile_image}
                      alt='Profile'
                    />
                  </div>

                  {/* Holds both username and date div so that they are on one row */}
                  <div className="row col-8 mx-1 d-flex align-items-center">
                    {/* Username div, data is being retrieved from function getProfile above */}
                    <div className='container h5'>
                      <span>{username}</span>
                    </div>

                    {/* Date div, first its being transformed into human readable time as this is in milliseconds */}
                    <div className='container h6 fw-normal'>
                      <span>{transformTime(post.date)}</span>
                    </div>
                  </div>

                  {/* Post caption div, a check is made if there is a caption provided in the post, if not, nothing is rendered */}
                  <div className='col-10 offset-1 mx-auto my-2 h6 fw-normal'>
                    <span>{post.caption ? (post.caption) : (null)}</span>
                  </div>
                </div>

                {/* Post image div, it checks if the post has an image, if not, nothing is rendered */}
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

              {/* End of div which holds each post seperately, begins new loop (new post) if there is on */}
              </div>
              
            ))
          )}
        </div>
      </div>
      
      {/* Make new post FAB button */}
      <div
        className={posts.length === 0 ? 'd-none' : windowWidth > 900 ? 'col-md-2 offset-md-9 col-lg-2 offset-lg-10' : 'float-end'}
        style={windowWidth > 900 ? { bottom: "10px", left: "20px", position: "sticky" } : { bottom: "100px", right: "20px", position: "sticky" }}
      >
        <md-branded-fab
          size="small"
          aria-label="New post"
          label="New post"
          onClick={() => {document.getElementById("newPost").show()}}
        >
          <md-icon slot="icon">add</md-icon>
        </md-branded-fab>
      </div>


      {/* New post dialog which opens from the above FAB button */}
      <md-dialog id="newPost">
        <span slot="header">Make new post</span>
        <div className='d-flex align-items-center justify-content-between'>
          <md-text-button 
            onClick={() => {document.getElementById("filePostInput").click()}}
          >
            Select image
          </md-text-button>
          <md-filled-button onClick={uploadPost} dialog-action="close">Post</md-filled-button>
        </div>

        {/* HTML input element which does not show, it is activated by the text button above when its pressed */}
        <input
          className='d-none'
          type="file"
          id="filePostInput"
          onChange={(e) => {handleFileChange(e, setPostImagePreview)}}
        />

        {/* Text field element which is being initiaded above so that the value can be accessed successfully */}
        <div className='text-center my-3'>
          {setNewPostCaption}
        </div>

        {/* A preview of the selected image (if one is selected), else nothing is rendered */}
        {postImagePreview && (
          <div className='text-center'>
            <img
              src={postImagePreview}
              style={{maxHeight: "40vh", maxWidth: "100%"}}
              className='img-fluid rounded-4 borders-color'
              alt="Preview"
            />
          </div>
        )}
      </md-dialog>

      {/* Edit profile dialog which open from the "Edit profile" filled button above */}
      <md-dialog id="editProfile">
        <span slot="header">Edit profile</span>
        <div className='d-flex align-items-center justify-content-between'>
          <md-text-button 
            onClick={() => {document.getElementById("fileEditInput").click()}}
          >
            Select image
          </md-text-button>
          <md-filled-button onClick={updateProfile} dialog-action="close">Save</md-filled-button>
        </div>

        {/* HTML input element which does not show, it is activated by the text button above when its pressed */}
        <input
          className='d-none'
          type="file"
          id="fileEditInput"
          onChange={(e) => {handleFileChange(e, setProfileImagePreview)}}
        />

        {/* Text field element which is being initiaded above so that the value can be accessed successfully */}
        <div className='text-center my-3'>
          {setEditProfileDescription}
        </div>

        {/* A preview of the selected image (if one is selected), else nothing is rendered */}
        {profileImagePreview && (
          <div className='text-center'>
            <img
              src={profileImagePreview}
              style={{maxHeight: "40vh", maxWidth: "100%"}}
              className='img-fluid rounded-4 borders-color'
              alt="Preview"
            />
          </div>
        )}
      </md-dialog>
    </>

  );
}
