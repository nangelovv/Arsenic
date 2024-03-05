import { API_URL } from '../config';
import { APINoBody } from '../common/APICalls';


export const postComment = async (post_id) => {
  try {
    const comment = document.getElementById('commentInput').value;
    if (!comment) return;

    const token = localStorage.getItem('ArsenicToken');
    const bearer = 'Bearer ' + token;

    await fetch(API_URL + '/comments/' + post_id, {
      method: 'POST',
      body: JSON.stringify({ comment: comment }),
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return;
  }
};

export const getComments = async (post_id, comments, setComments) => {

  if (comments.some((each) => each.post_id === post_id)) return;

  try {
    const response = await APINoBody('/comments/' + post_id, 'GET');
    if (response.ok) {
      const json = await response.json();
      setComments((prevList) => prevList.concat(Object.values(json)));
    }
  } catch (err) {
    return;
  }
};