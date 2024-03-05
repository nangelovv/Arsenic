import React, { useEffect, useState, useContext } from 'react';
import { debounce } from 'lodash';
import { StateContext } from '../../mainNav';
import RenderPosts from '../../posts/posts';
import { fetchData } from './homeFuncs'


export default function Recommended() {
  const { 
    recommendedPosts, setRecommendedPosts,
    recommendedNoPosts, setRecommendedNoPosts
  } = useContext(StateContext)

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
      const endpoint = '/posts/recommended/'
      fetchData({
        posts: recommendedPosts,
        postsSetter: setRecommendedPosts,
        timer: recommendedNoPosts,
        timerSetter: setRecommendedNoPosts,
        endpoint: endpoint,
        uniques: uniquePosts
      })
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

  // Checks if the user has reached the bottom of the page, if so 'callFetchData' is called
  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight * 0.7) {
      callFetchData();
    }
  };

  return (
    // Recommended side, render the data received from the back-end for this side
    <>
      {/* Iterate through all of the the posts that have been received and render each one in its own container */}
      {<RenderPosts posts={recommendedPosts}/>}

      {/* Notifies the user if there are no more posts to show in the bottom of the page */}
      {recommendedNoPosts == 99999 &&
        <div className='text-center my-3 py-3'>
          <span>
            No more posts to show
          </span>
        </div>
      }
    </>
  );
};

