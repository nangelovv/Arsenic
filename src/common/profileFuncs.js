import { APINoBody } from "./APICalls";


// This function is called from the useEffect hook when profile is first initiated 
// if profile is already present, the function returns null
export async function getProfile({
  user_id, 
  setFetchingProfile, 
  setProfile, 
  setShowModal, 
  showModal, 
  profileData = null, 
  setProfileData, 
  activeComponent = null,
  useEffectCall = null }) {

  if (profileData && activeComponent == 'MyProfile') {
    return
  }
  
  setFetchingProfile(true)

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
      setProfile(data);
      setFetchingProfile(false)

      if (!useEffectCall) {
        setShowModal(!showModal)
      }
      
    }
  }
  catch(err) {return}
}


export async function followUnfollow({ profile, setProfile }) {

  var verb = profile.follows ? 'DELETE' : 'POST'

  try {
    
    const response = await APINoBody('/follow/' + profile.user_id, verb)

    if (response.ok) {
      profile.follows = !profile.follows
      setProfile(profile)
      }
      
    }
  catch(err) {return} 
}