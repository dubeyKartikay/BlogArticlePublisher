// const { ipcRenderer } = window;
document.getElementById("form").addEventListener("submit", sendForm);
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
    content_path: getCseontentPath(),
  };

  ipcRenderer.send("form-submission", data);
}