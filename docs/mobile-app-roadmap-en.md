# Dalil Dimashq mobile — roadmap

Flutter app for visitors and place owners. The API baseline is `docs-api/dalil-openapi.yaml`, version `2026-10-21` (generated from the database migrations, plus the website paths kept from the 16 Oct reconstruction).
The visual design is not ready. We build the app now with a provisional dark UI, then restyle it when the Figma Make file arrives. Repositories, navigation, and screen behavior stay. Only the theme and the shared widgets change.

Work goes in number order, one task at a time.

Tasks 1–50 are already built. Several of them call a contract the 21 Oct file changed or never contained. Tasks 51–55 correct that before new screens continue.

The app follows `docs/FLUTTER_CLEAN_ARCHITECTURE_TEMPLATE.md`.

## Architecture

```
lib/
├── core/           config, di, network, storage, theme
├── data/           datasource, dto, model, repository
├── domain/         entities, repositories, usecase, failures
├── presentation/   core/app, core/widgets, features/<name>/{bloc,pages,widgets}
└── main.dart
```

- Domain does not import data, presentation, or Flutter.
- Data implements domain repositories and may import domain.
- Presentation talks to use cases through BLoC. It does not import data.
- A feature task is done only when all three layers exist: entity, repository interface, and use case; DTO, remote data source, and repository implementation; BLoC, page, and widgets. `getIt` provides the BLoC.
- Use cases return `Either<Failure, T>`.
- Supabase is the backend. Dio and Retrofit call the Supabase URL (PostgREST, Auth, and Storage). `AuthInterceptor` sends the anon key and the user bearer token.
- `SharedPreferences.getInstance` is async, so it is registered with `@preResolve`.

## What the 21 Oct API confirms

| Item | What the app calls |
|---|---|
| `profiles` | Read the signed-in row. First completion is `complete_profile` (first name, last name, Syrian phone, birth year, language). Later phone and language go through `update_my_profile`. First name, last name, and birth year after that go through `request_profile_change`. `PATCH` on `profiles` writes `display_name` only. |
| Open now | `place_open_now`. Places with no hours are omitted. The app shows nothing for those. |
| Weekly hours read | `place_hours` rows come back for premium places only. Every other place uses `place_open_now` and does not get the week table. |
| Weekly hours write | `set_place_hours`. Premium owners and staff get `saved`. Other owners get `requested`. Weekday 0 is Sunday, up to 3 periods a day. |
| Legal | `current_legal` (`terms` or `privacy`), `my_pending_legal`, and `accept_legal`. |
| Contact channels | `site_contacts`. An empty value hides that icon. |
| Suggestions | `POST /rest/v1/suggestions` with `name`, `contact`, `kind`, `message`, and optional `place_id`. Anyone may insert. Editors read them. Allowed `kind` values are not listed yet. |
| Push registration | `register_device` (`android`, `ios`, or `web`). There is still no sender. `user_devices` is staging-only; the function is marked production and staging. |
| Errors | New functions put a stable code in `message` (`phone_taken`, `too_young`, …) with Arabic and English text in `x-dalil-error-codes`. Older functions still start `message` with an English sentence. SQLSTATE stays the fallback. |
| Auth | Email and password still sign up and send a 6-digit email code, then `complete_profile`. Passwordless email OTP exists. Google sign-in is on. Sign in with Apple is not in v1. |
| Account deletion | `POST /functions/v1/delete-account` is kept from the 16 Oct reconstruction. The 21 Oct generator did not include it. Confirm it before building the screen. |
| Contact form | `POST /api/contact`. JSON, max 16 KB, 5 messages per visitor per hour, 40 a day in total. A filled `website` field or a foreign `Origin` is refused. |

## Built against a contract the 21 Oct file does not contain

| Already built | Gap |
|---|---|
| Tasks 15–23, server search | The app calls `POST /rest/v1/rpc/search_places` (text, category, area, minimum stars, has phone, sort, limit, offset). That function is not in the spec. Explore cannot run on staging until the client adds it. |
| Task 30, weekly hours for every place | The place page reads `place_hours` for the place. Visitors now receive those rows only for premium places. |
| Task 30, Open now on the device | Open now is computed in the app from those rows. The spec says to call `place_open_now`, and `osm_hours` is being retired. |
| Tasks 41–46, profile | Sign-up collects a display name. The profile screen reads and `PATCH`es `display_name` and `phone`. The spec writes the phone through `update_my_profile`, and a new number is not verified. Name and birth year after completion need `request_profile_change`. |
| Task 45, age 16 | The app checks age on sign-up. The server enforces it on `complete_profile` with `too_young`. |
| Task 8, error mapping | Failures branch on SQLSTATE only. New functions need the `message` catalog as well. |

## Still out of this build

Favorites, “near me” sorting, Ramadan hours, visitor ratings, recently viewed, an in-app report screen (`change_requests` kind `report`), booking tied to an offer, an offers banner, Sign in with Apple, and a receipt screen (`payment_receipt`, `place_payments`).

Visitor ratings have an insert path, and it stays out: insert needs a verified Syrian phone, and that verification is not live. `update_my_profile` says a new number is not verified.

Passwordless email OTP and Google sign-in exist. Tasks 41–44 stay on email and password. They can be added later without renumbering.

## Stack

- Flutter, iOS and Android, project in `mobile/`
- `dio` and `retrofit` for HTTP
- `get_it` and `injectable` for dependency injection
- `flutter_bloc` for state
- `json_serializable` for DTOs
- `shared_preferences` for the auth token and simple settings
- `dartz` for `Either`
- `build_runner`, `retrofit_generator`, `json_serializable`, and `injectable_generator`
- Arabic and English, RTL for Arabic
- Time zone `Asia/Damascus`
- Map UI behind a `MapSurface` widget until the map vendor is chosen
- Image compression on device before owner uploads
- Staging by default: `flutter run --dart-define=ENV=staging --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...`

Errors look up `message` in `x-dalil-error-codes` first (stable code, then the start of an older English sentence). If neither matches, the app shows a general Arabic or English message. A row-level-security refusal (`42501` without one of those codes) shows `not_allowed`.

## Task list

Status: tasks 1–55 are built. Next is task 56 (delete account), after the edge function is confirmed. Explore still calls `search_places`, which the 21 Oct spec does not contain.

| # | Task | Done when |
|---|---|---|
| 1 | Create the Flutter iOS and Android project | `mobile/` exists and the default app analyzes |
| 2 | Create the template folders and boot the app | `core`, `data`, `domain`, and `presentation` exist, and `main.dart` runs `DalilApp` |
| 3 | Add the template packages and code generation | Dio, Retrofit, get_it, injectable, flutter_bloc, json_serializable, shared_preferences, dartz, and build_runner resolve, and injection code generates |
| 4 | Add staging environment configuration | `AppConfig` reads `ENV`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`. The default environment is staging |
| 5 | Initialize dependency injection | `main` calls `configureInjection` before `runApp` |
| 6 | Add the Dio client and auth interceptor | Every request sends `apikey` and `Authorization` |
| 7 | Add token storage | The access token can be saved, read, and cleared through `SharedPreferences` |
| 8 | Map Supabase error codes to failures | `42501`, `22023`, `23505`, `P0002`, `54000`, and `55000` become `Failure` subtypes |
| 9 | Add the provisional dark theme | Teal, charcoal, and gold tokens live in `core/theme` and `DalilApp` uses them |
| 10 | Add shared scaffold, button, and section widgets | Those widgets live in `presentation/core/widgets` and render on a temporary home screen |
| 11 | Add loading, empty, and error widgets | Each state can be shown on its own |
| 12 | Add Arabic and English localization | The language switch flips copy and RTL |
| 13 | Add the visitor navigation shell | Explore, map, events, and account tabs exist as empty screens |
| 14 | Add the owner navigation shell | Owner screens are reachable only after the auth gate placeholder |
| 15 | Add the server search client | Domain, data, and BLoC return a page of places without loading the full directory. The app calls `search_places`; that function is still absent from the 21 Oct spec |
| 16 | Build the Explore search bar | Typing a query runs server search |
| 17 | Build category chips with counts | All, hotels, restaurants, and cafés filter the list and show a count |
| 18 | Build the featured places strip | Featured ids resolve to place cards with a featured badge |
| 19 | Build place result cards | Each card shows both names, type, area, photo or fallback, featured badge, stars or “not rated”, and open/closed when hours exist |
| 20 | Add load-more pagination | Scrolling fetches the next page |
| 21 | Add the search empty state | No matches shows an empty state |
| 22 | Add search error and retry | A failed search shows an error and a retry action |
| 23 | Build the filters sheet | Category, minimum stars, searchable area, has phone, sort, clear, and an active-filter count all apply to search |
| 24 | Build the place page header | Cover, logo, both names, type, area, featured badge, and the star source label render |
| 25 | Add call, directions, share, and copy phone | Each action works, and a long press copies the number |
| 26 | Add current offers on the place page | Active offers show title, details, image, and an until date |
| 27 | Add the photos section on the place page | Photos open the gallery |
| 28 | Add overview and amenities | Description and amenity chips render from the place |
| 29 | Add the map preview on the place page | The place coordinate is shown and opens directions |
| 30 | Add hours and Open now | Weekly hours render from `place_hours`, and Open now / Closed now is computed in Damascus time. Task 52 replaces this with the 21 Oct rules |
| 31 | Add the contact section | Phone, website, Facebook, Instagram, and email render when present |
| 32 | Build the full-screen photo gallery | Swipe and zoom work |
| 33 | Add category fallback images | A place with no photo shows the restaurant, café, or hotel fallback |
| 34 | Build the offers list screen | Current offers list, and opening one opens its place |
| 35 | Build the events list | Published events show title, venue, time, and poster |
| 36 | Build the event details screen | Description, address, phone, and a linked place open when present |
| 37 | Build the map with clustered markers | Places cluster, and tapping a marker selects it |
| 38 | Add the marker preview card | The card shows the place and opens the place page |
| 39 | Add the list and map switch | The same results toggle between list and map |
| 40 | Add Near me | Tapping it asks for location permission and centers the map. It does not sort by distance |
| 41 | Build sign up | Email, password (10+ characters with letters and digits), and display name create an account and send email confirmation |
| 42 | Build sign in | Email and password restore a session and save the token |
| 43 | Build the email confirmation state | An unconfirmed account is told to confirm before continuing |
| 44 | Build password recovery | A recovery email can be requested |
| 45 | Add the 16+ age check | Account creation requires age 16 or older. The server check moves to `complete_profile` in task 53 |
| 46 | Build the profile screen | Name and phone load from `profiles` and can be saved. Task 53 replaces the write path |
| 47 | Prefill booking from the profile | The booking form starts with the saved name and phone |
| 48 | Add language in settings | The choice persists |
| 49 | Add the notifications toggle | The toggle is stored and gates the later permission request |
| 50 | Add the privacy policy screen | The current policy opens inside the app |
| 51 | Map the 21 Oct error catalog | `message` is matched to `x-dalil-error-codes` (stable code, then older English prefix) and shown in Arabic and English. SQLSTATE remains the fallback |
| 52 | Point Open now at the server | Cards and the place page call `place_open_now`. The week table renders only when `place_hours` returns rows. Places with no hours show neither a table nor an open/closed label. The app does not read `osm_hours` |
| 53 | Move the profile onto the RPCs | After email confirmation the account completes once through `complete_profile` (first name, last name, phone, birth year, language), including `too_young`. Phone and language later use `update_my_profile`. Name and birth year after completion use `request_profile_change` and show a pending state. The screen stops sending `phone` on `PATCH` |
| 54 | Accept terms and privacy | A signed-in user with a pending document sees the current Arabic or English text and can accept it through `accept_legal` |
| 55 | Load contact shortcuts from `site_contacts` | WhatsApp, phone, email, Facebook, and Instagram come from the table. An empty value hides that shortcut |
| 56 | Add delete account | The signed-in user can delete the account. Build this only after the edge function is confirmed; it is not in the 21 Oct generated file |
| 57 | Add sign out | `POST /auth/v1/logout` runs, the token clears, and the visitor shell returns |
| 58 | Build the contact form | Name, email or phone, type, and message submit, then a confirmation shows. The client enforces the 16 KB, hourly, and daily limits |
| 59 | Build the suggestion form | A visitor sends name, contact, message, and an optional place. `kind` uses the value the client confirms; the screen waits if that list is still missing |
| 60 | Gate booking behind sign-in | Book is hidden unless the place accepts bookings, and it requires an account |
| 61 | Build date and time selection | Dates follow the horizon, and times respect notice and closed periods |
| 62 | Build party size, note, and submit | Party size stays within the max, the note stays within 300 characters, and there is no payment |
| 63 | Show the booking result | The booking number and status show after a successful create |
| 64 | Build my bookings | The list shows all nine statuses |
| 65 | Build booking details | Place, time, party size, note, and any rejection or cancellation reason show |
| 66 | Add cancel booking | The visitor can cancel before the appointment |
| 67 | Add the fake-report reply | A reported booking has a reply screen |
| 68 | Add the ban state | 15 days, then 45, then permanent is explained, and new bookings are blocked |
| 69 | Build the notification inbox | Booking and report notifications list, with unread marked |
| 70 | Open a booking from a notification | Tapping a notification opens that booking |
| 71 | Request push permission | The system permission dialog is requested when notifications are enabled |
| 72 | Register the device token | A granted token is sent through `register_device` as `android` or `ios` |
| 73 | Build my places | Linked places show name, type, and address |
| 74 | Show Premium status and pending requests | Each place shows whether Premium is active, its end date, and the waiting-request count |
| 75 | Search for a place to link | The owner can search places by name |
| 76 | Link a place with a DD- code | A valid code links the place immediately |
| 77 | Send a claim without a code | The request is submitted for the team to verify |
| 78 | Route a missing place to contact | If the place is not in the directory, the owner is sent to Contact us |
| 79 | Build the owner dashboard | The place summary and section list render |
| 80 | Add view as visitor | The owner can open the public place page |
| 81 | Edit immediate Premium fields | Phones, website, email, Facebook, Instagram, and both descriptions save for a Premium owner |
| 82 | Submit reviewed field changes | Name, type, address, and tourism class are sent as a review request |
| 83 | Build my requests | Pending, accepted, and rejected requests show the decision note |
| 84 | Build the weekly hours editor | Each day can have one or more open and close periods, up to 3. Ramadan is not shown |
| 85 | Save hours with `set_place_hours` | A Premium owner sees `saved`. Another owner sees that the week was sent for review (`requested`) |
| 86 | Build the amenities editor | The owner adds and removes amenities from the approved list |
| 87 | Pick a photo from the camera or gallery | A Premium owner can choose a photo |
| 88 | Compress a photo before upload | The long edge is reduced before the file is uploaded |
| 89 | Set cover, logo, and delete a photo | The owner can assign cover and logo and delete their own photo |
| 90 | Show the Premium lock on photos | A non-Premium owner sees the Contact us card and no upload tools |
| 91 | Create, stop, and delete an offer | A Premium owner can set title, details, optional image, and dates within 60 days |
| 92 | Show the Premium lock on offers | A non-Premium owner sees the same Contact us card |
| 93 | Request place removal or unlink | The owner can submit a removal request, or `request_unlink` for this account, with a reason |
| 94 | List place bookings | Name, phone, party size, time, note, status, and report flag show |
| 95 | Confirm or reject a booking | Reject can include an optional reason |
| 96 | Cancel a booking and mark attendance | Cancel requires a reason. Attended / no-show is only offered from 30 minutes before until 3 days after |
| 97 | Report a fake booking | One report per booking, with a reason |
| 98 | Build booking settings | Accept bookings, max party size, minimum notice, reply hours, and closed periods can be saved |
| 99 | Build owner notifications | New booking, reply window, visitor cancellation, and new report open the related booking |
| 100 | Replace theme tokens from Figma | The provisional palette in `core/theme` is swapped for the Figma tokens |
| 101 | Restyle shared widgets from Figma | Scaffold, cards, buttons, sheets, and states match the file |
| 102 | Visual pass on visitor screens | Tasks 16–50 and 52–72 match their frames |
| 103 | Visual pass on owner screens | Tasks 73–99 match their frames |
| 104 | Check Arabic RTL and English LTR | Both languages are checked on a phone-sized layout |

## Handoff that does not change the order

Staging URL and anon key, test accounts, Firebase and APNs files, the production map vendor, and confirmation that the app may call `POST /api/contact`.

Still needed from the client before the matching screens can run on staging:

- `search_places` (tasks 15–23 are built and have nothing to call)
- a push sender (task 72 only registers the token)
- the allowed `suggestions.kind` values
- confirmation that `POST /functions/v1/delete-account` still exists
- phone verification, only if visitor ratings move into a later build

Email and password stays the v1 sign-in. The 6-digit email code and Google can be added beside tasks 41–44 later without renumbering the rest.
