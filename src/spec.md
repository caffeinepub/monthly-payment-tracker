# Specification

## Summary
**Goal:** Build a mobile-first monthly payment tracker where authenticated users manually record income/expense transactions and view monthly summaries and charts.

**Planned changes:**
- Add secure registration/login with Internet Identity and require authentication for all app features.
- Create per-user persisted transactions storage in the backend (income/expense, amount, date, note, timestamps) with stable-state persistence.
- Build a mobile-first UI to add and list transactions with validation and clear English error messages.
- Add month/year selection to filter transactions by month (newest first) and keep totals/charts in sync with the selected month.
- Calculate and display monthly totals (Total Received, Total Sent, Balance) and provide a dedicated Monthly Summary screen.
- Implement an optional per-user in-app “monthly summary reminder” toggle and show a dismissible in-app notice when a new month is detected.
- Add a simple mobile-friendly chart comparing income vs expenses for the selected month.
- Apply a cohesive, simple visual theme optimized for small screens (avoiding a blue/purple primary palette).
- Display a clear statement that transactions are entered manually and the app does not connect to bank accounts.

**User-visible outcome:** Users can sign in with Internet Identity, manually add income/expense transactions, filter by month, see monthly totals and a summary view, view a basic income-vs-expense chart, optionally get an in-app reminder when a new month starts, and clearly understand the app does not connect to banks.
