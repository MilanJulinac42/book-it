# Book-It API

This is a mini-project built with NestJS and Prisma, designed to simulate a booking system. The application allows users to register, log in, view available services, and book them using a points-based system.

---

### **Key Features**

* Authentication: Secure user registration and login using JSON Web Tokens (JWT).
* Business Logic: The system checks if a user has sufficient points and if the service has available capacity before a booking is made.
* Idempotency: The POST /bookings endpoint is idempotent, ensuring that a request, even if sent multiple times, only results in a single booking and point deduction.
* Automated Data Generation: Upon a successful booking, the API generates ICS and WhatsApp payloads for notifications.
* Security: Implemented rate limiting to protect against brute-force attacks.

---

### **Tech Stack**

* Backend: NestJS
* Database: PostgreSQL
* ORM: Prisma
* Validation: class-validator
* Authentication: JWT
* Password Hashing: bcryptjs
* Rate Limiting: @nestjs/throttler

---

#### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:MilanJulinac42/book-it.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Env file**
  ```bash
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
    JWT_SECRET="randomkey"
    THROTTLE_TTL=60
    THROTTLE_LIMIT=10
  ```

4.  **Run migrations and seed the database:**
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```
    *Note: Adjust the commands if they are different in your `package.json` file.*

5.  **Start the application:**
    ```bash
    npm run start:dev
    ```

---

### **API Endpoints**

* `POST /api/auth/register` - Registers a new user.
* `POST /api/auth/login` - Logs in a user and returns a JWT.
* `GET /api/auth/me` - Returns information about the currently authenticated user.
* `GET /api/services` - Returns a list of all available services.
* `POST /api/bookings` - Creates a new booking.
* `GET /api/bookings/:id/ics` - Downloads an ICS calendar file for a specific booking.

---
