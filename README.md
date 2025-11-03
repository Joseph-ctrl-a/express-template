# Express Backend Template

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Docs](https://img.shields.io/badge/docs-available-blue.svg)

A modular, dependency-injected Express + Mongoose backend boilerplate with automatic route loading, centralized helper utilities, and full JSDoc documentation.

This template is designed to let you start new projects quickly — just clone, update your `.env`, and start building.

---

## Features

- Express + Mongoose for a production-ready backend.
- Centralized `helperObject` system for response, error, middleware, and route handling.
- Dependency injection for controllers.
- Auto-loading routes and middleware.
- Zod-based validation.
- Full JSDoc documentation throughout the codebase.
- Environment-ready setup with `.env`.

---

## Important

Create your own .env
Add DB_URL= **Your Own DB URL**
Add PORT= **What port you want to use** (Default 5000)

## Installation

```bash
git clone https://github.com/<yourusername>/express-backend-template.git
cd express-backend-template
npm install
cp .env.example .env
```

## Start Dev Server

npm run dev

## Run in Production

npm start

## Folder Structure

controllers/ # Business logic (injected via helpers)
db/ # MongoDB connection and models
loaders/ # Startup logic (routes, DB, middleware)
middleware/ # Global Express middleware
operations/ # Core reusable modules (error, response, route, etc.)
routes/ # Express route definitions
utils/ # Utility functions (error, filtering, controller utils)
validators/ # Zod schemas for input validation
helpers.js # Centralized helper factory
server.js # Main entry point

## Author

**Joseph Ogbomo**
Backend Developer — Dublin City University
LinkedIn: www.linkedin.com/in/joseph-ogbomo-424160326
GitHub: https://github.com/Joseph-ctrl-a

## License

This project is licensed under the MIT License.
See the LICENSE
file for details.
