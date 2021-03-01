const { GoogleCloudStorage } = require('@google-cloud/storage');

const GOOGLE_CLOUD_PROJECT_ID = 'social-songs'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = '../utils/social-songs-7cf5fe9cbe9f'; // Replace with the path to the downloaded private key

export const storage = GoogleCloudStorage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });
 
  /**
   * Get public URL of a file. The file must have public access
   * @param {string} bucketName
   * @param {string} fileName
   * @return {string}
   */

  exports.getPublicUrl = (bucketName: any, fileName: any) => `https://storage.googleapis.com/${bucketName}/${fileName}`;
