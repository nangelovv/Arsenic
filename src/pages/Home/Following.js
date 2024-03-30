import React, { useEffect, useState, useContext } from 'react';
import { debounce } from 'lodash';
import { StateContext } from '../../mainNav';
import RenderPosts from '../../posts/posts';
import { fetchData } from './homeFuncs'


export default function Following() {

  const {
    followingPosts, setFollowingPosts,
    followingNoPosts, setFollowingNoPosts
  } = useContext(StateContext)

  // Holds the state of whether a request is currently in progress
  const [isFetching, setIsFetching] = useState(false);

  // Holds the IDs of all unique posts, so no duplicates are shown in the feed
  var uniquePosts = [];

  // Fetch initial data
  useEffect(() => {
    if (followingPosts.length === 0) {
      callFetchData();
    }
  }, []);

  // This useEffect hook adds the scroll event listener and the scroll call restricter
  useEffect(() => {

    // Calls the 'handleScroll' function only after the appropriate time has passed
    const debouncedHandleScroll = debounce(handleScroll, followingNoPosts); 

    // Add event listener to detect scroll position
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  // Function to call fetchData after a delay
  function callFetchData() {
    if (!isFetching) {
      setIsFetching(true);
      const endpoint = '/posts/following/'
      fetchData({
        posts: followingPosts,
        postsSetter: setFollowingPosts,
        timer: followingNoPosts,
        timerSetter: setFollowingNoPosts,
        endpoint: endpoint,
        uniques: uniquePosts
      })
      .then(() => {
        // Wait for a few seconds before allowing a new request
        setTimeout(() => {
          setIsFetching(false);
        }, followingNoPosts);
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
    <>
      {isFetching & followingPosts.length === 0 & followingNoPosts != 99999
        ? 
          <div className='text-center my-5 py-5'>
            <md-circular-progress indeterminate four-color></md-circular-progress>
          </div>
        : 
        <>
          {<RenderPosts posts={followingPosts}/>}

          {followingNoPosts == 99999 &&
          <div className='text-center my-3 py-3'>
            <span>
              {followingPosts.length != 0 ? 'No more posts to show' : 'No posts to show'}
            </span>
          </div>}
        </>
      }
    </>
  );
};

