# MBTI Personality Test Application

A full-stack web application for personality testing with user authentication and result storage.

![Landing Page](landing_page.png)

## Features

- User authentication (register, login, logout)
- Personality test based on MBTI framework
- Result storage in MySQL database
- User dashboard to view test history
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (>= 14.x)
- MySQL Server
- npm or yarn

## Installation

1. Make sure you are in the Source_Code directory
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```
   # JWT Secret (used for authentication)
   JWT_SECRET=your_jwt_secret_here

   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=mbti_db

   # Server Configuration
   PORT=3000
   ```

4. Create a MySQL database named `mbti_db` (or whatever you specified in your .env file)

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm run build
npm start
```

## Database Schema

The application uses two main tables:

### users

- id (INT, PRIMARY KEY)
- username (VARCHAR)
- email (VARCHAR)
- password (VARCHAR, hashed)
- created_at (TIMESTAMP)

### test_results

- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY to users.id)
- result_type (VARCHAR) - The MBTI personality type (e.g., "INTJ")
- score (JSON) - Detailed scores for each dimension
- created_at (TIMESTAMP)

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Log in a user
- GET /api/auth/profile - Get the current user's profile (protected)

### Personality Test

- GET /api/personality/results - Get all test results for the current user (protected)
- POST /api/personality/results - Save a new test result (protected)
- GET /api/personality/results/:id - Get a specific test result (protected)

## License

MIT
