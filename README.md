# ⚡ Full-Stack Developer Master Project

This repository contains a full-stack web application integrating **REST API**, **JWT Authentication**, **Socket.io Real-Time WebSockets**, and **GraphQL API**.

---

## 🚀 Built With

- **Frontend:** React.js, Socket.io-Client, CSS3
- **Backend:** Node.js, Express.js, Socket.io, GraphQL, express-graphql, JSON Web Tokens (JWT)

---

## 🛠️ Integrated Tasks Overview

- **Level 1 (Tasks 1 & 2):** Basic Express Server setup & React connectivity via REST API.
- **Level 2 (Tasks 3 & 4):** Secure JWT Sign-up/Login flow & Protected Route Authorization.
- **Level 3 (Task 5):** WebSockets Real-Time Live Chat with `Socket.io`.
- **Level 3 (Task 6):** GraphQL Schema, Queries, and Mutations for Task Management.

---

## 🏃 How to Run the Project Locally

### 1. Start the Backend Server
\```bash
cd fullstack-tasks
npm install
npx nodemon server.js
\```
Server runs on `http://localhost:5000`

### 2. Start the Frontend Client
\```bash
cd client
npm install
npm start
\```
React app opens on `http://localhost:3000`

---

## ⚠️ Disclaimer
This project is intended for educational and portfolio purposes. Ensure environment variables (such as JWT secrets) are never committed to version control — use a `.env` file and add it to `.gitignore`.
