import React, { useEffect, useState } from 'react';
import noUserImage from './noUser.jpg';
import EditProfile from './EditProfile';
import { API_URL } from '../config';


export default function MyProfile({ profileData, setProfileData }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [postMenuVisibility, setPostMenuVisibility] = useState([]);

  const toggleMenu = (index) => {
    setPostMenuVisibility((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  };

  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
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
    const reversed_data = data.posts.reverse()
    data.posts = reversed_data

    if (!data.profile_image) {
      data.profile_image = noUserImage
    }
    setProfileData(data);
  }

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
      return alert('Post deleted successfully.');
    }
    else {
      return alert('Failed to delete post.');
    }
  };

  useEffect(() => {
    if (profileData && profileData.posts) {
      setPostMenuVisibility(Array(profileData.posts.length).fill(false));
    }
    getProfile();
  }, [profileData]);

  if (!profileData || !profileData.posts) {
    return <div className='text-center font-color my-5 py-5'>Loading...</div>;
  }

  const { username, profile_image, profile_description, posts } = profileData;

  function transformTime(milliseconds) {
    const date = new Date(parseInt(milliseconds, 10));

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // January is month 0
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <div className='col-8 offset-3 font-color'>
        <div className='row'>
          <div className='col-4 justify-content-center align-items-center text-center mt-3'>
            <img className='borders-color' style={{ width: "150px", height: "150px", borderRadius: "150px" }} src={profile_image} />
          </div>
          <div className='col-4 d-flex align-items-center mt-3 h3 text-break'>
            {username}
          </div>
          <div className='col-4 d-flex align-items-center text-center mt-3 h5'>
            <div className='tertiary-color borders-color rounded-4 p-2 overButton' onClick={handleToggleOverlay}>
              Edit Profile
            </div>
            {showOverlay && (
              <div className='overlay'>
                <EditProfile profileData={profileData} removeOverlay={handleToggleOverlay} />
              </div>
            )}
          </div>
        </div>
        <div className='text-center m-3 border-bottom'>
          <p>{profile_description}</p>
        </div>
        <div className='row'>
          {posts.length === 0 ? (
            <div className='text-center my-5 py-5'>No posts</div>
          ) : (
            posts.map((post, index) => (
              <div className='col-8 mx-auto my-3 py-3 rounded-4 secondary-color borders-color' key={post.id}>
                <div className='float-end'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical overDiv" viewBox="0 0 16 16" onClick={() => toggleMenu(index)}>
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                  {postMenuVisibility[index] && (
                    <div className='dropdown-menu tertiary-color borders-color rounded-4' style={{ display: 'block' }}>
                      <ul className="nav flex-column">
                        <div className="row justify-content-start align-items-center">
                          <div
                            className='overButton rounded-4 py-1 text-center fw-bold'
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete posts
                          </div>
                        </div>
                        <hr className='hrLines-color m-1'></hr>
                        <div className='overButton rounded-4 py-1 text-center font-color'>
                          Edit caption
                        </div>
                        <hr className='hrLines-color m-1'></hr>
                        <div className='overButton rounded-4 py-1 text-center font-color'>
                          Hide comments
                        </div>
                        <hr className='hrLines-color m-1'></hr>
                        <div className='overButton rounded-4 py-1 text-center font-color'>
                          Hide like count
                        </div>
                      </ul>
                    </div>
                  )}
                </div>
                <div className='row'>
                  <div className='col-2 text-end'>
                    <img
                      className='rounded-5 borders-color'
                      style={{ width: '60px', height: '60px' }}
                      src={profile_image}
                    />
                  </div>
                  <div className="row col-8 d-flex align-items-center">
                    <div className='row h5'>
                      {username}
                    </div>
                    <div className='row h6 fw-normal'>
                      {transformTime(post.date)}
                    </div>
                  </div>
                  <div className='col-10 offset-1 mx-auto my-2 h6 fw-normal'>
                    {post.caption ? (post.caption) : (null)}
                  </div>
                </div>
                <div className='col-10 mx-auto'>
                {post.image_one ? (
                  <img
                    className='img-fluid col-12 rounded-3 borders-color'
                    src={post.image_one}
                  />
                ) : (
                  null
                )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
