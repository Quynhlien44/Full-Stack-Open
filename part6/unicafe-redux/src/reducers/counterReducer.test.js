import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

describe('unicafe reducer', () => {
  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})

test('increments ok count', () => {
  const action = { type: 'OK' }
  const state = initialState
  deepFreeze(state)
  const newState = counterReducer(state, action)
  expect(newState).toEqual({
    good: 0,
    ok: 1,
    bad: 0
  })
})

test('resets state', () => {
  const action = { type: 'RESET' }
  const state = { good: 10, ok: 5, bad: 3 }
  deepFreeze(state)
  const newState = counterReducer(state, action)
  expect(newState).toEqual(initialState)
})
