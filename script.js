async function main() {
    const buttonStart = document.querySelector('#buttonStart');
    const buttonStop = document.querySelector('#buttonStop');
    const buttonSave = document.querySelector('#buttonSave');
    const videoLive = document.querySelector('#videoLive');
    const videoRecorded = document.querySelector('#videoRecorded');
    const countdownTimer = document.querySelector('#countdownTimer');
  
    let isRecording = false;
    let countdownSeconds = 120;
    let mediaRecorder;
    let timerId;
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  
    videoLive.srcObject = stream;
  
    if (!MediaRecorder.isTypeSupported('video/webm')) {
      console.warn('video/webm is not supported');
    }
  
    function startRecording() {
      isRecording = true;
      countdownTimer.innerHTML = countdownSeconds;
      timerId = setInterval(updateCountdown, 1000);
      mediaRecorder.start();
      buttonStart.setAttribute('disabled', '');
      buttonStop.removeAttribute('disabled');
    }
  
    function stopRecording() {
      isRecording = false;
      clearInterval(timerId);
      countdownSeconds = 120;
      countdownTimer.innerHTML = '';
      mediaRecorder.stop();
      buttonStart.removeAttribute('disabled');
      buttonStop.setAttribute('disabled', '');
    }
  
    function updateCountdown() {
      countdownSeconds--;
      countdownTimer.innerHTML = countdownSeconds;
      if (countdownSeconds <= 0) {
        stopRecording();
      }
    }
  
    async function saveVideo() {
        const timestamp = new Date().toISOString();
        const filename = `video_${timestamp}.webm`;
        const blob = new Blob(mediaRecorder.recordedBlobs, { type: 'video/webm' });
        const file = new File([blob], filename, { type: 'video/webm' });
      
        const folderId = '1nZcp0nIWpZJgHrCksGvu-MBBoUWeKzi5'; // Replace with your folder ID
      
        const createFileResponse = await fetch(`https://www.googleapis.com/drive/v3/files`, {
          method: 'POST',
          headers: {
            Authorization: 'AIzaSyAygwy0sAezmPiuRlnfcNRSSDfYG6JQg1Y', // Replace with your API key
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: filename,
            parents: [folderId],
          }),
        });
      
        const createFileData = await createFileResponse.json();
      
        const fileId = createFileData.id;
        const uploadUrl = createFileData.uploadUrl;
      
        const formData = new FormData();
        formData.append('file', file);
      
        await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });
      
        console.log('Video saved to Google Drive!');
      }
      
  
    buttonStart.addEventListener('click', () => {
      if (!isRecording) {
        startRecording();
      }
    });
  
    buttonStop.addEventListener('click', () => {
      if (isRecording) {
        stopRecording();
      }
    });
  
    buttonSave.addEventListener('click', () => {
      if (!isRecording) {
        saveVideo();
      }
    });
  
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    });
  
    mediaRecorder.addEventListener('dataavailable', event => {
      videoRecorded.src = URL.createObjectURL(event.data);
      videoRecorded.controls = true;
      videoRecorded.style.display = 'block';
    });
  }
  
  main();
  
