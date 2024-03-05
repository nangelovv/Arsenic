import React from 'react';
import { useContext } from 'react';
import { StateContext } from '../../mainNav';
import { getProfile } from '../../common/profileFuncs';
import noUserImage from '../../common/noUser.jpg';
import { transformTime } from '../../common/commonFuncs';


export default function CommentsSection({currentPostID}) {
  const {
    setProfile,
    comments,
    profileData, setProfileData,
    setFetchingProfile,
    activeComponent, setActiveComponent
  } = useContext(StateContext);
  
  if (comments.filter((comment) => comment.post_id === currentPostID).length === 0) {
    return <span className='d-flex justify-content-center'>This post has no comments yet</span>;
  }

  return comments
    .filter((comment) => comment.post_id === currentPostID)
    .map((comment) => (
      <div className='row my-4' key={comment.comment_id}>
        <div className='col-2 d-flex align-items-center justify-content-evenly'>
          <img
            className='rounded-5 clickable'
            style={{ width: '40px', height: '40px' }}
            src={comment.profile_picture || noUserImage}
            alt='Profile'
            onClick={() => getProfile({
                user_id: comment.user_id,
                setFetchingProfile: setFetchingProfile,
                setProfile: setProfile,
                profileData: profileData,
                setProfileData: setProfileData,
                setActiveComponent: setActiveComponent,
                activeComponent: activeComponent
              })
            }
          />
        </div>
        <div className='row col-10'>
          <div className='row d-inline'>
            <span
              className='clickable fs-6 fw-bold'
              tabIndex={0}
              onClick={() => getProfile({
                user_id: comment.user_id,
                setFetchingProfile: setFetchingProfile,
                setProfile: setProfile,
                profileData: profileData,
                setProfileData: setProfileData,
                setActiveComponent: setActiveComponent,
                activeComponent: activeComponent
            })}>
              {comment.username}
            </span>
            {transformTime(comment.date)}
          </div>
          <span className='followTextSize fw-normal mt-1'>{comment.comment}</span>
        </div>
      </div>
    ));
}
