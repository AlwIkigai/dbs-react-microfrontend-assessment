import '@testing-library/jest-dom/vitest'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { handlers, resetMockDb } from '../mocks/handlers'
import { cleanup } from '@testing-library/react'

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => resetMockDb())
afterEach(() => {
  cleanup() // Remove the app rendered by the finished test.
  server.resetHandlers() // Clear any temporary mock API overrides.
})
afterAll(() => server.close())
