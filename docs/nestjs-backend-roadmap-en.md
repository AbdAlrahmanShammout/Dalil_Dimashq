# Dalil Dimashq NestJS backend — roadmap

The mobile app is built against the 21 Oct Supabase contract in `docs-api/dalil-openapi.yaml`. This roadmap replaces that backend with a NestJS API. Endpoint names may change. Behavior that the directory already has stays. Behavior the 21 Oct file never contained is built here, not left as a client gap.

The engineering system is `docs/BACKEND_ARCHITECTURE.md`. Every task follows it. This file does not restate that system. It says what to build, for which audience, and when a task is finished.

Work goes in number order, one task at a time. A later task may import an earlier domain service. It does not reach into that domain's repository.

## Decisions already taken

| Decision | Choice |
|---|---|
| API audiences | `client-app` (mobile and website together), `dashboard-owner`, `admin-panel` |
| Route shape | `/{audience}/{resource}`, no URI version (`BACKEND_ARCHITECTURE.md` §9.9) |
| OpenAPI | One document per audience, from that audience module only |
| ORM | Prisma. Services depend on an abstract repository. The Prisma class is the only ORM import |
| Files | AWS S3. The client sends the file to the API. The API uploads it. Postgres stores the object key only |
| Maps | Google. The server geocodes. Clients draw the map with the Maps SDK. Near-me sort uses stored coordinates |
| Place ids | Strings. The new schema does not copy Supabase. Integer ids use `ParseIntPipe`. String ids do not |
| Time | `Asia/Damascus`, UTC+3, no daylight-saving change |
| Payments | Staff-recorded only: cash, Syriatel Cash, MTN Cash, bank transfer, other. No card checkout |
| Database | New Postgres, designed for this API. No import of old Supabase rows, and no duty to keep the old table shapes |
| Email | Mailtrap for this version. `providers/mail/` is the only place that knows Mailtrap |
| Phone check | The verification code is the fixed value `000000`. No SMS is sent. A real SMS provider comes after this version |
| Push | Firebase Cloud Messaging for Android, iOS, and web |
| Suggestions | `wrong_info`, `missing_place`, `closed_place`, `other` |
| Website | JSON only. The website renders its own pages. No HTML, sitemap, or share image from this API |
| Sign-in | Three endpoints. Each issues a token for one audience. The audiences are `client-app`, `dashboard-owner`, and `admin-panel`. A token from one door does not open another |
| Accounts | One `User` row per email. `isVisitor` and `isOwner` can both be true. Staff is exclusive: `staffRole` is set, and both flags are false. A place link is not an account kind. Premium is a subscription on the place. `admin` satisfies every staff role. There is no permission table |
| Deploy | Host and S3 region stay unset until deployment is planned. Config reads them. This roadmap does not choose them |
| Errors | `message` follows `Accept-Language` (`ar` or `en`). Clients branch on `code` |

## Later, not in this version

| Item | When |
|---|---|
| Sign in with Apple | After this version ships. Task 22 stays as the placeholder and is not started with the rest |
| A real SMS provider | After this version. It replaces the fixed code `000000` behind `providers/sms/` without changing the verify route |
| Host and S3 region | When deployment is planned. Task 147 stays closed until then |

## Audiences

| Prefix | Who | Guard |
|---|---|---|
| `client-app` | Anonymous caller, or a user with `isVisitor` | Public routes are marked. Private routes require a `client-app` token |
| `dashboard-owner` | A user with `isOwner` | `dashboard-owner` token, then a place-link check on place routes. Premium rules stay in the service |
| `admin-panel` | A user with `staffRole` | `admin-panel` token, then `@Roles`. `admin` passes every staff role |

Visitor auth is registered only in the client-app module. Owner auth is registered only in the dashboard-owner module. Staff auth is registered only in the admin-panel module. Domain modules export services and register no controllers.

A place id in a `dashboard-owner` path is taken from the route and checked against the principal. The client does not send an owner id.

## Accounts

One person, one email, one row. The three doors do not create three people.

```text
User
  id
  email                  unique
  passwordHash           null until a password is set (Google can start without one)
  tokenVersion
  emailVerifiedAt
  isVisitor              the client-app door
  isOwner                the dashboard-owner door
  staffRole              null, or admin | editor | moderator | sales
  createdAt
  updatedAt

Profile                one per user, created when the visitor profile is completed
  userId
  firstName
  lastName
  phone
  phoneVerifiedAt        set only after the code 000000
  birthYear
  language               ar | en

PlaceOwner             a link, not an account
  placeId
  userId
  createdAt
```

Rules:

- `isVisitor` and `isOwner` may both be true. The same person books as a visitor and manages a place as an owner. They sign in at the door they need, and that door's token is the only one that door accepts.
- `staffRole` excludes the other two flags. A staff account is not also a visitor or an owner. Staff is created from the panel, not from public sign-up.
- `isOwner` does not mean the person already has a place. It means they may open the owner door, search, and claim. A place route still requires a `PlaceOwner` row for that place.
- The token carries one audience. Guards read that audience. They do not infer the other flag.
- Visitor sign-up on a new email sets `isVisitor`. The same email signing up on the owner door, with the same password, sets `isOwner` on that row. The reverse is the same. A staff email is rejected by both public doors.
- Google opens the visitor door only. If that person later sets a password and uses the owner door, `isOwner` is added to the same row.
- Deleting the account from one door clears that door's flag. The other flag, when set, keeps the row. The row is removed only when both flags are false and `staffRole` is null. Place links and bookings stay, with the user detached.

## What the 21 Oct file does not have, and this API will

| Gap | Where it is built |
|---|---|
| `search_places` is missing, so Explore cannot run | Task 27 |
| No push sender, only device registration | Tasks 68–69 |
| `suggestions.kind` has no allowed values | Task 50. The four kinds above are the list |
| `POST /functions/v1/delete-account` was reconstructed, not generated | Task 21 |
| Phone verification is not live, so ratings cannot count | Tasks 73–74. This version checks the fixed code `000000` |
| Favorites, near-me sort, Ramadan hours, recently viewed | Tasks 70–72, 36 |
| In-app report (`change_requests` kind `report`) | Task 75 |
| Booking tied to an offer, and an offers banner | Tasks 32, 58 |
| Owner and visitor receipt screens | Tasks 128–129 |
| Weekly hours for non-premium places are hidden by RLS | Task 29 returns hours to visitors for every place that has them. Open-now stays a server result |
| Map vendor was undecided | Google, tasks 8 and 36 |

## Feature checklist

A task is done only when all of the following hold.

- The Prisma model and migration exist.
- The domain folder has the entity, zod schema, mapper, abstract repository, Prisma repository, service, and request/response DTOs that the feature needs.
- The controller is registered only in `client-app-api.module.ts`, `dashboard-owner-api.module.ts`, or `admin-panel-api.module.ts`.
- The handler destructures the request DTO field by field and returns `new SomeResponseDto(entity)`.
- A list returns `limit`, `offset`, `total` from a real count with the same filter, or `hasMore` and `nextCursor` and no `total`.
- Business failures are domain exceptions with a stable `code`. The HTTP status is assigned only by the global filter.
- The service has a colocated unit spec. The new routes have an e2e spec against a test database. S3, Google, mail, SMS, and push are test doubles.
- English identifiers, JSDoc on the service's public methods, no `process.env` outside `config/`.

## Domain map

| Module | Owns |
|---|---|
| `user` | The one account row, profile, profile-change requests, and deleting a door |
| `legal` | Terms and privacy, acceptance |
| `area` | Searchable areas |
| `amenity` | Approved amenity list and place links |
| `place` | Directory row, immediate fields, reviewed fields, open-now, scores |
| `place-hour` | Weekly periods and Ramadan periods |
| `place-photo` | Photo rows and cover/logo. Bytes live in S3 |
| `offer` | Offers, the 60-day window, the public banner |
| `featured` | Featured places |
| `rating` | Visitor ratings, held/counted/rejected |
| `event` | Published events and posters |
| `ownership` | Place links, `DD-` codes, claim, unlink |
| `change-request` | claim, edit, remove, report, unlink review |
| `subscription` | Premium window |
| `payment` | Staff-recorded payments, receipt numbers, void |
| `suggestion` | Visitor suggestions |
| `contact` | Site shortcuts and the contact form |
| `staff` | Staff accounts. Roles live on `user` |
| `notification` | In-app inbox |
| `device` | Push tokens and the send port |
| `booking` | Availability, the nine statuses, bans, fake reports, settings |
| `favorite` | Saved places |
| `recent-view` | Recently opened places |
| `search` | Read model over places. It has its own repository and does not inject other repositories |
| `audit-log` | Staff actions |
| `admin-alert` | Alerts for the panel |

Providers, not domains: `prisma`, `jwt`, `swagger`, `aws-s3`, `google-maps`, `mail` (Mailtrap), `sms` (fixed code for this version), `firebase`, and `scheduler`.

## Task list

Status: tasks 1–21 and 23–102 are done. Task 22 is skipped. Next is task 103.

### 1. Foundation

| # | Task | Done when |
|---|---|---|
| ✅ 1 | Create `backend/` from the architecture layout | `backend/src/main.ts`, `app.module.ts`, `config/`, `providers/`, `modules/`, `common/`, `authentication/`, `prisma/`, and `test/` exist. `npm run build` succeeds. Aliases use `@/` |
| ✅ 2 | Add the tooling scripts | `build`, `start:dev`, `lint`, `format`, `test`, `test:e2e`, `prisma:migrate`, and `prisma:seed` match §21. ESLint and Prettier are configured |
| ✅ 3 | Add typed configuration | `config/` has `app`, `database`, `jwt`, `swagger`, and `cors`. Each concern has schema, registration, and a getter service. Nothing else reads `process.env` |
| ✅ 4 | Add the exception pipeline | `GlobalExceptionFilter` and `ValidationExceptionFilter` return `{ message, code, statusCode }`. Prisma errors map to stable codes. Unknown errors are 500 and are sanitized outside local |
| ✅ 5 | Add guards, the validation pipe, and throttling | `InputValidationPipe` is global. `AuthenticationGuard` honors `@PublicRoute`. `AuthorizationGuard` reads `@Roles` and treats `admin` as every staff role. A global throttler is the floor. Helmet and an explicit CORS list are installed in `main.ts` |
| ✅ 6 | Add Arabic and English error text | Each stable `code` has `ar` and `en` text. The filter picks from `Accept-Language`. The existing `x-dalil-error-codes` list is the seed, including `phone_taken`, `too_young`, and `not_allowed` |
| ✅ 7 | Add Prisma and health | `providers/database/prisma/` exposes the client and a `TransactionRunner`. `GET /health/live` and `GET /health/ready` exist. Ready checks the database with a timeout |
| ✅ 8 | Add the S3 and Google Maps providers | `providers/aws-s3/` uploads bytes it is given and returns a short-lived read URL. It does not issue a presigned PUT. Region and bucket come from config and stay empty until deployment. `providers/google-maps/` can geocode an address to a coordinate. Neither imports a domain |
| ✅ 9 | Add Swagger per audience | `client-app`, `dashboard-owner`, and `admin-panel` each have an API module and an OpenAPI document. The documents are empty apart from health |
| ✅ 10 | Add the principal contract | `common/auth/principal.interface.ts` exists. `user` will be the first implementation. Shared code never imports the user entity |
| ✅ 11 | Add the scheduler extension | `providers/scheduler/` can register a named job. No domain imports the SDK. The booking clock is the first consumer, in task 64 |
| ✅ 12 | Add Mailtrap | `providers/mail/` sends the signup code and the password reset through Mailtrap. Config holds host, port, user, password, and the from-address. Tests replace the provider with a double and never open a live inbox |

### 2. Identity — `client-app`, `dashboard-owner`, `admin-panel`

| # | Task | Done when |
|---|---|---|
| ✅ 13 | Create the user row | The `User` and `Profile` models above exist. Password rules are 10+ characters with letters and digits. A row cannot have `staffRole` together with `isVisitor` or `isOwner`. The user service is the only thing `authentication/` calls to load a principal |
| ✅ 14 | Visitor sign up and the email code | `POST /client-app/auth/sign-up` sets `isVisitor` on a new email, or on an existing owner row when the password matches. A staff email is refused. Mailtrap sends the code. `POST /client-app/auth/verify-email` confirms it. A wrong or expired code does not say which |
| ✅ 15 | Visitor sign in and refresh | `POST /client-app/auth/sign-in` and `POST /client-app/auth/refresh` return a token pair whose audience is `client-app`. The row must have `isVisitor`. Staff, and an owner who never opened the visitor door, are rejected. An unconfirmed email gets `email_not_confirmed` |
| ✅ 16 | Google sign-in for visitors | `POST /client-app/auth/google` accepts a Google identity token, sets `isVisitor` on that email, and returns a `client-app` token pair. It does not set `isOwner` |
| ✅ 17 | Password recovery | `POST /client-app/auth/forgot-password` and `POST /dashboard-owner/auth/forgot-password` always return the same message and only for a row that has that door's flag. The reset sets the one shared password. Mail goes through Mailtrap. Staff passwords are changed from the panel, not from these routes |
| ✅ 18 | Owner sign up and sign in | `POST /dashboard-owner/auth/sign-up`, `verify-email`, `sign-in`, and `refresh` set and use `isOwner`. An existing visitor with the same password gains `isOwner` on that row. The token audience is `dashboard-owner`. A visitor token is still rejected here. Sign-in does not require a place link |
| ✅ 19 | Staff sign-in and sign-out | `POST /admin-panel/auth/sign-in` accepts only a row with `staffRole` and returns an `admin-panel` token. `POST /{audience}/auth/sign-out` revokes that audience's refresh token. A token from one audience does not pass the guard of another |
| ✅ 20 | Current account | `GET /{audience}/auth/me` returns the principal without a password hash, plus the flags that door is allowed to see. `PATCH /{audience}/auth/password` changes the shared password |
| ✅ 21 | Delete one door | `POST /client-app/account/delete` and `POST /dashboard-owner/account/delete` require the password, clear that door's flag, and revoke that door's tokens. The row remains while the other flag is set. It is deleted only when both flags are false and `staffRole` is null. Place links and bookings stay, with the user detached |
| ⏭ 22 | Sign in with Apple | Skipped on purpose. Apple sign-in is out of this version, so the route is not missing from the build. After the version ships, `POST /client-app/auth/apple` follows task 16 |

### 3. Directory — `client-app`

| # | Task | Done when |
|---|---|---|
| ✅ 23 | Areas | `GET /client-app/areas` returns id and both names. The list is public |
| ✅ 24 | Place summary | `GET /client-app/places/:id` returns both names, type, status, area, address, coordinate, featured flag, star label, and the photo fallback kind. `hidden` is absent |
| ✅ 25 | Place contact block | The same payload includes phone, website, email, Facebook, and Instagram only when present |
| ✅ 26 | Category counts | `GET /client-app/places/counts` returns totals for all, hotels, restaurants, and cafés. Hotels include hotel, guest house, hostel, and motel |
| ✅ 27 | Search | `GET /client-app/places` filters by text, type, area, minimum stars, and has-phone, sorts by completeness or name, and returns a real `total`. This replaces the missing `search_places` |
| ✅ 28 | Featured strip | `GET /client-app/places/featured` returns the current featured ids as place summaries |
| ✅ 29 | Open now and weekly hours | `GET /client-app/places/:id/open-now` is the server decision in Damascus time. `GET /client-app/places/:id/hours` returns the week when the place has hours, for every place, not only Premium. A place with no hours returns neither a label nor a week |
| ✅ 30 | Amenities | `GET /client-app/places/:id/amenities` returns the approved chips in sort order |
| ✅ 31 | Photos | `GET /client-app/places/:id/photos` returns read URLs, cover, and logo. Hidden photos are absent |
| ✅ 32 | Offers banner and place offers | `GET /client-app/offers` lists current offers. `GET /client-app/places/:id/offers` lists that place's current offers with title, details, image URL, and until date |
| ✅ 33 | Events | `GET /client-app/events` lists published events. `GET /client-app/events/:id` returns description, address, phone, poster URL, and the linked place when present |
| ✅ 34 | Place scores | The place summary includes the star value and the source label, or "not rated" |
| ✅ 35 | Pagination | Search, offers, and events default to `limit` 20 and `offset` 0 in the service. The next page is `offset + limit` while `offset + limit < total` |
| ✅ 36 | Map points and near me | `GET /client-app/places/map` returns clustered-ready points for the same filters as search. `sort=near` requires a coordinate and orders by distance. It does not call Google per row |
| ✅ 37 | Geocode on save | When a later task writes an address, the place service asks the Google provider once and stores the coordinate. A geocode failure keeps the previous coordinate and records the failure |
| ✅ 38 | Directions target | The place payload includes the coordinate the client opens in Google Maps. The API does not build a directions URL |
| ✅ 39 | Website list data | `GET /client-app/directory` returns JSON the site renders itself: place id, both names, type, area, and cover URL. No HTML |
| ✅ 40 | Share fields | `GET /client-app/places/:id/share` returns JSON title, description, and image URL. The website draws the page and the share card. This API does not render HTML, a sitemap, or an image |

### 4. Profile, legal, contact — `client-app`

| # | Task | Done when |
|---|---|---|
| ✅ 41 | Complete profile | `POST /client-app/profile/complete` takes first name, last name, Syrian phone, birth year, and language. Under 16 returns `too_young`. A taken phone returns `phone_taken`. It runs once |
| ✅ 42 | Update phone and language | `PATCH /client-app/profile` updates phone and language only. A new phone is stored unverified |
| ✅ 43 | Request a name or birth-year change | `POST /client-app/profile/change-requests` stores the request as pending. The profile itself does not change |
| ✅ 44 | My profile | `GET /client-app/profile` returns the completed profile and whether a change request is pending |
| ✅ 45 | Current legal | `GET /client-app/legal/current?kind=terms\|privacy` returns the current Arabic or English text |
| ✅ 46 | Accept legal | `GET /client-app/legal/pending` lists documents the user has not accepted. `POST /client-app/legal/accept` records acceptance |
| ✅ 47 | Site contact shortcuts | `GET /client-app/site-contacts` returns WhatsApp, phone, email, Facebook, and Instagram. An empty value is omitted |
| ✅ 48 | Contact form | `POST /client-app/contact` accepts name, email or phone, type, and message. Body max 16 KB. A filled honeypot `website` is refused. Five messages per visitor per hour, 40 per Damascus day |
| ✅ 49 | Contact confirmation | The contact response is the shared message DTO. The row is stored for the panel |
| ✅ 50 | Suggestions | `POST /client-app/suggestions` accepts name, contact, kind, message, and an optional place. Kind is `wrong_info`, `missing_place`, `closed_place`, or `other`. The same hourly and daily limits as contact apply |
| ✅ 51 | Language on the profile | `language` is `ar` or `en` and is returned on the profile |
| ✅ 52 | Booking prefill | `GET /client-app/profile` includes the name and phone the booking form should start with |

### 5. Bookings — visitor — `client-app`

| # | Task | Done when |
|---|---|---|
| ✅ 53 | Availability | `GET /client-app/places/:id/booking-availability` says whether the place accepts bookings, the horizon, the notice, the max party, and the closed periods. A signed-out caller may read it |
| ✅ 54 | Gate | `POST /client-app/bookings` requires a user, a place that accepts bookings, and no active ban. Otherwise the code is `booking_closed` or `booking_banned` |
| ✅ 55 | Create | The body has a client key, place, time, party size, note (max 300), and an optional offer id. There is no payment field. The same client key returns the same booking |
| ✅ 56 | Result | The create response includes the booking number and status `pending` |
| ✅ 57 | Slots | Offered times respect notice, weekly hours, response hours, and blackouts, in Damascus time |
| ✅ 58 | Offer link | An offer id is stored only when that offer is current for that place. The booking does not change the offer |
| ✅ 59 | My bookings | `GET /client-app/bookings` returns the caller's rows across all nine statuses, with a real `total` |
| ✅ 60 | Booking details | `GET /client-app/bookings/:id` returns place, time, party, note, and any rejection or cancellation reason. Another user's id is not found |
| ✅ 61 | Visitor cancel | `POST /client-app/bookings/:id/cancel` cancels before the appointment and sets `cancelled_by_customer` |
| ✅ 62 | Fake-report reply | `POST /client-app/fake-reports/:id/reply` stores the visitor's reply while the report is still open |
| ✅ 63 | Bans | An active ban is 15 days, then 45, then permanent when the level is 3 or `endsAt` is null. `GET /client-app/bookings/ban` explains which, and create is refused |
| ✅ 64 | Reply clock | The scheduler moves an unanswered pending booking to `expired` when the reply window ends, and writes the matching notification |

### 6. Notifications — `client-app`

| # | Task | Done when |
|---|---|---|
| ✅ 65 | Inbox | `GET /client-app/notifications` lists booking and report rows for the caller, newest first, with read state |
| ✅ 66 | Mark read | `POST /client-app/notifications/:id/read` sets `readAt` only on the caller's row |
| ✅ 67 | Open booking | The notification payload includes `bookingId` when it has one, so the client can open that booking |
| ✅ 68 | Register device | `POST /client-app/devices` stores a Firebase token for `android`, `ios`, or `web`. The owner app uses `POST /dashboard-owner/devices` the same way. Neither route sends a push |
| ✅ 69 | Send push | `providers/firebase/` sends through Firebase Cloud Messaging when a booking or report notification is created. A missing token is not an error. The in-app row still exists. Tests use a double, not Firebase |
| ✅ 70 | Visitor notification kinds | The inbox creates rows for confirmed, rejected, expired, cancelled by the place, fake reported, report decided, ban started, and ban lifted |

### 7. Visitor features the old contract left out — `client-app`

| # | Task | Done when |
|---|---|---|
| ✅ 71 | Favorites | `POST` and `DELETE /client-app/favorites/:placeId`, and `GET /client-app/favorites` as place summaries |
| ✅ 72 | Recently viewed | `POST /client-app/recent-places/:placeId` records an open. `GET /client-app/recent-places` returns the latest distinct places |
| ✅ 73 | Phone verification | `POST /client-app/profile/phone/code` does not send SMS. `POST /client-app/profile/phone/verify` accepts only `000000` and marks the phone verified. Any other code is rejected. `providers/sms/` is the seam a later provider replaces |
| ✅ 74 | Ratings | `POST /client-app/places/:id/ratings` requires a phone verified with `000000`. Otherwise the code is `phone_unverified` and nothing is stored. One rating per visitor per place |
| ✅ 75 | Report a place | `POST /client-app/places/:id/reports` creates a change request of kind `report` with a reason |
| ✅ 76 | Ramadan hours | `GET /client-app/places/:id/hours` includes a `ramadan` season only while the server says Ramadan is in effect. The regular week is unchanged |
| ✅ 77 | Public score refresh | When a rating becomes `counted`, the place score and its source label change. `held` and `rejected` do not |

### 8. Owner — `dashboard-owner`

| # | Task | Done when |
|---|---|---|
| ✅ 78 | My places | `GET /dashboard-owner/places` returns linked places with name, type, and address |
| ✅ 79 | Premium status | Each place includes whether Premium is active, the end date, and the count of pending change requests |
| ✅ 80 | Search to link | `GET /dashboard-owner/places/search?name=` matches `nameAr` or `nameEn` and returns a page |
| ✅ 81 | Link with a code | `POST /dashboard-owner/places/:id/claim-code` links immediately when the code starts with `DD-` and matches. Anything else is `invalid_code` |
| ✅ 82 | Claim without a code | `POST /dashboard-owner/places/:id/claims` creates a `claim` change request with an empty change set |
| ✅ 83 | Ownership policy | Every `:id` route under `dashboard-owner/places/:id` rejects a user who is not linked, except claim and search |
| ✅ 84 | Place summary | `GET /dashboard-owner/places/:id` returns the owner summary: both names, type, address |
| ✅ 85 | Immediate Premium fields | `PATCH /dashboard-owner/places/:id/immediate` writes phones, website, email, Facebook, Instagram, and both descriptions only when Premium is active. Otherwise `premium_required` |
| ✅ 86 | Reviewed edits | `POST /dashboard-owner/places/:id/change-requests` kind `edit` accepts name, type, address, and tourism class. Type is one of the seven place types. The live place does not change |
| ✅ 87 | My requests | `GET /dashboard-owner/places/:id/change-requests` lists pending, approved, and rejected rows with the decision note. The client shows approved as accepted |
| ✅ 88 | Hours editor load | `GET /dashboard-owner/places/:id/hours` returns the regular week, weekday 0 = Sunday, at most 3 periods a day. Ramadan rows are not in this payload |
| ✅ 89 | Save hours | `PUT /dashboard-owner/places/:id/hours` returns `saved` for a Premium owner. A non-premium owner gets a review request and the response `requested`. Staff do not use this route |
| ✅ 90 | Amenities editor | `GET /dashboard-owner/amenities` is the approved list. `POST` and `DELETE /dashboard-owner/places/:id/amenities/:code` add and remove |
| ✅ 91 | Photo pick is the client's | The phone still chooses camera or gallery. It then sends the file to the API. The API does not open a picker |
| ✅ 92 | Reject an oversized photo | The API accepts jpeg, png, or webp up to 2 MB, at most 30 owner photos per place, and stores the object at `{placeId}/{file}`. Anything else is refused before S3 is called |
| ✅ 93 | Upload, cover, logo, delete | `POST /dashboard-owner/places/:id/photos` receives the file, uploads it to S3, and stores the key. `POST .../cover` and `.../logo` assign. `DELETE .../photos/:photoId` removes the owner's photo and the object. There is no presigned upload URL |
| ✅ 94 | Photo Premium lock | Tasks 91–93 return `premium_required` when the place is not Premium. The client shows the contact card |
| ✅ 95 | Offers | `POST /dashboard-owner/places/:id/offers` creates an offer with title, details, an optional image file, and dates. The API uploads that file to S3. The window must be at most 60 days. `POST .../stop` sets the end to now. `DELETE` removes it |
| ✅ 96 | Offer Premium lock | The same `premium_required` rule as photos |
| ✅ 97 | Removal and unlink | `POST /dashboard-owner/places/:id/removal` creates kind `remove` with a reason. `POST /dashboard-owner/places/:id/unlink` creates the unlink request with a reason. An empty reason is `reason` |
| ✅ 98 | Place bookings | `GET /dashboard-owner/places/:id/bookings` returns name, phone, party, time, note, status, and the report flag |
| ✅ 99 | Confirm and reject | `POST .../bookings/:bookingId/confirm` and `.../reject`. Reject takes an optional reason |
| ✅ 100 | Owner cancel | `POST .../bookings/:bookingId/cancel` requires a reason and a time still in the future, then sets `cancelled_by_owner` |
| ✅ 101 | Attendance | `POST .../bookings/:bookingId/attendance` accepts attended or no-show only from 30 minutes before the booking until 3 days after |
| ✅ 102 | Fake booking report | `POST .../bookings/:bookingId/fake-report` requires a reason, one report per booking, not when the status is attended, and at most five reports for that place in the Damascus month |
| 103 | Booking settings | `GET` and `PUT /dashboard-owner/places/:id/booking-settings` cover accepting, max party, and minimum notice. Null notice on PUT keeps the stored value |
| 104 | Reply hours | `POST` and `DELETE /dashboard-owner/places/:id/response-hours` add and remove a weekday window. Premium only. A non-premium owner gets `premium_required`. There is no review request for these rows |
| 105 | Closed periods | `POST` and `DELETE /dashboard-owner/places/:id/blackouts` add and remove a closed range. Premium only, same refusal as reply hours. There is no review request |
| 106 | Owner notifications | `GET /dashboard-owner/notifications` returns only `booking_new`, `booking_clock_started`, `booking_cancelled_by_customer`, and `fake_report_new`. Each has a `bookingId` |
| 107 | View as visitor is not an API | The owner client calls `client-app` for the public place. No second public payload is added under `dashboard-owner` |
| 108 | Missing place | Search returning an empty page is the signal. The owner client then calls `POST /client-app/contact`. No extra endpoint |
| 109 | Owner booking decision notifications | Confirm, reject, owner cancel, attendance, and a new fake report write the visitor or staff inbox row in the same transaction |
| 110 | Premium check | Premium means a subscription whose `endsAt` is in the future. Pending requests are counted from change requests in `pending` for that place |

### 9. Admin — `admin-panel`

| # | Task | Done when |
|---|---|---|
| 111 | Staff accounts | `POST /admin-panel/staff` creates a row with `staffRole` of editor, moderator, or sales, and both public flags false. Only `admin` may call it. `GET /admin-panel/staff` lists them |
| 112 | Areas CRUD | `POST`, `PATCH`, and `DELETE /admin-panel/areas` for `editor` |
| 113 | Amenities CRUD | The same for amenities, including sort order and both names |
| 114 | Create and edit a place | `POST /admin-panel/places` and `PATCH /admin-panel/places/:id` write the directory fields, then geocode. Status is active, temporarily closed, permanently closed, or hidden |
| 115 | Place code | `GET /admin-panel/places/:id/code` returns the `DD-` code. `POST .../renew-code` rotates it |
| 116 | Link an owner | `POST /admin-panel/places/:id/owners` links an owner account. `DELETE` removes the link. `GET /admin-panel/owners` lists links for staff |
| 117 | Decide a change request | `POST /admin-panel/change-requests/:id/decide` approves or rejects claim, edit, remove, report, and unlink, with a note. Approve applies the stored change |
| 118 | Decide a profile change | `POST /admin-panel/profile-change-requests/:id/decide` applies or rejects the name or birth year |
| 119 | Publish legal | `POST /admin-panel/legal` publishes a new terms or privacy document. The previous one stops being current |
| 120 | Site contacts | `PUT /admin-panel/site-contacts` updates the public shortcuts |
| 121 | Suggestions queue | `GET /admin-panel/suggestions` lists them. `PATCH` sets the status. `DELETE` removes one. `editor` only |
| 122 | Contact queue | `GET /admin-panel/contact-messages` lists contact-form rows for `editor` |
| 123 | Events CRUD | `editor` creates, updates, publishes, and deletes events. A poster is a file the API uploads to S3 |
| 124 | Featured | `editor` adds, updates, and removes a featured place |
| 125 | Subscriptions | `sales` creates and updates a Premium window. Owners can read it from task 79 |
| 126 | Record a payment | `POST /admin-panel/payments` records amount, currency, method, item, payer, period, and place. The receipt number is `DD-YY-MM-####`, issued by the service, never by the client |
| 127 | Void a payment | `POST /admin-panel/payments/:id/void` requires a reason. The row is not deleted and is not edited in place |
| 128 | Place payment history | `GET /dashboard-owner/places/:id/payments` returns that place's history. `GET /admin-panel/places/:id/payments` returns the same for sales |
| 129 | Receipt | `GET /admin-panel/payments/:id/receipt` and `GET /dashboard-owner/payments/:id/receipt` return the receipt fields. An owner only receives their place's receipt |
| 130 | Held ratings | `POST /admin-panel/ratings/decide` counts or rejects held ratings. `moderator` |
| 131 | Enable bookings | `POST /admin-panel/places/:id/booking-enabled` switches booking on or off. `editor` or `sales` |
| 132 | Decide a fake report | `POST /admin-panel/fake-reports/:id/decide` confirms or rejects, with a note and a bad-faith flag. Confirm may create the next ban. `moderator` |
| 133 | Lift a ban | `POST /admin-panel/booking-bans/:id/lift` requires a note. A lifted ban does not count toward the next one |
| 134 | No-show watch | `GET /admin-panel/no-show-watch` lists customers with many no-shows in a window. It does not punish them |
| 135 | User contacts | `GET /admin-panel/users/:id/contacts` returns the phone and email a staff role is allowed to see |
| 136 | Audit log | Every decide, void, publish, link, and role change writes an audit row. `GET /admin-panel/audit-log` is `admin` only |
| 137 | Admin alerts | `GET /admin-panel/alerts` lists unread operational alerts. `POST .../read` marks one |
| 138 | Staff hours override | `PUT /admin-panel/places/:id/hours` always saves, including Ramadan periods, and does not create a review request. `POST` and `DELETE` on `/admin-panel/places/:id/response-hours` and `/admin-panel/places/:id/blackouts` are the same direct write for an editor |
| 139 | Moderate photos and offers | `DELETE /admin-panel/photos/:id` and `DELETE /admin-panel/offers/:id` remove a row that breaks the rules, Premium or not |
| 140 | Panel home counts | `GET /admin-panel/summary` returns pending change requests, pending profile changes, open fake reports, and unread alerts |

### 10. Empty database and handoff

Old Supabase rows are not copied. The schema is not required to match the old tables.

| # | Task | Done when |
|---|---|---|
| 141 | Schema freeze | The Prisma schema covers every model in this roadmap and applies from an empty database. It is not a port of the Supabase tables |
| 142 | Seed | `prisma:seed` creates one admin, the amenity list, the legal documents, and the site-contact row. No production places are inserted |
| 143 | No data import | Withdrawn. There is no mapping, copy, or reconciliation of Supabase places, owners, photos, payments, or bookings |
| 144 | No password import | Withdrawn. Accounts are created through the three sign-up doors. Old password hashes are not read |
| 145 | No photo copy | Withdrawn. Photos enter only through the upload routes, which write to S3 |
| 146 | Fresh start check | A clean migration plus seed boots, and `GET /health/ready` passes against that empty database |
| 147 | Deploy | Not started here. Host and S3 region are chosen when deployment is planned |
| 148 | Client switch | A short note lists every old Supabase path and its new audience path, so the mobile app can be pointed at this API in a later change. This roadmap does not edit the Flutter client |

## Route index

Public routes are marked. Everything else needs a bearer token.

### `client-app`

| Method | Path | Task |
|---|---|---|
| POST | `/client-app/auth/sign-up` | 14 |
| POST | `/client-app/auth/verify-email` | 14 |
| POST | `/client-app/auth/sign-in` | 15 |
| POST | `/client-app/auth/refresh` | 15 |
| POST | `/client-app/auth/google` | 16 |
| POST | `/client-app/auth/forgot-password` | 17 |
| POST | `/client-app/auth/reset-password` | 17 |
| POST | `/client-app/auth/sign-out` | 19 |
| GET | `/client-app/auth/me` | 20 |
| PATCH | `/client-app/auth/password` | 20 |
| POST | `/client-app/account/delete` | 21 |
| GET | `/client-app/areas` | 23, public |
| GET | `/client-app/places` | 27, public |
| GET | `/client-app/places/counts` | 26, public |
| GET | `/client-app/places/featured` | 28, public |
| GET | `/client-app/places/map` | 36, public |
| GET | `/client-app/places/:id` | 24, public |
| GET | `/client-app/places/:id/open-now` | 29, public |
| GET | `/client-app/places/:id/hours` | 29, 76, public |
| GET | `/client-app/places/:id/amenities` | 30, public |
| GET | `/client-app/places/:id/photos` | 31, public |
| GET | `/client-app/places/:id/offers` | 32, public |
| GET | `/client-app/places/:id/share` | 40, public |
| GET | `/client-app/places/:id/booking-availability` | 53, public |
| POST | `/client-app/places/:id/ratings` | 74 |
| POST | `/client-app/places/:id/reports` | 75 |
| GET | `/client-app/offers` | 32, public |
| GET | `/client-app/events` | 33, public |
| GET | `/client-app/events/:id` | 33, public |
| GET | `/client-app/directory` | 39, public |
| POST | `/client-app/profile/complete` | 41 |
| PATCH | `/client-app/profile` | 42 |
| GET | `/client-app/profile` | 44, 52 |
| POST | `/client-app/profile/change-requests` | 43 |
| POST | `/client-app/profile/phone/code` | 73 |
| POST | `/client-app/profile/phone/verify` | 73 |
| GET | `/client-app/legal/current` | 45, public |
| GET | `/client-app/legal/pending` | 46 |
| POST | `/client-app/legal/accept` | 46 |
| GET | `/client-app/site-contacts` | 47, public |
| POST | `/client-app/contact` | 48, public |
| POST | `/client-app/suggestions` | 50, public |
| POST | `/client-app/bookings` | 55 |
| GET | `/client-app/bookings` | 59 |
| GET | `/client-app/bookings/ban` | 63 |
| GET | `/client-app/bookings/:id` | 60 |
| POST | `/client-app/bookings/:id/cancel` | 61 |
| POST | `/client-app/fake-reports/:id/reply` | 62 |
| GET | `/client-app/notifications` | 65 |
| POST | `/client-app/notifications/:id/read` | 66 |
| POST | `/client-app/devices` | 68 |
| GET | `/client-app/favorites` | 71 |
| POST | `/client-app/favorites/:placeId` | 71 |
| DELETE | `/client-app/favorites/:placeId` | 71 |
| GET | `/client-app/recent-places` | 72 |
| POST | `/client-app/recent-places/:placeId` | 72 |

### `dashboard-owner`

Place routes require an owner token and a place link, except search and claim.

| Method | Path | Task |
|---|---|---|
| POST | `/dashboard-owner/auth/sign-up` | 18 |
| POST | `/dashboard-owner/auth/verify-email` | 18 |
| POST | `/dashboard-owner/auth/sign-in` | 18 |
| POST | `/dashboard-owner/auth/refresh` | 18 |
| POST | `/dashboard-owner/auth/forgot-password` | 17 |
| POST | `/dashboard-owner/auth/reset-password` | 17 |
| POST | `/dashboard-owner/auth/sign-out` | 19 |
| GET | `/dashboard-owner/auth/me` | 20 |
| PATCH | `/dashboard-owner/auth/password` | 20 |
| POST | `/dashboard-owner/account/delete` | 21 |
| POST | `/dashboard-owner/devices` | 68 |
| GET | `/dashboard-owner/places` | 78 |
| GET | `/dashboard-owner/places/search` | 80 |
| POST | `/dashboard-owner/places/:id/claim-code` | 81 |
| POST | `/dashboard-owner/places/:id/claims` | 82 |
| GET | `/dashboard-owner/places/:id` | 84 |
| PATCH | `/dashboard-owner/places/:id/immediate` | 85 |
| POST | `/dashboard-owner/places/:id/change-requests` | 86 |
| GET | `/dashboard-owner/places/:id/change-requests` | 87 |
| GET | `/dashboard-owner/places/:id/hours` | 88 |
| PUT | `/dashboard-owner/places/:id/hours` | 89 |
| GET | `/dashboard-owner/amenities` | 90 |
| POST | `/dashboard-owner/places/:id/amenities/:code` | 90 |
| DELETE | `/dashboard-owner/places/:id/amenities/:code` | 90 |
| POST | `/dashboard-owner/places/:id/photos` | 93 |
| POST | `/dashboard-owner/places/:id/photos/:photoId/cover` | 93 |
| POST | `/dashboard-owner/places/:id/photos/:photoId/logo` | 93 |
| DELETE | `/dashboard-owner/places/:id/photos/:photoId` | 93 |
| POST | `/dashboard-owner/places/:id/offers` | 95 |
| POST | `/dashboard-owner/places/:id/offers/:offerId/stop` | 95 |
| DELETE | `/dashboard-owner/places/:id/offers/:offerId` | 95 |
| POST | `/dashboard-owner/places/:id/removal` | 97 |
| POST | `/dashboard-owner/places/:id/unlink` | 97 |
| GET | `/dashboard-owner/places/:id/bookings` | 98 |
| POST | `/dashboard-owner/places/:id/bookings/:bookingId/confirm` | 99 |
| POST | `/dashboard-owner/places/:id/bookings/:bookingId/reject` | 99 |
| POST | `/dashboard-owner/places/:id/bookings/:bookingId/cancel` | 100 |
| POST | `/dashboard-owner/places/:id/bookings/:bookingId/attendance` | 101 |
| POST | `/dashboard-owner/places/:id/bookings/:bookingId/fake-report` | 102 |
| GET | `/dashboard-owner/places/:id/booking-settings` | 103 |
| PUT | `/dashboard-owner/places/:id/booking-settings` | 103 |
| POST | `/dashboard-owner/places/:id/response-hours` | 104 |
| DELETE | `/dashboard-owner/places/:id/response-hours/:id` | 104 |
| POST | `/dashboard-owner/places/:id/blackouts` | 105 |
| DELETE | `/dashboard-owner/places/:id/blackouts/:id` | 105 |
| GET | `/dashboard-owner/notifications` | 106 |
| GET | `/dashboard-owner/places/:id/payments` | 128 |
| GET | `/dashboard-owner/payments/:id/receipt` | 129 |

### `admin-panel`

| Method | Path | Task |
|---|---|---|
| POST | `/admin-panel/auth/sign-in` | 19 |
| POST | `/admin-panel/auth/sign-out` | 19 |
| GET | `/admin-panel/auth/me` | 20 |
| PATCH | `/admin-panel/auth/password` | 20 |
| POST | `/admin-panel/staff` | 111 |
| GET | `/admin-panel/staff` | 111 |
| POST, PATCH, DELETE | `/admin-panel/areas` | 112 |
| POST, PATCH, DELETE | `/admin-panel/amenities` | 113 |
| POST | `/admin-panel/places` | 114 |
| PATCH | `/admin-panel/places/:id` | 114 |
| GET | `/admin-panel/places/:id/code` | 115 |
| POST | `/admin-panel/places/:id/renew-code` | 115 |
| POST | `/admin-panel/places/:id/owners` | 116 |
| DELETE | `/admin-panel/places/:id/owners/:userId` | 116 |
| GET | `/admin-panel/owners` | 116 |
| POST | `/admin-panel/change-requests/:id/decide` | 117 |
| POST | `/admin-panel/profile-change-requests/:id/decide` | 118 |
| POST | `/admin-panel/legal` | 119 |
| PUT | `/admin-panel/site-contacts` | 120 |
| GET, PATCH, DELETE | `/admin-panel/suggestions` | 121 |
| GET | `/admin-panel/contact-messages` | 122 |
| POST, PATCH, DELETE | `/admin-panel/events` | 123 |
| POST, PATCH, DELETE | `/admin-panel/featured` | 124 |
| POST, PATCH | `/admin-panel/subscriptions` | 125 |
| POST | `/admin-panel/payments` | 126 |
| POST | `/admin-panel/payments/:id/void` | 127 |
| GET | `/admin-panel/places/:id/payments` | 128 |
| GET | `/admin-panel/payments/:id/receipt` | 129 |
| POST | `/admin-panel/ratings/decide` | 130 |
| POST | `/admin-panel/places/:id/booking-enabled` | 131 |
| POST | `/admin-panel/fake-reports/:id/decide` | 132 |
| POST | `/admin-panel/booking-bans/:id/lift` | 133 |
| GET | `/admin-panel/no-show-watch` | 134 |
| GET | `/admin-panel/users/:id/contacts` | 135 |
| GET | `/admin-panel/audit-log` | 136 |
| GET | `/admin-panel/alerts` | 137 |
| POST | `/admin-panel/alerts/:id/read` | 137 |
| PUT | `/admin-panel/places/:id/hours` | 138 |
| POST, DELETE | `/admin-panel/places/:id/response-hours` | 138 |
| POST, DELETE | `/admin-panel/places/:id/blackouts` | 138 |
| DELETE | `/admin-panel/photos/:id` | 139 |
| DELETE | `/admin-panel/offers/:id` | 139 |
| GET | `/admin-panel/summary` | 140 |

## Explicitly not in this API

- A copy of the Supabase database, its rows, or its passwords.
- A card or wallet checkout. Payments stay staff-recorded.
- HTML pages, a sitemap, or a server-rendered share image.
- A presigned S3 upload. Files go through the API.
- Sign in with Apple, until this version has shipped.
- A live SMS network. The phone code is `000000`.
- A chosen host or S3 region.
- The Flutter client. Task 148 only writes the path map.
- Figma restyling.
- A permission matrix. Access is the account kind, the place link, and Premium.
- `search_places` as an RPC name. Search is `GET /client-app/places`.
