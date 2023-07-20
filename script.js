var searchForm = document.getElementById('search-form');
var cityInput = document.getElementById('city-input');
var currentWeatherDiv = document.getElementById('current-weather');
var forecastDiv = document.getElementById('forecast');
var searchHistoryDiv = document.getElementById('search-history');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city === '') return;

  getWeatherData(city)
    .then((data) => {
      displayCurrentWeather(data.current);
      displayForecast(data.forecast);
      addCityToSearchHistory(city);
    })
    .catch((error) => {
      console.error(error);
      alert('The name of the city is wrong.');
    });
});

function getWeatherData(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${"43b8500afdb276f5956faf7df976b5bf"}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then((data) => {
      var current = data.list[0];
      var forecast = data.list.slice(1, 6); 
      return { current, forecast };
    });
}

function displayCurrentWeather(current) {
    var city = current.name;
    var date = new Date(current.dt * 1000).toLocaleDateString();
    var iconUrl = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;
    var temperature = (current.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
    var humidity = current.main.humidity;
    var windSpeed = current.wind.speed;
  
    var html = `
      <h2>Current Weather is:</h2>
      <p>Date: ${date}</p>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>`;
    currentWeatherDiv.innerHTML = html;
  }
  function displayForecast(forecast) {
    var forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
  
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight to compare only the dates
  
    forecast.forEach((day) => {
      var date = new Date(day.dt * 1000);
      date.setHours(0, 0, 0, 0); // Set time to midnight to compare only the dates
  
      if (date >= currentDate) {
        var dayName = getDayName(date.getDay());
        var iconUrl = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
        var temperature = (day.main.temp - 273.15).toFixed(2);
        var humidity = day.main.humidity;
        var windSpeed = day.wind.speed;
  
        var forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
  
        forecastItem.innerHTML = `
          <p>${dayName}</p>
          <img src="${iconUrl}" alt="Weather Icon">
          <p>Temperature: ${temperature}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;
  
        forecastContainer.appendChild(forecastItem);
      }
    });
  }
  
  function getDayName(dayIndex) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

function displayWeatherData(cityName) {
    getWeatherData(cityName)
      .then((data) => {
        displayCurrentWeather(data.current);
        displayForecast(data.forecast);
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred while fetching data. Please try again later.');
      });
  }
  
  function addCityToSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
    if (!searchHistory.includes(cityName)) {
      searchHistory.push(cityName);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }
  
  function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    var searchHistoryDiv = document.getElementById('search-history');
  
    searchHistoryDiv.innerHTML = '';
    searchHistory.forEach((cityName) => {
      var searchHistoryItem = document.createElement('p');
      searchHistoryItem.textContent = cityName;
  
      // Fetch weather data for the city to get the emoji and temperature
      getWeatherData(cityName)
        .then((data) => {
          var icon = data.current.weather[0].icon;
          var temperature = (data.current.main.temp - 273.15).toFixed(2);
  
          // Add emoji and temperature to the city name
          searchHistoryItem.textContent = `${cityName} ${getEmoji(icon)} ${temperature}°C`;
        })
        .catch((error) => {
          console.error(error);
          // If there's an error fetching weather data, still display the city name without emoji and temperature
          searchHistoryItem.textContent = cityName;
        });
  
      // Add a click event listener to fetch weather data for the clicked city
      searchHistoryItem.addEventListener('click', function () {
        cityInput.value = cityName;
        searchForm.dispatchEvent(new Event('submit'));
      });
  
      searchHistoryDiv.appendChild(searchHistoryItem);
    });
  }
  
  function getEmoji(icon) {
   
    const emojiMap = {
      '01d': '☀️', // clear sky (day)
      '01n': '🌙', // clear sky (night)
      '02d': '⛅️', // few clouds (day)
      '02n': '☁️', // few clouds (night)
      '03d': '☁️', // scattered clouds (day)
      '03n': '☁️', // scattered clouds (night)
      '04d': '☁️', // broken clouds (day)
      '04n': '☁️', // broken clouds (night)
      '09d': '🌧', // shower rain (day)
      '09n': '🌧', // shower rain (night)
      '10d': '🌦', // rain (day)
      '10n': '🌦', // rain (night)
      '11d': '⛈', // thunderstorm (day)
      '11n': '⛈', // thunderstorm (night)
      '13d': '🌨', // snow (day)
      '13n': '🌨', // snow (night)
      '50d': '🌫', // mist (day)
      '50n': '🌫', // mist (night)
    };

    return emojiMap[icon] || '';
  }
  
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (city === '') return;
  
    displayWeatherData(city);
    addCityToSearchHistory(city);
    displaySearchHistory();
  });
  displaySearchHistory();
  
