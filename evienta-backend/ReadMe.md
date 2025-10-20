# EventManager — Technical Documentation

---

## 1. Project Overview

**Name:** EventManager (placeholder)

**Purpose:**
> Allow customers to search vendors, view availability, and book services hourly. Vendors manage profiles, availability, bookings and revenue. Admins manage users, vendors, bookings and view aggregated revenue/metrics.

**Primary User Roles:**
- **Customer** — browse, filter vendors, book hourly slots, manage bookings, rate vendors.
- **Vendor** — create profile, set services & hourly rates, manage availability, accept/decline or auto-confirm bookings, view revenue & reports.
- **Admin** — CRUD users/vendors/bookings, audit logs, revenue dashboard, payouts.

---

## 2. High-level Architecture

- **Frontend:** Single Page App (React with TypeScript). Component library + responsive UI. _Optional:_ Next.js if SSR is desired for SEO on vendor pages.
- **Backend:** Node.js (TypeScript) + Express or NestJS (_recommend NestJS for structure_).
- **Database:** PostgreSQL (ACID, relational booking conflicts, time zones). Use Prisma or TypeORM for ORM.
- **File storage:** AWS S3 (vendor images, documents).
- **Auth & Identity:** JWT + Refresh tokens, password reset flows. _Optionally Auth0 for managed auth._
- **Payments:** Stripe (for card payments, refunds, payouts to vendors via Stripe Connect) — or Razorpay for India region.
- **Notifications:** Email (SendGrid/Mailgun), SMS (Twilio) optional, and in-app push/notifications.
- **Background jobs:** Redis + Bull/Queue for sending reminders, invoices, payouts processing.
- **Caching/Realtime:** Redis for caching; WebSockets (Socket.IO) for realtime booking updates, notifications.
- **Hosting:** AWS (EC2/ECS/Lambda) or Vercel for frontend + RDS for db. Containerize with Docker.
- **Monitoring:** Sentry (errors), Prometheus/Grafana or Datadog for metrics, CloudWatch for logs.
- **CI/CD:** GitHub actions for build, test, deploy.

---

## 3. Data Model (Core Tables)

> **Primary keys:** `id` (UUID); **Timestamps:** `created_at`, `updated_at`

| Table                | Fields                                                                                                                                                                                                 |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Users**            | id, role (customer\|vendor\|admin), name, email, phone, password_hash, avatar_url, status (active/suspended), meta (json)                                                                             |
| **VendorProfile**    | id, user_id (FK users), business_name, description, address (structured), city, state, country, geo (lat,lng), categories (tags), services (json)                                                      |
| **Service object**   | { id, title, description, hourly_rate, min_hours, images[] }                                                                                                                                           |
| **AvailabilitySlot** | id, vendor_id, start_datetime, end_datetime, recurrence_rule (optional iCal RRULE), is_blocked (bool)                                                                                                  |
| **Bookings**         | id, customer_id, vendor_id, service_id, start_datetime, end_datetime, hours, hourly_rate, total_amount, status (pending, confirmed, cancelled, completed, rejected), payment_id, notes, created_at      |
| **Payments**         | id, booking_id, amount, currency, provider (Stripe), provider_charge_id, status, refunded_amount                                                                                                       |
| **Reviews**          | id, booking_id, customer_id, vendor_id, rating (1-5), comment, created_at                                                                                                                              |
| **AdminAuditLog**    | id, admin_id, action, details (json), ip, created_at                                                                                                                                                   |
| **Payouts**          | id, vendor_id, amount, provider_payout_id, period_start, period_end, status                                                                                                                            |
| **Notification / Messages** | id, user_id, type, payload (json), read, created_at                                                                                                                                            |

---

## 4. Key Backend Endpoints (RESTful)

> Use HTTPS, versioned API `/api/v1/`

### **Auth**
- `POST /auth/register` — register (customer/vendor)
- `POST /auth/login` — returns access + refresh token
- `POST /auth/refresh`
- `POST /auth/forgot-password` / `POST /auth/reset-password`

### **Customers**
- `GET /vendors` — search with filters (category, date/time, price range, rating, location radius)
- `GET /vendors/:id` — vendor details + services + availability snapshot
- `POST /bookings` — create booking (checks availability, creates pending booking, initiates payment)
- `GET /bookings` — list customer bookings
- `PUT /bookings/:id/cancel` — cancel (policy rules applied)
- `POST /payments/webhook` — payment provider webhooks

### **Vendors**
- `GET /vendor/me` / `PUT /vendor/me`
- `POST /vendor/availability` — create / block slots
- `GET /vendor/bookings` — list bookings
- `PUT /vendor/bookings/:id/confirm|reject`
- `GET /vendor/revenue` — revenue reports (filters)

### **Admin**
- `GET /admin/dashboard` — KPIs: total revenue, active vendors, bookings per day
- `GET /admin/vendors` — CRUD vendors
- `GET /admin/customers` — CRUD customers
- `GET /admin/bookings` — search bookings
- `POST /admin/export` — export CSV / reports
- `GET /admin/audit-logs`

### **Webhooks**
- `POST /webhooks/stripe` — handle payments, disputes, refunds
- `POST /webhooks/calendar` — if integrating Google Calendar for vendor sync

---

## 5. Booking Logic & Concurrency

- Model availability as ranges and use **DB-level transactions** with `SELECT FOR UPDATE` when creating bookings to avoid double-booking.
- Normalize times to **UTC** in DB; accept/display in user local timezone.
- **Conflict detection:** when creating booking, check for any overlapping confirmed/pending bookings or blocked availability slot for the vendor.
- For partial-hour bookings: either round to nearest discrete slot (e.g., granular to 15 minutes) or restrict to full hours (**requirement: hourly — so use whole hours**).

---

## 6. Pricing & Commissions

- **Booking total:** `hourly_rate * hours + taxes + service_fee`
- **Platform commission:** % of booking total or flat fee. Calculate split on payment. Use Stripe Connect for splits to vendors.

---

## 7. UI / UX Flows

- **Customer:** search → vendor card → select service & date/time → booking summary → payment → booking confirmation → reminders → post-event review.
- **Vendor:** sign up → complete profile → set services & hourly rates → set availability → accept bookings (or auto-accept) → receive payment reports → request payout.
- **Admin:** login → dashboard KPIs → user/vendor/booking management → financial reports → audit.

---

## 8. Non-functional Requirements

- **Security:** password hashing (bcrypt), input validation, rate-limiting, XSS/CSRF protections, encryption of sensitive data.
- **Performance:** index DB on date fields, vendor location (PostGIS) for radius queries, caching common queries.
- **Scalability:** stateless app servers, scale DB read replicas, queue workers for heavy jobs.
- **Localization:** timezones, currency formatting, language strings.
- **Accessibility:** WCAG basics; responsive mobile-first UI.

---

## 9. Testing

- **Unit tests:** Jest for backend and frontend.
- **Integration tests:** Supertest for API.
- **End-to-end:** Playwright or Cypress.
- **Security tests:** dependency scanning, Snyk or Dependabot.

---

## 10. DevOps & Deployment

- **Dockerize** services.
- **CI:** run lint → tests → build → deploy to staging.
- **Environments:** dev, staging, production with environment secrets stored in Vault or cloud secret manager.
- **Backups:** daily DB backup to s3 with 30-day retention; test recovery monthly.

---

## 11. Acceptance Criteria (for each feature)

- Search returns accurate vendor list with filters applied.
- Booking cannot be double-booked; overlapping check passes.
- Payment completes and booking status becomes confirmed.
- Vendor revenue report matches payments received (after commission).
- Admin can CRUD all entities and view aggregated revenue.

