const apiKey = "FVbcA6MiVS0DYglfVn1EX0o0nOYyH0FA";
const trendsGallery = document.querySelector(".trends__gallery");
const suggestionsCards = document.querySelector(".suggestions__cards");
const searchInput = document.querySelector(".form__input");
const searchForm = document.querySelector(".search__form");
const searchResults = document.querySelector(".search__results");
const resultsGallery = document.querySelector(".results__gallery");
const resultsHashTags = document.querySelector(".results__hashtags");
const searchAutoComplete = document.querySelector(".search__autocomplete");
const formSubmitBtn = document.querySelector(".form__btn");
const createGifBtn = document.querySelector(".createGif__btn");
const dropDownContainer = document.querySelector(".dropdown__container");
const dropDownList = document.querySelector(".dropdown__list");
const nightTheme = document.querySelector(".night__theme");
const dayTheme = document.querySelector(".day__theme");
const myStyleSheet = document.querySelector("#stylesheet");

// change the theme on click and save the chosen theme for the user

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

// fetching trends
function getTrends() {
  fetch(`https://api.giphy.com/v1/gifs/trending?&limit=10&api_key=${apiKey}`)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      results.data.forEach((element) => {
        let hashTagsArray = element.title.split(" ");
        hashTagsArray.length = 4;
        for (let i = 0; i < hashTagsArray.length; i++) {
          hashTagsArray[i] = "#" + hashTagsArray[i];
        }

        let hashTagsStr = hashTagsArray.join(" ");
        let imageUrl = element.images.downsized.url;
        trendsGallery.innerHTML += `<div class="trends__gallery__item"><img src="${imageUrl}" class="trends__gallery__img" alt="trendy gif">
        <span class="gallery__item__hashtags">${hashTagsStr}</span></div>`;
      });
    })
    .catch((error) => console.log(error));
}

// fetching suggestions
function getSuggestion() {
  let tags = ["Jonathanvanness", "SailorMercury", "Fab", "Unicorns&Rainbows"];
  for (let tag of tags) {
    fetch(
      `https://api.giphy.com/v1/gifs/random?&tag="${tag}"&api_key=${apiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        let imageUrl = results.data.images.downsized.url;
        suggestionsCards.innerHTML += `
      <div class="suggestions__card">
        <div class="card__title title__text">
             <p class="hashtag">#${tag}</p>
             <img class="card__title__icon" src="./assets/button3.svg" alt="close icon">
        </div>
        <div class="card__content">
            <img class="card__img" src="${imageUrl}" alt="suggestion gif">
            <a class="card__link" href="#!">Ver más…</a>
        </div> 
        </div>
        `;
      })
      .catch((error) => console.log(error));
  }
}

// Auto Compelte Results
function GetAutoCompelteResults(query) {
  fetch(
    `https://api.giphy.com/v1/gifs/search/tags?&q="${query}"&limit=3&api_key=${apiKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      searchAutoComplete.innerHTML = "";
      if (query && results.data.length) {
        searchAutoComplete.style.display = "grid";
        results.data.forEach((element) => {
          searchAutoComplete.innerHTML += `<div class="autocomplete__item">${element.name}</div>`;
        });
      } else {
        searchAutoComplete.innerHTML = "";
        searchAutoComplete.style.display = "none";
      }
    })
    .catch((error) => console.log(error));
}

// input function
function onInput(event) {
  GetAutoCompelteResults(event.target.value);
  formSubmitBtn.classList.add("form__btn--active");
  if (!event.target.value) {
    formSubmitBtn.classList.remove("form__btn--active");
    searchResults.style.display = "none";
  }
}

function getGifs(query) {
  fetch(
    `https://api.giphy.com/v1/gifs/search?&q="${query}"&limit=10&api_key=${apiKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      resultsGallery.innerHTML = "";
      searchResults.style.display = "block";
      results.data.forEach((element) => {
        let imageUrl = element.images.downsized.url;
        resultsGallery.innerHTML += `<img class="searchResults__img" src="${imageUrl}" alt="gif from the search">`;
      });
    })
    .catch((error) => console.log(error));
}

// get tags related to the search
function getTags(term) {
  fetch(
    `https://api.giphy.com/v1/tags/related/{${term}}?&limit=3&api_key=${apiKey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      resultsHashTags.innerHTML = "";
      results.data.forEach((element) => {
        resultsHashTags.innerHTML += `<span class="results__tag">#${element.name}</span>`;
      });
    })
    .catch((error) => console.log(error));
}

getTrends();
getSuggestion();

// general event listeners
createGifBtn.addEventListener("click", () => {
  location.href = "creategifs.html";
});

// activate the drop down list
dropDownContainer.addEventListener("click", () => {
  dropDownList.classList.toggle("dropdown__list--active");
});
// Listening to input changes
searchInput.addEventListener("input", onInput);

// Listening to clicks on the form
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (searchInput.value) {
    getGifs(searchInput.value); // get the gifs
    getTags(searchInput.value);
    searchAutoComplete.style.display = "none";
  }
});

// Listening to clicks on the auto complete results
searchAutoComplete.addEventListener("click", (event) => {
  if (event.target.className == "autocomplete__item") {
    searchAutoComplete.style.display = "none";
    getGifs(event.target.textContent);
    getTags(event.target.textContent);
    searchInput.value = event.target.textContent.substring(1);
  }
});

// Listening to clicks on the tags
resultsHashTags.addEventListener("click", (event) => {
  if (event.target.className == "results__tag") {
    getGifs(event.target.textContent.substring(1));
    getTags(event.target.textContent.substring(1));
    searchInput.value = event.target.textContent.substring(1);
  }
});

//Listening to clicks to delete suggestions and fetch new cards
suggestionsCards.addEventListener("click", (event) => {
  if (event.target.className == "card__title__icon") {
    let cardTag = event.target.previousElementSibling.innerText.substring(1);

    fetch(
      `https://api.giphy.com/v1/gifs/random?&tag="${cardTag}"&api_key=${apiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        let imageUrl = results.data.images.downsized.url;
        let makeNewCard = event.target.parentElement.parentElement;
        if (makeNewCard) {
          makeNewCard.innerHTML = `
           <div class="card__title title__text">
                <p class="hashtag">#${cardTag}</p>
                <img class="card__title__icon" src="./assets/button3.svg" alt="close icon">
           </div>
           <div class="card__content">
               <img class="card__img" src="${imageUrl}" alt="suggestion gif">
               <a class="card__link" href="#!">Ver más…</a>
           </div>
        `;
        }
      });
  }
});
