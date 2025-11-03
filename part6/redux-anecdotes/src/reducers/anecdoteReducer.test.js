import { describe, test, expect } from 'vitest'
import { voteAnecdote, addAnecdote } from './anecdoteReducer'

// Test vote action creator
describe('anecdote action creators', () => {
    test('voteAnecdote creates correct action object', () => {
        const action = voteAnecdote('abc123')
        expect(action).toEqual({
            type: 'VOTE',
            payload: { id: 'abc123' },
        })
    })

    test('addAnecdote creates correct action object', () => {
        const content = 'test content'
        const action = addAnecdote(content)
        expect(action.type).toBe('NEW_ANECDOTE')
        expect(action.payload.content).toBe(content)
        expect(action.payload.votes).toBe(0)
        expect(action.payload.id).toBeDefined()
    })
})
