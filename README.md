# Task Manager Chat Box

A real-time, shared team collaboration tool featuring a task list and team chat.

## Features

- **Real-time Synchronization**: Every task update and chat message is synced instantly across all connected staff devices.
- **Glassmorphism UI**: High-end dark aesthetic with smooth animations and blur effects.
- **Shared Persistence**: Data is saved to `data.json`, ensuring no progress is lost on server restarts.
- **Network Ready**: Accessible from any device on the local network.

## How to Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Backend**:
    ```bash
    node server.cjs
    ```

3.  **Start the Frontend**:
    ```bash
    npm run dev -- --host
    ```

4.  **Access the app**:
    - Local: http://localhost:5173
    - Network: http://<your-ip>:5173
