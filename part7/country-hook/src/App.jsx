import React, { useState } from 'react'
import useCountry from './hooks/useCountry'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }
  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  const { name, capital, population, flags } = country.data

  return (
    <div>
      <h1>{name.common}</h1>
      <div>capital {capital[0]}</div>
      <div>population {population}</div>
      <img src={flags.png} alt={`flag of ${name.common}`} height="100" />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      <Country country={country} />
    </div>
  )
}

export default App
