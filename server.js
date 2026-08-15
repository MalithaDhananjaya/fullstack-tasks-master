const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'mysecretkey123';

// In-Memory Database
let users = [];
let tasksList = [
  { id: '1', title: 'Learn React & Node', completed: true },
  { id: '2', title: 'Master GraphQL & WebSockets', completed: false }
];

// --- TASK 1 & 2: BASIC EXPRESS REST API ---
app.get('/api/status', (req, res) => {
  res.json({ message: 'Task 1 & 2: Express Server & CORS Working Successfully!' });
});

// --- TASK 3: JWT SIGNUP & LOGIN ---
app.post('/api/auth/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  users.push({ username, password });
  res.json({ message: 'Signup Successful! You can login now.' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, message: 'Login Successful!' });
  }
  res.status(400).json({ message: 'Invalid credentials' });
});

// --- TASK 4: JWT PROTECTED ROUTE ROUTE MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  try {
    const verified = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

app.get('/api/protected/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! Task 4: Protected Data Accessed Successfully.` });
});

// --- TASK 6: GRAPHQL API (SCHEMA & RESOLVERS) ---
const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }
  type Query {
    getTasks: [Task]
  }
  type Mutation {
    addTask(title: String!): Task
  }
`);

const root = {
  getTasks: () => tasksList,
  addTask: ({ title }) => {
    const newTask = { id: String(tasksList.length + 1), title, completed: false };
    tasksList.push(newTask);
    return newTask;
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// --- TASK 5: SOCKET.IO WEBSOCKETS SERVER ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Master Server running on http://localhost:${PORT}`));