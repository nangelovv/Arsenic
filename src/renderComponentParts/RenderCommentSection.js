import React from 'react';

export default function CommentSection({ comments, currentPostComments, getProfile, setFetchingProfile, setProfile, setShowProfileModal, showProfileModal, setProfileData, transformTime, noUserImage }) {
  if (comments.length === 0) {
    return <span className='d-flex justify-content-center'>This post has no comments yet</span>;
  }

  return comments
    .filter((comment) => comment.post_id === currentPostComments)
    .map((comment) => (
      <div className='row my-4' key={comment.comment_id}>
        <div className='col-2 d-flex align-items-center justify-content-evenly'>
          <img
            className='rounded-5 clickable'
            style={{ width: '40px', height: '40px' }}
            src={comment.profile_picture || noUserImage}
            alt='Profile'
            onClick={() =>
              getProfile({
                user_id: comment.user_id,
                setFetchingProfile,
                setProfile,
                setShowProfileModal,
                showProfileModal,
                setProfileData,
              })
            }
          />
        </div>
        <div className='row col-10'>
          <div className='row d-inline'>
            <span className='clickable fs-6 fw-bold' onClick={() => getProfile({
              user_id: comment.user_id,
              setFetchingProfile,
              setProfile,
              setShowProfileModal,
              showProfileModal,
              setProfileData,
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
