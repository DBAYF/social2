# Lovable Backend Contract

This app uses **Firebase only for Auth and database** (Firestore + Storage). All other backend features (AI, server-side logic) run on **Lovable**. The frontend sends the Firebase ID token so Lovable can authenticate and authorize requests.

## Auth

- Frontend gets the Firebase ID token via `auth.currentUser.getIdToken()`.
- Every request to Lovable must include: `Authorization: Bearer <firebaseIdToken>`.
- Lovable must verify the token (e.g. Firebase Admin SDK `auth().verifyIdToken(idToken)`) and use the decoded `uid` (and optional claims) for authorization.

## Environment

- Frontend expects: `VITE_LOVABLE_API_URL` = base URL of the Lovable API (e.g. `https://your-app.lovable.app/api`).
- No Firebase Admin credentials or API keys go in the frontend repo.

---

## Endpoints to Implement on Lovable

### 1. AI Gateway

**POST** `{baseUrl}/ai`

**Request**

- Headers: `Authorization: Bearer <firebaseIdToken>`, `Content-Type: application/json`
- Body (JSON):
  - `useCase`: `"draft_outreach"` | `"summarise_venture"` | `"suggest_tags"` | `"explain_relevance"` | `"opportunity_summary"`
  - `input`: string (user/content to process)
  - `context`: optional object (e.g. `targetName`, `targetVenture`, `tone`, `goal`)

**Response (200)**

- `text`: string (AI output)
- `meta`: `{ useCase, model?, requestId? }`

**Errors**

- `401`: invalid/missing token
- `429`: rate limit
- `5xx`: server error (return JSON `{ error, requestId? }`)

**Suggested behavior on Lovable**

- Verify Firebase ID token; reject if invalid.
- Optional: rate limit per `uid`.
- Call your AI provider (e.g. OpenAI) for the given `useCase`; scrub PII from `input` if needed.
- Return parsed/safe text in `text`.

---

## Optional / Future Endpoints

You can add more Lovable routes later; same auth rule applies:

- **Admin** (e.g. kill switch, usage stats): verify token and check custom claims or Firestore `users/{uid}.roles.admin`.
- **Webhooks or background jobs**: if they are triggered by Lovable, use a server-side secret or Lovable’s auth; do not expose Firebase Admin keys to the client.

---

## What Lives Where

| Concern              | Where        |
|----------------------|-------------|
| Auth (login, tokens) | Firebase Auth |
| User/profile data    | Firestore   |
| File uploads (e.g. avatars) | Firebase Storage |
| AI, server-only logic | Lovable (this contract) |

After cloning to Lovable, set `VITE_LOVABLE_API_URL` to your Lovable API base URL and implement the above endpoints.
