const api = {
    url: `http://api.openweathermap.org/data/2.5/`,
    key: `b7bf80efafd4a87d928b38d509b14759`,
};
var appendNumber = 1;
let current = 0;
let countOfDays = 0;  // количество дней для вывода
let countOfHours = 0; // для подсчета кол-во часов для отображания -3hours
let newDayNumber = 0; // для поиска следуюшего дня в масисиве list (присваивается индекс массива)

document.querySelector(`.input`).addEventListener(`keypress`, function (event) {
    return (event.keyCode === 13) ? getWeather(this.value) : 0;
});

function createFirstCard(city, info) {
    countOfDays = 0;
    newDayNumber = 0;
    (document.querySelector('.weather-API__addNewDay')) ? document.querySelector('.weather-API__addNewDay').remove() : null;

    let card = document.createElement(`div`);
    card.classList.add(`weather-card`);
    card.dataset.weatherCounter;
    card.dataset.weatherCounter = newDayNumber;
    card.dataset.cardNumber;
    card.dataset.cardNumber = 0;
    card.classList.add(`new-card-number-0`);
    document.querySelector(`.weather-API__cards`).prepend(card);

    let cardInfo = document.createElement(`div`);
    cardInfo.classList.add(`weather-card__info`);
    document.querySelector(`.weather-card`).prepend(cardInfo);

    let cardPlace = document.createElement(`div`);
    cardPlace.classList.add(`weather-card__place`);
    document.querySelector(`.weather-card__info`).prepend(cardPlace);

    let cardCity = document.createElement(`div`);
    cardCity.classList.add(`weather-card__city`);
    document.querySelector(`.weather-card__place`).prepend(cardCity);

    let cardCountry = document.createElement(`sup`);
    cardCountry.classList.add(`weather-card__country`);
    document.querySelector(`.weather-card__city`).after(cardCountry);

    let cardTime = document.createElement(`div`);
    cardTime.classList.add(`weather-card__time`);
    document.querySelector(`.weather-card__place`).after(cardTime);

    let cardTemperature = document.createElement(`div`);
    cardTemperature.classList.add(`weather-card__temperature`);
    document.querySelector(`.weather-card__time`).after(cardTemperature);

    let temperatureReal = document.createElement(`div`);
    temperatureReal.classList.add(`weather-card__real-degree`);
    document.querySelector(`.weather-card__temperature`).prepend(temperatureReal);

    let temperatureFeel = document.createElement(`div`);
    temperatureFeel.classList.add(`weather-card__feels-degree`);
    document.querySelector(`.weather-card__real-degree`).after(temperatureFeel);

    let buttonAddDay = document.createElement(`button`);
    buttonAddDay.classList.add(`weather-API__addNewDay`);
    buttonAddDay.textContent = `add new day`;
    document.querySelector(`.weather-API__cards`).after(buttonAddDay);

    let changeHours = document.createElement(`div`);
    changeHours.classList.add(`weather-card__changeHours`);
    document.querySelector(`.weather-card__info`).after(changeHours);

    let buttonPlus3Hours = document.createElement(`button`);
    buttonPlus3Hours.textContent = `+3 hours`;
    buttonPlus3Hours.classList.add(`weather-card__plus3Hours`);
    document.querySelector(`.weather-card__changeHours`).prepend(buttonPlus3Hours);

    let buttonMinus3Hours = document.createElement(`button`);
    buttonMinus3Hours.textContent = `-3 hours`;
    buttonMinus3Hours.classList.add(`weather-card__minus3Hours`);
    document.querySelector(`.weather-card__plus3Hours`).before(buttonMinus3Hours);

    let weatherIcon = document.createElement(`div`);
    weatherIcon.classList.add(`weather-card__icon`);
    document.querySelector(`.weather-card__temperature`).after(weatherIcon);

    let cardStatus = document.createElement(`div`);
    cardStatus.classList.add(`weather-card__status`);
    document.querySelector(`.weather-card__icon`).after(cardStatus);

    console.log(info.weather[0].icon)

    document.querySelector(`.weather-card__city`).textContent = city.city.name;
    document.querySelector(`.weather-card__country`).textContent = city.city.country;
    document.querySelector(`.weather-card__time`).textContent = info.dt_txt;
    document.querySelector(`.weather-card__real-degree`).innerHTML = (info.main.temp - 273).toFixed(1) + `&deg`;
    document.querySelector(`.weather-card__feels-degree`).innerHTML = `feels like: ` + (info.main.feels_like - 273).toFixed(1) + `&deg`;
    document.querySelector(`.weather-card__icon`).innerHTML = `<img src='https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png'>`;
    document.querySelector(`.weather-card__status`).textContent = info.weather[0]['description'];
}

let newInfoCard = function (info, button = false) {
    let outputCard;

    if (button) {
        outputCard = button.target.parentNode.parentNode.classList[1];
    } else {
        let newCardDiv = document.createElement(`div`);
        newCardDiv = document.querySelector(`.weather-card`).cloneNode(true);
        newCardDiv.classList.remove(`new-card-number-0`);
        newCardDiv.classList.add(`new-card-number-${countOfDays}`);
        newCardDiv.dataset.cardNumber = countOfDays;
        newCardDiv.dataset.weatherCounter = newDayNumber;
        (countOfDays == 1) ? document.querySelector(`.weather-card`).after(newCardDiv) : document.querySelector(`.new-card-number-${countOfDays - 1}`).after(newCardDiv);
        outputCard = `new-card-number-${countOfDays}`;
    }

    document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__time`).innerHTML = info.dt_txt;
    document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__temperature > .weather-card__real-degree`).innerHTML = (info.main.temp - 273).toFixed(1) + `&deg`;
    document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__temperature > .weather-card__feels-degree`).innerHTML = `feels like: ` + (info.main.feels_like - 273).toFixed(1) + `&deg`;
    document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__icon`).innerHTML = `<img src='https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png'>`;
    document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__status`).innerHTML = info.weather[0][`description`];
}

let getWeather = function (e) {
    fetch(`${api.url}forecast?q=${e}&inits=metric&APPID=${api.key}`)
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res;
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error
            }
        })
        .then(function (data) { return data.json() })
        .then(displayWeather)
        .catch((e) => {
            console.log(`Error: ` + e.message);
            console.log(e.response);
        });
}

function displayWeather(data) {
    let allCardsBlock = document.querySelector(`.weather-API__cards`)

    while (allCardsBlock.firstChild) {
        allCardsBlock.removeChild(allCardsBlock.firstChild);
    }
    createFirstCard(data, data.list[0]);

    document.querySelector(`.weather-API__addNewDay`).onclick = (event) => {
        let day = +data.list[newDayNumber].dt_txt.split(` `, 2)[0].split(`-`)[2];
        let mounth = +data.list[newDayNumber].dt_txt.split(`-`, 2)[1];
        let year = +data.list[newDayNumber].dt_txt.split(`-`, 2)[0];
        countOfDays++;
        if (countOfDays < 4) {
            let nextDayInfo = (data.list).find((item, index) => {
                let newDay = item.dt_txt.split(` `, 2)[0].split(`-`)[2];
                let newMounth = item.dt_txt.split(`-`, 2)[1];
                let newYear = item.dt_txt.split(`-`, 2)[0];

                newDayNumber = index;
                if ((newDay < day && newMounth > mounth) || (newDay > day && newMounth == mounth) || (newYear > year && newMounth < mounth)) {
                    return item;
                }
            });
            newInfoCard(nextDayInfo);
        } else {
            event.target.style.display = `none`;
            countOfDays = 0;
            newDayNumber = 0;
        }
    }

    document.querySelector(`.weather-API__cards`).onclick = (e) => {
        if (e.target.matches(`button.weather-card__plus3Hours`)) {
            let nex = +e.target.parentNode.parentNode.getAttribute(`data-weather-counter`);
            let day = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[0].split(`-`)[2];
            let hour = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[1].split(`:`)[0];
            let nextHourInfo = (data.list).find((item, i) => {
                if ((+item.dt_txt.split(` `, 2)[1].split(`:`)[0] > hour) && (+item.dt_txt.split(` `, 2)[0].split(`-`)[2] === day)) {
                    console.log(`+`);
                    return item;
                }
            });
            if (nextHourInfo === undefined) {
                return 0;
            }
            newInfoCard(nextHourInfo, e);
        } else if (e.target.matches(`button.weather-card__minus3Hours`)) {
            let nex = +e.target.parentNode.parentNode.getAttribute(`data-weather-counter`);
            let day = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[0].split(`-`)[2];
            let hour = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[1].split(`:`)[0];

            let nextHourInfo = (data.list).find((item, i) => {
                if (((hour - +item.dt_txt.split(` `, 2)[1].split(`:`)[0]) === 3) && (+item.dt_txt.split(` `, 2)[0].split(`-`)[2] === day)) {
                    console.log(`-`);
                    return item;
                }
            });

            if (nextHourInfo === undefined) {
                return 0;
            }
            newInfoCard(nextHourInfo, e);
        } else {
            return false;
        }
    }
}