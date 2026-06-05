# 🧑‍💼 Job Board REST API

A production-grade Job Board REST API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Supports 3 roles: **Admin**, **Company**, and **Candidate** — with full authentication, job management, resume uploads, application tracking, and email notifications.

---

## 📁 Project Structure

```
job-board-api/
├── src/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── env.js                 # Environment variables config
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── user/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.routes.js
│   │   ├── job/
│   │   │   ├── job.model.js
│   │   │   ├── job.controller.js
│   │   │   ├── job.service.js
│   │   │   ├── job.routes.js
│   │   │   └── job.validation.js
│   │   └── application/
│   │       ├── application.model.js
│   │       ├── application.controller.js
│   │       ├── application.service.js
│   │       ├── application.routes.js
│   │       └── application.validation.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT protect + role restriction
│   │   ├── error.middleware.js    # Central error handler
│   │   ├── upload.middleware.js   # Multer PDF resume upload
│   │   └── validate.middleware.js # Joi validation runner
│   ├── utils/
│   │   ├── ApiError.js            # Custom error class
│   │   ├── ApiResponse.js         # Standard response wrapper
│   │   ├── sendEmail.js           # Nodemailer email sender
│   │   └── asyncHandler.js        # Async error wrapper
│   ├── routes/
│   │   └── index.js               # Central route mounting
│   └── app.js                     # Express app setup
├── server.js                      # Entry point
├── .env                           # Your secret config (never commit)
├── .env.example                   # Template for team members
├── .gitignore
└── package.json
```

---

## ⚙️ Tech Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | Web framework                 |
| MongoDB Atlas      | Cloud database                |
| Mongoose           | MongoDB object modeling       |
| JWT                | Authentication tokens         |
| Bcryptjs           | Password hashing              |
| Joi                | Request validation            |
| Multer             | File (resume) uploads         |
| Nodemailer         | Email sending                 |
| Helmet             | HTTP security headers         |
| CORS               | Cross-origin resource sharing |
| express-rate-limit | Brute force protection        |
| Swagger UI         | API documentation             |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free)
- [Postman](https://www.postman.com/) for testing

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-board-api.git
cd job-board-api
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

```bash
# Copy the example file
copy .env.example .env       # Windows
cp .env.example .env         # Mac/Linux
```

Then open `.env` and fill in your values (see table below).

---

### 4. Create Uploads Folder

```bash
mkdir uploads
mkdir uploads/resumes
```

> This is created automatically when you run the server — but you can create it manually too.

---

### 5. Run the Server

```bash
# Development mode (auto-restarts on file change)
npm run dev

# Production mode
npm start
```

You should see:

```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running on http://localhost:5000
📄 API Docs at http://localhost:5000/api-docs
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable                 | Description                     | Example                                        |
| ------------------------ | ------------------------------- | ---------------------------------------------- |
| `PORT`                   | Port the server runs on         | `5000`                                         |
| `NODE_ENV`               | Environment mode                | `development`                                  |
| `MONGO_URI`              | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.net/jobboard` |
| `JWT_ACCESS_SECRET`      | Secret key for access tokens    | `mysupersecretkey123`                          |
| `JWT_REFRESH_SECRET`     | Secret key for refresh tokens   | `myrefreshsecretkey456`                        |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry             | `15m`                                          |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry            | `7d`                                           |
| `EMAIL_HOST`             | SMTP host                       | `smtp.gmail.com`                               |
| `EMAIL_PORT`             | SMTP port                       | `587`                                          |
| `EMAIL_USER`             | Your email address              | `you@gmail.com`                                |
| `EMAIL_PASS`             | Gmail App Password              | `abcd efgh ijkl mnop`                          |
| `EMAIL_FROM`             | Sender name/email               | `no-reply@jobboard.com`                        |
| `CLIENT_URL`             | Frontend URL (for CORS)         | `http://localhost:3000`                        |

> **Important:** Never commit your `.env` file to GitHub. It's already in `.gitignore`.

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

---

## 👥 User Roles

| Role          | What They Can Do                                             |
| ------------- | ------------------------------------------------------------ |
| **Candidate** | Register, browse jobs, apply with resume, track applications |
| **Company**   | Post jobs, view applicants, update application status        |
| **Admin**     | Manage all users, all jobs, view stats                       |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

---

### 🔐 Auth Routes

| Method | Endpoint                | Description             | Auth Required |
| ------ | ----------------------- | ----------------------- | ------------- |
| POST   | `/auth/register`        | Register new user       | ❌            |
| POST   | `/auth/login`           | Login user              | ❌            |
| POST   | `/auth/logout`          | Logout user             | ✅ Any        |
| POST   | `/auth/refresh-token`   | Get new access token    | ❌            |
| POST   | `/auth/forgot-password` | Send OTP to email       | ❌            |
| POST   | `/auth/reset-password`  | Reset password with OTP | ❌            |

---

### 👤 User Routes

| Method | Endpoint                   | Description              | Auth Required |
| ------ | -------------------------- | ------------------------ | ------------- |
| GET    | `/users/me`                | Get my profile           | ✅ Any        |
| PATCH  | `/users/me`                | Update my profile        | ✅ Any        |
| GET    | `/users`                   | Get all users            | ✅ Admin      |
| PATCH  | `/users/:id/toggle-status` | Activate/deactivate user | ✅ Admin      |
| DELETE | `/users/:id`               | Delete user              | ✅ Admin      |

---

### 💼 Job Routes

| Method | Endpoint      | Description                      | Auth Required    |
| ------ | ------------- | -------------------------------- | ---------------- |
| GET    | `/jobs`       | Get all open jobs (with filters) | ❌               |
| GET    | `/jobs/:id`   | Get single job                   | ❌               |
| GET    | `/jobs/stats` | Get job & application stats      | ✅ Admin         |
| POST   | `/jobs`       | Create new job                   | ✅ Company       |
| PATCH  | `/jobs/:id`   | Update job                       | ✅ Company/Admin |
| DELETE | `/jobs/:id`   | Delete job                       | ✅ Company/Admin |

#### Job Search & Filter Query Params

```
GET /api/jobs?search=developer&location=NewYork&jobType=full-time&category=Engineering&salaryMin=50000&salaryMax=100000&page=1&limit=10&sortBy=createdAt&order=desc
```

| Param       | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `search`    | string | Full-text search on title/description              |
| `location`  | string | Filter by location                                 |
| `jobType`   | string | full-time, part-time, remote, internship, contract |
| `category`  | string | Job category                                       |
| `salaryMin` | number | Minimum salary                                     |
| `salaryMax` | number | Maximum salary                                     |
| `page`      | number | Page number (default: 1)                           |
| `limit`     | number | Results per page (default: 10)                     |
| `sortBy`    | string | Field to sort by (default: createdAt)              |
| `order`     | string | asc or desc (default: desc)                        |

---

### 📄 Application Routes

| Method | Endpoint                          | Description                       | Auth Required    |
| ------ | --------------------------------- | --------------------------------- | ---------------- |
| POST   | `/applications/jobs/:jobId/apply` | Apply for a job (with resume PDF) | ✅ Candidate     |
| GET    | `/applications/my`                | Get my applications               | ✅ Candidate     |
| GET    | `/applications/jobs/:jobId`       | Get all applicants for a job      | ✅ Company/Admin |
| PATCH  | `/applications/:id/status`        | Update application status         | ✅ Company/Admin |

#### Application Status Flow

```
pending → reviewed → accepted → rejected
```

> Candidate receives an email notification on every status change.

---

### 🏥 Health Check

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| GET    | `/health` | Check if server is running |

---

## 📬 Request & Response Examples

### Register a Candidate

**Request:**

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "candidate"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "6661234abcd...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "candidate"
    },
    "accessToken": "eyJhbGci..."
  }
}
```

---

### Register a Company

**Request:**

```json
POST /api/auth/register
{
  "name": "Jane Smith",
  "email": "jane@techcorp.com",
  "password": "123456",
  "role": "company",
  "companyName": "Tech Corp",
  "companyWebsite": "https://techcorp.com"
}
```

---

### Create a Job

**Request:**

```json
POST /api/jobs
Authorization: Bearer <accessToken>

{
  "title": "Backend Developer",
  "description": "We are looking for a skilled Node.js backend developer with 2+ years experience.",
  "location": "New York",
  "jobType": "full-time",
  "category": "Engineering",
  "salaryMin": 50000,
  "salaryMax": 90000,
  "skills": ["Node.js", "MongoDB", "Express"]
}
```

---

### Apply for a Job

```
POST /api/applications/jobs/:jobId/apply
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Body (form-data):
  resume     → [PDF file]
  coverLetter → "I am interested in this position..."
```

---

### Update Application Status

**Request:**

```json
PATCH /api/applications/:id/status
Authorization: Bearer <accessToken>

{
  "status": "accepted"
}
```

---

## 🔒 Security Features

| Feature           | Implementation                                  |
| ----------------- | ----------------------------------------------- |
| Password Hashing  | bcryptjs with 12 salt rounds                    |
| JWT Auth          | Access token (15min) + Refresh token (7 days)   |
| HTTP-only Cookies | Refresh token stored in cookie                  |
| Rate Limiting     | 10 requests per 15 min on auth routes           |
| Helmet            | 15+ security HTTP headers                       |
| CORS              | Configured for specific frontend origin         |
| Input Validation  | Joi schemas on all routes                       |
| OTP Hashing       | SHA-256 hashed before saving to DB              |
| Role-based Access | Middleware checks role on every protected route |

---

## 📊 MongoDB Aggregation — Stats Endpoint

```
GET /api/jobs/stats
Authorization: Bearer <adminAccessToken>
```

Returns:

- Total jobs per company
- Total applications per company
- Top 5 most applied jobs

---

## 📦 NPM Scripts

| Command       | Description                             |
| ------------- | --------------------------------------- |
| `npm run dev` | Start server with nodemon (development) |
| `npm start`   | Start server with node (production)     |

---

## 🧪 Testing with Postman

1. Import all requests into Postman
2. Create environment with `baseUrl = http://localhost:5000/api`
3. After login, save the `accessToken` using the Tests script:

```javascript
const res = pm.response.json();
if (res.data && res.data.accessToken) {
  pm.environment.set("accessToken", res.data.accessToken);
}
```

4. Use `{{accessToken}}` as Bearer Token in all protected requests

---

## 📄 API Documentation

Swagger UI is available at:

```
http://localhost:5000/api-docs
```

---

## 🐛 Common Errors & Fixes

| Error                                | Cause                | Fix                             |
| ------------------------------------ | -------------------- | ------------------------------- |
| `Email already registered`           | Duplicate email      | Use a different email           |
| `Invalid email or password`          | Wrong credentials    | Check email/password            |
| `Not authorized. No token provided.` | Missing Bearer token | Add Authorization header        |
| `You do not have permission`         | Wrong role           | Login with correct role account |
| `Only PDF files are allowed`         | Wrong file type      | Upload a PDF file               |
| `Token expired`                      | Access token expired | Call `/auth/refresh-token`      |
| `MongoDB connection error`           | Wrong MONGO_URI      | Check `.env` connection string  |

---

## 👨‍💻 Author

**Ali Husnain**  
📧 alihusnaintcf970@gmail.com

---

## 📝 License

This project is licensed under the **MIT License**.

---

> Built with ❤️ using Node.js, Express, and MongoDB
