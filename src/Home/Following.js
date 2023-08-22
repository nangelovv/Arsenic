import React, { useEffect, useState, useContext } from 'react';
import { APINoBody } from '../common/APICalls';
import { debounce } from 'lodash';
import { HomeContext } from '../MainFeed';
import RenderPosts from '../renderComponentParts/RenderPosts';


export default function Following() {
  const {
    followingPage, setFollowingPage,
    followingPosts, setFollowingPosts,
    followingNoPosts, setFollowingNoPosts
  } = useContext(HomeContext)

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
    const debouncedHandleScroll = debounce(handleScroll, followingNoPosts); 

    // Add event listener to detect scroll position
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {

      // Clean up the event listener when component unmounts
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

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
          }, followingNoPosts);
        })
        .catch((err) => {
          return setIsFetching(false);
        });
    }
  };

  // This function makes the call to the API and sorts all the posts that have been received so far
  async function fetchData() {
    if (followingNoPosts > 5000) {return}
    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {
      const response = await APINoBody('/posts/following/' + followingPage, 'GET')
  
      if (response.ok) {
        const json = await response.json();

        const receivedJson = Object.entries(json)
        const receivedDictionary = Object.fromEntries(receivedJson);
        var page = parseInt(receivedDictionary.page) + 1
        setFollowingPage(page)
  
        // If the server returns 0 unique posts, it sets the noPosts variable to '99999999999' 
        // thus not allowing anymore future requests to be sent until the page is reloaded
        if (Object.keys(receivedDictionary.posts).length == 0) {
          setFollowingNoPosts(99999999999)
          return
        }
  
        // The new unique posts are added to the posts variable by iterating through the response returned from the server
        uniquePosts = followingPosts

        for (const post of Object.values(receivedDictionary.posts)) {
          if (!uniquePosts.some((p) => p.post_id === post.post_id)) {
            uniquePosts.push(post);
          }
        }

        setFollowingPosts(uniquePosts)
        }

    }
    catch(err) {}
  };

  // Checks if the user has reached the bottom of the page, if so 'callFetchData' is called
  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight * 0.7) {
      callFetchData();
    }
  };

  return (
    // Recommended side, render the data received from the back-end for this side
    <div>

      {/* Iterate through all of the the posts that have been received and render each one in its own container */}
      {<RenderPosts posts={followingPosts}/>}

      {/* Notifies the user if there are no more posts to show in the bottom of the page */}
      {followingNoPosts == 99999999999 &&
        <div className='text-center my-3 py-3'>
          <span>
            No more posts to show
          </span>
        </div>
      }
    </div>
  );
};

