import { API_URL } from '../config';

// This function can be called from both MyProfile and Home components when there are posts to render
//  and their date needs to be transformed into human readable time
export function transformTime(milliseconds) {

  // The parseInt function parses the milliseconds argument as an integer in base 10 and creates the date
  const date = new Date(parseInt(milliseconds, 10));

  // The below variables are used to hold the specific day, month or year of the date and then return it as a readable date
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // January is month 0
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}


// This function takes as parameters an event from an input element and function which saves the state 
// of the image after it has been converted to a URL which can be displayed
export function handleFileChange(event, imagePreviewFunction) {

  // Get file from the element that called the function
  const file = event.target.files[0];

   // Create object URL
  const imageUrl = URL.createObjectURL(file);

  // Set image preview
  imagePreviewFunction(imageUrl); 
}


// Location and functionality of this function may change and with that the comments going with it
export async function handleDeletePost(postId) {

  let token = localStorage.getItem('ArsenicToken');

  var bearer = 'Bearer ' + token;

  const response = await fetch(API_URL + '/posts/' + postId, {
    method: 'DELETE',
    headers: {
      Authorization: bearer,
      Accept: 'application/json'
    },
  });

  if (response.ok) {
    window.location.reload(false);
    return alert('Post deleted successfully.');
  }
  else {
    return alert('Failed to delete post.');
  }
};