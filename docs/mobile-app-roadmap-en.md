# Dalil Dimashq mobile — roadmap

Flutter app for visitors and place owners. Staging is the API baseline.
The visual design is not ready. We build the app now with a provisional dark UI, then restyle it when the Figma Make file arrives. Repositories, navigation, and screen behavior stay. Only the theme and the shared widgets change.

Work goes in number order, one task at a time.

The urgent backend items are treated as available. The client is delivering them. The app integrates them.

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

## What we treat as already available

| Item | What the app will call |
|---|---|
| `profiles` | Own row: display name and phone. Read and update. Booking and account screens read this row. |
| Server search | One paged search: text, category, area, minimum stars, “has phone”, sort (completeness, rating, name), limit and offset. The phone never downloads the full directory. |
| Push | `register_device` plus a sender. The app asks permission, registers the token, and shows the inbox. The server sends the push. |
| Weekly hours write | The owner editor writes structured `place_hours` rows (weekday, open, close, one or more periods per day, season `regular`). That is the table visitors read and the source of “Open now”. |

Still out of this build: favorites, “near me” sorting, Ramadan hours, terms of use, contact channels driven by the admin panel, visitor ratings, recently viewed, an in-app report screen, booking tied to an offer, and an offers banner.

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

Errors branch on the Supabase `code` (`42501`, `22023`, `55000`, `54000`, `23505`, `P0002`), then the app shows an Arabic or English string.

## Task list

Status: tasks 1–30 are done. Next is task 31.

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
| 15 | Add the server search client | Domain, data, and BLoC return a page of places without loading the full directory |
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
| 30 | Add hours and Open now | Weekly hours render, and Open now / Closed now is computed in Damascus time |
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
| 45 | Add the 16+ age check | Account creation requires age 16 or older |
| 46 | Build the profile screen | Name and phone load from `profiles` and can be saved |
| 47 | Prefill booking from the profile | The booking form starts with the saved name and phone |
| 48 | Add language in settings | The choice persists |
| 49 | Add the notifications toggle | The toggle is stored and gates the later permission request |
| 50 | Add the privacy policy screen | The current policy opens inside the app |
| 51 | Add delete account | The signed-in user can delete the account |
| 52 | Add sign out | The token clears and the visitor shell returns |
| 53 | Build the contact form | Name, email or phone, type, and message submit, then a confirmation shows |
| 54 | Add contact shortcuts | WhatsApp, email, and social links use the current fixed values |
| 55 | Gate booking behind sign-in | Book is hidden unless the place accepts bookings, and it requires an account |
| 56 | Build date and time selection | Dates follow the horizon, and times respect notice and closed periods |
| 57 | Build party size, note, and submit | Party size stays within the max, the note stays within 300 characters, and there is no payment |
| 58 | Show the booking result | The booking number and status show after a successful create |
| 59 | Build my bookings | The list shows all nine statuses |
| 60 | Build booking details | Place, time, party size, note, and any rejection or cancellation reason show |
| 61 | Add cancel booking | The visitor can cancel before the appointment |
| 62 | Add the fake-report reply | A reported booking has a reply screen |
| 63 | Add the ban state | 15 days, then 45, then permanent is explained, and new bookings are blocked |
| 64 | Build the notification inbox | Booking and report notifications list, with unread marked |
| 65 | Open a booking from a notification | Tapping a notification opens that booking |
| 66 | Request push permission | The system permission dialog is requested when notifications are enabled |
| 67 | Register the device token | A granted token is sent through `register_device` as `android` or `ios` |
| 68 | Build my places | Linked places show name, type, and address |
| 69 | Show Premium status and pending requests | Each place shows whether Premium is active, its end date, and the waiting-request count |
| 70 | Search for a place to link | The owner can search places by name |
| 71 | Link a place with a DD- code | A valid code links the place immediately |
| 72 | Send a claim without a code | The request is submitted for the team to verify |
| 73 | Route a missing place to contact | If the place is not in the directory, the owner is sent to Contact us |
| 74 | Build the owner dashboard | The place summary and section list render |
| 75 | Add view as visitor | The owner can open the public place page |
| 76 | Edit immediate Premium fields | Phones, website, email, Facebook, Instagram, and both descriptions save for a Premium owner |
| 77 | Submit reviewed field changes | Name, type, address, and tourism class are sent as a review request |
| 78 | Build my requests | Pending, accepted, and rejected requests show the decision note |
| 79 | Build the weekly hours editor | Each day can have one or more open and close periods. Ramadan is not shown |
| 80 | Save hours to place_hours | Saving writes the structured rows visitors read |
| 81 | Build the amenities editor | The owner adds and removes amenities from the approved list |
| 82 | Pick a photo from the camera or gallery | A Premium owner can choose a photo |
| 83 | Compress a photo before upload | The long edge is reduced before the file is uploaded |
| 84 | Set cover, logo, and delete a photo | The owner can assign cover and logo and delete their own photo |
| 85 | Show the Premium lock on photos | A non-Premium owner sees the Contact us card and no upload tools |
| 86 | Create, stop, and delete an offer | A Premium owner can set title, details, optional image, and dates within 60 days |
| 87 | Show the Premium lock on offers | A non-Premium owner sees the same Contact us card |
| 88 | Request place removal | The owner can submit a removal request |
| 89 | List place bookings | Name, phone, party size, time, note, status, and report flag show |
| 90 | Confirm or reject a booking | Reject can include an optional reason |
| 91 | Cancel a booking and mark attendance | Cancel requires a reason. Attended / no-show is only offered from 30 minutes before until 3 days after |
| 92 | Report a fake booking | One report per booking, with a reason |
| 93 | Build booking settings | Accept bookings, max party size, minimum notice, reply hours, and closed periods can be saved |
| 94 | Build owner notifications | New booking, reply window, visitor cancellation, and new report open the related booking |
| 95 | Replace theme tokens from Figma | The provisional palette in `core/theme` is swapped for the Figma tokens |
| 96 | Restyle shared widgets from Figma | Scaffold, cards, buttons, sheets, and states match the file |
| 97 | Visual pass on visitor screens | Tasks 16–54 and 55–67 match their frames |
| 98 | Visual pass on owner screens | Tasks 68–94 match their frames |
| 99 | Check Arabic RTL and English LTR | Both languages are checked on a phone-sized layout |

## Handoff that does not change the order

Staging data and test accounts, Firebase and APNs files, the production map vendor, and confirmation that the app may call `POST /api/contact`. Email and password is the v1 sign-in. An email code can replace tasks 41–44 later without renumbering the rest.
