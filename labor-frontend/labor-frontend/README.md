# FindJobs — Labour Registration & Booking Platform

An end-to-end platform where workers (Carpenter, Mistri, Plumber, Electrician,
Driver, Software Engineer, etc.) register with a category, price, and
availability status, and customers can browse, filter, and book them.

**Stack:** Java 8, Spring Boot 2.7, MySQL, Hibernate/JPA, Spring Security + JWT, React 18

---

## 1. Prerequisites

- JDK 8
- Maven 3.6+
- MySQL 8 running locally (or update the connection URL)
- Node.js 16+ and npm

---

## 2. Backend setup (`labor-backend/`)

1. Create the database user/password you want to use, or just make sure MySQL
   is running on `localhost:3306` with a `root` user.
2. Edit `src/main/resources/application.properties`:
   - `spring.datasource.username` / `spring.datasource.password` — your MySQL credentials
   - `jwt.secret` — **replace with your own long random string** before any real deployment
   - The database `labor_registration` will be **auto-created** on first run
     (`createDatabaseIfNotExist=true`), and tables are auto-created by Hibernate
     (`ddl-auto=update`). Categories are seeded automatically from `data.sql`.
3. Run it:
   ```bash
   cd labor-backend
   mvn spring-boot:run
   ```
   The API will be live at `http://localhost:8080`.

### Key API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register as CUSTOMER or WORKER |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/categories` | Public | List all trade categories |
| GET | `/api/workers?categoryId=&availableOnly=&location=` | Public | Search/filter workers |
| GET | `/api/workers/{id}` | Public | Worker details |
| GET | `/api/workers/me` | WORKER | Your own profile |
| PUT | `/api/workers/me` | WORKER | Update price, availability, etc. |
| PATCH | `/api/workers/me/availability` | WORKER | Quick toggle available/unavailable |
| POST | `/api/bookings` | CUSTOMER | Book a worker |
| GET | `/api/bookings/my` | CUSTOMER | Your booking requests |
| GET | `/api/bookings/worker` | WORKER | Incoming booking requests |
| PATCH | `/api/bookings/{id}/status` | Both | Accept/Reject/Complete/Cancel |

Send the JWT from login/register as `Authorization: Bearer <token>` on
protected requests.

---

## 3. Frontend setup (`labor-frontend/`)

```bash
cd labor-frontend
npm install
npm start
```

Runs on `http://localhost:3000` and talks to the backend at `http://localhost:8080/api`
(configured in `src/api/axiosConfig.js`).

---

## 4. How it works

- **Register** as either a **Customer** or a **Worker**. Workers must pick a
  category, set a price + unit (per hour/day/job), and can add experience,
  location, and a description.
- **Browse Workers** (home page) — anyone can filter by category, location,
  and availability, even logged out.
- **Booking flow**: a logged-in Customer clicks "Book Now" on an available
  worker, picks a date and describes the job → this creates a `PENDING`
  booking. The Worker sees it under "Booking Requests" and can **Accept**,
  **Reject**, or later mark it **Completed**. The Customer can **Cancel**
  while it's still pending.
- **Availability toggle** — workers can flip themselves available/unavailable
  any time from "My Profile"; unavailable workers can't be booked.

---

## 5. What's intentionally simple (easy to extend)

- No password reset / email verification flow yet.
- No image/photo upload for worker profiles.
- No payments — pricing is informational (`agreedPrice` is captured on the
  booking but no payment gateway is wired in).
- No admin UI for managing categories yet (the `POST /api/categories` and
  `DELETE /api/categories/{id}` endpoints exist and are ADMIN-only, but there's
  no React admin screen — you can create an admin user directly in the
  `users` table with role `ADMIN` and hit these endpoints via Postman for now).
- No ratings/reviews.

These are all natural next additions once the core flow is working for you.
