const apiKey = '4640dcfa375db2a98cdbdf90a16d6b7e';
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const weatherData = document.getElementById('weather-data');

function getWeatherData(city = '') {
  let currentWeatherUrl;
  let forecastUrl;

  if (city) {
    currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  } else {
    getLocation();
    return;
  }

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      const { name, main, weather } = data;
      const { temp, humidity } = main;
      const { description, icon } = weather[0];

      // Set background based on weather conditions
      const body = document.querySelector('body');

      const currentWeatherHtml = `
        <h2>${name}</h2>
        <p>${description}</p>
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
      `;

      weatherData.innerHTML = currentWeatherHtml;
    })
    .catch(error => {
      console.error('Error:', error);
      weatherData.innerHTML = '<p>Sorry, we could not retrieve the weather data for that city. Please try again.</p>';
    });

  // Fetch forecast data
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastList = data.list;

      // Filter the forecast data to only include data for 12:00 PM (noon) each day
      const dailyForecastList = forecastList.filter(forecast => forecast.dt_txt.includes('12:00:00'));

      const forecastHtml = `
        <h3>5-Day Forecast:</h3>
        <ul>
          ${dailyForecastList.map(forecast => {
            const { dt_txt, main, weather } = forecast;
            const { temp_min, temp_max } = main;
            const { description, icon } = weather[0];

            return `
              <li>
                <p>${new Date(dt_txt).toLocaleDateString()}</p>
                <p>${description}</p>
                <p>Temperature Range: ${temp_min}°C - ${temp_max}°C</p>
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
              </li>
            `;
          }).join('')}
        </ul>
      `;

      weatherData.insertAdjacentHTML('beforeend', forecastHtml);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

getWeatherData ( 'Bucharest');
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const geolocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${'4640dcfa375db2a98cdbdf90a16d6b7e'}&units=metric`;
      fetch(geolocationUrl)
        .then(response => response.json())
        .then(data => {
          const { name } = data;
          getWeatherData(name);
        })
        .catch(error => {
          console.error('Error:', error);
          weatherData.innerHTML = '<p>Sorry, we could not retrieve the weather data for your location. Please try again.</p>';
        });
    });
  } else {
    weatherData.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
  }
}

// Call getLocation function to get weather data for user's current location
getLocation();


searchButton.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

function searchEnterKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
}