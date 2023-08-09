
//  || TOGGLE HAMBURGER BAR
const hamburger = document.querySelector('.hamburger');
const slidebar = document.querySelector('.slidebar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    slidebar.classList.toggle('active');
})

// || copyrights
const copyright = document.getElementById('copyright');
copyright.innerHTML = new Date().getFullYear();


// || MAIN WEATHER FUNCTIONALITY

// Navigation
var city = document.getElementById('city');
var country = document.getElementById('country');
var searchCity = document.getElementById('search');

// box-1
var cityTemp = document.getElementById('temp');
var weatherIcon = document.getElementById('weather-icon');
var weatherDescription = document.getElementById('description');
var weatherPressure = document.getElementById('pressure');
var weatherVisibilty = document.getElementById('visibility');
var weatherHumidity = document.getElementById('humidity');

// box-2
var sunriseTime = document.getElementById('sunrise-time');
var sunsetTime = document.getElementById('sunset-time');
var uviRays = document.getElementById('uvi-rays');
var uviConcernLevel = document.querySelector('.uvi-level');
var uviConcernLevel2 = document.querySelector('.uvi-level2');

// Hours report
var hoursIcon = document.querySelectorAll('.hourly-icon');
var hoursTemp = document.querySelectorAll('.hours-temp');

// Days temperature
var daysIcon = document.querySelectorAll('.days-icon');
var nextDay = document.querySelectorAll('.prediction-day');
var predictionDesc = document.querySelectorAll('.prediction-desc');
var daysTemp = document.querySelectorAll('.days-temp');

// Time and dates 
var currentTime = document.querySelector('.time');
var currentDate = document.querySelector('.date')
var aqi = document.querySelector('.aqi');

// || GLOBAL VARIABLES
var weatherApi;
var responseData;
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// || FUNCTION FOR GET WEATHER REPORT
async function weatherReport(searchCity) {

    weatherApi = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=da2103b2c4ce4f95af051626232503&q=${searchCity}&days=7&aqi=yes&alerts=no`);
    responseData = await weatherApi.json();

    todayWeatherReport();
    console.log(responseData);

    // Hours
    hoursWeatherReport();
    // Days
    forecastdayReport()
}

// || By default city
weatherReport('New Delhi');


function todayWeatherReport() {
    city.innerHTML = responseData.location.name;
    country.innerHTML = ' <i class="fa-sharp fa-solid fa-location-dot"></i>' + responseData.location.country;

    // Box-1
    cityTemp.innerHTML = responseData.current.temp_c;
    weatherDescription.innerHTML = responseData.current.condition.text;
    weatherIcon.setAttribute('src', responseData.current.condition.icon);
    weatherPressure.innerHTML = responseData.current.pressure_mb + 'mb'
    weatherVisibilty.innerHTML = responseData.current.vis_km + ' km'
    weatherHumidity.innerHTML = responseData.current.humidity + '%'

    // Box-2
    sunriseTime.innerHTML = responseData.forecast.forecastday[0].astro.sunrise;
    sunsetTime.innerHTML = responseData.forecast.forecastday[0].astro.sunset;
    uviRays.innerHTML = responseData.current.uv + ' UVI';
    aqi.innerHTML = Math.round(responseData.current.air_quality.pm2_5)

    checkUVraysIndex();
    time()
}


// || Functions for do some task
function checkUVraysIndex() {

    let uviLevel = Number.parseInt(uviRays.textContent);
    if (uviLevel <= 2) {
        checkUviValue('Good', '#6ae17c');
    }
    else if (uviLevel <= 5) {
        checkUviValue('Moderate', '#CCE16A');
    }
    else if (uviLevel <= 7) {
        checkUviValue('High', '#d4b814');
    }
    else if (uviLevel <= 10) {
        checkUviValue('Very high', '#d43114');
    }
    else {
        checkUviValue('Etreme high', '#dc15cf');
    }

}

function checkUviValue(level, color) {

    uviConcernLevel.innerHTML = level;
    uviConcernLevel.style.backgroundColor = color;
    uviConcernLevel2.innerHTML = level;

}


// || Hours 
function hoursWeatherReport() {

    hoursTemp.forEach((t, i) => {
        t.innerHTML = responseData.forecast.forecastday[0].hour[i].temp_c;
    })

    hoursIcon.forEach((t, i) => {
        t.src = responseData.forecast.forecastday[0].hour[i].condition.icon;
    })
}

// Days
function forecastdayReport() {

    daysIcon.forEach((icon, index) => {
        icon.src = responseData.forecast.forecastday[index].day.condition.icon
    })

    daysTemp.forEach((temp, index) => {
        temp.innerHTML = Math.round(responseData.forecast.forecastday[index].day.maxtemp_c) + '°c' + `<span> / </span>` + Math.round(responseData.forecast.forecastday[index].day.mintemp_c) + '°c';

    })

    predictionDesc.forEach((d, index) => {
        d.innerHTML = responseData.forecast.forecastday[index].day.condition.text;
    })

    nextDay.forEach((day, index) => {
        let weekdate = new Date(responseData.forecast.forecastday[index].date).getDate();
        let weekday = weekDays[new Date(responseData.forecast.forecastday[index].date).getDay()];

        day.innerHTML = `${weekday} ${weekdate}`
        
    })
}

function time() {
    var timezone = responseData.location?.tz_id;;
    var now = new Date().toLocaleTimeString('en-US', { timeZone: timezone });
    currentTime.innerHTML = now;

    var today = new Date(responseData.forecast.forecastday[0].date);
    currentDate.innerHTML = `${today.getDate()} ${monthName[today.getMonth()]} ${today.getFullYear()}, ${weekDays[today.getDay()]}`

}

setInterval(() => {
    time();
}, 1000)


searchCity.addEventListener('keydown', () => {
    weatherReport(searchCity.value)
})



