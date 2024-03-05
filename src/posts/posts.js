import React, { useContext, useReducer, useState } from 'react';
import noUserImage from '../common/noUser.jpg';
import { APINoBody } from '../common/APICalls';
import { transformTime } from '../common/commonFuncs';
import { getComments, postComment } from './postsFuncs';
import { getLikes, getProfile } from '../common/profileFuncs';
import { StateContext } from '../mainNav';
import CommentsDialog from './comments/commentsDialog';
const { v4: uuidv4 } = require('uuid');


export default function RenderPosts({ posts = {}, myProfile = false }) {
  const {
    setProfile,
    likes, setLikes,
    comments, setComments,
    profileData, setProfileData,
    postMenuVisibility, setPostMenuVisibility,
    setFetchingProfile,
    activeComponent, setActiveComponent
  } = useContext(StateContext);
  
  const [currentPostID, setCurrentPostID] = useState(null);


  const fontVariation = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";

  const forceUpdate = useReducer((x) => x + 1, 0)[1];

  function toggleMenu(index) {
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

  function handleProfileClick(user_id) {
    getProfile({
      user_id: user_id,
      setFetchingProfile: setFetchingProfile,
      setProfile: setProfile,
      profileData: profileData,
      setProfileData: setProfileData,
      setActiveComponent: setActiveComponent,
      activeComponent: activeComponent
    });
  };

  function addNewComment(event) {
    const newComment = {
      post_id: currentPostID,
      comment: document.getElementById('commentInput').value,
      date: Date.now(),
      comment_id: uuidv4(),
      profile_picture: profileData.profile_picture,
      user_id: profileData.user_id,
      username: profileData.username
    }

    setComments((prevState) => {
      const updatedState = [...prevState];
      updatedState.push(newComment)
      return updatedState
    })
  }

  function submitComment(e) {
    const newComment = document.getElementById('commentInput')
    if (!newComment.value) return
    addNewComment();
    postComment(currentPostID);
    newComment.value = ''
  }

  return <>
  {posts.map((post, index) => (
    <React.Fragment key={post.post_id}>
      <div className='col-12 py-2'>
        <div className='col-10 offset-1'>
          <div className='float-end'>
            <div style={{ position: 'relative' }}>
              {myProfile && (
                <>
                  <md-icon-button
                    id={'B' + post.date}
                    onClick={() => toggleMenu(index)}
                  >
                    <span>
                      <md-icon>more_vert</md-icon>
                    </span>
                  </md-icon-button>
                  <md-menu
                    anchor={'B' + post.date}
                    id={'A' + post.date}
                    open={postMenuVisibility[index]}
                  >
                    <md-menu-item
                      onClick={() => {
                        post.hide_comments = post.hide_comments ? null : true;
                        APINoBody('/comments/' + post.post_id, 'PUT')
                      }}
                    >
                      <div slot='headline'>
                        {post.hide_comments
                          ? 'Enable commenting'
                          : 'Disable commenting'}
                      </div>
                    </md-menu-item>
                    <md-menu-item
                      onClick={() => {
                        post.hide_likes = post.hide_likes ? null : true;
                        APINoBody('/likes/' + post.post_id, 'PUT')
                      }}
                    >
                      <div slot='headline'>
                        {post.hide_likes
                          ? 'Show like count'
                          : 'Hide like count'}
                      </div>
                    </md-menu-item>
                    <md-menu-item
                      onClick={() => {
                        APINoBody('/posts/' + post.post_id, 'DELETE')
                      }}
                    >
                      <div slot='headline'>Delete post</div>
                    </md-menu-item>
                  </md-menu>
                </>
              )}
            </div>
          </div>
          <div className='row'>
            <div className='col-2 d-flex align-items-center justify-content-evenly'>
              <img
                tabIndex={0}
                className='rounded-5 clickable'
                style={{ width: '60px', height: '60px' }}
                src={post.profile_picture || noUserImage}
                alt='Profile'
                onClick={() => handleProfileClick(post.user_id)}
              />
            </div>
            <div className='row col-8 ms-1 d-flex align-items-center'>
              <div onClick={() => handleProfileClick(post.user_id)}>
                <span className='fs-5 clickable' tabIndex={0}>{post.username}</span>
              </div>
              {transformTime(post.date)}
            </div>
            <span className='col-10 offset-1 mx-auto my-2 fs-6 fw-normal'>
              {post.text && post.text}
            </span>
          </div>
          <div className='col-10 mx-auto d-flex align-items-center justify-content-center'>
            {post.image_one && (
              <img
                alt='Posted picture'
                className='img-fluid col-12 rounded-3'
                src={post.image_one}
              />
            )}
          </div>
          <span className='col-sm-3 d-flex align-items-end justify-content-evenly mt-2'>
            <md-icon-button
              onClick={() => {
                const verb = post.liked ? 'DELETE' : 'POST';
                post.likes = post.liked ? post.likes - 1 : post.likes + 1;
                post.liked = post.liked ? null : 1;
                forceUpdate();
                try {
                  APINoBody('/likes/' + post.post_id, verb);
                } catch (err) {
                  return;
                }
              }}
            >
              <span
                className='material-symbols-outlined'
                style={post.liked ? { fontVariationSettings: fontVariation } : null}
              >
                favorite
              </span>
            </md-icon-button>
            <span
              tabIndex={0}
              className={post.hide_likes ? 'd-none' : 'h5 clickable'}
              onClick={() => {
                getLikes({ likes, setLikes, post_id: post.post_id });
                document.getElementById('viewLikes').show();
              }}
            >
              {post.likes}
            </span>
            <md-icon-button
              disabled={post.hide_comments ? true : null}
              onClick={() => {
                setCurrentPostID(post.post_id)
                getComments(post.post_id, comments, setComments);
                document.getElementById('commentsDialog').show();
              }}
            >
              <span className='material-symbols-outlined'>
                {post.hide_comments ? 'comments_disabled' : 'comment'}
              </span>
            </md-icon-button>
            <span
              tabIndex={0}
              className={post.hide_comments ? 'd-none' : 'h5 clickable'}
              onClick={() => {
                setCurrentPostID(post.post_id)
                getComments(post.post_id, comments, setComments);
                document.getElementById('commentsDialog').show();
              }}
            >
              {post.comments}
            </span>
          </span>
        </div>
      </div>
      <md-divider></md-divider>
    </React.Fragment>
  ))}
  <CommentsDialog currentPostID={currentPostID} submitComment={submitComment}/>
  </>
}
