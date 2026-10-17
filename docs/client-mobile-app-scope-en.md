# Dalil Dimashq — What the mobile app delivers

This file describes the mobile app screens and what each screen offers, for the visitor and for the place owner.
After that is a summary of what exists today on the website and in the APIs, and the fields each part relies on, so it is clear what the app is built on and what is still missing.

The agreed scope for the first release: visitor and place owner, booking without payment and with sign-in, the owner managing photos, offers, hours, and bookings, and notifications. The interface is dark, in Arabic and English, on Damascus time.

---

# 1. Visitor screens

## 1.1 Welcome and language

- Choose the language (Arabic or English) and keep the choice.
- A short introduction to the app, then enter the directory without an account.
- An account is required only when booking or when opening “My account”.

## 1.2 Explore

- A fixed search bar.
- Category chips: All, Hotels, Restaurants, Cafés, with the count.
- A horizontal strip of featured places (paid placement, with a clear badge).
- Results list: name in both languages, type, area, photo or a fallback image, featured badge, stars or “Not rated”, and open/closed when hours exist.
- Scroll to load more.

## 1.3 Search and results

- Search by name, cuisine, street, and area.
- Results come from the server in pages (the whole directory is not loaded at once).
- An empty state when there are no results, and an error state with retry.

## 1.4 Filters

A bottom sheet with:

- Category
- Minimum star rating
- Area (a searchable list)
- “Has a phone number”
- Sort: most complete, highest rated, name
- Clear filters, and a badge with the number of active filters

## 1.5 Map

- All places on the map, with marker clustering.
- Tapping a marker opens a preview card, and from there the place page.
- Switch between the list and the map.
- “Near me” asks for location permission only when tapped. Sorting by distance is added later; in the first release the map and location work, and nearest-place suggestions wait for a dedicated API.

## 1.6 Place page

- Cover, logo, both names, type, area, and a featured badge when one exists.
- The source of the stars is clear: the hotel class, or a rating recorded on the map (not visitor reviews yet).
- Actions: call, directions, share. Long-press copies the number.
- **Book** appears when booking is enabled for this place, and it requires sign-in.
- Sections: current offers, photos, overview, amenities, location on the map, hours with “Open now / Closed now”, and contact (phone, website, Facebook, Instagram, email).

## 1.7 Photo gallery

- Full-screen swipe through photos, with zoom.
- When there are no photos: a fallback image by category (restaurant, café, hotel).

## 1.8 Offers

- List of current offers: title, details, image, “until” date.
- Opening an offer leads to the place page.
- Booking with a specific offer appears if it is confirmed as in scope.

## 1.9 Events

- Published events: title, venue, time, poster.
- Opens the event page (description, address, phone when present, and a link to the place when the event is tied to one).

## 1.10 Sign-in and registration

- Sign in with email (password, or a code sent to the email — the final method is still to be confirmed).
- Create an account and the profile fields (at least name and phone; the remaining fields are still to be confirmed).
- Email confirmation, and password recovery if the method is a password.
- Age 16 or older when creating an account.

## 1.11 Profile

- View and edit the name and phone number (and any fields agreed later).
- These details are filled in automatically on the booking form.

## 1.12 Start a booking

Shown after sign-in, and only when booking is available for the place:

- Choose a date within the available days.
- Choose a time from the place’s slots, respecting the minimum notice and closed periods.
- Party size up to the maximum.
- Name and phone (from the profile, and editable), and a note of up to 300 characters.
- A linked offer if the visitor selected one.
- A note: “The place usually replies before …”.
- No payment and no deposit.
- After sending: a booking number and its status.

## 1.13 My bookings

- A list of bookings and the status of each: pending, awaiting reply, confirmed, rejected, completed, cancelled by the visitor, cancelled by the place, attended, no-show.
- Booking details: place, time, party size, note, and the rejection or cancellation reason when one exists.
- Cancel a booking before its time.
- If there is a fake-booking report: a screen to reply to it.
- If the account is banned from booking: show the duration (15 days, then 45, then permanent) and block new bookings.

## 1.14 Notifications

- A list of booking and report notifications, with unread ones marked.
- Opening a notification goes to the booking details.
- Ask for phone notification permission, and allow turning them off in settings.
- Notification copy is a first draft and can be changed later.

## 1.15 Contact us

- Name, email or phone, request type (general, add a place, partnership, other), and the message.
- A confirmation message after sending.
- Shortcuts for WhatsApp, email, and social accounts (initial values until they are managed from the admin panel).

## 1.16 Account and settings

- Language.
- Notifications.
- Privacy policy.
- Delete account.
- Sign out.

---

# 2. Place owner screens

These appear after sign-in, and they are separate from the visitor screens. The owner manages photos, offers, hours, and bookings.

## 2.1 My places

- A list of linked places: name, type, address, whether Premium is active and its end date, and the number of requests waiting for review.

## 2.2 Link a place

- Search for the place by name.
- **With a code** that starts with `DD-`: the link is immediate.
- **Without a code:** send a request, and the team contacts the place to verify it.
- If the place does not exist: send the owner to Contact us to add it.

## 2.3 Place dashboard

- Summary: name, subscription status, and “See it as the visitor sees it”.
- Sections: information, hours, amenities, photos, offers, bookings, my requests.
- Make clear which edits **appear immediately** and which **are reviewed before they are published**.

## 2.4 Edit information

Appears immediately for a Premium subscriber:

- Phone numbers
- Website, email, Facebook, Instagram
- Description in Arabic and English

Sent as a review request (for everyone):

- Name in Arabic and English
- Type
- Address
- Ministry of Tourism class

“My requests” shows the status: pending, accepted, rejected, with the decision note.

## 2.5 Hours

- A weekly editor: opening and closing time for each day, and more than one period on the same day is allowed.
- This is what the visitor sees, and what the “Open now” badge is built from.
- Ramadan hours are not shown in this release.

## 2.6 Amenities

- Choose amenities (Wi‑Fi, family section, and others) from the approved list.

## 2.7 Photos

For a Premium subscriber:

- Upload from the camera or the gallery (the image is compressed before upload).
- Set the cover and the logo, and delete the owner’s photos.
- Preview what appears in lists and on the place page.

For a non-subscriber: a card that says “This feature is part of Premium — contact us”, with no upload tools.

## 2.8 Offers

For a Premium subscriber:

- Title, details, optional image, start and end dates (60 days maximum).
- Stop or delete the offer.

For a non-subscriber: the same “Contact us” card.

## 2.9 Request to close the place

- Request removal of the place from the directory. It is reviewed before it is carried out.

## 2.10 Place bookings

- A list of the place’s bookings: name, phone, party size, time, note, status, and whether it has a report.
- **Confirm** or **Reject** (with an optional reason) a booking that is waiting for a reply.
- **Cancel** a confirmed booking. The reason is required.
- **Attended / No-show** from 30 minutes before the time until 3 days after it.
- **Fake booking report** with a reason (once per booking).

## 2.11 Booking settings

- Turn receiving bookings on or off.
- Maximum party size.
- Minimum notice before the time.
- Hours during which the place replies to requests.
- Periods in which a booking is not accepted.

## 2.12 Owner notifications

- New booking, reply window started, cancelled by the visitor, and a new report.
- The same notification list, and it opens the related booking screen.

---

# 3. Summary of what exists today

This section summarizes what is ready today on the website and in the APIs, and the fields that will appear on the screens above. The app is built on the staging environment. Anything listed here as “missing” or as a “question” is not an extra screen we are promising before it is agreed.

## Part one: Visitors

### Summary

- The directory (places, areas, amenities, hours, photos, offers, featured places, events) can be read without signing in.
- Booking has no payment and requires sign-in.
- Still missing for the visitor as a finished product: submitting a rating as a visitor, a profile table, phone-number verification, favorites, and a suggestions screen separate from the contact form.
- Public data is thin: 920 places, 125 with a phone, 18 with a star rating, 4 featured, and 2 active offers. Screens are designed so they stay clear when there is no photo, phone, or rating.

### What is available

**Connection.** Requests go to Supabase. Public reads use a public key. After sign-in, the user token is attached. Each user sees only what their permissions allow. Errors are read from the status code in the response, not from the HTTP status alone. Photos are public URLs with a thumbnail. The time zone is Asia/Damascus.

**Directory fields the visitor sees**

| Data | Main fields on screen |
|---|---|
| Place | Arabic/English name, type (restaurant, fast food, café, hotel, guesthouse, hostel, motel), status, area, address, coordinates, phones, website, email, Facebook, Instagram, description, cuisines, hours text, stars, tourism class, verification date |
| Area | Arabic/English name and location |
| Amenity | Code and name in both languages |
| Hours | Day (0 = Sunday), open, close. A Ramadan season exists in the data and is not shown now |
| Photo | File, thumbnail, order, whether it is the cover, whether it is the logo |
| Offer | Title and details in both languages, start, end, image |
| Featured now | Place id and type only; the name and photo come from the place record |
| Event | Title, venue name, start, end, status, poster, when it becomes visible |
| Rating | A count and an aggregated score. The stars on the page today are a hotel class or a map rating, not visitor reviews |

**Account.** Sign-in on the owners’ website today is email and password. The privacy policy describes a 6-digit code by email for the app. The final method is still a question. Account deletion exists and is required by the stores. Booking requires a confirmed email or phone, that the user is not banned, and that the user is not booking at their own place.

**Reporting incorrect information.** The backend accepts a report (`report`) after the phone is confirmed. The website does not show a report button; the visitor uses “Contact us”. Whether the app includes a report screen is still an open question.

**Booking from the visitor side — fields**

- Availability: whether it is open, maximum party size, slot length in minutes, day horizon, last date, minimum notice, reply hours, closed periods, whether the place is replying now, the next reply time, and confirmation minutes.
- Create a booking: name (2–80 characters), phone, party size, time, a note of up to 300 characters, and an optional offer. No payment.
- Limits: 3 open bookings, and 4 requests per hour.
- Statuses: pending, awaiting reply, confirmed, rejected, completed, cancelled by the visitor, cancelled by the place, attended, no-show.
- Ban: 15 days, then 45, then permanent.
- Visitor notifications: confirmed, rejected, reply window ended, cancelled by the place, a report against them, the report decision, ban started, ban lifted.

**Contact — fields:** name (2–80), email or phone, request type (general, add a place, partnership, other), message (10–3000). It is sent to the team’s email and is not stored in the directory database.

**Links.** A place page has a stable link that can open the app. Each place also has a share image.

### What is missing or deferred

Urgent before design is closed:

- A profile table (at least name and phone), because registration and booking depend on it.
- Phone notifications: the list and the badge are ready to design; sending the notification itself is built with the release, and the copy is a first draft.
- Server-side search (text, category, area, sort, pages) so the full directory is not loaded on the phone.

Not urgent:

- Favorites: they need a new API, and the save button can wait.
- The featured strip is built by joining the id to the place record; featured-campaign dates are not needed for the visitor now.
- Terms of use later.
- Contact channels stay fixed for now, and later come from the admin panel.
- Server messages are translated inside the app.
- Ramadan hours are not shown.
- “Near me” as a sort comes later. “Open now” is computed from the hours table.

### Questions still open

1. Are visitor ratings in the first release? Stars only, or text as well? How are they reviewed?
2. Are “Recently viewed” and sharing in the first release?
3. Can a visitor report wrong information or a closed place from inside the app?
4. Can a booking be tied to an offer, and do we want an offers banner?
5. Sign-in: email and password, a code by email, or both?
6. Final registration fields: name, phone, year of birth, account type, language?
7. How is the phone number verified, and with which provider?
8. Does the app use the current contact form, and do suggestions go through it?
9. Is a notifications project ready (Firebase and an Apple key)?
10. Which map provider for the app?

### What we need for this part

A test data file (places, photos, offers, and bookings), the visual identity (logo, icon, splash screen, colors, fonts, pattern), fallback images for the categories, a brand guide if one exists, welcome copy and store descriptions, a test visitor account, the map provider, and approval if you want analytics or crash reports (the privacy policy would need an update).

### Requirements that affect the screens

Paid maps instead of free map servers, opening place links inside the app, account deletion and age 16+, Damascus time, and testing notifications and maps from a network in Syria.

## Part two: Place owners

### Summary

- After sign-in, “My place” screens are separate from the visitor.
- Management from the app: photos, offers, hours, bookings.
- Linking is immediate with a `DD-` code, or by a request the team reviews.
- Name, type, and address are reviewed before they are published. Contact details and the description appear immediately for a Premium subscriber.
- Photos, offers, the cover, and the logo are for Premium subscribers only. A non-subscriber sees a “Contact us” card.
- The weekly hours editor is urgent, and it writes the hours table the visitor sees.

### What is available

**Sign-in.** On the website: email, a password of at least 10 characters with letters and digits, the display name, email confirmation, and password recovery. Account deletion is shared with the visitor and does not include staff accounts. The account type (visitor or owner) and the moment it is chosen are still a question.

**Management fields**

| What it does | What the owner enters or sees |
|---|---|
| Link with a code | A code that starts with `DD-`, after the email is confirmed |
| Link without a code | A request, and the team contacts the place |
| My places | The places linked to the account |
| Immediate edit (Premium) | Phones, website, email, Facebook, Instagram, Arabic and English description |
| Reviewed edit | Name, type, address, ministry class. A daily limit on requests |
| Close the place | A removal request |
| My requests | Pending, accepted, rejected, and the decision note |
| Hours | Day, open, close. This is what the app must write |
| Amenities | Add and remove from the amenities list |
| Photos | Upload after compressing the image, cover, logo. Premium only |
| Offers | Title, details, image, start and end with a 60-day limit |
| Subscription | Whether Premium is active, and the start and end dates |

**Booking from the place side — fields**

- Booking list: name, phone, party size, time, note, status, the offer title when one exists, and whether there is a report.
- Confirm; reject with an optional reason; cancel with a required reason.
- Attended or no-show inside a time window: from 30 minutes before the time until 3 days after it.
- Fake report: a reason, once per booking, and a limit of 5 reports for the place within 30 days.
- Settings: receive bookings, maximum party size, minimum notice, reply hours, and periods when booking is blocked.
- Place notifications: new booking, reply window started, cancelled by the visitor, new report.

**Contact.** The same form as the visitor, suitable for requesting a subscription or for adding a place that does not exist (request type: add a place, or partnership). Using the same link from the app still needs confirmation.

### What is missing or deferred

Urgent:

- A weekly hours editor that writes the structured hours table, not the free-text field used on the owners’ website today (for example `Mo-Su 09:00-24:00`). Free text does not update the visitor’s hours table automatically.
- The profile table, as for the visitor.
- Notifications for the bookings inbox.

Not urgent:

- Terms of use.
- Making WhatsApp, email, and social accounts editable from the admin panel.
- Translating error messages.
- Not showing Ramadan hours in the editor for now.

### Questions still open

1. The sign-in method, and is the owner account the same account as the visitor?
2. Is the account type chosen at registration, or after a place is linked?
3. Does the owner need phone verification, and how?
4. Does the app send a subscription request or “add my place” through the current contact form?
5. Is the phone notifications project ready?
6. Is a screen with the Premium end date enough, without a payment history?

### What we need for this part

Test data that includes a linked place, photos, offers, and bookings; an owner account without Premium and a Premium owner account; a test place with a `DD-` code; and the same visual identity as the visitor screens.

### Requirements that affect the screens

Compress images on the device before upload, camera and gallery permission, booking notifications, and Damascus time for reply hours and appointments.
