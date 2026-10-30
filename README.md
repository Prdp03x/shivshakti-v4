# Cash Memo Generator

A maintainable cash-memo application with a React/Vite frontend, Express API and MongoDB.

## Project architecture

```text
shivshaktihardware-main/
├── client/
│   └── src/
│       ├── app/                 # App bootstrap and global client orchestration
│       ├── routes/              # React Router route definitions
│       ├── pages/               # Route-level screens
│       ├── components/          # Reusable UI, grouped by feature
│       │   ├── auth/
│       │   ├── billing/
│       │   ├── customers/
│       │   ├── layout/
│       │   ├── records/
│       │   └── settings/
│       ├── hooks/               # Reusable state/data hooks
│       ├── lib/                 # API client, formatters, downloads, printing
│       └── styles.css           # Global UI styles
│
├── server/
│   └── src/
│       ├── config/              # Environment and database setup
│       ├── controllers/         # HTTP request/response handlers
│       ├── middleware/          # Authentication, cache and error middleware
│       ├── models/              # One Mongoose model per file
│       ├── routes/              # API route definitions
│       ├── services/            # Business logic
│       └── utils/               # Small shared server utilities
│
└── docs/
    └── SECURITY-NOTES.md
```

## Where to make changes

- **Add/change a frontend screen:** `client/src/pages/`
- **Reusable UI:** `client/src/components/`
- **Frontend routes:** `client/src/routes/AppRoutes.jsx`
- **API calls:** `client/src/lib/api.js`
- **Frontend data/state logic:** `client/src/hooks/`
- **Printing/export browser behavior:** `client/src/lib/`
- **Add/change an API endpoint:** `server/src/routes/`
- **Request/response handling:** `server/src/controllers/`
- **Core business rules:** `server/src/services/`
- **Authentication/security middleware:** `server/src/middleware/`
- **Database schema:** `server/src/models/`
- **Database connection/environment:** `server/src/config/`

The important rule is: **routes should stay thin, controllers handle HTTP, and services contain business logic.** This makes errors easier to trace.

## Run

### API

```bash
cd server
cp .env.example .env
npm install
npm run seed-admin
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The Vite development server proxies `/api` to the Express server.

## Deploying (Render API + separate frontend host)

**Backend (Render, Web Service)** – Root Directory `server`, Build `npm install`, Start `npm start`.

| Env var | Value |
| --- | --- |
| `MONGODB_URI`, `SESSION_SECRET` | your values (Atlas Network Access must allow Render) |
| `NODE_ENV` | `production` |
| `APP_ORIGIN` | exact frontend URL, e.g. `https://myapp.vercel.app` (no trailing slash; comma-separate several) |
| `COOKIE_SAMESITE` | `none` if frontend is on a different domain, otherwise `strict` |
| `COOKIE_SECURE` | `true` |

Check `https://<service>.onrender.com/api/health` returns `{"ok":true}`. Run `npm run seed-admin` once against the production database to create the login.

**Frontend** – set `VITE_API_URL=https://<service>.onrender.com/api` and rebuild (Vite bakes it in at build time). `vercel.json` / `public/_redirects` make page refreshes on `/records` etc. work.

**Recommended instead:** rewrite `/api/*` to Render from your frontend host (see `client/vercel.proxy.example.json`), leave `VITE_API_URL` empty, use `COOKIE_SAMESITE=strict`. Everything is then same-origin: no CORS, no third-party-cookie problems, and CSRF stays blocked by `SameSite=Strict`.

Render's free tier sleeps when idle; the first request can take 30-60 seconds.

## Existing features

- Username/password authentication with bcrypt and server-side sessions.
- MongoDB-backed business, customer, bill, user and counter data.
- Server-calculated totals and payment status.
- Sequential bill numbers that are not reused after deletion.
- Customer lookup/reuse by phone.
- Bill history/search and bill detail routes.
- Excel export.
- JSON backup and restore.
- Business settings.
- Print-ready cash memos.
- No intentional localStorage/sessionStorage/IndexedDB persistence.


## Records pagination
The bill records page loads up to **500 bills per page** (`GET /api/bills?page=2&limit=500`). The API returns `{ bills, page, limit, total, totalPages }`; line items are left out of the list for speed. The pager (`client/src/components/common/Pagination.jsx`) shows first/prev/numbers/next/last, `…` jump buttons (±5 pages) and a "Go to" box.

## Changing username / password
Settings → *Login credentials*. Requires the current password (`PUT /api/auth/credentials`). The username is stored lowercase (3-50 letters, numbers, `.`, `-`, `_`); the password must be 10+ characters. Changing the password signs out all other devices.
