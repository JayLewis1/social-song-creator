import * as fs from "fs"
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

export const uploadToS3 = async (file: any) => { 
  const { userId, projectId, trackId, fileContent: content, } = file;
  console.log(userId);
  // Read content from the file path
  const fileContent = fs.readFileSync(content.path);
  // Set up S3 upload parameters
  const params: any = {
    Bucket: BUCKET_NAME,
    Key: 'user-audio'  + '/' + projectId + '/' + trackId,
    Body: fileContent
  }
      // Uploading files to the bucket
      s3.upload(params, function(err: any, data: any) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        // Remove files from local directory once uploaded
        fs.unlinkSync(content.path)
    });
}

export const getFromS3 = (projectId: string, fileId: string): Promise<any> => {
  
  var getParams = {
    Bucket: BUCKET_NAME,
    Key: "user-audio" + "/" + projectId + "/" + fileId
  }
  
  const getPromise = new Promise((resolve, reject) => {
    s3.getObject(getParams, (err: any, data: any) => {
      if(err) {
        reject(err.code)
      }
      resolve(data)
    })
  });
  // console.log(getPromise)
  return getPromise;
}


export const removeFileFromS3 = (projectId: string, fileId: string): Promise<any> => {
  var getParams = {
    Bucket: BUCKET_NAME,
    Key: "user-audio" + "/" + projectId + "/" + fileId
  }
  
  const removePromise = new Promise((resolve, reject) => {
    s3.deleteObject(getParams, (err: any, data: any) => {
      if(err) {
        reject(err);
      }
      resolve(data)
    })
  });
  return removePromise;
}

export const removeProjectFromS3 = (projectId: string): Promise<any> => {
  var getParams = {
    Bucket: BUCKET_NAME,
    Key: "user-audio" + "/" + projectId
  }
  var params = {
    Bucket: BUCKET_NAME,
    MaxKeys: 3
  }
  s3.listObjects(params,(err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  const removePromise = new Promise((resolve, reject) => {
    s3.deleteObject(getParams, (err: any, data: any) => {
      if(err) {
        reject(err);
      }
      resolve(data)
    })
  });
  return removePromise;
}