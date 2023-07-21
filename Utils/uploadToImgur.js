const path = require("path");
var fs = require('fs');
const {LOADING_STATES} = require("./loadingStates");
const secrets = require('../secrets');
const { ImgurClient } = require('imgur');
const log = require('electron-log');
async function uploadLocalImagesToImgur(data){
  markdownStr = data.content;
  const imagePattern = /!\[.*?\]\((.*?)\)/g;
  let modifiedMarkdown = markdownStr;
  let match;
  while ((match = imagePattern.exec(markdownStr))) {
    const localImagePath = match[1];
    if(localImagePath.substring(0,5)=="https"){
      continue;
    }
    const imagePath = path.join(data.content_path, decodeURIComponent(localImagePath))
    let newLink = null;
    try{
      const imageData = await readImage(imagePath);
      const res = await uploadToImgur(imageData);
      newLink = res.data.link;
      log.debug(res)
    }
    catch (err){
      throw err
    }
    if(newLink == null){
      log.debug(res)
      throw new Error("Unable to upload images to imgur");
    }
    modifiedMarkdown = modifiedMarkdown.replace(localImagePath,newLink);
    
  }
  return modifiedMarkdown;
}
function readImage (imgPath){
  // read image file
  return new Promise((resolve,reject)=>{
    fs.readFile(imgPath, (err, data)=>{
      // error handle
      if(err) {
          reject(err);
      }
            
      // convert image file to base64-encoded string
      const base64Image = Buffer.from(data, 'binary').toString('base64');
      // console.log(base64Image);
      resolve(base64Image);
  })
  })
  
}
function uploadToImgur(fileData){
    return new Promise((resolve, reject) => {
      const CLIENT_ID = secrets.IMGUR_CLIENT_ID;
      const client = new ImgurClient({ clientId: CLIENT_ID });
      client.upload({
        image: fileData,
        type:"base64"
      }).then((res)=>{
        resolve(res);
      }).catch((err)=>{
        log.error(err)
        reject(err)
      })
    });
  };
module.exports = {uploadToImgur,uploadLocalImagesToImgur}
