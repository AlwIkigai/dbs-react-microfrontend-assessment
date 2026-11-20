// Step: Reserve space for the dashboard while API requests load.
export default function DashboardSkeleton() {
    return (
        <main className="dashboard" aria-busy="true" aria-label="Loading dashboard">
            {/* <p role="status">Loading dashboard…</p> Announce loading once. */}
            <p className="dashboard-loading-status" role="status">
                Loading dashboard…
            </p> {/* Announce loading without taking up a grid row. */}

            <h1 className="skeleton skeleton-greeting" aria-hidden="true">
                Good evening, Ava
            </h1> {/* Reserve the same height as the loaded greeting. */}
            <div className="skeleton new-transfer-button" aria-hidden="true" />
            {/* Reserve the transfer button position. */}
            <section className="balance-panel" aria-hidden="true">
                <div className="skeleton skeleton-heading" /> {/* Placeholder for the heading. */}
                <div className="skeleton skeleton-balance" /> {/* Placeholder for the total. */}
                <div className="skeleton skeleton-line" /> {/* Placeholder for the caption. */}
            </section>

            <section className="accounts-section" aria-hidden="true">
                <div className="skeleton skeleton-heading" /> {/* Reserve the Accounts heading. */}
                <div className="accounts-grid">
                    {[1, 2, 3].map((item) => (
                        <div className="account-card" key={item}>
                            <div className="skeleton skeleton-heading" /> {/* Account name. */}
                            <div className="skeleton skeleton-line" /> {/* Masked number. */}
                            {item === 3 && (
                                <div className="skeleton skeleton-line" /> // Reserve the Rewards Card's Amount due line.
                            )}
                            <div className="skeleton skeleton-line" /> {/* Balance. */}
                        </div>
                    ))}
                </div>
            </section>

            <section className="transactions-panel" aria-hidden="true">
                {/* <div className="skeleton skeleton-heading" /> Transactions heading. */}
                {/* <div className="skeleton skeleton-input" /> Search control. */}
                <div className="skeleton skeleton-heading" /> {/* Transactions heading. */}
                <div className="skeleton skeleton-line" /> {/* Search transactions label. */}
                <div className="skeleton skeleton-input" /> {/* Search control. */}
                <div className="skeleton skeleton-line" /> {/* Results count. */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div className="skeleton-transaction" key={item}>
                        <div className="skeleton skeleton-heading" /> {/* Description. */}
                        <div className="skeleton skeleton-line" /> {/* Category and date. */}
                        <div className="skeleton skeleton-line" /> {/* Amount. */}
                    </div>
                ))}
            </section>

            <aside className="limit-panel" aria-hidden="true">
                <div className="skeleton skeleton-heading" /> {/* Daily-limit heading. */}
                <div className="skeleton skeleton-line" /> {/* Remaining allowance. */}
                <div className="skeleton skeleton-line" /> {/* Explanation. */}
            </aside>
        </main>
    )
}