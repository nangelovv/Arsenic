import { handleFileChange } from './MyProfileFunctions'

// This function is called from the myProfile components and are used when the Edit Profile 
// button or New Post buttons are pressed
export function displayProfileDialogs(
    id,
    header,
    inputID,
    actionButton,
    buttonFunc,
    imageSetter,
    captionDescription,
    inputPreview)
  {
    return (
      <md-dialog id={id}>
        <span slot='header'>{header}</span>

        {/* Holds the below 2 button at both end of the dialog and on one row */}
        <div className='d-flex align-items-center justify-content-between'>

          {/* When pressed, it activates the 'fileEditInput' or 'filePostInput' input element 
          to choose image for the new post */}
          <md-text-button 
            onClick={() => {document.getElementById(inputID).click()}}
          >
            Select image
          </md-text-button>

          {/* When pressed, first the 'updateProfile' or 'uploadPost' function is called and closes the dialog */}
          <md-filled-button onClick={buttonFunc} dialog-action='close'>{actionButton}</md-filled-button>
        </div>

        {/* HTML input element which is not rendered, it is activated by the text button above when its pressed,
        once an image is selected, the 'handleFileChange' function is called, which sends the event when it was */}
        <input
          className='d-none'
          type='file'
          accept='.jpg, .jpeg, .png'
          id={inputID}
          onChange={(e) => {handleFileChange(e, imageSetter)}}
        />

        {/* Text field element which is being initiated in the 'setEditProfileDescription' or 
        'setNewPostCaption' variable so that the value can be accessed successfully */}
        <div className='text-center my-3'>
          {captionDescription}
        </div>

        {/* Previews the selected image (if one is selected), the height will always be no more 
        than 40% of the viewport height while maintaining the original width */}
        {inputPreview && (
          <div className='text-center'>
            <img
              src={inputPreview}
              style={{maxHeight: '40vh', maxWidth: '100%'}}
              className='img-fluid rounded-4 borders-color'
              alt='Preview'
            />
          </div>
        )}
      </md-dialog>
    )
  }