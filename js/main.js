let filmsWrapper = document.querySelector(".list-unstyled");
let filterFilm = document.querySelector(".js-search-form")

let createElement = function (element, className = "") {
    let createdElement = document.createElement(element);
    createdElement.className = className
    return createdElement
}


let genrateFilmCard = function (film) {

    let filmWrapper = createElement("li");
    filmWrapper.classList.add("search-results__item", "movie", "col-sm-6", "mb-4");
    let filmCard = createElement("div");
    filmCard.classList.add("card");

    filmWrapper.append(filmCard);

    let filmImg = document.createElement("img");
    filmImg.src = film.bigThumbnail;
    filmImg.className = "movie__poster card-img-top";
    filmImg.width = 300;
    filmImg.height = 200;
    filmCard.append(filmImg)

    let cardBody = createElement("div");
    cardBody.className = "card-body";
    filmCard.append(cardBody);

    let fimTitle = createElement("h3", "movie__title h5");
    fimTitle.textContent = film.title
    cardBody.append(fimTitle)

    let timeWrapper = createElement("p", "card-text");
    let timeImg = createElement("img");
    timeImg.src = "img/calendar.svg";
    timeImg.width = 25;
    timeImg.height = 25;
    timeWrapper.append(timeImg);
    let timeText = createElement("span", "movie__year");
    timeText.textContent = film.year;
    timeWrapper.append(timeText);
    cardBody.append(timeWrapper);

    let retingWrapper = createElement("p", "card-text");
    let retingImg = createElement("img")
    retingImg.src = "img/star.svg";
    retingImg.width = 25;
    retingImg.height = 25;
    retingWrapper.append(retingImg);
    let retingText = createElement("span", "movie__rating");
    retingText.textContent = film.imdbRating;
    retingWrapper.append(retingText);
    cardBody.append(retingWrapper);

    let btnsWrapper = createElement("p", "card-text d-flex flex-column flex-md-row flex-wrap justify-content-around");
    let treilerLink = createElement("a", "movie__trailer-link m-1 m-xl-0 btn btn-outline-primary btn-sm");
    treilerLink.target = "_blank";
    treilerLink.href = "https://www.youtube.com/watch?v=" + film.youtubeId;
    treilerLink.textContent = "Watch trailer"
    btnsWrapper.append(treilerLink);
    let moreInfo = createElement("button", "m-1 m-xl-0 btn btn-outline-info btn-sm js-movie-modal-opener");
    moreInfo.type = "button";
    moreInfo.textContent = "More Info";
    moreInfo.dataset.bsToggle = "modal";
    moreInfo.dataset.bsTarget = "#movie-info-modal";
    moreInfo.textContent = "MoreInfo";
    moreInfo.dataset.id = film.imdbId
    btnsWrapper.append(moreInfo);

    let bookMarkbtn = createElement("button", "m-1 m-xl-0 btn btn-outline-success btn-sm js-movie-bookmark");
    bookMarkbtn.type = "button";
    bookMarkbtn.textContent = "Bookmark";
    bookMarkbtn.dataset.id = film.imdbId;
    btnsWrapper.append(bookMarkbtn);

    cardBody.append(btnsWrapper);

    return filmWrapper;

}

let bookedFilms = []

let generetBookMarkFilm = (film) => {
    let filmWrapper = createElement("li", "bookmarked-movie list-group-item");
    let filmTitle = createElement("h3", "bookmarked-movie__title h6");
    filmTitle.textContent = film.title;
    filmWrapper.append(filmTitle);
    let filmRemoveBtn  = createElement("button" , "btn btn-sm btn-danger js-remove-bookmarked-movie-button")
    filmRemoveBtn.type = "button";
    filmRemoveBtn.textContent = "Remove";
    filmWrapper.append(filmRemoveBtn);

    return filmWrapper
}
let bookedFilmsList = document.querySelector(".bookmarked-movies");

let generetBookedFilms = (films) =>{
    bookedFilmsList.innerHTML = "";
    films.forEach((film)=>{
        bookedFilmsList.append(generetBookMarkFilm(film))
    })
}


let sortSelect = document.querySelector(".js-search-form__sort-select")
let nameInput = filterFilm.querySelector(".js-search-form__title-input");
let rtingInput = filterFilm.querySelector(".js-search-form__rating-input");
let genreSelect = filterFilm.querySelector(".js-search-form__genre-select");
let movieModalTitle = document.querySelector(".movie-info-modal__title");
let modalDesc = document.querySelector(".modal-body");



let genereteFilms = function (films) {
    filmsWrapper.innerHTML = "";
    films.forEach(function (film) {
        filmsWrapper.append(genrateFilmCard(film))
    })
}








let generes = []
movies.forEach(film => {
    film.categories.forEach(catigorie => {
        if (!generes.includes(catigorie)) {
            generes.push(catigorie)
        }
    })
});

generes.forEach((ganer) => {
    let option = createElement("option");
    option.value = ganer;
    option.textContent = ganer;
    genreSelect.append(option)
})

let alphabitSort = (a, b) => {
    if (a.title > b.title) {
        return 1
    }
    if (a.title < b.title) {
        return -1
    }
    return 0;
}

let reversAlphabitSort = (a, b) => {
    if (a.title > b.title) {
        return -1
    }
    if (a.title < b.title) {
        return 1
    }
    return 0;
}

let retingLowFristSort = (a, b) => {
    return a.imdbRating - b.imdbRating
}
let retingHightFristSort = (a, b) => {
    return b.imdbRating - a.imdbRating
}

let yearSort = (a, b) => {
    return a.year - b.year
}

let yearReversSort = (a, b) => {
    return b.year - a.year
}

let sortTaypes = {
    "rating_desc": retingLowFristSort,
    "rating_asc": retingHightFristSort,
    "az": alphabitSort,
    "za": reversAlphabitSort,
    "year_desc": yearSort,
    "year_asc": yearReversSort
}

filterFilm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let nameRegExp = new RegExp(nameInput.value, "gi");
    let filteredFilms = movies.filter((film) => {
        let doseNameMatches = film.title.match(nameRegExp);
        let doseRetingMatches = film.imdbRating >= rtingInput.value - 0;
        let doseGanreMatches = genreSelect.value === "All" ? true : film.categories.includes(genreSelect.value)
        return doseNameMatches && doseRetingMatches && doseGanreMatches;
    }).sort(sortTaypes[sortSelect.value])
    genereteFilms(filteredFilms)
})

filmsWrapper.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-movie-modal-opener")) {
        let clickedId = evt.target.dataset.id;
        let clickedFilm = movies.find((film) => {
            return film.imdbId === clickedId;

        })
        if (clickedFilm) {
            movieModalTitle.textContent = clickedFilm.title;
            modalDesc.textContent = clickedFilm.summary
        }
    }
    if(evt.target.matches(".js-movie-bookmark")){
        let clickedId  = evt.target.dataset.id;
        let clickedFilm = movies.find((film) =>{
            return film.imdbId === clickedId
        })
        if(clickedFilm){
            let isTherFilm = bookedFilms.some((film) => {
                return film.imdbId === clickedFilm.imdbId
            })
            if(!isTherFilm){
                bookedFilms.unshift(clickedFilm);
                generetBookedFilms(bookedFilms)
            }
        }
    }
})