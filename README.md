# Project Documentation

## Project Overview
This project is a quiz application designed to provide users with a platform to take quizzes on various topics, track their progress, and view their scores.

## Features
- User authentication for secure access
- Various quiz categories
- Timer for each quiz
- Score tracking and user progress

## Tech Stack
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Project Structure
```
├── client         # Frontend code
├── server         # Backend code
├── README.md      # Documentation
```

## Getting Started Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/TharushaAkash/quiz_front.git
   ```
2. Navigate to the `client` directory and install dependencies:
   ```bash
   cd client
   npm install
   ```
3. Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
4. Start the development servers.

## Available Scripts
- **For the client:**
  - `npm start` - Starts the frontend application.
- **For the server:**
  - `npm run dev` - Runs the backend in development mode.

## Authentication Details
Use the following credentials to log in:
- Username: testuser
- Password: Password123

## Routes
- `/api/quizzes` - Get all quizzes
- `/api/users` - User authentication

## Live Site
Check out the live site at [quizem.netlify.app](https://quizem.netlify.app/)