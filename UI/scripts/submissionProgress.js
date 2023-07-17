function setProgress(state,progress, errorMessage = '') {
    const progressElement = document.getElementById('progress');
  
    if (state === -1) {
      progressElement.style.backgroundColor = '#FF0000';
      progressElement.style.width = '100%';
      progressElement.innerHTML = `Error: ${errorMessage}`;
    } else {
      progressElement.style.backgroundColor = '#4CAF50';
      progressElement.style.width = `${progress}%`;
      progressElement.innerHTML = `${progress}%`;
    }
  }

ipcRender.receive("updateProgress",(msg)=>{
    const {STATE,progress,message} = msg;
    setProgress(STATE,progress,message);
})
