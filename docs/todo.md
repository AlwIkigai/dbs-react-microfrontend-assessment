# Requirement-to-code map

Use the requirement IDs to open the original brief. The code links show where to find each feature.

| ID | What the assignment asks for | Where to find it |
| --- | --- | --- |
| [D1](../brief/candidate-brief.md#L39) | Load the three dashboard requests together and show placeholders while they load. | [App queries and loading branch](../src/App.tsx#L19), [DashboardSkeleton](../src/components/DashboardSkeleton.tsx#L2) |
| [D2](../brief/candidate-brief.md#L42) | Show the Meridian header, Ava’s greeting, segment switch, theme toggle and avatar. | [Header controls](../src/components/Header.tsx#L39), [greeting](../src/App.tsx#L121) |
| [D3](../brief/candidate-brief.md#L45) | Show the total across deposit accounts. | [Deposit filter and total](../src/App.tsx#L91) |
| [D4](../brief/candidate-brief.md#L47) | Show the three account cards and label the credit card amount due. | [Account cards](../src/App.tsx#L137) |
| [D5](../brief/candidate-brief.md#L49) | Show the eight most recent transactions and mark pending entries. | [Latest-eight query](../src/App.tsx#L31), [transaction rows](../src/App.tsx#L185), [Pending chip](../src/index.css#L540) |
| [D6](../brief/candidate-brief.md#L53) | Search by description or category, show the result count and let users clear the search. | [Search filter](../src/App.tsx#L82), [count, Clear search and messages](../src/App.tsx#L155) |
| [D7](../brief/candidate-brief.md#L57) | Show a dashboard error and offer Retry. | [Dashboard Retry](../src/App.tsx#L51), [Retry test](../src/App.test.tsx#L53) |
| [D8](../brief/candidate-brief.md#L61) | Use a single-column mobile layout with a fixed New transfer button and 44 px tap targets. | [Dashboard breakpoints](../src/index.css#L186), [fixed CTA and field targets](../src/index.css#L519) |
| [T1](../brief/candidate-brief.md#L67) | Open a desktop dialog or mobile sheet with keyboard focus and close controls. | [Native dialog and focus lifecycle](../src/components/TransferDialog.tsx#L223), [dialog breakpoints](../src/index.css#L411) |
| [T2](../brief/candidate-brief.md#L71) | Choose a saved payee or enter a new recipient. | [Payee query and search](../src/components/TransferDialog.tsx#L105), [recipient forms](../src/components/TransferDialog.tsx#L275) |
| [T3](../brief/candidate-brief.md#L74) | Choose the sender account, enter an amount and optionally add a note. | [Amount form](../src/components/TransferDialog.tsx#L407) |
| [T4](../brief/candidate-brief.md#L78) | Review the transfer details and keep entries when going Back. | [Review and Back](../src/components/TransferDialog.tsx#L480) |
| [T5](../brief/candidate-brief.md#L81) | Send one request on confirmation and show the success details. | [Mutation](../src/components/TransferDialog.tsx#L135), [confirm and success UI](../src/components/TransferDialog.tsx#L553) |
| [T6](../brief/candidate-brief.md#L85) | Update the balance, transaction list and daily limit after a transfer. | [Query invalidation](../src/components/TransferDialog.tsx#L143), [success test](../src/App.test.tsx#L154) |
| [T7](../brief/candidate-brief.md#L88) | Keep the transfer on Review after a failure and let the user retry. | [Review error alert](../src/components/TransferDialog.tsx#L516), [saved-payee rejection test](../src/App.test.tsx#L122) |
| [T8](../brief/candidate-brief.md#L91) | Label fields, link errors, announce success and support keyboard use. | [Field labels and errors](../src/components/TransferDialog.tsx#L300), [success announcement](../src/components/TransferDialog.tsx#L566) |
| [§3.3](../brief/candidate-brief.md#L96) | Validate recipient details, amount, balance, daily limit and note. | [Zod rules](../src/lib/transfer-schema.ts#L6), [RHF configuration](../src/components/TransferDialog.tsx#L46) |
| [TH1](../brief/candidate-brief.md#L120) | Switch between light and dark, remember the choice and apply it before the page appears. | [Before-paint setup](../index.html#L8), [theme handling](../src/components/Header.tsx#L14) |
| [TH2](../brief/candidate-brief.md#L123) | Switch between Retail and Premium colours and remember the choice. | [Segment handling](../src/components/Header.tsx#L27), [brand tokens](../brief/design-tokens.css) |
| [TH3](../brief/candidate-brief.md#L126) | Give controls accessible labels, visible keyboard focus and readable colours. | [Pressed states](../src/components/Header.tsx#L54), [focus CSS](../src/index.css#L178) |
| [E1](../brief/candidate-brief.md#L137) | Use strict TypeScript and typed API data. | [TypeScript config](../tsconfig.json), [API types](../src/api/types.ts), [typed API client](../src/api/client.ts#L27) |
| [E2](../brief/candidate-brief.md#L139) | Use TanStack Query to manage server data. | [Dashboard queries](../src/App.tsx#L19), [mutation and refresh](../src/components/TransferDialog.tsx#L135) |
| [E3](../brief/candidate-brief.md#L142) | Use React Hook Form and shared Zod validation. | [Transfer schemas](../src/lib/transfer-schema.ts), [form setup](../src/components/TransferDialog.tsx#L46) |
| [E4](../brief/candidate-brief.md#L144) | Test over-balance rejection, transfer success and dashboard Retry. | [Retry, over-balance and success tests](../src/App.test.tsx#L53), [test cleanup](../src/test/setup.ts#L10) |
| [E5](../brief/candidate-brief.md#L149) | Pass the local checks and production build, and avoid console errors in normal use. | [Scripts](../package.json) |
| [E6](../brief/candidate-brief.md#L152) | Deploy a working public app that needs no local server. | [Browser worker startup](../src/main.tsx#L7), [deployment guide](../DEPLOYMENT.md) |
| [§§4–6](../brief/candidate-brief.md#L158) | Follow the supplied copy, formatting, layout and mock API requirements. | [Formatters](../src/lib/format.ts), [dashboard and dialog styles](../src/index.css), [supplied mock data](../mock-api/db.json) |
