import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<Buffer> {
  const photo: Jimp = await Jimp.read(inputURL);
  return photo
    .resize(256, 256) // resize
    .quality(60) // set JPEG quality
    .greyscale() // set greyscale
    .getBufferAsync(photo.getMIME());
}
