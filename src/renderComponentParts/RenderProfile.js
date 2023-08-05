import React, { useContext } from 'react';
import { MainFeedContext } from '../MainFeed';
import RenderPosts from './RenderPosts';


export default function RenderProfile({ renderProfile }) {
  const { windowWidth, setWindowWidth } = useContext(MainFeedContext)

  const myProfile = renderProfile.user_id == localStorage.getItem('ArsenicUserID');

  return (
    // Shows the container in different dimensions depending on how big the screen of the user is
    <div>

      {/* Holds the profile picture and username so that they are displayed on the same row */}
      <div className='row'>
        <div className='col-4 justify-content-center align-items-center text-center mt-3'>

          {/* The profile image is shown in different dimensions depending on the size of the device its being viewed on */}
          <img
            alt='Profile'
            className='img-fluid col-12' 
            style={windowWidth > 600 ? { width: '150px', height: '150px', borderRadius: '150px' } : { width: '80px', height: '80px', borderRadius: '80px' }} 
            src={renderProfile.profile_image} 
          />
        </div>

        {/* The containers holds the username, if the username is too long, breaks the text on the next line */}
        <div className='col-4 d-flex align-items-center mt-3 h3 text-break'>
          <span>{renderProfile.username}</span>
        </div>

        {/* When pressed, the 'editProfile' dialog is opened */}
        <div className='col-4 d-flex align-items-center text-center mt-3'>
          {(myProfile) ?
            <md-filled-button onClick={() => {document.getElementById('editProfile').show()}}>
            Edit Profile
            </md-filled-button>
          :
            <md-filled-button onClick={() => {document.getElementById('editProfile').show()}}>
                {true ? "Follow" : "Unfollow"}
            </md-filled-button>
          }
        </div>
      </div>

      {/* The container holds the profile description which it display on a seperate row from the
      username and profile picture */}
      <div className='text-center my-2'>
        <span>{renderProfile.profile_description}</span>
      </div>
      <md-divider inset></md-divider>

      {/* The container holds all posts, if there are none, shows a texting stating so */}
      <div className='row'>
        {renderProfile.posts.length == 0 ? 
        ( 
          <>
            <span className='text-center my-5 py-5'>
              No posts
            </span>

            {/* When pressed, the newPost dialog is opened */}
            {(myProfile) ? 
              <a href='javascript:void(0);' 
                className='text-decoration-none text-center'
                onClick={() => {document.getElementById('newPost').show()}}
              >
                Make a new post
              </a>
            :
              null
            }
          </>
        )

        :

        (

        // Iterate through all of the the profile posts (if there are any) that have been received 
        // and render each one in its own container
          <RenderPosts posts={renderProfile.posts} myProfile={myProfile}/>
        )}
      </div>
    </div>

  );
}
