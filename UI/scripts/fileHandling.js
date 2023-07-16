let imageFile = null;
let imageFileData = null;
let contentFile = null;
let blogMarkDown = null;
// Add event listeners for drag and drop
const dropAreaImage = document.getElementById("image");
const dropAreaContent = document.getElementById("content");
// const imagePreview = document.getElementById("imagePreview");
// const contentPreview = document.getElementById("contentPreview");

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropAreaImage.addEventListener(eventName, preventDefaults, false);
  dropAreaContent.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
["dragenter", "dragover"].forEach((eventName) => {
  dropAreaImage.addEventListener(eventName, highlight, false);
  dropAreaContent.addEventListener(eventName, highlight, false);
});

// Remove highlight when item is no longer dragged over drop area
["dragleave", "drop"].forEach((eventName) => {
  dropAreaImage.addEventListener(eventName, unhighlight, false);
  dropAreaContent.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropAreaImage.addEventListener("drop", handleDropFile, false);
dropAreaContent.addEventListener("drop", handleDropContent, false);
dropAreaImage.addEventListener("click", openFileExplorer.bind(null, "image"));
dropAreaContent.addEventListener(
  "click",
  openFileExplorer.bind(null, "content")
);

function displayPreviewImage(file, previewElement) {
  const src = URL.createObjectURL(file);
  previewElement.style.backgroundImage = `url(${src})`
  // previewElement.innerText = "";
  previewElement.children[1].innerText = "";
  removeErrorMsg(previewElement);
  previewElement.classList.add("file-selected")
}

function displayPreviewContent(file, previewElement) {
  const reader = new FileReader();
  reader.onload = function (e) {
    removeErrorMsg(previewElement);
    previewElement.children[1].innerText = `${e.target.result}`;
    previewElement.classList.add("file-selected")
  };

  reader.onerror = function(e){
    console.log(e);
    handleErrorFile(previewElement);
  }
  reader.readAsText(file);
}
function openFileExplorer(elementId) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = elementId === "image" ? "image/*" : ".md";
  fileInput.style.display = "none";

  fileInput.addEventListener(
    "change",
    handleFileSelection.bind(null, elementId)
  );

  document.body.appendChild(fileInput);
  fileInput.click();
}
function handleFileSelection(elementId, event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (elementId === "image") {
    handleImageFile(file);
  } else if (elementId === "content") {
    handleContentFile(file);
  }

  fileInput.remove();
}

function removeErrorMsg(fileDOM){
  errorDOM = fileDOM.firstElementChild;
  errorDOM.innerText = "";
  errorDOM.classList.remove("error-file");
}
function handleErrorFile(fileDOM, message="An error occured while handling this file") {
  errorDOM = fileDOM.firstElementChild;
  // console.log(errorDOM);
  // fileDOM.childNodes[1].data = "";
  errorDOM.classList.add("error-file");
  errorDOM.innerText = message;
  // fileDOM.removeChild(fileDOM.children[1])
  fileDOM.children[1].innerText = ""
  // fileDOM.removeChild(fileDOM.firstChild)
  // fileDOM.removeChild(fileDOM.firstChild)
}

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function highlight() {
  this.classList.add("highlight");
}

function unhighlight() {
  this.classList.remove("highlight");
}

function handleDropFile(event) {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleImageFile(files[0]);
  }
}

function handleDropContent(event) {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleContentFile(files[0]);
  }
}
async function handleImageFile(file) {
  try{
    imageFileData = await readFile(file);
  }catch(e){
    console.log(e);
    handleErrorFile(dropAreaImage)
  }

  if (!imageFileData) {
    handleErrorFile(dropAreaImage);
    return;
  }

  imageFile = file;
  console.log(imageFile);
  displayPreviewImage(file, dropAreaImage);
}

async function handleContentFile(file) {
  blogMarkDown = await readFile(file);
  if (!blogMarkDown) {
    handleErrorFile(dropAreaContent);
    return;
  }

  contentFile = file;
  console.log(contentFile);
  displayPreviewContent(file, dropAreaContent);
}
function getContentPath(){
  return contentFile.path;
}
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileVAl = e.target.result;
      resolve(fileVAl);
    };
    reader.onerror = (err) => {
      reject(`Error Occurred while reading  ${err}`);
    };

    if (file.type.includes("image")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
};
