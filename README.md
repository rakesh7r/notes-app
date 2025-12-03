# Offline-First Note Taking App

This is a robust, offline-first note-taking application designed to ensure data consistency and availability regardless of network status. It features a modern React frontend and a scalable Node.js/Express backend backed by PostgreSQL.

## 🚀 How to Run

To start the application in production mode using Docker Compose:

```bash
git clone https://github.com/rakesh7r/notes-app
cd notes-app

```

```bash
podman-compose -f docker-compose.prod.yml up
```

or

```bash
docker-compose -f docker-compose.prod.yml up

```

This will spin up the following services:

- **Client**: The React frontend (Port 3000)
- **Backend**: The Node.js API (Port 4000)
- **Database**: PostgreSQL (Port 5432)

## ✨ Key Features

### 🐘 PostgreSQL Database

The application uses **PostgreSQL** as its primary source of truth for data persistence. It is managed via **Prisma ORM**, ensuring type-safe database interactions and easy schema management.

### 💎 Offline-First Architecture

The app is built with an "Offline-First" philosophy, ensuring a seamless user experience even without an internet connection.

- **Immediate UI Updates**: Changes are immediately reflected in the UI and persisted to **Local Storage** via Redux, providing instant feedback to the user.
- **IndexedDB for Persistence**: Critical operations are backed by **IndexedDB**, allowing for robust data storage that survives browser sessions.

### 🔄 CRDT & Data Consistency

To solve the complex problem of data consistency in distributed systems, the application implements a **CRDT (Conflict-free Replicated Data Type)** inspired synchronization mechanism.

- **Operation Queue**: When the application is offline, user actions (Create, Update, Delete) are captured and stored in an **IndexedDB** based queue (`offline-notes` store).
- **Eventual Consistency**: A dedicated handler (`useCRDTHandler`) monitors the network status. When connectivity is restored, it automatically processes the queued operations, synchronizing the local state with the backend server.
- **Conflict Resolution**: This queue-based approach ensures that operations are applied in the correct order, maintaining data integrity across the client and server.

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, Vite, TypeScript
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker / Podman
