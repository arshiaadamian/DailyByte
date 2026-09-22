# DailyByte Lambdas

Backend functions for DailyByte. All deployed in **ca-west-1**.

These files are a copy of what runs in AWS. Deployment is manual: edit here, then
paste into the Lambda console. The console is currently the source of truth for
what is actually running, so keep this folder in sync after every change.

## Functions

| File | Trigger | What it does |
|---|---|---|
| `GenerateSingleByte.mjs` | EventBridge Scheduler (per user, per slot), `CreateUser`, API Gateway `POST /bytes/generate` | Reads the user's topic and recent byte titles, calls Bedrock, writes one byte to DynamoDB |
| `CreateUser.mjs` | API Gateway `POST /user` | Creates the user row from onboarding preferences, generates a first byte, creates delivery schedules |
| `DeleteAccount.mjs` | API Gateway `DELETE /user/delete` | Deletes the user's delivery schedules, bytes, profile row and Cognito account, in that order |
| `PostConfirmation.mjs` | Cognito post-confirmation trigger | No-op. Superseded by `CreateUser` — detach the trigger and delete |
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
local timezone. Schedules are created in `CreateUser` and rebuilt in
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
- `CreateUser` and `UpdatePreferences` execution roles need
  `scheduler:CreateSchedule`, `scheduler:DeleteSchedule`, and `iam:PassRole` on the
  role above
- `CreateUser` also needs `lambda:InvokeFunction` on `GenerateSingleByte` and
  `dynamodb:PutItem` on `DailyBytes-Users`
- `DeleteAccount` needs `dynamodb:DeleteItem` on `DailyBytes-Users`,
  `dynamodb:Query` and `dynamodb:BatchWriteItem` on `DailyByte-Bytes`,
  `scheduler:DeleteSchedule`, and `cognito-idp:AdminDeleteUser` on the user pool

## Gotchas

- `PostConfirmation` must `return event` or Cognito never completes signup
- It must not throw — a failure there blocks the user's confirmation entirely
- Cognito fires `PreSignUp_ExternalProvider`, **not** `PostConfirmation`, for Google
  users — which is why profile creation had to move to an API call
- `CreateUser` creates the row with `attribute_not_exists(userId)` and returns 200 on
  a duplicate, so the client can safely retry
- `AdminDeleteUser` takes `cognito:username`, not `sub` — federated users have a
  prefixed username like `google_1234`
- `DeleteAccount` removes Cognito last, so a mid-way failure leaves an account that
  can still sign in and retry rather than unreachable rows
- `date` is a DynamoDB reserved word — deleting bytes needs an
  `ExpressionAttributeNames` alias for it
- `BatchWriteItem` caps at 25 requests and can partially succeed; `DeleteAccount`
  retries whatever comes back in `UnprocessedItems`
- Cognito's built-in email sender is capped at 50/day — SES setup is required before launch
