import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Custom weather widget component
export default function MyCustomWidget() {
  const [weatherData, setWeatherData] = useState(null); // State variable to store weather data
  const API_KEY = 'e3e5cb5602fbfe80658d37e372ff528c'; // API key for weather data access
  const [latitude, setLatitude] = useState(null); // State variable to store latitude coordinate
  const [longitude, setLongitude] = useState(null); // State variable to store longitude coordinate

  useEffect(() => {
    // Get user's geolocation coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude); // Set latitude coordinate
          setLongitude(position.coords.longitude); // set longitude coordinate
        },
        (error) => {
          console.log(error);// Log any error that occurs while getting geolocation
        }
      );
    }
  }, []);

  useEffect(() => {
     // Fetch weather data when latitude and longitude are available
    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);
  
  // Fetch weather data from the OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);// Set the fetched weather data
    } catch (error) {
      console.log(error);// Log any error that occurs during the weather data fetch
    }
  };

  if (!weatherData) {
    return <div>Loading weather data...</div>; // Display loading message until weather data is available
  }

  const { name, main, weather } = weatherData;// Destructure weather data
  const timeOfDay = getTimeOfDay();// Determine the time of day
  const weatherIcon = getWeatherIcon(weather[0].main, timeOfDay);// Get the appropriate weather icon

  return (
    <div className="container-weather">
      <div className="widget">
        <div className="left">
          <img src={weatherIcon} className="icon" alt="Weather Icon" />
          <h5 className="weather-status">{weather[0].description}</h5>
        </div>
        <div className="right">
          <h5 className="city">{name}</h5>
          <h5 className="degree">{Math.round(main.temp)}&#176;c</h5>
        </div>
        <div className="bottom">
          <div>
            Wind Speed <span>{Math.round(weatherData.wind.speed)} kmph</span>
          </div>
          <div>
            Cloud Cover <span>{weatherData.clouds.all}%</span>
          </div>
          <div>
            Pressure <span>{weatherData.main.pressure} mb</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to determine the time of day based on the current hour
function getTimeOfDay() {
  const currentHour = new Date().getHours();

  if (currentHour >= 6 && currentHour < 18) {
    return 'morning';
  } else {
    return 'night';
  }
}

// Function to get the appropriate weather icon based on weather condition and time of day
function getWeatherIcon(weatherCondition, timeOfDay) {
  if (timeOfDay === 'morning') {
    if (weatherCondition === 'Clear') {
      return 'images/sunny-morning.svg';
    } else if (weatherCondition === 'Clouds') {
      return 'images/cloudy-morning.svg';
    } else if (weatherCondition === 'Rain') {
      return 'images/rainy-morning.svg';
    }
  } else if (timeOfDay === 'night') {
    if (weatherCondition === 'Clear') {
      return 'images/clear-night.svg';
    } else if (weatherCondition === 'Clouds') {
      return 'images/cloudy-night.svg';
    } else if (weatherCondition === 'Rain') {
      return 'images/rainy-night.svg';
    }
  }
}