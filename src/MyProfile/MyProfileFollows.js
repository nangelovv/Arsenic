import RenderGlimpse from '../renderComponentParts/RenderGlimpse'


// This function is called from the myProfile components and are used when the Edit Profile 
// button or New Post buttons are pressed
export function displayProfilesDialog(
  id,
  header,
  profiles,
  noFollows,
  alternativeNoFollows,
  myProfile = false)
{
    return (
      <md-dialog id={id} style={{height: '100%', width: '100%'}}>
        <span className='d-flex justify-content-center' slot='headline'>{header}</span>
        <form slot='content' method='dialog'>
            {profiles.length != 0
            ?
              <RenderGlimpse profiles={profiles}/>
            :
              <span className='d-flex justify-content-center'>{myProfile ? noFollows : alternativeNoFollows}</span>
            }
          </form>
      </md-dialog>
      
    )
  }