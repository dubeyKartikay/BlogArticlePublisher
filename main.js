const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { uploadLocalImagesToImgur } = require("./Utils/uploadToImgur");
const { insertData, rollback } = require("./Utils/mongoDbUtils");
const { uploadFileToGitHub } = require("./Utils/gitHubUtils");
const { throwError } = require("./Utils/ejsErrorUtils");

const createWindow = () => {
  console.log(path.join(__dirname, "UI/scripts/preload.js"));
  const win = new BrowserWindow({
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
  try{
    await parseAndProcess(data);
    await insertData(data);
    try{
      await uploadFileToGitHub(data)
    }catch(err){
      console.log(err);
      try{
        await rollback(data);
      }catch(err){
        throwError({title : "Error occured",message : err.message})
      }
      throwError({title : "Error occured",message : err.message})
    }
  }catch(err){
    console.log(err);
    throwError({title : "Error occured",message : err.message})
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

async function parseAndProcess(data) {
  // sets the date attribute and uploads the local image files referenced in the markdown to imgur
  try {
    data.content = await uploadLocalImagesToImgur(data);
  } catch (err) {
    console.log(err);
    throw new Error("Unable to Upload Images in MarkDown File to Imgur");
  }
  data.date = new Date();
  data._id = `${data.heading}.md`;
}
