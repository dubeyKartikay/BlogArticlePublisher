const { dialog } = require('electron')
function throwError({title,message}){
    const messageBoxOptions = {
        type: "error",
        title: title,
        message: message
    };
    dialog.showMessageBoxSync(messageBoxOptions);
}
module.exports = {throwError}