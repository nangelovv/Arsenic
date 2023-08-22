import React, { useEffect, useState, useContext } from 'react';
import { APIBody } from '../common/APICalls';
import { debounce } from 'lodash';
import { HomeContext } from '../MainFeed';
import RenderPosts from '../renderComponentParts/RenderPosts';


export default function Recommended() {

  const {
    recommendedPosts, setRecommendedPosts,
    recommendedNoPosts, setRecommendedNoPosts
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
    const debouncedHandleScroll = debounce(handleScroll, recommendedNoPosts); 

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
          }, recommendedNoPosts);
        })
        .catch((err) => {
          return setIsFetching(false);
        });
    }
  };

  // This function makes the call to the API and sorts all the posts that have been received so far
  async function fetchData() {

    if (recommendedNoPosts > 5000) {return}
    // Gets the IDs of all posts so far and puts them in a list
    var posts_list = []

    for (const post of recommendedPosts) {
      if (!posts_list.includes(post.post_id)) {
        posts_list.push(post.post_id);
      }
    }

    // The list of unique IDs is added to the formData which is sent to the API to exclude from future requests
    const formData = new FormData();

    for (const postId of posts_list) {
      formData.append('posts_list', postId);
    }

    // If an internal server error (500) occur (the server is down), the try-catch block catches it
    try {
      const response = await APIBody('/posts/recommended', 'POST', formData)
  
      if (response.ok) {
        const json = await response.json();
  
        // If the server returns 0 unique posts, it sets the noPosts variable to '99999999999' 
        // thus not allowing anymore future requests to be sent until the page is reloaded
        if (Object.values(json).length == 0) {
          return recommendedNoPosts(99999999999)
        }
  
        // The new unique posts are added to the posts variable by iterating through the response returned from the server
        uniquePosts = recommendedPosts
  
        for (const post of Object.values(json)) {
          if (!uniquePosts.some((p) => p.post_id === post.post_id)) {
            // Check if the `profile_image` property is missing or null/undefined
            uniquePosts.push(post);
          }
        }

        setRecommendedPosts(uniquePosts)
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
      {<RenderPosts posts={recommendedPosts}/>}

      {/* Notifies the user if there are no more posts to show in the bottom of the page */}
      {recommendedNoPosts == 99999999999 &&
        <div className='text-center my-3 py-3'>
          <span>
            No more posts to show
          </span>
        </div>
      }
    </div>
  );
};

