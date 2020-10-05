// ссылка и ключ на OpenWeahterApi
const api = {
	url: `http://api.openweathermap.org/data/2.5/`,
	key: `b7bf80efafd4a87d928b38d509b14759`,
};

// количество дней для вывода
let countOfDays = 0;
// индекс для поиска следуюшего дня в масисиве list (присваивается индекс массива)
let newDayNumber = 0;

// создание первой карточки погоды
function createFirstCard(city, info) {
	// обнуляем кол-во дней
	countOfDays = 0;
	// обнуляем значение следующего дня 
	newDayNumber = 0;

	// создаем саму карточку 
	const card = document.createElement(`div`);
	card.classList.add(`weather-card`);
	card.dataset.weatherCounter = newDayNumber;
	card.dataset.cardNumber = 0;
	card.classList.add(`new-card-number-0`);
	document.querySelector(`.weather-API__cards`).prepend(card);

	// класс для структурирования информации
	const cardInfo = document.createElement(`div`);
	cardInfo.classList.add(`weather-card__info`);
	document.querySelector(`.weather-card`).prepend(cardInfo);

	// информация о месторасположении
	const cardPlace = document.createElement(`div`);
	cardPlace.classList.add(`weather-card__place`);
	document.querySelector(`.weather-card__info`).prepend(cardPlace);

	// город
	const cardCity = document.createElement(`div`);
	cardCity.classList.add(`weather-card__city`);
	document.querySelector(`.weather-card__place`).prepend(cardCity);

	// страна
	const cardCountry = document.createElement(`sup`);
	cardCountry.classList.add(`weather-card__country`);
	document.querySelector(`.weather-card__city`).after(cardCountry);

	// время, API предоставляет показатели погоды каждые 3 часа(начиная с 00:00 до 21:00)
	// с 00:00 - начинается отсчет нового дня
	// первичный показатель времени первой карточки приближен к времени в момент нажатия,
	// учитывая часовой пояс, и округлен к ближайшему значению(каждых 3-х часов)
	// время отсчета, карточки следующего дня, начинается с 00:00 
	const cardTime = document.createElement(`div`);
	cardTime.classList.add(`weather-card__time`);
	document.querySelector(`.weather-card__place`).after(cardTime);

	// класс для показателей температуры
	const cardTemperature = document.createElement(`div`);
	cardTemperature.classList.add(`weather-card__temperature`);
	document.querySelector(`.weather-card__time`).after(cardTemperature);

	// фактическая температура
	const temperatureReal = document.createElement(`div`);
	temperatureReal.classList.add(`weather-card__real-degree`);
	document.querySelector(`.weather-card__temperature`).prepend(temperatureReal);

	// температура 'по ощущениям'
	const temperatureFeel = document.createElement(`div`);
	temperatureFeel.classList.add(`weather-card__feels-degree`);
	document.querySelector(`.weather-card__real-degree`).after(temperatureFeel);

	// если кнопки для отображение погоды след. дня нет, то создаем ее
	// если при прошлом поиске показ погоды на следующие дни был исчерпан
	// и кнопка приняла disabled = true, отменяем его
	if (!document.querySelector(`.weather-API__addNewDay`)) {
		const buttonAddDay = document.createElement(`button`);
		buttonAddDay.classList.add(`weather-API__addNewDay`);
		buttonAddDay.textContent = `add new day`;
		document.querySelector(`.weather-API__cards`).after(buttonAddDay);
	} else {
		const disabledAddButton = document.querySelector(`.weather-API__addNewDay`);
		disabledAddButton.disabled = false;
		disabledAddButton.style.backgroundColor = `white`;
	}

	// класс для структурирования кнопок добавления/вычитания времени
	const changeHours = document.createElement(`div`);
	changeHours.classList.add(`weather-card__changeHours`);
	document.querySelector(`.weather-card__info`).after(changeHours);

	// кнопка добавление 3-х часов
	const buttonPlus3Hours = document.createElement(`button`);
	buttonPlus3Hours.textContent = `+3 hours`;
	buttonPlus3Hours.classList.add(`weather-card__plus3Hours`);
	document.querySelector(`.weather-card__changeHours`).prepend(buttonPlus3Hours);

	// кнопка вычета 3-х часов
	const buttonMinus3Hours = document.createElement(`button`);
	buttonMinus3Hours.textContent = `-3 hours`;
	buttonMinus3Hours.classList.add(`weather-card__minus3Hours`);
	document.querySelector(`.weather-card__plus3Hours`).before(buttonMinus3Hours);

	// иконка погоды
	const weatherIcon = document.createElement(`div`);
	weatherIcon.classList.add(`weather-card__icon`);
	document.querySelector(`.weather-card__temperature`).after(weatherIcon);

	// статус погоды
	const cardStatus = document.createElement(`div`);
	cardStatus.classList.add(`weather-card__status`);
	document.querySelector(`.weather-card__icon`).after(cardStatus);

	//заполняем карточку информацией из fetch запроса
	document.querySelector(`.weather-card__city`).textContent = city.city.name;
	document.querySelector(`.weather-card__country`).textContent = city.city.country;
	document.querySelector(`.weather-card__time`).textContent = info.dt_txt;
	document.querySelector(`.weather-card__real-degree`).innerHTML = `${(info.main.temp - 273).toFixed(1)}&deg`;
	document.querySelector(`.weather-card__feels-degree`).innerHTML = `feels like: ${(info.main.feels_like - 273).toFixed(1)}&deg`;
	document.querySelector(`.weather-card__icon`).innerHTML = `<img src='https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png'>`;
	document.querySelector(`.weather-card__status`).textContent = info.weather[0].description;
}

// отображение карточки следующего дня(на основе стилей первой созданной карточки)
//(в аргументе button передаются данные о MouseEvent, на которой была нажата кнопка добавление/вычитание 3-х часов,
// c которой можно будет узнать данные о самой карточке)
function newInfoCard(info, button = false) {
	// будущая карточка с обновленными/новыми данными
	let outputCard;

	// проверка: создание новой карточки или добавление/вычитание 3-х часов
	// если нажата кнопка добвления/вычитания, данные заменяются на новые
	// иначе создается новая карточка
	if (button) {
		// передаем в outputCard класс карточки которую требуется обновить
		outputCard = button.target.parentNode.parentNode.classList[1];
	} else {
		// создание новой карточки след. дня
		let newCardDiv = document.createElement(`div`);
		newCardDiv = document.querySelector(`.weather-card`).cloneNode(true);
		newCardDiv.classList.remove(`new-card-number-0`);
		newCardDiv.classList.add(`new-card-number-${countOfDays}`);
		newCardDiv.dataset.cardNumber = countOfDays;
		newCardDiv.dataset.weatherCounter = newDayNumber;
		if (countOfDays === 1) {
			document.querySelector(`.weather-card`).after(newCardDiv);
		} else {
			document.querySelector(`.new-card-number-${countOfDays - 1}`).after(newCardDiv);
		}
		outputCard = `new-card-number-${countOfDays}`;
	}

	document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__time`).innerHTML = info.dt_txt;
	document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__temperature > .weather-card__real-degree`).innerHTML = `${(info.main.temp - 273).toFixed(1)}&deg`;
	document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__temperature > .weather-card__feels-degree`).innerHTML = `feels like: ${(info.main.feels_like - 273).toFixed(1)}&deg`;
	document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__icon`).innerHTML = `<img src='https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png'>`;
	document.querySelector(`.${outputCard} > .weather-card__info > .weather-card__status`).innerHTML = info.weather[0].description;
}

function displayWeather(data) {
	// общий блок для карточек погоды
	const allCardsBlock = document.querySelector(`.weather-API__cards`);

	// при запросе удаление всех отображаемых карточек погоды
	while (allCardsBlock.firstChild) {
		allCardsBlock.removeChild(allCardsBlock.firstChild);
	}

	// создание стартовой карточки погода
	createFirstCard(data, data.list[0]);

	// добавление карточки с погодой слеюущего дня
	document.querySelector(`.weather-API__addNewDay`).onclick = (event) => {
		// день след. дня
		const day = +data.list[newDayNumber].dt_txt.split(` `, 2)[0].split(`-`)[2];
		// месяц след. дня
		const mounth = +data.list[newDayNumber].dt_txt.split(`-`, 2)[1];
		// год след. дня
		const year = +data.list[newDayNumber].dt_txt.split(`-`, 2)[0];
		// добавляем +1 к счетчику отображаемых карточек(для просмотра доступно всего 4 карточки)
		countOfDays += 1;

		// если кол-во отображаемых карточек не превышает 4, то создаем карточку
		// в ином случае кнопка добавления новой карточки становится не активной 
		if (countOfDays < 4) {
			const nextDayInfo = (data.list).find((item, index) => {
				const newDay = item.dt_txt.split(` `, 2)[0].split(`-`)[2];
				const newMounth = item.dt_txt.split(`-`, 2)[1];
				const newYear = item.dt_txt.split(`-`, 2)[0];

				newDayNumber = index;
				// data.list выдает список погоды с шагом в 3 часа(без разбиения на дни), 
				// поэтому чтобы отобразить погоду именно следующего дня, вводится проверка
				if ((newDay < day && newMounth > mounth) || (newDay > day && newMounth == mounth) || (newYear > year && newMounth < mounth)) {
					return item;
				}
				return null;
			});

			newInfoCard(nextDayInfo);
		} else {
			event.target.disabled = true;
			event.target.style.backgroundColor = `gray`;
			countOfDays = 0;
			newDayNumber = 0;
		}
	};

	// проверям не нажати ли кнопки добавления/вычитания 3-х часов
	document.querySelector(`.weather-API__cards`).onclick = (e) => {
		if (e.target.matches(`button.weather-card__plus3Hours`)) {
			const day = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[0].split(`-`)[2];
			const hour = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[1].split(`:`)[0];
			const nextHourInfo = (data.list).find((item) => {
				if ((+item.dt_txt.split(` `, 2)[1].split(`:`)[0] > hour) && (+item.dt_txt.split(` `, 2)[0].split(`-`)[2] === day)) {
					return item;
				}
				return null;
			});
			if (nextHourInfo === undefined) {
				return 0;
			}
			return newInfoCard(nextHourInfo, e);
		} else if (e.target.matches(`button.weather-card__minus3Hours`)) {
			const day = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[0].split(`-`)[2];
			const hour = +document.querySelector(`.${e.target.parentNode.parentNode.classList[1]} > .weather-card__info > .weather-card__time`).textContent.split(` `, 2)[1].split(`:`)[0];
			const nextHourInfo = (data.list).find((item) => {
				if (((hour - +item.dt_txt.split(` `, 2)[1].split(`:`)[0]) === 3) && (+item.dt_txt.split(` `, 2)[0].split(`-`)[2] === day)) {
					return item;
				}
				return null;
			});

			if (nextHourInfo === undefined) {
				return 0;
			}
			return newInfoCard(nextHourInfo, e);
		}
		return false;
	};
}

// получение данных о погода
function getWeather(e) {
	fetch(`${api.url}forecast?q=${e}&inits=metric&APPID=${api.key}`)
		.then((res) => {
			if (res.status >= 200 && res.status < 300) {
				return res;
			}
			const error = new Error(res.statusText);
			error.response = res;
			throw error;
		})
		.then((data) => { return data.json(); })
		.then(displayWeather)
		.catch((error) => {
			console.log(`Error: ${error.message}`);
			console.log(error.response);
		});
}

// поиск погоды при нажатии на enter(условие: инпут в фокусе)
document.querySelector(`.input`).addEventListener(`keypress`, function (event) {
	return (event.keyCode === 13) ? getWeather(this.value) : null;
});