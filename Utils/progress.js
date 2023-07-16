const {ipcMain } = require("electron");
const {calcProgressPercent} = require("./Utils/loadingStates");
function sendProgress(STATE,progress = 0){
    let data = {
        STATE:STATE,
        progress:progress
    }
    if(progress==0){
        data.progress = calcProgressPercent(STATE);
    }
    ipcMain.emit('updateProgress',data);
}

module.exports = sendProgress;