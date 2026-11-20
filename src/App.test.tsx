import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { render, screen, waitFor } from '@testing-library/react'
// import { render, screen } from '@testing-library/react'
// import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event' // Simulate user interactions.
import { http, HttpResponse } from 'msw' // Override an API response for this test.
import { server } from './test/setup' // Access the test mock server.
import { render, screen, within } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { formatMoney } from './lib/format'
import App from './App'

// Step: Supply native dialog methods missing from the jsdom test environment.
// Real keyboard/focus behaviour must still be checked in a browser.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '') // Make the dialog visible to test queries.
    },
  })

  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open') // Simulate closing the dialog.
    },
  })
})
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
  // Step: Prove an invalid transfer is blocked before reaching the API.
  it('rejects an over-balance amount without sending a transfer', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch') // Observe real requests without replacing responses.

    renderApp()

    await user.click(
      await screen.findByRole('button', { name: 'New transfer' }),
    )

    const dialog = within(screen.getByRole('dialog', { name: 'New transfer' }))

    await user.click(
      await dialog.findByRole('radio', { name: /Jamie Tan/ }),
    )
    await user.click(dialog.getByRole('button', { name: 'Continue' }))

    await user.type(dialog.getByLabelText('Amount (SGD)'), '4500')
    await user.tab() // Trigger blur validation before pressing Continue.

    const amountError = await dialog.findByRole('alert') // Wait for the field error.
    expect(amountError.textContent).toBe(
      `Amount can't be more than your available balance (${formatMoney(4280.55)}).`,
    ) // Preserve Intl's non-breaking space when comparing money.

    await user.click(dialog.getByRole('button', { name: 'Continue' }))

    expect(
      dialog.getByRole('heading', { name: 'How much?' }),
    ).toBeInTheDocument() // Invalid data must not advance to Review.

    expect(fetchSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('/api/transfers'),
      expect.objectContaining({ method: 'POST' }),
    ) // No transfer request was sent.
  })
  it('shows why the API rejected a saved recipient', async () => {
    const user = userEvent.setup()

    // Simulate the bank rejecting the selected payee for this test.
    server.use(
      http.post('*/api/transfers', () =>
        HttpResponse.json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Transfer validation failed.',
            fields: { payeeId: 'This saved recipient is no longer available.' },
          },
        }, { status: 400 }),
      ),
    )

    renderApp()
    await user.click(await screen.findByRole('button', { name: 'New transfer' }))
    const dialog = within(screen.getByRole('dialog', { name: 'New transfer' }))

    await user.click(await dialog.findByRole('radio', { name: /Jamie Tan/ }))
    await user.click(dialog.getByRole('button', { name: 'Continue' }))
    await user.click(dialog.getByRole('button', { name: '50' }))
    await user.click(dialog.getByRole('button', { name: 'Continue' }))
    await user.click(dialog.getByRole('button', { name: 'Confirm transfer' }))

    // The user stays on Review and sees the API's specific reason.
    expect(await dialog.findByRole('alert'))
      .toHaveTextContent('This saved recipient is no longer available.')
    expect(dialog.getByRole('heading', { name: 'Check the details' }))
      .toBeInTheDocument()
  })
  it('shows transfer success and refreshes the dashboard', async () => {
    const user = userEvent.setup()
    renderApp()

    const openTransfer = await screen.findByRole('button', { name: 'New transfer' })
    const total = within(screen.getByRole('region', { name: 'Total available' }))
    const transactions = within(
      screen.getByRole('region', { name: 'Recent transactions' }),
    )

    expect(total.getByText((_, element) =>
      element?.textContent === formatMoney(17120.55),
    )).toBeInTheDocument()
    expect(transactions.queryByRole('heading', { name: 'Transfer to Jamie Tan' }))
      .not.toBeInTheDocument()

    await user.click(openTransfer)
    const dialog = within(screen.getByRole('dialog', { name: 'New transfer' }))

    await user.click(await dialog.findByRole('radio', { name: /Jamie Tan/ }))
    await user.click(dialog.getByRole('button', { name: 'Continue' }))
    await user.click(dialog.getByRole('button', { name: '50' })) // Use the quick amount.
    await user.click(dialog.getByRole('button', { name: 'Continue' }))
    await user.click(dialog.getByRole('button', { name: 'Confirm transfer' }))

    expect(await dialog.findByRole('heading', { name: 'Transfer sent' }))
      .toBeInTheDocument() // Wait for the mock API to confirm success.
    expect(dialog.getByText(/^Reference: TRF-/)).toBeInTheDocument()
    await user.click(dialog.getByRole('button', { name: 'Back to dashboard' }))

    expect(await total.findByText((_, element) =>
      element?.textContent === formatMoney(17070.55),
    )).toBeInTheDocument()
    expect(await transactions.findByRole('heading', { name: 'Transfer to Jamie Tan' }))
      .toBeInTheDocument()
    expect(await screen.findByText((_, element) =>
      element?.textContent === `${formatMoney(4950)} remaining today`,
    )).toBeInTheDocument()
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
