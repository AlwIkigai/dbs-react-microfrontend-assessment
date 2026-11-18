// Imports: tools and types used by this component.
import { useQuery } from '@tanstack/react-query' // Manage API data, caching, loading and errors.
import { apiFetch } from './api/client' // Send requests and return parsed JSON.
// import type { CustomerResponse } from './api/types'
// import type { AccountsResponse, CustomerResponse } from './api/types' // Describe expected response shapes.
// import { formatMoney } from './lib/format' // Format amounts in SGD with two decimal places.
import type { AccountsResponse, CustomerResponse, TransactionsResponse } from './api/types' // Expected API response shapes.
import { formatMoney, formatShortDate } from './lib/format' // Shared SGD and Singapore-date formatters.
// // import type { Health } from './api/types'
import { useState } from 'react' // Store the search text entered by the user.

export default function App() {

  // Step 1: Fetch the customer profile.
  const customer = useQuery({ // Store the query result and request state in customer.
    queryKey: ['customer'], // Identify customer data in the query cache.
    queryFn: () => apiFetch<CustomerResponse>('/api/customer'), // GET the typed customer response.
    retry: false, // Do not automatically retry failed requests.
  })
  // Step 2: Fetch accounts concurrently; keep hooks before conditional returns.
  const accounts = useQuery({ // Store the account query result and request state.
    queryKey: ['accounts'], // Give account data its own cache identity.
    queryFn: () => apiFetch<AccountsResponse>('/api/accounts'), // GET the typed accounts response.
    retry: false, // Do not automatically retry failed requests.
  })
  // Step: Fetch the eight newest transactions alongside customer and accounts.
  const transactions = useQuery({ // Manage transaction data and request state.
    queryKey: ['transactions', { limit: 8 }], // Identify this eight-item list in the cache.
    queryFn: () => apiFetch<TransactionsResponse>('/api/transactions?limit=8'), // API returns newest first.
    retry: false, // Do not automatically retry failures.
  })
  // Step 1: Track the search input.
  const [search, setSearch] = useState('') // Start with an empty search.
  // Step 3: Handle initial loading.
  // if (customer.isPending || accounts.isPending) { // Check whether either query is still pending.
  //   return <p role="status">Loading dashboard…</p> // Show an announced loading message.
  // }
  // Step: Wait for all three requests.
  if (customer.isPending || accounts.isPending || transactions.isPending) {
    return <p role="status">Loading dashboard…</p> // Show loading while any query is pending.
  }



  // Step 4: Handle failed requests.
  // if (customer.isError || accounts.isError) { // Check whether either query failed.
  //   return <p role="alert">We couldn't load your dashboard.</p> // Announce the error.
  // }

  // Step: Handle a failure in any dashboard request.
  // if (customer.isError || accounts.isError || transactions.isError) {
  //   return <p role="alert">We couldn't load your dashboard.</p> // Announce the dashboard error.
  // }
  // Step: Show a dashboard error and let the user retry.
  if (customer.isError || accounts.isError || transactions.isError) {
    return (
      <div role="alert"> {/* Announce the dashboard failure. */}
        <p>We couldn't load your dashboard.</p> {/* Required error message. */}
        <button
          type="button" // Keep this as a regular action button.
          onClick={() => {
            void customer.refetch() // Request customer data again.
            void accounts.refetch() // Request accounts again.
            void transactions.refetch() // Request transactions again.
          }}
        >
          Retry
        </button>
      </div>
    )
  }
  // Step 2: Derive matching transactions from the search text.
  const searchTerm = search.trim().toLowerCase() // Ignore surrounding spaces and letter case.

  const filteredTransactions = transactions.data.transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm) || // Match the description.
      transaction.category.toLowerCase().includes(searchTerm), // Or match the category.
  )
  // Step 5 (D3): Select deposit accounts.
  const depositAccounts = accounts.data.accounts.filter( // Create a filtered account list.
    (account) => account.type !== 'credit', // Keep checking and savings; exclude credit.
  )

  // Step 6 (D3): Calculate the total from fetched data, without extra state.
  const totalAvailable = depositAccounts.reduce( // Combine deposit balances into one number.
    (total, account) => total + account.balance, // Add each balance to the running total.
    0, // Start the running total at zero.
  )
  // Step: Calculate today's remaining transfer allowance.
  const remainingLimit =
    customer.data.customer.dailyTransferLimit - // Total daily allowance.
    customer.data.customer.transferredToday // Amount already transferred today.

  // const health = useQuery({
  //   queryKey: ['health'],
  //   queryFn: () => apiFetch<Health>('/api/health'),
  //   retry: false,
  // })

  // const status = health.isPending
  //   ? 'checking…'
  //   : health.isError
  //     ? 'not connected'
  //     : 'connected'
  return (
    // <main className="starter">
    <main className="dashboard"> {/* Use the dashboard class for styling. */}
      {/* Step 7 (D2): Display the greeting. */}
      <h1>Good evening, {customer.data.customer.firstName}</h1> {/* Read Ava's first name from the response. */}
      {/* Step 8 (D3): Display the deposit total. */}
      <section className="balance-panel" aria-labelledby="total-heading"> {/* Use the heading to name this section for assistive technology. */}
        <h2 id="total-heading">Total available</h2> {/* Identify the total section heading. */}
        {/* <p>{formatMoney(totalAvailable)}</p> Format the calculated total as SGD. */}
        <p className="balance-amount">{formatMoney(totalAvailable)}</p> {/* Apply the large balance styling. */}
        <p>Across {depositAccounts.length} deposit accounts</p> {/* Count the deposit accounts. */}
      </section>
      {/* Step 9 (D4): Display every account, including the credit card. */}
      <section className="accounts-section" aria-labelledby="accounts-heading">
        <h2 id="accounts-heading">Accounts</h2>

        <div className="accounts-grid"> {/* Arrange accounts in responsive columns. */}
          {accounts.data.accounts.map((account) => (
            <article className="account-card" key={account.id}> {/* Style each account as a card. */}
              <h3>{account.name}</h3>
              <p>{account.maskedNumber}</p>
              {account.type === 'credit' && <p>Amount due</p>}
              <p>{formatMoney(account.balance)}</p>
            </article>
          ))}
        </div>
      </section>
      {/* Step: Display recent transactions (D5). */}
      <section className="transactions-panel" aria-labelledby="transactions-heading"> {/* Connect this section to its heading. */}
        <h2 id="transactions-heading">Recent transactions</h2> {/* Required section title. */}
        {/* Step 3: Let the user enter and clear a search. */}
        <label htmlFor="transaction-search">Search transactions</label> {/* Label the input. */}
        <input
          id="transaction-search" // Connect the input to its label.
          type="search" // Use a search input.
          placeholder="Search transactions" // Required placeholder.
          value={search} // Display the current search state.
          onChange={(event) => setSearch(event.target.value)} // Update state as the user types.
        />

        <p role="status">{filteredTransactions.length} results</p> {/* Announce the matching count. */}

        {search.length > 0 && (
          <button type="button" onClick={() => setSearch('')}> {/* Reset the search text. */}
            Clear search
          </button>
        )}

        {filteredTransactions.length === 0 && (
          <p>No transactions match your search.</p> // Display the required no-results message.
        )}


        {filteredTransactions.map((transaction) => (
          <article key={transaction.id}> {/* Give each transaction a stable React identity. */}
            <h3>{transaction.description}</h3> {/* Display the merchant or transfer description. */}
            <p>
              {transaction.category} · {formatShortDate(transaction.date)} {/* Show category and Singapore date. */}
            </p>
            <p style={{ color: transaction.direction === 'in' ? 'var(--positive)' : 'var(--text)' }}>
              {transaction.direction === 'in' ? '+' : '-'} {/* Determine the sign from the direction. */}
              {formatMoney(transaction.amount)} {/* Format the positive API amount as SGD. */}
            </p>
            {transaction.status === 'pending' && <p>Pending</p>} {/* Label pending transactions only. */}
          </article>
        ))}
      </section>
      {/* Step: Display today's remaining transfer limit. */}
      <aside className="limit-panel" aria-labelledby="limit-heading">
        <h2 id="limit-heading">Daily limit</h2> {/* Name this information panel. */}
        <p>{formatMoney(remainingLimit)} remaining today</p> {/* Display the derived allowance. */}
        <p>Resets daily. Applies to all transfers.</p> {/* Explain the limit. */}
      </aside>
    </main>
  )
  //   <div className="starter">
  //     <header className="starter-header">
  //       <strong>Meridian</strong>
  //       <span>Take-home starter</span>
  //     </header>

  //     <main className="starter-main">
  //       <h1>Build the dashboard and transfer flow</h1>
  //       <p>
  //         Start with <code>README.md</code>, then read{' '}
  //         <code>brief/candidate-brief.md</code>. Replace this screen with your
  //         app.
  //       </p>

  //       <p className="status" role="status">
  //         Mock API: {status}
  //       </p>
  //     </main>
  //   </div>
  // )
}
