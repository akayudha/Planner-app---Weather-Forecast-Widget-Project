# Planner app - Weather Forecast Widget Project

> makes its own widget based on the campaign from stackup to complement the existing widget in the planner app

## the reason why this widget was built
The reason is to provide  users with easy access to accurate and up-to-date weather information. The widget serves as a convenient tool for users to quickly check the current weather conditions, forecast, and other related information without having to rely on separate weather apps or websites and also it enhances the overall user experience, saves time, and helps users make informed decisions based on weather conditions.

## My Custom Widget
### Weather Forecast Widget
this code combines geolocation API, asynchronous data fetching, and conditional rendering to provide a custom weather widget that retrieves and displays weather information based on the user's current location
#### Breakdown the code
- at the first line the code imports the necessary modules from the React library (`React`, `useEffect`, `useState`) and the Axios library (`axios`). This allows the code to use React components and hooks.

- at the second line it then defines a functional component called `MyCustomWidget`. Inside the component, there are several `state` variables defined using the useState hook:

`weatherData`: It stores the fetched weather data from the API.
`API_KEY`: It holds the API key required for accessing the weather data.
`latitude` and `longitude`: They store the geolocation coordinates of the user.

The component uses the `useEffect` hook to get the user's geolocation coordinates when the component mounts. It runs only once (as the dependency array `[]` is empty). If the `navigator.geolocation` object is available in the browser, it calls the `getCurrentPosition` method to get the current position of the user. The success callback receives the `position` object with coordinates, and it sets the `latitude` and `longitude` state variables accordingly. In case of an error, the error callback is triggered, and the error is logged to the console.

Another `useEffect` hook is used to fetch weather data when the `latitude` and `longitude` state variables change. The effect runs whenever `latitude` or `longitude` changes. If both `latitude` and `longitude` are available (i.e., not null), it calls the `fetchWeatherData` function to fetch weather data from the API.

The `fetchWeatherData` function is an asynchronous function that uses `axios.get` to make an HTTP GET request to the OpenWeatherMap API. It constructs the API URL using the `latitude`, `longitude`, `API_KEY`, and `units=metric` query parameter. It then awaits the response from the API. If the request is successful, the response data is extracted from `response.data` and set in the `weatherData` state variable using `setWeatherData`. If an error occurs during the API request, it is caught in the `catch` block, and the error is logged to the console.

The component checks if `weatherData` is null. If it is, it means that the weather data is still being fetched, so it returns a loading message

If `weatherData` is available, the component destructure the necessary properties from the `weatherData` object, including `name`, `main`, and `weather`. It also calls the `getTimeOfDay` function to determine the time of day based on the current hour. Then, it calls the `getWeatherIcon` function, passing the weather condition (`weather[0].main`) and the time of day, to get the appropriate weather icon.
The component renders a weather widget using the fetched weather data and the determined time of day and weather icon. It consists of a container div with a `container-weather` class, inside which there is a `widget` div. The widget is divided into three sections:
 The `left` section contains an `<img>` tag displaying the weather icon (retrieved from `weatherIcon`), and an `<h5>` tag displaying the weather description (`weather[0].description`).
 The `right` section contains an `<h5>` tag displaying the city name (`name`), and an `<h5>` tag displaying the temperature (`Math.round(main.temp)`).
 The `bottom` section contains three `<div>` elements displaying additional weather information: wind speed, cloud cover, and pressure. The values are extracted from the `weatherData` object.

- at the third line the function `getTimeOfDay` is determines the time of day based on the current hour obtained using `new Date().getHours()`. If the current hour is between 6 and 18, it returns "morning", otherwise "night".
- at the fourth line the function `getWeatherIcon`takes the weather condition and time of day as arguments and returns the appropriate weather icon path based on the conditions. It uses nested `if-else` statements to select the correct icon image file path. For example, if it is "morning" and the weather condition is "Clear," it returns the path to a sunny morning icon image. Similarly, it checks for other weather conditions and time of day combinations to select the corresponding weather icon.

Next the code  update the state and import the widgets into WidgetGalleryModal.js. The object has two properties: `component` and `name`. The `component` property is assigned the JSX expression `<MyCustomWidget />`, which is a custom widget component imported from the ``../widgets/MyCustomWidget` file. The `name` property is set to the string "Weather".

Next the code also update the state and import the widget into app.js. The object has four properties: `id`, `component`, `area`, and `name`.

The id property is set to the result of `new Date().getTime() + 3`, which generates a unique identifier for the widget by adding the current timestamp (in milliseconds) to the number 3.

The `component` property is assigned the JSX expression `<MyCustomWidget />`, which is a custom widget component imported from the `'./widgets/MyCustomWidget'` file.

The `area` property is set to the string `'main-widget'`, which indicates the area where the widget should be placed.

The `name` property is set to the string `'weather'`, which represents the name or type of the widget.


```MyCustomWidget code
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
```

```WidgetGalleryModal code
import MyCustomWidget from '../widgets/MyCustomWidget'

export default function WidgetGalleryModal({ setShowWidgetModal, selectedWidgetArea, widgets, setWidgets }) {
    const [galleryWidgets, setGalleryWidgets] = useState([
        
        { component: <MyCustomWidget />, name: "Weather" },
    ])
    return (
        <div>
       
        </div>
    )
}
```

```App.js code
import MyCustomWidget from './widgets/MyCustomWidget'

function App() {
    const [widgets, setWidgets] = useState([
     { id: new Date().getTime() + 3, component: <MyCustomWidget />, area: 'main-widget', name: "weather" },
    ]);
    return (
        <div>
       
        </div>
    )
}
```


## Summary how the weather widget work
The weather widget is a React component that displays weather information based on the user's geolocation coordinates.
here how the widget works:

The weather widget is a React component that displays weather information based on the user's geolocation coordinates. Here's a summary of how the widget works:

1. The widget starts by accessing the user's geolocation coordinates using the browser's navigator.geolocation API. It retrieves the latitude and longitude coordinates and stores them in the state variables latitude and longitude.

2. Once the coordinates are available, the widget makes an API request to the OpenWeatherMap API using the axios library. It constructs the API request URL with the latitude, longitude, API key, and desired units. The API response, containing weather data, is stored in the weatherData state variable.

3. While the weather data is being fetched, a loading message is displayed to indicate that the widget is retrieving the information.

4. Once the weather data is available, the widget extracts relevant information such as the city name (name), current temperature (main.temp), weather description (weather[0].description), wind speed (weatherData.wind.speed), cloud cover (weatherData.clouds.all), and pressure (weatherData.main.pressure).

5. The widget determines the time of day based on the current hour using the getTimeOfDay function. It then selects the appropriate weather icon based on the weather condition (weather[0].main) and the time of day using the getWeatherIcon function.

6. Finally, the widget renders the weather information in a visually pleasing format. It displays the weather icon, description, city name, temperature, wind speed, cloud cover, and pressure.

In summary, the weather widget utilizes geolocation to fetch weather data from the OpenWeatherMap API based on the user's coordinates. It dynamically displays the weather information and provides a visually appealing representation of the current weather conditions.


## Thank You 🚀🚀