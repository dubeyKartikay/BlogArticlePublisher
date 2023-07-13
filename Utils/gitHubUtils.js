const { Octokit } = require("octokit");
require("dotenv").config();
function connect() {
  return new Octokit({
    auth: process.env.GITHUB_PAT,
  });
}
// headers: {
//     'X-GitHub-Api-Version': '2022-11-28'
//   }

async function uploadFileToGitHub(data) {
  const fileTitle = data._id;
  const fileContent = btoa(data.content);
  const octokit = connect();
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = fileTitle;
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
        console.log(res.data);
        throw new Error("Unable to upload to github")
    }
    await res.data;

    if(res.status == 201){
        console.log(res.data);
    }
  }
  catch (err){
    console.log(err);
    throw new Error("Error Uploading file to github")
  }
  
}

module.exports={uploadFileToGitHub}
