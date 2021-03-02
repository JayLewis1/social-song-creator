import * as AWS from 'aws-sdk';

// My accesss and secret key
const ID = process.env.S3_ACCESS_ID;
const SECRET = process.env.S3_ACCESS_SECRET;
// The name of the new bucket
const BUCKET_NAME = "ssuseruploadedaudiotest"

// Initialise S3 interface by passing our access keys
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})

export const deleteFileFromS3 = (projectId: string, fileId: string): Promise<any> => {
  
  var getParams = {
    Bucket: BUCKET_NAME,
    Key: "user-audio" + "/" + projectId + "/" + fileId
  }
  
  const getPromise = new Promise((resolve, reject) => {
    s3.deleteObject(getParams, (err: any, data: any) => {
      if(err) {
        reject(err);
      }
      resolve(data)
    })
  });
  return getPromise;
}