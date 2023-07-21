const { Octokit } = require("octokit");
const {Base64} = require('js-base64');
const log = require('electron-log');
const secrets = require('../secrets');
function connect() {
  return new Octokit({
    auth: secrets.GITHUB_PAT,
  });
}
async function uploadFileToGitHub(data) {
  const fileTitle = data._id;
  const fileContent = Base64.encode(data.content);
  const octokit = connect();
  const owner = secrets.GITHUB_OWNER;
  const repo = secrets.GITHUB_REPO;
  const path = encodeURI(fileTitle);
  try{
    const res = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
        owner: owner,
        repo: repo,
        path: path,
        message: fileTitle,
        content: fileContent,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    if(res.status != "200" &&  res.status != "201"){
        await res.data;
        log.debug(res.data);
        throw new Error("Unable to upload to github")
    }
    await res.data;

    // if(res.status == 201){
    //     // console.log(res.data);
    // }
  }
  catch (err){
    log.error(err);
    throw new Error("Error Uploading file to github")
  }
  
}

module.exports={uploadFileToGitHub}
