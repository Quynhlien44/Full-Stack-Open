import React from 'react'
import { useDispatch } from 'react-redux'
import { changeFilter } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        dispatch(changeFilter(event.target.value))
    }

    return (
        <div>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter
