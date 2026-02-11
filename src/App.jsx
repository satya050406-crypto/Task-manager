import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './index.css';

const socket = io(`http://${window.location.hostname}:5577`);

function App() {
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [userName] = useState(`User_${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    socket.on('init_data', (data) => {
      setTasks(data.tasks);
      setMessages(data.messages);
    });

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('task_added', (task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    return () => socket.off();
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    socket.emit('add_task', taskInput);
    setTaskInput('');
  };

  const toggleTask = (task) => {
    socket.emit('update_task', { ...task, completed: !task.completed });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit('send_message', { text: chatInput, user: userName });
    setChatInput('');
  };

  return (
    <div className="app-container">
      {/* Task List Section */}
      <div className="glass-panel task-section animate-in">
        <div className="panel-header">
          <h2>Team Tasks</h2>
          <form onSubmit={addTask} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Add a new task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <div className="scroll-area">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                marginBottom: '10px',
                padding: '15px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                border: task.completed ? '1px solid var(--accent-blue)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: task.completed ? 'var(--accent-blue)' : 'transparent'
              }}>
                {task.completed && <span style={{ color: 'black', fontSize: '12px' }}>✓</span>}
              </div>
              <span style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-dim)' : 'white'
              }}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box Section */}
      <div className="glass-panel chat-section animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="panel-header">
          <h2>Team Chat</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Logged as: {userName}</span>
        </div>
        <div className="scroll-area">
          {messages.map((msg) => (
            <div key={msg.id} style={{
              marginBottom: '15px',
              textAlign: msg.user === userName ? 'right' : 'left'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                {msg.user} • {msg.time}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: '15px',
                background: msg.user === userName ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'rgba(255,255,255,0.05)',
                color: 'white',
                maxWidth: '80%',
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>
            </div>
          ))
          }
        </div >
        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Type message..."
              style={{ flex: 1 }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div >
    </div >
  );
}

export default App;
