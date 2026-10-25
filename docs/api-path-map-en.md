# Old Supabase paths and the NestJS audience paths

The 21 Oct contract is `docs-api/dalil-openapi.yaml`. This API has no URI version. A token from one audience is not accepted by another. The Flutter client is not changed here.

## Auth

| Old path | New path |
|---|---|
| `POST /auth/v1/signup` for a visitor | `POST /client-app/auth/sign-up` |
| `POST /auth/v1/signup` for an owner | `POST /dashboard-owner/auth/sign-up` |
| `POST /auth/v1/verify` | `POST /client-app/auth/verify-email` or `POST /dashboard-owner/auth/verify-email` |
| `POST /auth/v1/token` with a password, visitor | `POST /client-app/auth/sign-in` |
| `POST /auth/v1/token` with a password, owner | `POST /dashboard-owner/auth/sign-in` |
| `POST /auth/v1/token` with a password, staff | `POST /admin-panel/auth/sign-in` |
| `POST /auth/v1/token` refresh | `POST /client-app/auth/refresh` or `POST /dashboard-owner/auth/refresh` |
| `POST /auth/v1/otp` | The same sign-in routes. There is no separate OTP session route |
| `POST /auth/v1/recover` | `POST /client-app/auth/forgot-password` or `POST /dashboard-owner/auth/forgot-password`, then `.../reset-password` |
| `GET /auth/v1/user` | `GET /client-app/auth/me`, `GET /dashboard-owner/auth/me`, or `GET /admin-panel/auth/me` |
| `PUT /auth/v1/user` password | `PATCH /client-app/auth/password`, `PATCH /dashboard-owner/auth/password`, or `PATCH /admin-panel/auth/password` |
| `POST /auth/v1/logout` | `POST /client-app/auth/sign-out`, `POST /dashboard-owner/auth/sign-out`, or `POST /admin-panel/auth/sign-out` |
| Google sign-in through the auth server | `POST /client-app/auth/google` |
| `POST /functions/v1/delete-account` | `POST /client-app/account/delete` or `POST /dashboard-owner/account/delete` |

Sign in with Apple is not in this version.

## Directory

| Old path | New path |
|---|---|
| `GET /rest/v1/places` | `GET /client-app/places`, `GET /client-app/places/counts`, `GET /client-app/places/map`, `GET /client-app/directory` |
| `GET /rest/v1/places` one row | `GET /client-app/places/:id` |
| `GET /rest/v1/areas` | `GET /client-app/areas`. Staff writes are `POST`, `PATCH`, and `DELETE /admin-panel/areas` |
| `GET /rest/v1/amenities` | `GET /dashboard-owner/amenities`. Staff writes are `POST`, `PATCH`, and `DELETE /admin-panel/amenities` |
| `GET /rest/v1/place_amenities` | `GET /client-app/places/:id/amenities` |
| Owner amenity toggle | `POST` and `DELETE /dashboard-owner/places/:id/amenities/:code` |
| `GET /rest/v1/place_hours` | `GET /client-app/places/:id/hours` |
| `POST /rest/v1/rpc/place_open_now` | `GET /client-app/places/:id/open-now` |
| `POST /rest/v1/rpc/set_place_hours` | `PUT /dashboard-owner/places/:id/hours`. Staff, including Ramadan, is `PUT /admin-panel/places/:id/hours` |
| `GET /rest/v1/photos` | `GET /client-app/places/:id/photos` |
| `POST /rest/v1/rpc/set_cover_photo` | `POST /dashboard-owner/places/:id/photos/:photoId/cover` |
| `POST /rest/v1/rpc/set_logo_photo` | `POST /dashboard-owner/places/:id/photos/:photoId/logo` |
| Owner photo upload and delete | `POST /dashboard-owner/places/:id/photos` and `DELETE /dashboard-owner/places/:id/photos/:photoId` |
| Staff photo removal | `DELETE /admin-panel/photos/:id` |
| `GET /rest/v1/offers` | `GET /client-app/offers` and `GET /client-app/places/:id/offers` |
| Owner offer write, stop, delete | `POST /dashboard-owner/places/:id/offers`, `POST .../offers/:offerId/stop`, `DELETE .../offers/:offerId` |
| Staff offer removal | `DELETE /admin-panel/offers/:id` |
| `GET /rest/v1/featured_now` and `GET /rest/v1/featured` | `GET /client-app/places/featured`. Staff writes are `POST`, `PATCH`, and `DELETE /admin-panel/featured` |
| `GET /rest/v1/place_scores` | The public score is on `GET /client-app/places/:id`. There is no scores table route |
| `GET /rest/v1/ratings` and `POST /rest/v1/rpc/decide_held_ratings` | `POST /client-app/places/:id/ratings` and `POST /admin-panel/ratings/decide` |
| `GET /rest/v1/events` and `GET /rest/v1/event_meta` | `GET /client-app/events` and `GET /client-app/events/:id`. Staff writes are `POST`, `PATCH`, and `DELETE /admin-panel/events` |
| Place share | `GET /client-app/places/:id/share` |
| `GET /storage/v1/object/{bucket}/{path}` and the public storage path | Gone. The API receives the file and stores it. Responses carry a read URL |

## Profile, legal, and contact

| Old path | New path |
|---|---|
| `GET /rest/v1/profiles` | `GET /client-app/profile` |
| `POST /rest/v1/rpc/complete_profile` | `POST /client-app/profile/complete` |
| `POST /rest/v1/rpc/update_my_profile` | `PATCH /client-app/profile` |
| Phone code | `POST /client-app/profile/phone/code` and `POST /client-app/profile/phone/verify` |
| `POST /rest/v1/rpc/request_profile_change` and `GET /rest/v1/profile_change_requests` | `POST /client-app/profile/change-requests` |
| `POST /rest/v1/rpc/decide_profile_request` | `POST /admin-panel/profile-change-requests/:id/decide` |
| `POST /rest/v1/rpc/current_legal` and `GET /rest/v1/legal_documents` | `GET /client-app/legal/current` |
| `POST /rest/v1/rpc/my_pending_legal` | `GET /client-app/legal/pending` |
| `POST /rest/v1/rpc/accept_legal` and `POST /rest/v1/legal_acceptances` | `POST /client-app/legal/accept` |
| `POST /rest/v1/rpc/publish_legal` | `POST /admin-panel/legal` |
| `GET /rest/v1/site_contacts` | `GET /client-app/site-contacts`. Staff replace is `PUT /admin-panel/site-contacts` |
| `POST /api/contact` | `POST /client-app/contact` |
| Staff contact inbox | `GET /admin-panel/contact-messages` |
| `POST /rest/v1/suggestions` | `POST /client-app/suggestions`. Staff list, close, and delete are `GET`, `PATCH`, and `DELETE /admin-panel/suggestions` |
| `POST /rest/v1/rpc/staff_user_contacts` | `GET /admin-panel/users/:id/contacts` |
| `POST /rest/v1/user_devices` and `POST /rest/v1/rpc/register_device` | `POST /client-app/devices` or `POST /dashboard-owner/devices` |
| `GET /rest/v1/notifications` | `GET /client-app/notifications` or `GET /dashboard-owner/notifications`, then `POST /client-app/notifications/:id/read` |
| `GET /rest/v1/favorites` style rows | `GET`, `POST`, and `DELETE /client-app/favorites/:placeId` |
| Recent places | `GET /client-app/recent-places` and `POST /client-app/recent-places/:placeId` |

## Owner place and changes

| Old path | New path |
|---|---|
| `GET /rest/v1/place_owners` | `GET /dashboard-owner/places` |
| `GET /rest/v1/place_private` | `GET /dashboard-owner/places/:id` |
| Owner search before a link | `GET /dashboard-owner/places/search` |
| `POST /rest/v1/rpc/claim_with_code` | `POST /dashboard-owner/places/:id/claim-code` |
| Claim that waits for review | `POST /dashboard-owner/places/:id/claims` |
| Immediate owner fields | `PATCH /dashboard-owner/places/:id/immediate` |
| `GET /rest/v1/change_requests` and `POST /api/edits` | `POST` and `GET /dashboard-owner/places/:id/change-requests`. A visitor report is `POST /client-app/places/:id/reports` |
| `POST /rest/v1/rpc/decide_request` | `POST /admin-panel/change-requests/:id/decide` |
| `POST /rest/v1/rpc/request_unlink` | `POST /dashboard-owner/places/:id/unlink` |
| Removal request | `POST /dashboard-owner/places/:id/removal` |
| `POST /rest/v1/rpc/place_code` | `GET /admin-panel/places/:id/code` |
| `POST /rest/v1/rpc/renew_place_code` | `POST /admin-panel/places/:id/renew-code` |
| `POST /rest/v1/rpc/link_owner` | `POST /admin-panel/places/:id/owners` |
| Unlink by staff | `DELETE /admin-panel/places/:id/owners/:userId` |
| `POST /rest/v1/rpc/staff_owner_list` | `GET /admin-panel/owners` |
| Staff create and edit a place | `POST /admin-panel/places` and `PATCH /admin-panel/places/:id` |

## Bookings

| Old path | New path |
|---|---|
| `POST /rest/v1/rpc/booking_availability` | `GET /client-app/places/:id/booking-availability` |
| `POST /rest/v1/rpc/create_booking` | `POST /client-app/bookings` |
| `GET /rest/v1/booking_list` and `GET /rest/v1/bookings` | `GET /client-app/bookings` and `GET /client-app/bookings/:id` |
| `GET /rest/v1/booking_events` | Folded into the booking read. There is no events table route |
| `POST /rest/v1/rpc/cancel_booking` | `POST /client-app/bookings/:id/cancel` |
| `GET /rest/v1/booking_bans` | `GET /client-app/bookings/ban` |
| Owner booking list | `GET /dashboard-owner/places/:id/bookings` |
| `POST /rest/v1/rpc/confirm_booking` | `POST /dashboard-owner/places/:id/bookings/:bookingId/confirm` |
| `POST /rest/v1/rpc/reject_booking` | `POST /dashboard-owner/places/:id/bookings/:bookingId/reject` |
| `POST /rest/v1/rpc/owner_cancel_booking` | `POST /dashboard-owner/places/:id/bookings/:bookingId/cancel` |
| `POST /rest/v1/rpc/mark_booking` | `POST /dashboard-owner/places/:id/bookings/:bookingId/attendance` |
| `POST /rest/v1/rpc/report_fake_booking` | `POST /dashboard-owner/places/:id/bookings/:bookingId/fake-report` |
| `POST /rest/v1/rpc/reply_fake_report` | `POST /client-app/fake-reports/:id/reply` |
| `GET /rest/v1/booking_settings` and `POST /rest/v1/rpc/set_booking_options` | `GET` and `PUT /dashboard-owner/places/:id/booking-settings` |
| `POST /rest/v1/rpc/set_booking_enabled` | `POST /admin-panel/places/:id/booking-enabled` |
| `GET /rest/v1/booking_response_hours` | `POST` and `DELETE /dashboard-owner/places/:id/response-hours`. Staff uses `/admin-panel/places/:id/response-hours` |
| `GET /rest/v1/booking_blackouts` | `POST` and `DELETE /dashboard-owner/places/:id/blackouts`. Staff uses `/admin-panel/places/:id/blackouts` |
| `POST /rest/v1/rpc/decide_fake_report` | `POST /admin-panel/fake-reports/:id/decide` |
| `POST /rest/v1/rpc/lift_booking_ban` | `POST /admin-panel/booking-bans/:id/lift` |
| `POST /rest/v1/rpc/staff_no_show_watch` | `GET /admin-panel/no-show-watch` |

## Payments, staff, and the panel

| Old path | New path |
|---|---|
| `GET /rest/v1/subscriptions` | `POST` and `PATCH /admin-panel/subscriptions` |
| `GET /rest/v1/payments` | `POST /admin-panel/payments` |
| `POST /rest/v1/rpc/place_payments` | `GET /dashboard-owner/places/:id/payments` and `GET /admin-panel/places/:id/payments` |
| `POST /rest/v1/rpc/payment_receipt` | `GET /dashboard-owner/payments/:id/receipt` and `GET /admin-panel/payments/:id/receipt` |
| `POST /rest/v1/rpc/void_payment` | `POST /admin-panel/payments/:id/void` |
| `GET /rest/v1/staff` | `POST` and `GET /admin-panel/staff` |
| `GET /rest/v1/staff_permissions` | No route. There is no permission matrix |
| `GET /rest/v1/audit_log` | `GET /admin-panel/audit-log` |
| `GET /rest/v1/admin_alerts` | `GET /admin-panel/alerts` and `POST /admin-panel/alerts/:id/read` |
| Panel counts | `GET /admin-panel/summary` |

## Website pages

These old paths are not API routes. The site renders the pages. The JSON they need is the client-app directory.

| Old path | Replacement |
|---|---|
| `GET /{section}/{slug}`, `GET /{list}/`, `GET /{list}/{area}/` | `GET /client-app/places`, `GET /client-app/places/:id`, `GET /client-app/directory` |
| `GET /sitemap.xml`, `GET /fallback.json`, `GET /og/{image}` | Not in this API |
