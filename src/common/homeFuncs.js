import { APINoBody } from './APICalls'


// This function makes the call to the API and sorts all the posts that have been received so far
export async function fetchData({posts, postsSetter, timer, timerSetter, endpoint, uniques}) {

  if (timer > 5000) {return}
  // If an internal server error (500) occur (the server is down), the try-catch block catches it
  try {
    const postsPerPage = 30 * 1.0     // This number should always match the back-end
    var page = Math.ceil((posts.length / postsPerPage)) + 1
    const response = await APINoBody(endpoint + page, 'GET')

    if (response.ok) {
      const json = await response.json();

      const receivedJson = Object.entries(json)
      const receivedDictionary = Object.fromEntries(receivedJson);

      // If the server returns 0 unique posts, it sets the noPosts variable to '99999' 
      // thus not allowing anymore future requests to be sent until the page is reloaded
      
      if (Object.values(receivedDictionary.posts).length != 0) {
        // The new unique posts are added to the posts variable by iterating through the response returned from the server
        uniques = posts

        for (const post of Object.values(receivedDictionary.posts)) {
          if (!uniques.some((p) => p.post_id === post.post_id)) {
            uniques.push(post);
          }
        }

        postsSetter(uniques)
        return
      }
      timerSetter(99999)
    }
  }
  catch(err) {}
};
