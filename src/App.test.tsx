import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { render, screen, waitFor } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event' // Simulate user interactions.
import { http, HttpResponse } from 'msw' // Override an API response for this test.
import { server } from './test/setup' // Access the test mock server.
import App from './App'

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

describe('dashboard', () => {
  it('displays the customer greeting', async () => {
    renderApp()

    expect(
      await screen.findByRole('heading', {
        name: 'Good evening, Ava',
      }),
    ).toBeInTheDocument()
  })
  // Step: Verify dashboard failure and successful recovery (D7/E4).
it('loads the dashboard after retrying a failed request', async () => {
  const user = userEvent.setup() // Prepare simulated user interactions.

  server.use(
    http.get(
      '*/api/accounts', // Intercept the accounts request.
      () =>
        HttpResponse.json(
          { error: { code: 'INTERNAL_ERROR', message: 'Down' } },
          { status: 500 }, // Fail this request.
        ),
      { once: true }, // Fail once; subsequent requests use the normal handler.
    ),
  )

  renderApp() // Render with the test Query provider.

  expect(
    await screen.findByRole('alert'), // Wait for the failed dashboard state.
  ).toHaveTextContent("We couldn't load your dashboard.")

  await user.click(
    screen.getByRole('button', { name: 'Retry' }), // Retry through the UI.
  )

  expect(
    await screen.findByRole('heading', { name: 'Good evening, Ava' }),
  ).toBeInTheDocument() // Confirm the dashboard recovered.

  expect(
    screen.getByRole('heading', { name: 'Everyday Checking' }),
  ).toBeInTheDocument() // Confirm account data is displayed.
})
})

// // describe('starter', () => {
// //   it('reaches the mock API', async () => {
// //     renderApp()

// //     const status = screen.getByRole('status')
// //     await waitFor(
// //       () => expect(status).toHaveTextContent('Mock API: connected'),
// //       { timeout: 3000 },
// //     )
//   })
// })
