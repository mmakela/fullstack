import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Filter = ({ countryFilter, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={countryFilter.inputString} onChange={handleFilterChange} />
    </div>
  )
}

const SingleCountry = ({ country, weatherInCity }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} alt="flag" height="150" width="200" />
      <h2>Weather in {country.capital}</h2>
      <Weather weatherInCity={weatherInCity} />
    </div>
  )
}

const Weather = ({ weatherInCity }) => {
  if (!weatherInCity.hasResult) {
    return (
      <div>fetching weather data...</div>
    )
  }
  if (weatherInCity.success) {
    return (
      <div>
        <p><b>temperature:</b> {weatherInCity.temperature}</p>
        <img src={weatherInCity.icon} alt="icon" height="50" width="50" />
        <p><b>wind:</b> {weatherInCity.windSpeed} mph direction {weatherInCity.windDirection}</p>
      </div>
    )
  }
  return (
    <div>weather fetch error</div>
  )
}

const CountryList = ({ hits, setCountryFilter }) => {
  const selectCountry = (country) => {
      return () => {
        console.log(country.name)
        setCountryFilter({value: country.name})
      }
  }

  return (
    <div>
      {
        hits.map(hit => 
          <p key={hit.name}>
            {hit.name}
            <button onClick={selectCountry(hit)}>
              show
            </button>
          </p>
        )
      }
    </div>
  )
}

const Countries = ({ countries, countryFilter, setCountryFilter, weatherInCity, setWeatherInCity }) => {
  if (countryFilter.tooManyHits) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if (countryFilter.singleHit) {
    return (
      <SingleCountry country={countryFilter.hits[0]} weatherInCity={weatherInCity} />
    )
  }

  return (
    <CountryList hits={countryFilter.hits} setCountryFilter={setCountryFilter} />
  )
}

const App = (props) => {
  const initialState = {
    inputString: '',
    hits: [],
    tooManyHits: true,
    singleHit: false,
    weatherQuery: ''
  }
  const [ countries, setCountries ] = useState([])
  const [ weatherInCity, setWeatherInCity ] = useState({
    hasResult: false,
    success: false,
    temperature: '',
    icon: '',
    windSpeed: '',
    windDirection: ''
  })

  const reducer = (state, action) => {
    const hits = countries.filter(country => country.name.toLowerCase().includes(action.value.toLowerCase()))
    console.log(action.value)
    const singleHit = hits.length === 1

    return {
      inputString: action.value,
      hits: hits,
      tooManyHits: hits.length > 10,
      singleHit: singleHit,
      weatherQuery: singleHit ? hits[0] : ''
    }
  }

  const [ countryFilter, setCountryFilter ] = useReducer(reducer, initialState)

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then(response => {
      setCountries(response.data)
    })
  }, [])

  useEffect(() => {
    if (countryFilter.weatherQuery === '') {
      return
    }

    const api_key = process.env.REACT_APP_API_KEY
    const params = {
      access_key: api_key,
      query: countryFilter.weatherQuery
    }

    setWeatherInCity({hasResult: false, success: false})
    axios.get('http://api.weatherstack.com/current', {params}).then(response => {
      const current = response.data.current
      const unsuccess = response.data.success === false
      console.log(response)
      console.log(response.data)

      if (!unsuccess) {
        setWeatherInCity({
          hasResult: true,
          success: !unsuccess,
          temperature: current.temperature,
          icon: current.weather_icons[0],
          windSpeed: current.wind_speed,
          windDirection: current.wind_dir
        })
      } else {
        setWeatherInCity({
          hasResult: true,
          success: !unsuccess
        })
      }
    })
  
  }, [countryFilter.weatherQuery])

  return (
    <div>
      <Filter countryFilter={countryFilter} handleFilterChange={(event) => setCountryFilter({value: event.target.value})} />
      <Countries countries={countries} 
        countryFilter={countryFilter} setCountryFilter={setCountryFilter} 
        weatherInCity={weatherInCity} setWeatherInCity={setWeatherInCity} 
      />
    </div>
  ) 
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
