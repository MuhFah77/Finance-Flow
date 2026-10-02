# Finance Flow — MERN Finance Tracker

A full-stack personal finance tracker built with MongoDB, Express, React and Node.
Track income and expenses, organize them by category, and set monthly budgets with
progress bars that warn you when you're close to (or over) the limit.

⚡ Deployment Note

Please note: The backend is hosted on Render's free tier. Because the service may spin down after a period of inactivity, the first request can take a few seconds to load while the server starts up. Subsequent requests should respond normally.

## Features

- **Auth** — JWT-based register/login, passwords hashed with bcrypt
- **Transactions** — create, list, filter, and delete income/expense entries
- **Categories** — custom income/expense categories per user
- **Budgets** — monthly spending limits per category with live progress bars
- **Dashboard** — monthly income/expense/balance summary + spending-by-category breakdown

## Tech stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios

## Project structure

```
finance-tracker/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, category, transaction, budget
│   ├── middleware/         # auth guard, error handler
│   ├── models/             # User, Category, Transaction, Budget
│   ├── routes/
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Backend

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and a real JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env      # points at the backend API
npm install
npm run dev                # starts on http://localhost:5173
```

Open `http://localhost:5173`, register an account, add a few categories
(e.g. "Salary" as income, "Groceries" / "Rent" as expenses), then start logging
transactions and setting budgets.

## API overview

| Method | Route                     | Description                        |
|--------|----------------------------|------------------------------------|
| POST   | `/api/auth/register`      | Create an account                  |
| POST   | `/api/auth/login`         | Log in, returns a JWT              |
| GET    | `/api/auth/me`            | Current user (auth required)       |
| GET    | `/api/categories`         | List categories                    |
| POST   | `/api/categories`         | Create a category                  |
| GET    | `/api/transactions`       | List transactions (filter/paginate)|
| GET    | `/api/transactions/summary` | Monthly income/expense/balance   |
| POST   | `/api/transactions`       | Create a transaction               |
| GET    | `/api/budgets`            | Monthly budgets with spend so far  |
| POST   | `/api/budgets`            | Set a monthly budget               |

All routes except `/auth/register` and `/auth/login` require an
`Authorization: Bearer <token>` header.


