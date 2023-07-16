const path = require("path");
var fs = require('fs');
const {LOADING_STATES} = require("./loadingStates");
require('dotenv').config()
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
      const body = await res.json();
      newLink = body.data.link;
    }
    catch (err){
      throw err
    }
    if(newLink == null){
      console.log(body)
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
      
      resolve(base64Image);
  })
  })
  
}
function uploadToImgur(fileData){
    return new Promise((resolve, reject) => {
      const CLIENT_ID = process.env.IMGUR_CLIENT_ID;
      fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: ` Client-ID ${CLIENT_ID}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: fileData,
        }),
      }).then((res)=>{
              if(res.status == 200){
                  resolve(res);
              }else{
                  reject(res);
              }
          }).catch((err)=>{
              reject(err);
          })
    });
  };
module.exports = {uploadToImgur,uploadLocalImagesToImgur}
