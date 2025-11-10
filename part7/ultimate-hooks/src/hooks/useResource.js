import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    useEffect(() => {
        axios.get(baseUrl).then(response => setResources(response.data))
    }, [baseUrl])

    const create = (resource) => {
        axios.post(baseUrl, resource)
            .then(response => {
                setResources(resources.concat(response.data))
            })
    }

    return [resources, { create }]
}

export default useResource
