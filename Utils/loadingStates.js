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
function calcProgressPercent(STATE){
    return STATE*(100/6);
}

// Object.freeze(LOADING_STATES)
module.exports={LOADING_STATES,calcProgressPercent};
