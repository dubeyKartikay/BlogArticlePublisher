// const { ipcRenderer } = window;
document.getElementById("form").addEventListener("submit", sendForm);
let imageFile = null;
let contentFile = null;
// Add event listeners for drag and drop
const dropAreaImage = document.getElementById("image");
const dropAreaContent = document.getElementById("content");

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
dropAreaImage.addEventListener("drop", handleDropImage, false);
dropAreaContent.addEventListener("drop", handleDropContent, false);

function handleErrorFile() {
	document.body.appendChild(errorMessage);
	errorMessage.classList.add("show");
  
	// Remove the error message after 3 seconds
	setTimeout(() => {
	  errorMessage.classList.remove("show");
	  setTimeout(() => {
		errorMessage.remove();
	  }, 300);
	}, 3000);
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

function handleDropImage(event) {
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
  const imageFileData = await readFile(file);
  if (!imageFileData) {
    handleErrorFile();
    return;
  }

  imageFile = file;
}

async function handleContentFile(file) {
  const blogMarkDown = await readFile(file);
  if (!blogMarkDown) {
    handleErrorFile();
    return;
  }

  contentFile = file;
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
const handleErrorFile = () => {
  console.log("File Error");
};

async function sendForm(event) {
  event.preventDefault();
  const imageFileData = await getInputFile("image");
  const blogMarkDown = await getInputFile("content");
  if (!imageFileData) {
    handleErrorFile();
    return;
  }
  if (!blogMarkDown) {
    handleErrorFile();
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
const getContentPath = () => {
  const fileInput = document.getElementById("content");
  const file = fileInput.files[0];
  return file.path.substring(0, file.path.lastIndexOf("/"));
};
async function getInputFile(elementId) {
  const fileInput = document.getElementById(elementId);
  const file = fileInput.files[0];
  const acceptableFileTypes =
    elementId == "image" ? ["png", "jpg", "jpeg"] : ["md"];
  if (!acceptableFileTypes.includes(file.path.split(".").pop().toLowerCase())) {
    //handle wrong file type
    return null;
  }
  let fileData = null;
  try {
    fileData = await readFile(file);
  } catch (err) {
    console.log(err);
    fileData = null;
  }
  return fileData;
}
