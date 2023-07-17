const progressEleParent = document.getElementById("progress-bar");
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");
const progressElement = document.getElementById("progress");
const progressTextElement = progressEleParent.children[1];

function setProgress(state, progress, message = "") {
  // const progressElement = document.getElementById('progress');
  progressEleParent.classList.add("reveal-progress-bar");
  submitButton.classList.add("hide-submit");
  if (state === -1) {
    progressElement.classList.add("error-bar");
    progressElement.style.width = "100%";
    progressTextElement.innerText = `Error: ${message}`;
    resetButton.classList.remove("hide-submit");
    resetButton.classList.add("reset-error");
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    message = message == "" ? `${progress}%` : message;
    progressElement.style.width = `${progress}%`;
    progressTextElement.innerText = message;
    if(progress == 100){
      resetButton.classList.remove("hide-submit");
      resetButton.classList.add("reset-success");
      resetButton.value = "🔄 Submit Another entry"
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}

ipcRender.receive("updateProgress", (msg) => {
  const { STATE, progress, message } = msg;
  setProgress(STATE, progress, message);
});

function resetProgess() {
  progressElement.classList.remove("error-bar");
  progressTextElement.innerText = "";
  progressElement.style.width = "0%"
  progressEleParent.classList.remove("reveal-progress-bar");
  submitButton.classList.remove("hide-submit");
  resetButton.classList.add("hide-submit");
}

