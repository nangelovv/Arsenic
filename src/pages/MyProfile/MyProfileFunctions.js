// This function takes as parameters an event from an input element and function which saves the state 
// of the image after it has been converted to a URL which can be displayed
export async function handleFileChange(event, setImagePreview) {

  // Get file from the element that called the function
  const file = event.target.files[0];

   // Create object URL
  let imageUrl = URL.createObjectURL(file);

  // Call the cropToSquare function
  if (document.getElementById('editProfile').open){
    return await cropToSquare(imageUrl, setImagePreview)
  }
  setImagePreview(imageUrl);
}


// Function to crop the image to a square and return the cropped file
export async function cropToSquare(imageUrl, setImagePreview) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Determine the size of the square (choose the smaller dimension)
      const size = Math.min(img.width, img.height);

      // Center the image in the square canvas
      const xOffset = (img.width - size) / 2;
      const yOffset = (img.height - size) / 2;

      // Set canvas size to the square
      canvas.width = size;
      canvas.height = size;

      // Draw the cropped square image on the canvas
      ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);

      // Convert the canvas image to a Blob
      canvas.toBlob((blob) => {
        // Create a new File object from the Blob
        const croppedFile = new File([blob], 'profile_image.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        setImagePreview(URL.createObjectURL(blob));

        // Resolve the Promise with the cropped file
        resolve(croppedFile);
      }, 'image/jpeg');
    };
    img.onerror = () => {
      reject(new Error('Failed to load the image.'));
    };
    img.src = imageUrl;
  });
}
