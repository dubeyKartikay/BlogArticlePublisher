const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { uploadLocalImagesToImgur, uploadToImgur } = require("./Utils/uploadToImgur");
const { insertData, rollback } = require("./Utils/mongoDbUtils");
const { uploadFileToGitHub } = require("./Utils/gitHubUtils");
const { throwError } = require("./Utils/ejsErrorUtils");
const {LOADING_STATES,calcProgressPercent,stateMessages} = require("./Utils/loadingStates");
const revalidateStaticWeb = require("./Utils/revalidate");
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "UI/scripts/preload.js"),
    },
  });

  win.loadFile("./UI/index.HTML");
  win.webContents.openDevTools();
};

ipcMain.on("form-submission", async (event, data) => {
  sendProgress(LOADING_STATES.PARSING_DATA);
  try{
    
    await parseAndProcess(data);
    sendProgress(LOADING_STATES.UPLOADING_THUMBNAIL_TO_IMGUR);
    
    await uploadThumbnail(data);
    sendProgress(LOADING_STATES.INSERTING_IN_MONGODB);
    
    await insertData(data);
    try{
      sendProgress(LOADING_STATES.UPLOADING_TO_GITHUB);
      await uploadFileToGitHub(data);
      
      sendProgress(LOADING_STATES.PUBLISHING);
        try{
          await revalidateStaticWeb()
          sendProgress(LOADING_STATES.DONE);
        }catch(err){
          sendProgress(LOADING_STATES.ERROR,0,err.message);
          throwError({title : "Error occured",err:err})
        }
    }catch(err){
      sendProgress(LOADING_STATES.ERROR,0,err.message);
      throwError({title : "Error occured",err:err})
      try{
        await rollback(data);
      }catch(err){
        sendProgress(LOADING_STATES.ERROR,0,err.message);
        throwError({title : "Error occured",err:err})
      }
    }
  }catch(err){
    sendProgress(LOADING_STATES.ERROR,0,err.message);
    throwError({title : "Error occured",err:err})
  }
  
 


});


app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
async function uploadThumbnail(data) {
  const thumbnailres = await uploadToImgur(data.img);
  console.log(thumbnailres);
  if (thumbnailres.success == false) {
    console.log(thumbnailres);
    throw new Error("Unable to upload thumbnail to imgur");
  } else {
    data.img = thumbnailres.data.link;
  }
}

async function parseAndProcess(data) {
  // sendProgress(LOADING_STATES.PARSING_DATA);
  // sets the date attribute and uploads the local image files referenced in the markdown to imgur
  data.content_path = extractDir(data.content_path);
  data.date = new Date();
  data._id = `${data.heading}.md`;
  try {
    sendProgress(LOADING_STATES.UPLOADING_LOCAL_TO_IMGUR);
    data.content = await uploadLocalImagesToImgur(data);
    
  } catch (err) {
    console.log(err);
    throw new Error("Unable to Upload Images in MarkDown File to Imgur");
  }
  
}

function sendProgress(STATE,progress = 0,message = null){
  if(win==null){
    throw new Error("Must have a win oject to send progress to");
  }
  let data = {
      STATE:STATE,
      progress:progress,
      message : message
  }
  if(progress==0){
      data.progress = calcProgressPercent(STATE);
  }
  if(message == null){
    data.message = stateMessages(STATE);
  }
  win.webContents.send('updateProgress',data);
}


function extractDir(filePath){
    return path.dirname(filePath);
}