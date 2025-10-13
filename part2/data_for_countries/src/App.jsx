import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './components/Weather'

const CountryList = ({ countries, onShow, showCountry }) => {
  if (showCountry) {
    const country = countries.find(c => c.name.common === showCountry)
    if (!country) return null
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>Capital: {country.capital?.join(', ')}</div>
        <div>Area: {country.area}</div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages || {}).map(l => <li key={l}>{l}</li>)}
        </ul>
        <img src={country.flags.png} alt="flag" width="100" />
        <Weather capital={country.capital?.[0]} />
        <div>
          <button onClick={() => onShow(null)}>Back</button>
        </div>
      </div>
    )
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter.</div>
  }
  if (countries.length > 1) {
    return (
      <div>
        {countries.map(c =>
          <div key={c.cca2}>
            {c.name.common}
            <button onClick={() => onShow(c.name.common)}>Show</button>
          </div>
        )}
      </div>
    )
  }
  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>Capital: {country.capital?.join(', ')}</div>
        <div>Area: {country.area}</div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages || {}).map(l => <li key={l}>{l}</li>)}
        </ul>
        <img src={country.flags.png} alt="flag" width="100" />
        <Weather capital={country.capital?.[0]} />
      </div>
    )
  }
  return <div>No matches</div>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])
  const [showCountry, setShowCountry] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  useEffect(() => {
    if (search.length === 0) {
      setFiltered([])
      return
    }
    setFiltered(
      countries.filter(c =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, countries])

  useEffect(() => {
    setShowCountry(null)
  }, [search])

  return (
    <div>
      <div>
        Find countries: <input value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <CountryList
        countries={filtered}
        onShow={setShowCountry}
        showCountry={showCountry}
      />
    </div>
  )
}

export default App
