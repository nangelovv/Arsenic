import React, { useContext, useReducer, useState } from 'react';
import { transformTime } from '../common/postFuncs';
import { APINoBody } from '../common/APICalls';
import noUserImage from '../common/noUser.jpg';
import { DiscoverContext, RenderProfileContext, MainFeedContext, MyProfileContext } from '../MainFeed';
import { getProfile } from '../common/profileFuncs';
import { API_URL } from '../config';


export default function RenderPosts({ posts = {}, myProfile = false}) {

  const [currentPostComments, setCurrentPostComments] = useState(null)
  
  const {
    comments, setComments,
    profileData, setProfileData,
    postMenuVisibility, setPostMenuVisibility
  } = useContext(MyProfileContext);

  const { 
    windowWidth, setWindowWidth,
    activeComponent, setActiveComponent,
    fetchingProfile, setFetchingProfile
  } = useContext(MainFeedContext);

  const { profile, setProfile } = useContext(RenderProfileContext);

  const {
    profiles, setProfiles,
    showModal, setShowModal
  } = useContext(DiscoverContext);

  const forceUpdate = useReducer(x => x + 1, 0)[1]

  const fontVariation = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";

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

  async function postComment(post_id) {
    try {
      const comment = document.getElementById('commentInput').value
      // Checks if either the username or password fields are empty
      if (!comment) {return}

      let token = localStorage.getItem('ArsenicToken');

      var bearer = 'Bearer ' + token;
    
      await fetch(API_URL + '/comments/' + post_id, {
        method: 'POST',
        body: JSON.stringify({comment: comment}),
        headers: {
          Authorization: bearer,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
    }
    catch {return}
  }

  async function getComments(post_id) {
    setCurrentPostComments(post_id)

    for (var each of comments) {
      if (each.post_id == post_id) {return} 
    }

    try {
      const response = await APINoBody('/comments/' + post_id, 'GET')
      if (response.ok) {
        const json = await response.json();
        setComments((prevList) => {return prevList.concat(Object.values(json))});
      }
    }
    catch(err) {return}
  }
  
  return (
    posts.map((post, index) => (
      <div key={post.post_id}>
            
        {/* Shows the container in different dimensions depending on how big the screen of the user is           */}
        <div className={'col-12 py-2'}>

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
                    <md-icon-button
                      id={post.date}
                      onClick={() => {
                        document.getElementById(post.post_id).anchor = document.getElementById(post.date);
                        toggleMenu(index)
                      }}
                    >
                      <span>
                        <md-icon>more_vert</md-icon>
                      </span>
                      
                    </md-icon-button>

                    {/* The open state of the menu depends on the 'postMenuVisibility' index 
                    to which this post/menu correspond */}
                    <md-menu id={post.post_id} open={postMenuVisibility[index]} menu-corner='START_END'>
                      <md-menu-item
                        onMouseUp={() => {
                          try {
                            post.hide_comments = post.hide_comments ? null : true
                            forceUpdate()
                            APINoBody('/comments/' + post.post_id, 'PUT')
                          }
                          catch(err) {return}
                        }}
                        headline={post.hide_comments ? 'Enable commenting' :'Disable commenting'}>
                      </md-menu-item>
                      <md-menu-item
                        onMouseUp={() => {
                          try {
                            APINoBody('/likes/' + post.post_id, 'PUT')
                          }
                          catch(err) {return}
                        }}
                        headline={post.hide_likes ? 'Show like count' : 'Hide like count'}>
                      </md-menu-item>
                      <md-menu-item disabled
                        headline={'Edit caption'}>
                      </md-menu-item>
                      <md-menu-item
                        onMouseUp={() => {
                          try {
                            APINoBody('/posts/' + post.post_id, 'DELETE')
                            .then(response => {
                              if (response.ok) {window.location.reload(false);}}
                            )
                          }
                          catch(err) {return}
                        }}
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
              <div className='col-2 d-flex align-items-center justify-content-evenly'>
                <img
                  className='rounded-5 clickable'
                  style={{ width: '60px', height: '60px' }}
                  src={post.profile_picture ? post.profile_picture : noUserImage}
                  alt='Profile'
                  onClick={() => {getProfile({
                    user_id: post.user_id,
                    setFetchingProfile: setFetchingProfile,
                    setProfile: setProfile,
                    setShowModal: setShowModal,
                    showModal: showModal,
                    setProfileData: setProfileData}
                  )}}
                />
              </div>

              {/* Holds both username and date div so that they are on one row */}
              <div className='row col-8 ms-1 d-flex align-items-center'>

                {/* The container holds the username*/}
                <div
                onClick={() => {getProfile({
                  user_id: post.user_id,
                  setFetchingProfile: setFetchingProfile,
                  setProfile: setProfile,
                  setShowModal: setShowModal,
                  showModal: showModal,
                  setProfileData: setProfileData}
                )}}>
                  <span className='fs-5 clickable'>{post.username}</span>
                </div>

                {/* First the 'transformTime' function is being called so that the time is transformed 
                into human readable time as the provided one from the call is in milliseconds */}
                <div className='container h6 fw-normal'>
                  <span>{transformTime(post.date)}</span>
                </div>
              </div>

              {/* Checks is the post has a caption to render, if not, nothing is rendered */}
              <div className='col-10 offset-1 mx-auto my-2 h6 fw-normal'>
                <span>{post.text && (post.text)}</span>
              </div>
            </div>

            {/* Checks if the post has an image to render, if not, nothing is rendered*/}
            <div className='col-10 mx-auto'>
              {post.image_one ? 
              (
                <img
                  alt='Post profile'
                  className='img-fluid col-12 rounded-3'
                  src={post.image_one}
                />
              ) : 
              (
                null
              )}
            </div>
            <span className='col-sm-2 d-flex align-items-end justify-content-evenly mt-2'>
              <md-icon-button
                onClick={() => {
                  const verb = post.liked ? 'DELETE' : 'POST'
                  post.likes = post.liked ? post.likes - 1 : post.likes + 1;
                  post.liked = post.liked ? null : 1;
                  forceUpdate()
                  try {
                    APINoBody('/likes/' + post.post_id, verb)
                  }
                  catch(err) {return}
                }}
              >
                <span className="material-symbols-outlined" style={ post.liked ? { fontVariationSettings: fontVariation } : null }>
                  favorite
                </span>
              </md-icon-button>
              <span className='h5 clickable'>{(!post.hide_likes || myProfile) && post.likes}</span>
              <md-icon-button
                disabled={post.hide_comments ? true : null}
                onClick={() => {getComments(post.post_id); document.getElementById('commentsDialog').show()}}
              >
                <span className="material-symbols-outlined">
                  {post.hide_comments ? 'comments_disabled' : 'comment'}
                </span>
              </md-icon-button>
              <span className='h5 clickable'>{(!post.hide_comments || myProfile) && post.comments}</span>
            </span>
          </div>
        {/* End of div which holds each post seperately, starts new iteration (new post) if there is one */}
        </div>
        <md-divider></md-divider>

        <md-dialog id={'commentsDialog'} style={{height: '100%', width: '100%'}}>

          <div className='d-flex justify-content-center' slot='headline'>
            <span>Comments section</span>
          </div>

          <form method='dialog' slot='content'>
            {comments.length != 0
            ?
              comments.map((comment) => ( comment.post_id == currentPostComments &&
                <div className={'row my-4'} key={comment.comment_id}>

                  <div className='col-2 d-flex align-items-center justify-content-evenly'>
                    <img
                      className='rounded-5 clickable'
                      style={{ width: '40px', height: '40px' }}
                      src={comment.profile_picture ? comment.profile_picture : noUserImage}
                      alt='Profile'
                      onClick={() => {getProfile({
                        user_id: comment.user_id,
                        setFetchingProfile: setFetchingProfile,
                        setProfile: setProfile,
                        setShowModal: setShowModal,
                        showModal: showModal,
                        setProfileData: setProfileData}
                      )}}
                    />
                  </div>

                  <div className='row col-10'>
                  
                    <div className='row d-inline'>

                      <span
                        className='clickable fs-6 fw-bold'
                        onClick={() => {getProfile({
                          user_id: comment.user_id,
                          setFetchingProfile: setFetchingProfile,
                          setProfile: setProfile,
                          setShowModal: setShowModal,
                          showModal: showModal,
                          setProfileData: setProfileData}
                        )}}
                      >
                        {comment.username}
                      </span>
                    
                      <span className='fs-6 text-start'>
                        {transformTime(comment.date)}
                      </span>
                    
                    </div>

                    <div className='row mt-1'>
                      
                      <span className='followTextSize fw-normal'>{comment.comment}</span>

                    </div>

                  </div>
                  
                  
                </div>
              ))
            :
              <span className='d-flex justify-content-center'>This post has no comments yet</span>
            }
          </form>
          <div className='d-flex justify-content-center' slot='actions'>
              <md-outlined-text-field label={'Type new comment'} id={'commentInput'}>
                <md-icon-button slot="trailingicon" onClick={() => {postComment(post.post_id)}}>
                  <md-icon>send</md-icon>
                </md-icon-button>
              </md-outlined-text-field>
            </div>
        </md-dialog>
      </div>
    ))
  )
}