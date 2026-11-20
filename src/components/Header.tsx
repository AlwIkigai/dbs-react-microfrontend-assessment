import { useState } from 'react' // Track the preferences displayed by the controls.

// Step 1: Define the dashboard header.
export default function Header() {
    // Step: Start from the preferences already applied by index.html.
    const [theme, setTheme] = useState<'light' | 'dark'>(() =>
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    )

    const [segment, setSegment] = useState<'retail' | 'premium'>(() =>
        document.documentElement.dataset.segment === 'premium' ? 'premium' : 'retail',
    )

    // Step: Apply preferences immediately and remember them when storage is available.
    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'
        document.documentElement.dataset.theme = nextTheme // Activate the matching tokens.
        setTheme(nextTheme) // Update the control.

        try {
            localStorage.setItem('meridian-theme', nextTheme)
        } catch {
            // The toggle still works when storage is unavailable.
        }
    }

    const changeSegment = (nextSegment: 'retail' | 'premium') => {
        document.documentElement.dataset.segment = nextSegment
        setSegment(nextSegment)

        try {
            localStorage.setItem('meridian-segment', nextSegment)
        } catch {
            // The switch still works when storage is unavailable.
        }
    }

    return (
        <header className="app-header"> {/* Provide the page header landmark. */}
            <div className="header-content"> {/* Centre and arrange header items. */}
                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">M</span> {/* Decorative logo mark. */}
                    <span>Meridian</span> {/* Visible bank name. */}
                </div>

                <nav className="header-nav" aria-label="Main navigation">
                    <span aria-current="page">Overview</span> {/* Identify the current view. */}
                    <button type="button" disabled>Cards</button> {/* Out of scope. */}
                    <button type="button" disabled>Payments</button> {/* Out of scope. */}
                    <button type="button" disabled>Insights</button> {/* Out of scope. */}
                </nav>
                {/* Step: Provide labelled theme and segment controls. */}
                <div className="header-controls">
                    <div role="group" aria-label="Customer segment">
                        <button
                            type="button"
                            aria-pressed={segment === 'retail'}
                            onClick={() => changeSegment('retail')}
                        >
                            Retail
                        </button>
                        <button
                            type="button"
                            aria-pressed={segment === 'premium'}
                            onClick={() => changeSegment('premium')}
                        >
                            Premium
                        </button>
                    </div>

                    <button
                        type="button"
                        aria-pressed={theme === 'dark'}
                        onClick={toggleTheme}
                    >
                        Dark mode
                    </button>
                </div>
                <span className="avatar" role="img" aria-label="Ava Chen">
                    AC {/* Display the customer's initials. */}
                </span>
            </div>
        </header>
    )
}