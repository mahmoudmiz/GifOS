const gifGallery = document.querySelector(".mygifs__gallery");
const createGifBtn = document.querySelector(".createGif__btn");
const dropDownContainer = document.querySelector(".dropdown__container");
const dropDownList = document.querySelector(".dropdown__list");
const nightTheme = document.querySelector(".night__theme");
const dayTheme = document.querySelector(".day__theme");
const myStyleSheet = document.querySelector("#stylesheet");

choosonTheme = localStorage.getItem(`theme`);
if (choosonTheme) myStyleSheet.href = choosonTheme;

dropDownList.addEventListener("click", (event) => {
  if (event.target.classList.contains("night__theme")) {
    dropDownList.classList.remove("dropdown__list--active");

    localStorage.setItem(`theme`, "nightstyle.css");
    choosonTheme = localStorage.getItem(`theme`);
    myStyleSheet.href = choosonTheme;
  } else if (event.target.classList.contains("day__theme")) {
    dropDownList.classList.remove("dropdown__list--active");
    localStorage.setItem(`theme`, "style.css");
    choosonTheme = localStorage.getItem(`theme`);
    myStyleSheet.href = choosonTheme;
  } else {
    dropDownList.classList.remove("dropdown__list--active");
  }
});

createGifBtn.addEventListener("click", () => {
  location.href = "creategifs.html";
});

dropDownContainer.addEventListener("click", () => {
  dropDownList.classList.toggle("dropdown__list--active");
});

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

updateMyGifs();
