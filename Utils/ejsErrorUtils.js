const { dialog } = require('electron')
const log = require('electron-log');
function throwError({title,err}){
    log.error(err)
    const messageBoxOptions = {
        type: "error",
        title: title,
        message: err.nessage
    };
    dialog.showMessageBoxSync(messageBoxOptions);
}
module.exports = {throwError}