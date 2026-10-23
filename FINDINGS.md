# EventHub Findings

## T1

**Status: DONE — VERIFIED**

- **What was wrong:** The earlier findings record that the starter listing was hard to scan and that a full event did not show the exam's required status text.
- **Why it mattered:** Event details and availability need to be clear, and the full state must use the specified wording.
- **How I fixed it:** The responsive cards in `frontend/src/pages/EventsPage.jsx` and `frontend/src/components/EventCard.jsx` show the required fields. `frontend/src/utils/format.js` formats dates and durations. I changed the zero-seat label to exactly `Full`. Stable event IDs are used as React keys.
- **Verification:** The production build passed. Browser inspection showed all six displayed events, formatted dates/durations/fees, the free and full states, and no React warnings or errors. At 390px, the page had no horizontal overflow.

## T2

**Status: DONE — VERIFIED**

- **What was wrong:** The previous findings describe an unlabelled registration form and a full event that could not be submitted to show the required message. The total label also lacked the required colon.
- **Why it mattered:** Students need clear validation, accurate capacity and fee feedback, and the specified total-payable text.
- **How I fixed it:** `frontend/src/pages/RegisterPage.jsx` has labelled inputs, registration state, per-email limits, the CHARUSAT discount, cancellation, seat restoration, and running totals. I changed the total label to exactly `Total payable:`. `frontend/src/App.jsx` and `frontend/src/components/NavBar.jsx` use React Router navigation. Registration continues to use the four starter events as required by its existing design.
- **Verification:** Browser checks confirmed the exact empty-fields, full-event, and three-registration messages; five registrations exhausted the selected event's seats; cancellation restored one seat and reduced the total; a `@charusat.edu.in` registration paid 80% (₹160.00 for the ₹200 event). No browser warnings or errors appeared.

## T3

**Status: DONE — VERIFIED**

- **What was wrong:** The earlier findings say the request lifecycle and sorting existed but the results and status states were difficult to scan.
- **Why it mattered:** Organiser details and network feedback should be readable and recoverable.
- **How I fixed it:** `frontend/src/pages/OrganisersPage.jsx` displays names, company names, emails, count, loading state, error state, and a Retry button. It requests the required JSONPlaceholder URL and sorts names case-insensitively.
- **Verification:** A browser request returned ten organisers in case-insensitive A–Z order with company and email fields. A simulated initial network failure showed `Could not load organisers`; Retry made a second request without reloading. No unhandled exceptions or browser warnings/errors were observed.

## T4

**Status: DONE — VERIFIED**

- **What was wrong:** The earlier findings record that the starter had the routes and validation but logged errors a second time.
- **Why it mattered:** The exam requires one request log line per request, including failures.
- **How I fixed it:** `backend/app.js` keeps the in-memory event API independent from MongoDB, validates and filters events, and uses one request logger plus a generic error handler. The redundant error log was removed.
- **Verification:** `npm test` passed all 25 tests, covering creation, title and capacity boundaries, fee defaults and validation, listing, `maxFee`, get/delete, 404s, single-line request logging, and the `/api/v1/boom` 500 response without a stack trace. The running exam API returned its existing three starter events.

## T5

**Status: PARTIALLY DONE — EVIDENCE FILE REMAINS**

- **What was wrong:** The previous findings state that the schema, formatter, and seed rules were already in place; the required Compass/Atlas screenshot was missing.
- **Why it mattered:** The exam requires a saved-document screenshot at `backend/evidence/db.png`, in addition to correct model validation and seed output.
- **How I fixed it:** `backend/models/Event.js` validates the specified title, date, category, creation timestamp, capacity (including the cultural limit), and fee rules. `backend/utils/formatError.js` returns a plain validation object. `backend/seed.js` saves a valid event and prints the formatted validation details for an invalid event. No schema or existing database data was changed.
- **Verification:** All nine Mongoose model tests passed. I ran the seed against a temporary local database: the valid document saved with a creation-time `createdAt`, the invalid event printed formatted errors, and I dropped only that temporary database afterward. The existing Mongo-backed catalog also returned the actual `CHARUSAT TechFest 2026` document. `backend/evidence/db.png` is absent, so this task is not fully submission-ready until a real Compass/Atlas screenshot is captured there.

## Audit limitations

This workspace has no Git metadata, so the original starter revision and a Git working-tree diff could not be inspected. The descriptions of starter issues above are based on the existing findings and present implementation; the original baseline could not be independently compared. The exam requires the public repository `itue301-exam-24DCS057-B1`, a single final commit, and `24DCS057-B1.pdf` containing the repository URL and final SHA. No repository, commit, or PDF was created; those submission steps remain pending.
