import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_KEY

    useEffect(() => {
        if (!capital) return
        // Hanoi -> "Hanoi", Espoo -> "Espoo"
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
        axios.get(url).then(response => {
            setWeather(response.data)
        })
    }, [capital, api_key])

    if (!weather)
        return <div>Loading weather...</div>

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <div>Temperature {weather.main.temp} Celsius</div>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            <div>Wind {weather.wind.speed} m/s</div>
        </div>
    )
}

export default Weather
