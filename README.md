# Streaky ToDo

Track daily or weekly goals and keep your streaks going. Runs entirely in the browser, installable and usable offline.

**Live:** https://sharmadhiraj.github.io/streaky-todo/

## Features

- Daily goals on the weekdays you choose, or weekly goals with a target count
- Mark today or yesterday from the list, or any past day from the history grid
- Current and longest streak per goal
- Start date, ongoing/completed status
- JSON export and import for backups
- Light and dark theme (follows your system)

## How streaks work

| Goal   | Streak counts                       | A streak breaks when                      |
|--------|-------------------------------------|-------------------------------------------|
| Daily  | Consecutive completed days          | A tracked weekday passes without a check  |
| Weekly | Consecutive weeks reaching the goal | A finished week falls short of the target |

Today (or the current week) never breaks a streak until it is over. Weeks start on Monday.
Updating a past day recalculates the streak.

## Data

Everything is stored in your browser's `localStorage`. Clearing site data deletes it, so use **Export** now and then.
Data from the first version of the app is migrated automatically.

## Development

Requires Node 20.19 or newer.

```bash
npm install
npm run dev        # start the dev server
npm test           # unit tests
npm run build      # type-check and production build into dist/
```

Code layout: `src/lib` holds the pure logic (dates, streaks, storage, backup), `src/hooks` the state, and
`src/components` the UI.

## Deployment

Every push to `main` runs tests, builds, and deploys to GitHub Pages through `.github/workflows/deploy.yml`.
One-time setup: in the repository settings, set **Pages > Source** to **GitHub Actions**.
