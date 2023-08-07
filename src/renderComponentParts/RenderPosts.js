import React, { useContext } from 'react';
import { transformTime } from '../common/postFuncs';
import { handleDeletePost } from '../MyProfile/MyProfileFunctions';
import noUserImage from '../common/noUser.jpg';
import { MyProfileContext } from '../MainFeed';


export default function RenderPosts({ posts = {}, myProfile = false}) {
  
  const {
    profileData, setProfileData,
    postMenuVisibility, setPostMenuVisibility
  } = useContext(MyProfileContext);

  function toggleMenu(index) {
  
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

  return (
    posts.map((post, index) => (
    <div key={post.id}>
          
      {/* Shows the container in different dimensions depending on how big the screen of the user is           */}
      <div className={'col-12 py-3'}>

        <div className={'col-10 offset-1'}>
    
          {/* Use float-end bootstrap 5 so that the 3 dot menu floats at the top right corner of the container */}
          <div className='float-end'>

            {/* Use position relative css style so when the menu is opened, 
            it stays on the appropriate position next the to the anchor button */}
            <div style={{position: 'relative'}}>

              {(myProfile) &&
                <>
                  {/* The button to which the below 3 dot menu is anchored, when pressed, 
                  makes it the active anchor for the menu, and calls function 'ToggleMenu'
                  with the 'index' parameter, where it updates the open state of the menu 
                  the ID of the button and menu below are important as this is how they get anchored
                  and thus the state of the menu gets updated*/}
                  <md-standard-icon-button
                    id={post.date}
                    onClick={() => {
                      document.getElementById(post.id).anchor = document.getElementById(post.date);
                      toggleMenu(index)}
                    }>
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
                </>
              }
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
                src={post.profile_image ? post.profile_image : noUserImage}
                alt='Profile'
              />
            </div>

            {/* Holds both username and date div so that they are on one row */}
            <div className='row col-8 mx-1 d-flex align-items-center'>

              {/* The container holds the username*/}
              <div className='container h5'>
                <span>{post.username}</span>
              </div>

              {/* First the 'transformTime' function is being called so that the time is transformed 
              into human readable time as the provided one from the call is in milliseconds */}
              <div className='container h6 fw-normal'>
                <span>{transformTime(post.date)}</span>
              </div>
            </div>

            {/* Checks is the post has a caption to render, if not, nothing is rendered */}
            <div className='col-10 offset-1 mx-auto my-2 h6 fw-normal'>
              <span>{post.caption && (post.caption)}</span>
            </div>
          </div>

          {/* Checks if the post has an image to render, if not, nothing is rendered*/}
          <div className='col-10 mx-auto'>
            {post.image ? 
            (
              <img
                alt='Post profile'
                className='img-fluid col-12 rounded-3 border'
                src={post.image}
              />
            ) : 
            (
              null
            )}
          </div>
        </div>
      {/* End of div which holds each post seperately, starts new iteration (new post) if there is one */}
      </div>
      <md-divider></md-divider>
    </div>
    ))
  )
}