# Complaint Management System

A modern, full-stack complaint management system with role-based authentication.

## Tech Stack

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Features

### Module 1: Authentication
- Signup and Login for Admin, User, and Department roles
- JWT-based authentication
- Beautiful, modern UI design

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=complaint_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Create MySQL database:
```sql
CREATE DATABASE complaint_management;
```

5. Start the server:
```bash
npm start
```

The backend will automatically create the necessary tables on first run.

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password, role, department_name? }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

## User Roles

- **Admin**: System administrator
- **User**: Regular user who can submit complaints
- **Department**: Department representative who handles complaints

## Project Structure

```
CMS/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   └── Dashboard/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

