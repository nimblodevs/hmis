require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/icd10', require('./routes/icd'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/walkins', require('./routes/walkins'));

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('HMS API is running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
