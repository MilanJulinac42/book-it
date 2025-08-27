# Book-It API

This is a mini-project built with NestJS and Prisma, designed to simulate a booking system. The application allows users to register, log in, view available services, and book them using a points-based system.

---

### **Key Features**

* Authentication: Secure user registration and login using JSON Web Tokens (JWT).
* Business Logic: The system checks if a user has sufficient points and if the service has available capacity before a booking is made.
* Idempotency: The POST /bookings endpoint is idempotent, ensuring that a request, even if sent multiple times, only results in a single booking and point deduction.
* Automated Data Generation: Upon a successful booking, the API generates ICS and WhatsApp payloads for notifications.
* Security: Implemented rate limiting to protect against brute-force attacks.
* Unit tests

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

5.  **Start the application:**
    ```bash
    npm run start:dev
    ```

---

#### **Testing**

 ```npm run test```

### **API Endpoints**

* `POST /api/auth/register` - Registers a new user.
* `POST /api/auth/login` - Logs in a user and returns a JWT.
* `GET /api/auth/me` - Returns information about the currently authenticated user.
* `GET /api/services` - Returns a list of all available services.
* `POST /api/bookings` - Creates a new booking.
* `GET /api/bookings/:id/ics` - Downloads an ICS calendar file for a specific booking.

---

### **Design Decisions & Trade-offs**

* NestJS & TypeScript: The core API was built using NestJS and TypeScript. This decision was made to leverage NestJS's modular architecture, built-in dependency injection, and clean separation of concerns (controllers, services, modules). TypeScript was used to ensure type safety, which significantly reduces bugs and improves code clarity and maintainability.

* Prisma ORM: Prisma was chosen as the ORM for its developer-friendly schema definition and type-safe queries. It simplifies database migrations and data modeling, allowing for rapid development while maintaining a clear and structured database layer.

* Idempotency & Rate Limiting: The POST /bookings endpoint was designed with an idempotency key to prevent double bookings and to ensure points are deducted only once, even if the user or the network retries the request. Basic rate limiting was also implemented to protect against spam or brute-force attacks.

---

### **Next Steps & Future Improvements**

* Frontend using Next.js: With more time, I would create a modern frontend built with Next.js. It would contain pages for user, services, bookings. I would use shadCn for UI and tailwind for aditional styling.

* End-to-End (E2E) Tests: The project would be extended to include E2E tests using a framework like Cypress or Playwright. These tests would simulate real user scenarios, such as the full login-book-logout flow, to ensure that the entire system works correctly from start to finish.

* Improved Error Handling: Implement more detailed and user-friendly error messages on both the API and the frontend to provide a better debugging and user experience.

---

### **TODO**

* Add frontend UI
* Complete all of tests
* Add variables to postman collection
* Short Loom video