const createGifs = document.querySelector(".creategifs");
const myGifs = document.querySelector(".mygifs");
const gifMaker = document.querySelector(".gifmaker");
const gifMakerPlayer = document.querySelector(".gifmaker__player");
const successfUlupload = document.querySelector(".successfulupload");
const gifMakerBtns = document.querySelector(".gifmaker__btns");
const startBtn = document.querySelector(".start__btn");
const cancelBtn = document.querySelector(".cancel__btn");
const captureBtn = document.querySelector(".capture__btn");
const gifMakerTitle = document.querySelector(".gifmaker__title--text");
const uploadedGif = document.querySelector(".successfulupload__image");
const gifGallery = document.querySelector(".mygifs__gallery");
const apiKey = "FVbcA6MiVS0DYglfVn1EX0o0nOYyH0FA";
const nightTheme = document.querySelector(".night__theme");
const dayTheme = document.querySelector(".day__theme");
const myStyleSheet = document.querySelector("#stylesheet");

let streamPromise;
let recorder;
let timer;
let blob;
let gifSrc;
let form;
let responseId;
let theStream;
let progressBarInterval;

//save the theme and show it
choosonTheme = localStorage.getItem(`theme`);
if (choosonTheme) myStyleSheet.href = choosonTheme;

// setup uploading AbortController
const controller = new AbortController();
// signal to pass to fetch
const signal = controller.signal;

// update my gifs
function updateMyGifs(lastGif) {
  if (lastGif) {
    // show the newst gif
    let lastImg = document.createElement("img");
    lastImg.src = `https://media.giphy.com/media/${lastGif}/giphy.gif`;
    lastImg.classList.add("mygifs__gallery__item");
    gifGallery.prepend(lastImg);
  } else {
    gifGallery.innerHTML = "";
    for (var i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key[0] === "G") {
        let gifId = localStorage.getItem(key);
        gifGallery.innerHTML += `<img class="mygifs__gallery__item" src="https://media.giphy.com/media/${gifId}/giphy.gif" alt="my gif">`;
      }
    }
  }
}

// shows the gif maker div and open user camera when user click start
function showTheGifMaker() {
  createGifs.style.display = "none";
  myGifs.style.display = "none";
  gifMaker.style.display = "flex";
}

// open user camera
function askUserCamera() {
  streamPromise = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

startBtn.addEventListener("click", () => {
  showTheGifMaker();
  askUserCamera();
  captureUserCamera(streamPromise);
});

cancelBtn.addEventListener("click", () => {
  location.href = "index.html";
});
// set up and the recorder and assign the stream to the video tag
function captureUserCamera(streamPromise) {
  streamPromise
    .then((stream) => {
      document.querySelector("video").srcObject = stream;
      theStream = stream;
      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 100,
        quality: 10,
        width: 360,
        hidden: 240,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function stopTheRecording() {
  recorder.stopRecording(function () {
    blob = recorder.getBlob();
    gifSrc = URL.createObjectURL(blob);

    clearInterval(timer);
    saveUserGif();
    theStream.getTracks().forEach(function (track) {
      track.stop();
    });
  });
}

// save the gif to form object to upload
function saveUserGif() {
  form = new FormData();
  form.append("file", blob, "myGif.gif");
}

function saveToLocalStorage(ID) {
  localStorage.setItem(`Gif${ID}`, `${ID}`);
}

// uploading the gif
function uploadGif(gifForm) {
  fetch(`https://upload.giphy.com/v1/gifs?&api_key=${apiKey}`, {
    method: "POST",
    body: gifForm,
    signal: signal,
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (responseObj) {
      responseId = responseObj.data.id;
      saveToLocalStorage(responseId);
      manipulateGifMakerDiv("successfulupload");
      updateMyGifs(responseId);
    })
    .catch((error) => {
      console.error(error);
      alert("The upload has failed , try again!");
      location.reload();
    });
}

// adding event listener start the recording process when the user click on capture button or the icon
gifMakerBtns.addEventListener("click", startTheRecording);

function startTheRecording(event) {
  if (event.target.className == "capture__btn") {
    if (recorder) {
      // edit the gif maker div
      manipulateGifMakerDiv("recording");
      // start the timer and the recorder
      timer = window.setInterval(stopWatch, 10);
      recorder.startRecording();
    }
  }

  if (event.target.className == "done__btn") {
    stopTheRecording();
    manipulateGifMakerDiv("doneRecodring");
  }

  if (event.target.className == "repeat__btn") {
    location.reload();
  }

  if (event.target.className == "upload__btn") {
    uploadGif(form);
    manipulateGifMakerDiv("uploading");
  }

  if (event.target.className == "gifmaker__cancel__btn") {
    //cancel uploading
    controller.abort();
  }
}

// download and copy the gif on click
successfUlupload.addEventListener("click", (event) => {
  if (event.target.className == "successfulupload__downloadBtn") {
    console.log("download");
    return recorder.save();
  } else if (event.target.className == "successfulupload__copyBtn") {
    let link = `https://giphy.com/gifs/${responseId}`;
    copyToClipboard(link);
  } else if (event.target.className == "successfulupload__doneBtn") {
    location.href = "mygifs.html";
  }
});

// copy string to clipboard
function copyToClipboard(text) {
  let input = document.createElement("input");
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand("copy", false);
  input.remove();
  alert("Source URL copied to clipboard!!!");
}

// progress or upload bar function
function progressBar(div) {
  div = div.className;
  let arrayOfSpans = document.querySelectorAll(`.${div} > *`);
  let n = 0;

  progressBarInterval = setInterval(function () {
    if (arrayOfSpans[n] && choosonTheme == "style.css") {
      arrayOfSpans[n].style.background = "#F7C9F3";
    }
    if (arrayOfSpans[n] && choosonTheme == "nightstyle.css") {
      arrayOfSpans[n].style.background = "#EE3EFE";
    }
    n++;
    if (n > arrayOfSpans.length) {
      n = 0;
      arrayOfSpans.forEach((span) => {
        span.style.background = "#999999";
      });
    }
  }, 100);
}

// manipulate the Gif Maker Div
function manipulateGifMakerDiv(stage) {
  if (stage == "recording") {
    gifMakerTitle.textContent = "Capturando Tu Guifo";
    gifMakerBtns.innerHTML = `
    <button class="done__btn">Listo</button>
    <span class="recording__icon"><img src="./assets/recording.svg" alt="forward icon"/></span>
    <div class="timer"></div>
    `;
  } else if (stage == "doneRecodring") {
    gifMakerTitle.textContent = "Vista Previa";
    const gifMakerTimer = document.querySelector(".timer");
    let duration = gifMakerTimer.textContent;
    gifMakerPlayer.innerHTML = `
    <img class="gifMaker__gif" src="${gifSrc}" alt="gif"/>`;
    gifMakerBtns.innerHTML = `
    <button class="upload__btn">Subir Guifo</button>
    <button class="repeat__btn">Repetir Captura</button>
    <div class="timer">${duration}</div>
    <div class="progress">
      <span class="forward__icon">
        <img src="./assets/forward.svg" alt="" />
      </span>
      <div class="progress__bar">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
    `;
    let progressBarDiv = document.querySelector(".progress__bar");
    progressBar(progressBarDiv);
  } else if (stage == "uploading") {
    clearInterval(progressBarInterval);
    gifMakerTitle.textContent = "Subiendo Guifo";
    gifMakerPlayer.innerHTML = `
    <img class="uploading__icon" src="./assets/globe_img.png" alt="globe image" />
        <p class="uploading__text">Estamos subiendo tu guifo…</p>
        <div class="uploading__bar">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <p class="uploading__text--secondary">
          Tiempo restante: <span class="linethrough">38 años</span> algunos
          minutos
        </p>`;

    let uploadBarDiv = document.querySelector(".uploading__bar");
    progressBar(uploadBarDiv);
    gifMakerBtns.innerHTML = `<button class="gifmaker__cancel__btn">Cancelar</button>`;
  } else if (stage == "successfulupload") {
    clearInterval(progressBarInterval);
    gifMaker.style.display = "none";
    uploadedGif.innerHTML = `<img class="successfulupload__img" src="https://media.giphy.com/media/${responseId}/giphy.gif" alt="success upload image">`;
    successfUlupload.style.display = "flex";
    myGifs.style.display = "block";
  }
}

updateMyGifs();
