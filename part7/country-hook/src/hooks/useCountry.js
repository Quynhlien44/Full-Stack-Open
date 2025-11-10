import { useState, useEffect } from 'react'
import axios from 'axios'

const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if (!name) {
            setCountry(null)
            return
        }

        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
            .then(response => {
                setCountry({ data: response.data, found: true })
            })
            .catch(error => {
                setCountry({ found: false })
            })
    }, [name])

    return country
}

export default useCountry
