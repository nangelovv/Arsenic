import React, { useContext, useReducer, useState } from 'react';
import { transformTime } from '../common/postFuncs';
import { APINoBody } from '../common/APICalls';
import noUserImage from '../common/noUser.jpg';
import { StateContext } from '../mainNav';
import { getLikes, getProfile } from '../common/profileFuncs';
import CommentSection from '../renderComponentParts/RenderCommentSection';
import { getComments, postComment } from './postFuncs';


export default function RenderPosts({ posts = {}, myProfile = false }) {
  const {
    setProfile,
    likes,
    setLikes,
    comments,
    setComments,
    setProfileData,
    postMenuVisibility,
    setPostMenuVisibility,
    showProfileModal,
    setShowProfileModal,
    setFetchingProfile,
  } = useContext(StateContext);

  const [currentPostComments, setCurrentPostComments] = useState(null);

  const fontVariation = "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24";

  const forceUpdate = useReducer((x) => x + 1, 0)[1];

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

  function updatePost({ endpoint, verb }) {
    try {
      APINoBody(endpoint, verb).then(
        (response) => {
          if (response.ok) {
            forceUpdate()
          }
        }
      );
    } catch (err) {
      return;
    }
  }

  return posts.map((post, index) => (
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
                        updatePost({ endpoint: '/comments/' + post.post_id, verb: 'PUT' });
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
                        updatePost({ endpoint: '/likes/' + post.post_id, verb: 'PUT' });
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
                        updatePost({ endpoint: '/posts/' + post.post_id, verb: 'DELETE' });
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
                className='rounded-5 clickable'
                style={{ width: '60px', height: '60px' }}
                src={post.profile_picture || noUserImage}
                alt='Profile'
                onClick={() => {
                  getProfile({
                    user_id: post.user_id,
                    setFetchingProfile: setFetchingProfile,
                    setProfile: setProfile,
                    setShowProfileModal: setShowProfileModal,
                    showProfileModal: showProfileModal,
                    setProfileData: setProfileData,
                  });
                }}
              />
            </div>
            <div className='row col-8 ms-1 d-flex align-items-center'>
              <div
                onClick={() => {
                  getProfile({
                    user_id: post.user_id,
                    setFetchingProfile: setFetchingProfile,
                    setProfile: setProfile,
                    setShowProfileModal: setShowProfileModal,
                    showProfileModal: showProfileModal,
                    setProfileData: setProfileData,
                  });
                }}
              >
                <span className='fs-5 clickable'>{post.username}</span>
              </div>
              {transformTime(post.date)}
            </div>
            <span className='col-10 offset-1 mx-auto my-2 fs-6 fw-normal'>
              {post.text && post.text}
            </span>
          </div>
          <div className='col-10 mx-auto'>
            {post.image_one ? (
              <img
                alt='Post profile'
                className='img-fluid col-12 rounded-3'
                src={post.image_one}
              />
            ) : null}
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
                getComments(post.post_id, comments, setComments, setCurrentPostComments);
                document.getElementById('commentsDialog').show();
              }}
            >
              <span className='material-symbols-outlined'>
                {post.hide_comments ? 'comments_disabled' : 'comment'}
              </span>
            </md-icon-button>
            <span
              className={post.hide_comments ? 'd-none' : 'h5 clickable'}
              onClick={() => {
                getComments(post.post_id, comments, setComments, setCurrentPostComments);
                document.getElementById('commentsDialog').show();
              }}
            >
              {post.comments}
            </span>
          </span>
        </div>
      </div>
      <md-divider></md-divider>
      <md-dialog id={'commentsDialog'} style={{ height: '100%', width: '100%' }}>
        <span className='d-flex justify-content-center' slot='headline'>
          Comments section
        </span>
        <form method='dialog' slot='content'>
          <CommentSection
            comments={comments}
            currentPostComments={currentPostComments}
            getProfile={getProfile}
            transformTime={transformTime}
            setFetchingProfile={setFetchingProfile}
            setProfile={setProfile}
            setShowProfileModal={setShowProfileModal}
            showProfileModal={showProfileModal}
            setProfileData={setProfileData}
          />
        </form>
        <div className='d-flex justify-content-center' slot='actions'>
          <md-outlined-text-field label={'Type new comment'} id={'commentInput'}>
            <md-icon-button
              slot='trailing-icon'
              onClick={() => {
                postComment(post.post_id);
              }}
            >
              <md-icon>send</md-icon>
            </md-icon-button>
          </md-outlined-text-field>
        </div>
      </md-dialog>
    </React.Fragment>
  ));
}
