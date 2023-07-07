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
      if (!recordedChunks.length) {
        console.warn('No recorded video available.');
        return;
      }
  
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const file = new File([blob], 'recorded_video.webm');
  
      // Load the Google Drive API
      gapi.load('client:auth2', async () => {
        try {
          // Initialize the Google Drive client
          await gapi.client.init({
            apiKey: 'AIzaSyDOqkBSqGlFLFlEUv7HimbMmbPXjJT8pNI', // Replace with your actual API key
            clientId: ' 240950174286-njie8elgggvsb9bdoroc1gsu4p6jk9r9.apps.googleusercontent.com', // Replace with your actual client ID
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file',
          });
  
          // Check if the user is signed in
          if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // Sign in the user
            await gapi.auth2.getAuthInstance().signIn();
          }
  
          // Create the file metadata
          const fileMetadata = {
            name: file.name,
            parents: ['1nZcp0nIWpZJgHrCksGvu-MBBoUWeKzi5'], // Replace 'FOLDER_ID' with your desired folder ID
          };
  
          // Upload the file to Google Drive
          const response = await gapi.client.drive.files.create({
            resource: fileMetadata,
            media: {
              mimeType: file.type,
              body: file,
            },
            fields: 'id',
          });
  
          console.log('Video saved to Google Drive with file ID:', response.result.id);
        } catch (error) {
          console.error('Error saving video to Google Drive:', error);
        }
      });
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
  