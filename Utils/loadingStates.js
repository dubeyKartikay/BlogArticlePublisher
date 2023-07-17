const LOADING_STATES = {
    ERROR:-1,
     PARSING_DATA :0,
    UPLOADING_LOCAL_TO_IMGUR : 1,
    UPLOADING_THUMBNAIL_TO_IMGUR : 2,
    INSERTING_IN_MONGODB : 3,
    UPLOADING_TO_GITHUB : 4,
    PUBLISHING : 5,
    DONE:6
}

function stateMessages(STATE){
    switch (STATE) {
        case 0:
            return "Parsing Markdown FILES"
            break;
        case 1:
            return "Uploading images in markdown files to imgur"
        case 2:
            return "Uploading the thumbnail images to imgur"
        case 3:
            return "Inserting data in MongoDb database"
        case 4:
            return "Uploading markdown file to GitHub"
        case 5:
            return "Publishing the blog to the website"
        case 6:
            return "Blog Published Successfully"
        default:
            break;
    }
}
function calcProgressPercent(STATE){
    return STATE*(100/6);
}

// Object.freeze(LOADING_STATES)
module.exports={LOADING_STATES,calcProgressPercent,stateMessages};
