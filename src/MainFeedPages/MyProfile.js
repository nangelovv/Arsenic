import React, { useEffect, useState } from 'react';
import noUserImage from './noUser.jpg';
import EditProfile from './EditProfile';
import { API_URL } from '../config';


export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  async function getProfile() {

    if (profileData) {return}

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
    else {
      const img = `data:image/png;base64,${data.profile_image}`
      data.profile_image = img
    }
    setProfileData(data);
  }

  useEffect(() => {
    getProfile();
  }, [profileData]);

  if (!profileData || !profileData.posts) {
    return <div className='text-center my-5 py-5'>Loading...</div>;
  }

  function transformTime (milliseconds) {
    const date = new Date(parseInt(milliseconds, 10));

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // January is month 0
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  const { username, profile_image, profile_description, posts } = profileData;

  return (
    <>
      <div className='col-8 offset-3 font-light'>
        <div className='row'>
          <div className='col-4 justify-content-center align-items-center text-center mt-3'>
            <img className='borders-light' style={{width: "150px", height: "150px", borderRadius: "150px"}} src={profile_image} />
          </div>
          <div className='col-4 d-flex align-items-center mt-3 h3 text-break'>
            {username}
          </div>
          <div className='col-4 d-flex align-items-center text-center mt-3 h5'>
            <div className='tertiary-light borders-light rounded-4 p-2 overDiv' onClick={handleToggleOverlay}>
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
              <div className='col-8 mx-auto my-3 py-3 rounded-4 secondary-light borders-light' key={post.id}>
                <div className='row'>
                  <div className='col-2 text-end'>
                    <img
                      className='rounded-5 borders-light'
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
                  <div className='col-8 mx-auto my-2 h6 fw-normal'>{post.caption}</div>
                </div>
                <div key={index} className='col-10 mx-auto'>
                  {post.image_one && (
                    <img
                      className='img-fluid col-12 rounded-3 borders-light'
                      src={`data:image/png;base64,${post.image_one}`}
                    />
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
