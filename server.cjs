const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data from file or defaults
let data = {
  tasks: [
    { id: '1', text: 'Initialize project', completed: true },
    { id: '2', text: 'Build backend', completed: false },
    { id: '3', text: 'Create UI', completed: false },
  ],
  messages: []
};

if (fs.existsSync(DATA_FILE)) {
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    console.error("Error reading data file, using defaults.");
  }
}

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial data
  socket.emit('init_data', data);

  // Handle Chat Message
  socket.on('send_message', (msg) => {
    const message = {
      id: Date.now().toString(),
      text: msg.text,
      user: msg.user,
      time: new Date().toLocaleTimeString(),
    };
    data.messages.push(message);
    // Keep only last 50 messages
    if (data.messages.length > 50) data.messages.shift();
    saveData();
    io.emit('receive_message', message);
  });

  // Handle Task Update
  socket.on('update_task', (updatedTask) => {
    data.tasks = data.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveData();
    io.emit('task_updated', updatedTask);
  });

  // Handle Add Task
  socket.on('add_task', (newTaskText) => {
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    data.tasks.push(newTask);
    saveData();
    io.emit('task_added', newTask);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 5577;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
