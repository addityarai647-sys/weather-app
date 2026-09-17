const weatherIcon = document.getElementById("weatherIcon");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");


// ===============================
// Weather Condition
// ===============================

function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    } 
    else if (code === 1 || code === 2) {
        return "🌤️ Partly Cloudy";
    } 
    else if (code === 3) {
        return "☁️ Cloudy";
    } 
    else if (code >= 51 && code <= 57) {
        return "🌦️ Drizzle";
    } 
    else if (code >= 61 && code <= 67) {
        return "🌧️ Rain";
    } 
    else if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    } 
    else if (code >= 80 && code <= 82) {
        return "🌧️ Rain Showers";
    } 
    else if (code >= 95 && code <= 99) {
        return "⛈️ Thunderstorm";
    } 
    else {
        return "🌡️ Unknown Weather";
    }
}


// ===============================
// Weather Icon
// ===============================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }
    else if (code === 1 || code === 2) {
        return "🌤️";
    }
    else if (code === 3) {
        return "☁️";
    }
    else if (code >= 51 && code <= 57) {
        return "🌦️";
    }
    else if (code >= 61 && code <= 67) {
        return "🌧️";
    }
    else if (code >= 71 && code <= 77) {
        return "❄️";
    }
    else if (code >= 80 && code <= 82) {
        return "🌧️";
    }
    else if (code >= 95 && code <= 99) {
        return "⛈️";
    }
    else {
        return "🌡️";
    }
}


// ===============================
// Search Weather
// ===============================

searchBtn.addEventListener("click", async function () {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    loading.style.display = "block";

    try {

        // City location find
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            loading.style.display = "none";
            alert("City not found!");
            return;
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const weatherData = await weatherResponse.json();


        // Show weather
        const countryCode = location.country_code.toUpperCase();

const flag = countryCode
    .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
    );

cityName.textContent = `${location.name}, ${flag} ${location.country}`;

        temperature.textContent =
    Math.round(weatherData.current.temperature_2m) + "°C";

        humidity.textContent =
            weatherData.current.relative_humidity_2m + "%";

        wind.textContent =
            weatherData.current.wind_speed_10m + " km/h";

        condition.textContent =
            getWeatherCondition(weatherData.current.weather_code);

        weatherIcon.textContent =
            getWeatherIcon(weatherData.current.weather_code);

        weatherCard.style.display = "block";

        loading.style.display = "none";


    } catch (error) {

        console.log(error);

        loading.style.display = "none";

        alert("Something went wrong!");

    }

});


// ===============================
// Enter Key
// ===============================

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// ===============================
// My Location
// ===============================

locationBtn.addEventListener("click", function () {

    loading.style.display = "block";

    if (!navigator.geolocation) {

        loading.style.display = "none";

        alert("Geolocation is not supported by your browser.");

        return;
    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);


            try {

                // Current location weather
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
                );

                const weatherData = await weatherResponse.json();


                // Show weather
                cityName.textContent = "My Location";

                temperature.textContent =
                    Math.round(weatherData.current.temperature_2m) + "°C";

                humidity.textContent =
                    weatherData.current.relative_humidity_2m + "%";

                wind.textContent =
                    weatherData.current.wind_speed_10m + " km/h";

                condition.textContent =
                    getWeatherCondition(weatherData.current.weather_code);

                weatherIcon.textContent =
                    getWeatherIcon(weatherData.current.weather_code);

                weatherCard.style.display = "block";

                loading.style.display = "none";


            } catch (error) {

                console.log(error);

                loading.style.display = "none";

                alert("Weather data load nahi ho raha.");

            }

        },


        function (error) {

            console.log(error);

            loading.style.display = "none";

            alert("Location access nahi mil raha.");

        }

    );

});