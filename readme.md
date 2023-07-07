// Check if mobile device and in portrait mode
const isMobilePortrait = window.matchMedia("(orientation: portrait)").matches;
if (isMobilePortrait) {
  messageDiv.style.display = 'block';
} else {
  messageDiv.style.display = 'none';
}

// Check if media devices are supported
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  startButton.disabled = false;
} else {
  startButton.disabled = true;
  messageDiv.textContent = 'Media devices not supported';
}

// Start recording
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  saveButton.disabled = true;
  timerDiv.textContent = remainingTime;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        previewVideo.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        countdownInterval = setInterval(() => {
          remainingTime--;
          timerDiv.textContent = remainingTime;
          if (remainingTime === 0) {
            stopRecording();
          }
        }, 1000);

        chunks = [];
        mediaRecorder.addEventListener('dataavailable', event => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        });
      })
      .catch(error => {
        console.error('getUserMedia error:', error);
        stopButton.disabled = true;
        startButton.disabled = false;
      });
  } else {
    console.error('Media devices not supported');
    stopButton.disabled = true;
    startButton.disabled = false;
  }
});
