# Dalil Dimashq: Mobile App Pre-Development Analysis

Reviewed on 16 Oct 2026 against the live site (https://dalil-dimashq.com) and `docs-api/dalil-openapi.yaml` (version `2026-10-13`, written by hand from website commit `f388f23` and app commit `0ad2e6a`).

---

## 0. Executive summary

- **There is no custom backend.** The site is a static, single-page Netlify site with a large inline script and Leaflet maps. It talks **directly to Supabase**: PostgREST tables and views, database functions (RPCs), Auth and Storage. A few Netlify Functions handle SEO pages, share images, the sitemap and the contact form. A mobile app would use the Supabase SDK the same way.
- **A mobile app already exists in some form.** The OpenAPI file refers again and again to a `dalil-app` repository (Dart/Flutter files such as `supabase_owner_repository.dart`, `supabase_auth_repository.dart`) and to an app-only Edge Function (`delete-account`). The privacy policy describes "تطبيق دليل دمشق" in detail: email OTP login, bookings, push notifications, location, camera. **The first thing to clarify is whether you are continuing that app, replacing it, or starting from scratch.**
- **Bookings are staging-only.** The booking endpoints return `404` on production (checked: `booking_settings` and `booking_availability` both return 404 on the production project). The booking backend is designed in full, but not live.
- **Guest ratings don't exist yet.** The stars on the site are the official hotel class or a rating taken from OpenStreetMap. The site says so itself: "Guest ratings, confirmed by phone number, are coming soon." A `ratings` table exists (the admin page moderates "held" ratings), but there is **no documented API to submit or read ratings**.
- **Several things the site depends on are not in the OpenAPI file:** `/api/contact`, the `ratings`, `featured`, `payments` and `staff` tables, user profile data, the "suggestions/corrections" storage described in the privacy policy, and how phone numbers are verified.
- **Most of the directory logic runs in the browser:** search, filters, sorting, the "open now" status, the listing-completeness score, counts and street names. The app must either copy this logic or get new server-side endpoints.
- **Current data is sparse,** and the UI must be designed for that. Of 920 places, only 125 have a phone number and 18 have any star rating; there are 4 featured places and 2 live offers. Most places have no photos.

---

## 1. Website features (current state)

### 1.1 Technical architecture observed

| Layer | What it is |
|---|---|
| Hosting | Netlify (static HTML plus Netlify Functions) |
| Data | Supabase project `dqaapapjdvhoaskfwxoy` (production), queried directly from the browser with the publishable key in `/config.js` |
| Map | Leaflet with base layers: OpenStreetMap, OSM.de, OpenTopoMap, Esri Street, Esri Imagery (plus transport and boundary overlays) |
| Reverse geocoding | Nominatim and Photon (komoot), called from the browser to show a street name for each place's coordinates |
| Email | Resend (contact form, OTP codes), according to the privacy policy |
| Push | Firebase Cloud Messaging is named in the privacy policy (app only, not yet wired, see §4) |
| Fallbacks | Supabase first, then a cached copy in the browser, then `/fallback.json` (a static snapshot of about 368 KB), then the legacy `/api/edits` (Netlify Blobs) |
| Local storage keys | `dalil-lang`, `dalil-sort`, `dalil-base` (map type), `dalil-addr-v1` (geocoded street cache), plus a session flag for "offers popup seen" |

### 1.2 Public directory (home page `/`)

1. **Bilingual Arabic and English** with RTL/LTR switching. The chosen language is remembered.
2. **Hero section** with the tagline and live **counters** (All 920, Hotels 125, Restaurants 638, Cafés 157). The counters also work as category shortcuts.
3. **Search** over name, Arabic/English/alternate names, cuisine, description, area and type. It runs entirely in the browser.
4. **Filters:**
   - Category: All, Hotels, Restaurants, Cafés
   - Minimum star rating, with a warning that few places are rated
   - Area, using a type-ahead text field
   - Sort: "most complete info", "highest rated" or "name A–Z" (remembered)
   - "Has phone number" toggle
   - "Clear filters"
5. **Featured places carousel.** These are paid placements labelled "★ Featured: paid picks from place owners", read from the `featured_now` view.
6. **Results list** with "View more (10)" pagination done in the browser. Each card shows the name in both languages, type, area, featured badge, stars or "Not rated", and a logo or thumbnail.
7. **Interactive map** of all places, with zoom and a choice of map type.
8. **Offers & events carousel** with photo, title and a "Visit the place page" link. An **offers popup** appears once per browser session.
9. **Call-to-action blocks:**
   - "Own a place? Register your place or sign in", which links to `/owner/`
   - "Help us complete the directory: Send a note", which links to `/contact/`
10. **Footer** with SEO links (Damascus cafés, restaurants, hotels), contact, privacy, and OSM attribution and disclaimer.

### 1.3 Place detail (`/?p=<id>` in the single-page app; `/{cafe|restaurant|hotel}/{slug}-{id}` rendered on the server for SEO)

- Cover photo header, logo, Arabic and English names, type, area, featured badge, stars with their source ("Rating recorded on the map").
- **Action buttons:** Directions (Google Maps link), Call (`tel:`), Copy number, Website or Contact page.
- **Current offers** (title, details, photo, "until" date).
- **Photo gallery** with a full-screen lightbox.
- **Overview:** an automatically generated sentence (type, area and hours) plus the description.
- **Services and amenities** list (Wi-Fi, family section, shisha, AC, live music, e-payment, breakfast, and so on).
- **Location:** address, area, an embedded mini-map and a street name looked up from the coordinates.
- **Opening hours:** a weekly table with "Open now / Closed now" and today highlighted. Only the `regular` season is used.
- **Contact:** phones (with copy), Facebook, Instagram, website, email.
- **"Listing completeness: X of 6"** score, calculated in the browser from phone, web/social, map, hours, description and cuisine.
- **Share / SEO:** server-rendered HTML with JSON-LD and a 1200×630 share image (`/og/{id}-{hash}.jpg`).

### 1.4 SEO pages (Netlify Functions)

- `/cafes/`, `/restaurants/`, `/hotels/`: category lists.
- `/{list}/{area}/`: category list for one area (for example `/restaurants/bab-sharqi/`).
- `/sitemap.xml`; `robots.txt` blocks `/admin/`, `/owner/` and `/api/`.

### 1.5 Contact page (`/contact/`)

- Form fields: name, email or mobile, request type (General, Add a facility, Partnership, Other), message (up to 3000 characters), and a hidden "Website" honeypot field to catch spam bots.
- Submits to **`POST /api/contact`** (a Netlify Function). The message is emailed to the team and is not stored in a database. Spam is limited per IP hash.
- Hard-coded channels: WhatsApp (`wa.me/message/UID3HXZI4KAIF1`), `info@dalil-dimashq.com`, Facebook and Instagram pages, location "Damascus, Syria".
- Includes a hint pointing owners to the owner portal.

### 1.6 Privacy policy (`/privacy/`)

A static, bilingual page (last updated 16 Oct 2026). It already describes the **app**: registration fields, OTP login, bookings, fake-booking reports, location, camera, push, account deletion and an age limit of 16+. It names Netlify, Supabase, Resend, FCM, Google Fonts, the map providers, Nominatim and Photon.

### 1.7 Owner portal (`/owner/`)

- **Auth:** sign up (name, email, password of at least 10 characters, with a warning when the keyboard is set to Arabic), sign in with email and password, "Forgot password", and setting a new password.
- **Linking to a place:**
  - Search for the place by name.
  - **With a secret code** (`DD-…`), linked immediately through `claim_with_code`.
  - **Without a code:** a claim request (`change_requests`, kind `claim`); the team calls the place to verify.
  - If the place isn't listed, the owner is told to message the team on WhatsApp.
- **My places,** and **My requests for this place** (request status).
- **Edits that go live immediately** (Premium only, according to the API): phones, opening hours (as OpenStreetMap text such as `Mo-Su 09:00-24:00`), website, email, Facebook, Instagram, Arabic and English descriptions, amenities. The Ministry of Tourism class is reviewed first and shows as "verified" once the licence has been checked.
- **Edits that are reviewed first:** Arabic and English names, type (Café, Restaurant, Fast food, Hotel, Guest house, Hostel, Motel), address.
- **Premium only:** upload photos (compressed in the browser), choose the cover and logo, and create offers (title, details, optional photo, From and To dates, at most 60 days). Premium is bought offline ("Contact us to subscribe"); there is no online payment.

### 1.8 Admin back office (`/admin/`). Out of scope for the app, but it exists

It covers: places CRUD, photos, hours, amenities, change-request moderation, linking owners, place codes, subscriptions **and payments**, featured slots, **held ratings moderation**, fake-booking reports, bans and the no-show watch.

---

## 2. API documentation vs website

### 2.1 What the API covers that the website uses (aligned)

`places`, `areas`, `amenities`, `place_amenities`, `place_hours`, `photos`, `offers`, `featured_now`, `place_owners`, `subscriptions`, `change_requests`, RPCs `claim_with_code`, `set_cover_photo` and `set_logo_photo`, public Storage photo URLs, and the Netlify SEO, sitemap and share-image endpoints.

### 2.2 On the website but not (or only partly) covered by the API documentation

| # | Website feature or dependency | Gap |
|---|---|---|
| 1 | **Contact form `POST /api/contact`** | Not documented at all: request body, validation, rate limit, errors, and whether a mobile client may call it (it rate-limits by IP). |
| 2 | **Suggestions and corrections** ("Help us complete the directory") | The privacy policy says suggestions are stored with an IP hash, but no table or endpoint is documented. The website currently just links to the contact page. |
| 3 | **`ratings` table** | Used by the admin page (`status = held / counted`). No documented read or write path for clients. `place_scores` exists but "no client uses it". |
| 4 | **`featured` table** | Only the `featured_now` view is documented, and it returns `place_id` and `type` only: no order, priority, start/end dates or campaign text. |
| 5 | **`payments`, `staff` tables** | Used by the admin page and undocumented. Not needed by the app unless owners should see their billing history. |
| 6 | **User profile data** | The app collects first/last name, phone, birth year, account type and language (privacy policy). No `profiles` table or RPC is documented. The owner portal "Your name" field probably lives in Auth user metadata, but this needs confirming. |
| 7 | **Authentication** | Left out on purpose ("see the Supabase docs"). Still undocumented: password rules, redirect URLs, OTP length and expiry, email templates, **how a phone number becomes "verified"** (this gates `report` change requests and bookings), and how the two flows (web password vs app OTP) work on the same account. |
| 8 | **Storage upload rules** | Bucket policies, the path convention (`<place_id>/…`, `thumbs/`, `offers/`), size and type limits, the compression settings and who generates `thumb_path`. None of this is described. |
| 9 | **Search** | The site downloads every place (paging 1000 rows at a time) and filters in the browser. There is no search, nearby or full-text endpoint. |
| 10 | **Calculated values** | "Open now", the listing-completeness score, category counts, "N with phone · N rated" and the overview sentence are all browser logic with no API equivalent. |
| 11 | **Reverse geocoding** | Done in the browser through public Nominatim and Photon. These are not backend services, and their usage policies don't allow heavy use from an app. |
| 12 | **Map tiles** | Public OSM, OpenTopoMap and Esri servers. OSM's tile policy forbids heavy app traffic without your own tile provider. |
| 13 | **Offline fallback** | `/fallback.json` and the browser cache. Not documented, and there's no "last modified" or delta-sync mechanism. |
| 14 | **Legacy `/api/edits`** | Deprecated, but the public site still reads it as a fallback. The app should ignore it. |
| 15 | **Owner hours editing** | The owner portal edits `places.osm_hours` (free text in OSM syntax), while the directory reads `place_hours` (structured). How one gets synced to the other is not documented. |
| 16 | **Request bodies** | `PATCH` bodies are typed as a generic `object`, so the spec doesn't list which columns each role may change. That's only given in prose, for example "Premium owners: contact, hours text, description only". |
| 17 | **Referenced but missing docs** | `supabase/bookings.md` (booking rules and error codes) and open PR #20 (fake-report visibility). |

### 2.3 In the API documentation but not on the website

| Feature | API surface | Status |
|---|---|---|
| **Bookings, customer side** | `booking_availability`, `create_booking` (idempotent `p_client_key`, optional offer, note), `cancel_booking`, `booking_list` | Staging only, called by the existing app |
| **Bookings, owner side** | `confirm_booking`, `reject_booking`, `owner_cancel_booking`, `mark_booking` (attended / no-show), `booking_settings`, `set_booking_options`, `booking_response_hours`, `booking_blackouts` | Staging only |
| **Fake-booking reports and bans** | `report_fake_booking`, `reply_fake_report`, `fake_reports`, `booking_bans`, staff `decide_fake_report`, `lift_booking_ban`, `staff_no_show_watch` | Staging only |
| **In-app notifications** | `notifications` table (12 kinds), mark as read through `read_at` | Staging only |
| **Push device registration** | `register_device` (android/ios/web) | Exists, **no client calls it and no push sender exists** |
| **Account deletion** | Edge Function `POST /functions/v1/delete-account` | App only (required by Apple and Google) |
| **Email OTP sign-in** | Supabase Auth | App only (the web uses a password) |
| **User reports and removal requests** | `change_requests` kinds `report` (phone-verified users) and `remove` (owners) | Not exposed on the website |
| **Place scores** | `place_scores` view (`rating_count`, `score`) | Not used by anyone |
| **Ramadan hours** | `place_hours.season = ramadan` | The website only requests `regular` |
| **Admin-only helpers** | `renew_place_code`, `set_booking_enabled` | No caller |
| **Extra place fields** | `fax`, `photos.caption`, `tourism_class_verified`, `tourism_class_by` | Not all are shown on the site |

---

## 3. Static, hardcoded or not backend-driven content

| Element | Where | Notes |
|---|---|---|
| Contact channels (WhatsApp, email, Facebook, Instagram, location) | `/contact/` HTML | Hard-coded. Meanwhile `config.js → contact.whatsapp / email` is **empty**, so the home page's WhatsApp and email buttons are hidden and only the owner and contact links appear. |
| All interface text (hero tagline, "coming soon", "About ratings", owner portal help, Premium marketing text) | Inline translation dictionary in the page script | No CMS. The app needs its own copy (or a remote-config table). |
| Category and place-type list and their labels | Inline `TYPES` map | Matches the `PlaceType` enum but is not served by an API. |
| Star ratings | `places.stars` (OSM or ministry data) | Fixed data, **not user reviews**. "Highest rated" sorting is based on this. |
| Premium subscription and pricing | Owner portal text, "Contact us to subscribe" | No pricing, plans or checkout. Admins record payments by hand. |
| Featured placements | `featured_now` | Dynamic, but sold and managed offline. |
| Map layer list, attribution, disclaimers | Inline | Fixed. |
| Privacy policy | Static HTML | No **Terms of Service** page exists. |
| Contact page background photo (Pexels credit) | Static asset | |
| `/fallback.json` | Static snapshot built by a script | Can be out of date compared with the database. |
| Counters, featured places, offers, areas, amenities, photos, hours | Supabase | **Dynamic**: these come from the backend. |
| "Listing completeness", "Open now", the overview sentence | Browser calculation | Dynamic data, but the logic lives only in the browser. |

---

## 4. Missing functionality and technical requirements before development

### 4.1 Blockers (resolve first)

1. **The existing `dalil-app` codebase.** Get access, decide whether to reuse, rewrite or keep it, and find out whether it's already in the stores (bundle IDs, store listings).
2. **Bookings go-live plan.** The booking migrations are on staging only. When does production get them, and is booking in v1 of the app?
3. **Environments.** Staging and production project refs and publishable keys, and permission to create test data on staging.
4. **Push notifications.** `register_device` and `notifications.pushed_at` exist, but **nothing sends the pushes**. Something needs to be built: an Edge Function or DB webhook that sends through FCM/APNs, a Firebase project, an APNs key, and notification wording in Arabic and English.
5. **User profile model.** Where first/last name, phone, birth year, account type and language are stored, plus the read/update API and validation rules.
6. **Phone verification.** Required for bookings ("confirmed email or phone") and for reports. Decide how it works: SMS OTP provider? WhatsApp? What does it cost in Syria?
7. **Ratings.** If ratings are in the app's scope, the backend needs a `submit_rating` path and a documented public read (probably `place_scores`), plus moderation rules ("held" ratings) and the phone-verification requirement.

### 4.2 Recommended new or extended endpoints

| Need | Why | Suggestion |
|---|---|---|
| Server-side search and paging | Downloading every place breaks down as the "Syria-wide" plan grows, and is costly on mobile data | RPC `search_places(query, type, area, min_stars, has_phone, sort, limit, offset)` with full-text search and Arabic normalisation |
| Nearby places | The privacy policy promises "suggest places near you" | RPC `nearby_places(lat, lon, radius)` (PostGIS or earthdistance) |
| Place detail in one request | Fewer round trips | View or RPC `place_detail(id)` returning place, hours, amenities, photos, offers, featured flag and score |
| "Open now" and completeness | Keep the website and app consistent | Calculate in SQL (view columns) instead of copying the browser logic |
| Street name | Stop calling Nominatim from phones | Store `street_ar/street_en` in `places` once, on the server |
| Delta sync / cache invalidation | Offline mode, fast start-up | `updated_at` filters (already in the schema) plus a "data version" endpoint |
| Contact and suggestions | Native forms | Document `/api/contact`, or add a `submit_feedback` RPC with app-friendly rate limits |
| Favourites / saved places | Expected in mobile directories (doesn't exist today) | `favorites` table with RLS, **if the client wants it** |
| Remote config | Contact channels, feature flags (bookings on/off, ratings coming soon), minimum app version for forced updates | `app_config` table or Supabase Remote Config |
| Owner billing view (optional) | Owners see when Premium ends | Owners can already read `subscriptions`; decide whether `payments` should be exposed |

### 4.3 Platform and technical requirements

- **Deep links and universal links.** Host `/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json` on Netlify so `/{section}/{slug}-{id}` and `/?p=id` open the app. The place id is the part after the last hyphen.
- **Map provider.** Choose a production tile source (Mapbox, MapTiler, Google Maps or self-hosted) and its API keys and costs. Check availability and sanctions restrictions for Syria: some providers (Google, Mapbox and others) restrict accounts or billing for Syria, so this must be checked.
- **Store-related availability in Syria.** Apple Developer and Google Play account ownership, which countries the app is distributed in, and whether Firebase and FCM work reliably for Syrian users. Access to some Google and US cloud services from Syria has historically been restricted, so test sign-in, push and maps from a Syrian network early.
- **Auth configuration.** OTP email template and sender (Resend), OTP length (6 digits according to the privacy policy) and expiry, deep-link redirect URLs, session storage, sign-in with Apple (required by Apple only if other social logins are added).
- **Error handling.** Branch on SQLSTATE `code` (`42501`, `22023`, `55000`, `54000`, `23505`, `P0002`), not on HTTP status. Server messages are in plain English, so the app needs **its own Arabic and English error messages**.
- **Time zone.** Bookings use `Asia/Damascus`. Show and calculate all times in that zone, whatever the phone's own time-zone setting.
- **Image handling.** Use `thumb_path` in lists and `storage_path` in detail views. Copy the website's client-side compression for owner uploads (ask for its settings).
- **Store compliance.** Account deletion (exists), App Store privacy labels and the Play Store Data Safety form (match the privacy policy), an age gate (16+), **moderation of user-generated content** (Apple guideline 1.2 applies once ratings and reports exist), and a **Terms of Use page (missing)**.
- **Analytics and crash reporting.** The privacy policy says "no third-party analytics". Adding Crashlytics, Sentry or Analytics means **updating the privacy policy** first.
- **Offline behaviour.** Decide whether the directory must work offline, as the website's fallback snapshot suggests.

---

## 5. Questions and items to request from the client

### 5.1 Scope and product

1. Is there an existing Dalil Dimashq mobile app (`dalil-app`)? What state is it in, is it published, and why is a new one being built?
2. Which user types does the app serve in v1: **visitors only**, **visitors and owners**, or also staff and moderators?
3. Is **booking** in v1? When will it reach production? Do bookings need a payment or deposit (the privacy policy says "no payments")?
4. Are **guest ratings and reviews** in v1? Stars only, or text reviews too? What are the moderation rules?
5. Should the app include **favourites, recently viewed, or sharing**?
6. Should visitors be able to **report wrong info or a closed place** from inside the app (kind `report`, which needs phone verification)?
7. Is **Premium purchase** in the app (in-app purchase rules apply) or does it stay offline? What are the plans and prices?
8. Should owners manage **photos, offers, hours and bookings** in the app, or only on the web?
9. Offers: can a visitor **book with an offer**? Does the offer popup stay?
10. Is Ramadan-season opening-hours support needed?
11. Expansion plans ("Syria-wide guide"): other cities or categories (landmarks are mentioned in the privacy policy)? This affects navigation and the data model.
12. Must the app work **offline**?

### 5.2 Backend and technical

13. Access to the **website repo** (`f388f23`), the **app repo** (`0ad2e6a`), `supabase/migrations`, and **`supabase/bookings.md`**.
14. Supabase **staging and production** project refs, publishable keys, and dashboard access (at least read-only), or a named backend contact.
15. Who maintains the backend? Can new RPCs, views and tables be added (search, nearby, ratings, profiles, favourites, push sender)?
16. The schema and RLS for `ratings`, `featured`, `payments`, `staff`, the **profile** storage, and the **suggestions** storage.
17. The full `/api/contact` contract, and whether the app may use it.
18. How phone numbers are **verified**, and with which provider.
19. Storage bucket policies, upload limits, thumbnail generation, compression settings.
20. How `places.osm_hours` (text) and `place_hours` (rows) are synced.
21. Is a push sender planned? Is there a Firebase project and an APNs key?
22. Rate limits (bookings: 3 open and 4 per hour; daily change-request limits) and the exact error messages.
23. Status of the open PR #20 (fake-report visibility).

### 5.3 Accounts, credentials, assets

24. Apple Developer and Google Play accounts (or an invitation to them), the legal entity name (Commercial Register no. 0110098519), bundle and package IDs.
25. Test accounts for each role: visitor, free owner, **Premium owner** with a linked place, editor, moderator, admin. Also a test place with a `DD-` code.
26. Brand assets: logo (vector), app icon, splash screen, colour palette, fonts (Arabic and Latin names and licences), the Islamic-pattern background artwork, and category placeholder images for places without photos.
27. Map provider account and keys (or approval of costs).
28. Resend and SMTP access for OTP email templates, plus the sender name and address.
29. Domain/Netlify access to publish the deep-link verification files.
30. Copy: app store descriptions in Arabic and English, onboarding text, notification texts, and the **Terms of Use**.
31. Confirmation of the official contact channels (the WhatsApp and email in `config.js` are empty).
32. Requirements for analytics, crash reporting and an admin dashboard (they affect the privacy policy).

---

## 6. Mobile UI/UX recommendations (for Figma Make)

### 6.1 Navigation and information architecture

- Use a **bottom tab bar** instead of the web top menu:
  - Explore (list)
  - Map
  - Offers
  - Bookings (only if in scope)
  - Account

  Owners get an extra "My place" area or a role switcher.
- The **web hero fills the entire first phone screen** (tagline, paragraph, search, four counters), and the results only start further down. In the app, use a compact header with a **sticky search bar** and turn the counters into **category chips** that scroll sideways.
- Replace the web filter bar with a **filter bottom sheet** (category, minimum stars, area as a searchable list, has phone, sort). Show a badge with the number of active filters.

### 6.2 List and map

- Offer a **List/Map toggle**, or a map with a list in a draggable bottom sheet. With 920+ pins the map needs **marker clustering**. Tapping a pin opens a preview card.
- Add a **"Near me"** sort or filter that asks for location permission only when tapped (the privacy policy already covers it).
- Replace "View more (10)" with **infinite scroll** and skeleton loaders. The web showed empty panels while loading.
- **Design for sparse data:** most places have no photo, phone or rating. Prepare category placeholder artwork and a "Not rated yet" state, and don't leave empty sections.

### 6.3 Place detail

- A **collapsing cover header** with logo, both names, type, area and featured badge. If there's no cover photo, use a branded placeholder.
- A **sticky action bar:** Call, Directions, Share, Save, and Book when booking is on. Drop "Copy number" as a button; make it a long-press on the number instead.
- Order of sections: offers, photos (swipeable, full screen with pinch-to-zoom), overview, amenities (**icon grid**), location (static map preview that opens a full map or the external maps app), hours (collapsed with an "Open now / Closes at 01:00" chip), contact and social links.
- Reconsider showing **"Listing completeness X of 6"** to visitors. It's more useful in the owner dashboard as a "complete your profile" nudge.
- Label where stars come from ("Hotel class" vs "Map rating"). **Don't design review lists or a "write a review" flow unless ratings are confirmed in scope.**

### 6.4 Bilingual and RTL

- Design **Arabic RTL as the main layout** and generate an LTR English version as well. Mirror directional icons (back arrows, carousels, chevrons). Use Arabic-friendly fonts and line heights.
- Place names may be in Arabic only, English only, or both. Design cards that work with one name or two, and with long Arabic names.
- Decide on **numerals** (Western or Arabic-Indic) and on date and time formats in Arabic (the web uses the Levantine month names "تشرين الأول").
- Put the language toggle in Settings (and on onboarding), not in the header.

### 6.5 Offers and featured

- A dedicated **Offers tab or feed**, with expiry ("Until 24 Oct" or a countdown) and a link to the place (and to booking with the offer, if in scope).
- Show **Featured** places as a horizontal carousel at the top of Explore, with a clear "Sponsored/Featured" label (it's paid placement).
- Replace the web's session popup with a less intrusive banner or story-style card.

### 6.6 Booking flow (if in scope), designed around the API

- Date picker limited to `horizon_days` and `last_date`, **time slots** every `slot_minutes`, respecting `minimum_booking_notice_minutes`, `closed` periods and `response_hours`.
- Party size stepper up to `max_party`, name and phone pre-filled from the profile, a note of up to 300 characters, an optional offer.
- Show "Owner usually responds by …" using `responding_now` and `next_response_at`, and a `respond_by` countdown.
- Status screens for all 9 statuses (`waiting`, `pending`, `confirmed`, `rejected`, `expired`, `cancelled_by_customer`, `cancelled_by_owner`, `attended`, `no_show`), plus screens for "limit reached", "banned until …" and "reply to a fake-booking report".
- Owner inbox: confirm, reject (optional reason), cancel (reason required), mark attended or no-show (from 30 minutes before to 3 days after the booking), report fake booking. Owner settings: accepting on/off, maximum party size, minimum notice, response hours, blackout periods (60 days at most).

### 6.7 Accounts and owner tools

- **Visitor sign-in:** email → 6-digit OTP screen (with code autofill). Profile set-up: first/last name, phone, birth year (16+ age gate), account type. Settings include **Delete account**.
- **Owner:** the "Link your place" flow (search → enter `DD-` code, or send a request) and a **My place dashboard**.
  - Mark clearly which edits are **live immediately** and which are **reviewed by the team**.
  - Lock Premium features (photos, cover/logo, offers) behind an upsell card.
  - Use a **structured weekly hours editor** instead of OSM text like `Mo-Su 09:00-24:00`, which is unusable on a phone keyboard.
  - Photo manager: camera or gallery, reorder, set cover or logo, delete.
  - Offer editor: date range of at most 60 days, photo.
  - "My requests" list with status.
- A native **Contact / Send feedback** screen with request-type chips, plus WhatsApp and email shortcuts.

### 6.8 States and resilience

Design these states for every screen: loading (skeletons), empty, error (Arabic and English messages mapped from SQLSTATE codes), offline (cached data and a "Last updated" banner), no permission (location, camera, notifications), and booking or Premium features turned off.

### 6.9 Tips for prompting Figma Make

- Give it **real sample data** from the API (a few `places` rows with and without photos, `offers`, `place_hours`, `amenities`) and the enum lists (`PlaceType`, `BookingStatus`, notification kinds). That stops it from inventing fields.
- List explicitly the features that **do not exist** (reviews, favourites, payments, chat), so they don't appear in the generated screens until the client approves them.
- Ask for screens in **both RTL Arabic and LTR English**, and for component variants (card with or without photo, open or closed, featured or not, Premium or free owner).
- Reuse the web brand: dark teal and charcoal, gold accents, the eight-pointed star logo and the geometric pattern.

---

## Appendix A: Live data snapshot (16 Oct 2026)

| Metric | Value |
|---|---|
| Places | 920 (125 hotels, 638 restaurants, 157 cafés) |
| With a phone number | 125 |
| With a star rating | 18 |
| Featured now | 4 |
| Live offers | 2 |
| Production booking endpoints | Not present (404) |

## Appendix B: API calls made by each web page

- **Home:** `places`, `areas`, `featured_now`, `place_hours?season=eq.regular`, `place_amenities`, `offers`, `photos` (cover/logo and featured), Storage public URLs, `/api/edits` (fallback), `/fallback.json`.
- **Owner portal:** Auth (`signUp`, `signInWithPassword`, `resetPasswordForEmail`, `updateUser`); tables `places`, `areas`, `amenities`, `place_amenities`, `photos`, `offers`, `place_owners`, `subscriptions`, `change_requests`; RPCs `claim_with_code`, `set_cover_photo`, `set_logo_photo`; Storage `place-photos`.
- **Contact:** `POST /api/contact` (undocumented).
- **Admin:** all of the above plus the undocumented tables `ratings`, `featured`, `payments`, `staff`; RPCs `decide_request`, `link_owner`, `place_code`, `staff_user_contacts`, `staff_owner_list`, `decide_held_ratings`, `decide_fake_report`, `lift_booking_ban`, `staff_no_show_watch`; tables `fake_reports`, `booking_bans`.
