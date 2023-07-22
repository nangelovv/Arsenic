import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { transformTime } from './profileFunctions';
import { APIBody } from './APICalls';


export default function Home({windowWidth}) {

  // Holds whether the first API request has been send, important to know so the value of noPosts can be changed to 2000
  const [firstRequest, setFirstRequest] = useState(false)

  // Gets the last active side from the localStorage and sets it as the current one, if there is nothing 
  // in Storage, its set as '0'/'Recommended'
  const [activeSide, setActiveSide] = useState(parseInt(localStorage.getItem('activeSide')) || 0)

  // Sets the noPosts variable to 2000, if there are no more posts to be displayed, variable is changed to 
  // 99999999999, thus making it impossible to send API requests
  const [noPosts, setNoPosts] = useState(2000)

  // Holds all of the information for all posts that has been thus far received
  const [posts, setPosts] = useState([]);

  // Holds the state of whether a request is currently in progress
  const [isFetching, setIsFetching] = useState(false);

  // Holds the IDs of all unique posts, so no duplicates are shown in the feed
  var uniquePosts = [];

  // Fetch initial data
  useEffect(() => {
    callFetchData();
  }, []);

  // This useEffect hook adds the scroll event listener and the scroll call restricter
  useEffect(() => {

    // Calls the 'handleScroll' function only after the appropriate time has passed
    const debouncedHandleScroll = debounce(handleScroll, noPosts); 

    // Add event listener to detect scroll position
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {

      // Clean up the event listener when component unmounts
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  // Sets the active side in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSide', parseInt(activeSide));
  }, [activeSide]);

  // Function to call fetchData after a 3-second delay
  function callFetchData() {
    if (!isFetching) {

      // 'isFetching' is set to 'true' and the function 'fetchData' is called only if 2 seconds have 
      // passed since the last request, if an error occurs during the call 'isFetching' is set to false
      setIsFetching(true);
      fetchData()
        .then(() => {
          // Wait for 2 seconds before allowing a new request
          setTimeout(() => {
            setIsFetching(false);
          }, noPosts);
        })
        .catch((err) => {
          return setIsFetching(false);
        });
    }
  };

  // This function makes the call to the API and sorts all the posts that have been received so far
  async function fetchData() {

    // Gets the IDs of all posts so far and puts them in a list
    var posts_list = []

    for (const post of posts) {
      if (!posts_list.includes(post.post_id)) {
        posts_list.push(post.post_id);
      }
    }

    // The list of unique IDs is added to the formData which is sent to the API to exclude from future requests
    const formData = new FormData();

    formData.append('posts_list', posts_list.length != 0 ? posts_list : []);

    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {
      const response = await APIBody('/posts/recommended', 'POST', formData)
  
      if (response.ok) {
        const json = await response.json();
  
        // If the server returns 0 unique posts, it sets the noPosts variable to '99999999999' 
        // thus not allowing anymore future requests to be sent until the page is reloaded
        if (Object.values(json).length == 0) {
          return setNoPosts(99999999999)
        }
  
        // The new unique posts are added to the posts variable by iterating through the response returned from the server
        uniquePosts = posts
  
        for (const post of Object.values(json)) {
          if (!uniquePosts.some((p) => p.post_id === post.post_id)) {
            uniquePosts.push(post);
          }
        }
  
        setPosts(uniquePosts)

        // Sets the interval between API request after the first call to 2 seconds
        if (!firstRequest) {setFirstRequest(true); setNoPosts(2000)}
        }

    }
    catch(err) {}
  };

  // Checks if the user has reached the bottom of the page, if so 'callFetchData' is called
  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      callFetchData();
    }
  };

  return (
    <>

      {/* Places the 2 buttons in the middle of the page, with equal spacing on both sides */}
      <div className='col-10 my-3 offset-1'>

        {/* Holds the 2 buttons, the selected one depends on which one has been last active, if neither has, its Recommended */}
        <md-outlined-segmented-button-set>
          <md-outlined-segmented-button selected={activeSide == 0 ? true : null} no-checkmark label='Following' onClick={() => {setActiveSide(0)}}></md-outlined-segmented-button>
          <md-outlined-segmented-button selected={activeSide == 1 ? true : null} no-checkmark label='Recommended' onClick={() => {setActiveSide(1)}}></md-outlined-segmented-button>
        </md-outlined-segmented-button-set>
      </div>
      <md-divider></md-divider>


      {/* Depending on which side has been chosen, render either recommended or following posts */}
      {activeSide == 0 ? 
      
        // Following side, to be changed once functionality is added
        null
      :

        // Recommended side, render the data received from the back-end for this side
        <div>

          {/* Iterate through all of the the posts that have been received and render each one in its own container */}
          {posts.map((post) => (

            // Show the container in different dimensions depending on how big the screen of the user is
            <div key={post.post_id} className={windowWidth > 900 ? 'col-10 mx-auto my-3 py-3 rounded-4 border' : 'col-12 py-3 border-bottom'}>
              
              {/* Contains the post details like username, date, profile image so they are on the same container */}
              <div className='row'>

                {/* Profile image div for each post*/}
                <div className='col-2 text-end'>
                  <img
                    className='rounded-5'
                    style={{ width: '60px', height: '60px' }}
                    src={post.profile_image}
                    alt='Profile'
                  />
                </div>

                {/* Holds both username and date div so that they are on one row */}
                <div className='row col-8 mx-1 d-flex align-items-center'>
                  {/* Username div, data is being retrieved from function getProfile above */}
                  <div className='container h5'>
                    <span>{post.username}</span>
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
          ))}

          {/* Notifies the user if there are no more posts to show in the bottom of the page */}
          {noPosts != 2000 &&
          <div className='text-center my-3 py-3'>
            <span>
              No more posts to show
            </span>
          </div>
          }
        </div>
      }
    </>
  );
};

