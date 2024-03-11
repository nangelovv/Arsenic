import { APINoBody } from './APICalls';

var followDataUserID
var likeDataPostID


export async function getProfile({
  user_id, 
  setFetchingProfile, 
  setProfile,
  profileData = null, 
  setProfileData, 
  activeComponent = null,
  setActiveComponent }) {
  
  setFetchingProfile(true)

  const currentUserID = localStorage.getItem('ArsenicUserID')

  if (user_id == currentUserID) {
    if (activeComponent != 'MyProfile' && profileData) {
      setActiveComponent('MyProfile')
      return
    }
  }

  // If an internal server error (500) occurs (the server is down), the try-catch block catches it
  try {
    
    const response = await APINoBody('/users/' + user_id, 'GET')

    if (response.ok) {

      const json = await response.json();
      const data = JSON.parse(json);

      // Sort the list based on the 'date' attribute
      data.posts.sort((a, b) => b.date - a.date);

      if (data.user_id == localStorage.getItem('ArsenicUserID')) {
        setProfileData(data);
      }
      else {
        setProfile(data);
        setActiveComponent('OtherProfile')
      }
    }
  }
  catch(err) {return}
  setFetchingProfile(false)
}


export async function followUnfollow(is_following, user_id) {
  var verb = is_following ? 'DELETE' : 'POST'
  try {
    const response = await APINoBody('/follows/' + user_id, verb)
    }
  catch(err) {return} 
}


export async function getFollows({ following, setFollowing, followers, setFollowers, profile_id }) {
  if (followDataUserID === profile_id) {
    if (following.length !== 0 || followers.length !== 0) {return}
  }
  
  setFollowers([])
  setFollowing([])

  followDataUserID = profile_id

  try {
    
    const response = await APINoBody('/follows/' + profile_id, 'GET')

    if (response.ok) {
      const profiles = await response.json()
      setFollowers(Object.values(Object.values(profiles)[0]))
      setFollowing(Object.values(Object.values(profiles)[1]))
      }
      
    }
  catch(err) {return} 
}


export async function getChats({setChatsGlimpse, chatsGlimpse}) {
  try {
    const response = await APINoBody('/chats/', 'GET')

    if (response.ok) {
      const json = await response.json();
      const mergedChatsGlimpse = { ...chatsGlimpse, ...json };

      // Update the state with the merged object
      setChatsGlimpse(mergedChatsGlimpse);

    }
  }
  catch(err) {return}
}


export async function getChat({chatID, allChatsMessages, setAllChatsMessages, messageIDs, setMessageIDs}) {

  if (chatID in allChatsMessages) {return}

  // If an internal server error (500) occurs (the server is down), the try-catch block catches it
  try {
    
    const response = await APINoBody('/messages/' + chatID, 'GET')

    if (response.ok) {

      const json = await response.json();
      const messages = Object.values(json)

      const updatedState = { ...allChatsMessages };

      updatedState[chatID] = messages;

      setAllChatsMessages(updatedState)

      let newMessagesIDs = []

      for (const each of messages) {
        if (each.message_id in messageIDs) {
          newMessagesIDs.push(each.message_id)
        }
        
      setMessageIDs((prev) => [...prev, newMessagesIDs])
      }

    }
  }
  catch(err) {return}
}


export async function getChatSuggestions({chatSuggestion, setChatSuggestion}) {
  
  if (chatSuggestion.length != 0) {return}
  try {
    const response = await APINoBody('/chats/suggestions', 'GET')

    if (response.ok) {
      const json = await response.json();

      for (const chat of Object.values(json)) {
        setChatSuggestion((prevList) => [...prevList, chat]);
      }
    }
  }
  catch(err) {return}
}


export async function getLikes({ likes, setLikes, post_id }) {
  if (likeDataPostID === post_id) {
    if (likes.length !== 0 || likes.length !== 0) {return}
  }
  
  setLikes([])

  likeDataPostID = post_id

  try {
    
    const response = await APINoBody('/likes/' + post_id, 'GET')

    if (response.ok) {
      const profiles = await response.json()
      setLikes(Object.values(Object.values(profiles)))
      }
      
    }
  catch(err) {return} 
}