require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function upload(fileName) {
  const gameState = {
    owner: 'arthur',
    players: [
      { uuid: '12312412', username: 'nice' },
      { uuid: 'd1233312', username: 'A' },
      { uuid: '12330998', username: 'BB' },
    ],
  };
  const params = {
    Bucket: bucketName,
    Body: JSON.stringify(gameState),
    Key: 'newOne',
    ContentType: 'application/json',
  };
  const command = new PutObjectCommand(params);
  const response = await s3.send(command);

  console.log(response);
}

async function get() {
  const input = {
    Bucket: bucketName,
    Key: 'newOne',
  };
  const command = new GetObjectCommand(input);
  const s3Response = await s3.send(command);

  const response = new Response(s3Response.Body);

  const obj = await response.json();

  // const jsonObject = JSON.parse(data);
  // console.log(jsonObject);
  console.log(obj);

  // const json = JSON.parse(response.Body);
  // console.log('JSON file content:', json);
}

// console.log(upload());
get();
