# Inkwell 🖋️

**Inkwell** is a RESTful API built with **Express.js + TypeScript** for a blog publishing platform where user posts must be approved by an admin before being published.  
This project demonstrates role-based authentication, approval workflows, and a production-ready modular structure.

---

## 🚀 Features

- ✍️ Blog post workflow (create → review → approve/reject)
- 👤 Role-based access (Admin vs User)
- 🔑 JWT authentication + API Key system
- 🛡️ Admin approval flow for posts
- 📂 Category management (admin-only create)
- 📄 CRUD for posts & categories
- 📦 Modular architecture with controllers, routes, validators, and middlewares
- 📄 Postman collection for the full approval flow

---

## 🧰 Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT for authentication
- API Key middleware

---

## 🌍 Deployment

The API is deployed and accessible at the following link:

🔗 [Live API](https://inkwell-7c0c.onrender.com/)

## 📬 Postman Documentation

A complete Postman collection is available to explore and test the API, including authentication, post approval workflow, and bonus features.

🔗 [View Postman Doc](https://documenter.getpostman.com/view/25611287/2sB3HnMLqu)

## 📂 Project Structure

```
src/
├── admin/           # Admin routes, controllers, validators
├── app/             # App entry (Express setup)
├── auth/            # Authentication logic (JWT, API key, register/login)
├── categories/      # Category controllers, routes, validators
├── config/          # Configuration (env, DB setup)
├── healthCheck/     # Health check endpoints
├── middlewares/     # Auth, role, API key, error handling
├── models/          # Mongoose schemas (Users, Posts, Categories, etc.)
├── posts/           # Post controllers, routes, validators
├── types/express/   # Custom TypeScript types
└── utils/           # Utility functions (helpers)
```

---

## ⚙️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/SoumyaAdhya007/Inkwell.git
   cd Inkwell
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup environment variables:

   ```bash
   cp .env.sample .env
   ```

   Fill in the required values (`MONGO_URI`, `JWT_SECRET`, API key, etc.).

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Build and run for production:
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ API Overview

### 🔐 Auth & API Key

- `POST /auth/register` → Register as a regular user
- `GET /auth/verify-email/:token` → Verify user email
- `POST /auth/login` → Login and receive JWT
- `POST /auth/api-key` → Generate API key
- `GET /auth/refresh-token` → Generate new access and refresh tokens
- `GET /auth/me` → Get current user details

> **Note:** An API key is required for most routes (except login, register, email verification, API key generation, and other public routes).  
> JWT authentication is required for all private routes.

---

### 📝 Posts

- `POST /posts` → Create a blog post (default `status: "pending"`)
- `GET /posts` → List all approved and published posts (public)
- `GET /posts/user/:userId/:id` → Retrieve a specific post by user and post ID
- `GET /posts/slug` → Check slug availability
- `PATCH /posts/slug/:id` → Update slug by post ID
- `GET /posts/:id/comment` → Retrieve all comments for a post
- `POST /posts/:id/comment` → Add a comment to a post
- `GET /posts/:id` → View a published post
- `PUT /posts/:id` → Edit own post (only if not pending)
- `DELETE /posts/:id` → Delete own post (only if approved)

---

### 🔎 Admin Post Review

- `GET /admin/posts` → List all pending posts
- `PUT /admin/posts/:id/approve` → Approve a post
- `PUT /admin/posts/:id/reject` → Reject a post
- `GET /admin/posts/reviewlogs` → Retrieve all post review logs
- `GET /admin/posts/reviewlogs/:id` → Retrieve review logs for a specific post

> Admin routes are protected by **JWT + role-check middleware**.

---

### 🏷️ Categories

- `POST /categories` → Add a new category (admin only)
- `GET /categories` → List all categories
- `GET /categories/:id` → Retrieve a category by ID
- `PUT /categories/:id` → Update a category by ID (admin only)
- `DELETE /categories/:id` → Delete a category by ID (admin only)

---

### 🏥 Health Check

- `GET /healthcheck` → Check the server health status

---

## 🔄 Status Flow

Each post has a `status` field:

- `pending` → Default after submission
- `approved` → Visible publicly
- `rejected` → Can be edited and resubmitted

---

## 🧠 Bonus Features Implemented

- Comment system
- Post review logs (audit trail)
- Slug-based URLs (e.g., `/posts/my-first-post`)
- Featured posts endpoint
- Rate limiting & spam protection

---
