import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

function App() {
  // Task 1 & 2 State
  const [apiStatus, setApiStatus] = useState('');

  // Task 3 & 4 States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [protectedMsg, setProtectedMsg] = useState('');

  // Task 5 States
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // Task 6 States
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => setApiStatus(data.message));

    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    fetchTasks();

    return () => socket.off('receive_message');
  }, []);

  const handleSignup = async () => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message);
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      alert('Login Successful!');
    } else {
      alert(data.message);
    }
  };

  const accessProtectedRoute = async () => {
    const res = await fetch('http://localhost:5000/api/protected/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setProtectedMsg(data.message);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      const messageData = {
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  const fetchTasks = async () => {
    const query = `{ getTasks { id title completed } }`;
    const res = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const result = await res.json();
    setTasks(result.data.getTasks);
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    const mutation = `mutation { addTask(title: "${taskTitle}") { id title completed } }`;
    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation })
    });
    setTaskTitle('');
    fetchTasks();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ Full-Stack Developer Dashboard</h1>
        <p style={styles.subtitle}>All 6 Tasks Integrated into One Unified App</p>
      </header>

      <div style={styles.grid}>
        {/* --- TASK 1 & 2 CARD --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.badgeBlue}>Level 1</span>
            <h3>1 & 2. REST API Connectivity</h3>
          </div>
          <p style={styles.cardText}>Express Backend & React Link Status:</p>
          <div style={styles.statusBox}>
            🟢 {apiStatus || 'Connecting to backend...'}
          </div>
        </div>

        {/* --- TASK 3 & 4 CARD --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.badgeOrange}>Level 2</span>
            <h3>3 & 4. JWT Auth & Protected Routes</h3>
          </div>
          {!token ? (
            <div>
              <div style={styles.inputGroup}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.btnRow}>
                <button onClick={handleSignup} style={styles.btnSecondary}>Sign Up</button>
                <button onClick={handleLogin} style={styles.btnPrimary}>Log In</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={styles.successBanner}>✅ Authenticated via JWT Token</div>
              <button onClick={accessProtectedRoute} style={{ ...styles.btnPrimary, width: '100%', marginTop: '10px' }}>
                Test Protected Route
              </button>
              {protectedMsg && <p style={styles.protectedResponse}>🔒 {protectedMsg}</p>}
            </div>
          )}
        </div>

        {/* --- TASK 5 CARD --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.badgePurple}>Level 3</span>
            <h3>5. Socket.io Live Chat</h3>
          </div>
          <div style={styles.chatBox}>
            {messageList.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>No messages yet...</p>
            ) : (
              messageList.map((msg, index) => (
                <div key={index} style={styles.chatBubble}>
                  <span>{msg.message}</span>
                  <span style={styles.chatTime}>{msg.time}</span>
                </div>
              ))
            )}
          </div>
          <div style={styles.inputRow}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
              style={styles.inputFlex} 
            />
            <button onClick={sendMessage} style={styles.btnPrimary}>Send</button>
          </div>
        </div>

        {/* --- TASK 6 CARD --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.badgePurple}>Level 3</span>
            <h3>6. GraphQL API Tasks</h3>
          </div>
          <div style={styles.inputRow}>
            <input 
              type="text" 
              placeholder="New Task Title..." 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)} 
              style={styles.inputFlex} 
            />
            <button onClick={handleAddTask} style={styles.btnPrimary}>Add Task</button>
          </div>
          <ul style={styles.taskList}>
            {tasks.map(t => (
              <li key={t.id} style={styles.taskItem}>
                <span>{t.title}</span>
                <span style={t.completed ? styles.badgeSuccess : styles.badgePending}>
                  {t.completed ? 'Done' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Inline Styling Object (Fixed 2 Cards per Row Layout)
const styles = {
  page: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#f8fafc'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#38bdf8',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Row එකකට Cards 2ක් පමණක් සිටින ලෙස සකසා ඇත
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    border: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  cardText: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  statusBox: {
    backgroundColor: '#0f172a',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#4ade80',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: '1px solid #1e293b'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '14px'
  },
  input: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    padding: '10px 14px',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem'
  },
  inputFlex: {
    flex: 1,
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    padding: '10px 14px',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '14px'
  },
  btnRow: {
    display: 'flex',
    gap: '10px'
  },
  btnPrimary: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSecondary: {
    backgroundColor: '#334155',
    color: '#f8fafc',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  successBanner: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    color: '#4ade80',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '600',
    border: '1px solid rgba(74, 222, 128, 0.2)'
  },
  protectedResponse: {
    color: '#38bdf8',
    fontSize: '0.85rem',
    marginTop: '10px',
    wordBreak: 'break-word'
  },
  chatBox: {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '12px',
    height: '140px',
    overflowY: 'auto',
    marginBottom: '12px',
    border: '1px solid #334155'
  },
  chatBubble: {
    backgroundColor: '#0284c7',
    padding: '8px 12px',
    borderRadius: '12px 12px 2px 12px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '85%',
    marginLeft: 'auto',
    fontSize: '0.9rem'
  },
  chatTime: {
    fontSize: '0.7rem',
    color: '#e0f2fe',
    marginLeft: '10px'
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  taskItem: {
    backgroundColor: '#0f172a',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    border: '1px solid #334155'
  },
  badgeBlue: { backgroundColor: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  badgeOrange: { backgroundColor: '#c2410c', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  badgePurple: { backgroundColor: '#6d28d9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  badgeSuccess: { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' },
  badgePending: { backgroundColor: 'rgba(251, 146, 60, 0.2)', color: '#fb923c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }
};

export default App;
