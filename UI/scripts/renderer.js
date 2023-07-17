// const { ipcRenderer } = window;
document.getElementById("form").addEventListener("submit", sendForm);
document.getElementById("reset").addEventListener("click", resetForm);
async function sendForm(event) {
  event.preventDefault();
  // const imageFileData = await getInputFile("image");
  // const blogMarkDown = await getInputFile("content");
  if (imageFileData == null) {
    handleErrorFile(dropAreaImage);
    if (blogMarkDown == null) {
      handleErrorFile(dropAreaContent);
    }
    return;
  }
  if (blogMarkDown == null) {
    handleErrorFile(dropAreaContent);
    return;
  }
  const { heading, subhead, time } = event.target;
  const data = {
    heading: heading.value,
    subHeading: subhead.value,
    readingTime: time.value,
    img: imageFileData,
    content: blogMarkDown,
    content_path: getContentPath(),
  };
  // console.log(btoa(data.content));
  
  ipcRender.send("form-submission", data);
  window.scrollTo(0, document.body.scrollHeight);
}
function resetForm(){
  resetFiles();
  resetProgess();
}