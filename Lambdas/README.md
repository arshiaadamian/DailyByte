# DailyByte Lambdas

Backend functions for DailyByte. All deployed in **ca-west-1**.

These files are a copy of what runs in AWS. Deployment is manual: edit here, then
paste into the Lambda console. The console is currently the source of truth for
what is actually running, so keep this folder in sync after every change.

## Functions

| File | Trigger | What it does |
|---|---|---|
| `GenerateSingleByte.mjs` | EventBridge Scheduler (per user, per slot), `PostConfirmation`, API Gateway `POST /bytes/generate` | Reads the user's topic and recent byte titles, calls Bedrock, writes one byte to DynamoDB |
| `PostConfirmation.mjs` | Cognito post-confirmation trigger | Creates the user row from onboarding preferences, generates a first byte, creates delivery schedules |
| `UpdatePreferences.mjs` | API Gateway `PATCH /user/preferences` | Updates topic / bytesPerDay / deliveryTime, and rebuilds schedules when timing changes |
| `GetUserInformation.mjs` | API Gateway `GET /user/information` | Returns the user's current preferences |
| `GetTodaysByte.mjs` | API Gateway `GET /bytes/today` | Returns the most recent byte |
| `GetHistoryBytes.mjs` | API Gateway `GET /bytes/history` | Returns past bytes |

API Gateway routes are protected by a JWT authorizer backed by the Cognito user
pool. `GenerateSingleByte` resolves the user from either the JWT claims or an
`event.userId` payload, so the same function serves both API and direct invokes.

## DynamoDB

**`DailyBytes-Users`** — PK `userId`
`topic`, `bytesPerDay`, `deliveryTime` (array of `{hour, minute}`), `timeZone`
(IANA, e.g. `America/Vancouver`), `email`, `active`, `createdAt`

**`DailyByte-Bytes`** — PK `userId`, SK `date` (`YYYY-MM-DD#HHMMSS`)
`topic`, `title`, `body`, `sourceURL`

## EventBridge Scheduler

Schedule group: **`DailyBytes`**
Schedule names: `{userId}_{slotIndex}` — slot index is 0-based, max 3 per user.

Each schedule targets `GenerateSingleByte` with `{"userId": "..."}` as its input,
and uses `ScheduleExpressionTimezone` so cron times are interpreted in the user's
local timezone. Schedules are created in `PostConfirmation` and rebuilt in
`UpdatePreferences` using delete-then-create, which is idempotent and cannot leave
orphaned slots behind.

## Bedrock

Model: `global.anthropic.claude-haiku-4-5-20251001-v1:0` via the Converse API.
`temperature: 0.6`, `maxTokens: 500`.

The prompt lives in `GenerateSingleByte.mjs` alongside a `TOPIC_GUIDANCE` map that
gives per-topic direction and constraints. The model returns `sourceQuery` (a search
phrase) rather than a URL — the URL is built in code, because models cannot reliably
produce working links.

## IAM

- **`DailyBytes-DailyByteGenerationScheduler`** — assumed by `scheduler.amazonaws.com`,
  allows `lambda:InvokeFunction` on `GenerateSingleByte`
- `PostConfirmation` and `UpdatePreferences` execution roles need
  `scheduler:CreateSchedule`, `scheduler:DeleteSchedule`, and `iam:PassRole` on the
  role above
- `PostConfirmation` also needs `lambda:InvokeFunction` on `GenerateSingleByte`

## Gotchas

- `PostConfirmation` must `return event` or Cognito never completes signup
- It must not throw — a failure there blocks the user's confirmation entirely
- It also fires on password-reset confirmations, which send no `clientMetadata`
- `clientMetadata` values must be strings; numbers and arrays need converting
- Cognito's built-in email sender is capped at 50/day — SES setup is required before launch
